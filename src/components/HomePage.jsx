import { Link } from "react-router-dom"

// book iconu
const Book = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
)
//users iconu
const Users = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
//bookopen iconu
const BookOpen = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)
//bookmark iconu
const Bookmark = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
)
//building iconu
const Building = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)
//chevronright iconu
const ChevronRight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

// Ana sayfa bileşeni tanımı
const HomePage = () => {
  // Bileşenin render edilecek JSX'ini döndür
  return (
    // Ana container div'i
    <div className="home-container">
      {/* Hero bölümü container'ı*/}
      <div className="hero-section">
        {/* Hero içerik alanı*/}
        <div className="hero-content">
          {/*// Başlık*/}
          <h1 className="hero-title">Kütüphane Yönetim Sistemi</h1>
          {/* Açıklama metni*/}
          <p className="hero-description">
            Modern ve kullanımı kolay arayüzümüzle kütüphanenizi verimli bir şekilde yönetin. Kitaplar, yazarlar,
            kategoriler ve ödünç işlemlerini tek bir yerden takip edin.
          </p>
          {/* Butonlar container'ı*/}
          <div className="hero-buttons">
            {/* Birincil buton - Kitaplar sayfasına link*/}
            <Link to="/books" className="primary-button">
              {/* Buton metni*/}
              Kitapları Yönet
              {/* Sağ ok ikonu*/}
              <ChevronRight size={18} />
            </Link>
            {/* İkincil buton - Ödünç sayfasına link*/}
            <Link to="/borrows" className="secondary-button">
              {/* Buton metni*/}
              Ödünç İşlemleri
              {/* Sağ ok ikonu*/}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
        {/* Hero resim alanı*/}
        <div className="hero-image">
          {/* Hero resmi*/}
          <img
            // Resim URL'si
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop"
            // Alternatif metin
            alt="Kütüphane Yönetim Sistemi"
          />
        </div>
      </div>

      {/*Özellikler bölümü container'ı*/}
      <div className="features-section">
        {/*Özellikler başlığı*/}
        <h2 className="features-title">Özellikler</h2>
        {/*Özellik kartları grid container'ı*/}
        <div className="features-grid">
          {/*Kitap yönetimi özellik kartı*/}
          <div className="feature-card">
            {/*Kart ikon alanı*/}
            <div className="feature-icon">
              {/*Kitap ikonu*/}
              <Book size={32} />
            </div>
            {/*Kart başlığı*/}
            <h3>Kitap Yönetimi</h3>
            {/*Kart açıklaması*/}
            <p>Kitap envanterinizi kolayca ekleyin, düzenleyin ve takip edin.</p>
            {/* Kart link butonu*/}
            <Link to="/books" className="feature-link">
              {/*Link metni*/}
              Kitaplara Git 
              {/*Sağ ok ikonu*/}
              <ChevronRight size={16} />
            </Link>
          </div>

          {/*Yazar yönetimi özellik kartı*/}
          <div className="feature-card">
            <div className="feature-icon">
              {/*Kullanıcılar ikonu*/}
              <Users size={32} />
            </div>
            <h3>Yazar Yönetimi</h3>
            <p>Yazarları düzenleyin ve kitaplarla ilişkilendirin.</p>
            <Link to="/authors" className="feature-link">
              Yazarlara Git <ChevronRight size={16} />
            </Link>
          </div>

          {/*Kategori yönetimi özellik kartı*/}
          <div className="feature-card">
            <div className="feature-icon">
              {/*Yer imi ikonu*/}
              <Bookmark size={32} />
            </div>
            <h3>Kategori Yönetimi</h3>
            <p>Kitapları kategorilere ayırarak düzenli bir sistem oluşturun.</p>
            <Link to="/categories" className="feature-link">
              Kategorilere Git <ChevronRight size={16} />
            </Link>
          </div>

          {/*Yayınevi yönetimi özellik kartı*/}
          <div className="feature-card">
            <div className="feature-icon">
              {/*Bina ikonu*/}
              <Building size={32} />
            </div>
            <h3>Yayınevi Yönetimi</h3>
            <p>Yayınevlerini takip edin ve kitaplarla ilişkilendirin.</p>
            <Link to="/publishers" className="feature-link">
              Yayınevlerine Git <ChevronRight size={16} />
            </Link>
          </div>

          {/*Ödünç işlemleri özellik kartı*/}
          <div className="feature-card">
            <div className="feature-icon">
              {/*Açık kitap ikonu*/}
              <BookOpen size={32} />
            </div>
            <h3>Ödünç İşlemleri</h3>
            <p>Kitap ödünç verme ve iade işlemlerini kolayca yönetin.</p>
            <Link to="/borrows" className="feature-link">
              Ödünç İşlemlerine Git <ChevronRight size={16} />
            </Link>
          </div>

          {/*Hemen başla CTA kartı*/}
          <div className="feature-card">
            <div className="feature-card-cta">
              <h3>Hemen Başlayın</h3>
              <p>Kütüphane yönetim sisteminizi kullanmaya hemen başlayın.</p>
              <Link to="/books" className="primary-button">
                Başla <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/*Footer bölümü*/}
      <footer className="home-footer">
        {/*Copyright metni - mevcut yıl dinamik olarak alınıyor */}
        <p>© {new Date().getFullYear()} Kütüphane Yönetim Sistemi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

// Ana sayfa bileşenini dışa aktar
export default HomePage