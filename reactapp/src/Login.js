import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Profile from './components/Profile'
import LoginMain from './main/Login'


const drawerWidth = 240;

function ResponsiveDrawer(props) {
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
      >
        <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
        >
            <MenuIcon />
        </IconButton>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{alignItems:"center"}}>
                <Grid item xs={6}>
                    <Typography variant="h6" noWrap component="div">
                        Login
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Profile/>
                </Grid>
            </Grid>

        </Toolbar>
      </AppBar>

      {/* MAIN VIEW */}
      <LoginMain/>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
