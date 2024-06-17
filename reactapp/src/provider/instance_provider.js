import * as React from 'react';

export const post = async(payload) => {
    try {
        const response = await fetch(`http://${window.location.hostname}:${process.env.REACT_APP_PORT}/instance/`,{method : "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        // return data
        return data;
      } catch (error) {
        alert(error.message)
    }
}
