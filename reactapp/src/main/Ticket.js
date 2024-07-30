import React, { useRef } from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem,ToggleButtonGroup,ToggleButton, Pagination, PaginationItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Edit,ArrowBack, ArrowForward, Cancel} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';

import {get, post_activity, del} from '../provider/ticket_provider';
import { useForm } from 'react-hook-form'
import dateFormat, { masks } from "dateformat";

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectRef = useRef(null);

    const [modalOpen, setModalOpen] = React.useState(false);    
    const [edit, setEdit] = React.useState(false)
    const [alignment2, setAlignment2] = React.useState("image");    
    const handleToggleChange2 = (event, newAlignment) => {
        if (newAlignment!=null){
          setAlignment2(newAlignment);
        }
    };
    const [urlParams, setUrlParams] = React.useState(()=>{
        const data = new URLSearchParams(window.location.search)
        return data.toString()
    })
    const [data, setData] = React.useState([{"id":1,"activity":[{}],"alert":{}}])
    const [ticketDetails, setTicketDetails] = React.useState(0)

    React.useEffect(() => {
        get(urlParams).then((value)=>{
            if (value){
                console.log(JSON.stringify(value))
                setData(value)
                setTicketDetails(0)
            }
        })
      }, []);

    const {register, handleSubmit} = useForm()
    const onSubmit = (formData, e) => {
        formData['ticket_id'] = data[ticketDetails]['id']
        post_activity(formData).then((value)=>{
            console.log(value)
            // need refresh or correct this portion
            const temp = Object.assign({},data[ticketDetails])
            temp['activity'].unshift(value)
            setTicketDetails(temp)
            setEdit(!edit)
        })
    };
    const onError = (errors, e) => {
        alert(errors)
    };


    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,} }}
            >
                <Toolbar />

                {/* <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"}>
                    Ticket #{data[0]['id']}
                </Typography> */}

                <Box my={4}>
                    <Paper component="form" sx={{padding:"20px"}} onSubmit={handleSubmit(onSubmit, onError)}>
                        <div style={{display:"flex",alignItems:"center", justifyContent:"space-between"}}>
                            <Stack direction="row" spacing={3} py={2}>
                                <Typography variant="h2">#{data[ticketDetails]['alert_id']} {data[ticketDetails]['feature']} Alert</Typography>
                                <Button color="primary" variant="contained">{data[ticketDetails]['activity'][0]['status']}</Button>
                            </Stack>
                            <Stack direction="row" spacing={5} alignItems={"center"}>
                                <Pagination count={data.length} color="primary" showFirstButton showLastButton onChange={(event,value)=>{setTicketDetails(value-1)}}/>

                                <Stack direction="row" spacing={3} py={2}>
                                    <Button color="primary" variant="outlined" startIcon={edit ? <Cancel/> : <Edit/>} onClick={()=>{setEdit(!edit)}}>{edit ? "Cancel" : "Edit"}</Button>
                                    {edit ? <Button color="primary" variant="contained" type="submit">Submit</Button> : null}
                                </Stack>
                            </Stack>
                            
                        </div>
                        <Divider/>
                        <div style={{display:"flex",alignItems:"center"}}>
                            <div style={{width:"70%",display:"flex",flexDirection:"column", gap:"20px", padding:"20px 0 "}}>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Status :</Typography>
                                    
                                    {edit ? 
                                        <Select {...register('status')} required ref={selectRef} displayEmpty onClick={(e)=>{selectRef.current.value = e.target.value;}} defaultValue={""} sx={{minWidth:"250px"}}>
                                            <MenuItem disabled value=""><Typography color="text.disabled">Select Status</Typography></MenuItem>
                                            <MenuItem value={'new'}>New</MenuItem>
                                            <MenuItem value={'open'}>Open</MenuItem>
                                            <MenuItem value={'resolved'}>Resolved</MenuItem>
                                        </Select>
                                    :
                                        <Button color="primary" variant="contained">{data[ticketDetails]['activity'][0]['status']}</Button>
                                    }

                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Category :</Typography>
                                    <Typography variant="h2">{data[ticketDetails]['feature']}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Timestamp :</Typography>
                                    <Typography variant="h2">{data[ticketDetails]['activity'][0]['last_updated'] ? data[ticketDetails]['activity'][0]['last_updated'].replace('T', ' ') : ""}</Typography>
                                    {/* <Typography variant="h2">{data[ticketDetails]['activity'][0]['last_updated'] ? (dateFormat(new Date(data[ticketDetails]['activity'][0]['last_updated']), "hh:mm:ss TT yyyy-mm-dd")).toString() : ""}</Typography> */}
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Priority :</Typography>
                                    <Typography variant="h2">{data.length<=2 ? "Minor" : data.length<=5 ? "Moderate" : data.length<=10 ? "Major" : "Critical"}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{overflowWrap:"anywhere"}}>
                                    <Typography variant="h2" color={theme.palette.text.disabled} sx={{textWrap:"nowrap"}}>Description :</Typography>
                                    <Typography variant="h2">Alert Detected at {data[ticketDetails]['alert']['center']} on {data[ticketDetails]['alert']['camera']}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{overflowWrap:"anywhere"}}>
                                    <Typography variant="h2" color={theme.palette.text.disabled} sx={{textWrap:"nowrap"}}>Comment :</Typography>
                                    {edit ? 
                                        <TextField
                                            {...register('comment')}
                                            sx={{width:"60%"}}
                                            id="outlined-multiline-static"
                                            multiline
                                            rows={4}
                                            placeholder="Enter Description for Ticket"
                                        />
                                    :
                                        <Typography variant="h2">{data[ticketDetails]['activity'][0]['comment']===null ? "-" : data[ticketDetails]['activity'][0]['comment']}</Typography>
                                    }
                                </Stack>
                            </div>
                            <Stack direction="column" gap={1} sx={{width:"30%"}}>
                                <ToggleButtonGroup color="secondary" value={alignment2} fullWidth exclusive onChange={handleToggleChange2} aria-label="Platform" style={{width:"100%"}}>
                                    <ToggleButton value="image" id="alert_image">Image</ToggleButton>
                                </ToggleButtonGroup>
                                <div style={{height:'250px',position:"relative",alignContent:"center",textAlign:"center"}}>
                                    <img src={data[ticketDetails]['alert']['image_path']} alt="Ticket view" style={{maxWidth:"100%",maxHeight:"100%",height:"auto",width:"auto"}} />
                                </div>
                            </Stack>
                        </div>
                    </Paper>
                </Box>

                <Typography variant="h2">Activity</Typography>
                <div style={{overflowY:"scroll",minHeight:"200px"}}>
                    {data.slice(ticketDetails).map((ticket,ticketIndex)=> 

                        ticket['activity'].map((key,value)=>
                        // <Typography variant="h2" color={theme.palette.text.disabled}>Ticket #{key['id']} status updated to <u>{key['status']}</u> at <u>{key['last_updated'] ? (dateFormat(new Date(key['last_updated']), "hh:mm:ss TT yyyy-mm-dd")).toString() : ""}.</u></Typography>
                        <Typography variant="h2" color={theme.palette.text.disabled}>Ticket #{data[0]['id']} status updated to <u>{key['status']}</u> at <u>{key['last_updated'] ? key['last_updated'].replace('T', ' ') : ""}.</u></Typography>
                        )
                        
                    )}
                </div>
            </Box>
        </>
    );
    
}

export default Main;
