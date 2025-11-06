import React, { useState, useMemo, useEffect } from 'react';
import HostelCard from './HostelCard';
import hostelData from '../../data/hostels';
import '../../styles/hostel-card.css';
import '../../styles/redesigned-hostels.css';

const HostelsPage = () => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: 'all',
    college: 'all',
    maxPrice: 2000000,
    amenities: [],
  });
  const [visibleHostelCount, setVisibleHostelCount] = useState(12);

  // Animation on scroll logic
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

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
    setVisibleHostelCount(12); // Reset visible count on filter change
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    setVisibleHostelCount(12); // Reset visible count on filter change
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
    setVisibleHostelCount(12); // Reset visible count on filter change
  };

  const filteredHostels = useMemo(() => {
    return Object.entries(hostelData).filter(([, hostel]) => {
      const lowestPrice = hostel.rooms.reduce((min, room) => (room.price < min ? room.price : min), Infinity);
      const nameMatch = hostel.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const locationMatch = filters.location === 'all' || hostel.location.toLowerCase().replace(/ /g, '-') === filters.location;
      const priceMatch = lowestPrice <= filters.maxPrice;
      const amenitiesMatch = filters.amenities.every(filterAmenity =>
        hostel.amenities.some(hostelAmenity => hostelAmenity.name.toLowerCase().replace(/ /g, '-') === filterAmenity)
      );

      return nameMatch && locationMatch && priceMatch && amenitiesMatch;
    });
  }, [filters]);

  const hostelsToDisplay = filteredHostels.slice(0, visibleHostelCount);

  const handleLoadMore = () => {
    setVisibleHostelCount(prev => prev + 12);
  };

  return (
    <div className="hostels-page">

      
      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="products-page-layout">
          <aside className="products-sidebar">
            <div className="sidebar-section">
              <h3>Location</h3>
              <div className="select-wrapper">
                <i className="fa-solid fa-map-marker-alt"></i>
                <select id="location" className="sidebar-select" value={filters.location} onChange={handleFilterChange}>
                  <option value="all">All Locations</option>
                  <option value="kikoni">Kikoni</option>
                  <option value="wandegeya">Wandegeya</option>
                  <option value="kikumi-kikumi">Kikumi Kikumi</option>
                  <option value="mulago">Mulago</option>
                  <option value="ldc">LDC</option>
                </select>
              </div>
            </div>
            <div className="sidebar-section">
              <h3>Filter by College</h3>
              <div className="select-wrapper">
                <i className="fa-solid fa-graduation-cap"></i>
                <select id="college" className="sidebar-select" value={filters.college} onChange={handleFilterChange}>
                  <option value="all">All Colleges</option>
                  <option value="cocis">CoCIS</option>
                  <option value="cobams">CoBAMS</option>
                  <option value="cedat">CEDAT</option>
                  <option value="chuss">CHUSS</option>
                  <option value="conas">CoNAS</option>
                  <option value="caes">CAES</option>
                  <option value="cees">CEES</option>
                  <option value="chs">CHS</option>
                  <option value="covab">CoVAB</option>
                  <option value="sol">School of Law</option>
                </select>
              </div>
            </div>
            <div className="sidebar-section">
              <h3>Filter by Price</h3>
              <div className="price-filter">
                <input type="range" id="maxPrice" min="500000" max="2000000" step="100000" value={filters.maxPrice} onChange={handleFilterChange} />
                <div className="price-value">Up to <span id="priceValue">UGX {filters.maxPrice.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="sidebar-section">
              <h3>Filter by Amenities</h3>
              <div className="amenities-filter">
                {['shuttle', 'wifi', 'single-room', 'kitchen', 'laundry'].map(amenity => (
                  <button
                    key={amenity}
                    className={`amenity-tag ${filters.amenities.includes(amenity) ? 'active' : ''}`}
                    onClick={() => handleAmenityToggle(amenity)}
                    data-amenity={amenity}
                  >
                    {amenity.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div className="products-main-content">
            <div className="page-header">
              <h3>Find Your <span className="accent">Perfect Hostel</span></h3>
              <p className="muted">Search, filter, and compare all available hostels near Makerere University.</p>
              <div className="search-wrapper">
                <input type="search" className="sidebar-search" placeholder="Search by hostel name..." value={filters.searchTerm} onChange={handleSearchChange} />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>

            {/* HOSTELS GRID */}
            <section className="products" id="products">
              {hostelsToDisplay.length === 0 && (
                <div className="no-results-message" id="noResultsMessage">
                  <i className="fa-solid fa-search"></i>
                  <h4>No Hostels Found</h4>
                  <p>Try adjusting your search or filter criteria to find what you're looking for.</p>
                </div>
              )}

              <div className="product-grid">
                {hostelsToDisplay.map(([id, hostel]) => (
                  <HostelCard key={id} hostelId={id} hostel={hostel} />
                ))}
              </div>
              {filteredHostels.length > hostelsToDisplay.length && (
                <div className="load-more-container">
                  <button className="modern-load-more-btn" onClick={handleLoadMore}>
                    <span className="btn-text">Load More Hostels</span>
                    <div className="btn-icon">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="btn-count">{filteredHostels.length - hostelsToDisplay.length} more</div>
                  </button>
                </div>
              )}
            </section>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostelsPage;