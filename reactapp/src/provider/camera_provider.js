import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/camera/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        const returned_response = [];
        data.map((value,index)=>{
          // const active = 0;
          // value['exams'].map((value,index)=>{
          //   value['shifts'].map((value,index)=>{

          //   })
          // })
          const temp={ id: value.id, name: value.name, sublocation: value.sublocation, features:value.features, status:{"unmarked":2,"marked":1,"approved":1,"rejected":1}};
          returned_response.push(temp)
        })
        return returned_response;
      } catch (error) {
        alert(error.message)
    }
}

export const get_camera = async(id) => {
  try {
      const response = await fetch(`http://localhost:8000/camera/?id__eq=${id}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      alert(error.message)
  }
}

const fetchFrame = async() => {
  const response = await fetch(`http://localhost:8000/get_frame`,{method : "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({})});
  const imageBlob = await response.blob();
  const imageObjectURL = URL.createObjectURL(imageBlob);
  // if (rtsp!={} && (rtsp['rtsp']!="" || rtsp['dss_id']!="" || rtsp['dss_channel']!="")){
  //     setBodyImg(imageObjectURL)
  // }
}


const deleteCamera = async() => {
  const response = await fetch(`http://http://localhost:8000/delete_camera/${window.location.pathname.split("/")[2]}`, {
      method:"POST",
      headers: {'Content-Type':'application/json'}
  })
  const returned_response = await response.json()
  if (returned_response.status_code!=200 && returned_response.status_code!=201 ){
      alert(returned_response.message)
  }else{
      window.location.href = "/"
  }
}


export const post = async(payload) => {
    console.log(payload)
    try {
        const response = await fetch(`http://localhost:8000/camera/`,{method : "POST", body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [
          { id: 1, name: '1350_ABC_01', sublocation: "CLASSROOM", features: {"ZI":{"start_time":"09:00","end_time":"12:00"},"CD":{"start_time":"19:00","end_time":"23:00"},"INV":{"start_time":"06:00","end_time":"10:00"}}, status:{"unmarked":2,"marked":1,"approved":1,"rejected":1}, }
        ];
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://localhost:8000/camera/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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