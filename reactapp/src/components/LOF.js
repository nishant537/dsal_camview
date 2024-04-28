import React from 'react';
import Box from '@mui/material/Box';
import {Button, Modal, Typography} from '@mui/material';
import ImageMarker, { Marker } from "react-image-marker";
import ReactLassoSelect, { getCanvas } from "react-lasso-select";

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
export default function LOF(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [Rx, setRx] = React.useState(1);
    const [Ry, setRy] = React.useState(1);

    // for placing markers
    const [loading,setLoading] = React.useState(false);
    const [points, setPoints] = React.useState(props.points_data);
    const [clippedImg, setClippedImg] = React.useState('');  


    const saveLOF = async() => {
        const temp = {}
        for (let i=0; i < points.length; i++){
            temp['line_'+String(i)] = [parseInt(points[i]['x']),parseInt(points[i]['y'])]
        }
        const new_temp = {}
        new_temp["start_point"] = temp["line_0"]
        new_temp["end_point"] = temp["line_1"]
        props.update_data(Object.assign({},props.current_data,new_temp))
        handleClose()
    }

    const updatePoints = async(points) =>{
        const temp = []
        for (let i=0; i < points.length; i++){
            temp.push({"x":parseInt(points[i]['x']),"y":parseInt(points[i]['y'])})
        }
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
                    <Typography variant='h4'>Set EntryExit Point</Typography>
                    <p style={{fontWeight:"bold"}}>NOTE:-</p>
                    <ul>
                        <li>Select 2 points to mark a line for entry-exit.</li>
                        <li>To reset the line of entryexit : Mark the third point and create a triangle out of the 3 points. Click outside the marked region to reset the points and mark them again</li>
                    </ul>
                    <Box component="form" autoComplete="off">
                        <ReactLassoSelect
                            value={points}
                            src={props.bodyimg}
                            onChange={(path) => {
                                setPoints(path);
                            }}
                            onImageLoad={(event) => {updatePoints(props.points_data)}}
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
                        {/* <div>
                            <img src={clippedImg} alt="" />
                        </div> */}
                    </Box>
                    <Button onClick={saveLOF} variant="outlined" color='primary'>Save EntryExit Point</Button>
                </Box>
            </Modal>
            <Button sx={{paddingBottom:"10px"}} onClick={handleOpen} variant="outlined" color='primary'>Edit EntryExit Point</Button>
            {/* {points[0]!=undefined ? <><p>Current selected points : {JSON.stringify(points)}</p></>: null} */}
        </div>
    );

}
