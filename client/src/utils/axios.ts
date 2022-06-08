import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.REACT_APP_API || "http://0.0.0.0:8080/api"
})