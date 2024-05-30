import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/ticket/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          // intercepter to throw errors
          // timeout (api is down, refetch)
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log(data)
        return data;
      } catch (error) {
        alert(error.message)
    }
}

export const get_group = async(urlParams) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/ticket/group?${urlParams}`,{method : "GET"});
      if (!response.ok) {
        // intercepter to throw errors
        // timeout (api is down, refetch)
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      console.log(data)
      const returned_response = [];
      data.map((value,index)=>{
        const temp={ id: value.id, status: value.activity[0].status, center: value.alert.center,camera: value.camera, feature:value.feature, sublocation: value.alert.sublocation, created_at: value.activity[value.activity.length-1].last_updated, last_updated: value.activity[0].last_updated};
        returned_response.push(temp)
      })
      return returned_response;
    } catch (error) {
      alert(error.message)
  }
}

export const get_stats = async(urlParams) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/ticket/stats?${urlParams}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      

      const temp = data.reduce((acc, item) => {
        acc[item.center] = acc[item.center] || { id: item.id, center: item.center, total: { new: 0, open: 0, resolved: 0 } };
        const key = `${item.feature}_${item.sublocation}`;
        acc[item.center][key] = acc[item.center][key] || { new: 0, open: 0, resolved: 0 };
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

// not in use now, can delete
// export const get_ticket = async(id) => {
//     try {
//         const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/ticket/${id}`,{method : "GET"});
//         if (!response.ok) {
//           // intercepter to throw errors
//           // timeout (api is down, refetch)
//           throw new Error('Network response was not ok.');
//         }
//         const data = await response.json();
//         return data;
//       } catch (error) {
//         alert(error.message)
//     }
// }

export const post_activity = async(payload) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/ticket_activity/`,{method : "POST", headers: {'Content-Type': 'application/json'},body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/client/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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