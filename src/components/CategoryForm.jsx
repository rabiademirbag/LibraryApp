// React kütüphanesinden gerekli hook'ları import ediyoruz
import { useState, useEffect } from "react"
// Kategori servisi fonksiyonlarını import ediyoruz
import { addCategory, getCategories, deleteCategory, updateCategory } from "../services/categoryService"
// Toast bildirimlerini kullanmak için react-toastify'ı import ediyoruz
import { toast } from "react-toastify"
// Ortak stilleri import ediyoruz
import "../styles/common.css"

// Kategori yönetimi için ana bileşeni tanımlıyoruz
export default function CategoryForm() {
  const [loading, setLoading] = useState(true);
  // Kategori adı için state tanımlıyoruz
  const [categoryName, setCategoryName] = useState("")
  // Kategori açıklaması için state tanımlıyoruz
  const [categoryDescription, setCategoryDescription] = useState("")
  // Kategoriler listesi için state tanımlıyoruz
  const [categories, setCategories] = useState([])
  // Düzenlenen kategori ID'si için state tanımlıyoruz
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  // Form gösterimi için state tanımlıyoruz
  const [showForm, setShowForm] = useState(false)
  // Silme modalı gösterimi için state tanımlıyoruz
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // Düzenleme modalı gösterimi için state tanımlıyoruz
  const [showEditModal, setShowEditModal] = useState(false)
  // Silinecek kategori ID'si için state tanımlıyoruz
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  // Bileşen yüklendiğinde kategorileri yüklüyoruz
  useEffect(() => {
    loadCategories()
  }, [])

  // Kategorileri yükleyen fonksiyon
  const loadCategories = async () => {
    setLoading(true);
    try {
      // Kategori servisinden verileri alıyoruz
      const res = await getCategories()
      // Kategorileri state'e kaydediyoruz
      setCategories(res.data)
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error("Kategoriler yüklenemedi!")
      // Hatayı konsola yazdırıyoruz
      console.log(error)
    }finally{
      setLoading(false);
    }
  }

  // Form gönderildiğinde çalışan fonksiyon
  const handleSubmit = async (e) => {
    // Formun varsayılan davranışını engelliyoruz
    e.preventDefault()

    // Kategori verilerini hazırlıyoruz
    const categoryData = {
      name: categoryName,
      description: categoryDescription,
    }

    try {
      // Eğer düzenleme modundaysak
      if (editingCategoryId) {
        // Kategoriyi güncelliyoruz
        await updateCategory(editingCategoryId, categoryData)
        // Başarı bildirimi gösteriyoruz
        toast.success("Kategori güncellendi!")
        // Düzenleme modalını kapatıyoruz
        setShowEditModal(false)
      } else {
        // Yeni kategori ekliyoruz
        await addCategory(categoryData)
        // Başarı bildirimi gösteriyoruz
        toast.success("Kategori başarıyla eklendi!")
        // Formu kapatıyoruz
        setShowForm(false)
      }

      // Formu sıfırlıyoruz
      resetForm()
      // Kategorileri yeniden yüklüyoruz
      loadCategories()
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error("Bir hata oluştu!")
      // Hata detaylarını konsola yazdırıyoruz
      console.error("Hata Detayı:", error.response?.data || error.message)
    }
  }

  // Formu sıfırlayan fonksiyon
  const resetForm = () => {
    // Kategori adını sıfırlıyoruz
    setCategoryName("")
    // Kategori açıklamasını sıfırlıyoruz
    setCategoryDescription("")
    // Düzenlenen kategori ID'sini sıfırlıyoruz
    setEditingCategoryId(null)
  }

  // Silme modalını açan fonksiyon
  const openDeleteModal = (id) => {
    // Silinecek kategori ID'sini kaydediyoruz
    setCategoryToDelete(id)
    // Silme modalını gösteriyoruz
    setShowDeleteModal(true)
  }

  // Kategori silme işlemini gerçekleştiren fonksiyon
  const handleDelete = async () => {
    try {
      // Kategoriyi siliyoruz
      const response = await deleteCategory(categoryToDelete)
      // Sunucudan gelen mesajı alıyoruz
      const serverMessage = response?.data

      // Eğer kategoriye ait kitap varsa
      if (typeof serverMessage === "string" && serverMessage.includes("kitap")) {
        // Hata bildirimi gösteriyoruz
        toast.error("Bu kategoriye ait kayıtlı kitaplar olduğu için silinemez!")
      } else {
        // Başarı bildirimi gösteriyoruz
        toast.success("Kategori silindi.")
        // Kategorileri yeniden yüklüyoruz
        loadCategories()
      }
    } catch (error) {
      // API hatasını konsola yazdırıyoruz
      console.log("API'den dönen hata:", error)
      // Hata bildirimi gösteriyoruz
      toast.error("Silme sırasında bir hata oluştu.")
    } finally {
      // Silme modalını kapatıyoruz
      setShowDeleteModal(false)
      // Silinecek kategori ID'sini sıfırlıyoruz
      setCategoryToDelete(null)
    }
  }

  // Silme işlemini iptal eden fonksiyon
  const cancelDelete = () => {
    // Silme modalını kapatıyoruz
    setShowDeleteModal(false)
    // Silinecek kategori ID'sini sıfırlıyoruz
    setCategoryToDelete(null)
  }

  // Kategori düzenleme işlemini başlatan fonksiyon
  const handleEdit = (category) => {
    // Kategori adını form alanına yerleştiriyoruz
    setCategoryName(category.name)
    // Kategori açıklamasını form alanına yerleştiriyoruz
    setCategoryDescription(category.description)
    // Düzenlenen kategori ID'sini kaydediyoruz
    setEditingCategoryId(category.id)
    // Düzenleme modalını gösteriyoruz
    setShowEditModal(true)
  }

  // Düzenleme modalını kapatan fonksiyon
  const closeEditModal = () => {
    // Düzenleme modalını kapatıyoruz
    setShowEditModal(false)
    // Formu sıfırlıyoruz
    resetForm()
  }

  // Bileşenin görünümünü oluşturuyoruz
  return (
        // Sayfanın ana kapsayıcısı
        <div className="container">
        {loading ? (
        <p>Loading...</p> 
      ) : (
        <>
      <div className="header">
        <h2 className="title">Kategoriler</h2>
        <button
          onClick={() => {
            // Formu sıfırlıyoruz
            resetForm()
            // Form gösterimini değiştiriyoruz
            setShowForm(!showForm)
          }}
          className="new-button"
        >
          {showForm ? "Formu Kapat" : "Yeni Kategori Ekle"}
        </button>
      </div>

      {/* Yeni Kategori Ekleme Formu */}
      {showForm && (
        <div className="form-wrapper">
          <h3 className="form-subtitle">Yeni Kategori Ekleme Formu</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="input-group">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  placeholder="Kategori adı giriniz"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  required
                  placeholder="Kategori açıklaması giriniz"
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="submit-button">
              Ekle
            </button>
          </form>
        </div>
      )}

      {/* Kategori Düzenleme Modalı */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h3>Kategori Düzenle</h3>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                  <div className="input-group">
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      placeholder="Kategori adı giriniz"
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <textarea
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      required
                      placeholder="Kategori açıklaması giriniz"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={closeEditModal} className="cancel-button">
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

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Açıklama</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => handleEdit(cat)} className="new-button">
                      Düzenle
                    </button>
                    <button onClick={() => openDeleteModal(cat.id)} className="delete-button">
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <p>Bu kategoriyi silmek istediğinize emin misiniz?</p>
              <div className="modal-actions">
                <button onClick={cancelDelete} className="cancel-button">
                  İptal
                </button>
                <button onClick={handleDelete} className="confirm-button">
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
  )
}
