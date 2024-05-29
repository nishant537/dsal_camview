import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot } from '@mui/lab';
import {get_stats} from '../provider/ticket_provider';
import { useNavigate } from 'react-router-dom';

// icon import
import SearchIcon from '@mui/icons-material/Search';
// component import
import DashboardCards from '../components/DashboardCards';

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


    const [rows,setRows] = React.useState([])
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

    const columns = []
    React.useEffect(() => {
        get_stats((urlParams)).then((value)=>{
            if (value){
                console.log(value)
                setRows(value)
            }
        })
    }, [urlParams]);

    if (rows.length>0){
        Object.entries(rows[0]).map(([key,value])=>{
        
            if (key==="total" || (key.indexOf("_") > -1))
            {
                columns.push({
                    field: key,
                    flex:0.6,
                    minWidth:200,
                    renderCell: (params) => {
                        return (
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                                <span style={{fontSize:"25px"}}>{Object.values(params.value).reduce((acc, val) => acc + val, 0)}</span>
                                <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                                    {
                                        Object.entries(params.value).map(([key, value])=>(
                                            <div style={{"display":"flex", 'gap':"10px"}}>
                                                <span style={{fontSize:"25px"}}>{value}</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: key==="null" ? 'grey': key==="true" ? "green" : key==="false" ? "red" : null,}}/>
                                            </div>
                                        ))
                                    }
                                </Stack>
                            </div>
                        )
                        
                    },
                })
            }else{
                columns.push({
                    field: key, 
                    headerName: key,  
                    // type: 'number',
                    flex:0.3,
                    minWidth:150, 
                    // filterOperators: numeric_operators,
                })
            }
                
        })
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
    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" color="primary" borderBottom={"5px solid"} mb={2}>
                    Ticket Stats
                </Typography>
                

                <div style={{height:"100%",width:"100%"}}>
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
                </div>

            </Box>
        </>
    );
    
}

export default Main;
