# SpotCheck - Real-time Campus Study Space Availability Tracker

![SpotCheck Banner](./screenshots/banner.png)
*Add your actual screenshot here after deployment*

---

## 📚 Project Information

**Course:** CS 5610 - Web Development  
**Institution:** Northeastern University  
**Semester:** Spring 2026  
**Class Link:** [CS 5610 Canvas](https://northeastern.instructure.com/courses/your-course-id)

---

## 👥 Team Members

- **Rachit Patel** - Implementing Spaces & Check-ins collections with full CRUD
- **Prajakta Avachat** - Implementing Users & Favorites collections with full CRUD

---

## 🎯 Project Objective

Students waste 15-30 minutes daily walking across campus searching for available study spots, especially during midterms and finals when libraries are packed. **SpotCheck** solves this problem by crowdsourcing real-time occupancy data through user check-ins, showing live availability before students leave their location.

Our system provides color-coded availability indicators (e.g., "12/30 seats occupied") updated in real-time as students check in and out. Students can filter spaces by amenities (outlets, WiFi, whiteboards), category, and building location, plus save their favorites for quick access—eliminating wasted trips across campus.

---

## ✨ Key Features

### Core Functionality
- 🔴🟡🟢 **Real-time Occupancy Tracking** - Live updates with color-coded availability
- 📍 **Space Discovery** - Browse all campus study spaces with photos and details
- 🔍 **Advanced Filtering** - Filter by amenities, category, and building location
- ⭐ **Favorites System** - Save frequently used spaces for quick access
- ✅ **Check-in/Check-out** - Crowdsourced occupancy updates from users
- 👤 **User Profiles** - Personalized experience with study history

### For Students
- Find available study spaces before leaving their location
- Discover new spaces they didn't know existed
- Filter by specific needs (outlets, quiet zones, whiteboards)
- Track study habits and check-in history

### For Administrators
- Add, edit, and delete study spaces
- Monitor real-time campus space utilization
- Maintain accurate space information

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js (v18.19.0+)
- **Framework:** Express.js
- **Database:** MongoDB (Native Driver - NO Mongoose)
- **Authentication:** JWT with Passport.js
- **Password Hashing:** bcrypt

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modular stylesheets
- **Vanilla JavaScript** - Client-side rendering (NO frameworks)
- **ES6 Modules** - Code organization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **dotenv** - Environment configuration

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18.19.0 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/PatelRachit/web-dev-project-2.git
cd web-dev-project-2
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/spotcheck
DB_NAME=spotcheck
PORT=5000
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

**Important:** Never commit the `.env` file to Git!

### Step 4: Start the Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Step 5: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🗂️ Project Structure

```
web-dev-project-2/
├── src/
│   ├── config/
│   │   ├── mongo.js              # MongoDB connection
│   │   └── passport.js           # Passport JWT strategy
│   ├── controller/
│   │   ├── admin/                # Admin controllers
│   │   ├── auth/                 # Authentication controllers
│   │   ├── checkins/             # Check-in/out controllers
│   │   ├── favorites/            # Favorites controllers
│   │   ├── spaces/               # Spaces controllers
│   │   └── user/                 # User controllers
│   ├── middleware/
│   │   └── auth/                 # Authentication middleware
│   ├── models/
│   │   ├── checkins.js           # Check-ins database operations
│   │   ├── favorites.js          # Favorites database operations
│   │   ├── spaces.js             # Spaces database operations
│   │   └── user.js               # User database operations
│   ├── routes/
│   │   ├── admin.js              # Admin routes
│   │   ├── auth.js               # Auth routes
│   │   ├── checkins.js           # Check-in routes
│   │   ├── favorites.js          # Favorites routes
│   │   ├── spaces.js             # Spaces routes
│   │   ├── user.js               # User routes
│   │   └── index.js              # Main router
│   ├── utils/                    # Utility functions
│   └── server.js                 # Express server entry point
├── public/                       # Frontend static files
│   ├── css/                      # Stylesheets
│   ├── js/                       # JavaScript modules
│   └── images/                   # Images and assets
├── .env                          # Environment variables (not in Git)
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Prettier configuration
├── eslint.config.mjs             # ESLint configuration
├── package.json                  # Project dependencies
├── DESIGN_DOCUMENT.md            # Complete design documentation
└── README.md                     # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /token` - Verify JWT token

### Spaces (Rachit's Implementation)
- `GET /api/spaces` - Get all spaces (with filters)
- `GET /api/spaces/:id` - Get space details
- `POST /api/spaces` - Create new space (Admin)
- `PUT /api/spaces/:id` - Update space (Admin)
- `DELETE /api/spaces/:id` - Delete space (Admin)

### Check-ins (Rachit's Implementation)
- `POST /api/checkins/checkin` - Check in to a space
- `POST /api/checkins/checkout` - Check out from current space
- `GET /api/checkins/active` - Get active check-in
- `GET /api/checkins/my-checkins` - Get user's check-in history
- `GET /api/checkins/space/:spaceId` - Get check-ins for a space

### Favorites (Prajakta's Implementation)
- `POST /api/favorites/add` - Add space to favorites
- `DELETE /api/favorites/remove/:spaceId` - Remove from favorites
- `GET /api/favorites` - Get all favorite spaces

### Users (Prajakta's Implementation)
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/stats` - Get user statistics

---

## 🗄️ Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  major: String,
  graduationYear: String,
  favourites: [ObjectId],           // References to spaces
  currentlyStudyingAt: ObjectId,    // Reference to current space
  totalCheckIns: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Spaces Collection
```javascript
{
  _id: ObjectId,
  name: String,
  building: String,
  location: String,
  category: String,                 // library, cafe, lounge, etc.
  capacity: Number,
  currentOccupancy: Number,
  amenities: [String],              // outlets, wifi, whiteboards, etc.
  hours: {
    weekday: String,
    weekend: String
  },
  description: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Check-ins Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to user
  spaceId: ObjectId,                // Reference to space
  checkInTime: Date,
  checkOutTime: Date,
  isActive: Boolean,
  duration: Number                  // milliseconds
}
```

---

## 🧪 Testing

### Run ESLint
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

### Format Code with Prettier
```bash
npm run format
```

### Run All Checks
```bash
npm run fix
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Main dashboard showing available study spaces with real-time occupancy*

### Space Details
![Space Details](./screenshots/space-details.png)
*Detailed view of a study space with amenities and check-in option*

### Favorites
![Favorites](./screenshots/favorites.png)
*User's favorite spaces with quick access*

### Mobile View
![Mobile View](./screenshots/mobile.png)
*Responsive design for mobile devices*

---

## 🚀 Deployment

The application is deployed at: **[Your Deployment URL]**

### Deployment Steps
1. Set up MongoDB Atlas production database
2. Configure environment variables on hosting platform
3. Deploy backend to Render/Railway/Heroku
4. Deploy frontend as static files
5. Update CORS settings for production URL

---

## 👨‍💻 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Code Standards
- ES6+ JavaScript
- ESLint configuration enforced
- Prettier formatting required
- Modular CSS organization
- Native MongoDB driver (NO Mongoose)
- Client-side rendering with vanilla JS

### Commit Message Format
```
type(scope): subject

- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructuring
- test: adding tests
- chore: maintenance

Example: feat(spaces): add filter by amenities
```

---

## 🐛 Known Issues & Limitations

- Auto-logout after 12 hours of inactivity (planned feature)
- Real-time updates require manual page refresh
- Limited to 1000 concurrent users on free tier

---

## 🔮 Future Enhancements

### Phase 2
- Push notifications for favorite space availability
- Space reservation system (1-hour slots)
- Study group formation and coordination
- Building floor maps with space locations

### Phase 3
- Integration with campus calendar/events
- Quiet hours enforcement tracking
- Space reviews and ratings
- Analytics dashboard for administrators

### Phase 4
- Mobile app (iOS/Android)
- Integration with campus ID card systems
- Automated occupancy sensors
- Multi-campus support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Professor [John Alexis Guerra Gomez]** - CS 5610 Web Development
- **Northeastern University** - Course materials and guidance
- **MongoDB Atlas** - Database hosting
- **Anthropic Claude** - Development assistance

---

## 📞 Contact

### Rachit Patel
- GitHub: [@PatelRachit](https://github.com/PatelRachit)
- Email: patel.rachi@northeastern.edu

### Prajakta Avachat
- GitHub: [@prajakta2801](https://github.com/prajakta2801)
- Email: avachat.pr@northeastern.edu

---

## 📚 Additional Documentation

- [Design Document](./DESIGN_DOCUMENT.md) - Complete project design and specifications
- [API Documentation](./docs/API.md) - Detailed API endpoint documentation
- [Database Schema](./docs/DATABASE.md) - Database structure and relationships

---

**Last Updated:** February 2026  
**Version:** 1.0.0

---
