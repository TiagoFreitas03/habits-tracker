import axios from "axios"

import { SERVER_URL } from "../env"

export const api = axios.create({
	baseURL: SERVER_URL
})
