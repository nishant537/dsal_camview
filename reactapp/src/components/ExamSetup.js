// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
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
    const [clientName, setClientName] = React.useState([])
    // ----------------------  
    const [shiftList, setShiftList] = React.useState([{"code":"","date":"","start_time":"","end_time":""}])
    const addShift = () => {
        setShiftList(shiftList.concat([{"code":"","date":"","start_time":"","end_time":""}]))
    }
    const removeShift = (index) => {
        const list = [].concat(shiftList)
        list.splice(index,1)
        setShiftList(list)
    }

    React.useEffect(() => {
        get_client((urlParams)).then((value)=>{
            if (value){
                setClientName(value)
            }
        })
      }, [urlParams]);

    React.useEffect(() => {
        if (props.examData){setShiftList(props.examData.shifts)}
    }, [props.examData]);

    // react-form
    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        const exam_data = Object.keys(data).filter(key => !key.includes('&')).reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
        const shift_data = Object.keys(data).filter(key => key.includes('&')).reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
        post(exam_data).then((exam)=>{
            // for converting shift data to list of shifts
            let index= 0;
            const result = Object.entries(shift_data).reduce((acc, [key, value]) => ((index = key.split('&')[1]), (acc[index] = { ...acc[index], [key.split('&')[0]]: value, exam_id: exam.id }), acc), []);
            post_shift(result).then((value)=>{
                console.log(value)
                exam['shifts'] = value
                props.setExam(exam)
                props.setStep(2)
            })
        })
    };
    const onError = (errors, e) => {console.log(errors);};

    return(
        <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
            <Paper style={{ padding: 16, marginTop:20,}}>
                <Grid container alignItems="flex-start" spacing={4} py={3} px={11}>
                    <Grid item xs={12}>
                        <Typography variant="h3">Client Name</Typography>
                        <Select {...register('client_id')} required ref={selectRef} displayEmpty onClick={(e)=>{selectRef.current.value = e.target.value;}} defaultValue={props.examData ? props.examData['client_id'] : ""} sx={{minWidth:"250px"}}>
                            <MenuItem disabled value=""><Typography color="text.disabled">Select Client</Typography></MenuItem>
                            {clientName.map((client,index)=>
                                <MenuItem value={client.id}>{client.name}</MenuItem>
                            )}
                        </Select>
                        <Button color="primary" size="small" variant='outlined' sx={{padding:"10px 25px", margin:"0px 50px"}} onClick={()=>{navigate('/')}}>Add Client</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">Exam Name</Typography>
                        <TextField {...register('name', { required: true })} required defaultValue={props.examData ? props.examData.name : null} placeholder="Enter Name"/>
                    </Grid>
                    <Grid item xs={4} >
                        <Typography variant="h3">Exam Code</Typography>
                        <Stack direction="row" gap={1}>
                            <TextField id="exam_code" {...register('code')} required defaultValue={props.examData ? props.examData.code : ""} placeholder="Enter Code"/>
                            <Button variant="outlined" color="secondary" onClick={()=>{document.getElementById("exam_code").value = Math.random().toString(36).slice(8);document.getElementById("exam_code").focus()}}>Generate Code</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h3">Post</Typography>
                        <TextField {...register('post')} required defaultValue={props.examData ? props.examData.post : ""} placeholder="Enter Post"/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h3">Exam Type</Typography>
                        <Select {...register('type')} required ref={selectRef} displayEmpty onClick={(e)=>{selectRef.current.value = e.target.value;}} defaultValue={props.examData ? props.examData.type : ""} sx={{minWidth:"250px"}} placeholder='Select Exam Type'>
                            <MenuItem disabled value=""><Typography color="text.disabled">Select Exam</Typography></MenuItem>
                            <MenuItem value={'live'}>live</MenuItem>
                            <MenuItem value={'alpha'}>alpha</MenuItem>
                            <MenuItem value={'beta'}>beta</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">Description</Typography>
                        <TextField
                            fullWidth
                            {...register('description')}
                            defaultValue={props.examData ? props.examData.description : ""}
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            placeholder="Enter Description for exam"
                        />
                    </Grid>

                    {shiftList.map((value,index) =>
                        <Grid item xs={12}>
                            <Stack alignItems="center" direction="row" justifyContent={"space-between"}>
                                <div>
                                    <Typography variant="h3">Shift Code</Typography>
                                    <Stack direction="row" gap={1}>
                                        <TextField ref={selectRef} id={`code_${index}`} {...register(`code&${index}`)} required variant="outlined" defaultValue={value['code']} onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
                                        <Button variant="outlined" color="secondary" onClick={()=>{document.getElementById(`code_${index}`).value = Math.random().toString(36).slice(8);document.getElementById(`code_${index}`).focus()}}>Generate</Button>
                                    </Stack>
                                </div>
                                <div>
                                    <Typography variant="h3">Date</Typography>
                                    <TextField ref={selectRef} type='date' InputLabelProps={{ shrink: true, required: true }} {...register(`date&${index}`, { required: true })} defaultValue={value['date']} required variant="outlined" onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
                                </div>
                                <div>
                                    <Typography variant="h3">Start Time</Typography>
                                    <TextField ref={selectRef} type='time' InputLabelProps={{ shrink: true, required: true }} {...register(`start_time&${index}`, { required: true })} defaultValue={value['start_time']} required variant="outlined" onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
                                </div>
                                <div>
                                    <Typography variant="h3">End Time</Typography>
                                    <TextField ref={selectRef} type='time' InputLabelProps={{ shrink: true, required: true }} {...register(`end_time&${index}`, { required: true })} defaultValue={value['end_time']} required variant="outlined" onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
                                </div>
                                <div style={{display:"flex",flexDirection:"column",marginTop:"auto",cursor:"pointer"}}>
                                    {index>0 ? 
                                        <RemoveCircleOutline fontSize='large' onClick={()=>{removeShift(index)}}/>
                                    :null
                                    }
                                    <AddCircleOutline fontSize='large' onClick={addShift}/>
                                </div>
                            </Stack>
                        </Grid>
                    )}
                    
                    <Grid item style={{ marginTop: 30 }}>
                        <Stack alignItems="center" direction="row" gap={3}>
                            <Button variant="outlined" color="secondary" onClick={(e) => {props.setOpen(true)}}>Cancel</Button>
                            {/* <Button variant="outlined" color="secondary" onClick={(e) => {setModalOpen(true)}}>Save Draft</Button> */}
                            <Button variant="contained" color="secondary" type="submit">Next</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )

}

export default Main;
