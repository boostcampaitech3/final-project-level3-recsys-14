import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? "http://0.0.0.0:8080/api" : "/api"
})