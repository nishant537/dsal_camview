import * as React from 'react';
import { useSearchParams } from 'react-router-dom'; 
import {Button, Box, Divider, Toolbar, Typography, TextField, Stack} from '@mui/material';


const drawerWidth = 240;

function Main(props) {
    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }
    
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category")

    const myRef = React.useRef();
    const executeScroll = () => myRef.current.scrollIntoView()  

    React.useEffect(() => {
        // Update the document title using the browser API
        executeScroll();
    });

    return(
        <>
            <Box component="main" sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                
                {['threshold',"intrusion","tamper","camera_fault","paramater"].map((x,i) => 
                    <div ref = {category==x ? myRef : null}>
                        <Box sx={{pb:3}}>
                            <Typography variant="h3" paddingY={2}>
                                {x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()} Settings
                            </Typography>
                            
                            <Stack component="form" sx={{width: '25ch', }} spacing={2} noValidate autoComplete="off">
                                <TextField
                                    hiddenLabel
                                    id="filled-hidden-label-small"
                                    defaultValue="Default Parameter"
                                    variant="filled"
                                    disabled = {true}
                                />
                                <TextField
                                    hiddenLabel
                                    id="filled-hidden-label-normal"
                                    defaultValue="Default Parameter"
                                    variant="filled"
                                    disabled = {true}
                                />
                            </Stack>

                            <div style={{"display":"flex",marginTop:"20px"}}>
                                <Button variant='outlined' sx={{mr:2}}>Reset Default</Button>
                                <Button variant='outlined' sx={{mr:2}}>Edit Params</Button>
                            </div>

                        </Box>
                        
                        <Divider/>
                    </div>
                )}
                
            </Box>
        </>
    )
}

export default Main;
