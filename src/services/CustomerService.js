import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/customers`
});

const Recipient = {
    crud: {
        getAllCustomers: async (queryParams) => {
            return await http.get(`/?${queryParams.toString()}`).then(r => r.data);
        },
        getCustomerById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        getCustomerSelect: async () => {
            return await http.get(`/select`);
        },
        createCustomer: async (data) => {
            return await http.post("/", data);
        },
        updateCustomer: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removeCustomer: async (id) => {
            return await http.delete(`/${id}`);
        },
        search: async (searchQuery) => {
            return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
        },
    },
};

export default Recipient;
