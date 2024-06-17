// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import StepProgressBar from "./StepProgressBar"
import { useNavigate } from 'react-router-dom';
import {get as get_client} from '../provider/client_provider';
import {get, post, del} from '../provider/exam_provider';
import {post as post_shift} from '../provider/shift_provider';
import { useForm } from 'react-hook-form'

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectRef = useRef(null);

    const [urlParams, setUrlParams] = React.useState("")

    // react-form
    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        console.log(data)
    };
    const onError = (errors, e) => {console.log(errors);};

    return(
        <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
            <Paper style={{ padding: 16, marginTop:20,}}>
                <Grid container alignItems="flex-start" spacing={2} p={3}>
                    <Grid item xs={12}>
                        <RadioGroup
                            defaultValue="centerWise"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="featureWise" control={<Radio />} label="Feature Wise" />
                            <FormControlLabel value="centerWise" control={<Radio />} label="Center Wise" />
                        </RadioGroup>

                        <div style={{"margin":"20px 0" }}>
                            <Typography variant="h3">Number of Cameras</Typography>
                            <TextField  name="company"  placeholder="Camera count"/>
                        </div>

                        <Divider/>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography variant="h3">Zone Intrusion</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h3">Crowd Detection</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h3">Invigilator not moving</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h3">Furniture out of place</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography variant="h3">Camera Fault</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h3">Camera Tampering</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h3">Trunk Detection</Typography>
                        <TextField  name="company"  placeholder="Number of Cameras"/>
                    </Grid>

                    <Grid item xs={12} textAlign="center" p={3}>
                        <Button variant="outlined" color="secondary" type="submit">Get Plan</Button>
                    </Grid>

                    <Divider/>

                    <Grid item xs={12} textAlign="center">
                        <Typography variant="h2" noWrap component="div">
                            Suggested Instance Plan
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                    <Stack direction="column" >
                        <Typography variant="h3">Number of Instances : 4</Typography>
                        <Typography variant="h3">Configuration : c6i.2xlarge, c6i.2xlarge, c6i.2xlarge, c6i.2xlarge</Typography>
                    </Stack>
                    </Grid>

                    <Grid item style={{ marginTop: 30 }}>
                        <Stack alignItems="center" direction="row" gap={3}>
                            <Button variant="outlined" color="secondary" onClick={() => {props.setStep(1)}}>Back</Button>
                            <Button variant="contained" color="secondary" onClick={() => {props.setStep(3)}}>Next</Button>
                        </Stack>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    )

}

export default Main;
