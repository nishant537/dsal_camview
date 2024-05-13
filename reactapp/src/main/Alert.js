import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses,getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Image, VideoCall} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from 'react-router-dom';

import {get, post, get_summary, get_group} from '../provider/alert_provider';
import { useForm } from 'react-hook-form'


const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const operator_to_string = {"=":"eq","!=":"not",">":"gt",">=":"gte","<":"lt","<=":"lte","contains":"like"};
    const string_to_operator = Object.fromEntries(Object.entries(operator_to_string).map(a => a.reverse()));
    const numeric_operators = getGridNumericOperators().filter(
        (operator) => operator.value === '=' || operator.value === '>',
    )
    const string_operators = getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
    )

    const [modalOpen, setModalOpen] = React.useState(false);    
    const [rows,setRows] = React.useState([])
    const [subRows,setSubRows] = React.useState([])
    const [urlParams, setUrlParams] = React.useState(()=>{
        const data = new URLSearchParams(window.location.search)
        return data.toString()
    })
    const [filter, setFilter] = React.useState(()=>{
        const data = new URLSearchParams(window.location.search)
        const filterItems = [];
        for (let p of data) {
            filterItems.push({'field':p[0].split('__')[0], "operator":string_to_operator[p[0].split('__')[1]], "value":p[1]});
        }
        return filterItems;
    })
    const [selectedRow, setSelectedRow] = React.useState([])
    const [cardData, setCardData] = React.useState([])
    const [alignment, setAlignment] = React.useState("6H");    
    const [alignment2, setAlignment2] = React.useState("image");    
    const [alignment3, setAlignment3] = React.useState("true");   

    React.useEffect(() => {
        get_summary((urlParams)).then((value)=>{
            if (value){
                console.log(value)
                setCardData(value)
            }
        })
        get_group((urlParams)).then((value)=>{
            if (value){
                console.log(JSON.stringify(value))
                setRows(value)
            }
        })
      }, [urlParams]);

    
    const columns = [
    { 
        field: 'id', 
        headerName: "#",
        type: "number",
        flex:1, 
        filterOperators: numeric_operators,
    },
    {
        field: 'camera',
        headerName: "NAME",
        flex:1,
        filterOperators: string_operators,
    },
    {
        field: 'location',
        headerName: "LOCATION",
        flex:1,
        filterOperators: string_operators,
    },
    {
        field: 'feature',
        headerName: "FEATURE",
        flex:1,
        filterOperators: string_operators,
    },
    {
        field: 'timestamp',
        headerName: "TIME",
        flex:1,
        filterOperators: string_operators,
    },
    // {
    //     field: 'total_alert',
    //     headerName: "PRIORITY",
    //     flex:1,
    //     renderCell: (params) => {
    //         return (
    //             <div style={{display:"flex",justifyContent:"center",height:"100%",alignItems:"center"}}>
    //                 <div style={{width:"20px", height:"20px", background:params.value===0 ? "#39d56f" : params.value<=2 ? "#86ed62" : params.value < 5 ? "#ffcd29" : params.value < 10 ? "#ffa629" : "#ff7250" ,borderRadius:"3px"}}></div>
    //             </div>
    //         )
    //     },
    //     filterable: false,
    // },
    ];

    const sub_columns = [
        { 
            field: 'id', 
            headerName: "#",
            type: "number",
            flex:1, 
            filterable:false
        },
        {
            field: 'timestamp',
            headerName: "TIME",
            flex:1,
            filterOperators: string_operators,
        },
        {
            field: 'image_path',
            headerName: "IMAGE",
            flex:1,
            renderCell: (params) => {
                return (
                    <Image/>
                )
            },
            filterable: false,
        },
        {
            field: 'video_path',
            headerName: "VIDEO",
            flex:1,
            renderCell: (params) => {
                return (
                    <VideoCall/>
                )
            },
            filterable: false,
        }
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
                <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} id="contained-search" variant="outlined" placeholder='Seach Client' type="search" InputProps={{
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

    const onFilterModelChange = (newFilterModel) => {
        console.log("Filter model Changed!")
        const data = new URLSearchParams();
        newFilterModel['items'].map((value, index)=>{
            if (value['value']){
                data.append(`${value['field']}__${operator_to_string[value['operator']]}`, value['value'])
            }
        })
        window.history.replaceState({}, '', `${window.location.pathname}?${data}`);
        setUrlParams(data.toString())
    }

    const {register, handleSubmit} = useForm([])
    const onSubmit = (data, e) => {post(data)};
    const onError = (errors, e) => {post(errors)};

    const handleImgData = (ids) => {
        const data = new URLSearchParams(urlParams);
        data.append(`camera__${operator_to_string['contains']}`, ids['row']['camera'])
        data.append(`feature__${operator_to_string['contains']}`, ids['row']['feature'])
        get((data.toString())).then((value)=>{
            if (value){
                setSubRows(value)
            }
        })
        setModalOpen(true)
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
                <DataGridPro
                            sx={{
                                minHeight:"600px",
                                minWidth:"800px",
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
                            rows={subRows}
                            columns={sub_columns
                            }
                            disableMultipleRowSelection={true}
                            // initialState={{
                            // pagination: {
                            //     paginationModel: {
                            //     pageSize: 5,
                            //     },
                            // },
                            // }}
                            autoHeight={true}
                            // slots={{
                            //     toolbar: CustomToolbar,
                            //     footer: CustomFooter,
                            // }}
                            pageSizeOptions={[5]}
                            // pageSize={100}
                            checkboxSelection
                            disableRowSelectionOnClick
                            
                            // this does not trigger model change, just shows on ui
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
            </Modal>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Stack direction="row">
                    <Box minWidth="50%" p={1}>
                        <Stack direction="column" alignItems="flex-end">
                            {/* <ToggleButtonGroup
                                sx={{paddingX:"20px"}}
                                fullWidth
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
                            </ToggleButtonGroup> */}
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
                        <DataGridPro
                            sx={{
                                height:"100% !important",
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
                            
                            // this does not trigger model change, just shows on ui
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
                            onRowClick = {(ids) => {handleImgData(ids)}}
                        />  
                    </div>
                    <Stack direction="column" gap={1}>
                        <ToggleButtonGroup color="secondary" value={alignment2} fullWidth exclusive onClick={(e,newAlignment)=>setAlignment2(newAlignment)} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="image" id="alert_image">Image</ToggleButton>
                            <ToggleButton value="video" id="alert_video">Video</ToggleButton>
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
                        <ToggleButtonGroup color="secondary" value={alignment3} fullWidth exclusive onClick={(e,newAlignment)=>setAlignment3(newAlignment)} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="true" id="alert_image">True</ToggleButton>
                            <ToggleButton value="false" id="alert_video">False</ToggleButton>
                        </ToggleButtonGroup>
                        <Button variant="contained" color="primary">Submit</Button>
                        
                    </Stack>
                </Stack>

            </Box>
        </>
    );
    
}

export default Main;
