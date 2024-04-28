import React from 'react'
import { ListItemButton,ListItemIcon,ListItemText } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article';
import CameraIndoorIcon from '@mui/icons-material/CameraIndoor';
import { useState } from 'react';

// middleware component for fetching group menus (camera name, templates) to show in navigation menu
export default function LItems(props){

    const [cameraData, setCameraData] = useState([]);
    const [templateData, setTemplateData] = useState([]);
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        fetchCameraData()
        fetchTemplateData()
    },[])

    const fetchCameraData = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/dashboard?page=0&site_access=${Object.values(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',')}`,{method : "GET"});
        const received_data = (await response.json())['data']
        Object.entries((received_data['data'])).map(([key,value]) => {
            cameraData.push([value[0],value[1]['camera_name']])
        })
        setCameraData(cameraData)
        setLoading(!loading)
    }

    const fetchTemplateData = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/get_template`,{method : "GET"});
        setTemplateData(await response.json())
        // setLoading(!loading)
    }

    let CfilterList;
    if (!loading){
        CfilterList = []
        cameraData.map((e,i)=>{
            if (e[1].toLowerCase().indexOf(props.filter.toLowerCase()) > -1){
                CfilterList.push(e)
            }
        })
    }else{
        CfilterList = []
    }

    let TfilterList;
    if (!loading){
        TfilterList = []
        templateData.map((e,i)=>{
            if (e[1].toLowerCase().indexOf(props.filter.toLowerCase()) > -1){
                TfilterList.push(e)
            }
        })
    }else{
        TfilterList = []
    }



    if (props.type==='Provisioning'){
        return(
            <>
                {CfilterList.map((item,i) => 
                    // No Separate Component needed for this, as this ain't too big.
                    <a href={"/provisioning/" + item[0]} style={{color:"black",textDecoration:"none"}}>
                        <ListItemButton id={item[0]} onClick={props.onclick}>
                            <ListItemIcon>
                            <CameraIndoorIcon />
                            </ListItemIcon>
                            <ListItemText primary={item[1]} />
                        </ListItemButton>
                    </a>
                )}
            </>
        )
    }else{
        return(
            <>
                {TfilterList.map((item,i) => 
                    <a href={"/add_camera/" + item[0]} style={{color:"black",textDecoration:"none"}}>
                        <ListItemButton id={item[0]} onClick={props.onclick}>
                            <ListItemIcon>
                            <ArticleIcon />
                            </ListItemIcon>
                            <ListItemText primary={item[1]} />
                        </ListItemButton>
                    </a>
                )}
            </>
        )
    }
    
}