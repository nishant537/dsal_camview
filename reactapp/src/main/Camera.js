import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridNumericOperators, getGridStringOperators} from '@mui/x-data-grid';
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
    const [featureSelected, setFeatureSelected] = React.useState({"id":0,"index":0}); 
    const [metaData,setMetaData] = React.useState({"cameras":0,"marked":0,"approved":0,"rejected":0})
       

    React.useEffect(() => {
        get((urlParams)).then((value)=>{
            if (value){
                console.log(value)
                const temp = {"cameras":0,"marked":0,"approved":0,"rejected":0}
                value.map((row,index)=>{
                    temp['cameras']+=1
                    temp['marked']+=row['status']['marked']
                    temp['approved']+=row['status']['approved']
                    temp['rejected']+=row['status']['rejected']
                })
                setMetaData(temp)
                setRows(value)
            }
        })
      }, [urlParams]);


    const columns = [
    { 
        field: 'id', 
        headerName: "#",
        flex:1, 
        filterOperators: numeric_operators,
    },
    {
        field: 'center_code',
        headerName: "CENTER CODE",
        flex:1,
        filterOperators: string_operators,
        // renderCell: (params) => {return <a href={`/provisioning/${params.row.id}`}>{params.value}</a>}
    },
    {
        field: 'name',
        headerName: "CAMERA NAME",
        flex:1,
        filterOperators: string_operators,
        renderCell: (params) => {return <a href={`/provisioning/${params.row.id}`}>{params.value}</a>}
    },
    {
        field: 'sublocation',
        headerName: "SUBLOCATION",
        flex:1,
        filterOperators: string_operators,
    },
    {
        field: 'features',
        headerName: "FEATURES ACTIVE",
        flex:1,
        renderCell: (params) => {
            const selectedIndex = params.row.id===featureSelected['id'] ? featureSelected['index'] : 0
            return (
                <ToggleButtonGroup color="primary" value={selectedIndex} exclusive onChange={(event, newAlignment) => {setFeatureSelected({"id":params.row.id, "index":newAlignment})}} aria-label="Features Active" fullWidth={true} style={{justifyContent:"center"}}>
                    {params.row.features.map((value, index)=>(
                        <ToggleButton value={index}>{value['name']}</ToggleButton>
                    ))
                    }
                </ToggleButtonGroup>
            )    
        },
        filterable: false
    },
    {
        field: 'time',
        headerName: "ACTIVATED TIME",
        flex:1,
        renderCell: (params) => {
            const selectedIndex = params.row.id===featureSelected['id'] ? featureSelected['index'] : 0
            return `${JSON.parse(params.row.features[selectedIndex]['json'])["start_time"]}-${JSON.parse(params.row.features[selectedIndex]['json'])["end_time"]}`
        },
        filterable: false
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
                                {params.row.status[value]} <TimelineDot sx={{ margin:0,placeSelf:"center",width: '5px',backgroundColor: value==="pending" ? 'grey': value==="marked" ? 'yellow': value==="approved" ? "green" : value==="rejected" ? "red" : null,}}/>
                            </Stack>
                        ))
                    }
                </Stack>
            )
        },
        filterable: false
    },
    ];

    function CustomToolbar() {
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
        }, 1000); // Adjust the debounce delay as needed

        return () => clearTimeout(delayDebounceFn);
        }, [searchValue]);

        const handleSearchInputChange = (event) => {
            const newValue = event.target.value;
            setSearchValue(newValue);
        };
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
                    <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Center Code, Name, Sublocation' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
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
                                    <Typography variant="h3">{metaData['cameras']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <LibraryBooks color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ROIs Marked: </Typography>
                                    <Typography variant="h3">{metaData['marked']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <Cancel color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ROI Rejected : </Typography>
                                    <Typography variant="h3">{metaData['rejected']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <CheckBox color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ROIs approved : </Typography>
                                    <Typography variant="h3">{metaData['approved']}</Typography>
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
                />   

            </Box>
        </>
    );
    
}

export default Main;
