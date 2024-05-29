import React, { useRef } from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem,ToggleButtonGroup,ToggleButton, Pagination, PaginationItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Edit,ArrowBack, ArrowForward} from "@mui/icons-material";
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
    const [data, setData] = React.useState([])
    const [ticketDetails, setTicketDetails] = React.useState({"activity":[{}],"alert":{}})

    React.useEffect(() => {
        get(urlParams).then((value)=>{
            if (value){
                console.log(value)
                setData(value)
                setTicketDetails(value[value.length - 1])
            }
        })
      }, []);

    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        data['ticket_id'] = ticketDetails['id']
        post_activity(data).then((value)=>{
            console.log(value)
            const temp = Object.assign({},ticketDetails)
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

                <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"}>
                    Ticket #{ticketDetails['id']}
                </Typography>

                <Box my={4}>
                    <Paper component="form" sx={{padding:"20px"}} onSubmit={handleSubmit(onSubmit, onError)}>
                        <div style={{display:"flex",alignItems:"center", justifyContent:"space-between"}}>
                            <Stack direction="row" spacing={3} py={2}>
                                <Typography variant="h2">#{ticketDetails['alert_id']} {ticketDetails['feature']} Alert</Typography>
                                <Button color="primary" variant="contained">{ticketDetails['activity'][0]['status']}</Button>
                            </Stack>
                            <Stack direction="row" spacing={5} alignItems={"center"}>
                                <Pagination count={data.length} color="primary" showFirstButton showLastButton onChange={(event,value)=>{setTicketDetails(data[value-1])}}/>

                                <Stack direction="row" spacing={3} py={2}>
                                    <Button color="primary" variant="outlined" startIcon={<Edit/>} onClick={()=>{setEdit(!edit)}}>Edit</Button>
                                    <Button color="primary" variant="contained" type="submit">Submit</Button>
                                </Stack>
                            </Stack>
                            
                        </div>
                        <Divider/>
                        <div style={{display:"flex",alignItems:"center"}}>
                            <div style={{width:"70%",display:"flex",flexDirection:"column", gap:"20px", padding:"20px 0 "}}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Status :</Typography>
                                    
                                    {edit ? 
                                        <Select {...register('status')} required ref={selectRef} displayEmpty onClick={(e)=>{selectRef.current.value = e.target.value;}} defaultValue={""} sx={{minWidth:"250px"}}>
                                            <MenuItem disabled value=""><Typography color="text.disabled">Select Status</Typography></MenuItem>
                                            <MenuItem value={'new'}>New</MenuItem>
                                            <MenuItem value={'open'}>Open</MenuItem>
                                            <MenuItem value={'resolved'}>Resolved</MenuItem>
                                        </Select>
                                    :
                                        <Button color="primary" variant="contained">{ticketDetails['activity'][0]['status']}</Button>
                                    }

                                </Stack>
                                {/* <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Priority :</Typography>
                                    <Typography variant="h2">Medium</Typography>
                                </Stack> */}
                                {/* <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Assignee :</Typography>
                                    <Typography variant="h2">User 12</Typography>
                                </Stack> */}
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Category :</Typography>
                                    <Typography variant="h2">{ticketDetails['feature']}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Timestamp :</Typography>
                                    <Typography variant="h2">{ticketDetails['activity'][0]['last_updated'] ? (dateFormat(new Date(ticketDetails['activity'][0]['last_updated']), "hh:mm:ss TT yyyy-mm-dd")).toString() : ""}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Priority :</Typography>
                                    <Typography variant="h2">{data.length<=2 ? "Minor" : data.length<=5 ? "Moderate" : data.length<=10 ? "Major" : "Critical"}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Description :</Typography>
                                    <Typography variant="h2">Alert Detected at {ticketDetails['alert']['center']} by {ticketDetails['alert']['camera']}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" color={theme.palette.text.disabled}>Comment :</Typography>
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
                                        <Typography variant="h2">{ticketDetails['activity'][0]['comment']}</Typography>
                                    }
                                </Stack>
                            </div>
                            <Stack direction="column" gap={1}>
                                <ToggleButtonGroup color="secondary" value={alignment2} fullWidth exclusive onChange={handleToggleChange2} aria-label="Platform" style={{width:"100%"}}>
                                    <ToggleButton value="image" id="alert_image">Image</ToggleButton>
                                    <ToggleButton value="video" id="alert_video">Video</ToggleButton>
                                </ToggleButtonGroup>
                                <img src="/alert.png" alt="Alert for Zone Intrusion"/>
                            </Stack>
                        </div>
                    </Paper>
                </Box>

                <Typography variant="h2">Activity</Typography>
                
                {ticketDetails['activity'].map((key,value)=>
                    <Typography variant="h2" color={theme.palette.text.disabled}>Ticket #{key['id']} status updated to <u>{key['status']}</u> at <u>{key['last_updated'] ? (dateFormat(new Date(key['last_updated']), "hh:mm:ss TT yyyy-mm-dd")).toString() : ""}.</u></Typography>
                )}
            </Box>
        </>
    );
    
}

export default Main;
