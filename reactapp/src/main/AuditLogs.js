import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses,getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox, Image, VideoCall, ArrowCircleUp, ArrowCircleDown} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from 'react-router-dom';

import {get, post, get_activity, get_group} from '../provider/alert_provider';
import { useForm } from 'react-hook-form'
import dateFormat, { masks } from "dateformat";



const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const operator_to_string = {"=":"eq","!=":"not",">":"gt",">=":"gte","<":"lt","<=":"lte","contains":"like", "is":"like"};
    const string_to_operator = Object.fromEntries(Object.entries(operator_to_string).map(a => a.reverse()));
    const numeric_operators = getGridNumericOperators().filter(
        (operator) => operator.value === '=' || operator.value === '>',
    )
    const string_operators = getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
    )

    const [modalOpen, setModalOpen] = React.useState(false);    
    const [statusModal, setStatusModal] = React.useState(false);    
    const [imageModal, setImageModal] = React.useState(false);    
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
    const handleToggleChange2 = (event, newAlignment) => {
        if (newAlignment!=null){
          setAlignment2(newAlignment);
        }
    };   
    const [alignment3, setAlignment3] = React.useState("true"); 
    const handleToggleChange3 = (event, newAlignment) => {
        if (newAlignment!=null){
          setAlignment3(newAlignment);
        }
    }; 
    const [imgData, setimgData] = React.useState({"image_path":"","video_path":"",'Event Id':"?",'Center Name':"?",'Timestamp':"?",'Camera Name':"?",'Alert Type':"?",'Location':"?",'status':"?","comment":"?"})
    const [reviewLogs, setReviewLogs] = React.useState([])

    React.useEffect(() => {
        const interval = setInterval(() => {
            get_activity((urlParams)).then((value)=>{
                if (value){
                    console.log(value)
                    setReviewLogs(value)
                }
            })
            if (!statusModal){
                get_group((urlParams)).then((value)=>{
                    if (value){
                        console.log(value)
                        if (value.length > 0){
                            handleImgData({"row":value[0]})
                        }
                        setRows(value)
                    }
                })
            }
        }, 2000);
        return () => clearInterval(interval);

    }, [urlParams, statusModal]);

    
    const columns = [
        { 
            field: 'id', 
            headerName: "#",
            type: "number",
            flex:1, 
            filterOperators: numeric_operators,
        },
        {
            field: 'center',
            headerName: "CENTER",
            flex:1.5,
            filterOperators: string_operators,
        },
        {
            field: 'camera',
            headerName: "NAME",
            flex:2,
            filterOperators: string_operators,
        },
        {
            field: 'location',
            headerName: "LOCATION",
            flex:2,
            filterOperators: string_operators,
        },
        {
            field: 'sublocation',
            headerName: "SUB-LOCATION",
            flex:1.5,
            filterOperators: string_operators,
        },
        {
            field: 'feature',
            headerName: "FEATURE",
            flex:1.5,
            filterOperators: string_operators,
        },
        {
            field: 'timestamp',
            headerName: "TIME",
            // type: "date",
            flex:2,
            renderCell: (params) => {return (params.value).replace('T',' ')},
            // renderCell: (params) => {return (dateFormat(new Date(params.value), "yyyy-mm-dd hh:mm:ss")).toString()},
            // valueGetter: (value) => value && new Date(value),
            filterable: false,
        },
        {
            field: 'group_count',
            headerName: "PRIORITY",
            flex:1.5,
            type:"singleSelect",
            valueOptions:["insignificant","minor","moderate","major","critical"],
            renderCell: (params) => {
                const priority = params.value===0 ? "Insignificant" : params.value<=2 ? "Minor" : params.value <= 5 ? "Moderate" : params.value <= 10 ? "Major" : "Critical"
                return (
                    <div style={{display:"flex",justifyContent:"center",height:"100%",alignItems:"center"}}>
                        <div variant="contained" style={{alignItems:'center',borderRadius:"5px",width:"25px",height:"25px",background:params.value===0 ? "#39d56f" : params.value<=2 ? "#86ed62" : params.value <= 5 ? "#ffcd29" : params.value <= 10 ? "#ffa629" : "#ff7250"}}></div>
                    </div>
                )
            },
        },
        {
            field: 'status',
            headerName: "STATUS",
            flex:1.5,
            type:"singleSelect",
            valueOptions:["true","false"],
            renderCell: (params) => {
                return (
                    <div style={{display:"flex",justifyContent:"center",height:"100%",alignItems:"center"}}>
                        <div style={{width:"10px", height:"10px",borderRadius:"50%", background:params.value==="true" ? "#39d56f" : params.value==="false" ? "red" : "grey"}}></div>
                    </div>
                )
            },
        },
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
            field: 'center',
            headerName: "CENTER",
            flex:1.5,
            filterOperators: string_operators,
        },
        {
            field: 'camera',
            headerName: "NAME",
            flex:2,
            filterOperators: string_operators,
        },
        {
            field: 'location',
            headerName: "LOCATION",
            flex:2,
            filterOperators: string_operators,
        },
        {
            field: 'sublocation',
            headerName: "SUB-LOCATION",
            flex:1.5,
            filterOperators: string_operators,
        },
        {
            field: 'feature',
            headerName: "FEATURE",
            flex:1.5,
            filterOperators: string_operators,
        },
        {
            field: 'timestamp',
            headerName: "TIME",
            // type: "date",
            flex:1,
            renderCell: (params) => {return (params.value).replace('T',' ')},
            // renderCell: (params) => {return (dateFormat(new Date(params.value), "yyyy-mm-dd hh:mm:ss")).toString()},
            // valueGetter: (value) => value && new Date(value),
        },
        {
            field: 'image_path',
            headerName: "IMAGE",
            flex:1,
            renderCell: (params) => {
                return (
                    <a href={params.value} target="_blank"><Image/></a>
                )
            },
            filterable: false,
        },
        {
            field: 'activity',
            headerName: "STATUS",
            flex:1,
            renderCell: (params) => {
                return (
                    <div style={{display:"flex",justifyContent:"center",height:"100%",alignItems:"center"}}>
                        <div style={{width:"10px", height:"10px",borderRadius:"50%", background:params.value[params.value.length-1]['status']==="true" ? "#39d56f" : params.value[params.value.length-1]['status']==="false" ? "red" : "grey"}}></div>
                    </div>
                )
            },
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
        console.log(newFilterModel)
        console.log("Filter model Changed!")
        const data = new URLSearchParams();
        newFilterModel['items'].map((value, index)=>{
            if (value['value']){
                if (value['field']==="timestamp"){
                    data.append(`${value['field']}__${operator_to_string[value['operator']]}`, `${dateFormat(new Date(value['value']), "yyyy-mm-dd")}%`)
                }else{
                    data.append(`${value['field']}__${operator_to_string[value['operator']]}`, value['value'])
                }
            }
        })
        window.history.replaceState({}, '', `${window.location.pathname}?${data}`);
        setUrlParams(data.toString())
    }

    const {register, handleSubmit} = useForm([])
    const onSubmit = (data, e) => {post(data)};
    const onError = (errors, e) => {post(errors)};

    const openGroup = (ids) => {
        const data = new URLSearchParams(urlParams);
        data.append(`camera__${operator_to_string['contains']}`, ids['row']['camera'])
        data.append(`feature__${operator_to_string['contains']}`, ids['row']['feature'])
        get((data.toString())).then((value)=>{
            if (value){
                console.log(value)
                setSubRows(value)
            }
        })
        setModalOpen(true)
    }

    const handleImgData = (ids) => {
        setimgData({"image_path":ids['row']['image_path'],"video_path":ids['row']['video_path'],'Event Id':ids['row']['id'],'Center Name':ids['row']['center'],'Timestamp':ids['row']['timestamp'],'Camera Name':ids['row']['camera'],'Alert Type':ids['row']['feature'],'Location':ids['row']['location'],'Sub-Location':ids['row']['sublocation'],'status':ids['row']['activity'][(ids['row']['activity']).length-1]['status'],'comment':ids['row']['activity'][(ids['row']['activity']).length-1]['comment']})
        setAlignment3(ids['row']['activity'][(ids['row']['activity']).length-1]['status'])
        // document.getElementById('alert_image').click()
        // setUserSelected(true)
        // setSelectTime(Date.now())
        // setSelectedFeature(ids['row']['corrected_feature'])
    }

    const setStatus = (type,alert_id,status) => {
        post(alert_id,status).then((response)=>{
            console.log(response)
            if (response){
                console.log(response)
                const new_data = type==="group" ? rows : subRows
                new_data.map((value,index)=>{
                    if (value['id']===alert_id){
                        new_data[index]["activity"].push(response)
                    }
                })
                console.log(new_data)
            }
        })
    }

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
                    <img src={imgData['image_path']==="" ? "noimage.jpeg" : imgData['image_path']} alt="Alert for Zone Intrusion" style={{width:"100%"}}/>
                </Box>
            </Modal>

            {/* Group Alerts */}
            <Modal
                open={modalOpen}
                onClose={() => {setModalOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{maxHeight:"80%",overflow:"scroll",position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24,}}>
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
                            // checkboxSelection
                            disableRowSelectionOnClick
                            
                            // this does not trigger model change, just shows on ui
                            initialState={{
                                filter: {
                                    filterModel: {
                                        items: filter,
                                    },
                                },
                                columns: {
                                    columnVisibilityModel: {
                                      id: false,
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
                            onRowClick = {(ids) => {handleImgData(ids);setStatusModal(true)}}
                        /> 
                </Box>
            </Modal>

            {/* Alert Status */}
            <Modal
                open={statusModal}
                onClose={() => {setStatusModal(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{maxHeight:"100%",maxWidth:"700px" ,position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24,}}>
                    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                        <ToggleButtonGroup color="secondary" value={alignment2} fullWidth exclusive onClick={(e,newAlignment)=>setAlignment2(newAlignment)} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="image" id="alert_image">Image</ToggleButton>
                        </ToggleButtonGroup>
                        <div style={{height:'200px',position:"relative",alignContent:"center",textAlign:"center"}}>
                            <img src={imgData['image_path']==="" ? "noimage.jpeg" : imgData['image_path']} alt="Alert for Zone Intrusion" onClick={()=>{setImageModal(true)}} style={{maxWidth:"100%",maxHeight:"100%",height:"auto",width:"auto"}} />
                        </div>
                        <ToggleButtonGroup color="secondary" value={alignment3} fullWidth exclusive onChange={handleToggleChange3} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="true" id="alert_image">True</ToggleButton>
                            <ToggleButton value="false" id="alert_video">False</ToggleButton>
                        </ToggleButtonGroup>
                        <Button variant="contained" color="primary" onClick={()=>{setStatus("list",imgData['Event Id'], alignment3);setStatusModal(false)}} sx={{width:"100%"}}>Submit</Button>
                        
                        <Box container border={"1px solid #e8e8e8"} borderRadius={3} p={2}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                {Object.entries(imgData).map(([key,value])=>
                                    key!=="image_path" && key!=="video_path" ? 
                                    <Grid item xs={12}>
                                        <Stack direction="row" gap={1} sx={{overflowWrap:"anywhere"}}>
                                            <Typography variant="h3" color={theme.palette.text.disabled} sx={{textWrap:"nowrap"}}>{key} : </Typography>
                                            <Typography variant="h3">{key=="Timestamp" ? value.replace('T',' ') : value}</Typography>
                                        </Stack>
                                    </Grid>
                                    :
                                    null
                                )}
                            </Grid>
                        </Box>
                        
                    </div>
                </Box>
            </Modal>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,'& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f2ff',fontSize:"1.2rem", fontWeight:800,color:"#8b83ba"},} }}
            >
                <Toolbar />

                <Stack direction="row" gap={2} sx={{height:"100%"}}>
                    <div style={{minWidth:"60%"}}>
                        <TextField sx={{width: "450px",mb:2,mr:4, background:"#f4f2ff" }} variant="outlined" placeholder='Seach Name, Location, Sub-Location, Feature' type="search" value={searchValue} onChange={handleSearchInputChange} inputRef={searchInputRef} InputProps={{
                            startAdornment: (
                                <InputAdornment>
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}/>
                        <DataGridPro
                            sx={{
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
                            slots={{
                                toolbar: CustomToolbar,
                                // footer: CustomFooter,
                            }}
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
                            onRowClick = {(ids) => {handleImgData(ids);openGroup(ids)}}
                            rowCount = {rows.length}
                        />  
                    </div>
                    <div style={{width:'40%',display:"flex",flexDirection:"column",gap:"10px"}}>
                        <ToggleButtonGroup color="secondary" value={alignment2} fullWidth exclusive onChange={handleToggleChange2} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="image" id="alert_image">Image</ToggleButton>
                        </ToggleButtonGroup>
                        <div style={{height:'300px',position:"relative",alignContent:"center",textAlign:"center"}}>
                            <img src={imgData['image_path']==="" ? "noimage.jpeg" : imgData['image_path']} alt="Alert for Zone Intrusion" onClick={()=>{setImageModal(true)}} style={{maxWidth:"100%",maxHeight:"100%",height:"auto",width:"auto"}} />
                        </div>
                        <ToggleButtonGroup color="secondary" value={alignment3} fullWidth exclusive onChange={handleToggleChange3} aria-label="Platform" style={{width:"100%"}}>
                            <ToggleButton value="true">True</ToggleButton>
                            <ToggleButton value="false">False</ToggleButton>
                        </ToggleButtonGroup>
                        <Button variant="contained" color="primary" onClick={()=>{setStatus("group",imgData['Event Id'], alignment3)}} sx={{width:"100%"}}>Submit</Button>
                        
                        <Box container border={"1px solid #e8e8e8"} borderRadius={3} p={2}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                {Object.entries(imgData).map(([key,value])=>
                                    key!=="image_path" && key!=="video_path" && key!=="status" && key!=="comment" ? 
                                    <Grid item xs={12}>
                                        <Stack direction="row" gap={1} sx={{overflowWrap:"anywhere"}}>
                                            <Typography variant="h3" color={theme.palette.text.disabled} sx={{textWrap:"nowrap"}}>{key} : </Typography>
                                            <Typography variant="h3">{key=="Timestamp" ? value.replace('T',' ') : value}</Typography>
                                        </Stack>
                                    </Grid>
                                    :
                                    null
                                )}
                            </Grid>
                        </Box>
                        
                    </div>
                </Stack>

                <div style={{height:"400px", paddingTop:"100px"}}>
                    <Typography variant="h2" component="div" borderBottom={"2px solid"} mb={2}>Activity Logs</Typography>
                    <div style={{height:"100%", overflowY:"scroll"}}>
                        {reviewLogs.map((alertGroup,index)=>
                            alertGroup.map((value,index)=>
                                <Typography variant="h2" color={theme.palette.text.disabled}>Alert #{value['alert_id']} status updated to <u>{value['status'] ? value['status'] : "null"}</u> at <u>{value['last_updated'].replace('T',' ') || ""}.</u></Typography>
                            )
                        )}
                    </div>
                </div>

            </Box>
        </>
    );
    
}

export default Main;
