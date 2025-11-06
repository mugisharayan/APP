# Hostel Booking System

A modern web application for Makerere University students to browse, compare, and book hostel accommodations near campus. The system features role-based access for both students and hostel custodians.

## Features

### For Students
- 🏠 Browse 40+ verified hostels in the Kikoni area
- 🔍 Advanced filtering (location, price, amenities)
- ⭐ Save favorite hostels
- 📅 Book rooms with date range selection
- 💳 Secure payment processing
- 📊 Dashboard with booking history
- 🔧 Submit maintenance requests
- ✍️ Write and view hostel reviews
- 👤 Profile management

### For Custodians (Hostel Managers)
- 📈 Analytics dashboard with occupancy/revenue charts
- 🏢 Room management and assignment (drag-and-drop)
- 💰 Payment tracking and management
- 👥 Student records management
- 🔧 Maintenance request handling
- 📜 Audit logs for tracking changes
- 👤 Profile management

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Vite 7** - Build tool and dev server
- **Chart.js** - Analytics visualizations
- **@hello-pangea/dnd** - Drag-and-drop functionality
- **Litepicker** - Date range picker
- **jsPDF + html2canvas** - PDF generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling (ODM) library
- **JWT (JSON Web Tokens)** - For secure authentication

## Architecture
- **Full-Stack Application** with a React frontend and a Node.js/Express backend
- **REST API** for communication between the client and server
- **MongoDB Atlas** for cloud database storage with 40+ hostel records
- **React Context API** for frontend state management
- **Mobile-first responsive design** for all devices
- Feature-based code organization

## Project Structure

```
hostel-booking-system/
├── client/                      # Frontend application
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main app component with routing
│   ├── index.html               # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── package.json            # Dependencies & scripts
│   │
│   ├── src/                    # Source code
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/          # Authentication (login, context, protected routes)
│   │   │   ├── home/          # Landing page
│   │   │   ├── hostels/       # Hostel browsing & details
│   │   │   ├── booking/       # Booking & payment flow
│   │   │   ├── dashboard/     # Student dashboard & profile
│   │   │   ├── custodian/     # Custodian management features
│   │   │   └── about/         # About page
│   │   │
│   │   ├── components/        # Shared UI components
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── modals/        # Modal dialogs
│   │   │   └── overlays/      # Overlays (favorites, toasts)
│   │   │
│   │   ├── data/              # Static data
│   │   │   └── hostels.js    # Hostel information (40+ hostels)
│   │   │
│   │   ├── service/           # API service layer
│   │   │   ├── api.service.js # HTTP client configuration
│   │   │   ├── auth.service.js# Authentication API calls
│   │   │   └── user.service.js# User-related API calls
│   │   │
│   │   ├── styles/            # CSS stylesheets
│   │   │   ├── style.css     # Main stylesheet
│   │   │   └── mobile-fixes.css # Mobile responsiveness
│   │   │
│   │   ├── hooks/             # Custom React hooks
│   │   └── assets/            # Static assets (images)
│   │
│   └── public/                # Public static files
│
├── server/                    # Backend API
│   ├── controllers/           # Route handlers
│   │   ├── hostel.controller.js
│   │   ├── booking.controller.js
│   │   ├── user.controller.js
│   │   ├── payment.controller.js
│   │   └── maintenance.controller.js
│   │
│   ├── models/                # MongoDB schemas
│   │   ├── hostel.model.js
│   │   ├── booking.model.js
│   │   ├── user.model.js
│   │   ├── payment.model.js
│   │   └── review.model.js
│   │
│   ├── routes/                # API routes
│   │   ├── hostel.routes.js
│   │   ├── booking.routes.js
│   │   ├── user.routes.js
│   │   ├── payment.routes.js
│   │   └── maintenance.routes.js
│   │
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── admin.middleware.js
│   │
│   ├── config/               # Configuration
│   │   └── db.js            # MongoDB connection
│   │
│   ├── scripts/              # Database migration scripts
│   │   ├── migrateHostels.js
│   │   └── migrateAllHostels.js
│   │
│   ├── utils/                # Utility functions
│   │   └── generateToken.js
│   │
│   ├── .env                  # Environment variables
│   ├── package.json          # Server dependencies
│   └── server.js             # Express server entry point
│
├── package.json               # Root package (delegates to client/)
├── eslint.config.js          # ESLint configuration
├── README.md                 # This file
└── CLAUDE.md                 # Developer guide for Claude Code
```

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (for database)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hostel-booking-system

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Setup

