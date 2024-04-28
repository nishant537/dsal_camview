import React from "react";
import {Grid, Button, Link, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';

// component for disaplying camera card in dashboard
export default function DCard(props){
    const [alignment, setAlignment] = React.useState(Object.keys(props.data[1].object_alerts)[0]);

    const handleChange = (event) => {
        setAlignment(event.target.value);
    };

    const [alignment2, setAlignment2] = React.useState('email');

    const handleChange2 = (event) => {
        setAlignment2(event.target.value);
    };
    
    const now = new Date();
    const nowDateTime = now.toISOString();
    const nowDate = nowDateTime.split('T')[0];
    var status = []
    var flag = false;
    for (const [key, value] of Object.entries(props.data[1].object_alerts)) {
        if (now.getHours()<new Date(nowDate + 'T' + value['start_time']).getHours() || now.getHours()>new Date(nowDate + 'T' + value['end_time']).getHours()){
            status.push("inactive")
        }
        else{
            status.push("active")
        }
    }
    flag = status.every(element => element === 'inactive')

    return(
        <div style={{margin:"20px 0px",padding:"30px",borderRadius:"10px",boxShadow:'10px 10px 10px #e8e8e8', border:"1px solid #e8e8e8"}} className="dCard">

            <div id="dCard" style={{display:"flex"}}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{alignItems:"center"}}>
                    <Grid item xs={12}>
                        <div style={{display:"flex",alignItems:"center"}}>
                            <Link href={`/provisioning/${props.data[0]}` }variant="h6">{props.data[1].camera_name}</Link>
                            <LinkIcon/>
                        </div>
                    </Grid>
                </Grid>
                    
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{alignItems:"center"}}>
                    <Grid item xs={12}>
                            <ToggleButtonGroup sx={{flexWrap:"wrap", "& button":{m:"4px !important",p:"4px 10px",border:"1px solid #e8e8e8 !important",borderRadius:"0 !important"}}} color="primary" value={Object.keys(props.data[1].object_alerts).includes(alignment) ? alignment : Object.keys(props.data[1].object_alerts)[0]} exclusive onChange={handleChange}>
                                {Object.entries(props.data[1].object_alerts).map(([key,value]) =>
                                    <ToggleButton size="small" value={key}>{JSON.parse(process.env.REACT_APP_FEATURE_JSON)[key]['name']}</ToggleButton>
                                )}
                            </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{alignItems:"center"}}>
                    <Grid item xs={6}>
                        <ToggleButtonGroup sx={{flexWrap:"wrap", "& button":{m:"4px !important",p:"4px 10px",border:"1px solid #e8e8e8 !important",borderRadius:"0 !important"}}} color="primary" value={alignment2} exclusive onChange={handleChange2}>
                            <ToggleButton size="small" value={'email'}>{'Email'}</ToggleButton>
                            <ToggleButton size="small" value={'alert_dashboard'}>{'Alert Dashboard'}</ToggleButton>
                            {/* {Object.keys(props.data[1].features).forEach(function(key, index) {
                                    if (props.data[1].features[key] == "True"){
                                    <ToggleButton size="small" value={key}>{key}</ToggleButton>
                                }
                            })} */}
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" noWrap component="div">
                            {Object.keys(props.data[1].object_alerts).includes(alignment) ? props.data[1].object_alerts[alignment].start_time + " - " +  props.data[1].object_alerts[alignment].end_time: props.data[1].object_alerts[Object.keys(props.data[1].object_alerts)[0]].start_time + " - " +  props.data[1].object_alerts[Object.keys(props.data[1].object_alerts)[0]].end_time}
                        </Typography>
                    </Grid>
                </Grid>
            </div>

        </div>
    )
}