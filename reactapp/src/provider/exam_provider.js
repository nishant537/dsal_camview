import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/exam/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, client_name: 'NTA', name: 'JEE MAINS', code: "NTAJEE24", date_range: "17 March - 19 March",total_shifts:8, total_centers: 100, total_instances: 4},
          { id: 2, client_name: 'OBESE', name: 'BOARDS', code: "OBESE24", date_range: "17 March - 19 March",total_shifts:2, total_centers: 110, total_instances: 4},
        ];
      } catch (error) {
        alert(error.message)
    }
}


export const post = async(payload) => {
    console.log(payload)
    try {
        const response = await fetch(`http://localhost:8000/exam/`,{method : "POST", body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, client_name: 'NTA', name: 'JEE MAINS', code: "NTAJEE24", date_range: "17 March - 19 March",total_shifts:8, total_centers: 100, total_instances: 4},
          { id: 2, client_name: 'OBESE', name: 'BOARDS', code: "OBESE24", date_range: "17 March - 19 March",total_shifts:2, total_centers: 110, total_instances: 4},
        ];
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://localhost:8000/exam/`,{method : "POST", body: JSON.stringify({"id": row_id})});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, client_name: 'NTA', name: 'JEE MAINS', code: "NTAJEE24", date_range: "17 March - 19 March",total_shifts:8, total_centers: 100, total_instances: 4},
          { id: 2, client_name: 'OBESE', name: 'BOARDS', code: "OBESE24", date_range: "17 March - 19 March",total_shifts:2, total_centers: 110, total_instances: 4},
        ];
      } catch (error) {
        alert(error.message)
    }
}