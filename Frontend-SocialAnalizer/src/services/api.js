import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/Security/v1',
    timeout: 500000
});

export const social_analyzer = async(data) => {
    try {
        // console.log(data);
        return await apiClient.post('/osint/social-analyzer', data)
    } catch (error) {
        const msg = error.response?.data?.msg || error.response?.data?.error || 'Error desconocido';
        return {
            error: true,
            msg,
            error
        }
    }
}