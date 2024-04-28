import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment } from '@mui/material';
// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

const drawerWidth = 240;

function Main(props) {
    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }

    const [cameraData, setCameraData] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1)
    
    React.useEffect(() => {
        fetchCameraData()
    },[])

    const fetchCameraData = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/dashboard?page=0&site_access=${Object.values(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',')}`,{method : "GET"});
        const received_data = (await response.json())['data']
        let camera_data = []
        Object.entries((received_data['data'])).map(([key,value]) => {
            camera_data.push([value[0],value[1]['camera_name']])
        })
        setCameraData(camera_data)
        setLoading(!loading)
    }

    const [seed, setSeed] = React.useState("");

    const checkSearch = event => {
        setSeed(event.target.value.trim())
        setPage(1)
    }

    const myfunc = event =>{
        alert(event.currentTarget.textContent)
    }

    if (!loading){
        return(
            <>
                <Box
                    component="main"
                    sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />

                    {/* <div style={{display:"flex",justifyContent:"space-evenly"}}>
                        <h1>Cluser Name : {process.env.REACT_APP_CLUSTER}</h1>
                        <h1>Site Name : {process.env.REACT_APP_SITE}</h1>
                        <h1>Total Camera : {cameraData.length} Cameras</h1>
                    </div> */}

                    <Box container sx={{alignItems:"center",paddingBottom:"30px"}}>
                        <TextField sx={{width: "350px" }} id="outlined-search" label="Search Camera" type="search" onChange={checkSearch} InputProps={{
                            endAdornment: (
                            <InputAdornment>
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                            )
                        }}/>
                        
                    </Box>
                    
                    <Grid id={"homeGrid"} container sx={{alignItems:"center",borderBottom:"2px Solid",paddingBottom:"20px"}}>
                        <Grid item xs={4}>
                            <Typography variant="p">
                                Name
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="p">
                                Features Active
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="p">
                                Alerts On
                            </Typography>
                        </Grid>
    
                        <Grid item xs={2}>
                            <Typography variant="p">
                                Activated Time
                            </Typography>
                        </Grid>
                    </Grid>
    
                    <div id='camera_cards'>
                        <DashboardCards filter = {seed} page={page} setPage={setPage}/>
                    </div>
                </Box>
            </>
        );
    }
    
}

export default Main;