1. Create `.env` file in the `server/` directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

2. **Database Setup:**
```bash
# Navigate to server directory
cd server

# Run migration to populate database with hostel data
node scripts/migrateAllHostels.js
```

### Running the Application

**Development Mode (Recommended):**
```bash
# Terminal 1: Start the backend server
cd server
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: Start the frontend
cd client
npm run dev
# Client runs on http://localhost:5173
```

**Production Mode:**
```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

### Available Commands

From the **root directory**:
```bash
npm start          # Start development server
npm run dev        # Start development server (alias)
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
npm install        # Install dependencies
```

From the **client directory**:
```bash
npm start          # Start development server
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Development Workflow

### For Beginners

1. **Find a feature**: Navigate to `client/src/features/` and find the feature folder
2. **Make changes**: Edit the component files
3. **See changes**: Vite's HMR will automatically reload the page
4. **Test**: Browse the app at localhost:5173

### Adding a New Feature

1. Create a new folder in `client/src/features/my-feature/`
2. Add your components (e.g., `MyFeaturePage.jsx`)
3. Update `client/App.jsx` to add routing:
   ```javascript
   import MyFeaturePage from './src/features/my-feature/MyFeaturePage';

   // Add route
   <Route path="/my-feature" element={<MyFeaturePage />} />
   ```

### File Organization

**Feature-based structure** - Each feature has its own folder:
- `auth/` - Everything authentication-related
- `hostels/` - Hostel browsing, details, and cards
- `booking/` - Booking and payment pages
- `dashboard/` - Student dashboard pages
- `custodian/` - Custodian management pages

**Shared components** go in `client/src/components/`:
- `layout/` - Headers, footers, sidebars
- `modals/` - Modal dialogs
- `overlays/` - Floating UI elements

## User Roles & Authentication

### Mock Authentication

Currently uses simulated authentication with two roles:

1. **Student** - Access to:
   - `/dashboard` - Student dashboard
   - `/my-bookings` - Booking history
   - `/maintenance` - Maintenance requests
   - `/profile` - Profile management

2. **Custodian** - Access to:
   - `/custodian-dashboard` - Overview & analytics
   - `/custodian-payment-management` - Payments
   - `/custodian-room-assignment` - Room assignments
   - `/custodian-room-management` - Room CRUD
   - `/custodian-students` - Student management
   - And more custodian features...

### How Authentication Works

- Auth state managed by `AuthContext` (`client/src/features/auth/AuthContext.jsx`)
- Data stored in localStorage:
  - `userProfile` - User info including role
  - `bookingHistory` - Booking records
  - `bookMyHostelFavorites` - Favorited hostels
- `ProtectedRoute` component enforces role-based access
- Auto-redirects based on auth status and role

## Building for Production

```bash
# From root
npm run build

# From client
cd client && npm run build
```

Production files are output to `client/dist/`

## Future Enhancements

### Planned Backend Integration
When adding a backend, the structure will be:
```
hostel-booking-system/
├── client/        # Frontend (this)
└── server/        # Backend API (future)
```

### Recent Updates
- [x] **Full-Stack Implementation** - Added Node.js/Express backend with MongoDB
- [x] **Database Integration** - 40+ hostels migrated to MongoDB Atlas
- [x] **API Development** - RESTful API with authentication middleware
- [x] **Mobile Responsiveness** - Optimized for iPhone, Samsung, and tablets
- [x] **Data Migration Scripts** - Automated hostel data migration tools

### Todo
- [ ] Implement real authentication & authorization with JWT
- [ ] Add real payment gateway integration (Stripe/PayPal)
- [ ] Add email notifications for bookings
- [ ] Implement advanced search with filters on backend
- [ ] Add admin panel for system management
- [ ] Add image upload functionality
- [ ] Implement real-time notifications

## Contributing

This is a school project for Makerere University students. If you're working on this:

1. **Understand the structure** - Read `CLAUDE.md` for detailed architecture
2. **Follow conventions** - Feature-based organization, clear naming
3. **Test your changes** - Make sure the app runs without errors
4. **Document** - Add comments for complex logic

## Support & Documentation

- **CLAUDE.md** - Comprehensive developer guide
- **Code comments** - Check individual files for inline documentation
- **Feature folders** - Each feature is self-contained and documented

## License

This project is for educational purposes at Makerere University.

---

**Built with ❤️ for Makerere University Students**
