// Yayımcı verileriyle ilgili HTTP istekleri için axios kullanılır
import axios from 'axios';

// Yayımcı işlemleri için temel API adresi tanımlanır
const API_URL = 'https://libraryappspringboot-anbw.onrender.com/api/v1/publishers';

// Tüm yayımcıları getiren fonksiyon
export const getPublishers = () => axios.get(API_URL);

// Yeni bir yayımcı ekleyen fonksiyon
export const addPublisher = (publisher) => axios.post(API_URL, publisher);

// Belirli bir yayımcıyı güncelleyen fonksiyon
export const updatePublisher = (id, publisher) => axios.put(`${API_URL}/${id}`, publisher);

// Belirli bir yayımcıyı silen fonksiyon
export const deletePublisher = (id) => axios.delete(`${API_URL}/${id}`);
