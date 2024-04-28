import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot } from '@mui/lab';

// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();

    const [modalOpen, setModalOpen] = React.useState(false);    

    const columns = [
    { 
        field: 'id', 
         
        renderHeader:() => (<Typography variant="h3" component="span">#</Typography>)
    },
    {
        field: 'code',
        
        renderHeader:() => (<Typography variant="h3" component="span">CENTRE CODE</Typography>),
        renderCell: (params) => {return <a href="hi">{params.value}</a>},
    },
    {
        field: 'total',
        
        renderHeader:() => (<Typography variant="h3" component="span">TOTAL</Typography>),
        renderCell: (params) => {
            return (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                    <span style={{fontSize:"25px"}}>9</span>
                    <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                        {
                            ['unmarked','marked','approved','rejected'].map((value, index)=>(
                                <div style={{"display":"flex", 'gap':"10px"}}>
                                    <span style={{fontSize:"25px"}}>9</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: value==="unmarked" ? 'grey': value==="marked" ? 'yellow': value==="approved" ? "green" : value==="rejected" ? "red" : null,}}/>
                                </div>
                            ))
                        }
                    </Stack>
                </div>
            )
        },
    },
    {
        field: 'reviewed',
        
        renderHeader:() => (<Typography variant="h3" component="span">REVIEWED</Typography>)
    },
    {
        field: 'zi_main_gate',
        
        renderHeader:() => (<Typography variant="h3" component="span">MAIN GATE</Typography>)
    },
    {
        field: 'zi_control_room',
        
        renderHeader:() => (<Typography variant="h3" component="span">CONTROL ROOM</Typography>)
    },
    {
        field: 'cd_main_gate',
        
        renderHeader:() => (<Typography variant="h3" component="span">MAIN GATE</Typography>),
    },
    {
        field: 'cd_control_room',
        
        renderHeader:() => (<Typography variant="h3" component="span">CONTROL ROOM</Typography>),
    },
    {
        field: 'fop_class',
        
        renderHeader:() => (<Typography variant="h3" component="span">CLASS</Typography>)
    },
    {
        field: 'inv_class',
        
        renderHeader:() => (<Typography variant="h3" component="span">CLASS</Typography>)
    },
    {
        field: 'camera_fault',
        
        renderHeader:() => (<Typography variant="h3" component="span">CAMERA FAULT</Typography>)
    },
    {
        field: 'activity',
        
        renderHeader:() => (<Typography variant="h3" component="span">LAST ACTIVITY</Typography>)
    },
    {
        field: 'status',
        
        renderHeader:() => (<Typography variant="h3" component="span">STATUS</Typography>),
        renderCell: (params) => {
            if (params.row.marked < params.row.total_roi){
                return (
                    <TimelineDot
                    sx={{ 
                        width: '5px',
                        backgroundColor: 'grey',
                    }}
                    />
                )
            }else if (params.row.rejected > 0){
                return (<TimelineDot
                    sx={{ 
                        width: '5px',
                        backgroundColor: 'red',
                    }}
                    />)
            }else if (params.row.approved < params.row.marked){
                return (<TimelineDot
                    sx={{ 
                        width: '5px',
                        backgroundColor: 'yellow',
                    }}
                    />)
            }else{
                return (<TimelineDot
                    sx={{ 
                        width: '5px',
                        backgroundColor: 'green',
                    }}
                    />)
            }
        },
    },
    ];

    const rows = [
    { id: 1, code: 1350, total: 140, reviewed: 70, zi_main_gate:14, zi_control_room: 14, cd_main_gate: 14, cd_control_room: 14, fop_class: 14, inv_class: 14, camera_fault: 100,activity: "50s ago"},
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
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Alerts: </Typography>
                                <Typography variant="h3">2550</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <Storage color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Cameras : </Typography>
                                <Typography variant="h3">1250</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <CheckBox color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total True Alerts : </Typography>
                                <Typography variant="h3">2700</Typography>
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

    const columnGroupingModel = [
        {
          groupId: 'Zone Intrusion',
          description: '',
          children: [{ field: 'zi_main_gate' },{ field: 'zi_control_room' }],
        },
        {
          groupId: 'Crowd Detection',
          children: [{ field: 'cd_main_gate' }, { field: 'cd_control_room' }],
        },
      ];
    
    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"}>
                    Alert Summary
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
                            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]:
                            {
                                borderRight: '1px solid #f0f0f0',
                            },
                            overflowX:'scroll',
                        }}
                        rowHeight={80}
                        rows={rows}
                        columns={columns}
                        columnGroupingModel={columnGroupingModel}
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
