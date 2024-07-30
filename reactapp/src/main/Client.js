import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';

import {get, post, put, del} from '../provider/client_provider';
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
    const [metaData,setMetaData] = React.useState({"clients":0,"active_exams":0,"completed_exams":0,"instances":0})

    React.useEffect(() => {
        get((urlParams)).then((value)=>{
            if (value){
                console.log(value)
                const temp = {"clients":0,"active_exam":0,"completed_exam":0,"instances":0}
                value.map((row,index)=>{
                    temp['clients']+=1
                    temp['active_exams']+=row['active_exam']
                    temp['completed_exam']+=row['completed_exam']
                    temp['instances']+=row['instances']
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
        field: 'name',
        headerName: 'CLIENT NAME',
        flex:1,
        minWidth:150,
        renderCell: (params) => {return <a href={`/exam?client_name__like=${params.value}`}>{params.value}</a>},
        filterOperators: string_operators,
    },
    {
        field: 'code',
        headerName: 'CODE',
        flex:1,
        minWidth:150,
        filterOperators: string_operators,
    },
    {
        field: 'username',
        headerName: 'USERNAME',
        flex:1,
        minWidth:150,
        filterOperators: string_operators,
    },
    {
        field: 'password',
        headerName: 'PASSWORD',
        flex:1,
        minWidth:150,
        filterOperators: string_operators,
    },
    {
        field: 'instances',
        headerName: 'INSTANCES',
        type: 'number',
        flex:1,
        minWidth:150,
        filterable: false,
    },
    {
        field: 'active_exam',
        headerName: 'ACTIVE EXAMS',
        type: 'number',
        flex:1,
        minWidth:150,
        filterable: false,
    },
    {
        field: 'completed_exam',
        headerName: 'COMPLETED EXAMS',
        type: 'number',
        flex:1,
        minWidth:150,
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
                <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Name, Code, Username, Password' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
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
                                <Typography variant="h3">{metaData['clients']}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <LibraryBooks color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Active Exams : </Typography>
                                <Typography variant="h3">{metaData['active_exam']}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <Storage color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Total Instances : </Typography>
                                <Typography variant="h3">{metaData['instances']}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row" gap={1}>
                                <CheckBox color={theme.palette.text.disabled}/>
                                <Typography variant="h3" color={theme.palette.text.disabled}>Completed Exams : </Typography>
                                <Typography variant="h3">{metaData['completed_exam']}</Typography>
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

    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        if (selectedRow.length > 0){
            put(selectedRow[0]['id'],data).then((value)=>{
                setModalOpen(false)
                window.location.reload()
            })
        }else{
            post(data).then((value)=>{
                setModalOpen(false)
            })
        }
    };
    const onError = (errors, e) => {
        alert(errors)
    };

    const socket = new WebSocket(`ws://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/ws`);
    socket.onmessage = function(event) {
        console.log(event)
        const message = event.data;
        const temp_rows = [...rows, JSON.parse(message)]
        setRows(temp_rows)
    };
    return(
        <>

            {/* ADD CLIENT MODAL */}
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
                    <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
                        <Paper style={{ padding: 16,}}>

                            <Grid container alignItems="flex-start" spacing={2} p={3}>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Name</Typography>
                                    <TextField  {...register('name', { required: true })} required defaultValue={selectedRow.length!==0 ? selectedRow[0]['name'] : null} placeholder="Enter Client Name"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Address</Typography>
                                    <TextField  {...register('address')} defaultValue={selectedRow.length!==0 ? selectedRow[0]['address'] : null} placeholder="Enter Client Address"/>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <Typography variant="h3">Code</Typography>
                                        <Stack direction="row" gap={1}>
                                            <TextField id={"client_code"} {...register('code', { required: true })} required defaultValue={selectedRow.length!==0 ? selectedRow[0]['code'] : null} placeholder="Enter Client Code"/>
                                            <Button variant="outlined" color="secondary" onClick={()=>{document.getElementById("client_code").value = Math.random().toString(36).slice(8);document.getElementById("client_code").focus()}}>Generate Code</Button>
                                        </Stack>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Username</Typography>
                                    <TextField  {...register('username', { required: true })} required defaultValue={selectedRow.length!==0 ? selectedRow[0]['username'] : null} placeholder="Enter Client Username"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h3">Password</Typography>
                                    <TextField  {...register('password', { required: true })} required defaultValue={selectedRow.length!==0 ? selectedRow[0]['password'] : null} placeholder="Enter Client Password"/>
                                </Grid>
                                <Grid item style={{ marginTop: 30 }}>
                                    <Stack alignItems="center" direction="row" gap={3}>
                                        <Button variant="outlined" color="secondary" onClick={(e) => {setModalOpen(false)}}>Cancel</Button>
                                        <Button variant="contained" color="secondary" type="submit">Create Client</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Box>
            </Modal>
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"} overflow={'visible'}>
                    Client
                </Typography>

                <Box sx={{display:"flex",width:"50%",gap:"50px"}} p={3} >
                    <Button color='secondary' size="medium" variant='outlined'  onClick={()=>{setModalOpen(true)}}>Add Client</Button>
                    <Button color="secondary" size="medium" variant='outlined' disabled={selectedRow.length===0 ? true : false} onClick={()=>{setModalOpen(true)}}>Edit Client</Button>
                    <Button color='secondary' size="medium" variant='outlined' disabled={selectedRow.length===0 ? true : false} onClick={()=>{del(selectedRow[0]['id']).then((value)=>{window.location.reload()})}}>Delete Client</Button>
                </Box>

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
