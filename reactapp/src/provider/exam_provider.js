import * as React from 'react';

export const get_exam = async(id) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/exam/${id}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error.message)
  }
}

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/exam/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log(JSON.stringify(data))
        // return data
        const returned_response = [];
        data.map((value,index)=>{
          // const active = 0;
          // value['exams'].map((value,index)=>{
          //   value['shifts'].map((value,index)=>{

          //   })
          // })
          const temp={ id: value.id, client_name: value.client.name, name: value.name, code: value.code, date_range: value.shifts.length > 1 ? `${value.shifts[0].date} ~ ${value.shifts[value.shifts.length - 1].date}` : value.shifts[0].date, total_shifts: value.shifts.length, total_centers: value.shifts.reduce((sum, shift)=> sum + shift.centers.length, 0), total_instances: value.instances.length};
          returned_response.push(temp)
        })
        return returned_response;
      } catch (error) {
        alert(error.message)
    }
}


export const post = async(payload) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/exam/`,{method : "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        // return data
        return data
      } catch (error) {
        alert(error.message)
    }
}

export const upload_center = async(selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/exam/upload_center`,{method : "POST", body: formData});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      // return data
      return data
    } catch (error) {
      alert(error.message)
  }
}

export const upload_camera = async(selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/exam/upload_camera`,{method : "POST", body: formData});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      // return data
      return data
    } catch (error) {
      alert(error.message)
  }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/exam/${row_id}`,{method : "DELETE"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [{ id: 1, center_name: '1350_ABC', location: 'Noida, Delhi', feature_type: 'Zone Intrusion', timestamp: "09:42:00 AM", total_alert:4},]
      } catch (error) {
        alert(error.message)
    }
}