import axios from "axios";

const http = axios.create({
    baseURL: `http://localhost:8081/api/positions/`
});

const PositionService = {
    crud: {
        getAllPositions: async () => {
            return await http.get("/").then(response => response.data);
        },
        getPositionById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        createPosition: async (data) => {
            return await http.post("/", data);
        },
        updatePosition: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removePosition: async (id) => {
            console.log("positionId: ", id);
            return await http.delete(`/${id}`);
        },
        searchPositions: async (searchQuery) => {
            return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
        },
    },
};

export default PositionService;
