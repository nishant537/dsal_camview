import * as React from 'react';
import { Box, Toolbar, Modal, Typography, CircularProgress, InputAdornment, TextField, IconButton, Button } from '@mui/material';
import FolderTree, { testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
// icon import
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

function Main(props) {
    if (!localStorage.getItem('loggedin')){
        window.location = "/login"
    }

    // modal 
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // for FTP tree
    const [checked, setChecked] = React.useState([]);
    const [pageData, setPageData] = React.useState([]);
    const [tempPageData, setTempPageData] = React.useState([]);
    const [buttonVisibility, setButtonVisibility] = React.useState(false)

    React.useEffect(() => {
        names()
    },[])

    const names = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/ftp_dashboard`,{method : "GET"});
        const page_data = await response.json()
        setPageData(page_data)
        setTempPageData(page_data)
    }

    function downloadFile(path) {
        handleOpen()
        fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/download/` + JSON.stringify(path), {method: "GET"})
           .then(response => {
            return response.blob();
              
           })
           .then(blob => {
              var url = window.URL.createObjectURL(new Blob([blob]));
              var a = document.createElement('a');
              a.href = url;
              a.setAttribute('download',"downloads.zip")
              document.body.appendChild(a); // append the element to the dom
              handleClose()
              a.click();
              a.parentNode.removeChild(a);
           })
           .catch(error => {
              console.error(error);
           });
    }

    const download = () => {
        downloadFile(checked)
    }

    const unselect = () => {
        setTempPageData(Object.assign({},pageData))
    }
    
    const onTreeStateChange = (state, event) => {
        let temp = []
        if ("children" in state){
            state['children'].map(site => {
                site['children'].map(channel=>{
                    channel['children'].map(date=>{
                        date['children'].map(video=>{
                            if (video['checked']==1){
                                temp.push(site['name']+"-"+channel['name']+"-"+date['name']+"-"+video['name'])
                            }
                        })
                    })
                })
            })
            if (temp.length>0){
                setButtonVisibility(true)
            }else{
                setButtonVisibility(false)
            }
            setChecked(temp)
        }
    };


    // nullifying extra buttons
    const EditIcon = (...args) => null;
    const DeleteIcon = (...args) => null;
    const AddFileIcon = (...args) => null;
    const AddFolderIcon = (...args) => null;
    const CancelIcon = (...args) => null;

    // for searchbar
    const [seed, setSeed] = React.useState("");
    const checkSearch = event => {
        setSeed(event.target.value.trim().toUpperCase())
        if (event.target.value.trim().toUpperCase() == ""){
            setTempPageData(pageData)
        }else{
            const temp = {"name":"videos",'isOpen':true,'children':[]}
            pageData['children'].map(site => {
                if (site['name'].indexOf(seed) >= 0){
                    temp['children'].push(site)
                }
            })
            setTempPageData(temp)
        }
    }

    return(
        <>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <CircularProgress />
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Download in progress...
                        </Typography>
                    </Box>
                </Modal>
            </div>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar/>

                <Box container sx={{alignItems:"center",paddingBottom:"30px"}}>
                    <TextField sx={{width: "350px" }} id="outlined-search" label="Search for Site..." type="search" onChange={checkSearch} InputProps={{
                        endAdornment: (
                        <InputAdornment>
                            <IconButton>
                            <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                        )
                    }}/>
                </Box>

                <div style={{display:"flex"}}>
                    <Button variant='outlined' sx={{mr:2,display:(buttonVisibility ? "block" : "none")}} onClick={download}>Download Selected</Button>
                    <Button variant='outlined' sx={{display:(buttonVisibility ? "block" : "none")}} onClick={unselect}>Unselect all</Button>
                </div>
                <FolderTree
                    data={ tempPageData }
                    onChange={ onTreeStateChange }
                    initCheckedStatus='custom'
                    initOpenStatus='custom'
                    iconComponents={{
                        EditIcon,
                        DeleteIcon,
                        AddFileIcon,
                        AddFolderIcon,
                        CancelIcon
                      }}
                />

            </Box>
        </>
    );
}

export default Main;
