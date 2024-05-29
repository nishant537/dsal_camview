// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import StepProgressBar from "../components/StepProgressBar"
import { useNavigate } from 'react-router-dom';
import {get, post, del} from '../provider/exam_provider';
import { useForm } from 'react-hook-form'



// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectRef = useRef(null);

    const [step,setStep] = React.useState(1)
    const [modalOpen, setModalOpen] = React.useState(false);    
    const [previewOpen, setPreviewOpen] = React.useState(false);    
    const [urlParams, setUrlParams] = React.useState("")
    const [activeIndex, setActiveIndex] = React.useState("create");    
    const [selectedClient, setSelectedClient] = React.useState("");  
    // ----------------------  
    const [shiftList, setShiftList] = React.useState(()=>{
        return [{"date":"","start_time":"","end_time":""}]
    })
    const addShift = () => {
        setShiftList(shiftList.concat([{"date":"","start_time":"","end_time":""}]))
    }
    const removeShift = (index) => {
        const list = [].concat(shiftList)
        list.splice(index,1)
        setShiftList(list)
    }
    // ----------------------
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
    // -----------------------

    // React.useEffect(() => {
    //     get((urlParams)).then((value)=>{
    //         if (value){
    //             setRows(value)
    //         }
    //     })
    //   }, [urlParams]);

    // react-form
    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {alert('hi');console.log(data);setStep(2)};
    const onError = (errors, e) => {console.log(errors);setStep(2)};

    // STEP 4
    const [selectedList, setSelectedList] = React.useState("")
    const [selectedTemplate, setSelectedTemplate] = React.useState("")

    const handleselectedFile = (e) => {
        setSelectedList(e.target.files[0].name)
    }
    const handleselectedTemplate = (e) => {
        setSelectedTemplate(e.target.files[0].name)
    }
    // ----------------------------------------------

    return(
        <>

            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, textAlign:"center",}}>
                    <img src="warning.png" class="custom-logo" alt=""></img>
                    <Divider/>

                    <Typography id="modal-modal-description" sx={{ p: 2 }}>
                        Are you sure you want to cancel? Any unsaved changes will be lost.
                    </Typography>

                    <Stack alignItems="center" direction="row" justifyContent={"space-around"}>
                        <Button color="primary" size="small" variant='outlined' sx={{padding:"10px 25px"}} >No</Button>
                        <Button color="primary" size="small" variant='contained' sx={{padding:"10px 25px"}} >Yes</Button>
                    </Stack>
                </Box>
            </Modal>

            <Modal
                open={previewOpen}
                onClose={() => {setPreviewOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* for shift page preview, redirect to shift page with results filtered with this exam OR load data here. */}
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, textAlign:"center",}}>
                    {/* <Typography variant="h2" component="div">BPSC March 24</Typography>
                    <Typography variant="h3" component="div">BPSC-ABX2024</Typography>
                    
                    <Stack direction={"row"} gap={1}>
                        <Grid container alignItems="flex-start">

                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Centers : </Typography>
                                    <Typography variant="h3">150</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Date Range : </Typography>
                                    <Typography variant="h3">17/03/24 - 19/03/24</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Cameras : </Typography>
                                    <Typography variant="h3">1250</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Shifts : </Typography>
                                    <Typography variant="h3">8</Typography>
                                </Stack>
                            </Grid>

                        </Grid>

                        <Grid container alignItems="flex-start">

                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ZI : </Typography>
                                    <Typography variant="h3">300</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>CD : </Typography>
                                    <Typography variant="h3">300</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>INV </Typography>
                                    <Typography variant="h3">300</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Tampering : </Typography>
                                    <Typography variant="h3">300</Typography>
                                </Stack>
                            </Grid>

                        </Grid>
                    </Stack>

                    <DataGrid                        
                        rows={rows}
                        columns={columns}
                        // initialState={{
                        // pagination: {
                        //     paginationModel: {
                        //     pageSize: 5,
                        //     },
                        // },
                        // }}
                        // autoHeight={true}
                        slots={{
                            toolbar: CustomToolbar,
                            footer: CustomFooter,
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    /> */}
                </Box>
            </Modal>


            {/* ------------------------- */}

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", color:"#8b83ba"},} }}
            >
                <Toolbar />

                

                <Grid container gap={1} sx={{alignItems:"center",justifyContent:"space-around"}}>
                    <Grid item xs={5} sx={{display:"flex",placeContent:"center",borderBottom:"5px solid"}} color={activeIndex==="view" ? theme.palette.primary.main : theme.palette.text.disabled} onClick={()=>{navigate('/exam')}}>
                        <Typography variant="h1" noWrap component="span">
                            View Exam
                        </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{display:"flex",placeContent:"center",borderBottom:"5px solid"}} color={activeIndex==="create" ? theme.palette.primary.main : theme.palette.text.disabled} onClick={()=>{setActiveIndex("create")}}>
                        <Typography variant="h1" noWrap component="span">
                            Create Exam
                        </Typography>
                    </Grid>
                </Grid>


                <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
                    <Paper style={{ padding: 16, marginTop:20,}}>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0",width:"100%"}}>
                            <div style={{width:"80%",maxWidth:"900px"}}>
                                <div style={{width:"100%"}}>
                                    <StepProgressBar percent={step*25} />
                                </div>
                            </div>
                        </div> 
                        <Divider/>

                        {step===1 ? 
                            <Grid container alignItems="flex-start" spacing={4} py={3} px={11}>
                                <Grid item xs={12}>
                                    <Typography variant="h3">Client Name</Typography>
                                    <Select {...register('client_name', { required: true })} required ref={selectRef} displayEmpty onClick={(e)=>{selectRef.current.value = e.target.value;}} defaultValue={""} sx={{minWidth:"250px"}}>
                                        <MenuItem disabled value=""><Typography color="text.disabled">Select Client</Typography></MenuItem>
                                        <MenuItem value={'nishant'}>Nishant</MenuItem>
                                        <MenuItem value={'akshay'}>Akshay</MenuItem>
                                    </Select>
                                    <Button color="primary" size="small" variant='outlined' sx={{padding:"10px 25px", margin:"0px 50px"}} onClick={()=>{navigate('/')}}>Add Client</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h3">Exam Name</Typography>
                                    <TextField {...register('Name', { required: true })} required placeholder="Name"/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h3">Exam Code</Typography>
                                    <TextField  {...register('code', { required: true })} required placeholder="ABX-3241"/>
                                    
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h3">Post</Typography>
                                    <TextField {...register('post', { required: true })} required placeholder="Enter Post"/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h3">Exam Type</Typography>
                                    <Select {...register('type', { required: true })} required ref={selectRef} displayEmpty onClick={(e)=>{selectRef.current.value = e.target.value;}} defaultValue={""} sx={{minWidth:"250px"}} placeholder='Select Exam Type'>
                                        <MenuItem disabled value=""><Typography color="text.disabled">Select Exam</Typography></MenuItem>
                                        <MenuItem value={'JEE'}>JEE</MenuItem>
                                        <MenuItem value={'NEET'}>NEET</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h3">Description</Typography>
                                    <TextField
                                        fullWidth
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
                                                <Typography variant="h3">Date Range</Typography>
                                                <TextField ref={selectRef} id="startDate" type='date' InputLabelProps={{ shrink: true, required: true }} {...register(`date&${index}`, { required: true })} required variant="outlined" onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
                                            </div>
                                            <div>
                                                <Typography variant="h3">Shift 1</Typography>
                                                <TextField ref={selectRef} id="startDate" type='time' InputLabelProps={{ shrink: true, required: true }} {...register(`start_time&${index}`, { required: true })} required variant="outlined" onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
                                            </div>
                                            <div>
                                                <Typography variant="h3">Shift 2</Typography>
                                                <TextField ref={selectRef} id="startDate" type='time' InputLabelProps={{ shrink: true, required: true }} {...register(`end_time&${index}`, { required: true })} required variant="outlined" onChange={(e) => {selectRef.current_value = e.target.value}} sx={{width:'200px'}}/>
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
                                        <Button variant="outlined" color="secondary" onClick={(e) => {setModalOpen(true)}}>Cancel</Button>
                                        <Button variant="outlined" color="secondary" onClick={(e) => {setModalOpen(true)}}>Save Draft</Button>
                                        <Button variant="contained" color="secondary" type="submit" onClick={()=>setStep(2)}>Next</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        :
                        step===2 ? 
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
                                        <Button variant="outlined" color="secondary" onClick={() => {setStep(1)}}>Back</Button>
                                        <Button variant="contained" color="secondary" onClick={() => {setStep(3)}}>Next</Button>
                                    </Stack>
                                </Grid>

                            </Grid>
                        :
                        step===3 ?
                            <Grid container alignItems="flex-start" spacing={5} py={3} px={11}>

                                {instanceList.map((value,index)=>
                                    <Grid item xs={12}>
                                        <Typography variant="h3">Instance {index}</Typography>
                                        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                                            <TextField {...register(`instance_${index}`, { required: true })} required placeholder="Enter Key"/>
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
                                        <Button variant="outlined" color="secondary" onClick={() => {setStep(2)}}>Back</Button>
                                        <Button variant="contained" color="secondary" type="submit" onClick={() => {setStep(4)}}>Next</Button>
                                    </Stack>
                                </Grid>

                            </Grid>
                        :
                        step===4 ?
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
                                                <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleselectedFile} style={{clip: 'rect(0 0 0 0)',clipPath: 'inset(50%)',height: 1,overflow: 'hidden',position: 'absolute',bottom: 0,left: 0,whiteSpace: 'nowrap',width: 1,}}/>
                                            </Button>
                                            {selectedList!==""? <Typography variant="h3" color={theme.palette.text.disabled} component="span">Uploaded File: {selectedList}</Typography> : null}
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
                                                <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  onChange={handleselectedTemplate} style={{clip: 'rect(0 0 0 0)',clipPath: 'inset(50%)',height: 1,overflow: 'hidden',position: 'absolute',bottom: 0,left: 0,whiteSpace: 'nowrap',width: 1,}}/>
                                            </Button>
                                            {selectedTemplate!==""? <Typography variant="h3" color={theme.palette.text.disabled} component="span">Uploaded File: {selectedTemplate}</Typography> : null}
                                            <Typography variant="h3" color={theme.palette.text.disabled} component="span">Supported Format : XLSX, XLS, CSV</Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                                <Stack alignItems="center" direction="row" gap={5} m={4}>
                                    <Button variant="outlined" color="secondary" onClick={() => {setStep(3)}}>Back</Button>
                                    <Button variant="outlined" color="secondary">Save Draft</Button>
                                    <Button variant="contained" color="secondary" type="submit" onClick={() => {navigate('/shift')}}>Preview</Button>
                                </Stack>
                            </Box>
                        :
                        null
                        }
                    </Paper>
                </Box>
            </Box>
        </>
    )

}

export default Main;
