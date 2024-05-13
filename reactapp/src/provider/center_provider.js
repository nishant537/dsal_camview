import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/center/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        // return data
        const returned_response = [];
        data.map((value,index)=>{
          // const active = 0;
          // value['exams'].map((value,index)=>{
          //   value['shifts'].map((value,index)=>{

          //   })
          // })
          const temp={ id: value.id, code: value.code, name: value.name, location:value.location, cameras: value.cameras.length, shift: value.shift.code, rois:value.cameras[0].features.length, marked: 1, approved: 0 };
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
        const response = await fetch(`http://localhost:8000/center/`,{method : "POST", body: JSON.stringify(payload)});
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
        const response = await fetch(`http://localhost:8000/center/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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