import axios from "axios";

export const baseURL = 'http://192.168.29.53:5050';

var ServerURL = 'http://192.168.29.53:5050/api';

// import axios from 'axios' //for react native 
// \ var axios = require('axios'); // for react js

const getData = async url => {
  try {
    const response = await fetch(`${ServerURL}/${url}`);
    const result = response.json();
    return result;
  } catch (e) {
    // console.log("error",e);
    return null;
  }
};

const postData = async (url, body) => {
  try {
    const response = await fetch(`${ServerURL}/${url}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log(">>>>>>",e)
    return e;
  }
};

const postFormData = async (url, body) => {
  try {
    const response = await fetch(`${ServerURL}/${url}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json;'},
      body: body,
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log(">>>>>>",e)
    return null;
  }
};

const postDataAndImage = async (url, formData) => {
  // console.log("url",url,"formData",formData);
  var config = {
    headers: {
      "Content-Type": "multipart/form-data",
      // "x-access-token": localStorage.getItem("token"),
    },
  };


    const response = await  axios.post(`${ServerURL}/${url}`, formData, config);
  // console.log("response",response);

    // if (response.status == 401) {
    //   alert("Oops...Session is not Valid..");
    //   window.location.replace("/admin");
    // }
    const result = await response.data;
    return result;
  
};


//api call
const apiCall = async (route, method, data) => {
  // eslint-disable-next-line no-undef
  const url = `${ServerURL}/${route}`;
  let options = {
    method,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: JSON.stringify(data),
  };
  return await fetch(url, options);
};

export {ServerURL, getData,  postData, apiCall, postFormData,postDataAndImage};
