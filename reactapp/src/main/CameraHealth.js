import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItemTable, Table,TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot, TimelineItem } from '@mui/lab';
import { PieChart } from '@mui/x-charts/PieChart';


// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();

    const [modalOpen, setModalOpen] = React.useState(false);    
    
    const rows = [
        {"feature":'Crowd Detection',"location": "entry exit","timings": "7:30 am to 8:45 am","alert_threshold": 15,},
        {"feature":'Zone Intrusion',"location": "entry exit","timings": "6:00 am to 7:30 am","alert_threshold": '',},
        {"feature":'Camera Fault',"location": "Question paper room","timings": "All times","alert_threshold": '',},
        {"feature":'Invigilator not moving',"location": "Classroom","timings": "9:00 am to 11:45 am","alert_threshold": '1 minute',},
    ];

    const columns = [
    {
        field: 'name',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">NAME</Typography>)
    },
    {
        field: 'location',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">Location</Typography>)
    },
    {
        field: 'status',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">STATUS</Typography>),
        renderCell: (params) => {
            return (
                <Stack direction="row" gap={1}>
                    {
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <div style={{display:"flex",alignItems:"center",padding:"0 10px",borderRadius:"10px",height:"50%",gap:"10px",backgroundColor: params.value==="unmarked" ? 'grey': params.value==="Black Screen" ? '#ffeccc': params.value==="Live" ? "#cdffcd" : params.value==="Offline" ? "#ffe0e0" : null}}>
                                <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: params.value==="unmarked" ? 'grey': params.value==="Black Screen" ? '#ce8500': params.value==="Live" ? "green" : params.value==="Offline" ? "red" : null,}}/>
                                {params.value}
                            </div>
                        </div>
                    }
                </Stack>
            )
        },
    },
    ];

    const detailedColumns = [
        {
            field: 'name',
            flex:1,
            headerAlign:"center",
            renderHeader:() => (<Typography variant="h3" component="span">NAME</Typography>)
        },
        {
            field: 'location',
            flex:1,
            headerAlign:"center",
            renderHeader:() => (<Typography variant="h3" component="span">Location</Typography>)
        },
        {
            field: 'status',
            flex:1,
            headerAlign:"center",
            renderHeader:() => (<Typography variant="h3" component="span">STATUS</Typography>),
            renderCell: (params) => {
                return (
                    <Stack direction="row" gap={1}>
                        {
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                <div style={{display:"flex",alignItems:"center",padding:"0 10px",borderRadius:"10px",height:"50%",gap:"10px",backgroundColor: params.value==="unmarked" ? 'grey': params.value==="Black Screen" ? '#ffeccc': params.value==="Live" ? "#cdffcd" : params.value==="Offline" ? "#ffe0e0" : null}}>
                                    <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: params.value==="unmarked" ? 'grey': params.value==="Black Screen" ? '#ce8500': params.value==="Live" ? "green" : params.value==="Offline" ? "red" : null,}}/>
                                    {params.value}
                                </div>
                            </div>
                        }
                    </Stack>
                )
            },
        },
        ];

    const gridRows = [
    { id: 1, name: '1350_ABC', location: 'Noida, Delhi', status: "Live" },
    { id: 2, name: '1351_XYZ', location: 'Noida, Delhi', status: "Offline" },
    { id: 3, name: '1352_ABCD', location: 'Noida, Delhi', status: "Black Screen" },
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

    const getDetailedRow = () => {
        return (
            <DataGridPro
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
                                background:"#f4f2ff",
                                textAlign:"center"
                            },
                        }}
                        hideFooter={true}
                        disableColumnFilter 
                        rows={gridRows}
                        columns={detailedColumns}
                        // initialState={{
                        // pagination: {
                        //     paginationModel: {
                        //     pageSize: 5,
                        //     },
                        // },
                        // }}
                        autoHeight={true}
                        pageSizeOptions={[5]}
                    />
        )
    }
    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"}>
                    Camera Health
                </Typography>

                <Stack direction="row" justifyContent={"space-between"} gap={2} pt={2}>
                    <DataGridPro
                        getDetailPanelContent={({ row }) => getDetailedRow()}
                        getDetailPanelHeight={({ row }) => 'auto'} // Height based on the content.
                        sx={{
                            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                            outline: 'none',
                            },
                            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                            {
                                outline: 'none',
                            },
                        }}
                        rows={gridRows}
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

                    <Stack direction="column" gap={5}>

                        <Box p={3} display={"flex"} flexDirection="column" gap={2} border={"1px solid #e8e8e8"} borderRadius={5}>
                            <Stack direction="row" justifyContent={"space-between"}>
                                <Typography variant="h2" noWrap component="span" color="primary">
                                    Camera Health
                                </Typography>
                                <Stack direction="column">
                                    <Typography variant="h3" noWrap component="span" color={theme.palette.text.disabled}>
                                        ABC School
                                    </Typography>
                                    <Typography variant="h3" noWrap component="span" color="primary">
                                        Total Cameras : 100
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider/>
                            <PieChart
                                series={[
                                    {
                                    // axisLabel: (item) => `${item.label} (${item.value})`,
                                    innerRadius: 80,
                                    outerRadius: 100,
                                    data: [
                                        { id: 0, value: 55, label: 'Live' },
                                        { id: 1, value: 31, label: 'Black Screen' },
                                        { id: 2, value: 14, label: 'Offline' },
                                    ],
                                    },
                                ]}
                                width={400}
                                height={200}
                            />
                        </Box>

                        <Box p={3} display={"flex"} flexDirection="column" gap={2} border={"1px solid #e8e8e8"} borderRadius={5}>
                            <Stack direction="row" justifyContent={"space-between"}>
                                <Typography variant="h2" noWrap component="span" color="primary">
                                    Offline Cameras
                                </Typography>
                                <Stack direction="column">
                                    <Typography variant="h3" noWrap component="span" color={theme.palette.text.disabled}>
                                        ABC School
                                    </Typography>
                                    <Typography variant="h3" noWrap component="span" color="primary">
                                        Total Cameras : 14
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider/>
                            <PieChart
                                series={[
                                    {
                                    innerRadius: 80,
                                    outerRadius: 100,
                                    data: [
                                        { id: 0, value: 7, label: 'Server Room' },
                                        { id: 1, value: 4, label: 'Main Gate' },
                                        { id: 2, value: 3, label: 'Classroom' },
                                    ],
                                    },
                                ]}
                                width={400}
                                height={200}
                            />
                        </Box>

                    </Stack>
                </Stack>

            </Box>
        </>
    );
    
}

export default Main;
