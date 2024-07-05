import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, Divider } from '@mui/material';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import { json } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute',
  textAlign:"center",
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth:"400px",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  maxHeight:"80%",
};  

const Loader = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  React.useImperativeHandle(ref, () => ({
    openLoader() {
      setOpen(true);
    },
    closeLoader() {
      setOpen(false);
    }
  }));


  return (
    <div>
      <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography variant="h1" pb={3}>
                Loading
            </Typography>
            <CircularProgress/>
        </Box>
      </Modal>
    </div>
  );
})
export default Loader;

