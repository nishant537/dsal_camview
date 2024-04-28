import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/center/?${urlParams}`,{method : "GET"});
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