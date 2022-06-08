import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.RECJOON_APP_API || "http://localhost:8080/api"//process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "http://3.36.32.133:3000/api"
})