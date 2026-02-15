# SpotCheck - Real-time Campus Study Space Availability Tracker

![SpotCheck Screenshot](./screenshots/dashboard.png)

---

## Author

**Rachit Patel** - patel.rachi@northeastern.edu  
**Prajakta Avachat** - avachat.pr@northeastern.edu

---

## Class Link

**Course:** CS 5610 - Web Development  
**Institution:** Northeastern University  
**Semester:** Spring 2026  
**Canvas:** [CS 5610](https://northeastern.instructure.com/courses/your-course-id)

---

## Project Objective

Students waste 15-30 minutes daily walking across campus searching for available study spots, especially during midterms and finals when libraries are packed. **SpotCheck** solves this problem by crowdsourcing real-time occupancy data through user check-ins, showing live availability before students leave their location.

### Key Features
- Real-time occupancy tracking with color-coded indicators (12/30 seats)
- Browse and filter study spaces by amenities, category, and building
- Check-in/check-out system to update occupancy
- Save favorite spaces for quick access
- User authentication and profiles

---

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Space Details
![Space Details](./screenshots/space-details.png)

### Favorites
![Favorites](./screenshots/favorites.png)

---

## Technology Stack

### Backend
- **Node.js** with ES6 Modules (no CJS/require)
- **Express.js** - Web framework
- **MongoDB Native Driver** (no Mongoose)
- **JWT Authentication** with Passport.js
- **bcrypt** - Password hashing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modular organization
- **Vanilla JavaScript** - Client-side rendering (no frameworks)

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## Instructions to Build

### Prerequisites
- Node.js (v18.19.0 or higher)
- MongoDB Atlas account
- npm package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/PatelRachit/web-dev-project-2.git
cd web-dev-project-2
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file in root directory**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/spotcheck
DB_NAME=spotcheck
PORT=5000
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

**Important:** Never commit the `.env` file to version control!

4. **Start the development server**
```bash
npm run dev
```

5. **Access the application**
```
http://localhost:5000
```

---

## Technology Stack

### Backend
- Node.js with ES6 Modules (no CJS/require)
- Express.js
- MongoDB Native Driver (no Mongoose)
- JWT Authentication with Passport.js
- bcrypt for password hashing

### Frontend
- HTML5
- CSS3 (Modular organization)
- Vanilla JavaScript (client-side rendering, no frameworks)

### Code Quality
- ESLint configuration
- Prettier formatting
- Modular code organization

---

## Project Structure

```
web-dev-project-2/
├── src/
│   ├── config/
│   │   ├── mongo.js              # MongoDB connection
│   │   └── passport.js           # JWT authentication
│   ├── controller/               # Business logic
│   │   ├── auth/
│   │   ├── spaces/
│   │   ├── checkins/
│   │   ├── favorites/
│   │   └── user/
│   ├── models/                   # Database operations
│   │   ├── spaces.js
│   │   ├── checkins.js
│   │   ├── favorites.js
│   │   └── user.js
│   ├── routes/                   # API endpoints
│   │   ├── auth.js
│   │   ├── spaces.js
│   │   ├── checkins.js
│   │   ├── favorites.js
│   │   └── index.js
│   └── server.js                 # Express app
├── public/                       # Frontend files
│   ├── css/                      # Modular CSS
│   ├── js/                       # JavaScript modules
│   └── images/
├── .env                          # Environment variables (gitignored)
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json
├── DESIGN_DOCUMENT.md
├── LICENSE
└── README.md
```

---

## Database Collections

The application uses **4 MongoDB collections** with full CRUD operations:

1. **users** - User authentication and profiles
2. **spaces** - Study space information and occupancy
3. **checkins** - Check-in/out records for tracking occupancy
4. **favourites** - User's saved favorite spaces (embedded in users collection)

---

## Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
```

---

## Team Responsibilities

### Rachit Patel
- Spaces collection with full CRUD operations
- Check-ins collection with full CRUD operations
- Real-time occupancy tracking
- Space filtering and browsing

### Prajakta Avachat
- Users collection with full CRUD operations
- Favorites system with full CRUD operations
- Authentication system
- User profile management

---

## Deployment

**Live Application:** [Deployment URL]

The application is deployed on [Platform Name] with MongoDB Atlas for the database.

---

## License

This project is licensed under the MIT License.

---

## Video Demo

[Link to narrated video demonstration]

---
