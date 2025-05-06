// React kütüphanesinden gerekli hook'ları import ediyoruz
import { useState, useEffect } from "react"
// Yayımcı servisi fonksiyonlarını import ediyoruz
import { getPublishers, addPublisher, updatePublisher, deletePublisher } from "../services/publisherService"
// Toast bildirimlerini kullanmak için react-toastify'ı import ediyoruz
import { toast } from "react-toastify"
// Ortak stilleri import ediyoruz
import "../styles/common.css"

// Yayımcı yönetimi için ana bileşeni tanımlıyoruz
export default function PublisherForm() {
  const[loading,setLoading]=useState(true);
  // Yayımcılar listesi için state tanımlıyoruz
  const [publishers, setPublishers] = useState([])
  // Yayımcı adı için state tanımlıyoruz
  const [name, setName] = useState("")
  // Kuruluş yılı için state tanımlıyoruz
  const [establishmentYear, setEstablishmentYear] = useState("")
  // Adres için state tanımlıyoruz
  const [address, setAddress] = useState("")
  // Düzenlenen yayımcı ID'si için state tanımlıyoruz
  const [editingPublisherId, setEditingPublisherId] = useState(null)
  // Form gösterimi için state tanımlıyoruz
  const [showForm, setShowForm] = useState(false)
  // Silme modalı gösterimi için state tanımlıyoruz
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // Düzenleme modalı gösterimi için state tanımlıyoruz
  const [showEditModal, setShowEditModal] = useState(false)
  // Silinecek yayımcı ID'si için state tanımlıyoruz
  const [publisherToDelete, setPublisherToDelete] = useState(null)

  // Bileşen yüklendiğinde yayımcıları yüklüyoruz
  useEffect(() => {
    loadPublishers()
  }, [])

  // Yayımcıları yükleyen fonksiyon
  const loadPublishers = async () => {
    setLoading(true);
    try {
      // Yayımcı servisinden verileri alıyoruz
      const res = await getPublishers()
      // Yayımcıları state'e kaydediyoruz
      setPublishers(res.data)
    } catch (error) {
      // Hatayı konsola yazdırıyoruz
      console.log(error)
      // Hata durumunda bildirim gösteriyoruz
      toast.error("Yayımcılar yüklenemedi!")
    }finally{
      setLoading(false);
    }
  }

  // Form gönderildiğinde çalışan fonksiyon
  const handleSubmit = async (e) => {
    // Formun varsayılan davranışını engelliyoruz
    e.preventDefault()

    // Yayımcı verilerini hazırlıyoruz
    const publisherData = {
      name,
      establishmentYear: Number(establishmentYear),
      address,
    }

    try {
      // Eğer düzenleme modundaysak
      if (editingPublisherId) {
        // Yayımcıyı güncelliyoruz
        await updatePublisher(editingPublisherId, publisherData)
        // Başarı bildirimi gösteriyoruz
        toast.success("Yayımcı güncellendi!")
        // Düzenleme modalını kapatıyoruz
        setShowEditModal(false)
      } else {
        // Yeni yayımcı ekliyoruz
        await addPublisher(publisherData)
        // Başarı bildirimi gösteriyoruz
        toast.success("Yayımcı başarıyla eklendi!")
        // Formu kapatıyoruz
        setShowForm(false)
      }

      // Formu sıfırlıyoruz
      resetForm()
      // Yayımcıları yeniden yüklüyoruz
      loadPublishers()
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error("Bir hata oluştu!")
      // Hata detaylarını konsola yazdırıyoruz
      console.error("Hata Detayı:", error.response?.data || error.message)
    }
  }

  // Formu sıfırlayan fonksiyon
  const resetForm = () => {
    // Yayımcı adını sıfırlıyoruz
    setName("")
    // Kuruluş yılını sıfırlıyoruz
    setEstablishmentYear("")
    // Adresi sıfırlıyoruz
    setAddress("")
    // Düzenlenen yayımcı ID'sini sıfırlıyoruz
    setEditingPublisherId(null)
  }

  // Silme modalını açan fonksiyon
  const openDeleteModal = (id) => {
    // Silinecek yayımcı ID'sini kaydediyoruz
    setPublisherToDelete(id)
    // Silme modalını gösteriyoruz
    setShowDeleteModal(true)
  }

  // Silme işlemini onaylayan fonksiyon
  const confirmDelete = async () => {
    try {
      // Yayımcıyı siliyoruz
      await deletePublisher(publisherToDelete)
      // Başarı bildirimi gösteriyoruz
      toast.success("Yayımcı silindi.")
      // Yayımcıları yeniden yüklüyoruz
      loadPublishers()
    } catch (error) {
      // Hata bildirimi gösteriyoruz
      toast.error("Silme sırasında bir hata oluştu.")
      // Hata detaylarını konsola yazdırıyoruz
      console.error("Silme Hatası:", error.response?.data || error.message)
    } finally {
      // Silme modalını kapatıyoruz
      setShowDeleteModal(false)
      // Silinecek yayımcı ID'sini sıfırlıyoruz
      setPublisherToDelete(null)
    }
  }

  // Silme işlemini iptal eden fonksiyon
  const cancelDelete = () => {
    // Silme modalını kapatıyoruz
    setShowDeleteModal(false)
    // Silinecek yayımcı ID'sini sıfırlıyoruz
    setPublisherToDelete(null)
  }

  // Yayımcı düzenleme işlemini başlatan fonksiyon
  const handleEdit = (publisher) => {
    // Yayımcı adını form alanına yerleştiriyoruz
    setName(publisher.name)
    // Kuruluş yılını form alanına yerleştiriyoruz
    setEstablishmentYear(publisher.establishmentYear)
    // Adresi form alanına yerleştiriyoruz
    setAddress(publisher.address)
    // Düzenlenen yayımcı ID'sini kaydediyoruz
    setEditingPublisherId(publisher.id)
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
        <h2 className="title">Yayımcılar</h2>
        <button
          onClick={() => {
            // Formu sıfırlıyoruz
            resetForm()
            // Form gösterimini değiştiriyoruz
            setShowForm(!showForm)
          }}
          className="new-button"
        >
          {showForm ? "Formu Kapat" : "Yeni Yayımcı Ekle"}
        </button>
      </div>

      {/* Yeni Yayımcı Ekleme Formu */}
      {showForm && (
        <div className="form-wrapper">
          <h3 className="form-subtitle">Yeni Yayımcı Ekleme Formu</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="input-group">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Yayımcı adı"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <input
                  type="number"
                  value={establishmentYear}
                  onChange={(e) => setEstablishmentYear(e.target.value)}
                  required
                  placeholder="Kuruluş Yılı"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Adres"
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

      {/* Yayımcı Düzenleme Modalı */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h3>Yayımcı Düzenle</h3>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                  <div className="input-group">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Yayımcı adı"
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      value={establishmentYear}
                      onChange={(e) => setEstablishmentYear(e.target.value)}
                      required
                      placeholder="Kuruluş Yılı"
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Adres"
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
              <th>Kuruluş Yılı</th>
              <th>Adres</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {/* Yayımcıları listelemek için map fonksiyonu kullanıyoruz */}
            {publishers.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.establishmentYear}</td>
                <td>{item.address}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => handleEdit(item)} className="new-button">
                      Düzenle
                    </button>
                    <button onClick={() => openDeleteModal(item.id)} className="delete-button">
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
              <p>Bu yayımcıyı silmek istediğinize emin misiniz?</p>
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
  )
}
