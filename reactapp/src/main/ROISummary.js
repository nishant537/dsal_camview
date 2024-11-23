import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Cancel} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot, TimelineItem } from '@mui/lab';

// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();

    const [modalOpen, setModalOpen] = React.useState(false);    
    const [featureSelected, setFeatureSelected] = React.useState(0);    

    const columns = [
    { 
        field: 'id', 
        flex:1, 
        renderHeader:() => (<Typography variant="h3" component="span">#</Typography>)
    },
    {
        field: 'name',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">CENTER NAME</Typography>),
        renderCell: (params) => {return <a href={`/center?name__like=${params.value}`}>{params.value}</a>}
    },
    {
        field: 'location',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">LOCATION</Typography>)
    },
    {
        field: 'classroom',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">CLASSROOM</Typography>),
        renderCell: (params) => {
            return (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                    <span style={{fontSize:"25px"}}>{params.value===undefined ? 0 : Object.values(params.value).reduce((acc, val) => acc + val, 0)}</span>
                    <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                        {   
                            Object.entries(params.value===undefined ? {"true":0,"false":0,"null":0} : params.value).map(([key, value])=>(
                                <div style={{"display":"flex", 'gap':"10px"}}>
                                    <span style={{fontSize:"25px"}}>{value}</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: key==="unmarked" ? 'grey': key==="marked" ? "yellow" : key==="approved" ? "green" : key=="rejected" ? "red" : null,}}/>
                                </div>
                            ))
                        }
                    </Stack>
                </div>
            )
        },
    },
    {
        field: 'entry_exit',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">ENTRY-EXIT</Typography>),
        renderCell: (params) => {
            return (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                    <span style={{fontSize:"25px"}}>{params.value===undefined ? 0 : Object.values(params.value).reduce((acc, val) => acc + val, 0)}</span>
                    <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                        {   
                            Object.entries(params.value===undefined ? {"true":0,"false":0,"null":0} : params.value).map(([key, value])=>(
                                <div style={{"display":"flex", 'gap':"10px"}}>
                                    <span style={{fontSize:"25px"}}>{value}</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: key==="unmarked" ? 'grey': key==="marked" ? "yellow" : key==="approved" ? "green" : key=="rejected" ? "red" : null,}}/>
                                </div>
                            ))
                        }
                    </Stack>
                </div>
            )
        },
    },
    {
        field: 'control_room',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">CONTROL-ROOM</Typography>),
        renderCell: (params) => {
            return (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                    <span style={{fontSize:"25px"}}>{params.value===undefined ? 0 : Object.values(params.value).reduce((acc, val) => acc + val, 0)}</span>
                    <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                        {   
                            Object.entries(params.value===undefined ? {"true":0,"false":0,"null":0} : params.value).map(([key, value])=>(
                                <div style={{"display":"flex", 'gap':"10px"}}>
                                    <span style={{fontSize:"25px"}}>{value}</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: key==="unmarked" ? 'grey': key==="marked" ? "yellow" : key==="approved" ? "green" : key=="rejected" ? "red" : null,}}/>
                                </div>
                            ))
                        }
                    </Stack>
                </div>
            )
        },
    },
    ];

    const rows = [
    { id: 1, code: '1350',name: "ABC school", location: "Noida, Delhi", classroom:{"unmarked":2,"marked":1,"approved":1,"rejected":1},entry_exit:{"unmarked":2,"marked":1,"approved":1,"rejected":1},control_room:{"unmarked":2,"marked":1,"approved":1,"rejected":1}}
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
                <TextField sx={{width: "450px",my:2,mr:4 }} id="outlined-search" placeholder='Seach Center by Code, Name, Location' type="search" InputProps={{
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
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <FilterAlt color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Centers : </Typography>
                                <Typography variant="h3">150</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <LibraryBooks color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>ROIs Marked: </Typography>
                                <Typography variant="h3">2550/2700</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <Cancel color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Cameras : </Typography>
                                <Typography variant="h3">1250</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <CheckBox color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>ROIs approved : </Typography>
                                <Typography variant="h3">2400</Typography>
                            </Stack>
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
    
    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"}>
                    ROI Summary
                </Typography>
                

                <div style={{height:"100%",width:"100%"}}>
                    <DataGrid
                        sx={{
                            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                            outline: 'none',
                            },
                            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                            {
                                outline: 'none',
                            },
                        }}
                        // sx={{height:"100%"}}
                        rows={rows}
                        columns={columns}
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
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </div>

            </Box>
        </>
    );
    
}

export default Main;
