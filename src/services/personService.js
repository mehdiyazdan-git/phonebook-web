import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/persons`
});

const Person = {
    crud: {
        getAllPersons: async (queryParams) => {
            return await http.get(`/?${queryParams.toString()}`).then(r => r.data);
        },
        getAllByRecipientId: async (recipientId) => {
            return await http.get(`all-by-recipient-id/${recipientId}`).then(response => response.data);
        },
        getPersonById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        createPerson: async (data) => {
            return await http.post("/", data);
        },
        updatePerson: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removePerson: async (id) => {
            return await http.delete(`/${id}`);
        },
        getPersonSelect: async () => {
            return await http.get(`/select`).then(r => r.data);
        },
        searchPersons: async (searchQuery) => {
            return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
        },
    },
};

export default Person;
