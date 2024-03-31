import React from 'react';
import useHttp from "../hooks/useHttp";


export default function PersonService() {
    const http = useHttp();
    const getAllPersons = async (queryParams) => {
        return await http.get(`/persons?${queryParams.toString()}`).then(r => r.data);
    }
    const createPerson = async (data) => {
        return await http.post("/persons", data);
    };
    const updatePerson = async (id, data) => {
        return await http.put(`/persons/${id}`, data);
    };
    const removePerson = async (id) => {
        return await http.delete(`/persons/${id}`);
    };
    const getPersonSelect = async () => {
        return await http.get(`/persons/select`).then(r => r.data);
    };
    const searchPersons = async (searchQuery) => {
        return await http.get(`/persons/search?searchQuery=${searchQuery}`).then(response => response.data);
    };
    return (
        {
            getAllPersons,
            createPerson,
            updatePerson,
            removePerson,
            getPersonSelect,
            searchPersons
        }
    );
}
