import * as React from 'react';
import { Box, Toolbar, Typography, Button, TextField, InputAdornment, IconButton, Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import AddUserModal from '../components/AddUserModal';
import UCard from '../components/UserCard';

const drawerWidth = 240;

function Main(props) {
    const [edit,setEdit] = React.useState(true)
    const [cardData, setCardData] = React.useState([
            {
                "ID": 4,
                "first_name": "Ranajit",
                "last_name": "Sahu",
                "user_name": "Ranajit.sahu@accenture.com",
                "password": "dsal@123",
                "dashboard_access": "{\"provisioning\":[],\"alert_dashboard\":[\"view_alert\"],\"user_management\":[]}",
                "site_access": "{\"NCL\":[\"Dudhichua\",\"Jayant\",\"Khadia\",\"Nigahi\"],\"SECL\":[]}",
                "status": "active",
                "set_status_timestamp": null
            },
            {
                "ID": 215,
                "first_name": "Abhay",
                "last_name": "Tyagi",
                "user_name": "abhay@deepsightlabs.com",
                "password": "dsal@123",
                "dashboard_access": "{\"alert_dashboard\":[\"view_alert\"],\"user_management\":[\"view_user\",\"add_user\",\"delete_user\",\"edit_user\"]}",
                "site_access": "{\"NCL\":[\"Dudhichua\",\"Jayant\",\"Khadia\",\"Nigahi\"],\"SECL\":[\"Dipka\",\"Gevra\",\"Kusmunda\"]}",
                "status": "active",
                "set_status_timestamp": null
            },
]);
    const [loading,setLoading] = React.useState(false)
    const [cluster,setCluster] = React.useState("NCL,SECL")
    const [seed, setSeed] = React.useState("");
    const [exam, setExam] = React.useState('');
    const [date, setDate] = React.useState('');
    const [shift, setShift] = React.useState('');

    const checkSearch = (event) => {
        setSeed(event.target.value.trim())
    }

    let filterList = []
    cardData.map((e,i)=>{
        if (seed!=""){
            if ((!e['first_name'].toLowerCase().indexOf(seed.toLowerCase()) || !e['last_name'].toLowerCase().indexOf(seed.toLowerCase()) || !e['user_name'].toLowerCase().indexOf(seed.toLowerCase()))){
                filterList.push(e)
            }
        }else{
                filterList.push(e)
        }
    })
    
    
    const restoreUsers = async() =>{
        const response = await fetch('https://'+process.env.REACT_APP_PRIVATE_IP+':'+process.env.REACT_APP_PORT+ '/' + process.env.REACT_APP_API_NAME + '/restore_user',{method : "POST"});
        const returned_response = await response.json()
        if (returned_response.status_code!=200 && returned_response.status_code!=201){
            alert(returned_response.message)
        }else{
            window.location.reload()
        }
    }

    if (!loading){
        return(
            <>
                <Box component="main" sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                    <Toolbar />
                    
                    <div>
                        
                        {/* section 1 - header*/}
                        <div id="headerUM">
                            <div style={{display:"flex", alignItems:"center"}}>
                                <Typography variant='h4' sx={{width:'fit-content',mr:4}}>Active Users</Typography>
                                <div style={{display:"flex",padding:"30px 0"}}>
                                    {/* <Button onClick={()=>{setEdit(!edit)}} variant="outlined" color='primary' sx={{marginRight:"20px"}}>{edit ? "Save" : "Edit"} Users</Button> */}
                                    <AddUserModal openDialog={props.openDialog} />
                                    <Button onClick={restoreUsers} variant="outlined" color='primary' sx={{marginLeft:"20px"}}>Restore Users</Button>
                                </div>
                            </div>

                            <Typography variant='h5' sx={{width:'fit-content',mr:4}}>Total Users - {filterList.length}</Typography>
                        </div>
                        <Divider/>
                        
                        {/* section 2 - searchbar*/}
                        <div id='postHeaderUM'>
                            <TextField sx={{marginBottom:"10px"}} id="outlined-search" label="Search User" type="search" onChange={checkSearch} InputProps={{
                                endAdornment: (
                                <InputAdornment>
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                                )
                            }}/>
                            <div id='clusterUMSection'style={{marginBottom:"10px"}} >
                                <FormControl>
                                    <Select
                                        sx={{width:"200px"}}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={exam}
                                        onChange={(e) => {setExam(e.target.value)}}
                                        displayEmpty
                                    >
                                    <MenuItem value=''>Select Exam</MenuItem>
                                    <MenuItem value={'jee'}>JEE MAINS</MenuItem>
                                    <MenuItem value={'boards'}>BOARDS</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <Select
                                    sx={{width:"200px"}}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={date}
                                    onChange={(e) => {setDate(e.target.value)}}
                                    displayEmpty
                                    >
                                    <MenuItem value=''>Select Date</MenuItem>
                                    <MenuItem value={'17-March'}>17 March 2024</MenuItem>
                                    <MenuItem value={'18-March'}>18 March 2024</MenuItem>
                                    <MenuItem value={'19-March'}>19 March 2024</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <Select
                                    sx={{width:"200px"}}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={shift}
                                    onChange={(e) => {setShift(e.target.value)}}
                                    displayEmpty
                                    >
                                    <MenuItem value=''>Select Shift</MenuItem>
                                    <MenuItem value={"Shift 1"}>Shift 1</MenuItem>
                                    <MenuItem value={"Shift 2"}>Shift 2</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div id="userCards">
                            {filterList.map((card) => 
                                <UCard data = {card} edit={edit} filter = {seed} openDialog={props.openDialog}/>
                            )}
                            <div style={{padding:"0px 15px 15px 15px",margin:"15px 0px",display:"flex",flexDirection:'column',width:"30%"}}></div>
                            <div style={{padding:"0px 15px 15px 15px",margin:"15px 0px",display:"flex",flexDirection:'column',width:"30%"}}></div>
                            <div style={{padding:"0px 15px 15px 15px",margin:"15px 0px",display:"flex",flexDirection:'column',width:"30%"}}></div>
                            <div style={{padding:"0px 15px 15px 15px",margin:"15px 0px",display:"flex",flexDirection:'column',width:"30%"}}></div>
                        </div>
                        
                    </div>
                    
                </Box>
            </>
        )
    }
}

export default Main;