// React'ten gerekli hook'lar import ediliyor
import { useState, useEffect } from "react";
// Borrow işlemleri için gerekli servis fonksiyonları import ediliyor
import { addBorrow, getBorrows, deleteBorrow, updateBorrow } from "../services/borrowService";
// Kitapları çekmek için servis fonksiyonu import ediliyor
import { getBooks } from "../services/bookService";
// Kullanıcı geri bildirimi için toast bildirimleri import ediliyor
import { toast } from "react-toastify";
// Ortak stil dosyası import ediliyor
import "../styles/common.css";

export default function BorrowForm() {
  // Form elemanlarının değerlerini ve uygulama durumunu yönetmek için useState hook'ları
  const [borrowerName, setBorrowerName] = useState(""); // Ödünç alan kişinin adı
  const [borrowerMail, setBorrowerMail] = useState(""); // Ödünç alan kişinin e-posta adresi
  const [bookId, setBookId] = useState(""); // Seçilen kitabın ID'si
  const [selectedBook, setSelectedBook] = useState(null); // Seçilen kitap objesi
  const [borrowingDate, setBorrowingDate] = useState(new Date().toISOString().split("T")[0]); // Ödünç alma tarihi, varsayılan olarak bugünü alır
  const [returnDate, setReturnDate] = useState(""); // Kitap iade tarihi
  const [borrows, setBorrows] = useState([]); // Ödünç alma kayıtları listesi
  const [books, setBooks] = useState([]); // Mevcut kitaplar listesi
  const [showForm, setShowForm] = useState(false); // Formun görünürlüğünü kontrol etmek için durum
  const [loading, setLoading] = useState(true);
  const [editingBorrowId, setEditingBorrowId] = useState(null); // Düzenlenmekte olan ödünç alma kaydının ID'si
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Silme modal'ının görünürlüğü
  const [borrowToDelete, setBorrowToDelete] = useState(null); // Silinecek ödünç alma kaydının ID'si
  const [showEditModal, setShowEditModal] = useState(false); // Düzenleme modal'ının görünürlüğü

  // Component mount edildiğinde borçlar ve kitaplar yüklensin
  useEffect(() => {
    loadBorrows(); // Ödünç alma kayıtlarını yükle
    loadBooks(); // Kitapları yükle
  }, []);

  // Ödünç alma kayıtlarını yüklemek için kullanılan fonksiyon
  const loadBorrows = async () => {
    try {
      setLoading(true); // Yükleniyor durumunu başlat
      const res = await getBorrows(); // Borçları servis üzerinden çek
      // Geri dönen borçları işleyerek dönüş tarihi geçerli olmayanları null olarak ayarla
      const processedBorrows = res.data.map((borrow) => {
        if (
          borrow.returnDate === "0001-01-01" ||
          borrow.returnDate === "0001-01-01T00:00:00" ||
          borrow.returnDate === "1-1-1" ||
          borrow.returnDate === ""
        ) {
          return { ...borrow, returnDate: null };
        }
        return borrow;
      });
      setBorrows(processedBorrows); // İşlenmiş borçları state'e ata
    } catch (error) {
      console.log(error); // Hata durumunda konsola yaz
      toast.error("Kitap alma kayıtları yüklenemedi!"); // Kullanıcıya hata mesajı göster
    } finally {
      setLoading(false); // Yükleniyor durumunu bitir
    }
  };

  // Kitapları yüklemek için kullanılan fonksiyon
  const loadBooks = async () => {
    try {
      const res = await getBooks(); // Kitapları servis üzerinden çek
      setBooks(res.data || []); // Kitapları state'e ata
    } catch (error) {
      console.log(error); // Hata durumunda konsola yaz
      toast.error("Kitap listesi yüklenemedi!"); // Kullanıcıya hata mesajı göster
    }
  };

  // Kitap seçimi yapıldığında çağrılan fonksiyon
  const handleBookSelect = (e) => {
    const selectedBookId = e.target.value; // Seçilen kitabın ID'sini al
    setBookId(selectedBookId); // Kitap ID'sini state'e ata
    const book = books.find((b) => b.id === Number.parseInt(selectedBookId)); // Seçilen kitaba ait objeyi bul
    setSelectedBook(book); // Seçilen kitabı state'e ata
  };

  // Formu gönderme işlemi için kullanılan fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun default submit işlemini engelle

    // Kitap seçilmediyse hata mesajı göster
    if (!selectedBook || !selectedBook.name) {
      toast.error("Bir kitap seçmelisiniz!");
      return;
    }

    // Kitap stokta yoksa hata mesajı göster
    if (selectedBook.stock <= 0) {
      toast.error("Bu kitap şu anda stokta yok.");
      return;
    }

    // Düzenleme modunda, iade tarihi ödünç alma tarihinden önce olamaz
    if (editingBorrowId && returnDate) {
      if (new Date(returnDate) <= new Date(borrowingDate)) {
        toast.error("İade tarihi, ödünç alma tarihinden sonra olmalıdır!");
        return;
      }
    }

    try {
      setLoading(true); // Yükleniyor durumunu başlat
      // Ödünç alma verisini hazırlama
      const payload = {
        borrowerName,
        borrowerMail,
        borrowingDate,
        bookForBorrowingRequest: {
          id: selectedBook.id,
          name: selectedBook.name,
        },
      };

      // Eğer düzenleme modundaysa, iade tarihi ekle
      if (editingBorrowId && returnDate) {
        payload.returnDate = returnDate;
      }

      // Eğer düzenleme yapılıyorsa, update işlemi yap
      if (editingBorrowId) {
        await updateBorrow(editingBorrowId, payload);
        toast.success("Kayıt başarıyla güncellendi!");
        setShowEditModal(false);
      } else {
        // Yeni ödünç alma kaydı ekle
        await addBorrow(payload);
        toast.success("Kitap başarıyla ödünç alındı!");
        setShowForm(false);
      }

      resetForm(); // Formu sıfırla
      await loadBorrows(); // Borçları yeniden yükle
      await loadBooks(); // Kitapları yeniden yükle
    } catch (error) {
      console.log(error); // Hata durumunda konsola yaz
      toast.error("Bir hata oluştu, tekrar deneyin."); // Kullanıcıya hata mesajı göster
    } finally {
      setLoading(false); // Yükleniyor durumunu bitir
    }
  };

  // Formu sıfırlamak için kullanılan fonksiyon
  const resetForm = () => {
    setBorrowerName(""); // Ödünç alan kişinin adı
    setBorrowerMail(""); // Ödünç alan kişinin e-posta adresi
    setBookId(""); // Kitap ID'si
    setSelectedBook(null); // Seçilen kitap
    setBorrowingDate(new Date().toISOString().split("T")[0]); // Ödünç alma tarihi (bugün)
    setReturnDate(""); // İade tarihi
    setEditingBorrowId(null); // Düzenleme ID'si
  };

  // Silme modal'ını açmak için kullanılan fonksiyon
  const openDeleteModal = (id) => {
    setBorrowToDelete(id); // Silinecek ödünç alma kaydının ID'sini state'e ata
    setShowDeleteModal(true); // Silme modal'ını göster
  };

  // Silme işlemi onaylandığında çağrılan fonksiyon
  const confirmDelete = async () => {
    try {
      setLoading(true); // Yükleniyor durumunu başlat
      await deleteBorrow(borrowToDelete); // Ödünç alma kaydını sil
      toast.success("Kitap alma kaydı silindi!"); // Kullanıcıya başarı mesajı göster
      await loadBorrows(); // Borçları yeniden yükle
      await loadBooks(); // Kitapları yeniden yükle
    } catch (error) {
      console.log(error); // Hata durumunda konsola yaz
      toast.error("Silme işlemi sırasında bir hata oluştu."); // Kullanıcıya hata mesajı göster
    } finally {
      setLoading(false); // Yükleniyor durumunu bitir
      setShowDeleteModal(false); // Silme modal'ını kapat
      setBorrowToDelete(null); // Silinecek ödünç alma kaydını sıfırla
    }
  };

  // Silme işleminden vazgeçildiğinde çağrılan fonksiyon
  const cancelDelete = () => {
    setShowDeleteModal(false); // Silme modal'ını kapat
    setBorrowToDelete(null); // Silinecek ödünç alma kaydını sıfırla
  };

  // Düzenleme işlemi başlatıldığında çağrılan fonksiyon
  const handleEdit = (borrow) => {
    setEditingBorrowId(borrow.id); // Düzenlenmekte olan ödünç alma kaydının ID'sini ata
    setBorrowerName(borrow.borrowerName); // Ödünç alan kişinin adı
    setBorrowerMail(borrow.borrowerMail); // Ödünç alan kişinin e-posta adresi
    setBorrowingDate(borrow.borrowingDate.split("T")[0]); // Ödünç alma tarihini ata
    setReturnDate(borrow.returnDate ? borrow.returnDate.split("T")[0] : ""); // İade tarihini ata
    setBookId(borrow.book?.id || ""); // Kitap ID'sini ata
    setSelectedBook(borrow.book || null); // Kitap objesini ata
    setShowEditModal(true); // Düzenleme modal'ını göster
  };

  // Düzenleme modal'ını kapatmak için kullanılan fonksiyon
  const closeEditModal = () => {
    setShowEditModal(false); // Düzenleme modal'ını kapat
    resetForm(); // Formu sıfırla
  };

  // Tarih formatını uygun şekilde döndüren fonksiyon
  const getFormattedDate = (dateStr) => {
    if (!dateStr || ["0001-01-01", "0001-01-01T00:00:00", "1-1-1", ""].includes(dateStr)) {
      return "Belirtilmedi"; // Tarih geçersizse "Belirtilmedi" döndür
    }

    try {
      const date = new Date(dateStr); // Tarih objesi oluştur
      if (isNaN(date.getTime())) return "Geçersiz Tarih"; // Eğer tarih geçersizse hata döndür

      return date.toLocaleDateString("tr-TR", { // Tarihi Türkiye formatında döndür
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Hata"; // Eğer bir hata olursa "Hata" döndür
    }
  };


  return (
    <div className="container">
      {loading ? (
      <p>Loading...</p> 
    ) : (
      <>
      {/* Başlık ve Yeni Ödünç Alım Butonu */}
      <div className="header">
        <h2 className="title">Ödünç Alma Kayıtları</h2>
        <button 
          className="new-button" 
          onClick={() => {
            resetForm();  // Formu sıfırlamak için
            setShowForm(!showForm);  // Formun görünürlüğünü değiştirmek için
          }} 
        >
          {showForm ? "Formu Kapat" : "Yeni Ödünç Alım"}  {/* Buton metni form durumuna göre değişir */}
        </button>
      </div>
  
      {/* Yeni Ödünç Alma Formu */}
      {showForm && (
        <div className="form-wrapper">
          <h3 className="form-subtitle">Kitap Ödünç Alma Formu</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              {/* Ödünç Alan Kişi */}
              <div className="input-group">
                <label className="input-label">Ödünç Alan Kişi:</label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}  // Kişi ismini güncelle
                  required
                  className="input-field"
                  disabled={loading}  // Yükleme durumunda input devre dışı
                />
              </div>
  
              {/* E-posta Adresi */}
              <div className="input-group">
                <label className="input-label">E-posta Adresi:</label>
                <input
                  type="email"
                  value={borrowerMail}
                  onChange={(e) => setBorrowerMail(e.target.value)}  // E-posta adresini güncelle
                  required
                  className="input-field"
                  disabled={loading}
                />
              </div>
  
              {/* Kitap Seçimi */}
              <div className="input-group">
                <label className="input-label">Kitap Seç:</label>
                <select 
                  value={bookId} 
                  onChange={handleBookSelect}  // Kitap seçim fonksiyonu
                  required 
                  className="input-field" 
                  disabled={loading}
                >
                  <option value="">Bir kitap seçiniz</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id} disabled={book.stock <= 0}>  {/* Kitap stok durumu kontrolü */}
                      {book.name || "Bilinmeyen Kitap"} - Stok: {book.stock}
                    </option>
                  ))}
                </select>
              </div>
  
              {/* Ödünç Alma Tarihi */}
              <div className="input-group">
                <label className="input-label">Ödünç Alma Tarihi:</label>
                <input
                  type="date"
                  value={borrowingDate}
                  onChange={(e) => setBorrowingDate(e.target.value)}  // Tarihi güncelle
                  required
                  className="input-field"
                  disabled={loading}
                />
              </div>
            </div>
  
            {/* Formu Gönderme Butonu */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "İşleniyor..." : "Kitap Al"}  {/* Yükleme durumu kontrolü */}
            </button>
          </form>
        </div>
      )}
  
      {/* Düzenleme Modalı */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h3>Ödünç Kaydını Düzenle</h3>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                  {/* Düzenleme Formu */}
                  <div className="input-group">
                    <label className="input-label">Ödünç Alan Kişi:</label>
                    <input
                      type="text"
                      value={borrowerName}
                      onChange={(e) => setBorrowerName(e.target.value)}  // Kişi ismini düzenle
                      required
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
  
                  {/* Düzenleme E-posta Adresi */}
                  <div className="input-group">
                    <label className="input-label">E-posta Adresi:</label>
                    <input
                      type="email"
                      value={borrowerMail}
                      onChange={(e) => setBorrowerMail(e.target.value)}  // E-posta adresini düzenle
                      required
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
  
                  {/* Kitap Adı */}
                  <div className="input-group">
                    <label className="input-label">Kitap:</label>
                    <input
                      type="text"
                      value={selectedBook?.name || ""}  // Seçilen kitabı görüntüle
                      className="input-field"
                      disabled  // Kitap adı düzenlenemez
                    />
                  </div>
  
                  {/* Düzenleme Ödünç Alma Tarihi */}
                  <div className="input-group">
                    <label className="input-label">Ödünç Alma Tarihi:</label>
                    <input
                      type="date"
                      value={borrowingDate}
                      onChange={(e) => setBorrowingDate(e.target.value)}  // Tarihi güncelle
                      required
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
  
                  {/* İade Tarihi */}
                  <div className="input-group">
                    <label className="input-label">İade Tarihi:</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}  // İade tarihini güncelle
                      className="input-field"
                      min={new Date(borrowingDate).toISOString().split("T")[0]}  // İade tarihi ödünç tarihinden sonra olmalı
                      disabled={loading}
                    />
                    <small className="hint-text">İade tarihi ödünç alma tarihinden sonra olmalıdır</small>
                  </div>
                </div>
  
                {/* Modal İptal ve Güncelleme Butonları */}
                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={closeEditModal}
                    className="cancel-button"
                    disabled={loading}
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading}
                  >
                    {loading ? "İşleniyor..." : "Güncelle"}  {/* Yükleme durumu kontrolü */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
  
      {/* Yükleme Durumu */}
      {loading && <div className="loading-indicator">Yükleniyor...</div>}
  
      {/* Borç Kayıtları Yoksa Mesaj */}
      {!loading && borrows.length === 0 ? (
        <div className="no-borrows">Henüz kitap alınmadı.</div>
      ) : (
        <div className="table-container">
          {/* Ödünç Kayıtları Tablosu */}
          <table className="table">
            <thead>
              <tr>
                <th>Ödünç Alan</th>
                <th>E-posta</th>
                <th>Kitap</th>
                <th>Alım Tarihi</th>
                <th>İade Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => {
                const returnDateFormatted = getFormattedDate(borrow.returnDate);  // İade tarihini formatla
  
                return (
                  <tr key={borrow.id}>
                    <td>{borrow.borrowerName}</td>
                    <td>{borrow.borrowerMail}</td>
                    <td>{borrow.book?.name || "Bilinmeyen Kitap"}</td>
                    <td>{getFormattedDate(borrow.borrowingDate)}</td>
                    <td>{returnDateFormatted}</td>
                    <td>
                      {/* Düzenle ve Sil Butonları */}
                      <div className="button-group">
                        <button 
                          onClick={() => handleEdit(borrow)} 
                          className="new-button"
                        >
                          Düzenle
                        </button>
                        <button 
                          onClick={() => openDeleteModal(borrow.id)} 
                          className="delete-button" 
                          disabled={loading}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <p>Bu kitap alma kaydını silmek istediğinize emin misiniz?</p>
              <div className="modal-actions">
                <button onClick={cancelDelete} className="cancel-button">
                  İptal
                </button>
                <button onClick={confirmDelete} className="confirm-button">
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
         )}
            </>
          )}
    </div>
  );
};  