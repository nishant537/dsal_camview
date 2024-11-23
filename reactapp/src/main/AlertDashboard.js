import * as React from 'react';
import { Divider, Box, Toolbar, Typography, Modal, capitalize,ToggleButton, ToggleButtonGroup, TextField, Button, MenuItem, Select, InputLabel,FormControl,InputAdornment, IconButton } from '@mui/material';
import { DataGrid, GridToolbarContainer,GridToolbarFilterButton,GridToolbarDensitySelector, GridToolbar} from '@mui/x-data-grid';
// import ImageUpload from "../components/ImageUpload"
import {Search, AccessTime, Done} from "@mui/icons-material";
import { createSvgIcon } from '@mui/material/utils';
import { useSearchParams } from 'react-router-dom';
import './stylesheets/analytics.css'
import {CChart} from "@coreui/react-chartjs";
import dateFormat, { masks } from "dateformat";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // maxWidth: "80%",
    maxHeight: "80%",
    width: "auto",
    // height: "auto",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};
const ExportIcon = createSvgIcon(
  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
  'SaveAlt',
);

const drawerWidth = 240;

const SUBMIT_FILTER_STROKE_TIME = 500;
// var rows = [];
var cards = [{"feature_type": "Total Alerts", "count":"?"}];

function Main(props) {

    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }
    
    const [rows, setRows] = React.useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilterParams = urlParams.get('filter')!=null ? urlParams.get('filter') : "";
    const [totalCount, setTotalCount] = React.useState("");
    const [seed, setSeed] = React.useState("");
    const [data, setData] = React.useState(null);
    const [userSelected, setUserSelected] = React.useState(false);
    const [selectTime, setSelectTime] = React.useState(Date.now());
    const [filterParams, setFilterParams] = React.useState(urlFilterParams);
    const [chartLabels, setChartLabels] = React.useState(["Zone Intrusion","Over Manning","Crowd Detection","PPE Not Detected","Fire Smoke","Camera Fault","Tail gating","fire_smoke"]);
    const [chartDatasets, setChartDatasets] = React.useState([152493,6465,9982,5619,3602,31071,149,501]);
    const [cluster,setCluster] = React.useState(()=>{
      // Object.entries(JSON.parse(window.localStorage.getItem('site_access'))).map((value,index) => {
      //   if (value[1].length>0){
      //     return value[0];
      //   }
      // })
      return Object.keys(JSON.parse(window.localStorage.getItem('site_access')))[0];
    })
    const [selectedSite,setSelectedSite] = React.useState('All')
    const [selectedType,setSelectedType] = React.useState(()=>{
      if (window.localStorage.getItem('dashboard_access') && JSON.parse(window.localStorage.getItem('dashboard_access'))['provisioning'].includes("view_camera")){
        return "All"
      }else{
        return "true"
      }
    })
    const [feature,setFeature] = React.useState("")
    const [showInfo,setShowInfo] = React.useState(true)

    const dateConstruct = new Date();
    let day = dateConstruct.getDate() < 10 ? `0${dateConstruct.getDate()}`: dateConstruct.getDate() ;
    let month = dateConstruct.getMonth() + 1 < 10 ? `0${dateConstruct.getMonth() + 1}`:dateConstruct.getMonth() + 1 ;
    let year = dateConstruct.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}-${month}-${day}`;

    const [startDate,setStartDate] = React.useState(`${year}-${month}-${day} ${"00:00"}`);
    const [endDate,setEndDate] = React.useState(`${year}-${month}-${day} ${"23:59"}`);


    var filterModelParams;
    if (filterParams!=""){
      filterModelParams = { columnField: filterParams.split(' ')[0], operatorValue: filterParams.split(' ')[1], value: filterParams.split(' ')[2] }
    }else{
      filterModelParams = {}
    }
    const [currentPage, setCurrentPage] = React.useState(0)

    const [loading, setLoading] = React.useState(true)
    const [imgData, setimgData] = React.useState({'id':"?",'imgPath':"NOT SAVED",'vidPath':"NOT SAVED",'alertType':"?",'cameraName':"?",'alertTimestamp':"?","location":"?"})

    // for modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (loading){
                names()
            }
        }, 2000);
      
        return () => clearInterval(interval);
    }, [loading]);

    React.useEffect(() => {
      const interval = setInterval(() => {
          window.location.reload()
      }, process.env.REACT_APP_RELOAD_RATE);
    
      return () => clearInterval(interval);
  },[]);

    React.useEffect(() => {
      names()
    }, [feature,cluster,selectedSite, selectedType,startDate,endDate,currentPage,seed]);

    const names = async() => {
        setLoading(false)
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/filter_data?feature_type=${feature}&site_data=dcdc&count=false&cluster=${cluster == 'All' ? null : cluster}&site=${selectedSite == 'All' ? null :selectedSite}&correction_type=${selectedType == 'All' ? null :selectedType}&start_alert_timestamp=${startDate}&end_alert_timestamp=${endDate}&page=${currentPage}&camera_name=${seed}&cluster_access=${Object.keys(JSON.parse(localStorage.getItem('site_access')))}&site_access=${Object.values(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',')}`,{method : "POST"});
        const received_data = (await response.json())['data']
        setData(received_data)
        setLoading(true)
        // loadRows(received_data)
    }

    React.useEffect(() => {
      console.log(data);
      if (data) {
        loadRows(data, feature);
      }
    }, [data, feature]);

      
    const exportCsv = () => {
      fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/filter_data?feature_type=${feature}&site_data=dcdc&count=false&cluster=${cluster == 'All' ? null : cluster}&site=${selectedSite == 'All' ? null :selectedSite}&correction_type=${selectedType == 'All' ? null :selectedType}&start_alert_timestamp=${startDate}&end_alert_timestamp=${endDate}&page=${currentPage}&camera_name=${seed}&export=${true}&cluster_access=${Object.keys(JSON.parse(localStorage.getItem('site_access')))}&site_access=${Object.values(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',')}`,{method : "POST"})
      .then(response => {
      return response.blob();
        
      })
      .then(blob => {
        var url = window.URL.createObjectURL(new Blob([blob]));
        var a = document.createElement('a');
        a.href = url;
        a.setAttribute('download',"export.csv")
        document.body.appendChild(a); // append the element to the dom
        handleClose()
        a.click();
        a.parentNode.removeChild(a);
      })
      .catch(error => {
        console.error(error);
      });
    }

    const loadRows = (data) => {
        const temp = []
        data['alert_data'].map((value,index) => {
          temp.push(value)
        })
        setRows(temp)
        let count = 0;
        data['count_data'].map((value,index) => {
            count+=value['count']
        })

        let labels = [];
        let datasets = [];
        data['chart_data'].map((value,index) => {
          labels.push(value['daily'])
          datasets.push(value['count'])
        })

        if (feature==""){
          setTotalCount(count)
        }
        
        setChartLabels(labels)
        setChartDatasets(datasets)
        cards = data['count_data']
        Object.keys(JSON.parse(process.env.REACT_APP_FEATURE_ALERTS)).map((key,index) => {
          if (!(key in (Object.fromEntries(data['count_data'].map(({feature_type, count}) => [feature_type, count]))))){
            cards.push({'feature_type':key, "count": 0})
          }
        })
        cards.unshift({'feature_type':'Total Alerts', "count": count})
        
        if (!userSelected || (Date.now() - selectTime == 15)){
            if (temp.length>0){
                setimgData({'id':temp[0]['ID'],'imgPath':(process.env.REACT_APP_IMAGE_ENV=="local"?`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert_image/${temp[0]['image_path'].replaceAll('/','+')}`:`https://deepsightbucket.s3.amazonaws.com/${temp[0]['image_path']}`),'vidPath':(process.env.REACT_APP_IMAGE_ENV=="local"?`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert_video/${temp[0]['video_path'].replaceAll('/','+')}`:`https://deepsightbucket.s3.amazonaws.com/${temp[0]['video_path']}`),'alertType':temp[0]['feature_type'],'cameraName':temp[0]['camera_name'],'alertTimestamp':temp[0]['alert_timestamp'],'review':temp[0]['review'], 'type':temp[0]['type'],"location":temp[0]['location']})
            }else{
                setimgData({'id':"?",'imgPath':"noimage.jpeg",'vidPath':"noimage.jpeg",'alertType':"?",'cameraName':"?",'alertTimestamp':"?","location":"?"})
            }
        }
        setLoading(true)

    }
    
    alert(feature)
    let columns;
    if (Object.keys(JSON.parse(process.env.REACT_APP_FEATURE_ALERTS)).includes(feature)){
      columns = JSON.parse(process.env.REACT_APP_FEATURE_ALERTS)[feature]
    }else{
      columns = [
        { field: 'feature_type', headerName: 'Feature Type', flex:0.2, minWidth:120 },
        { field: 'location', headerName: 'Location', flex:0.2, minWidth:120 },
        { field: 'sub_location', headerName: 'Sub-Location', flex:0.2, minWidth:120 },
        { field: 'camera_name', headerName: 'Camera Name', flex:0.2, minWidth:120 },
        { field: 'alert_timestamp', headerName: 'Alert Timestamp', flex:0.24, minWidth:120, valueGetter: ({ value }) => value && dateFormat(new Date(value), "dd-mm-yyyy, h:MM:ss TT")},
      ]
    }
    

    const getSites = () => {
      return Object.values(JSON.parse(window.localStorage.getItem('site_access'))).flat();
    }

    const handleImgData = (ids) => {
        setimgData({'id':ids['row']['ID'],'imgPath':(process.env.REACT_APP_IMAGE_ENV=="local"?`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert_image/${ids['row']['image_path'].replaceAll('/','+')}`:`https://deepsightbucket.s3.amazonaws.com/${ids['row']['image_path']}`),'vidPath':(process.env.REACT_APP_IMAGE_ENV=="local"?`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert_video/${ids['row']['video_path'].replaceAll('/','+')}`:`https://deepsightbucket.s3.amazonaws.com/${ids['row']['video_path']}`),'alertType':ids['row']['feature_type'],'cameraName':ids['row']['camera_name'],'alertTimestamp':ids['row']['alert_timestamp'],'review':ids['row']['review'],'type':ids['row']['type'],'location':ids['row']['location']})
        document.getElementById('alert_image').click()
        setUserSelected(true)
        setSelectTime(Date.now())
        setAlignment2(ids['row']['type'])
        setSelectedFeature(ids['row']['corrected_feature'])
    }

    const onFilterChange = React.useCallback((filterModel) => {
      if ((filterModel['items'].length!=0)){
        setFilterParams(filterModel['items'][0]['columnField'] + '+' + filterModel['items'][0]['operatorValue'] + '+' + (filterModel['items'][0]['value']!=undefined ? filterModel['items'][0]['value'] : ""))
        names(0, filterModel=filterModel['items'][0]['columnField'] + '+' + filterModel['items'][0]['operatorValue'] + '+' + (filterModel['items'][0]['value']!=undefined ? filterModel['items'][0]['value'] : ""))
      }
    }, []);

    const onPaginationChange = React.useCallback((newPage) => {
        setCurrentPage(newPage)
    },[])

    const [alignment, setAlignment] = React.useState('image');
    const [alignment2, setAlignment2] = React.useState('true');

    const handleToggleChange = (event, newAlignment) => {
      if (newAlignment!=null){
        setAlignment(newAlignment);
      }
    };
    const handleToggle2Change = (event, newAlignment) => {
      if (newAlignment!=null){
        setAlignment2(newAlignment);
      }
    };

    const [selectedFeature,setSelectedFeature] = React.useState("")
    const handleChange = (event) => {
      let temp_data = imgData
      temp_data['alertType'] = event.target.value
      setimgData(temp_data)
    };

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarDensitySelector />
            <Button color='primary' size="small" startIcon={<ExportIcon/>} onClick={exportCsv}>Export CSV</Button>
            {/* <Button color='primary' size="small" startIcon={<ExportIcon/>} onClick={() => alert('Export PDF')}>Export PDF</Button> */}
            {/* <GridToolbarExport /> */}
          </GridToolbarContainer>
        );
      }

    const requestCorrection = async() =>{
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/request_correction`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "id":imgData['id'], "type": alignment2, "corrected_feature": imgData['alertType'] })
      })
      const returned_response = await response.json()
      if (returned_response.status_code != 200 && returned_response.status_code != 201) {
          alert(returned_response.message)
      } else {
          alert("Correction Requested!")
      }
    }

    const requestReview = async() =>{
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/request_review`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "id":imgData['id'] })
      })
      const returned_response = await response.json()
      if (returned_response.status_code != 200 && returned_response.status_code != 201) {
          alert(returned_response.message)
      } else {
          names()
      }
    }

    const checkSearch = event => {
      setSeed(event.target.value.trim())
    }
    return(
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <img style={style} src={imgData['imgPath']=="NOT SAVED" ? "noimage.jpeg" : imgData['imgPath']}></img>
            </Modal>
            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width:{sm:`calc(100%-${drawerWidth}px)`}, display:"flex", flexDirection:"column", height:"100vh"}} 
            >
                <Toolbar />

                <div id='headerAD'>
                    <div id='clusterUMSection'>
                      {Object.keys(JSON.parse(window.localStorage.getItem('site_access'))).map((key, index) => (
                        <Button className={ 'active' } variant="outlined" sx={{width:"100px",height:"40px"}} onClick={() => {setCluster(key);}}>{key}</Button>
                      ))}
                    </div>

                    <div style={{display:"flex",gap:'10px'}}>
                      <div  style={{minWidth:"200px",color:"black",fontSize:"16px"}}>
                          <Select name='Site' id="siteFilter" label="Site" value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)} sx={{width:'100%'}}>
                              <MenuItem value={"All"}>All</MenuItem>
                              {getSites().map((site) => 
                                <MenuItem value={site}>{site}</MenuItem>
                              )}
                          </Select>
                      </div>

                      <div style={{minWidth:"200px",color:"black",fontSize:"16px"}}>
                      {window.localStorage.getItem('dashboard_access') && JSON.parse(window.localStorage.getItem('dashboard_access'))['provisioning'].includes("view_camera")
                        ?
                        <Select name='Type' id="typeFilter" label="Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} sx={{width:'100%'}}>
                          <MenuItem value={"All"}>All</MenuItem>
                          <MenuItem value={"true"}>true</MenuItem>
                          <MenuItem value={"false"}>false</MenuItem>
                          <MenuItem value={"escalate"}>escalate</MenuItem>
                        </Select>
                      :
                        <Select name='Type' id="typeFilter" label="Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} sx={{width:'100%'}}>
                          <MenuItem value={"true"}>true</MenuItem>
                        </Select>
                      }
                      </div>
                    </div>

                    <div className='analytics-filters-date'>
                      <div>
                          <TextField id="startDate" type='datetime-local' label="Start Date" InputLabelProps={{ shrink: true, required: true }} variant="outlined" onChange={(e) => setStartDate(e.target.value)} value={startDate} sx={{width:'200px'}}/>
                      </div>
                      <div>
                          <TextField id="endDate" type='datetime-local' label="End Date" InputLabelProps={{ shrink: true, required: true }} variant="outlined" onChange={(e) => setEndDate(e.target.value)} value={endDate} sx={{width:'200px'}}/>
                      </div>
                    </div>

                    {/* <Button variant="outlined" sx={{width:"100px",height:"40px"}} onClick={() => {window.location.href="/emails"}}>EMAILS</Button> */}
                </div>                

                <div id="postHeaderAD" style={{display:(showInfo ? "flex" : "none")}}>
                  <div className='chartAD'>
                    <CChart
                      type="line" 
                      data={{
                        labels: chartLabels,
                        datasets: [
                          {
                            label: `${(feature=="" ? "Total" : feature)} Alert Count (${startDate==endDate ? "per hour" : "per day"})`,
                            backgroundColor: "rgba(220, 220, 220, 0.2)",
                            borderColor: "rgba(220, 220, 220, 1)",
                            pointBackgroundColor: "rgba(220, 220, 220, 1)",
                            pointBorderColor: "#fff",
                            data: chartDatasets
                          } 
                        ],
                      }}
                    />
                  </div>
                  <div id = "cards" className="cardsAD">
                      {cards.map((value, index) => 
                          <div onClick={value['feature_type']!='Total Alerts' ? (event)=>{feature==value['feature_type'] ? setFeature("") : setFeature(value['feature_type']);setTotalCount(value['count'])} : null} class="alertCard" id={index} style={feature==value['feature_type'] ? {border:"1px solid #e8e8e8",boxShadow:"5px 5px 5px whitesmoke",width:"30%", minWidth:"200px", display:'flex',flexDirection:"column",padding:"20px",marginBottom:'20px',marginRight:'20px',backgroundColor:"#e8e8e8"} : {border:"1px solid #e8e8e8",boxShadow:"5px 5px 5px whitesmoke",width:"30%", minWidth:"200px", display:'flex',flexDirection:"column",padding:"20px",marginBottom:'20px',marginRight:'20px'}}>
                              <Typography variant='h6'>{capitalize(value['feature_type'])}</Typography>
                              <Typography variant='h4' align="right">{value['count']}</Typography>
                          </div>
                      )}
                      <div style={{width:"30%",minWidth:"200px",marginRight:'20px',height:"1px"}}></div>
                      <div style={{width:"30%",minWidth:"200px",marginRight:'20px',height:"1px"}}></div>
                  </div>
                </div>

                
                <Divider/>
                
                <div style={{display:"flex",alignItems:"center"}}>
                  <TextField sx={{width: "350px",my:2,mr:4 }} id="outlined-search" label="Search" type="search" defaultValue={seed} onChange={checkSearch} InputProps={{
                    endAdornment: (
                    <InputAdornment>
                        <IconButton>
                            <Search />
                        </IconButton>
                    </InputAdornment>
                      )
                  }}/>
                <Button variant='contained' type='submit' sx={{maxWidth:"200px"}} onClick={()=>{setShowInfo(!showInfo)}}>{showInfo ? "Hide" : "Show"} Info</Button>

                </div>

                <div id='alertMain' style={{height:"100%"}}>
                    <div id="alertGrid" style={{width:"70%", minHeight:"600px"}}>
                        <DataGrid
                            disableColumnFilter 
                            getRowId={(r) => r.ID}
                            // loading = {true}
                            rows={rows}
                            columns={columns}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                            sx = {{fontSize:"1rem"}}
                            onRowClick = {(ids) => {handleImgData(ids)}}
                            components={{
                                // Toolbar: GridToolbar,
                                Toolbar: CustomToolbar,
                              }}
                            componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true },csvOptions: { allRows: true } } }}
                            initialState={{
                                filter:{
                                    filterModel: {items: [filterModelParams],},
                                }
                            }}
                            filterMode="server"
                            onFilterModelChange={onFilterChange}
                            paginationMode="server"
                            onPageChange={onPaginationChange}
                            rowCount={totalCount} 

                        />
                    </div>
                    <div id="alertImage" style={{width:"30%"}}>
                        <div style={{marginBottom:"20px"}}>
                            <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleToggleChange} aria-label="Platform" style={{width:"100%"}}>
                                <ToggleButton value="image" id="alert_image" style={{width:"50%"}}>Image</ToggleButton>
                                {process.env.REACT_APP_ALERT_VIDEO == "true" ? <ToggleButton value="video" id="alert_video" style={{width:"50%"}}>Video</ToggleButton>:null}
                            </ToggleButtonGroup>
                        </div>
                        <div style={{display:"flex",flexDirection:"column"}}>
                            {alignment=='image' ? <img style={{maxWidth:"100%",height:"auto"}} src={imgData['imgPath']=="NOT SAVED" ? "noimage.jpeg" : imgData['imgPath']} alt="alert_image" onClick={handleOpen}/> : 
                            process.env.REACT_APP_ALERT_VIDEO == "true" ?
                              <video controls>
                                  <source src={imgData['vidPath']=="NOT SAVED" ? "noimage.jpeg" : imgData['vidPath']} type="video/mp4"/>
                                  Your browser does not support HTML video.
                              </video>
                            :null}
                            <span id='alert_type' style={{color:'red',textTransform:"capitalize"}}>Alert Type : {imgData['alertType']}</span>
                            <span id='camera_id' style={{color:'green',textTransform:"capitalize"}}>Camera Name : {imgData['cameraName']}</span>
                            <span id='alert_timestamp' style={{color:'blue',textTransform:"capitalize"}}>Alert Timestamp : {imgData['alertTimestamp']}</span>
                            <span id='location' style={{color:'blue',textTransform:"capitalize"}}>Location : {imgData['location']}</span>
                        </div>
                        <div style={{"marginTop":"40px","display":"flex","flexDirection":"column"}}>
                            <ToggleButtonGroup color="primary" value={alignment2} exclusive onChange={handleToggle2Change} aria-label="Platform" style={{width:"100%"}}>
                              <ToggleButton value="true" style={{width:"30%"}}>TRUE</ToggleButton>
                              <ToggleButton value="false" style={{width:"30%"}}>FALSE</ToggleButton>
                              <ToggleButton value="escalate" style={{width:"30%"}}>ESCALATE</ToggleButton>
                            </ToggleButtonGroup>

                            {alignment2=="false" ?
                              <FormControl fullwidth sx={{"marginTop":"20px"}}>
                                <InputLabel id="demo-simple-select-label">Select Feature</InputLabel>
                                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={imgData['alertType']} label="Feature" onChange={handleChange}>
                                    {Object.keys(JSON.parse(process.env.REACT_APP_FEATURE_JSON)).map((key,index) => 
                                        <MenuItem value={JSON.parse(process.env.REACT_APP_FEATURE_JSON)[key]['name']}>{JSON.parse(process.env.REACT_APP_FEATURE_JSON)[key]['name']}</MenuItem>
                                    )}
                                </Select>
                              </FormControl>
                            :null}
                            <Button variant='contained' type='submit' sx={{mt:"20px"}} color={imgData['type'] ? "success" : "primary"} onClick={requestCorrection}>{imgData['type']!=null ? "Re-submit" : "Submit"}</Button>
                            {/* <Button variant='contained' type='submit' sx={{mt:"20px"}} color={imgData['review'] ? "success" : "primary"} onClick={requestReview} startIcon={imgData['review'] ? <Done/> : <AccessTime/>}>Review {imgData['review'] ? "Done" : "Pending"}</Button> */}
                        </div>
                        

                    </div>
                    <div>
                      
                  </div>
                </div>

                
                {/* <ImageUpload /> */}
            </Box>
        </>
    );
}

export default Main;
