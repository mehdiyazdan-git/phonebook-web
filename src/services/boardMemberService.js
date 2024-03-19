import axios from "axios";

const http = axios.create({
    baseURL: `http://localhost:8081/api/board-members/`
});

const BoardMemberService = {
    crud: {
        getAllBoardMembers: async () => {
            return await http.get("/").then(response => response.data);
        },
        getBoardMemberById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        createBoardMember: async (data) => {
            return await http.post("/", data);
        },
        updateBoardMember: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removeBoardMember: async (id) => {
            return await http.delete(`/${id}`);
        },
        // Additional methods can be added here if needed
    },
};

export default BoardMemberService;
