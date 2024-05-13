import { Box, Typography } from "@mui/material";
import React from "react";
import {Grid} from "@mui/material";
import {Divider} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCameraModal from "./AddCameraModal"
import Button from "@mui/material/Button";
import {del} from '../provider/feature_provider';

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
        del(props.id).then((value)=>{
            // need to refresh for state change as pageData state is directly affected for it to auto refresh
            window.location.reload()
        })
    }

    console.log(props.properties)

    return(
        <div style={{maxWidth:"350px",border:"1px solid #e8e8e8",boxShadow:"5px 5px 5px whitesmoke",padding:"0px 15px 15px 15px",marginTop:"15px",display:"flex",flexDirection:'column'}}>
            <div style={{display:"flex",justifyContent:"space-between", padding:"15px 0"}}>
                <Typography variant="h5" sx={{ textTransform: 'capitalize'}}>
                    {props.name}
                </Typography>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    {/* {props.fixed ? <AddCameraModal list={props.list} addCard = {props.addCard} data = {props.properties} name = {props.name} text = "Edit"/> : null} */}
                    {props.fixed ? <Button color="primary" onClick={deleteFeature}><DeleteIcon style={{cursor:"pointer"}}/></Button> : null}
                </div>
            </div>
            <Divider/>

            <Box container sx={{alignItems:"top",display:"flex",flexDirection:'column',justifyContent:"space-between", height:"100%"}}>
                <div>
                    {Object.entries(props.properties).map(([key,value]) => 
                        <>
                            <p><span style={{fontWeight:"500", textTransform: 'capitalize'}}>{key}</span> : <span style={{fontWeight:"300",overflowWrap:'anywhere'}}>{JSON.stringify(value)}</span></p>
                        </>
                    )}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    {/* edit feature to be enabled */}
                    {/* {props.fixed ? <AddCameraModal rtsp_details={props.rtsp} list={props.list} addCard = {props.addCard} data = {props.properties} name = {props.name} text = "Edit" bodyimg={props.bodyimg} featureData={props.featureData}/> : null} */}
                </div>
            </Box>
        </div>
    )
}