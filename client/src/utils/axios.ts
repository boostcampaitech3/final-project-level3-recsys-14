import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.REACT_APP_API//process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "http://3.36.32.133:3000/api"
})

//process.env.REACT_APP_API