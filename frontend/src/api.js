import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const uploadOpinion = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload`, formData);
};

export const getOpinions = () => {
    return axios.get(`${API_URL}/opinions`);
};

export const getOpinionDetails = (id) => {
    return axios.get(`${API_URL}/opinions/${id}`);
};

export const updateRequirement = (id, data) => {
    return axios.patch(`${API_URL}/requirements/${id}`, data);
};
