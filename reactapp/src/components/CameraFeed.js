import { Button, Modal } from '@mui/material';
import React from 'react'

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

export default function CFeed(props){

    // for modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [status,setStatus] = React.useState(false);

    const handleStatus = (event, newStatus) => {
        setStatus(!status);
    }

    const [img, setImg] = React.useState('/noimage.jpeg')

    React.useEffect(() => {
        const interval = setInterval(() => {
            get_frame()
        }, process.env.REACT_APP_FEED_FRAME);
        
        return () => clearInterval(interval);
    }, []);

    const get_frame = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_frame`,{method : "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({"name":"id","value":props.id})});
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImg(imageObjectURL);
    }

    return(
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <img style={style} src={img}></img>
            </Modal>
            <div style={{display:"flex"}}>
                <Button variant="contained" color='secondary' onClick={handleStatus} sx={{mb:2,mr:2}}>{status ? 'Hide Feed': "Show Feed"}</Button>
            </div>
            {
                status ? (
                    <div>
                        <img src={img} style={{width:"100%",height:"auto"}} onClick={handleOpen}></img>
                    </div>
                ) : (
                    <p>No video available</p>
                )
            }
            
        </>
    )

}