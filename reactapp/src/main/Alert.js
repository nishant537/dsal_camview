import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { LineChart } from '@mui/x-charts/LineChart';


// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();

    const [modalOpen, setModalOpen] = React.useState(false);    
    const [alignment, setAlignment] = React.useState("6H");    
    const [alignment2, setAlignment2] = React.useState("image");    
    const [alignment3, setAlignment3] = React.useState("true");    

    const columns = [
    { 
        field: 'id', 
        flex:1, 
        renderHeader:() => (<Typography variant="h3" component="span">ID</Typography>)
    },
    {
        field: 'center_name',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">NAME</Typography>)
    },
    {
        field: 'location',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">LOCATION</Typography>)
    },
    {
        field: 'feature_type',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">FEATURE</Typography>)
    },
    {
        field: 'timestamp',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">Time</Typography>)
    },
    {
        field: 'total_alert',
        flex:1,
        renderHeader:() => (<Typography variant="h3" component="span">PRIORITY</Typography>),
        renderCell: (params) => {
            return (
                <div style={{display:"flex",justifyContent:"center",height:"100%",alignItems:"center"}}>
                    <div style={{width:"20px", height:"20px", background:params.value===0 ? "#39d56f" : params.value<=2 ? "#86ed62" : params.value < 5 ? "#ffcd29" : params.value < 10 ? "#ffa629" : "#ff7250" ,borderRadius:"3px"}}></div>
                </div>
            )
        },
    },
    ];

    const rows = [
    { id: 1, center_name: '1350_ABC', location: 'Noida, Delhi', feature_type: 'Zone Intrusion', timestamp: "09:42:00 AM", total_alert:4},
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
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Clients : </Typography>
                                <Typography variant="h3">15</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <LibraryBooks color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Active Exams : </Typography>
                                <Typography variant="h3">3</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <Storage color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Instances : </Typography>
                                <Typography variant="h3">12</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <CheckBox color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Completed Exams : </Typography>
                                <Typography variant="h3">24</Typography>
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
                    <FormControl component="form" variant="outlined" onSubmit={props.submit}>
                        <Paper style={{ padding: 16,}}>

                            <Grid container alignItems="flex-start" spacing={2} p={3}>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Name</Typography>
                                    <TextField  name="company"  placeholder="Enter Client Name"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Address</Typography>
                                    <TextField  name="company"  placeholder="Enter Client Address"/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="outlined" color="primary" onClick="">Generate Code</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h3">Code</Typography>
                                    <TextField  name="company"  placeholder="Enter Client Code"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Username</Typography>
                                    <TextField  name="company"  placeholder="Enter Client Username"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Password</Typography>
                                    <TextField  name="company"  placeholder="Enter Client Password"/>
                                </Grid>
                                <Grid item style={{ marginTop: 30 }}>
                                    <Stack alignItems="center" direction="row" gap={3}>
                                        <Button variant="outlined" color="primary" onClick={(e) => {setModalOpen(false)}}>Cancel</Button>
                                        <Button variant="contained" color="primary" type="submit" onClick={(e) => {e.preventDefault();setModalOpen(true)}}>Create Client</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    </FormControl>
                </Box>
            </Modal>
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Stack direction="row">
                    <Box minWidth="50%" p={1}>
                        <Stack direction="column" alignItems="flex-end">
                            <ToggleButtonGroup
                                sx={{paddingX:"20px"}}
                                color="primary"
                                value={alignment}
                                exclusive
                                onChange={(e,newAlignment) => (setAlignment(newAlignment))}
                                aria-label="Platform"
                                >
                                <ToggleButton value="1H">1H</ToggleButton>
                                <ToggleButton value="4H">2H</ToggleButton>
                                <ToggleButton value="6H">6H</ToggleButton>
                                <ToggleButton value="12H">12H</ToggleButton>
                            </ToggleButtonGroup>
                            <LineChart
                                xAxis={[{ data: [7.00, 8.00, 9.00, 10.00, 11.00, 12.00, 13.00, 14.00, 15.00] }]}
                                series={[
                                    {
                                        label:"feature_1",
                                        curve:"linear",
                                        data: [27, 35, 28, 47, 23, 14,28, 45,28],
                                    },
                                    {
                                        label:"feature_2",
                                        curve:"linear",
                                        data: [22, 30, 23, 42, 18, 9,23, 40,23],
                                    },
                                    {
                                        label:"feature_3",
                                        curve:"linear",
                                        data: [2, 11, 13, 8, 29, 38,29, 34,20],
                                    },
                                ]}
                                height={300}
                                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                                grid={{ vertical: true, horizontal: true }}
                            />
                        </Stack>
                        
                    </Box>

                    <Box>
                        <Grid container spacing={1} rowSpacing={1}>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Total Alerts:</Typography>
                                        <Typography variant="h3" textAlign="right">1162</Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Camera Fault:</Typography>
                                        <Typography variant="h3" textAlign="right">1136</Typography>
                                    </Stack>
                                </Paper>
                                
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Furniture not Moving:</Typography>
                                        <Typography variant="h3" textAlign="right">26</Typography>
                                    </Stack>
                                </Paper>

                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Zone Intrusion:</Typography>
                                        <Typography variant="h3" textAlign="right">0</Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Loitering:</Typography>
                                        <Typography variant="h3" textAlign="right">10</Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Crowd Detection:</Typography>
                                        <Typography variant="h3" textAlign="right">12</Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Trunk Detection:</Typography>
                                        <Typography variant="h3" textAlign="right">122</Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Stack direction="column" p={2}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Invigilor not moving:</Typography>
                                        <Typography variant="h3" textAlign="right">0</Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>

                <Divider sx={{margin:"20px 0"}}/>

                <Stack direction="row" gap={2}>
                    <div style={{minWidth:"60%"}}>
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

                    <Stack direction="column" gap={1}>
                        <ToggleButtonGroup color="secondary" value={alignment2} exclusive onClick={(e,newAlignment)=>setAlignment2(newAlignment)} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="image" id="alert_image" style={{width:"50%"}}>Image</ToggleButton>
                            <ToggleButton value="video" id="alert_video" style={{width:"50%"}}>Video</ToggleButton>
                        </ToggleButtonGroup>
                        <img src="alert.png" alt="Alert for Zone Intrusion"/>
                        <Box container border={"1px solid #e8e8e8"} borderRadius={3} p={2}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <Stack direction="row" gap={1}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Event id : </Typography>
                                        <Typography variant="h3">12023</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack alignItems="center" direction="row" gap={1}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Center Name : </Typography>
                                        <Typography variant="h3">1350_ABC</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack alignItems="center" direction="row" gap={1}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Timestamp : </Typography>
                                        <Typography variant="h3">09:42:00 AM</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack alignItems="center" direction="row" gap={1}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Camera Name : </Typography>
                                        <Typography variant="h3">Server</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack alignItems="center" direction="row" gap={1}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>Alert Type : </Typography>
                                        <Typography variant="h3">Zone Intrusion</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack alignItems="center" direction="row" gap={1}>
                                        <Typography variant="h3" color={theme.palette.text.disabled}>State : </Typography>
                                        <Typography variant="h3">Delhi</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                        <ToggleButtonGroup color="secondary" value={alignment3} exclusive onClick={(e,newAlignment)=>setAlignment3(newAlignment)} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="true" id="alert_image" style={{width:"50%"}}>True</ToggleButton>
                            <ToggleButton value="false" id="alert_video" style={{width:"50%"}}>False</ToggleButton>
                        </ToggleButtonGroup>
                        <Button variant="contained" color="primary">Submit</Button>
                        
                    </Stack>
                </Stack>

            </Box>
        </>
    );
    
}

export default Main;
