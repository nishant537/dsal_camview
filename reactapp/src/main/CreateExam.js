// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import StepProgressBar from "../components/StepProgressBar"
import { useNavigate } from 'react-router-dom';
import {get as get_client} from '../provider/client_provider';
import {get_exam, post, del} from '../provider/exam_provider';
import {post as post_shift} from '../provider/shift_provider';
import { useForm } from 'react-hook-form'
import WarningDialog from '../components/WarningDialog'
import ExamSetup from '../components/ExamSetup'
import InstancePlan from '../components/InstancePlan'
import InstanceSetup from '../components/InstanceSetup'
import ExamUpload from '../components/ExamUpload'



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
    const [clientName, setClientName] = React.useState([])
    const [examData, setExamData] = React.useState(null)

    React.useEffect(() => {
        if (window.location.pathname.split("/").length>2){
            get_exam(window.location.pathname.split("/")[2]).then((value)=>{
                if (value){
                    console.log(value)
                    setExamData(value)
                }
            })
        }
      }, [urlParams]);

    console.log(examData)
    return(
        <>

            <WarningDialog open={modalOpen} setOpen={setModalOpen}/>

            {/* EXAM PREVIEW */}
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


                <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0",width:"100%"}}>
                    <div style={{width:"80%",maxWidth:"900px"}}>
                        <div style={{width:"100%"}}>
                            <StepProgressBar percent={step*25} />
                        </div>
                    </div>
                </div>

                {
                    step===1 ?
                    <ExamSetup setOpen={setModalOpen} setStep={setStep} examData={examData} setExam={setExamData}/>
                    :
                    step===2 ?
                    <InstancePlan setOpen={setModalOpen} setStep={setStep} examData={examData} setExam={setExamData}/>
                    :
                    step===3 ?
                    <InstanceSetup setOpen={setModalOpen} setStep={setStep} examData={examData} setExam={setExamData}/>
                    :
                    <ExamUpload/>
                }
            </Box>
        </>
    )

}

export default Main;
