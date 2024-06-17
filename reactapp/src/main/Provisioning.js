import * as React from 'react';
import {Divider, Toolbar, Typography, Grid, TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Slider, Select, Paper, Stack} from '@mui/material';
// component import
import FeatureCard from '../components/FeatureCard';
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
    const [cardData, setCardData] = React.useState({})


    React.useEffect(() => {
        get_camera(window.location.pathname.split("/")[2]).then((value)=>{
            let object_alerts = {}
            value.features.map((feature,index)=>{
                object_alerts[feature['name']] = feature
            })
            setCardData(object_alerts)
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


    const updateRTSP = (event) => {
        const temp = Object.assign({},rtsp)
        temp[event.target.id] = event.target.value
        setRTSP(temp)
    }

    // react-form
    const {register, handleSubmit} = useForm([])
    const onSubmit = (data, e) => {console.log(data)};
    const onError = (errors, e) => {console.log(errors)};

    console.log(cardData)
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
                
                <Stack direction="row" alignItems="center" gap={2}>
                    <Typography variant="h2" noWrap component="div" padding={2} overflow={"visible"}>
                        Features Activated
                    </Typography>
                    <AddCameraModal text = "Add" camera_id={window.location.pathname.split("/")[2]} list={cardData} addCard = {setCardData} bodyimg={bodyimg} featureData={{"features":["intrusion","camera_fault","multiple_person"]}} refreshFrame={refreshFrame}/>
                </Stack>


                <div style={{display:"flex"}}>
                    <div id="cards" style={{display:"flex",flexWrap: "wrap",width:"100%",justifyContent: "space-between",borderRight:"1px solid #e8e8e8"}} >
                        {Object.keys(cardData).length>0 && Object.values(cardData).map((value, index) =>
                            <FeatureCard id={value['id']} camera_id={window.location.pathname.split("/")[2]} list={cardData} addCard = {setCardData} featureData={{"features":["intrusion","camera_fault","multiple_person"]}} bodyimg={bodyimg} refreshFrame={refreshFrame}  name = {value['name']} properties = {JSON.parse(value['json'])}/>
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
