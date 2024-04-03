import axios from "axios";

const http = axios.create({
    baseURL: `http://localhost:8081/api/positions/`
});

export const getAllPositions = async () => {
    return await http.get("/").then(response => response.data);
};

export const getPositionById = async (id) => {
    return await http.get(`/${id}`).then(response => response.data);
};

export const createPosition = async (data) => {
    return await http.post("/", data);
};

export const updatePosition = async (id, data) => {
    return await http.put(`/${id}`, data);
};

export const removePosition = async (id) => {
    return await http.delete(`/${id}`);
};

export const searchPositions = async (searchQuery) => {
    return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
};
