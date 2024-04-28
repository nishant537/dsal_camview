import React from 'react'
import ArticleIcon from '@mui/icons-material/Article';
import CameraIndoorIcon from '@mui/icons-material/CameraIndoor';
import { useState } from 'react';
import { AssignmentReturned } from '@mui/icons-material';
import {List, ListItemButton, ListItemIcon, ListItemText, Collapse, Grid, AppBar, InputAdornment, TextField, Box, CssBaseline, Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import {AddAPhoto, Preview, Dashboard, ExpandLess, ExpandMore, NotificationsActive, Menu, Search, LocationOn, LocationCity,Psychology,CameraIndoor} from '@mui/icons-material';
import ScrollableFeed from 'react-scrollable-feed'

// middleware component for fetching group menus (camera name, templates) to show in navigation menu
var returned_response;
export default function LItems(props){
    const [data, setData] = useState("")
    const [loading, setLoading] = useState(true)
    const [collapse, setCollapse] = useState("")

    const handleCollapse = (sent_key) =>{
        const sub_collapses = {} 
        Object.entries(collapse).map(([key,value]) => {
            if (key==sent_key){
                sub_collapses[key] = !collapse[key]
            }else{
                sub_collapses[key] = false
            }
        })
        setCollapse(Object.assign({},sub_collapses))
    }

    React.useEffect(() => {
        fetchSideData()
    },[])

    const fetchSideData = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/side_filter1`,{method : "GET"});
        returned_response = (await response.json())['data']
        setData(returned_response)
        setLoading(!loading)
    }

    if ((!loading) & (collapse == "")){
        const collapses = {} 
        Object.entries(data['site_filter']).map(([key,value]) => {
            collapses[key] = false
        })
        setCollapse(collapses)
    }

    if (!loading){
        if (props.type==='Site'){
            return(
                <>
                    {Object.entries(data['site_filter']).map(([key,value]) => 
                        <>
                            <ListItemButton className='menu_item'  id={key} onClick ={() => {handleCollapse(key)}}>
                                <ListItemIcon>
                                    <LocationCity />
                                </ListItemIcon>
                                <ListItemText primary={key} onClick={(e)=> {window.location.href = "/alert_dashboard/?filter=site+contains+"+key;}}/>
                                {collapse[key] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={collapse[key]} timeout="auto" unmountOnExit>
                                <ScrollableFeed>
                                    <List component="div" disablePadding style={{maxHeight:"300px",paddingLeft:"15px"}}>
                                        {value.map((item,index) => 
                                            // No Separate Component needed for this, as this ain't too big.
                                            <a href={"/alert_dashboard/?filter=camera_name+contains+"+item} style={{color:"black",textDecoration:"none"}}>
                                                <ListItemButton id={item}>
                                                    <ListItemIcon>
                                                        <CameraIndoor />
                                                    </ListItemIcon>
                                                    <ListItemText primary={item} />
                                                </ListItemButton>
                                            </a>
                                        )}
                                    </List>
                                </ScrollableFeed>
                            </Collapse>
                        </>
                    )}
                </>
            )
        }else{
            return(
                <>
                    {data['feature_filter'].map((item,i) => 
                        <a href={"/alert_dashboard/?filter=camera_name+contains+"+item} style={{color:"black",textDecoration:"none"}}>
                            <ListItemButton id={item} onClick={props.onclick}>
                                <ListItemIcon>
                                <CameraIndoorIcon />
                                </ListItemIcon>
                                <ListItemText primary={item} />
                            </ListItemButton>
                        </a>
                    )}
                </>
            )
        }
    }else{
        return(
            <></>
        )
    }
    
}