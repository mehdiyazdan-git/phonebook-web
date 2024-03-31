// Document.js
import axios from "axios";
import { IPADDRESS, PORT } from "./conntectionParams";

const http = axios.create({
    baseURL: `http://${IPADDRESS}:${PORT}/api/documents`
});

const Document = {
    crud: {
        getAllByPersonId: async (personId) => {
            return await http.get(`/by-person-id/${personId}`);
        },
        getAllByCompanyId: async (companyId) => {
            return await http.get(`/by-company-id/${companyId}`);
        },
        getDocumentById: async (id) => {
            return await http.get(`/${id}`).then(response => response.data);
        },
        createDocument: async (data) => {
            return await http.post("/", data);
        },
        updateDocument: async (id, data) => {
            return await http.put(`/${id}`, data)
        },
        updateDocumentState: async (documentId, documentState) => {
            return await http.put(`/${documentId}/update-state/${(documentState === 'DRAFT' ? 'DELIVERED' : 'DRAFT')}`)
        },
        deleteDocument: async (id) => {
            return await http.delete(`/${id}`);
        },
    },
};

export default Document;
