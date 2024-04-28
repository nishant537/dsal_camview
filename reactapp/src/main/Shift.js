import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, TableView, CalendarMonth, CameraAlt, WatchLater, Apartment} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";

import {get, post, del} from '../provider/shift_provider';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'


const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const [modalOpen, setModalOpen] = React.useState(false);    
    const [rows,setRows] = React.useState([])
    const [urlParams, setUrlParams] = React.useState("")
    const [filter, setFilter] = React.useState(()=>{
        const data = new URLSearchParams(window.location.search)
        const filterItems = [];
        for (let p of data) {
            filterItems.push({'field':p[0], "operator":'=', "value":p[1]});
        }
        return filterItems;
    })
    const [selectedRow, setSelectedRow] = React.useState(null)

    React.useEffect(() => {
        get((urlParams)).then((value)=>{
            if (value){
                setRows(value)
            }
        })
      }, [urlParams]);

    const columns = [
    { 
        field: 'id', 
        headerName: '#',  
        type: 'number',
        flex:0.3,
        minWidth:100, 
    },
    {
        field: 'code',
        headerName: 'SHIFT CODE',
        flex:1,
        minWidth:100,
        renderCell: (params) => {return <a href={`/exam?client_name=${params.value}`}>{params.value}</a>},
    },
    {
        field: 'exam_name',
        headerName: 'EXAM NAME',
        flex:1,
        minWidth:100,
    },
    {
        field: 'date',
        headerName: 'SHIFT DATE',
        flex:1,
        minWidth:100,
    },
    {
        field: 'start_time',
        headerName: 'SHIFT START',
        flex:1,
        minWidth:100,
    },
    {
        field: 'end_time',
        headerName: 'SHIFT END',
        type: 'number',
        flex:1,
        minWidth:100,
    },
    {
        field: 'centers',
        headerName: 'NO. OF CENTERS',
        type: 'number',
        flex:0.5,
        minWidth:100,
    },
    {
        field: 'cameras',
        headerName: 'NO. OF CAMERAS',
        type: 'number',
        flex:0.5,
        minWidth:100,
    },
    {
        field: 'feature_table',
        headerName: 'FEATURE TABLE',
        flex:0.5,
        renderCell: (params) => {return <div style={{textAlign:"center"}}><TableView onClick={()=>{navigate('/feature_table')}}/></div> },
    },
    ];

    function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <Stack alignItems="center" direction="row" gap={1}>
                <GridToolbarFilterButton
                    sx={{padding:"0 20px"}}
                    componentsProps={{
                        button: {
                            startIcon: (
                                <FilterAlt />
                            )
                        }
                    }}
                />
                <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} id="contained-search" variant="outlined" placeholder='Seach Centre by Code, Name, Location' type="search" InputProps={{
                    startAdornment: (
                        <InputAdornment>
                            <IconButton>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    )
                }}/>

                <div>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid container alignItems="flex-start">
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <CalendarMonth/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Date Range : </Typography>
                                    <Typography variant="h3">17/03/24 - 19/03/24</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <CameraAlt/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Cameras : </Typography>
                                    <Typography variant="h3">1250</Typography>
                                </Stack>
                            </Grid>                            
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <WatchLater/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Shifts : </Typography>
                                    <Typography variant="h3">8</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction={"row"} gap={1}>
                                    <Apartment/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Centres : </Typography>
                                    <Typography variant="h3">150</Typography>
                                </Stack>
                            </Grid>                            
                        </Grid>
                    </Grid>
                </div>
            </Stack>
        </GridToolbarContainer>
    );
    }
    function CustomFooter () {
    return (
        <GridFooterContainer sx={{backgroundColor:"#f4f2ff"}}>
        {/* Add what you want here */}
        <GridFooter sx={{
            border: 'none', // To delete double border.
            justifyContent:"space-between"
            }} />
        </GridFooterContainer>
    );
    }
    
    const onFilterModelChange = (newFilterModel) => {
        const data = new URLSearchParams();
        newFilterModel['items'].map((value, index)=>{
            if (value['value']){
                data.append(value['field'], value['value'])
            }
        })
        window.history.replaceState({}, '', `${window.location.pathname}?${data}`);
        setUrlParams(data.toString())
    }

    const {register, handleSubmit} = useForm([])
    const onSubmit = (data, e) => {alert('hi');post(data)};
    const onError = (errors, e) => {post(errors)};
    return(
        <>

            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24,}}>
                    <Typography variant="h1" color="primary" component="div" sx={{borderBottom:"5px solid"}} textAlign="center">
                        Client
                    </Typography>
                    <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
                        <Paper style={{ padding: 16,}}>

                            <Grid container alignItems="flex-start" spacing={2} p={3}>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Name</Typography>
                                    <TextField  {...register('Name', { required: true })} required defaultValue={selectedRow!==null ? selectedRow[0]['name'] : null} placeholder="Enter Client Name"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Address</Typography>
                                    <TextField  {...register('address', { required: true })} defaultValue={selectedRow!==null ? selectedRow[0]['address'] : null} required placeholder="Enter Client Address"/>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* button functionality not working as of now */}
                                    <Button variant="outlined" color="secondary" onClick="">Generate Code</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <Typography variant="h3">Code</Typography>
                                        <TextField  {...register('code', { required: true })} defaultValue={selectedRow!==null ? selectedRow[0]['code'] : null} required placeholder="Enter Client Code"/>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Username</Typography>
                                    <TextField  {...register('username', { required: true })} defaultValue={selectedRow!==null ? selectedRow[0]['username'] : null} required placeholder="Enter Client Username"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Password</Typography>
                                    <TextField  {...register('password', { required: true })} defaultValue={selectedRow!==null ? selectedRow[0]['password'] : null} required placeholder="Enter Client Password"/>
                                </Grid>
                                <Grid item style={{ marginTop: 30 }}>
                                    <Stack alignItems="center" direction="row" gap={3}>
                                        <Button variant="outlined" color="secondary" onClick={(e) => {setModalOpen(false)}}>Cancel</Button>
                                        <Button variant="contained" color="secondary" type="submit">Create Client</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Box>
            </Modal>
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"}>
                    Shift
                </Typography>
                <Typography variant="h2" noWrap component="div" textAlign={'center'} padding={2}>
                    BPSC Exam
                </Typography>

                <DataGridPro
                    sx={{
                        height:"100%",
                        [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                        outline: 'none',
                        },
                        [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                        {
                            outline: 'none',
                        },
                        [`& .${gridClasses.columnHeader}`]:
                        {
                            fontFamily: "Poppins",
                            fontSize: "1rem",
                            lineHeight: "2rem",
                            fontWeight:"500",
                            backgroundColor: '#f4f2ff',
                            color:"#8b83ba",
                        },
                        [`& .${gridClasses.cell}, & .${gridClasses.columnHeaderTitleContainer}`]: {
                            borderBottom: '1px solid #e8e8e8',
                            textAlign:"-webkit-center",
                            justifyContent:"center"
                        },
                        
                    }}
                    rows={rows}
                    columns={columns}
                    disableMultipleRowSelection={true}
                    // initialState={{
                    // pagination: {
                    //     paginationModel: {
                    //     pageSize: 5,
                    //     },
                    // },
                    // }}
                    autoHeight={true}
                    slots={{
                        toolbar: CustomToolbar,
                        footer: CustomFooter,
                    }}
                    pageSizeOptions={[5]}
                    // pageSize={100}
                    checkboxSelection
                    disableRowSelectionOnClick
                    
                    initialState={{
                        filter: {
                          filterModel: {
                            items: filter,
                          },
                        },
                    }}
                    filterMode='server'
                    onFilterModelChange={(newFilterModel) => onFilterModelChange(newFilterModel)}
                    onRowSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRowData = rows.filter((row) =>
                            (selectedIDs.has(row.id))
                        );
                        setSelectedRow(selectedRowData);
                    }}
                />  
            </Box>
        </>
    );
    
}

export default Main;
