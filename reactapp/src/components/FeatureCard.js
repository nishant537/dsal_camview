import { Box, Typography } from "@mui/material";
import React from "react";
import {Grid} from "@mui/material";
import {Divider} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCameraModal from "./AddCameraModal"
import Button from "@mui/material/Button";

export default function PCard(props){

    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const [alignment2, setAlignment2] = React.useState('email');

    const handleChange2 = (event, newAlignment2) => {
        setAlignment2(newAlignment2);
    };

    const deleteFeature = () => {
        delete props.list[props.name]
        props.addCard(Object.assign({},props.list)) 
        // alert("Feature Deleted")
    }

    return(
        <div style={{border:"1px solid #e8e8e8",boxShadow:"5px 5px 5px whitesmoke",padding:"0px 15px 15px 15px",marginTop:"15px",display:"flex",flexDirection:'column'}}>
            <div style={{display:"flex",justifyContent:"space-between", padding:"15px 0"}}>
                <Typography variant="h5" sx={{ textTransform: 'capitalize'}}>
                    {JSON.parse(process.env.REACT_APP_FEATURE_JSON)[props.name]['name']}
                </Typography>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    {/* {props.fixed ? <AddCameraModal list={props.list} addCard = {props.addCard} data = {props.properties} name = {props.name} text = "Edit"/> : null} */}
                    {props.fixed ? <Button color="primary" onClick={deleteFeature}><DeleteIcon style={{cursor:"pointer"}}/></Button> : null}
                </div>
            </div>
            <Divider/>

            <Box container sx={{alignItems:"top",display:"flex",flexDirection:'column',justifyContent:"space-between", height:"100%"}}>
                <div>
                    {JSON.parse(process.env.REACT_APP_FEATURE_JSON)[props.name]['json'].map((key,index) => 
                        (key['display'] ? <><p><span style={{fontWeight:"500", textTransform: 'capitalize'}}>{key['type']['name']}</span> : <span style={{fontWeight:"300",overflowWrap:'anywhere'}}>{(props.properties[key['id']]).toString()}</span></p></>
                        :null)
                    )}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    {props.fixed ? <AddCameraModal rtsp_details={props.rtsp} list={props.list} addCard = {props.addCard} data = {props.properties} name = {props.name} text = "Edit" bodyimg={props.bodyimg} featureData={props.featureData}/> : null}
                    {/* {props.fixed ? <Button color="primary" onClick={deleteFeature}><DeleteIcon style={{cursor:"pointer"}}/></Button> : null} */}
                </div>
            </Box>
        </div>
    )
}