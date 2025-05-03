// Gerekli kütüphaneler ve bileşenler içe aktarılıyor
import { BrowserRouter as Router, Routes, Route } from "react-router-dom" // React Router ile yönlendirme işlemleri
import Navbar from "./components/Navbar" // Navbar bileşeni
import PublisherForm from "./components/PublisherForm" // Yayımcı formu bileşeni
import CategoryForm from "./components/CategoryForm" // Kategori formu bileşeni
import AuthorForm from "./components/AuthorForm" // Yazar formu bileşeni
import BookForm from "./components/BookForm" // Kitap formu bileşeni
import BorrowForm from "./components/BorrowForm" // Ödünç alma formu bileşeni
import HomePage from "./components/HomePage" // Ana sayfa bileşeni
import { ToastContainer } from "react-toastify" // Kullanıcı bildirimleri için ToastContainer
import "react-toastify/dist/ReactToastify.css" // Toastify için stil dosyasını içe aktar
import "./App.css" // Uygulama genel stil dosyasını içe aktar

function App() {
  return (
    <Router> {/* Router bileşeni, uygulama içinde yönlendirmeleri yönetir */}
      <Navbar /> {/* Navigasyon barını render et */}
      <Routes> {/* Yönlendirme için Routes bileşeni kullanılıyor */}
        <Route path="/" element={<HomePage />} /> {/* Ana sayfa */}
        <Route path="/publishers" element={<PublisherForm />} /> {/* Yayımcı formu sayfası */}
        <Route path="/categories" element={<CategoryForm />} /> {/* Kategori formu sayfası */}
        <Route path="/authors" element={<AuthorForm />} /> {/* Yazar formu sayfası */}
        <Route path="/books" element={<BookForm />} /> {/* Kitap formu sayfası */}
        <Route path="/borrows" element={<BorrowForm />} /> {/* Ödünç alma formu sayfası */}
      </Routes>
      <ToastContainer /> {/* Kullanıcı bildirimlerinin gösterileceği alan */}
    </Router>
  )
}

export default App // App bileşenini dışa aktar
