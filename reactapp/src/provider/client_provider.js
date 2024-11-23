import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          // intercepter to throw errors
          // timeout (api is down, refetch)
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log(data)

        const returned_response = [];
        data.map((value,index)=>{
          let active = 0;
          let complete = 0;
          let instance = 0;
          value['exams'].map((exam,index)=>{
            let flag = false
            exam['shifts'].map((shift,index)=>{
                if ((new Date(`${shift['date']} ${shift['start_time']}`)  < new Date()) && (new Date() < new Date(`${shift['date']} ${shift['end_time']}`))){
                  active+=1
                  flag = true
                }
            })
            if (!(flag)){complete+=1}
            instance+=exam.instances.length
          })
          const temp={ id: value.id, name: value.name, code: value.code, address:value.address, username: value.username, password: value.password, instances: instance, active_exam: active , completed_exam: complete };
          returned_response.push(temp)
        })
        return returned_response;
      } catch (error) {
        alert(error.message)
    }
}


export const post = async(payload) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/`,{method : "POST",headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        console.log(JSON.stringify(response))
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

export const put = async(id, payload) => {
  console.log(payload)
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/${id}`,{method : "PUT",headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
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
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/${row_id}`,{method : "DELETE"});
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