import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const HostelCard = ({ hostelId, hostel }) => {
  const { isFavorited, toggleFavorite } = useContext(AuthContext);
  const isFav = isFavorited(hostelId);

  // Get the lowest price from rooms array
  const lowestPrice = hostel.rooms && hostel.rooms.length > 0
    ? Math.min(...hostel.rooms.map(room => room.price))
    : 0;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ id: hostelId, ...hostel });
  };

  return (
    <Link to={`/hostel/${hostelId}`} className="product-card-link">
      <article className="product-card">
        <div className="product-image-container">
          <img
            src={hostel.images && hostel.images[0] ? hostel.images[0] : 'https://via.placeholder.com/300x240?text=No+Image'}
            alt={hostel.name}
            className="product-image"
          />
          <button
            className={`favorite-btn ${isFav ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
          </button>
        </div>
        <div className="product-content">
          <h4 className="product-name">{hostel.name}</h4>
          <span className="location-tag">
            <i className="fa-solid fa-map-marker-alt"></i> {hostel.location}
          </span>
          <div className="product-footer">
            <div className="price">
              {lowestPrice > 0 ? (
                <>
                  <span className="price-prefix">From </span>
                  <span className="price-amount">UGX {lowestPrice.toLocaleString()}</span>
                  {hostel.rooms && hostel.rooms.length > 1 && (
                    <span className="price-suffix">/semester</span>
                  )}
                </>
              ) : (
                'Price on request'
              )}
            </div>
            <button className="btn outline">View Details</button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default HostelCard;
