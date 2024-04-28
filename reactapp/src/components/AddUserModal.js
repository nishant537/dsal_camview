import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, Divider } from '@mui/material';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import { json } from 'react-router';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth:"80%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight:"80%",
  overflowY:"scroll"
};  

var dashboard_access = "";
var site_access = {"NCL":["Dudhichua","Jayant","Khadia","Nigahi"],"SECL":["Dipka","Gevra","Kusmunda"]};
// modal for adding a user under "User Management" settings of dashboard
export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let dashboardAccess = JSON.parse(process.env.REACT_APP_DASHBOARD_ACCESS)
  let siteAccess = JSON.parse(process.env.REACT_APP_SITE_ACCESS)

  if (props.data!=null && props.data.user_name=="nishant"){
    // for dashboard access
    for (const [position, [key, value]] of Object.entries(Object.entries(JSON.parse(props.data.dashboard_access)))) {
      JSON.parse(JSON.stringify(value)).forEach( function (arr_value,ind) {
        dashboardAccess["children"][position]['children'][ind]['checked'] = 1
      })
    }

    // // for site access
    for (const [position, [key, value]] of Object.entries(Object.entries(JSON.parse(props.data.site_access)))) {
      JSON.parse(JSON.stringify(value)).forEach( function (arr_value,ind) {
        siteAccess["children"][position]['children'][ind]['checked'] = 1
      })
    }

  }

  
  const onTreeStateChange = (state, event) => {
    let temp = {};
    JSON.parse(process.env.REACT_APP_DASHBOARD_ACCESS)['children'].map((value,index) => {
      temp[value['name']] = []
    })
    if ("children" in state){
        state['children'].map(page => {
          page['children'].map(operation=>{
            if (operation['checked']==1){
                temp[page['name']] = temp[page['name']].concat(operation['name'])
            }
          })
        })
        dashboard_access = temp
    }
  };
  
  const onTreeStateChange1 = (state, event) => {
    let temp = {};
    JSON.parse(process.env.REACT_APP_SITE_ACCESS)['children'].map((value,index) => {
      temp[value['name']] = []
    })
    if ("children" in state){
        state['children'].map(cluster => {
          cluster['children'].map(site=>{
            if (site['checked']==1){
                temp[cluster['name']] = temp[cluster['name']].concat(site['name'])
            }
          })
        })
        site_access = temp
    }
  };


  const [feature, setFeature] = React.useState('intrusion');

  const handleChange = (event) => {
    setFeature(event.target.value);
  };

  

  const onSubmit = async() =>{
    const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/add_user`, {
        method:"POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({"user":JSON.stringify({"type":(props.button=="Edit" ? "edit" : "add") ,"first_name":document.getElementById("first_name").value,"last_name":document.getElementById("last_name").value,"user_name":document.getElementById("user_name").value,"password":document.getElementById("password").value,"dashboard_access":JSON.stringify(dashboard_access),"site_access":JSON.stringify(site_access)})})
    })
    const returned_response = await response.json()
    if (returned_response.status_code!=200 && returned_response.status_code!=201){
        alert(returned_response.message)
    }else{
        window.location.href = "/user_management"
    }
  }

  // nullifying extra buttons
  const EditIcon = (...args) => null;
  const DeleteIcon = (...args) => null;
  const AddFileIcon = (...args) => null;
  const AddFolderIcon = (...args) => null;
  const CancelIcon = (...args) => null;

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" color='primary'>{props.button=="Edit" ? "Edit User" : "+Add User"}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography variant="h3" paddingY={2}>
                Add User
            </Typography>
            
            <Box component="form" sx={{'& .MuiTextField-root': { m: 2, ml:0, width: '25ch' }, }} noValidate autoComplete="off">
                <div>
                    <TextField id="first_name" label="First Name" required defaultValue = {props.data!=null ? props.data.first_name : null}/>
                    <TextField id="last_name" label="Last Name" defaultValue = {props.data!=null ? props.data.last_name : null}/>
                </div>
                <div>
                    <TextField id="user_name" type={"email"} label="Email" required defaultValue = {props.data!=null ? props.data.user_name : null}/>
                    <TextField id="password" label="Password" required defaultValue = {props.data!=null ? props.data.password : null}/>
                </div>

                <div id='dashboard_access' style={{padding:"20px 0",fontSize:"1.3rem"}}>
                  <h4>Provide access to dashboard</h4>
                  <FolderTree
                    data={ dashboardAccess }
                    onChange={ onTreeStateChange }
                    initCheckedStatus='custom'
                    initOpenStatus='custom'
                    iconComponents={{
                      EditIcon,
                      DeleteIcon,
                      AddFileIcon,
                      AddFolderIcon,
                      CancelIcon
                    }}
                  />
                </div>

                <Divider/>

                <div id='site_access' style={{padding:"20px 0",fontSize:"1.3rem"}}>
                  <h4>Provide access to Sites</h4>
                  <FolderTree
                    data={ siteAccess }
                    onChange={ onTreeStateChange1 }
                    initCheckedStatus='custom'
                    initOpenStatus='custom'
                    iconComponents={{
                      EditIcon,
                      DeleteIcon,
                      AddFileIcon,
                      AddFolderIcon,
                      CancelIcon
                    }}
                  />
                </div>
            </Box>

            <Button variant='outlined' onClick={onSubmit}>{props.button=="Edit" ? "Save User" : "Add User"}</Button>
        
        </Box>
      </Modal>
    </div>
  );
}
