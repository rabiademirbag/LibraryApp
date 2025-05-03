// React Router'dan NavLink bileşeni import edilir, sayfa geçişleri için kullanılır
import { NavLink } from "react-router-dom";

// Navbar'a ait stiller içeren CSS dosyası import edilir
import './Navbar.css';

// Navbar bileşeni dışa aktarılır
export default function Navbar() {

  // isActive durumuna göre bağlantıya sınıf atanır
  // Aktifse "active-link", değilse "inactive-link" sınıfı verilir
  const navLinkClass = ({ isActive }) =>
    isActive ? "active-link" : "inactive-link";

  // Navbar bileşeninin JSX yapısı
  return (
    // Ana navbar etiketi, üst sınıf
    <nav className="navbar">
      {/* İçerikleri ortalamak ve hizalamak için kapsayıcı div */}
      <div className="navbar-container">
        {/* Uygulama adı ya da markası */}
        <span className="navbar-brand">KitapYönetim</span>

        {/* Her biri bir sayfaya yönlendiren nav linkleri */}
        <NavLink to="/" className={navLinkClass}>
          Giriş
        </NavLink>
        <NavLink to="/publishers" className={navLinkClass}>
          Yayımcı
        </NavLink>
        <NavLink to="/categories" className={navLinkClass}>
          Kategori
        </NavLink>
        <NavLink to="/authors" className={navLinkClass}>
          Yazar
        </NavLink>
        <NavLink to="/books" className={navLinkClass}>
          Kitap
        </NavLink>
        <NavLink to="/borrows" className={navLinkClass}>
          Kitap Alma
        </NavLink>
      </div>
    </nav>
  );
}
