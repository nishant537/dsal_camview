import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';
import {get, post, del} from '../provider/exam_provider';

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
    },
    {
        field: 'client_name',
        headerName: "CLIENT NAME",
        flex:1,
        renderCell: (params) => {return <a href={`/exam?client_name=${params.value}`}>{params.value}</a>},
    },
    {
        field: 'name',
        headerName: "EXAM NAME",
        flex:1,
    },
    {
        field: 'code',
        headerName: "EXAM CODE",
        flex:1,
        renderCell: (params) => {return <a href={`/exam?code=${params.value}`}>{params.value}</a>},

    },
    {
        field: 'date_range',
        headerName: "DATE RANGE",
        flex:1.5,
    },
    {
        field: 'total_shifts',
        headerName: "SHIFTS",
        type: 'number',
        flex:1,
    },
    {
        field: 'total_centers',
        headerName: "CENTERS",
        type: 'number',
        flex:1,
    },
    {
        field: 'total_instances',
        headerName: "INSTANCES",
        type: 'number',
        flex:1,
    },
    ];

    function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{backgroundColor:"#f4f2ff",color:"black", '& button': {color:"primary", display:"flex"}}}>
            <GridToolbarFilterButton
                componentsProps={{
                    button: {
                        startIcon: (
                            <FilterAlt />
                        )
                    }
                }}
            />
            <TextField sx={{width: "350px",my:2,mr:4 }} id="outlined-search" placeholder='Seach Center by Code, Name, Location' type="search" InputProps={{
                startAdornment: (
                    <InputAdornment>
                        <IconButton>
                            <Search />
                        </IconButton>
                    </InputAdornment>
                )
            }}/>

            <Box sx={{display:"flex",justifyContent:"space-between",width:"400px"}}>
                <Button color="primary" size="small" variant='outlined'>Edit Client</Button>
                <Button color='primary' size="small" variant='outlined' onClick={()=>{setModalOpen(true)}}>Add Client</Button>
                <Button color='primary' size="small" variant='outlined'>Delete Client</Button>
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

            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,}}>
                    <Typography variant="h3" component="div" sx={{borderBottom:"2px solid black"}} textAlign="center">
                        Client
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Modal>
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Grid container gap={1} sx={{alignItems:"center",justifyContent:"space-around"}}>
                    <Grid item xs={5} sx={{display:"flex",placeContent:"center",borderBottom:"5px solid"}} color={activeIndex==="view" ? theme.palette.primary.main : theme.palette.text.disabled} onClick={()=>{setActiveIndex("view")}}>
                        <Typography variant="h1" noWrap component="span">
                            View Exam
                        </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{display:"flex",placeContent:"center",borderBottom:"5px solid"}} color={activeIndex==="create" ? theme.palette.primary.main : theme.palette.text.disabled} onClick={()=>{navigate('/create_exam')}}>
                        <Typography variant="h1" noWrap component="span">
                            Create Exam
                        </Typography>
                    </Grid>
                </Grid>

                <Typography variant="h2" noWrap component="div" textAlign={'center'} padding={2}>
                    Select Examination
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
                </div>

            </Box>
        </>
    );

    
}

export default Main;
