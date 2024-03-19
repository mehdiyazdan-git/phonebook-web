import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/years`
});

const YearService = {
    crud: {
        getAllYears: async () => {
            return await http.get("/")
        },
        getYearById: async (id) => {
            return await http.get(`/${id}`);
        },
        createYear: async (data) => {
            return await http.post("/", data);
        },
        updateYear: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removeYear: async (id) => {
            return await http.delete(`/${id}`);
        },
    },
};

export default YearService;
