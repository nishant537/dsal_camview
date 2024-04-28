import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton, Card, CardMedia, CardContent, CardActions,TablePagination, } from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Cancel, Delete} from "@mui/icons-material";
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
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10); 

    
    return(
        <>  
            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24,padding:"20px"}}>
                    <img src="sample.png" class="custom-logo" alt="" style={{width:"100%"}}></img>
                    <FormControl component="form" variant="outlined" onSubmit={""}>
                            <Typography variant="h3">Comments</Typography>
                            <TextField  id="outlined-multiline-static"  placeholder="Comments for Rejection"  multiline  rows={2}/>
                            <Stack alignItems="center" direction="row" gap={3} pt={2}>
                                <Button variant="outlined" color="primary" onClick={(e) => {setModalOpen(false)}}>Cancel</Button>
                                <Button variant="contained" color="primary" type="submit" onClick={(e) => {e.preventDefault();setModalOpen(true)}}>Submit</Button>
                            </Stack>
                    </FormControl>
                </Box>
            </Modal>
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"}>
                    Center ROI Review
                </Typography>
                
                <Typography variant="h2" noWrap component="div" textAlign={'center'} padding={2}>
                    ABC School
                </Typography>

                <Box sx={{display:"flex",flexDirection:"column"}}>
                    <Paper>
                        <Stack alignItems="center" direction="row" gap={1} pb={2}>
                            
                            <Button  sx={{padding:"20px"}} startIcon={<FilterAlt/>}>FILTER</Button>
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

                        <Divider/>

                        <Grid container sx={{margin:"0px !important"}}>
                            <Grid item xs={3} sx={{backgroundColor:"#e5ffd6"}} p={1}>
                                <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <img src="sample.png" class="custom-logo" alt="" style={{width:"50%"}} onClick={()=>{setModalOpen(true)}}></img>
                                    <div>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Camera Name</Typography> : 1350_ABC</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Sub Location</Typography> : Server Room</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Feature Type</Typography> : Zone Intrusion</Typography>
                                    </div>
                                    <Stack direction="row" justifyContent="space-around" sx={{width:"100%"}}>
                                        <Button color="error" size="small" variant='contained'>Reject</Button>
                                        <Button color="success" size="small" variant='contained'>Approve</Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={3} sx={{backgroundColor:"#ffd6d6"}} p={1}>
                                <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <img src="sample.png" class="custom-logo" alt="" style={{width:"50%"}}></img>
                                    <div>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Camera Name</Typography> : 1350_ABC</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Sub Location</Typography> : Server Room</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Feature Type</Typography> : Zone Intrusion</Typography>
                                    </div>
                                    <Stack direction="row" justifyContent="space-around" sx={{width:"100%"}}>
                                        <Button color="error" size="small" variant='contained'>Reject</Button>
                                        <Button color="success" size="small" variant='contained'>Approve</Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={3} sx={{backgroundColor:"#f5f5f5"}} p={1}>
                                <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <img src="sample.png" class="custom-logo" alt="" style={{width:"50%"}}></img>
                                    <div>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Camera Name</Typography> : 1350_ABC</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Sub Location</Typography> : Server Room</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Feature Type</Typography> : Zone Intrusion</Typography>
                                    </div>
                                    <Stack direction="row" justifyContent="space-around" sx={{width:"100%"}}>
                                        <Button color="error" size="small" variant='contained'>Reject</Button>
                                        <Button color="success" size="small" variant='contained'>Approve</Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={3} sx={{backgroundColor:"#ffd6d6"}} p={1}>
                                <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <img src="sample.png" class="custom-logo" alt="" style={{width:"50%"}}></img>
                                    <div>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Camera Name</Typography> : 1350_ABC</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Sub Location</Typography> : Server Room</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Feature Type</Typography> : Zone Intrusion</Typography>
                                    </div>
                                    <Stack direction="row" justifyContent="space-around" sx={{width:"100%"}}>
                                        <Button color="error" size="small" variant='contained'>Reject</Button>
                                        <Button color="success" size="small" variant='contained'>Approve</Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={3} sx={{backgroundColor:"#f5f5f5"}} p={1}>
                                <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <img src="sample.png" class="custom-logo" alt="" style={{width:"50%"}}></img>
                                    <div>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Camera Name</Typography> : 1350_ABC</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Sub Location</Typography> : Server Room</Typography>
                                        <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Feature Type</Typography> : Zone Intrusion</Typography>
                                    </div>
                                    <Stack direction="row" justifyContent="space-around" sx={{width:"100%"}}>
                                        <Button color="error" size="small" variant='contained'>Reject</Button>
                                        <Button color="success" size="small" variant='contained'>Approve</Button>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>

                        <TablePagination
                            component="div"
                            count={100}
                            page={page}
                            onPageChange={(event, newPage) => {setPage(newPage)}}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event)=>{setRowsPerPage(parseInt(event.target.value, 10));setPage(0);}}
                        />
                    </Paper>
                </Box>

            </Box>
        </>
    );
    
}

export default Main;
