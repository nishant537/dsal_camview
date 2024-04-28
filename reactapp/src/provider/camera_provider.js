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
          { id: 1, name: '1350_ABC_01', sub_location: "CLASSROOM", features: {"ZI":{"start_time":"09:00","end_time":"12:00"},"CD":{"start_time":"19:00","end_time":"23:00"},"INV":{"start_time":"06:00","end_time":"10:00"}}, status:{"unmarked":2,"marked":1,"approved":1,"rejected":1}, }
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
          { id: 1, name: '1350_ABC_01', sub_location: "CLASSROOM", features: {"ZI":{"start_time":"09:00","end_time":"12:00"},"CD":{"start_time":"19:00","end_time":"23:00"},"INV":{"start_time":"06:00","end_time":"10:00"}}, status:{"unmarked":2,"marked":1,"approved":1,"rejected":1}, }
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
          { id: 1, name: '1350_ABC_01', sub_location: "CLASSROOM", features: {"ZI":{"start_time":"09:00","end_time":"12:00"},"CD":{"start_time":"19:00","end_time":"23:00"},"INV":{"start_time":"06:00","end_time":"10:00"}}, status:{"unmarked":2,"marked":1,"approved":1,"rejected":1}, }
        ];
      } catch (error) {
        alert(error.message)
    }
}