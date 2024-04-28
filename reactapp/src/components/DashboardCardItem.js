import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Grid,Button,ToggleButton,ToggleButtonGroup } from '@mui/material';

// component for navigation menu options
export default function LItem(props){
    const [alignment, setAlignment] = React.useState(0);

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const [alignment2, setAlignment2] = React.useState(0);

    const handleChange2 = (event, newAlignment2) => {
        setAlignment2(newAlignment2);
    };
    return(
        <div style={{margin:"20px 0px",padding:"30px",borderRadius:"10px",boxShadow:'10px 10px 10px #e8e8e8'}} className="dCard">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{alignItems:"center"}}>
                <Grid item xs={2}>
                    <Typography variant="h6" noWrap component="div">
                        {props.data.name}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" color={props.data.status=="active"?"success":"error"}>{props.data.status}</Button>
                </Grid>
                <Grid item xs={3}>
                        <ToggleButtonGroup sx={{flexWrap:"wrap", "& button":{m:"4px !important",p:"4px 10px",border:"1px solid #e8e8e8 !important",borderRadius:"0 !important"}}} color="primary" value={alignment} exclusive onChange={handleChange}>
                            {props.data.features.map((feature,i) => 
                                <ToggleButton size="small" value={i}>{feature.name}</ToggleButton>
                            )}
                        </ToggleButtonGroup>
                </Grid>

                <Grid item xs={3}>
                    <ToggleButtonGroup sx={{flexWrap:"wrap", "& button":{m:"4px !important",p:"4px 10px",border:"1px solid #e8e8e8 !important",borderRadius:"0 !important"}}} color="primary" value={alignment2} exclusive onChange={handleChange2}>
                        {props.data.features[alignment].alerts.map((alert,i) => 
                            <ToggleButton size="small" value={i}>{alert}</ToggleButton>
                        )}
                    </ToggleButtonGroup>
                    {/* <Box sx={{ flexWrap: 'wrap','& button':{m:0.5}}}>
                        <Button variant="contained" sx={{bgcolor:'warning.light'}} size="small">Email</Button>
                        <Button variant="contained" sx={{bgcolor:'warning.light'}} size="small">Whatsapp</Button>
                        <Button variant="contained" sx={{bgcolor:'warning.light'}} size="small">Success</Button>
                    </Box> */}
                </Grid>

                <Grid item xs={2}>
                    <Typography variant="h6" noWrap component="div">
                        {props.data.features[alignment].activation_time}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}