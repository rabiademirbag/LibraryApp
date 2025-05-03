// HTTP istekleri yapmak için axios kütüphanesi içe aktarılır
import axios from "axios";

// API'nin temel URL'si tanımlanır
const API_URL = "https://libraryappspringboot-anbw.onrender.com/api/v1/authors";

// Tüm yazarları getiren fonksiyon
export const getAuthors = () => axios.get(API_URL);

// Yeni bir yazar ekleyen fonksiyon
export const addAuthor = (data) => axios.post(API_URL, data);

// Belirli bir yazar kaydını güncelleyen fonksiyon
export const updateAuthor = (id, data) => axios.put(`${API_URL}/${id}`, data);

// Belirli bir yazarı silen fonksiyon
export const deleteAuthor = (id) => axios.delete(`${API_URL}/${id}`);
