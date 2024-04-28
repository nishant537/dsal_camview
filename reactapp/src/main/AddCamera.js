import * as React from 'react';
import { TextField, Button, Grid, Box, Divider, Toolbar, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slider, Select, MenuItem } from '@mui/material';
// component import
import PCard from '../components/FeatureCard';
import AddCameraModal from "../components/AddCameraModal"


const drawerWidth = 240;

function Main(props) {
    if (!localStorage.getItem('loggedin')) {
        window.location = "/login"
    }

    const [open, setOpen] = React.useState(false);
    const [dopen, setDOpen] = React.useState(false);
    const [cardData, setCardData] = React.useState({})
    const [videoFps, setVideoFps] = React.useState(1)
    const [videoLength, setVideoLength] = React.useState(10)
    const [videoResizing, setVideoResizing] = React.useState("original_resolution")
    const [bodyimg,setBodyImg] = React.useState(null)
    const [rtsp, setRTSP] = React.useState({"rtsp":"","dss_id":"","dss_channel":""})

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDOpen = () => {
        setDOpen(!dopen)
    }

    const [textInput, setTextInput] = React.useState('');

    const handleTextInputChange = event => {
        setTextInput(event.target.value);
    };

    const [featureData, setFeatureData] = React.useState(null);

    React.useEffect(() => {
        get_template()
        fetchFeatures()
    }, [])

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

    const fetchFrame = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_frame`,{method : "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({"name":"rtsp","value":JSON.stringify(rtsp)})});
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        if (rtsp!={} && (rtsp['rtsp']!="" || rtsp['dss_id']!="" || rtsp['dss_channel']!="")){
            setBodyImg(imageObjectURL)
        }
    }

    const refreshFrame = async() => {
        fetchFrame()
    }

    const get_template = async () => {
        if (window.location.pathname.split("/").length > 2) {
            const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_template?id=${String(window.location.pathname.split("/")[2])}`, { method: "GET" });
            setCardData((await response.json())['object_alerts'])
            //              setLoading(!loading)
        }
    }

    const addCamera = () => {
        const features = {}
        featureData['features'].map((key,index) => {
            features[key]=""
        })
        Object.keys(features).map((value, index) => {
            if (Object.keys(cardData).includes(value)) {
                features[value] = true
            } else {
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

        if (!(Object.values(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',').includes(dict['site'])) || !(Object.keys(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',').includes(dict['cluster']))){
            alert('Re-check site/cluster')
        }
        else if (flag) {
            alert('Fill in details first')
        }
        else {
            const sendCamera = async () => {
                const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/add_camera`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "camera_name": "", "camera_json": JSON.stringify(Object.assign({},dict,{"section":"","video_fps":1,"video_length":10,"video_res":"original_resolution","all_feature_off": false, "features": features, "object_alerts": cardData, "start_time": "00:00:00", "end_time": "23:59:00" })) })
                })
                const returned_response = await response.json()
                if (returned_response.status_code != 200 && returned_response.status_code != 201) {
                    alert(returned_response.message)
                } else {
                    window.location.href = "/"
                }
            }
            sendCamera()
        }

    };

    const addTemplate = () => {
        fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/add_template`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "user": JSON.stringify(Object.assign({}, { "template_name": textInput }, { "object_alerts": cardData })) })
        })
            .then(results => { results.json(); window.location.href = '/' })
            .catch(error => {
                alert(error)
            });

    };

    const deleteTemplate = () => {
        fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/delete_template/` + window.location.pathname.split("/")[2], {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(results => { results.json(); window.location.href = '/' })
            .catch(error => {
                console.log(error)
            });
    }



    const updateRTSP = (event) => {
        const temp = Object.assign({},rtsp)
        temp[event.target.id] = event.target.value
        setRTSP(temp)
    }
    return (
        <>
            {/* <div>
            <Dialog open={dopen} onClose={handleDOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                Template
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this Template?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDOpen}>Cancel</Button>
                <Button onClick={deleteTemplate} autoFocus>
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
        </div> */}
            {/* <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Template</DialogTitle>
                <Divider/>
                <DialogContent>
                <DialogContentText>
                    Name the template
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Template Name"
                    fullWidth
                    variant="standard"
                    onChange= {handleTextInputChange}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addTemplate}>Save Template</Button>
                </DialogActions>
            </Dialog>
        </div> */}
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />

                <Box container sx={{ alignItems: "top" }}>
                    <Grid item xs={6}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center",flexWrap:"wrap",maxWidth:"60%" }}>
                                {Object.keys(JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)).map((key,value) => 

                                    (JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['display'] ? 
                                    <TextField
                                        hiddenLabel
                                        id={key}
                                        label={JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['name']}
                                        defaultValue={JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['default']!="" ? JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['default'] : null}
                                        disabled={JSON.parse(process.env.REACT_APP_PROVISIONING_FIELDS)[key]['disabled']}
                                        variant="outlined"
                                        sx={{ mr: 4, width:"250px",mb:3 }}
                                        onBlur={key=="rtsp" || key=="dss_id" || key=="dss_channel" ? updateRTSP : null}
                                    />
                                    : null)
                                )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {process.env.REACT_APP_VIDEO_SAVING == "true" ?
                                    <>
                                        <Slider sx={{ width: "300px", mr: 4 }} aria-label="Video FPS" id="video_fps" defaultValue={2} valueLabelDisplay="auto" step={1} marks min={1} max={5} onChange={(event) => { (setVideoFps(event.target.value)) }} />
                                        <Select sx={{ width: "300px", mr: 4 }} labelId="video-length-options" id="video_length" value={videoLength} label="Video Length Options" onChange={(event) => { (setVideoLength(event.target.value)) }}>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                        </Select>
                                        <Select labelId="video-resizing-options" id="video_resizing" value={videoResizing} label="Video Resizing Options" onChange={(event) => { (setVideoResizing(event.target.value)) }}>
                                            <MenuItem value="original_resolution">original_resolution</MenuItem>
                                            <MenuItem value="cif_resolution">cif_resolution</MenuItem>
                                            <MenuItem value="4cif_resolution">4cif_resolution</MenuItem>
                                        </Select>
                                    </> : null
                                }

                            </div>
                            <div style={{ display: "flex", alignItems: "center", paddingBottom: "20px" }}>
                                <Button variant='outlined' sx={{ mr: 2 }} onClick={addCamera}>Save Camera</Button>
                                {/* <Button variant='outlined' sx={{mr:2}} onClick={handleClickOpen}>Save Template</Button> */}
                                {/* {window.location.pathname.split("/").length>2 ? <Button variant='outlined' onClick={handleDOpen}>Delete Template</Button> : null} */}
                            </div>
                        </div>
                    </Grid>
                </Box>

                <div style={{ paddingBottom: "30px" }}>
                    <Divider />
                    <div style={{ display: "flex", padding: "30px 0", alignItems: "center" }}>
                        <Typography variant='h4' sx={{ width: 'fit-content', mr: 2 }}>Features Activated</Typography>
                        <AddCameraModal list={cardData} text="Add" addCard={setCardData} rtsp_details={rtsp} featureData={featureData} bodyimg={bodyimg} refreshFrame={refreshFrame}/>
                    </div>
                    <div id="cards" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        {Object.keys(cardData).length == 0 ? "Add Features to Camera" : Object.entries(cardData).map(([key, value]) =>
                            <PCard name={key} properties={value} fixed={true} list={cardData} addCard={setCardData} rtsp = {rtsp} featureData={featureData} bodyimg={bodyimg}/>
                        )}

                        <div style={{ width: "350px" }}></div>
                        <div style={{ width: "350px" }}></div>
                        <div style={{ width: "350px" }}></div>
                        <div style={{ width: "350px" }}></div>
                        <div style={{ width: "350px" }}></div>
                    </div>
                </div>

            </Box>
        </>
    );
}

export default Main;
