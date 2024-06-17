import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/shift/?${urlParams}`,{method : "GET"});
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
          const temp={ id: value.id, code: value.code, exam_name:value.exam.name, date: value.date, start_time: value.start_time, end_time: value.end_time, centers:value.centers.length, cameras: value.centers!=0 ? value.centers[0].cameras.length : 0 };
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
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/shift/`,{method : "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        // return data
        return data;
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/shift/`,{method : "POST", body: JSON.stringify({"id": row_id})});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, code: 'BSC1951', exam_name: 'BPSC', date: "17-05-2024", start_time: "09:00 AM", end_time: "12:00 PM", centers:140, cameras: 1400},
        ];
      } catch (error) {
        alert(error.message)
    }
}