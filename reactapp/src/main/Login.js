import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SignIn from '../components/SignIn';
import ForgotPassword from '../components/ForgotPassword';

function Main(props) {
    return(
        <>
            <Box component="main">
                    <div style={{backgroundImage:`url(${'background.jpg'})`,backgroundPosition:"center",width:"100vw",height:"100vh", backgroundSize:"cover",display:'flex',justifyContent:"flex-start",alignItems:"center"}}>
                    {props.view == "SignIn" ? <SignIn/> : <ForgotPassword/>}
                </div>
                
            </Box>
        </>
    )
}

export default Main;