import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://localhost:8000/client/?${urlParams}`,{method : "GET"});
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
        const response = await fetch(`http://localhost:8000/client/`,{method : "POST", body: JSON.stringify(payload)});
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
        const response = await fetch(`http://localhost:8000/client/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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