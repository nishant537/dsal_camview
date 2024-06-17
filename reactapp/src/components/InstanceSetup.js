// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import StepProgressBar from "./StepProgressBar"
import { useNavigate } from 'react-router-dom';
import {post} from '../provider/instance_provider';
import { useForm } from 'react-hook-form'

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectRef = useRef(null);

    const [urlParams, setUrlParams] = React.useState("")
    
    const [instanceList, setInstanceList] = React.useState(()=>{
        return [{'key':""}]
    })
    const addInstance = () => {
        setInstanceList(instanceList.concat([{"key":""}]))
    }
    const removeInstance = (index) => {
        const list = [].concat(instanceList)
        list.splice(index,1)
        setInstanceList(list)
    }

    // react-form
    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        console.log(data)
        let index= 0;
        const instance_data = Object.entries(data).reduce((acc, [key, value]) => ((index = key.split('&')[1]), (acc[index] = { ...acc[index], [key.split('&')[0]]: value, exam_id: props.examData.id }), acc), []);
        console.log(instance_data)
        post(instance_data).then((value)=>{
            const exam_data = props.examData
            exam_data['instances'] = value
            props.setExam(exam_data)
            props.setStep(4)
        })
        
    };
    const onError = (errors, e) => {console.log(errors);};

    return(
        <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
            <Paper style={{ padding: 16, marginTop:20,}}>
                <Grid container alignItems="flex-start" spacing={5} py={3} px={11}>
                    {instanceList.map((value,index)=>
                        <Grid item xs={12}>
                            <Typography variant="h3">Instance {index}</Typography>
                            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                                <TextField {...register(`key&${index}`, { required: true })} required placeholder="Enter Key"/>
                                {index>0 ? 
                                    <RemoveCircleOutline fontSize='large' onClick={()=>{removeInstance(index)}}/>
                                :
                                    null
                                }
                            </div>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button variant="outlined" color="secondary" onClick={addInstance} >Add Instance</Button>
                    </Grid>

                    <Grid item style={{ marginTop: 30 }}>
                        <Stack alignItems="center" direction="row" gap={3}>
                            <Button variant="outlined" color="secondary" onClick={() => {props.setStep(2)}}>Back</Button>
                            <Button variant="contained" color="secondary" type="submit">Next</Button>
                        </Stack>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    )

}

export default Main;
