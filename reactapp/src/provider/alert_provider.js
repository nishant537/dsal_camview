import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert/?${urlParams}`,{method : "GET"});
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
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert/group?${urlParams}`,{method : "GET"});
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

export const get_stats = async(urlParams) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert/stats?${urlParams}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      

      const temp = data.reduce((acc, item) => {
        acc[item.center] = acc[item.center] || { id: item.id, center: item.center, total: { true: 0, false: 0, null: 0 } };
        const key = `${item.feature}_${item.sublocation}`;
        acc[item.center][key] = acc[item.center][key] || { true: 0, false: 0, null: 0 };
        const status = item.status || 'null';
        acc[item.center][key][status] += 1;
        acc[item.center].total[status] += 1;
        return acc;
      }, {});

      return Object.values(temp);
    } catch (error) {
      alert(error.message)
  }
}

export const get_activity = async(urlParams) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert_activity`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      
      return data;
    } catch (error) {
      alert(error.message)
  }
}

export const get_summary = async(urlParams) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert/summary?${urlParams}`,{method : "GET"});
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


export const post = async(alert_id,status) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert_activity`,{method : "POST",headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({"alert_id":alert_id,"status":status})});
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
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/alert/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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