import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Cancel} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot, TimelineItem } from '@mui/lab';

import {get, post, del} from '../provider/camera_provider';
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
    const [featureSelected, setFeatureSelected] = React.useState(0);    

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
        headerName: "#",
        flex:1, 
    },
    {
        field: 'name',
        headerName: "CAMERA NAME",
        flex:1,
        renderCell: (params) => {return <a href="hi">{params.value}</a>}
    },
    {
        field: 'sub_location',
        headerName: "SUBLOCATION",
        flex:1,
    },
    {
        field: 'features',
        headerName: "FEATURES ACTIVE",
        flex:1,
        renderCell: (params) => {
            return (
                <ToggleButtonGroup color="primary" value={featureSelected} exclusive onChange={(event, newAlignment) => {setFeatureSelected(newAlignment)}} aria-label="Features Active" fullWidth={true} style={{justifyContent:"center"}}>
                    {Object.keys(params.row.features).map((value, index)=>(
                    <ToggleButton value={index}>{value}</ToggleButton>
                    ))
                    }
                </ToggleButtonGroup>
            )    
        }
    },
    {
        field: 'time',
        headerName: "ACTIVATED TIME",
        flex:1,
        renderCell: (params) => {return `${Object.values(params.row.features)[featureSelected]["start_time"]}-${Object.values(params.row.features)[featureSelected]["end_time"]}`},
    },
    {
        field: 'status',
        headerName: "ROI MARKED",
        flex:1,
        renderCell: (params) => {
            return (
                <Stack direction="row" gap={1} justifyContent={"center"}>
                    {
                        Object.keys(params.row.status).map((value, index)=>(
                            <Stack direction="row" gap={0.2}>
                                {params.row.status[value]} <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: value==="unmarked" ? 'grey': value==="marked" ? 'yellow': value==="approved" ? "green" : value==="rejected" ? "red" : null,}}/>
                            </Stack>
                        ))
                    }
                </Stack>
            )
        },
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
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Cameras : </Typography>
                                <Typography variant="h3">15</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <LibraryBooks color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>ROIs Marked: </Typography>
                                <Typography variant="h3">22/28</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <Cancel color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>ROI Rejected : </Typography>
                                <Typography variant="h3">1</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <CheckBox color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>ROIs approved : </Typography>
                                <Typography variant="h3">20</Typography>
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

    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"}>
                    Cameras
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
                            textAlign:"-webkit-center"
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
