import axios from "axios";

const http = axios.create({
    baseURL: `http://localhost:8081/api/board-members/`
});

export const getAllBoardMembers = async () => {
    return await http.get("/").then(response => response.data);
};

export const getBoardMemberById = async (id) => {
    return await http.get(`/${id}`).then(response => response.data);
};

export const createBoardMember = async (data) => {
    return await http.post("/", data);
};

export const updateBoardMember = async (id, data) => {
    return await http.put(`/${id}`, data);
};

export const removeBoardMember = async (id) => {
    return await http.delete(`/${id}`);
};
