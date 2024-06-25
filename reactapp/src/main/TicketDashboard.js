import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';

import {get_group} from '../provider/ticket_provider';
import { useForm } from 'react-hook-form'
import dateFormat, { masks } from "dateformat";


const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const operator_to_string = {"=":"eq","!=":"not",">":"gt",">=":"gte","<":"lt","<=":"lte","contains":"like","is":"like"};
    const string_to_operator = Object.fromEntries(Object.entries(operator_to_string).map(a => a.reverse()));
    const numeric_operators = getGridNumericOperators().filter(
        (operator) => operator.value === '=' || operator.value === '>',
    )
    const string_operators = getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
    )


    const [modalOpen, setModalOpen] = React.useState(false);    
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
    const [metaData,setMetaData] = React.useState({"total":0,"new":0,"open":0,"resolved":0})

    React.useEffect(() => {
        // const interval = setInterval(() => {
        //     get_group((urlParams)).then((value)=>{
        //         if (value){
        //             console.log(value)
        //             const temp = {"total":0,"new":0,"open":0,"resolved":0}
        //             value.map((row,index)=>{
        //                 temp['total']+=1
        //                 temp[value['status']]+=1
        //             })
        //             setMetaData(temp)
        //             setRows(value)
        //         }
        //     })
        // }, 2000);
        // return () => clearInterval(interval);

        get_group((urlParams)).then((value)=>{
            if (value){
                console.log(value)
                const temp = {"total":0,"new":0,"open":0,"resolved":0}
                value.map((row,index)=>{
                    temp['total']+=1
                    temp[row['status']]+=1
                })
                setMetaData(temp)
                setRows(value)
            }
        })
      }, [urlParams]);

    const columns = [
    { 
        field: 'id', 
        headerName: '#',  
        type: 'number',
        flex:0.3,
        minWidth:150, 
        filterOperators: numeric_operators,
    },
    {
        field: 'status',
        headerName: 'STATUS',
        flex:1,
        minWidth:150,
        type:"singleSelect",
        valueOptions:["new","open","resolved"],
        // filterable: false,
        renderCell: (params) => {return <Button color="primary" variant="contained">{params.value}</Button>},
    },
    {
        field: 'group_count',
        headerName: 'PRIORITY',
        flex:1,
        minWidth:150,
        type:"singleSelect",
        valueOptions:["insignificant","minor","moderate","major","critical"],
        renderCell: (params) => {
            const priority = params.value===0 ? "Insignificant" : params.value<=2 ? "Minor" : params.value <= 5 ? "Moderate" : params.value <= 10 ? "Major" : "Critical"
            return (
                <Button variant="contained" sx={{background:params.value===0 ? "#39d56f" : params.value<=2 ? "#86ed62" : params.value <= 5 ? "#ffcd29" : params.value <= 10 ? "#ffa629" : "#ff7250"}}>{priority}</Button>
            )
        },
    },
    {
        field: 'center',
        headerName: 'CENTER',
        flex:1,
        minWidth:150,
        // filterOperators: string_operators,
    },
    {
        field: 'camera',
        headerName: 'CAMERA',
        flex:1,
        minWidth:150,
        // filterOperators: string_operators,
    },
    {
        field: 'feature',
        headerName: 'ALERT TYPE',
        flex:1,
        minWidth:150,
        // filterOperators: string_operators,
    },
    {
        field: 'sublocation',
        headerName: 'SUBLOCATION',
        flex:1,
        minWidth:150,
        // filterOperators: string_operators,
    },
    {
        field: 'created_at',
        headerName: 'CREATED AT',
        flex:1,
        minWidth:150,
        renderCell: (params) => {return (dateFormat(new Date(params.value), "hh:mm:ss TT yyyy-mm-dd ")).toString()},
        filterable: false,
    },
    {
        field: 'last_updated',
        headerName: 'LAST UPDATED',
        flex:1,
        minWidth:150,
        renderCell: (params) => {return (dateFormat(new Date(params.value), "hh:mm:ss TT yyyy-mm-dd ")).toString()},
        filterable: false,
    },
    ];

    

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
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"} mb={2}>
                    BPSC March 2024
                </Typography>

                <Stack alignItems="center" direction="row" gap={1} sx={{width:"100%"}} justifyContent={"space-between"}>
                    <TextField sx={{width: "450px",mb:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Id, Camera, Center, Feature, Sub-Location' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
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
                                    <LibraryBooks color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Total Tickets : </Typography>
                                    <Typography variant="h3">{metaData['total']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <Storage color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>New Tickets : </Typography>
                                    <Typography variant="h3">{metaData['new']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <Storage color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Open Tickets : </Typography>
                                    <Typography variant="h3">{metaData['open']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <CheckBox color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>Resolved Tickets : </Typography>
                                    <Typography variant="h3">{metaData['resolved']}</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
                

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
                    pageSize={100}
                    rowsPerPageOptions={[100]}
                    // initialState={{
                    // pagination: {
                    //     paginationModel: {
                    //     pageSize: 5,
                    //     },
                    // },
                    // }}
                    slots={{
                        toolbar: CustomToolbar,
                        // footer: CustomFooter,
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
                    onRowClick = {(ids) => {navigate(`/ticket/?camera__eq=${ids['row']['camera']}&feature__eq=${ids['row']['feature']}`);}}
                />  
            </Box>
        </>
    );
    
}

export default Main;
