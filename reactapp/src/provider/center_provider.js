import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/center/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log(data)
        // return data
        const returned_response = [];
        data.map((value,index)=>{
          let roi = 0;
          let marked = 0;
          let approved = 0;
          value.cameras.map((camera,index)=>{
            camera.features.map((feature,index)=>{
              if (feature.roi.length>0){
                roi+=1
                if (feature.roi[0]['status']=="marked"){marked+=1}else if(feature.roi[0]['status']=="approved"){approved+=1}
              } 
            })
          })
          const temp={ id: value.id, code: value.code, name: value.name, location:value.location, cameras: value.cameras.length, shift: value.shift.code, rois:roi, marked: marked, approved: approved };
          returned_response.push(temp)
        })
        return returned_response;
      } catch (error) {
        alert(error.message)
    }
}


export const post = async(payload) => {
    console.log(payload)
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/center/`,{method : "POST", body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, code: 'BSC1951', name: 'ABC SCHOOL', location: "Noida, Delhi", cameras: 1400, shift_name: "19S1", total_roi: 26, roi_marked: 26, roi_approved: 21},
        ];
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/center/`,{method : "POST", body: JSON.stringify({"id": row_id})});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, code: 'BSC1951', name: 'ABC SCHOOL', location: "Noida, Delhi", cameras: 1400, shift_name: "19S1", total_roi: 26, roi_marked: 26, roi_approved: 21},
        ];
      } catch (error) {
        alert(error.message)
    }
}