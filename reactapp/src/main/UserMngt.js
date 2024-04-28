import * as React from 'react';
import { Box, Toolbar, Typography, Button, TextField, InputAdornment, IconButton, Divider } from '@mui/material';
// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import AddUserModal from '../components/AddUserModal';
import UCard from '../components/UserCard';

const drawerWidth = 240;

function Main(props) {
    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }
    const [edit,setEdit] = React.useState(false)
    const [cardData, setCardData] = React.useState(null);
    const [loading,setLoading] = React.useState(true)
    const [seed, setSeed] = React.useState("");

    console.log(cardData)
    
    React.useEffect(() => {
        users()
    },[])

    const users = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_users`,{method : "GET"});
        const received_data = (await response.json())['data']
        setCardData(received_data)
        setLoading(!loading)
    }

    const checkSearch = (event) => {
        setSeed(event.target.value.trim())
    }

    let filterList;
    if (!loading){
        filterList = []
        cardData.map((e,i)=>{
            if ((!e['first_name'].toLowerCase().indexOf(seed.toLowerCase()) || !e['last_name'].toLowerCase().indexOf(seed.toLowerCase()) || !e['user_name'].toLowerCase().indexOf(seed.toLowerCase()))){
                filterList.push(e)
            }
        })
    }else{
        filterList = []
    }
    
    const restoreUsers = async() =>{
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/restore_user`,{method : "POST"});
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
                                    <Button onClick={()=>{setEdit(!edit)}} variant="outlined" color='primary' sx={{marginRight:"20px"}}>{edit ? "Save" : "Edit"} Users</Button>
                                    <AddUserModal/>
                                    <Button onClick={restoreUsers} variant="outlined" color='primary' sx={{marginLeft:"20px"}}>Restore Users</Button>
                                </div>
                            </div>

                            <Typography variant='h5' sx={{width:'fit-content',mr:4}}>Total Users - {filterList.length}</Typography>
                        </div>
                        <Divider/>
                        
                        {/* section 2 - searchbar*/}
                        <div id='postHeaderUM'>
                            <TextField sx={{marginBottom:"10px"}} id="outlined-search" label="Search by Name, User Name" type="search" onChange={checkSearch} InputProps={{
                                endAdornment: (
                                <InputAdornment>
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                                )
                            }}/>
                        </div>

                        <div id="userCards">
                            {filterList.map((card) => 
                                <UCard data = {card} edit={edit} filter = {seed} />
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
