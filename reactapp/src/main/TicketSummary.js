import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItemTable, Table,TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";

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
    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"}>
                    Ticket Summary
                </Typography>

                <Stack direction="row" justifyContent={"space-between"}>
                    <Stack direction="column">
                        <div style={{padding:"20px 0"}}>
                            <Typography variant="h2" noWrap component="div" color="primary">
                                Tickets
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" sx={{border:"2px solid black"}}>
                                    <TableHead sx={{borderBottom:"2px solid black"}}>
                                        <TableRow>
                                            <TableCell sx={{borderRight:"2px solid black"}}>Feature</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Location</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Timings</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Alert Threshold</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                        key={row.name}
                                        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell sx={{borderRight:"2px solid black"}} component="th" scope="row">
                                            {row.feature}
                                        </TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.location}</TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.timings}</TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.alert_threshold}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div>
                            <Typography variant="h2" noWrap component="div" color="primary">
                                Priority
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" sx={{border:"2px solid black"}}>
                                    <TableHead sx={{borderBottom:"2px solid black"}}>
                                        <TableRow>
                                            <TableCell sx={{borderRight:"2px solid black"}}>Feature</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Location</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Timings</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Alert Threshold</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                        key={row.name}
                                        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell sx={{borderRight:"2px solid black"}} component="th" scope="row">
                                            {row.feature}
                                        </TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.location}</TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.timings}</TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.alert_threshold}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Stack>

                    <Stack direction="column">
                        <div style={{padding:"20px 0"}}>
                            <Typography variant="h2" noWrap component="div" color="primary">
                                Tickets
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" sx={{border:"2px solid black"}}>
                                    <TableHead sx={{borderBottom:"2px solid black"}}>
                                        <TableRow>
                                            <TableCell sx={{borderRight:"2px solid black"}}>Feature</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Location</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Timings</TableCell>
                                            <TableCell sx={{borderRight:"2px solid black"}} >Alert Threshold</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                        key={row.name}
                                        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell sx={{borderRight:"2px solid black"}} component="th" scope="row">
                                            {row.feature}
                                        </TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.location}</TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.timings}</TableCell>
                                        <TableCell sx={{borderRight:"2px solid black"}} >{row.alert_threshold}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                    </Stack>
                </Stack>

            </Box>
        </>
    );
    
}

export default Main;
