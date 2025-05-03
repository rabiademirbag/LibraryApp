// HTTP istekleri yapmak için axios kütüphanesi içe aktarılır
import axios from 'axios';

// Ödünç işlemleri için temel API URL'si tanımlanır
const API_URL = "https://libraryappspringboot-anbw.onrender.com/api/v1/borrows";

// Yeni bir ödünç kaydı ekleyen fonksiyon
export const addBorrow = (data) => axios.post(API_URL, data);

// Tüm ödünç kayıtlarını getiren fonksiyon
export const getBorrows = () => axios.get(API_URL);

// Belirli bir ödünç kaydını silen fonksiyon
export const deleteBorrow = (id) => axios.delete(`${API_URL}/${id}`);

// Belirli bir ödünç kaydını güncelleyen fonksiyon
export const updateBorrow = (id, data) => axios.put(`${API_URL}/${id}`, data);
