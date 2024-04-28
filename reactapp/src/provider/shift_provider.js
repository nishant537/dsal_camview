import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/shift/?${urlParams}`,{method : "GET"});
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


export const post = async(payload) => {
    console.log(payload)
    try {
        const response = await fetch(`http://localhost:8000/shift/`,{method : "POST", body: JSON.stringify(payload)});
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

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://localhost:8000/shift/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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