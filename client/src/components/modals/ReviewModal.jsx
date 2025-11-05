import React, { useState, useEffect } from 'react';

const StarRating = ({ label, onRatingChange }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    setCurrentRating(value);
    onRatingChange(label, value);
  };

  return (
    <div className="rating-group">
      <label>{label}</label>
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((value) => (
          <i
            key={value}
            className={(hoverRating || currentRating) >= value ? 'fa-solid fa-star' : 'fa-regular fa-star'}
            data-value={value}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleClick(value)}
          ></i>
        ))}
      </div>
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, hostelName }) => {
  const [reviewText, setReviewText] = useState('');
  const [ratings, setRatings] = useState({ Security: 0, Hygiene: 0 });

  useEffect(() => {
    if (!isOpen) {
      setReviewText('');
      setRatings({ Security: 0, Hygiene: 0 });
    }
  }, [isOpen]);

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to a backend
    console.log(`Submitting review for ${hostelName}:`, { reviewText, ratings });
    // showToast('Thank you for your review!'); // Placeholder for toast
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content animate-on-scroll">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <h3>Write a Review for <span id="reviewHostelName">{hostelName}</span></h3>
        <p className="muted">Share your experience to help other students.</p>
        <form className="rating-form modal-form" onSubmit={handleSubmit}>
          <StarRating label="Security" onRatingChange={handleRatingChange} />
          <StarRating label="Hygiene" onRatingChange={handleRatingChange} />
          <div className="form-group">
            <label htmlFor="reviewText">Your Review</label>
            <textarea
              id="reviewText"
              placeholder="Share details of your own experience at this hostel..."
              rows="4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn primary full-width">Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;