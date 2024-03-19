import axios from "axios";


const http = axios.create({
    baseURL: `http://localhost:8081/api/senders/`
});

const Sender = {
    crud: {
        getAllSenders: async () => {
            return await http.get("/")
        },
        getSenderById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        getSenderSelect: async () => {
            return await http.get(`/select`).then(response => response.data);
        },
        createSender: async (data) => {
            return await http.post("/", data);
        },
        updateSender: async (id, data) => {
            return await http.put(`/${id}`, data);
        },
        removeSender: async (id) => {
            console.log("senderId: ",id)
            return await http.delete(`/${id}`);
        },
        search: async (searchQuery) => {
            return await http.get(`/search?searchQuery=${searchQuery}`).then(response => response.data);
        },
    },
};

export default Sender;
