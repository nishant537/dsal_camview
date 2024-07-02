import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot } from '@mui/lab';
import {get_stats} from '../provider/alert_provider';
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
        (operator) => operator.value === '=',
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
    const [search, setSearch] = React.useState("")
    const handleSearch = (event) =>{
        setSearch(event.target.value)
    }
    const [metaData,setMetaData] = React.useState({"center":0,"total":0,"true":0,"false":0})

    let dict_columns = {}

    React.useEffect(() => {
        const interval = setInterval(() => {
            get_stats((urlParams)).then((value)=>{
                if (value){
                    const temp = {"center":0,"total":0,"true":0,"false":0}
                    value.map((row,index)=>{
                        temp['center']+=1
                        temp['total']+=Object.values(row['total']).reduce((acc, val) => acc + val, 0);
                        temp['true']+=row['total']['true']
                        temp['false']+=row['total']['false']
                    })
                    setMetaData(temp)
                    setRows(value)
                }
            })
        }, 2000);
        return () => clearInterval(interval);

    }, [urlParams]);

    if (rows.length>0){
        rows.map((row, index) => 
            Object.entries(row).map(([key,value])=>{
                if (Object.keys(dict_columns).includes(key)===false){
                    if (key.indexOf("_") > -1)
                    {
                        if (!(key.split("_")[0] in dict_columns)){
                            dict_columns[key.split("_")[0]] = {}
                        }
                        dict_columns[key.split("_")[0]][key] = {
                            field: key,
                            headerName: key.split("_")[key.split("_").length-1],
                            flex:0.6,
                            minWidth:200,
                            filterable: false,
                            renderCell: (params) => {
                                return (
                                    <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                                        <span style={{fontSize:"25px"}}>{params.value===undefined ? 0 : Object.values(params.value).reduce((acc, val) => acc + val, 0)}</span>
                                        <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                                            {   
                                                Object.entries(params.value===undefined ? {"true":0,"false":0,"null":0} : params.value).map(([key, value])=>(
                                                    <div style={{"display":"flex", 'gap':"10px"}}>
                                                        <span style={{fontSize:"25px"}}>{value}</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: key==="null" ? 'grey': key==="true" ? "green" : key==="false" ? "red" : null,}}/>
                                                    </div>
                                                ))
                                            }
                                        </Stack>
                                    </div>
                                )
                                
                            },
                        }
                    }else if (key==="total"){
                        dict_columns[key] = {
                            field: key,
                            headerName: key.split("_")[key.split("_").length-1],
                            flex:0.6,
                            minWidth:200,
                            filterable: false,
                            renderCell: (params) => {
                                return (
                                    <div style={{display:"flex", flexDirection:"column", alignItems:"center" , transform:"scale(0.5)",transformOrigin: '50% 0% 0px'}}>
                                        <span style={{fontSize:"25px"}}>{params.value===undefined ? 0 : Object.values(params.value).reduce((acc, val) => acc + val, 0)}</span>
                                        <Stack direction="row" gap={1} sx={{background:"whitesmoke",padding:"0 20px", borderRadius:"30px"}}>
                                            {   
                                                Object.entries(params.value===undefined ? {"true":0,"false":0,"null":0} : params.value).map(([key, value])=>(
                                                    <div style={{"display":"flex", 'gap':"10px"}}>
                                                        <span style={{fontSize:"25px"}}>{value}</span> <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: key==="null" ? 'grey': key==="true" ? "green" : key==="false" ? "red" : null,}}/>
                                                    </div>
                                                ))
                                            }
                                        </Stack>
                                    </div>
                                )
                                
                            },
                        }
                    }
                    else if (key==="center"){
                        dict_columns["center"] = {
                            field: key,
                            headerName: key,
                            flex:0.3,
                            minWidth:150,
                            renderCell: (params) => {return  <a href={`/alert?center__like=${params.value}`}>{params.value}</a>},
                            filterOperators: string_operators,
                        }
                    }else if (key==="id"){
                        dict_columns["id"] = {
                            field: key,
                            headerName: key,
                            type: "number",
                            flex:0.3,
                            minWidth:150,
                            renderCell: (params) => {return <span>{params.value}</span>},
                            filterOperators: numeric_operators,
                        }
                    }
                }
            })
        )
        
    }


    // function for flattening the json
    const getAllObjects = (dict) => {
        let columns = []
        Object.entries(dict).map(([key,value])=>{
            if (!(Object.keys(value).includes("headerName"))){
                Object.entries(value).map(([key1,value1])=>{
                    columns.push(value1)
                })
            }else{
                columns.push(value)
            }
        })
        return columns;
    }
    let columns = getAllObjects(dict_columns)
    if (columns.length===0){
        columns = [{ 
            field: 'center', 
            headerName: "CENTER",
            type: "number",
            flex:1, 
            filterOperators: numeric_operators,
        }]
    }


    const columnGroupingModel = [];
    const t = {};
    rows.map((value,index)=>{
        Object.entries(value).map(([key, value])=>{
            if (key.indexOf("_")>0){
                if (key.split("_")[0] in t){
                }else{
                    t[key.split("_")[0]] = []
                }
                if (t[key.split("_")[0]].includes(key)===false){
                    t[key.split("_")[0]].push(key)
                } 
            }
        })
    })

    Object.entries(t).map(([key,value])=>{
        columnGroupingModel.push(
            {
                groupId: key,
                description: '',
                children: value.map(field => ({ field })),
            }
        )
    })

    // searchbar -------------------------------------
    const [searchValue, setSearchValue] = React.useState(()=>{
        const data = new URLSearchParams(urlParams)
        if (data.get("search")){
            return data.get('search')
        }else{
            return ""
        }
    });

    const searchInputRef = React.useRef(null);
    React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        // Make API call with the final search value
        if (searchValue!==""){
            const data = new URLSearchParams()
            data.append("search",searchValue)
            window.history.replaceState({}, '', `${window.location.pathname}?${data}`);
            setUrlParams(data.toString())
            console.log(searchValue)
        }else{
            const data = new URLSearchParams(urlParams)
            data.delete("search")
            window.history.replaceState({}, '', `${window.location.pathname}?${data}`);
            setUrlParams(data.toString())
        }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);

    const handleSearchInputChange = (event) => {
        const newValue = event.target.value;
        setSearchValue(newValue);
    };

    // -----------------------------------------------------------
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton/>
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
                    Alert Stats
                </Typography>
                
                <Stack alignItems="center" direction="row" gap={1} justifyContent={"space-between"} sx={{width:"100%"}}>
                    <TextField sx={{width: "450px",mb:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Id, Center' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
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
                                <Typography variant="h3">{metaData['center']}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <LibraryBooks color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Alerts: </Typography>
                                <Typography variant="h3">{metaData['total']}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <Storage color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total True Alerts : </Typography>
                                <Typography variant="h3">{metaData['true']}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <CheckBox color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total False Alerts : </Typography>
                                <Typography variant="h3">{metaData['false']}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </div>
                </Stack>

                <DataGridPro
                    sx={{
                        // height:"100%",
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
                    slots={{
                        toolbar: CustomToolbar,
                        footer: CustomFooter,
                    }}
                    pageSizeOptions={[5]}
                    // pageSize={100}
                    // checkboxSelection
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
        </>
    );
    
}

export default Main;
