import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/attachments`
});

const Attachment = {
    crud: {
        getAllAttachments: async (letterId) => {
            return await http.get(`/all-by-letter-id/${letterId}`)
        },
        getAttachmentById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        createAttachment: async (data) => {
            return await http.post("/", data);
        },
        updateAttachment: async (id, data) => {
            return await http.put(`/${id}`, data).then(response => response.data);
        },
        removeAttachment: async (id) => {
            return await http.delete(`/${id}`);
        },
        upload: async (data) => {
            return await http.post("/upload", data);
        },
        download: async (id) => {
            return await http.get(`/download/${id}`);
        },
    },
};

export default Attachment;
