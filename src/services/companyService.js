import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/companies`
});

const Company = {
    crud: {
        getAllCompanies: async (queryParams) => {
            return await http.get(`/?${queryParams.toString()}`).then(r => r.data)
        },
        getCompanyById: async (id) => {
            return await http.get(`/${id}`);
        },
        getCompanySelect: async (queryParam) => {
            return await http.get(`/select?queryParam=${queryParam ? queryParam : ''}`);
        },
        createCompany: async (data) => {
            return await http.post("/", data);
        },
        updateCompany: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removeCompany: async (id) => {
            return await http.delete(`/${id}`);
        },
        search: async (searchQuery) => {
            return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
        },
    },
};

export default Company;
