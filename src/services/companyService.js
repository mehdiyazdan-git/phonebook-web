import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/companies`
});

export const getAllCompanies = async (queryParams) => {
    return await http.get(`/?${queryParams.toString()}`).then(r => r.data);
};

export const getCompanyById = async (id) => {
    return await http.get(`/${id}`);
};

export const getCompanySelect = async (queryParam) => {
    return await http.get(`/select?queryParam=${queryParam ? queryParam : ''}`);
};

export const createCompany = async (data) => {
    return await http.post("/", data);
};

export const updateCompany = async (id, data) => {
    return await http.put(`/${id}`, data);
};

export const removeCompany = async (id) => {
    return await http.delete(`/${id}`);
};

export const searchCompany = async (searchQuery) => {
    return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
};

