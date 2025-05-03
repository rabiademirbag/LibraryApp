// HTTP istekleri için axios kütüphanesi içe aktarılır
import axios from "axios";

// Kitaplara ait API'nin temel URL'si tanımlanır
const API_URL = "https://libraryappspringboot-anbw.onrender.com/api/v1/books";

// Tüm kitapları getiren fonksiyon
export const getBooks = () => axios.get(API_URL);

// Yeni bir kitap ekleyen fonksiyon
export const addBook = (data) => axios.post(API_URL, data);

// Belirli bir kitabı güncelleyen fonksiyon
export const updateBook = (id, data) => axios.put(`${API_URL}/${id}`, data);

// Belirli bir kitabı silen fonksiyon
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
