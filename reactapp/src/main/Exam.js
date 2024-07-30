import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment,Button,} from '@mui/material';
import { GridToolbarContainer,GridToolbarFilterButton,GridFooterContainer, GridFooter,gridClasses,getGridStringOperators, getGridNumericOperators,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';

import {get, post, del} from '../provider/exam_provider';

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
    const [activeIndex, setActiveIndex] = React.useState("view");    

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
        filterOperators: numeric_operators,
    },
    {
        field: 'client_name',
        headerName: "CLIENT NAME",
        flex:1,
        filterOperators: string_operators,
        renderCell: (params) => {return <a href={`/client?name__like=${params.value}`}>{params.value}</a>},
    },
    {
        field: 'name',
        headerName: "EXAM NAME",
        flex:1,
        filterOperators: string_operators,
        renderCell: (params) => {return <a href={`/shift?exam_name__like=${params.value}`}>{params.value}</a>},
    },
    {
        field: 'code',
        headerName: "EXAM CODE",
        flex:1,
        filterOperators: string_operators,

    },
    {
        field: 'date_range',
        headerName: "DATE RANGE",
        flex:1.5,
        filterable: false,
    },
    {
        field: 'total_shifts',
        headerName: "SHIFTS",
        type: 'number',
        flex:1,
        filterable: false,
    },
    {
        field: 'total_centers',
        headerName: "CENTERS",
        type: 'number',
        flex:1,
        filterable: false,
    },
    {
        field: 'total_instances',
        headerName: "INSTANCES",
        type: 'number',
        flex:1,
        filterable: false,
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
                <GridToolbarFilterButton
                    componentsProps={{
                        button: {
                            startIcon: (
                                <FilterAlt />
                            )
                        }
                    }}
                />
                <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Exam Name, Client Name, Code' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
                    startAdornment: (
                        <InputAdornment>
                            <IconButton>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    )
                }}/>

                <Box sx={{display:"flex",justifyContent:"space-between",width:"400px"}}>
                    <Button color='secondary' size="medium" variant='outlined' onClick={()=>{navigate('/create_exam')}}>Add Exam</Button>
                    <Button color="secondary" size="medium" variant='outlined' disabled={selectedRow.length===0 ? true : false} onClick={()=>{navigate(`/create_exam/${selectedRow[0]['id']}`)}}>Edit Exam</Button>
                    <Button color='secondary' size="medium" variant='outlined'disabled={selectedRow.length===0 ? true : false} onClick={()=>{del(selectedRow[0]['id'])}}>Delete Exam</Button>
                </Box>
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

                <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"} overflow={'visible'}>
                    Exam
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
