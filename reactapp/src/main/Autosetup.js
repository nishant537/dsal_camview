import * as React from 'react';
import {Button, Divider, Box, Toolbar, Typography} from '@mui/material';

const drawerWidth = 240;

function Main(props) {
    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }
    
    const autosetupUpdate  = (type, file = null) => {
        const formData = new FormData()
        formData.append('command_type',type)
        if (file!=null){
            formData.append('file',file)            
        }
        fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/autosetup/`, {
            method:"POST",
            body: formData
        })
        .then(results => results.json())
        .catch(error => {
            console.log(error)
        });
        // window.location.href = '/'
    }

    return(
        <>
            <Box component="main" sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />

                <Typography variant="h3">Autosetup</Typography>

                <div style={{display:"flex",margin: "20px 0"}}>
                    <Button variant='outlined' sx={{mr:2}} onClick = {() => {autosetupUpdate('start')}}>Start Platform</Button>
                    <Button variant='outlined' onClick = {() => {autosetupUpdate('stop')}}>Stop Platform</Button>
                </div>

                <Divider/>
                
                <Box component="main" sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>

                    <div style={{display:"flex",justifyContent:"space-between",boxShadow:'10px 10px 10px #e8e8e8', margin:"20px 0",padding:"10px",}}>
                        <div>
                            <Typography variant="h5" paddingY={2}>Mod Settings</Typography>
                            <span>Max upload limit is 2GB</span>                            
                        </div>

                        <div style={{alignSelf:"center"}}>
                            <input accept="mod-settings.conf" type="file" id="mod-settings" onChange={(e) => {autosetupUpdate('mod-settings', e.target.files[0])}}/>
                            <label htmlFor="mod-settings">
                                <Button variant="contained" color="primary" component="span">
                                    Upload File
                                </Button>
                            </label>
                        </div>
                    </div>

                    <div style={{display:"flex",justifyContent:"space-between",boxShadow:'10px 10px 10px #e8e8e8', margin:"20px 0",padding:"10px",}}>
                        <div>
                            <Typography variant="h5" paddingY={2}>License File</Typography>
                            <span>Max upload limit is 2GB</span>                            
                        </div>

                        <div style={{alignSelf:"center"}}>
                            <input accept="godeep.lic" type="file" id="license" onChange={(e) => {autosetupUpdate('license', e.target.files[0])}}/>
                            <label htmlFor="license">
                                <Button variant="contained" color="primary" component="span">
                                    Upload File
                                </Button>
                            </label>
                        </div>
                    </div>


                    <div style={{display:"flex",justifyContent:"space-between",boxShadow:'10px 10px 10px #e8e8e8', margin:"20px 0",padding:"10px",}}>
                        <div>
                            <Typography variant="h5" paddingY={2}>Settings File</Typography>
                            <span>Max upload limit is 2GB</span>                            
                        </div>

                        <div style={{alignSelf:"center"}}>
                            <input accept="(encrypted)settings.ini" type="file" id="settings" onChange={(e) => {autosetupUpdate('settings', e.target.files[0])}}/>
                            <label htmlFor="settings">
                                <Button variant="contained" color="primary" component="span">
                                Upload File
                                </Button>
                            </label>
                        </div>
                    </div>

                    <div style={{display:"flex",justifyContent:"space-between",boxShadow:'10px 10px 10px #e8e8e8', margin:"20px 0",padding:"10px",}}>
                        <div>
                            <Typography variant="h5" paddingY={2}>Upgrade Software</Typography>
                            <span>Max upload limit is 2GB</span>                            
                        </div>

                        <div style={{alignSelf:"center"}}>
                            <input accept=".zip" type="file" id="upgrade-software" onChange={(e) => {autosetupUpdate('upgrade-software', e.target.files[0])}}/>
                            <label htmlFor="upgrade-software">
                                <Button variant="contained" color="primary" component="span">
                                Upload File
                                </Button>
                            </label>
                        </div>
                    </div>

                    <Divider/>
                    <Button variant='outlined' sx={{mt:2}} onClick = {() => {autosetupUpdate('environment')}}>Update Environment</Button>
                </Box>
            </Box>
        </>
    );
}

export default Main;
