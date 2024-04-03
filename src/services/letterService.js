import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/letters`,
});

// Function for making GET requests with query params
const getWithParams = async (url, params) => {
    return await http.get(`${url}?${params.toString()}`).then((r) => r.data);
};

// Function for making PUT requests with ID
const putWithId = async (id, data) => {
    return await http.put(`/${id}`, data);
};

// Functions for Letter CRUD operations
export const getAllLetters = async (queryParams) => {
    return await getWithParams("/pageable", queryParams);
};

export const getAllBySenderId = async (senderId, queryParams) => {
    return await getWithParams("/pageable", `companyId=${senderId}&${queryParams.toString()}`);
};

export const getLetterById = async (id) => {
    return await http.get(`/${id}`).then((response) => response.data);
};

export const createLetter = async (data) => {
    return await http.post("/", data);
};

export const updateLetter = async (id, data) => {
    return await putWithId(id, data);
};

export const updateLetterState = async (letterId, letterState) => {
    return await putWithId(letterId, `/update-state/${letterState === "DRAFT" ? "DELIVERED" : "DRAFT"}`);
};

export const removeLetter = async (id) => {
    return await http.delete(`/${id}`);
};

