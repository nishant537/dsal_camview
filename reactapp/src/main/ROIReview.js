import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton, Card, CardMedia, CardContent, CardActions,TablePagination, } from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Cancel, Delete} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { TimelineDot, TimelineItem } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

import {get, post, del, put} from '../provider/roi_provider';
import { useForm } from 'react-hook-form'

const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const operator_to_string = {"=":"eq","!=":"not",">":"gt",">=":"gte","<":"lt","<=":"lte","is":"like","contains":"like"};
    const string_to_operator = Object.fromEntries(Object.entries(operator_to_string).map(a => a.reverse()));
    const numeric_operators = getGridNumericOperators().filter(
        (operator) => operator.value === '=' || operator.value === '>',
    )
    const string_operators = getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
    )

    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10); 
    const [modalOpen, setModalOpen] = React.useState(false);    
    const [imageModal, setImageModal] = React.useState(false);    
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
    const [selectedRow,setSelectedRow] = React.useState("")
    const [metaData,setMetaData] = React.useState({"marked":0,"approved":0,"rejected":0})
    rows.map((value,index)=>{
        const temp = metaData
        temp[value['status']]+=1
    })

    React.useEffect(() => {
        get((urlParams)).then((value)=>{
            if (value){
                console.log(value)
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
            filterable: false,
        },
        {
            field: 'feature_name',
            headerName: 'FEATURE NAME',
            flex:1,
            minWidth:150,
            filterOperators: string_operators,
        },
        {
            field: 'status',
            headerName: 'STATUS',
            flex:1,
            minWidth:150,
            type:"singleSelect",
            valueOptions:["marked","approved","rejected"],
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
                    <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Feature, Status' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
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
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ROIs Marked : </Typography>
                                    <Typography variant="h3">{metaData['marked']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <Storage color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ROIs Approved : </Typography>
                                    <Typography variant="h3">{metaData['approved']}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" direction="row" gap={1}>
                                    <Storage color={theme.palette.text.disabled}/>
                                    <Typography variant="h3" color={theme.palette.text.disabled}>ROIs Rejected : </Typography>
                                    <Typography variant="h3">{metaData['rejected']}</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
            </GridToolbarContainer>
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

    const updateRoi = (id, data) => {
        put(id, data).then((value)=>{
            window.location.reload()
        })
    }

    const {register, handleSubmit} = useForm()
    const onSubmit = (data, e) => {
        updateRoi(rows[selectedRow]['id'],{status:"rejected",comment:data.comment})
        setModalOpen(false)
    };
    const onError = (errors, e) => {console.log(errors)};
    return(
        <>  

            {/* Image Enlarge */}
            <Modal
                open={imageModal}
                onClose={() => {setImageModal(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{width:"50%" ,position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24,}}>
                    <img src={"sample.png"} alt="Alert for Zone Intrusion" style={{width:"100%"}}/>
                </Box>
            </Modal>

            {/* Rejection Modal */}
            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24,padding:"20px"}}>
                    <img src="sample.png" class="custom-logo" alt="" style={{width:"100%"}}></img>
                    <Box component="form" variant="outlined" onSubmit={handleSubmit(onSubmit, onError)}>
                            <Typography variant="h3">Comments</Typography>
                            <TextField  id="outlined-multiline-static" {...register('comment', { required: true })} required placeholder="Comments for Rejection"  multiline  rows={2}/>
                            <Stack alignItems="center" direction="row" gap={3} pt={2}>
                                <Button variant="outlined" color="primary" onClick={(e) => {setModalOpen(false)}}>Cancel</Button>
                                <Button variant="contained" color="primary" type="submit">Submit</Button>
                            </Stack>
                    </Box>
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
                
                <Typography variant="h2" noWrap component="div" textAlign={'center'} padding={2} overflow={'visible'}>
                    ABC School
                </Typography>

                <div style={{width:"100%"}}>
                    <DataGridPro
                        sx={{
                            height:"100%",
                            [`& .MuiDataGrid-main, & .${gridClasses.footerContainer}`]: {
                                display: 'none',
                            }
                            
                        }}
                        rows={[]}
                        columns={columns}
                        disableMultipleRowSelection={true}
                        autoHeight={true}
                        slots={{
                            toolbar: CustomToolbar,
                        }}
                        
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
                    /> 
                    <Box sx={{display:"flex",flexDirection:"column",}}>
                        <Paper>
                            <Divider/>

                            <Grid container sx={{margin:"0px !important"}}>

                                {rows.map((value, index) => 
                                    <Grid item xs={3} sx={{backgroundColor:value.status==="marked" ? "#f5f5f5" : value.status==="approved" ? "#e5ffd6" : "#ffd6d6"}} p={1}>
                                        <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                            <img src="sample.png" class="custom-logo" alt="" style={{width:"50%"}} onClick={()=>{setImageModal(true)}}></img>
                                            <div>
                                                <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Camera Name</Typography> : {value['feature']['camera']['name']}</Typography>
                                                <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Sub Location</Typography> : {value['feature']['camera']['sublocation']}</Typography>
                                                <Typography variant="h3"><Typography variant="span" color={theme.palette.text.disabled}>Feature Type</Typography> : {value['feature']['name']}</Typography>
                                            </div>
                                            <Stack direction="row" justifyContent="space-around" sx={{width:"100%"}}>
                                                <Button color="error" size="small" variant='contained' onClick={()=>{setSelectedRow(index);setModalOpen(true)}}>Reject</Button>
                                                <Button color="success" size="small" variant='contained' onClick={()=>{updateRoi(value.id,{status:"approved"})}}>Approve</Button>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                )}

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
                </div>

            </Box>
        </>
    );
    
}

export default Main;
