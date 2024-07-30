import * as React from 'react';

export const get = async(urlParams) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/roi/?${urlParams}`,{method : "GET"});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        alert(error.message)
    }
}

export const get_one = async(id) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/roi/${id}`,{method : "GET"});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error.message)
  }
}


export const post = async(id,name, json) => {
  console.log(JSON.stringify({feature_id: id, name: name, json: json}))
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/roi/`,{method : "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({feature_id: id, name: name, json: json})});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json()['data'];
        // return data
        return data
      } catch (error) {
        alert(error.message)
    }
}

export const del = async(row_id) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/roi/`,{method : "POST", body: JSON.stringify({"id": row_id})});
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

export const put = async(id, roi_data) => {
  try {
      const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/roi/${id}`,{method : "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(roi_data)});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      // return data
      return [{ id: 1, name: 'NTA', code: 'Jon', address:"Lorem Ipsum", username: "nta_user", password: "nishant", instances: 8, active_exam:1, completed_exam: 3 }]
    } catch (error) {
      alert(error.message)
  }
}