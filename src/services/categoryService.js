// HTTP istekleri yapmak için axios kütüphanesi içe aktarılır
import axios from "axios";

// Kategori işlemleri için temel API URL'si tanımlanır
const API_URL = "https://libraryappspringboot-anbw.onrender.com/api/v1/categories";

// Tüm kategorileri getiren fonksiyon
export const getCategories = () => axios.get(API_URL);

// Yeni bir kategori ekleyen fonksiyon
export const addCategory = (data) => axios.post(API_URL, data); // <-- Kategori ekleme işlemi

// Belirli bir kategoriyi güncelleyen fonksiyon
export const updateCategory = (id, data) => axios.put(`${API_URL}/${id}`, data); // <-- Kategori güncelleme işlemi

// Belirli bir kategoriyi silen fonksiyon
export const deleteCategory = (id) => axios.delete(`${API_URL}/${id}`); // <-- Kategori silme işlemi
