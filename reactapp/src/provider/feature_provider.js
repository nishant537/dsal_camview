import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/?${urlParams}`,{method : "GET"});
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
          const temp={ id: value.id, name: value.name, code: value.code, address:value.address, username: value.username, password: value.password, instances: value.exams.length!=0 ? value.exams[0].instances.length : 0, active_exam:value.exams.length!=0 ? value.exams[0].instances.length : 0, completed_exam: value.exams.length!=0 ? value.exams[0].instances.length : 0 };
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
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/feature/`,{method : "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data
      } catch (error) {
        alert(error.message)
    }
}


export const put = async(id, feature_data) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/feature/${id}`,{method : "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(feature_data)});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data
    } catch (error) {
      alert(error.message)
  }
}

export const del = async(id) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/feature/${id}`,{method : "DELETE"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data
      } catch (error) {
        alert(error.message)
    }
}