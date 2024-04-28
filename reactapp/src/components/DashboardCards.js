import React, { PureComponent } from 'react'
import { ReactDOM } from 'react'
import DCard from './DashboardCard'
import { useState } from 'react';
import { Typography, Divider, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { CSVLink } from "react-csv";
import _ from "lodash";

// middleware component for fetching all cam details from DB and displaying list of dashboard cards
export default function DCards(props){

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        names()
    },[])

    const names = async() => {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/dashboard?page=${String(props.page)}&site_access=${Object.values(JSON.parse(window.localStorage.getItem("site_access"))).flat(1).join(',')}`,{method : "GET"});
        const received_data = (await response.json())['data']
        setData(received_data)
        setLoading(!loading)
    }
    
    let filterList, filterdataList;
    if (!loading){
        filterList = []
        filterdataList = []
        data['data'].map((e,i)=>{
            const temp = {}
            temp['camera_name'] = e[1]['camera_name'];temp['rtsp'] = e[1]['rtsp'];temp['features'] = Object.keys(e[1]['features']).filter(key => e[1]['features'][key]==true).map(x => {if (x=="loitering"){return "idle_time"}else if (x=="entryexit"){return "tailgating_vehicle"}else if (x=="intrusion"){return "zone_intrusion"}else if (x=="multiple_person"){return "crowd_detection"}else if (x=="crowd_count"){return "over_manning"}else{return x;}});
            if (e[1].camera_name.toLowerCase().indexOf(props.filter.toLowerCase()) > -1){
                filterList.push(e)
                filterdataList.push(temp)
            }
        })
    }else{
        filterList = []
    }

    const restoreCameras = async() =>{
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/restore_cameras`,{method : "POST"});
        const returned_response = await response.json()
        if (returned_response.status_code!=200 && returned_response.status_code!=201){
            alert(returned_response.message)
        }else{
            window.location.reload()
        }
    }

    return(
        <>
            {loading ? null : filterList.length > 0 ? 
            <>
                <CSVLink data={filterdataList}><Button variant="outlined" sx={{marginTop:"20px",marginRight:"20px"}}>Export Camera List</Button></CSVLink>
                {/* <Button variant="outlined" sx={{marginTop:"20px"}} onClick={restoreCameras}>Restore Deleted Cameras</Button> */}
                {filterList.slice((props.page-1)*5,((props.page-1)*5)+5).map((card) => 
                    <DCard data = {card}/>
                )}
                <div style={{'display':"flex",'justifyContent':"flex-end"}}>
                    <Stack spacing={2} paddingY={2}>
                        <Pagination count={filterList.length%5==0 ? filterList.length/5 : Math.max(Math.floor(filterList.length/5 + 1),1)} page={parseInt(props.page)} size="large" renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                // to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                                // href={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                                // page={page}
                                onClick={() => {props.setPage(item.page)}}
                            />
                        )}/>
                    </Stack>
                </div>
                <Divider/>
            </>
            :<div style={{height:'100%',width:'100%',display:"flex",'alignItems':"center",justifyContent:'center'}}><Typography variant='h6' pt={4}>No Cameras Added Yet</Typography></div>}
        </>
    )
}
