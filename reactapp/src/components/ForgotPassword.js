import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Palette } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.deepsightlabs.com/">
        DeepsightAI Labs Pvt. Ltd
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {

  const req = async(data) => {
    const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/forgot_password`, {
      method:"POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data.get('username'))
    })
    const returned_data = await response.json()
    if (returned_data.status_code!=200 && returned_data.status_code!=201){
      alert(returned_data.message)
    }else{
      alert("Please check your email for the new password")
      window.location.href = '/login'
    }
  }

  // const history = new URLSearchParams(window.location.search).get('history')!=null ? new URLSearchParams(window.location.search).get('history') : ''

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    req(data)
  };

  return (
    <Container component="main" maxWidth="xs" sx={{background:"white"}}>
    <CssBaseline />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
        <div style={{paddingTop: "20px",width:"100%",display: "flex",justifyContent: "center",alignItems:" center"}}>
          <img src="deepsight_logo.png" class="custom-logo" alt="" style={{height:"70px"}}></img>
        </div>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <ul>
                    <li>Please enter the email for password reset.</li>
                    <li>Please check the email associated with the user to find new password.</li>
                </ul>
          <TextField margin="normal" required fullWidth id="username" label="Email" name="username" autoComplete="username" autoFocus/>
          <Button  type="submit" fullWidth  variant="contained"  sx={{ mt: 3, mb: 2 }}>
            Reset Password
          </Button>
        </Box>
    </Box>
    {/* <Copyright sx={{ mt: 4, mb: 4 }} /> */}
    </Container>
  );
}