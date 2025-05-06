import { useEffect, useState } from "react"; // React hook'larını içe aktar
import { getBooks, addBook, updateBook, deleteBook } from "../services/bookService"; // Kitap servis fonksiyonlarını içe aktar
import { getAuthors } from "../services/authorService"; // Yazar servis fonksiyonunu içe aktar
import { getPublishers } from "../services/publisherService"; // Yayımcı servis fonksiyonunu içe aktar
import { getCategories } from "../services/categoryService"; // Kategori servis fonksiyonunu içe aktar
import { toast } from "react-toastify"; // Kullanıcıya bildirim göstermek için react-toastify kullanımı
import "../styles/common.css"; // Ortak stilleri içeren CSS dosyasını içe aktar

export default function BookForm() { // BookForm bileşenini tanımla
  const [isLoading, setIsLoading] = useState(true); // Yüklenme durumu
  const [books, setBooks] = useState([]); // Kitaplar için state
  const [name, setName] = useState(""); // Kitap adı için state
  const [publicationYear, setPublicationYear] = useState(""); // Yayın yılı için state
  const [stock, setStock] = useState(""); // Stok miktarı için state
  const [authorId, setAuthorId] = useState(""); // Seçilen yazar ID'si için state
  const [publisherId, setPublisherId] = useState(""); // Seçilen yayımcı ID'si için state
  const [categoryIds, setCategoryIds] = useState([]); // Seçilen kategori ID'leri için state
  const [editingBookId, setEditingBookId] = useState(null); // Düzenlenen kitap ID'si için state
  const [isFormVisible, setIsFormVisible] = useState(false); // Formun görünür olup olmadığını belirleyen state
  const [searchTerm, setSearchTerm] = useState(""); // Kategori arama terimi için state
  const [authors, setAuthors] = useState([]); // Yazarlar listesi için state
  const [publishers, setPublishers] = useState([]); // Yayımcılar listesi için state
  const [categories, setCategories] = useState([]); // Kategoriler listesi için state
  const [showEditModal, setShowEditModal] = useState(false); // Düzenleme modalı görünürlüğü için state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Silme onay modalı görünürlüğü için state
  const [bookToDelete, setBookToDelete] = useState(null); // Silinmek istenen kitabın ID'si için state

  useEffect(() => { // Bileşen yüklendiğinde kitapları ve ilişkili verileri yükle
    loadBooks(); // Kitapları yükle
    loadDependencies(); // Yazar, yayımcı ve kategori verilerini yükle
  }, []); // Boş bağımlılık dizisi, sadece bir kez çalışır

  const loadBooks = async () => { // Kitapları yükleyen fonksiyon
    setIsLoading(true); // Yükleme başladığında true yap
    try {
      const res = await getBooks(); // Kitapları al
      setBooks(res.data); // State'e ata
    } catch (error) {
      console.log(error); // Hata konsola yazdırılır
      toast.error("Kitaplar yüklenemedi."); // Hata bildirimi göster
    }
    finally {
      setIsLoading(false); // Yükleme tamamlandığında false yap
    }
  };

  const loadDependencies = async () => { // Yazar, yayımcı ve kategori verilerini yükleyen fonksiyon
    try {
      const [authorRes, publisherRes, categoryRes] = await Promise.all([
        getAuthors(), // Yazarları getir
        getPublishers(), // Yayımcıları getir
        getCategories() // Kategorileri getir
      ]);
      setAuthors(authorRes.data); // Yazarları state'e ata
      setPublishers(publisherRes.data); // Yayımcıları state'e ata
      setCategories(categoryRes.data); // Kategorileri state'e ata
    } catch (err) {
      console.log(err); // Hata konsola yazdırılır
      toast.error("İlişkili veriler yüklenemedi."); // Hata bildirimi göster
    }
  };

  const resetForm = () => { // Form alanlarını sıfırlayan fonksiyon
    setName(""); // Kitap adını temizle
    setPublicationYear(""); // Yayın yılını temizle
    setStock(""); // Stok bilgisini temizle
    setAuthorId(""); // Yazar ID'sini temizle
    setPublisherId(""); // Yayımcı ID'sini temizle
    setCategoryIds([]); // Kategori ID'lerini temizle
    setEditingBookId(null); // Düzenleme ID'sini sıfırla
    setSearchTerm(""); // Arama terimini temizle
  };

  const handleSubmit = async (e) => { // Form gönderildiğinde çalışacak fonksiyon
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    if (!name || !publicationYear || !stock || !authorId || !publisherId || categoryIds.length === 0) {
      toast.error("Tüm alanları doldurmalısınız."); // Gerekli alanlar boşsa uyarı göster
      return; // Fonksiyondan çık
    }

    const bookData = { // Kitap verisi nesnesi oluştur
      name,
      publicationYear: Number.parseInt(publicationYear), // Yayın yılını sayıya çevir
      stock: Number.parseInt(stock), // Stok miktarını sayıya çevir
      author: { id: Number.parseInt(authorId) }, // Yazar ID'sini sayıya çevir
      publisher: { id: Number.parseInt(publisherId) }, // Yayımcı ID'sini sayıya çevir
      categories: categoryIds.map((id) => ({ id: Number.parseInt(id) })), // Kategori ID'lerini sayıya çevir
    };

    try {
      if (editingBookId) { // Düzenleme modu aktifse
        await updateBook(editingBookId, bookData); // Kitabı güncelle
        toast.success("Kitap güncellendi!"); // Başarı bildirimi göster
        setShowEditModal(false); // Düzenleme modalını kapat
      } else {
        await addBook(bookData); // Yeni kitap ekle
        toast.success("Kitap eklendi!"); // Başarı bildirimi göster
        setIsFormVisible(false); // Formu gizle
      }

      loadBooks(); // Kitap listesini yeniden yükle
      resetForm(); // Formu temizle
    } catch (error) {
      console.log(error); // Hata konsola yazdırılır
      toast.error("Kitap eklenirken bir hata oluştu."); // Hata bildirimi göster
    }
  };

  const openDeleteModal = (id) => { // Silme modalını açan fonksiyon
    setBookToDelete(id); // Silinecek kitabın ID'sini ata
    setShowDeleteModal(true); // Silme modalını görünür yap
  };

  const confirmDelete = async () => { // Kitabı silen fonksiyon
    try {
      await deleteBook(bookToDelete); // Kitabı sil
      toast.success("Kitap silindi."); // Başarı bildirimi göster
      loadBooks(); // Kitap listesini yeniden yükle
    } catch (error) {
      console.log(error); // Hata konsola yazdırılır
      toast.error("Kitap silinemedi."); // Hata bildirimi göster
    } finally {
      setShowDeleteModal(false); // Silme modalını kapat
      setBookToDelete(null); // Silinecek kitap ID'sini sıfırla
    }
  };

  const cancelDelete = () => { // Silme işlemini iptal eden fonksiyon
    setShowDeleteModal(false); // Silme modalını kapat
    setBookToDelete(null); // Silinecek kitap ID'sini sıfırla
  };

  const handleEdit = (book) => { // Düzenleme modalını açan ve formu dolduran fonksiyon
    setName(book.name); // Kitap adını ata
    setPublicationYear(book.publicationYear); // Yayın yılını ata
    setStock(book.stock); // Stok bilgisini ata
    setAuthorId(book.author.id); // Yazar ID'sini ata
    setPublisherId(book.publisher.id); // Yayımcı ID'sini ata
    setCategoryIds(book.categories.map((cat) => cat.id.toString())); // Kategori ID'lerini ata
    setEditingBookId(book.id); // Düzenlenen kitabın ID'sini ata
    setShowEditModal(true); // Düzenleme modalını aç
  };

  const closeEditModal = () => { // Düzenleme modalını kapatan fonksiyon
    setShowEditModal(false); // Modalı kapat
    resetForm(); // Formu temizle
  };

  const filteredCategories = categories.filter((cat) => // Arama terimine göre kategorileri filtrele
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) // Küçük harfe çevirerek karşılaştırma yap
  );

  const selectedCategoriesCount = categoryIds.length; // Seçili kategori sayısını hesapla

  return (
    isLoading ? (
      <div className="loading">loading...</div>
    ) : (
    // Ana kapsayıcı div
    <div className="container">
  
      {/* Başlık ve yeni kitap ekleme butonu */}
      <div className="header">
        <h2 className="title">Kitaplar</h2>
        <button 
          onClick={() => {
            resetForm(); // Formu sıfırla
            setIsFormVisible(!isFormVisible); // Form görünürlüğünü tersine çevir
          }} 
          className="new-button"
        >
          {/* Form açıksa buton metni değişir */}
          {isFormVisible ? "Kitap Listesini Göster" : "Yeni Kitap Ekle"}
        </button>
      </div>
  
      {/* Yeni kitap ekleme formu görünürse gösterilir */}
      {isFormVisible && (
        <div className="form-wrapper">
          <h3 className="form-subtitle">Yeni Kitap Ekleme Formu</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
  
              {/* Kitap adı giriş alanı */}
              <div className="input-group">
                <label className="input-label">Kitap Adı:</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kitap Adı"
                  className="input-field"
                  required
                />
              </div>
  
              {/* Yayın yılı giriş alanı */}
              <div className="input-group">
                <label className="input-label">Yayın Yılı:</label>
                <input
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                  placeholder="Yayın Yılı"
                  type="number"
                  className="input-field"
                  required
                />
              </div>
  
              {/* Stok miktarı giriş alanı */}
              <div className="input-group">
                <label className="input-label">Stok:</label>
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Stok"
                  type="number"
                  className="input-field"
                  required
                />
              </div>
  
              {/* Yazar seçimi dropdown */}
              <div className="input-group">
                <label className="input-label">Yazar Seç:</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Yazar Seç</option>
                  {/* Yazarlar listelenir */}
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
  
              {/* Yayımcı seçimi dropdown */}
              <div className="input-group">
                <label className="input-label">Yayımcı Seç:</label>
                <select
                  value={publisherId}
                  onChange={(e) => setPublisherId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Yayımcı Seç</option>
                  {/* Yayımcılar listelenir */}
                  {publishers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
  
              {/* Kategori seçimi (checkbox ile) */}
              <div className="input-group">
                <label className="input-label">
                  Kategoriler: <span className="category-count">{selectedCategoriesCount} seçili</span>
                </label>
  
                {/* Kategori arama inputu */}
                <div className="category-search">
                  <input
                    type="text"
                    placeholder="Kategori ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                  />
                </div>
  
                {/* Kategorilerin checkbox listesi */}
                <div className="categories-container">
                  {filteredCategories.map((cat) => (
                    <label key={cat.id} className="category-checkbox">
                      <input
                        type="checkbox"
                        value={cat.id}
                        checked={categoryIds.includes(cat.id.toString())}
                        onChange={(e) => {
                          const id = e.target.value;
                          // Seçili kategorileri güncelle
                          setCategoryIds((prev) =>
                            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
                          );
                        }}
                      />
                      <span className="category-name">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Form gönderme butonu */}
            <button type="submit" className="submit-button">
              Ekle
            </button>
          </form>
        </div>
      )}
  
      {/* Kitap düzenleme modalı (showEditModal true ise görünür) */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h3>Kitap Düzenle</h3>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                  {/* Yukarıdaki form alanlarının aynısı burada da bulunur (düzenleme için) */}
                  <div className="input-group">
                    <label className="input-label">Kitap Adı:</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Kitap Adı"
                      className="input-field"
                      required
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label">Yayın Yılı:</label>
                    <input
                      value={publicationYear}
                      onChange={(e) => setPublicationYear(e.target.value)}
                      placeholder="Yayın Yılı"
                      type="number"
                      className="input-field"
                      required
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label">Stok:</label>
                    <input
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Stok"
                      type="number"
                      className="input-field"
                      required
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label">Yazar Seç:</label>
                    <select
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Yazar Seç</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
  
                  <div className="input-group">
                    <label className="input-label">Yayımcı Seç:</label>
                    <select
                      value={publisherId}
                      onChange={(e) => setPublisherId(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Yayımcı Seç</option>
                      {publishers.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
  
                  <div className="input-group">
                    <label className="input-label">
                      Kategoriler: <span className="category-count">{selectedCategoriesCount} seçili</span>
                    </label>
                    <div className="category-search">
                      <input
                        type="text"
                        placeholder="Kategori ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="categories-container">
                      {filteredCategories.map((cat) => (
                        <label key={cat.id} className="category-checkbox">
                          <input
                            type="checkbox"
                            value={cat.id}
                            checked={categoryIds.includes(cat.id.toString())}
                            onChange={(e) => {
                              const id = e.target.value;
                              setCategoryIds((prev) =>
                                prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
                              );
                            }}
                          />
                          <span className="category-name">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
  
                {/* Modal işlem butonları */}
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
  
      {/* Silme işlemi için onay modalı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h3>Silme Onayı</h3>
              <p>Bu kitabı silmek istediğinize emin misiniz?</p>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={cancelDelete}
                  className="cancel-button"
                >
                  İptal
                </button>
                <button 
                  type="button" 
                  onClick={confirmDelete}
                  className="delete-button"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Kitap listesinin tablo görünümü */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Kitap Adı</th>
              <th>Yayın Yılı</th>
              <th>Stok</th>
              <th>Yazar</th>
              <th>Yayımcı</th>
              <th>Kategoriler</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {/* Kitaplar listelenir */}
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.publicationYear}</td>
                <td>{book.stock}</td>
                <td>{book.author.name}</td>
                <td>{book.publisher.name}</td>
                <td>
                  {/* Eğer 2'den fazla kategori varsa sadece ilk 2'si gösterilir */}
                  {book.categories.length > 2
                    ? `${book.categories.slice(0, 2).map((cat) => cat.name).join(", ")} ve ${book.categories.length - 2} daha`
                    : book.categories.map((cat) => cat.name).join(", ")}
                </td>
                <td>
                  {/* Düzenle ve Sil butonları */}
                  <div className="button-group">
                    <button onClick={() => handleEdit(book)} className="new-button">Düzenle</button>
                    <button onClick={() => openDeleteModal(book.id)} className="delete-button">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
);

}