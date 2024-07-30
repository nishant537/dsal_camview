import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField, Checkbox, Divider,Slider,Typography,Modal,InputLabel,MenuItem,FormControl,Select,Radio,RadioGroup,FormControlLabel,FormLabel } from '@mui/material';
import PCard from './FeatureCard';
import { ReactDOM } from 'react';
import ROI from './ROI'
import LOF from './LOF'
import {put, post, del} from '../provider/feature_provider';
import {get_one} from '../provider/roi_provider';
import { PropaneSharp } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth:"80%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight:"80%",
  overflowY:"scroll"
};

// Modal for adding/editing a camera
export default function BasicModal(props) {
  console.log(props)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = React.useState(()=>{
    if (props.data!=null){
      return props.data
    }else{
      const feature_json = JSON.parse(process.env.REACT_APP_FEATURE_JSON)["camera_fault"]['json']
      const temp = Object.fromEntries(
          feature_json.map(({id, value}) => [id, value])
      );
      return temp;
    }
  });
  var [feature, setFeature] = React.useState('camera_fault');
  const [roiData, setRoiData] = React.useState([])

  React.useEffect(() => {
    if (props.id){
      get_one(props.id).then((value)=>{
        console.log(value)
        setRoiData(value)
    })
    }
  },[])


  // setting roi points
  const [temp_points, setTempPoints] = React.useState(() => {
    if (props.data!=null){
      const temp_points = [];
      (Object.keys(props.data).filter(k => k.startsWith('point'))).forEach(key => {
        temp_points.push({'x':props.data[key][0],'y':props.data[key][1]})
      })
      return temp_points
    } else{
      return [];
    }
  })

  // setting lof points
  const [temp_lof_points, setTempLofPoints] = React.useState(() => {
    if (props.data!=null){
      const temp_points = [];
      (Object.keys(props.data).filter(k => k.endsWith('point'))).forEach(key => {
        temp_points.push({'x':props.data[key][0],'y':props.data[key][1]})
      })
      return temp_points
    } else{
      return [];
    }
  })

  // set emailList - multiple added emails
  const [emailList, setEmailList] = React.useState(() => {
    if (props.data!=null){
      const temp = []
      props.data['email_list'].split(',').map((value,index) => {
        temp.push({"email":value.trim()})
      })
      return temp
    }else{
     return [{"email":""}]
    }
  })

  const [emailListButton,setEmailListButton] = React.useState('Add')
  const addEmail = () => {
    if (emailListButton == "Add"){
      setEmailList(emailList.concat([{"email":""}]))
      setEmailListButton('Save')
    } else{
      const pDiv = document.getElementById('email_list');
      const cDiv = pDiv.children;
      for (let i = 0; i < cDiv.length; i++) {
        cDiv[i].children[1].children[0].style.backgroundColor = "#e8e8e8"
        cDiv[i].children[1].children[0].disabled = true
      }
      setEmailListButton('Add')
    }
  }
  const updateEmailList = (event) => {
    const new_arr = emailList
    new_arr[event.target.id] = {"email":event.target.value.trim()}
    setEmailList(new_arr)
  }

  // set smsList - multiple added phonenumbers
  const [smsList, setSmsList] = React.useState(() => {
    if (props.data!=null){
      const temp = []
      const existing_sms = "sms_list" in props.data ? props.data['sms_list'] : "" 
      existing_sms.split(',').map((value,index) => {
        temp.push({"sms":value.trim()})
      })
      return temp
    }else{
     return [{"sms":""}]
    }
  })

  const [smsListButton,setSmsListButton] = React.useState('Add')
  const addSms = () => {
    if (smsListButton == "Add"){
      setSmsList(smsList.concat([{"sms":""}]))
      setEmailListButton('Save')
    } else{
      const pDiv = document.getElementById('email_list');
      const cDiv = pDiv.children;
      for (let i = 0; i < cDiv.length; i++) {
        cDiv[i].children[1].children[0].style.backgroundColor = "#e8e8e8"
        cDiv[i].children[1].children[0].disabled = true
      }
      setSmsListButton('Add')
    }
  }
  const updateSmsList = (event) => {
    const new_arr = smsList
    new_arr[event.target.id] = {"sms":event.target.value.trim()}
    setSmsList(new_arr)
  }  


  const saveFeature = () => {
    if ("list" in props){
      const feature_json = Object.assign({},data)
      // concat email_addresses
      const concatEmail = [];
      emailList.map((key,value) => {
        if (key['email'].trim()!="" || value==0){
          concatEmail.push(key['email'].trim())
        }
      })
      feature_json['email_list'] = concatEmail.join()

      // concat Phone numbers
      const concatSms = [];
      smsList.map((key,value) => {
        if (key['sms'].trim()!="" || value==0){
          concatSms.push(key['sms'].trim())
        }  
      })
      feature_json['sms_list'] = concatSms.join()
      const new_data = {"name":feature,"camera_id":props.camera_id,"json":JSON.stringify(feature_json)}

      if (Object.keys(props.list).indexOf(feature)!==-1){
        put(props.list[feature]['id'], new_data).then((value)=>{
          console.log(value)
        })
      }else{
        post(new_data).then((value)=>{
          console.log(value)
        })
      }
      
      // resetting feature data
      if (props.data!=null){
        const temp = []
        props.data['email_list'].split(',').map((value,index) => {
          temp.push({"email":value})
        })
        setEmailList(temp)

        const temp_sms = []
        const existing_sms_list = "sms_list" in props.data ? props.data['sms_list'] : "" 
        existing_sms_list.split(',').map((value,index) => {
          temp_sms.push({"sms":value})
        })
        setSmsList(temp)
        console.log(props.data)
        setData(props.data)
      }else{
        setEmailList([{"email":""}])
        setSmsList([{"sms":""}])
        
        const feature_json = JSON.parse(process.env.REACT_APP_FEATURE_JSON)[feature]['json']
        const temp = Object.fromEntries(
            feature_json.map(({id, value}) => [id, value])
        );
        setData(temp);

      }
    }else{
      alert('Some Error Occurred')
    }
    window.location.reload()
    // setOpen(false);
  }

  const handleChange = (event) => {
    setFeature(event.target.value);
    const feature_json = JSON.parse(process.env.REACT_APP_FEATURE_JSON)[event.target.value]['json']
    const temp = Object.fromEntries(
        feature_json.map(({id, value}) => [id, value])
    );
    setData(temp);  
  };

  const updateData = (event,component_id) => {
    const new_data = Object.assign({},data)
    if (component_id == "video_saving_check" || component_id == "sound_alarm" || component_id == "direction"){
      new_data[component_id] = event.target.checked==true ? true : false
    }else if (component_id.endsWith("_dir")){
        new_data[component_id] = event.target.checked==true ? true : false
    }else if (component_id == "min_people"){
      new_data[component_id] = Number(event.target.value)
    }else if (component_id == "idle_time"){
      new_data[component_id] = Number(event.target.value) * 60
    }else{
      new_data[component_id] = event.target.value
    }
    setData(new_data)
  }

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" color='primary'>+ {props.text} Feature</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Box component="form" sx={{'& > :not(style)': { my: 1,width:'100%' }, }} autoComplete="off" onSubmit={saveFeature}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Feature</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={feature} label="AIFeature" onChange={handleChange}>

                  {props.text=='Add' ? 
                    props.featureData['features'].map((key,index) => 
                        (JSON.parse(process.env.REACT_APP_FEATURE_JSON)[key]['display'] ? <MenuItem value={key}>{JSON.parse(process.env.REACT_APP_FEATURE_JSON)[key]['name']}</MenuItem> : null)
                    )
                  :
                    <MenuItem value={props.name}>{JSON.parse(process.env.REACT_APP_FEATURE_JSON)[props.name]['name']}</MenuItem>
                  }

                </Select>

                <Typography variant='h5' sx={{pt:3,pb:1}}>Set Paramaters</Typography>

                {/* {feature != 'entryexit' ? null :
                  <><LOF update_data = {setData} current_data = {data} points_data = {temp_lof_points} bodyimg={props.bodyimg}/></>
                } */}

                {/* {Object.keys(data).includes("roi") ?
                  Object.keys(data["roi"]).filter(k => k.startsWith("roi_")).map((e, i) => (
                    <ROI id={e} feature_id={props.id || 0} update_data = {setData} current_data = {data} points_data = {temp_points} bodyimg={props.bodyimg} name={data['roi'][e]['name'] ? data['roi'][e]['name'] : null} refreshFrame={props.refreshFrame}/>
                  ))
                :
                null
                } */}

                {roiData.length==0?
                <>
                  <ROI feature_id={props.id || 0} points_data = {null} bodyimg={props.bodyimg} name={'ROI_01'} refreshFrame={props.refreshFrame}/>
                </>
                :
                roiData.map((roi,index)=>
                    <ROI feature_id={props.id || 0} points_data = {JSON.parse(roi['json']) || null} bodyimg={props.bodyimg} name={'ROI_01'} refreshFrame={props.refreshFrame}/>
                )
                }

                {JSON.parse(process.env.REACT_APP_FEATURE_JSON)[feature]['json'].map((value,index) => 
                  (value["type"]["type"]=="email" && value["display"]) ? 
                  <>
                    <div id="email_list" >
                    {emailList.map((key, value) => 
                      (key['email']!="" ? <TextField sx={{my:1, width:"100%"}} id={value} label="Email" variant="outlined" defaultValue={key['email']} onChange = {updateEmailList} type="email" errorText={'Please enter correct email'}/> : 
                      <TextField sx={{my:1, width:"100%"}} id={value} label="Email" variant="outlined" onChange = {updateEmailList} type="email" errorText={'Please enter correct email'} />)
                    )}
                    </div>
                    <Button color="primary" variant='outlined' onClick={addEmail}>{emailListButton} Email</Button>
                  </>
                  :
                  (value["type"]["type"]=="checkbox" && value["display"]) ? <div style={{display:"flex"}}><Checkbox {...value['type']['name']} id={value['id']} defaultChecked = {props.data!=null ? props.data[value["id"]] : value['type']['default']} onClick = {(event)=>{updateData(event,value['id'])}}/><p>{value['type']['name']}</p></div> :
                  (value["type"]["type"]=="slider" && value["display"]) ? <><Typography>{value["type"]["name"]}</Typography><Slider aria-label={value["type"]["name"]} id={value["id"]} defaultValue={props.data != null ? props.data[value["id"]] : value["type"]['default']} valueLabelDisplay="auto" min={value["type"]['min']} max={value["type"]['max']} step={value["type"]['step']} onChange = {(event)=>{updateData(event,value['id'])}} /></> :
                  (value["type"]["type"]=="input_box" && value["display"]) ? <><label for={value["id"]} style={{margin:"10px 0"}}>{value['type']['name']}</label> <TextField id={value['id']} type={value['type']['input_type']} variant="outlined" defaultValue={props.data!=null ? props.data[value["id"]] : value['type']['default']}  onChange = {(event)=>{updateData(event,value['id'])}}/></> :
                  (value["type"]["type"]=="radio" && value["display"]) ? 
                    <>
                      <FormControl>
                        <FormLabel id="demo">{value['type']['name']}</FormLabel>
                        <RadioGroup aria-labelledby="demo" id={value["id"]} defaultValue={value['type']['default']} name="radio-buttons-group" onChange={(event)=>{updateData(event,value['id'])}}>
                          {value['type']['values'].map((key,index) => <FormControlLabel value={key} control={<Radio />} label={key} />)}
                        </RadioGroup>
                      </FormControl>
                    </>
                  : null
                )}
                
                <Button variant='outlined' type='submit' sx={{mt:"20px"}}>{props.text=='Edit' ? "Save" : "Add"} Feature</Button>
              </FormControl>
            </Box>
        </Box>
      </Modal>
    </div>
  );

}
