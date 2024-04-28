import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollableFeed from 'react-scrollable-feed'
import PropTypes from 'prop-types';
import {List, ListItemButton, ListItemIcon, ListItemText, ListItem, Button, Grid, AppBar, InputAdornment, TextField, Box, CssBaseline, Stack, Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
// icon import
import {AddAPhoto, Preview, Dashboard, ExpandLess, ExpandMore, NotificationsActive, Menu, Search, CloudDownloadOutlined, ManageAccounts, Psychology, LocationOn, LineWeight, LibraryBooks, Group, TableView} from '@mui/icons-material';
// main import
import Client from './main/Client'
import Exam from './main/Exam'
import CreateExam from './main/CreateExam'
import Shift from './main/Shift'
import FeatureTable from './main/FeatureTable'
import Center from './main/Center'
import Camera from './main/Camera'
import Alert from './main/Alert'
import User from './main/User'
import ROISummary from './main/ROISummary'
import ROIReview from './main/ROIReview'
import AlertSummary from './main/AlertSummary'
import TicketSummary from './main/TicketSummary'
import CameraHealth from './main/CameraHealth'
// component import
import MenuItem from './components/MenuItem';
import Profile from './components/Profile'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';


const drawerWidth = 280;

function ResponsiveDrawer(props) {

  const theme = createTheme({
    palette: {
      mode: "light",
      common: {
        black: "#000",
        white: "#fff"
      },
      appbar: {
        main: '#ffffff',
        contrastText: '#000000'
      },
      primary: {
        main: '#3c4046',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#8b83ba',
        contrastText: '#f4f2ff'
      },
      error: {
        main: '#D72A2A',
      },
      warning: {
        main: '#FC7B09',
      },
      info: {
        main: '#6B7D6A',
      },
      success: {
        main: '#09FE00',
      },
      text: {
          primary: '#000000',
          secondary: '#898989',
          disabled: '#afacac',
      },
      background: {
        default: '#ffff',
      },
    },
    typography: {
      h1:{
        fontFamily: "Poppins",
        fontSize: "2rem",
        lineHeight: "3rem",
        fontWeight:"700",
        color:"#3c4046"
      },
      h2:{
        fontFamily: "Poppins",
        fontSize: "1.5rem",
        lineHeight: "2.5rem",
        fontWeight:"700"
      },
      h3:{
        fontFamily: "Poppins",
        fontSize: "1rem",
        lineHeight: "2rem",
        fontWeight:"500"
      }
    },
  });

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const handleActiveIndex = (value) => {
    document.getElementsByClassName('active_menu')[0].classList.remove('active_menu');
    document.getElementById(value).classList.add('active_menu');
  }
  const { window_sub } = props;

  const highlight = (event) => {
    // document.getElementById("sidebar-" + activeIndex).style.backgroundColor = "#e8e8e8"
    // if (event.currentTarget.id>2){
    //   navigate("/add_camera/" + event.currentTarget.camera_id.replace(' ','_'))
    // }else{
    // navigate("/provisioning/" + event.currentTarget.id.replace(' ','_'))
    // }
    // event.currentTarget.style.backgroundColor = "#e8e8e8"
    handleActiveIndex(event.currentTarget.id)
    setPageTitle(event.currentTarget.textContent)
  }

  const [pageTitle, setPageTitle] = React.useState(() => {
    if (window.location.href.split('/').length > 4){
      return "Provisioning"
    } else if (window.location.href.split('/')[3] == 'add_camera'){
      return "Add Camera"
    } else{
      return "Dashboard"
    }
  });

  const NewNestedList = (
    <List
      sx={{ width: '100%', maxWidth: 360,padding:"0 15px"}}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
          {/* FOR CLIENT PAGE */}
          <ListItem key="Clients" disablePadding>
            <ListItemButton  onClick={(e)=> {navigate('/');}}>
              <ListItemIcon sx={{color:theme.palette.primary.contrastText}}>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="h3" component="span">Clients</Typography>} />
            </ListItemButton>
          </ListItem>

          {/* FOR EXAM PAGE */}
          <ListItem key="Exam" disablePadding>
            <ListItemButton  onClick={(e)=> {navigate('/exam');}}>
              <ListItemIcon sx={{color:theme.palette.primary.contrastText}}>
                <LibraryBooks />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="h3" component="span">Exam</Typography>} />
            </ListItemButton>
          </ListItem>

          {/* FOR USER PAGE */}
          <ListItem key="Users" disablePadding>
            <ListItemButton  onClick={(e)=> {navigate('/');}}>
              <ListItemIcon sx={{color:theme.palette.primary.contrastText}}>
                <Group />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="h3" component="span">Users</Typography>} />
            </ListItemButton>
          </ListItem>

          {/* FOR FEATURE TABLE PAGE */}
          <ListItem key="Feature Table" disablePadding>
            <ListItemButton  onClick={(e)=> {navigate('/');}}>
              <ListItemIcon sx={{color:theme.palette.primary.contrastText}}>
                <TableView />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="h3" component="span">Feature Table</Typography>}/>
            </ListItemButton>
          </ListItem>
    </List>
  )

  const drawer = (
    <Box role="presentation">
      {/* <div style={{padding: "20px",display: "flex",justifyContent: "space-around",alignItems:" center"}}> */}
        <img src="deepsight_logo.png" class="custom-logo" alt="" style={{width:"100%",padding:"40px"}}></img>
      {/* </div> */}
      {NewNestedList}
    </Box>
  );

  const container = window_sub !== undefined ? () => window_sub().document.body : undefined;
    
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height:"100vh" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            // backgroundColor:"black",
            // color:"white",
          }}
          color="appbar"
        >
          <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <Menu />
            </IconButton>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{alignItems:"center"}}>
                <Grid item xs={6}>
                    <Typography variant="h2" component="span">
                        {pageTitle}
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{display:"flex",flexDirection:"row-reverse"}}>
                    <Stack direction="row" gap={3}>
                      <Typography variant="h2" component="span">Welcome</Typography>
                      <Profile/>
                    </Stack>
                </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
            }
            }}
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* MAIN VIEW */}
        {props.view=='Client' ? <Client/> : props.view=="Exam" ? <Exam/> : props.view=="CreateExam" ? <CreateExam/> : props.view=="Shift" ? <Shift/> : props.view=="FeatureTable" ? <FeatureTable/> : props.view=="User" ? <User/> : props.view=="Center" ? <Center/> : props.view=="Camera" ? <Camera/> : props.view=="ROISummary" ? <ROISummary/> : props.view=="ROIReview" ? <ROIReview/> : props.view=="AlertSummary" ? <AlertSummary/> : props.view=="TicketSummary" ? <TicketSummary/> : props.view=="CameraHealth" ? <CameraHealth/> : props.view=="Alert" ? <Alert/> : null}

      </Box>
    </ThemeProvider>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window_sub: PropTypes.func,
};

export default ResponsiveDrawer;