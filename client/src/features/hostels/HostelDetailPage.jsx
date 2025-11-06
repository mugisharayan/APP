import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import hostelData from '../../data/hostels';
import { AuthContext } from '../auth/AuthContext';

const HostelDetailPage = ({ onOpenAuthModal }) => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const hostel = hostelData[hostelId];

  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (hostel) {
      const favorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];
      setIsFavorited(favorites.some(item => item.id === hostelId));
    }
  }, [hostelId, hostel]);

  // Animation on scroll logic (simplified for React)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  if (!hostel) {
    return (
      <main className="hostel-detail-page new-design">
        <div className="container">
          <h1>Hostel not found</h1>
          <p>The hostel you are looking for does not exist or the link is incorrect.</p>
          <Link to="/hostels" className="btn primary">Back to Hostels</Link>
        </div>
      </main>
    );
  }

  const handleToggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];
    const lowestPrice = hostel.rooms.reduce((min, room) => (room.price < min ? room.price : min), Infinity);
    const defaultImage = (hostel.images && hostel.images.length > 0) ? hostel.images[0] : 'https://via.placeholder.com/300x200.png?text=No+Image';

    if (isFavorited) {
      favorites = favorites.filter(item => item.id !== hostelId);
      // showToast(`${hostel.name} removed from favorites.`);
    } else {
      favorites.push({
        id: hostelId,
        name: hostel.name,
        price: `UGX ${lowestPrice.toLocaleString()}`,
        imageSrc: defaultImage,
      });
      // showToast(`${hostel.name} added to favorites!`);
    }
    localStorage.setItem('bookMyHostelFavorites', JSON.stringify(favorites));
    setIsFavorited(!isFavorited);
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const showPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length);
  };

  const handleBookNow = (room) => {
    if (isAuthenticated) {
      const params = new URLSearchParams({
        hostel: hostel.name,
        room: room.name,
        price: room.price,
        image: hostel.images[0],
      });
      navigate(`/booking?${params.toString()}`);
    } else {
      // If not logged in, open the authentication modal
      onOpenAuthModal();
    }
  };


  
  return (
    <>
      <main className="hostel-detail-page new-design">
        <div className="container">
          <header className="new-detail-header">
            <div className="new-header-left">
              <h1 data-hostel-id={hostelId}>{hostel.name}</h1>
              <div className="meta-info">
                <span><i className="fa-solid fa-star"></i> 4.0 (125 reviews)</span>
                <span className="separator-dot">·</span>
                <span><i className="fa-solid fa-map-marker-alt"></i> {hostel.location}, Makerere</span>
              </div>
            </div>
            <div className="new-header-actions">
              <button className={`btn outline small ${isFavorited ? 'active' : ''}`} onClick={handleToggleFavorite} id="detailFavoriteBtn">
                <i className={isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i> {isFavorited ? 'Favorited' : 'Favorite'}
              </button>
              <Link to="/hostels" className="back-btn">Back to Hostels</Link>
            </div>
          </header>

        <section className="hero-section animate-on-scroll">
          <div className="hero-image-placeholder" id="heroImage" onClick={() => openLightbox(0)}>
            <img src={hostel.images[0]} alt={`Main view of ${hostel.name}`} />
          </div>
          <div className="image-gallery" id="thumbnailGallery">
            {hostel.images.map((imgSrc, index) => (
              <div className="gallery-image" key={index} onClick={() => openLightbox(index)}>
                <img src={imgSrc} alt={`Thumbnail of ${hostel.name}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="about-section animate-on-scroll" style={{ transitionDelay: '100ms' }}>
          <h2>ABOUT</h2>
          <p className="about-text">{hostel.description || `${hostel.name} is a quality hostel located in ${hostel.location}, offering comfortable accommodation for students near Makerere University. Contact us at ${hostel.contact} for more information about our facilities and room options.`}</p>
        </section>

        <section className="amenities-section animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          <h2>AMENITIES</h2>
          <div className="amenity-list" id="amenitiesList">
            {hostel.amenities.map((amenity, index) => (
              <div className="amenity-box" key={index}>
                <i className={`fa-solid ${amenity.icon}`}></i>
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-section animate-on-scroll" style={{ transitionDelay: '300ms' }}>
          <h2>CHOOSE YOUR ROOM</h2>
          <div className="pricing-grid" id="roomOptionsList">
            {hostel.rooms.map((room, index) => (
              <div className="pricing-card" key={index}>
                <i className={`fa-solid ${room.icon || 'fa-bed'} pricing-icon`}></i>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <div className="pricing-card-price">
                  <strong>UGX {room.price.toLocaleString()}</strong>
                  <span>/ semester</span>
                </div>
                <button className="btn primary full-width" onClick={() => handleBookNow(room)}>
                  Book This Room
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="location-section animate-on-scroll" style={{ transitionDelay: '100ms' }}>
          <div className="location-header">
            <h2>LOCATION ON MAP</h2>
            <p>Get a feel for the area and your daily commute.</p>
          </div>
          <div className="map-placeholder">
            <iframe
              id="mapFrame"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.75342939951!2d32.56619241475336!3d0.3339234997695831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb6304295555%3A0x48315151187363d2!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1678186439001!5m2!1sen!2sug"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <section className="review-action-section animate-on-scroll" style={{ transitionDelay: '400ms' }}>
          <h2>RATINGS AND REVIEWS</h2>
          <div className="review-box">
            <div className="review-summary-col">
              <div className="review-summary">
                <div className="summary-total">
                  <div className="total-rating">4.0</div>
                  <div className="total-stars">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-regular fa-star"></i>
                  </div>
                  <div className="total-reviews">125 reviews</div>
                </div>
                <div className="summary-bars">
                  <div className="bar-item"><span>5 Star</span><div className="bar-container"><div className="bar" style={{ width: '70%' }}></div></div><span>70%</span></div>
                  <div className="bar-item"><span>4 Star</span><div className="bar-container"><div className="bar" style={{ width: '15%' }}></div></div><span>15%</span></div>
                  <div className="bar-item"><span>3 Star</span><div className="bar-container"><div className="bar" style={{ width: '10%' }}></div></div><span>10%</span></div>
                  <div className="bar-item"><span>2 Star</span><div className="bar-container"><div className="bar" style={{ width: '3%' }}></div></div><span>3%</span></div>
                  <div className="bar-item"><span>1 Star</span><div className="bar-container"><div className="bar" style={{ width: '2%' }}></div></div><span>2%</span></div>
                </div>
              </div>
            </div>
            <div className="reviews-list-col">
              {/* Sample Review 1 */}
              <article className="review-card">
                <div className="review-card-header">
                  <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Reviewer avatar" />
                  <div className="review-author-info">
                    <h5>Sarah K.</h5>
                    <small>Reviewed on 15 Jul, 2024</small>
                  </div>
                  <div className="review-stars">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-regular fa-star"></i>
                  </div>
                </div>
                <p className="review-text">"Great location, very close to the university gate. The rooms are clean and the Wi-Fi is surprisingly reliable. Would recommend!"</p>
              </article>
              {/* Sample Review 2 */}
              <article className="review-card">
                <div className="review-card-header">
                  <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Reviewer avatar" />
                  <div className="review-author-info">
                    <h5>David O.</h5>
                    <small>Reviewed on 02 Jun, 2024</small>
                  </div>
                  <div className="review-stars">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <p className="review-text">"The security is top-notch, which was my main concern. The custodian is very responsive to any issues. It's a quiet environment, perfect for studying."</p>
              </article>
            </div>
          </div>

          <div className="action-buttons">
            <a href={`tel:${hostel.contact}`} className="contact-btn" id="contactBtn">CONTACT {hostel.contact}</a>
          </div>
        </section>
        </div>
      </main>

      {/* IMAGE LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="lightbox-overlay is-visible" id="lightboxOverlay" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox}>&times;</button>
          <button className="lightbox-nav-btn prev" onClick={(e) => { e.stopPropagation(); showPrevImage(); }}><i className="fa-solid fa-chevron-left"></i></button>
          <div className="lightbox-content">
            <img src={hostel.images[currentImageIndex]} alt="Lightbox image" id="lightboxImage" />
          </div>
          <button className="lightbox-nav-btn next" onClick={(e) => { e.stopPropagation(); showNextImage(); }}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      )}
    </>
  );
};

export default HostelDetailPage;