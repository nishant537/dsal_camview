import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/alert/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        
        const returned_response = [];
        // data.map((value,index)=>{
        //   const temp={ id: value.id, name: value.name, code: value.code, address:value.address, username: value.username, password: value.password, instances: value.exams.length!=0 ? value.exams[0].instances.length : 0, active_exam:value.exams.length!=0 ? value.exams[0].instances.length : 0, completed_exam: value.exams.length!=0 ? value.exams[0].instances.length : 0 };
        //   returned_response.push(temp)
        // })
        return data;
      } catch (error) {
        alert(error.message)
    }
}

export const get_group = async(urlParams) => {
  try {
      const response = await fetch(`http://localhost:8000/alert/group?${urlParams}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      
      const returned_response = [];
      // data.map((value,index)=>{
      //   const temp={ id: value.id, name: value.name, code: value.code, address:value.address, username: value.username, password: value.password, instances: value.exams.length!=0 ? value.exams[0].instances.length : 0, active_exam:value.exams.length!=0 ? value.exams[0].instances.length : 0, completed_exam: value.exams.length!=0 ? value.exams[0].instances.length : 0 };
      //   returned_response.push(temp)
      // })
      return data;
    } catch (error) {
      alert(error.message)
  }
}

export const get_summary = async(urlParams) => {
  try {
      const response = await fetch(`http://localhost:8000/alert/summary?${urlParams}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      
      const returned_response = [];
      // data.map((value,index)=>{
      //   const temp={ id: value.id, name: value.name, code: value.code, address:value.address, username: value.username, password: value.password, instances: value.exams.length!=0 ? value.exams[0].instances.length : 0, active_exam:value.exams.length!=0 ? value.exams[0].instances.length : 0, completed_exam: value.exams.length!=0 ? value.exams[0].instances.length : 0 };
      //   returned_response.push(temp)
      // })
      return data;
    } catch (error) {
      alert(error.message)
  }
}


export const post = async(payload) => {
    console.log(payload)
    try {
        const response = await fetch(`http://localhost:8000/alert/`,{method : "POST", body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [{ id: 1, name: 'NTA', code: 'Jon', address:"Lorem Ipsum", username: "nta_user", password: "nishant", instances: 8, active_exam:1, completed_exam: 3 }]
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://localhost:8000/alert/`,{method : "POST", body: JSON.stringify({"id": row_id})});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return [{ id: 1, name: 'NTA', code: 'Jon', address:"Lorem Ipsum", username: "nta_user", password: "nishant", instances: 8, active_exam:1, completed_exam: 3 }]
      } catch (error) {
        alert(error.message)
    }
}