// Gerekli React hook'larını ve dış servisleri içe aktarıyoruz
import { useState, useEffect } from "react";
import {
  addAuthor,       // Yeni yazar eklemek için servis
  getAuthors,      // Mevcut yazarları listelemek için servis
  updateAuthor,    // Var olan yazarı güncellemek için servis
  deleteAuthor,    // Yazar silme işlemi için servis
} from "../services/authorService";
import { toast } from "react-toastify"; // Kullanıcıya bildirim göstermek için
import '../styles/common.css'; // Ortak stiller

// AuthorForm bileşeninin tanımı
export default function AuthorForm() {
  // Yazar adı için state
  const [authorName, setAuthorName] = useState("");
  // Doğum tarihi için state
  const [birthDate, setBirthDate] = useState("");
  // Ülke bilgisi için state
  const [country, setCountry] = useState("");
  // Yazar listesini tutmak için state
  const [authors, setAuthors] = useState([]);
  // Düzenleme yapılan yazarın ID'sini tutmak için state
  const [editingAuthorId, setEditingAuthorId] = useState(null);
  // Yeni yazar formunun gösterilip gösterilmeyeceğini kontrol eden state
  const [showForm, setShowForm] = useState(false);
  // Silme onay modali görünürlüğü için state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Düzenleme modalı için görünürlük state'i
  const [showEditModal, setShowEditModal] = useState(false);
  // Silinecek yazarın ID'si
  const [authorToDelete, setAuthorToDelete] = useState(null);

  // Bileşen yüklendiğinde yazarları getirmek için useEffect
  useEffect(() => {
    loadAuthors(); // Yazarları yükle
  }, []);

  // Yazarları API'den çeken fonksiyon
  const loadAuthors = async () => {
    try {
      const res = await getAuthors(); // API'den veriyi çek
      setAuthors(res.data); // State'e yaz
    } catch (error) {
      toast.error("Yazarlar yüklenemedi!"); // Hata bildirimi
      console.error("Yazar Yükleme Hatası:", error.response?.data || error.message);
    }
  };

  // Yeni yazar ekleme formunun submit işlemi
  const handleAddSubmit = async (e) => {
    e.preventDefault(); // Sayfa yenilemeyi engelle

    // Tüm alanlar doldurulmuş mu kontrolü
    if (!authorName.trim() || !birthDate || !country.trim()) {
      toast.error("Tüm alanları doldurun!");
      return;
    }

    // Form verilerini hazırlama
    const authorData = {
      name: authorName.trim(),
      birthDate,
      country: country.trim(),
    };

    try {
      await addAuthor(authorData); // API üzerinden yazar ekle
      toast.success("Yazar başarıyla eklendi!"); // Başarı bildirimi
      loadAuthors(); // Listeyi güncelle
      setAuthorName(""); // Form temizliği
      setBirthDate("");
      setCountry("");
      setShowForm(false); // Formu kapat
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu, tekrar deneyin."); // Hata bildirimi
    }
  };

  // Yazar düzenleme formunun submit işlemi
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Sayfa yenilemeyi engelle

    // Alanlar kontrolü
    if (!authorName.trim() || !birthDate || !country.trim()) {
      toast.error("Tüm alanları doldurun!");
      return;
    }

    // Güncellenecek veriler
    const authorData = {
      name: authorName.trim(),
      birthDate,
      country: country.trim(),
    };

    try {
      await updateAuthor(editingAuthorId, authorData); // Güncelleme işlemi
      toast.success("Yazar güncellendi!"); // Başarı bildirimi
      loadAuthors(); // Listeyi güncelle
      setShowEditModal(false); // Modalı kapat
      resetForm(); // Formu sıfırla
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu, tekrar deneyin."); // Hata bildirimi
    }
  };

  // Silme modalını açan fonksiyon
  const openDeleteModal = (id) => {
    setAuthorToDelete(id); // Silinecek yazar ID'sini ayarla
    setShowDeleteModal(true); // Modalı aç
  };

  // Yazar silme işlemi
  const handleDelete = async () => {
    try {
      await deleteAuthor(authorToDelete); // API ile silme
      toast.success("Yazar silindi."); // Başarı bildirimi
      loadAuthors(); // Listeyi güncelle
    } catch (error) {
      console.log(error);
      toast.error("Yazar silinirken bir hata oluştu."); // Hata bildirimi
    } finally {
      setShowDeleteModal(false); // Modalı kapat
      setAuthorToDelete(null); // ID'yi temizle
    }
  };

  // Silme modalını kapatma işlemi
  const cancelDelete = () => {
    setShowDeleteModal(false); // Modalı kapat
    setAuthorToDelete(null); // ID'yi temizle
  };

  // Düzenleme modalını kapatma işlemi
  const closeEditModal = () => {
    setShowEditModal(false); // Modalı kapat
    resetForm(); // Formu sıfırla
  };

  // Yazar düzenleme işlemini başlatan fonksiyon
  const handleEdit = (author) => {
    setAuthorName(author.name); // Adı input'a aktar
    setBirthDate(author.birthDate); // Tarihi input'a aktar
    setCountry(author.country); // Ülkeyi input'a aktar
    setEditingAuthorId(author.id); // Düzenlenecek yazar ID'sini ayarla
    setShowEditModal(true); // Modalı aç
  };

  // Form alanlarını sıfırlayan fonksiyon
  const resetForm = () => {
    setAuthorName(""); // Adı temizle
    setBirthDate(""); // Tarihi temizle
    setCountry(""); // Ülkeyi temizle
    setEditingAuthorId(null); // ID'yi temizle
  };

  return (
    // Sayfanın ana kapsayıcısı
    <div className="container">
      
      {/* Başlık ve formu aç/kapat butonu */}
      <div className="header">
        <h2 className="title">Yazarlar</h2>
        {/* Form görünürlüğünü değiştiren buton */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="new-button"
        >
          {/* Buton metni form açıksa 'Formu Kapat', değilse 'Yeni Yazar Ekle' */}
          {showForm ? "Formu Kapat" : "Yeni Yazar Ekle"}
        </button>
      </div>
  
      {/* Yeni yazar ekleme formu görünüyorsa */}
      {showForm && (
        <div className="form-wrapper">
          <h3 className="form-subtitle">Yeni Yazar Ekleme Formu</h3>
          <form onSubmit={handleAddSubmit} className="form">
            <div className="form-grid">
              {/* Yazar adı giriş alanı */}
              <div className="input-group">
                <label className="input-label">Yazar Adı:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              {/* Doğum tarihi giriş alanı */}
              <div className="input-group">
                <label className="input-label">Doğum Tarihi:</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              {/* Ülke giriş alanı */}
              <div className="input-group">
                <label className="input-label">Ülke:</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>
            {/* Formu gönderme butonu */}
            <button type="submit" className="submit-button">
              Ekle
            </button>
          </form>
        </div>
      )}
  
      {/* Kayıtlı yazarların listelendiği tablo */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Doğum Tarihi</th>
              <th>Ülke</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {/* Her yazar için bir tablo satırı */}
            {authors.map((author) => (
              <tr key={author.id}>
                <td>{author.name}</td>
                <td>{author.birthDate}</td>
                <td>{author.country}</td>
                <td>
                  <div className="button-group">
                    {/* Yazar düzenleme butonu */}
                    <button
                      onClick={() => handleEdit(author)}
                      className="new-button"
                    >
                      Düzenle
                    </button>
                    {/* Yazar silme butonu */}
                    <button
                      onClick={() => openDeleteModal(author.id)}
                      className="delete-button"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Eğer düzenleme modali açıksa */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h3>Yazarı Düzenle</h3>
              {/* Güncelleme formu */}
              <form onSubmit={handleEditSubmit} className="form">
                <div className="form-grid">
                  {/* Yazar adı giriş alanı */}
                  <div className="input-group">
                    <label className="input-label">Yazar Adı:</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                  {/* Doğum tarihi giriş alanı */}
                  <div className="input-group">
                    <label className="input-label">Doğum Tarihi:</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                  {/* Ülke giriş alanı */}
                  <div className="input-group">
                    <label className="input-label">Ülke:</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
                {/* Modal butonları: iptal ve güncelle */}
                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={closeEditModal}
                    className="cancel-button"
                  >
                    İptal
                  </button>
                  <button type="submit" className="submit-button">
                    Güncelle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
  
      {/* Eğer silme onay modali açıksa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              {/* Kullanıcıya silme işlemini onaylatan mesaj */}
              <p>Bu yazarı silmek istediğinize emin misiniz?</p>
              <div className="modal-actions">
                {/* Silme işlemini iptal butonu */}
                <button onClick={cancelDelete} className="cancel-button">
                  İptal
                </button>
                {/* Silme işlemini gerçekleştiren buton */}
                <button onClick={handleDelete} className="confirm-button">
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}
