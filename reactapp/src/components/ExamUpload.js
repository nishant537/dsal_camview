// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import StepProgressBar from "./StepProgressBar"
import { useNavigate } from 'react-router-dom';
import {upload_center, upload_camera} from '../provider/exam_provider';
import { useForm } from 'react-hook-form'

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectRef = useRef(null);
    
    const [selectedCenter, setSelectedCenter] = React.useState("")
    const [selectedCamera, setSelectedCamera] = React.useState("")

    const handleselectedCenter = (e) => {
        setSelectedCenter(e.target.files[0])
    }
    const handleselectedCamera = (e) => {
        setSelectedCamera(e.target.files[0])
    }


    // react-form
    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        upload_center(selectedCenter).then((value)=>{
            if (value){
                console.log(value)
            }
        })
        upload_center(selectedCamera).then((value)=>{
            if (value){
                console.log(value)
                window.location.href = '/exam'
            }
        })
    };
    const onError = (errors, e) => {console.log(errors);};

    return(
        <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
            <Paper style={{ padding: 16, marginTop:20,}}>
                <Box container>
                    <Typography variant="h2" noWrap component="div" textAlign={'center'} padding={2} pb={15}>Upload Required Templates</Typography>
                    <Stack alignItems="center" direction="row" justifyContent={"space-around"}>
                        <Stack alignItems="center" direction="column" justifyContent={"space-around"} sx={{backgroundColor:"#f8f8ff", padding: "40px 0px", width:"400px"}}>
                            <Typography variant="h3" component="div">Upload Center List</Typography>
                            <Box display={"flex"} flexDirection="column" textAlign={"center"} alignItems="center">
                                <img src="upload.png" class="custom-logo" alt=""></img>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload/>}
                                    sx={{margin:"20px"}}
                                    >
                                    Upload file
                                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleselectedCenter} style={{clip: 'rect(0 0 0 0)',clipPath: 'inset(50%)',height: 1,overflow: 'hidden',position: 'absolute',bottom: 0,left: 0,whiteSpace: 'nowrap',width: 1,}}/>
                                </Button>
                                {selectedCenter.name!==""? <Typography variant="h3" color={theme.palette.text.disabled} component="span">Uploaded File: {selectedCenter.name}</Typography> : null}
                                <Typography variant="h3" color={theme.palette.text.disabled} component="span">Supported Format : XLSX, XLS, CSV</Typography>
                            </Box>
                        </Stack>
                        <Stack alignItems="center" direction="column" justifyContent={"space-around"} sx={{backgroundColor:"#f8f8ff", padding: "40px 0px", width:"400px"}}>
                            <Typography variant="h3" component="div">Upload Camera/Feature Template</Typography>
                            <Box display={"flex"} flexDirection="column" textAlign={"center"} alignItems="center">
                                <img src="upload.png" class="custom-logo" alt=""></img>
                                
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload/>}
                                    sx={{margin:"20px"}}
                                    >
                                    Upload file
                                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  onChange={handleselectedCamera} style={{clip: 'rect(0 0 0 0)',clipPath: 'inset(50%)',height: 1,overflow: 'hidden',position: 'absolute',bottom: 0,left: 0,whiteSpace: 'nowrap',width: 1,}}/>
                                </Button>
                                {selectedCamera.name!==""? <Typography variant="h3" color={theme.palette.text.disabled} component="span">Uploaded File: {selectedCamera.name}</Typography> : null}
                                <Typography variant="h3" color={theme.palette.text.disabled} component="span">Supported Format : XLSX, XLS, CSV</Typography>
                            </Box>
                        </Stack>
                    </Stack>
                    <Stack alignItems="center" direction="row" gap={5} m={4}>
                        <Button variant="outlined" color="secondary" onClick={() => {props.setStep(3)}}>Back</Button>
                        {/* <Button variant="outlined" color="secondary">Save Draft</Button> */}
                        <Button variant="contained" color="secondary" type="submit">Submit</Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    )

}

export default Main;
