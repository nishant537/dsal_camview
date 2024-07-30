import React from 'react';
import Box from '@mui/material/Box';
import {Button, Modal, Typography} from '@mui/material';
import ImageMarker, { Marker } from "react-image-marker";
import ReactLassoSelect, { getCanvas } from "react-lasso-select";
import {post, put} from '../provider/roi_provider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: "auto",
  bgcolor: 'background.paper',
  p: 4,
};
// Modal for setting roi on camera
export default function ROI(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [Rx, setRx] = React.useState(1);
    const [Ry, setRy] = React.useState(1);

    // for placing markers
    const [loading,setLoading] = React.useState(false);
    const [clippedImg, setClippedImg] = React.useState('');  
    const [points, setPoints] = React.useState(()=>{
        if (props.points_data!=null){
            const temp_points = [];
            (Object.keys(props.points_data).filter(k => k.startsWith('point'))).forEach(key => {
              temp_points.push({'x':props.points_data[key][0],'y':props.points_data[key][1]})
            })
            temp_points['name'] = props.name
            return temp_points;
        }else{
            return [];
        }
      });

      
    const saveROI = async() => {
        const temp = {}
        // for (var key in props.points_data) if (key.startsWith("point_")) delete props.current_data[key];
        for (let i=0; i < points.length; i++){
            temp['point_'+String(i)] = [parseInt(parseInt(points[i]['x'])),parseInt(parseInt(points[i]['y']))]
        }
        temp["perimeter"] = points.length
        temp['name'] = props.name

        console.log(props)

        if (props.points_data){
            post(props.feature_id, "ROI_01", JSON.stringify(temp)).then((value)=>{
                console.log(value)
            })
        }else{
            post(props.feature_id, "ROI_01", JSON.stringify(temp)).then((value)=>{
                console.log(value)
            })
        }
        

        // handleClose()
    }

    const updatePoints = async(points) =>{
        const temp = []
        for (let i=0; i < points.length; i++){
            temp.push({"x":parseInt(points[i]['x']),"y":parseInt(points[i]['y'])})
        }
        temp['name'] = props.name
        setPoints(temp)
    }
    

    return (
        <div style={{"padding":"5px 0"}}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant='h4'>Set ROI - {props.name}</Typography>
                    <p style={{fontWeight:"bold"}}>NOTE:-</p>
                    <ul>
                        <li>Select points in clockwise direction to mark region of interest for the camera</li>
                        <li>Click outside the marked region to reset the points and mark them again</li>
                    </ul>
                    <Box component="form" autoComplete="off">
                        <>
                            <ReactLassoSelect
                                value={points}
                                src={props.bodyimg!=null ? props.bodyimg : null}
                                onChange={(path) => {
                                    setPoints(path);
                                }}
                                onImageLoad={(event) => {setRy(event.target.naturalHeight/event.target.height);setRx(event.target.naturalWidth/event.target.width);updatePoints(points)}}
                                onComplete={(path) => {
                                if (!path.length) return;
                                getCanvas(props.bodyimg, path, (err, canvas) => {
                                    if (!err) {
                                    setClippedImg(canvas.toDataURL());
                                    }
                                });
                                }}
                                imageStyle={{maxWidth:"800px", height:"auto"}}
                                viewBox={{width:200,height:200}}
                            />
                        </>
                    </Box>
                    <Button onClick={saveROI} variant="outlined" color='primary' sx={{mr:2}}>Save ROI</Button>
                    <Button onClick={props.refreshFrame} variant="outlined" color='primary'>Refresh ROI</Button>
                </Box>
            </Modal>
            <Button sx={{paddingBottom:"10px"}} onClick={handleOpen} variant="outlined" color='primary'>Edit ROI</Button>
            {/* {points[0]!=undefined ? <><p>Current selected points : {JSON.stringify(points)}</p></>: null} */}
        </div>
    );

}
