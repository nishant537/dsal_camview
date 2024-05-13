import * as React from 'react';
import {Divider, Toolbar, Typography, Grid, TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Slider, Select, Paper, Stack} from '@mui/material';
// component import
import PCard from '../components/FeatureCard';
import CFeed from '../components/CameraFeed';
import AddCameraModal from "../components/AddCameraModal"
// import { useState } from "react";
import {get_camera, post, del} from '../provider/camera_provider';
import { useForm } from 'react-hook-form'
import { type } from '@testing-library/user-event/dist/type';

const drawerWidth = 240;

export default function Provisioning(props){

    const [pageData, setPageData] = React.useState({});
    const [loading, setLoading] = React.useState(true)
    const [time, setTime] = React.useState(true)
    const [videoFps, setVideoFps] = React.useState(1)
    const [videoLength, setVideoLength] = React.useState(10)
    const [videoResizing, setVideoResizing] = React.useState("original_resolution")
    const [featureData, setFeatureData] = React.useState(null);
    const [bodyimg,setBodyImg] = React.useState(null)
    const [rtsp, setRTSP] = React.useState({"rtsp":"","dss_id":"","dss_channel":""})


    React.useEffect(() => {
        get_camera(window.location.pathname.split("/")[2]).then((value)=>{
            console.log(value)
            setPageData(value)
        })
    },[])

    React.useEffect(() => {
        console.log("Change in rtsp detected")
        // if (rtsp!={} && (rtsp['rtsp']!="" || rtsp['dss_id']!="" || rtsp['dss_channel']!="")){
        //     fetchFrame()
        // }
    },[rtsp])


    const refreshFrame = async() => {
        console.log('refresh frame requested')
        // fetchFrame()
    }


    const object_alerts = {}
    const [cardData, setCardData] = React.useState({})

    if (!loading && time){
        Object.entries(pageData.object_alerts).map(([key,value]) => {
            object_alerts[key] = value
            // object_alerts.push(Object.assign({}, {'name': key}, value))
        });
        setCardData(object_alerts)
        setTime(false)
    }


    const updateRTSP = (event) => {
        const temp = Object.assign({},rtsp)
        temp[event.target.id] = event.target.value
        setRTSP(temp)
    }

    // react-form
    const {register, handleSubmit} = useForm([])
    const onSubmit = (data, e) => {console.log(data)};
    const onError = (errors, e) => {console.log(errors)};
    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />


                <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
                    <Paper>
                        <Grid container alignItems="flex-start" spacing={2} p={3}>
                            {Object.keys(pageData).map((value,index)=>
                                (value!=="id" && (typeof pageData[value] === 'string' || typeof pageData[value] === 'number') ? 
                                    <Grid item xs={3}>
                                        <Typography variant="h3">{value}</Typography>
                                        <TextField  {...register('hi', { required: true })} defaultValue={pageData[value]} required placeholder="ABX-3241"/>
                                    </Grid>
                                :
                                null
                                )
                            )}
                            
                            <Grid item xs={12} style={{ marginTop: 30 }}>
                                <Stack alignItems="center" direction="row" gap={3}>
                                    <Button variant="outlined" color="secondary" >Delete</Button>
                                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                <Divider/>
                
                <Typography variant="h2" noWrap component="div" textAlign={'center'} padding={2} overflow={"visible"}>
                    Features Activated
                    {/* Add new feature pending */}
                    {/* {edit?<AddCameraModal list={cardData} text = "Add" addCard = {setCardData} rtsp_details = {rtsp} bodyimg={bodyimg} featureData={featureData} refreshFrame={refreshFrame}/>:null} */}
                </Typography>

                <div style={{display:"flex"}}>
                    <div id="cards" style={{display:"flex",flexWrap: "wrap",width:"100%",justifyContent: "space-between",borderRight:"1px solid #e8e8e8"}} >
                        {Object.keys(pageData).length>0 && pageData['features'].length>0 && pageData['features'].map((value, index) =>
                            <PCard id={value['id']} name = {value['name']} properties = {JSON.parse(value['json'])} fixed = {true} rtsp = {rtsp} bodyimg={""}/>
                        )}

                        <div style={{width:"350px"}}></div>
                        <div style={{width:"350px"}}></div>
                        <div style={{width:"350px"}}></div>
                        <div style={{width:"350px"}}></div>
                        <div style={{width:"350px"}}></div>
                    </div>
                </div>
            </Box>
        </>
    )
}
