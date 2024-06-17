// import * as React from 'react';
import React, { useRef } from 'react';

import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Checkbox,FormControl,Button, Modal, Divider,Paper,Select,InputLabel,MenuItem,Stack,RadioGroup,FormControlLabel,Radio,FormLabel,} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarFilterButton,GridToolbarExport,GridToolbarDensitySelector, GridFooterContainer, GridFooter,gridClasses,} from '@mui/x-data-grid';
import {Search, AccessTime, Done, FilterAlt, AddCircleOutline, CloudUpload, RemoveCircleOutline} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import StepProgressBar from "./StepProgressBar"
import { useNavigate } from 'react-router-dom';
import {get as get_client} from '../provider/client_provider';
import {get, post, del} from '../provider/exam_provider';
import {post as post_shift} from '../provider/shift_provider';
import { useForm } from 'react-hook-form'

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectRef = useRef(null);

    const [step,setStep] = React.useState(1)
    
    return(
        <Modal
            open={props.open}
            onClose={() => {props.setOpen(false)}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, textAlign:"center",}}>
                <img src="warning.png" class="custom-logo" alt=""></img>
                <Divider/>

                <Typography id="modal-modal-description" sx={{ p: 2 }}>
                    Are you sure you want to cancel? Any unsaved changes will be lost.
                </Typography>

                <Stack alignItems="center" direction="row" justifyContent={"space-around"}>
                    <Button color="primary" size="small" variant='outlined' sx={{padding:"10px 25px"}} >No</Button>
                    <Button color="primary" size="small" variant='contained' sx={{padding:"10px 25px"}} >Yes</Button>
                </Stack>
            </Box>
        </Modal>
    )

}

export default Main;
