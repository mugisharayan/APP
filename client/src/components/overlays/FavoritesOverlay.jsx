import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';

const FavoritesOverlay = ({ isOpen, onClose }) => {
  const { favorites, toggleFavorite } = useContext(AuthContext);

  const handleRemoveFavorite = (idToRemove) => {
    toggleFavorite({ id: idToRemove }); // Pass a partial object with the ID
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay is-visible" onClick={(e) => e.target.className.includes('cart-overlay') && onClose()}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Your Favorites</h3>
          <button className="close-cart-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-body">
          {favorites.length === 0 ? (
            <p className="cart-empty-message">You haven't added any hostels to your favorites yet.</p>
          ) : (
            favorites.map(item => (
              <div className="cart-item" data-id={item.id} key={item.id}>
                <img src={item.imageSrc} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h5>{item.name}</h5>
                  <p className="cart-item-price">{item.price}</p>
                  <div className="cart-item-actions">
                    <button className="remove-item-btn remove-favorite-btn" onClick={() => handleRemoveFavorite(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <Link to="/hostels" className="btn primary checkout-btn" onClick={onClose}>Explore Hostels</Link>
        </div>
      </div>
    </div>
  );
};

export default FavoritesOverlay;