import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/letters`
});

const Letter = {
    crud: {
        getAllLetters: async (queryParams) => {
            return await http.get(`/pageable?${queryParams.toString()}`).then(r => r.data)
        },
        getAllBySenderId: async (senderId, queryParams) => {
            return await http.get(`/pageable?companyId=${senderId}&${queryParams.toString()}`).then(r => r.data)
        },
        getLetterById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        createLetter: async (data) => {
            return await http.post("/", data);
        },
        updateLetter: async (id, data) => {
            return await http.put(`/${id}`, data)
        },
        updateLetterState: async (letterId, letterState) => {
            return await http.put(`/${letterId}/update-state/${(letterState === 'DRAFT' ? 'DELIVERED' : 'DRAFT')}`)
        },
        removeLetter: async (id) => {
            return await http.delete(`/${id}`);
        },
    },
};

export default Letter;
