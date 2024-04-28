import * as React from 'react';
import {Divider, Toolbar, Typography, Grid, TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Slider, Select} from '@mui/material';
// component import
import PCard from '../components/FeatureCard';
import CFeed from '../components/CameraFeed';
import AddCameraModal from "../components/AddCameraModal"
// import { useState } from "react";
import ImageMarker, { Marker } from "react-image-marker";

const drawerWidth = 240;

export default function Provisioning(props){
    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }

    var [pageData, setPageData] = React.useState([]);
    const [loading, setLoading] = React.useState(true)
    const [time, setTime] = React.useState(true)
    const [videoFps, setVideoFps] = React.useState(1)
    const [videoLength, setVideoLength] = React.useState(10)
    const [videoResizing, setVideoResizing] = React.useState("original_resolution")
    const [featureData, setFeatureData] = React.useState(null);
    const [bodyimg,setBodyImg] = React.useState(null)
    const [rtsp, setRTSP] = React.useState({"rtsp":"","dss_id":"","dss_channel":""})


    React.useEffect(() => {
        names()
        fetchFeatures()
    },[])

    React.useEffect(() => {
        if (rtsp!={} && (rtsp['rtsp']!="" || rtsp['dss_id']!="" || rtsp['dss_channel']!="")){
            fetchFrame()
        }
    },[rtsp])


    const fetchFeatures = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/fetch_features`,{method : "GET"});
        const received_data = await response.json()
        setFeatureData(received_data)

    }

    const refreshFrame = async() => {
        fetchFrame()
    }

    const fetchFrame = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_frame`,{method : "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({"name":"rtsp","value":JSON.stringify(rtsp)})});
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        if (rtsp!={} && (rtsp['rtsp']!="" || rtsp['dss_id']!="" || rtsp['dss_channel']!="")){
            setBodyImg(imageObjectURL)
        }
    }

    const names = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_camera/${window.location.pathname.split("/")[2]}`,{method : "GET"});
        const received_data = (await response.json())['data']
        setPageData(received_data)
        setRTSP({"rtsp":received_data.rtsp,"dss_id":received_data.dss_id,"dss_channel":received_data.dss_channel})
        setLoading(false)
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

        const editCamera = () => {
        const features = {}
        featureData['features'].map((key,index) => {
            features[key]=""
        })
        Object.keys(features).map((value,index) => {
            if (Object.keys(cardData).includes(value)){
                features[value] = true
            }else{
                features[value] = false
            }
        })
        let flag = false
        let dict = {}
        Object.keys(JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)).map((key,index) => {
            if (JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['display']){
                dict[key] = document.getElementById(key).value.trim()
            } else {
                dict[key] = JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['default']
            }
            if (JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['required'] && dict[key]==""){
                flag = true
            }
        })

        if (flag) {
            alert('Fill in details first')
        }
        else{
            const editCamera = async() =>{
                const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/edit_camera/${window.location.pathname.split("/")[2]}`, {
                    method:"POST",
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ "camera_name": "", "camera_json": JSON.stringify(Object.assign({},dict,{"section":"","video_fps":1,"video_length":10,"video_res":"original_resolution","all_feature_off": false, "features": features, "object_alerts": cardData, "start_time": "00:00:00", "end_time": "23:59:00" })) })
                })
                const returned_response = await response.json()
                if (returned_response.status_code!=200 && returned_response.status_code!=201){
                    alert(returned_response.message)
                }else{
                    window.location.reload()
                }
            }

            editCamera()

        }
    };

    const [edit,setEdit] = React.useState(false);
    const handleEdit = () => {
        if (edit==true){
            window.location.reload();
        }
        setEdit(!edit)
    }

    // dialogue
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
    };

    const deleteCamera = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/delete_camera/${window.location.pathname.split("/")[2]}`, {
            method:"POST",
            headers: {'Content-Type':'application/json'}
        })
        const returned_response = await response.json()
        if (returned_response.status_code!=200 && returned_response.status_code!=201 ){
            alert(returned_response.message)
        }else{
            window.location.href = "/"
        }
    }

    const updateRTSP = (event) => {
        const temp = Object.assign({},rtsp)
        temp[event.target.id] = event.target.value
        setRTSP(temp)
    }

    if (!loading){
        return(
            <>

                <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                    {pageData.camera_name}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this camera?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={deleteCamera} autoFocus>
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>

                <Box
                    component="main"
                    sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />

                    <div>
                        <Box container sx={{alignItems:"top"}}>
                            <Grid item xs={6}>
                            <div>

                                <div style={{ display: "flex", alignItems: "center",flexWrap:"wrap",maxWidth:"60%" }}>
                                    {Object.keys(JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)).map((key,value) =>
                                        <TextField
                                            hiddenLabel
                                            id={key}
                                            label={JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['name']}
                                            defaultValue={pageData[key]}
                                            disabled={JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['default'] && edit==true ? true : false}
                                            variant="outlined"
                                            sx={{ mr: 4, width:"250px",mb:3 }}
                                            onBlur={key=="rtsp" || key=="dss_id" || key=="dss_channel" ? updateRTSP : null}
                                        />
                                    )}
                                </div>

                                <div style={{display:"flex",alignItems:"center",paddingBottom:"20px"}}>
                                    {process.env.REACT_APP_VIDEO_SAVING == "true" ?
                                        <>
                                            <Slider sx={{width:"300px",mr:4}} aria-label="Video FPS" id="video_fps" defaultValue={2} valueLabelDisplay="auto" step={1} marks min={1} max={5} onChange={(event) => {(setVideoFps(event.target.value))}}/>
                                            <Select sx={{width:"300px",mr:4}} labelId="video-length-options" id="video_length" value={videoLength} label="Video Length Options" onChange={(event) => {(setVideoLength(event.target.value))}}>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={30}>30</MenuItem>
                                            </Select>
                                            <Select labelId="video-resizing-options" id="video_resizing" value={videoResizing} label="Video Resizing Options" onChange={(event) => {(setVideoResizing(event.target.value))}}>
                                                <MenuItem value="original_resolution">original_resolution</MenuItem>
                                                <MenuItem value="cif_resolution">cif_resolution</MenuItem>
                                                <MenuItem value="4cif_resolution">4cif_resolution</MenuItem>
                                            </Select>
                                        </> : null
                                    }

                                </div>
                                <div style={{display:"flex",alignItems:"center",paddingBottom:"20px"}}>
                                    <Button variant='outlined' onClick = {edit ? editCamera : handleEdit} sx={{mr:2}}>{edit ? "Save" : "Edit"} Camera</Button>
                                    <Button variant='outlined' onClick={handleClickOpen}>Delete Camera</Button>
                                </div>
                            </div>
                            </Grid>
                        </Box>

                        <Divider/>

                        <div>
                            <div style={{display:"flex",padding:"30px 0"}}>
                                <Typography variant='h4' sx={{width:'fit-content',mr:2}}>Features Activated</Typography>
                                {edit?<AddCameraModal list={cardData} text = "Add" addCard = {setCardData} rtsp_details = {rtsp} bodyimg={bodyimg} featureData={featureData} refreshFrame={refreshFrame}/>:null}
                            </div>

                            {/* PCards */}
                            <div style={{display:"flex"}}>
                                <div id="cards" style={{display:"flex",flexWrap: "wrap",width:"70%",justifyContent: "space-between",borderRight:"1px solid #e8e8e8"}} >

                                    {Object.keys(cardData).length==0 ? "Add Features to Camera" : Object.entries(cardData).map(([key,value]) =>
                                        <PCard name = {key} properties = {value} fixed = {edit} list = {cardData} addCard = {setCardData} rtsp = {rtsp} bodyimg={bodyimg} featureData={featureData}/>
                                    )}

                                    <div style={{width:"350px"}}></div>
                                    <div style={{width:"350px"}}></div>
                                    <div style={{width:"350px"}}></div>
                                    <div style={{width:"350px"}}></div>
                                    <div style={{width:"350px"}}></div>
                                </div>

                                {process.env.REACT_APP_FEED_SHOW == "true" ?
                                    <>
                                        <div id='camera_feed' style={{width:"30%", padding:"0px 20px"}}>
                                        <CFeed id={window.location.pathname.split("/")[2]}/>
                                        </div>
                                    </>
                                    : null
                                }

                            </div>
                        </div>
                    </div>

                </Box>
            </>
        )
    }else{
     return(
        <>
            <p>Loading!!</p>
        </>
     )
    }
}
