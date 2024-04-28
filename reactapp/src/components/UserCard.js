import React from "react";
import {Button, Divider,Box, Typography,capitalize} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUserModal from '../components/AddUserModal';

export default function Ucard(props){

    const deleteUser = async(username) => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/delete_user`, {
            method:"POST",
            headers: {'Content-Type':'application/json','access-control-allow-origin':"*"},
            body: JSON.stringify(username)
        })
        const returned_response = await response.json()
        if (returned_response.status_code!=200 && returned_response.status_code!=201 ){
            alert(returned_response.message)
        }else{
            window.location.href = "/user_management"
        }
    }

    return(
        <div class="userCard">

            <Box container sx={{alignItems:"top",display:"flex",flexDirection:'column', height:"100%"}}>
                <div style={{display:"flex",justifyContent:"space-between", padding:"15px 0"}}>
                    <Typography variant="h5" sx={{ textTransform: 'capitalize'}}>
                        {props.data.first_name} {props.data.last_name}
                    </Typography>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                        {props.edit ? <Button color="primary" onClick={()=>{deleteUser(props.data.user_name)}}><DeleteIcon style={{cursor:"pointer"}}/></Button> : null}
                    </div>
                </div>
                <Divider/>
                <div>
                    <p>First Name : {props.data['first_name']}</p>
                    <p>Last Name : {props.data['last_name']}</p>
                    <p>User Name : {props.data['user_name']}</p>
                    <h2>Dashboard Access</h2>
                    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
                        {Object.entries(JSON.parse(props.data['dashboard_access'])).map(([key,value]) =>
                            <div class="alertCard" style={{border:"1px solid #e8e8e8",boxShadow:"5px 5px 5px whitesmoke", display:'flex',flexDirection:"column",padding:"10px",width:"45%"}}>
                                <Typography sx={{fontSize:"18px",marginBottom:"10px",textDecoration:"underline",overflowWrap:"break-word"}}>{capitalize(key)}</Typography>
                                {value.length!=0 ? 
                                    value.map((value,index)=>(
                                        <Typography variant='span' sx={{fontWeight:"bold"}}>{value}</Typography>
                                    ))  
                                :
                                    <Typography variant='span' sx={{fontWeight:"bold"}}>No Permissions</Typography>
                                }
                            </div>
                        )}
                    </div>
                    <Divider/>
                    <h2>Site Access</h2>
                    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
                        {Object.entries(JSON.parse(props.data['site_access'])).map(([key,value]) =>
                            <div class="alertCard" style={{border:"1px solid #e8e8e8",boxShadow:"5px 5px 5px whitesmoke", display:'flex',flexDirection:"column",padding:"10px",width:"45%"}}>
                                <Typography sx={{fontSize:"18px",marginBottom:"10px",textDecoration:"underline",overflowWrap:"break-word"}}>{capitalize(key)}</Typography>
                                {value.length!=0 ? 
                                    value.map((value,index)=>(
                                        <Typography variant='span' sx={{fontWeight:"bold"}}>{value}</Typography>
                                    ))  
                                :
                                    <Typography variant='span' sx={{fontWeight:"bold"}}>No Access</Typography>
                                }
                            </div>
                        )}
                    </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    {props.edit ? <AddUserModal data = {props.data} button={"Edit"}/> : null}
                </div>
            </Box>
        </div>

    )
}