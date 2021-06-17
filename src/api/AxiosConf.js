import Env from '../conf/env';
import axios from 'axios'


axios.defaults.withCredentials = false;

axios.defaults.timeout = 10000;

axios.interceptors.request.use(config => {
  let token = window.localStorage.getItem("token")
  config.headers.token = token
  return config;
}, err => {
  console.error(err);
  return Promise.reject(err);
});

axios.interceptors.response.use(function (response) {
  if (response.data && response.data.errcode) {
    if (parseInt(response.data.errcode) === 401) {
      //nologin
      window.location.hash = "#/login"
    }
  }
  return response;
}, function (error) {
  if (axios.isCancel()) {
    return Promise.reject(error);
  } else {
    if (error.response) {
      console.log(error.response.status === 401)
      if (error.response.status === 401) {
        if (!window.localStorage.getItem("token") || !window.localStorage.getItem("tokenExpired") || window.localStorage.getItem("tokenExpired") === "false") { 
          window.localStorage.setItem("tokenExpired", "true");
          window.location.hash = "#/login"
        }
      } else if (error.response.status === 500) {
        alert("server exception !")
      }
    } else if (error && String(error).toLowerCase().substring(0, 14) === "error: timeout") {
      alert("server timeout !")
    }else{
      alert("server error !")
    }
    return Promise.reject(error);
  }
});

let serverURL = Env.serverURL;

export const POST = (url, params) => {
  return axios.post(`${serverURL}${url}`, params).then(res => res.data)
}
export const GET = (url, params) => {
  return axios.get(`${serverURL}${url}`, {
    params: params
  }).then(res => res.data)
}

export const PUT = (url, params) => {
  return axios.put(`${serverURL}${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(`${serverURL}${url}`, {
    params: params
  }).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(`${serverURL}${url}`, params).then(res => res.data)
}
