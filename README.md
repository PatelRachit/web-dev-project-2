# SpotCheck – Real-time Campus Study Space Availability Tracker

![SpotCheck Dashboard](./screenshots/dashboard.png)

---

## Author

**Rachit Patel** – patel.rachi@northeastern.edu  
**Prajakta Avachat** – avachat.pr@northeastern.edu

---

## Class Link

**Course:** CS 5610 – Web Development  
**Institution:** Northeastern University  
**Semester:** Spring 2026  
**Assignment Page:** [https://johnguerra.co/classes/webDevelopment_online_spring_2026/](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)

---

## Deployment

**Live Application:** https://spot-check-teal.vercel.app/login.html

The application is deployed on Vercel with MongoDB Atlas for the database.

---

## Video Demo

[Link to narrated video demonstration – to be added]

---

## Slides

[google slides]

---

## Design Document

See [DESIGN_DOCUMENT.md](./DESIGN-DOCUMENT.md) for full project design including mockups and schema diagrams.

---

## Project Objective

Students waste 15–30 minutes daily walking across campus searching for available study spots, especially during midterms and finals when libraries are packed. **SpotCheck** solves this problem by crowdsourcing real-time occupancy data through user check-ins, showing live availability before students leave their current location.

The system displays color-coded occupancy indicators (e.g., 12/30 seats occupied), lets students filter by amenities, category, and building, and allows them to save favorite spaces for quick access—eliminating wasted trips across campus.

---

## Screenshots

### Login

![login](./screenshots/login.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Space Details

![Space Details](./screenshots/spaces.png)

### Favorites

![Favorites](./screenshots/favourites.png)

### Admin

![Admin](./screenshots/admin.png)

---

## User Personas

**Sarah** – CS junior who needs quiet spaces with outlets for 4-hour coding sessions.

**Marcus** – Freshman unfamiliar with campus who wants to discover new study spots near his classes.

**Priya** – Graduate student leading group projects who needs spaces with whiteboards and group seating.

**Alex** – Night owl studying until 2 AM who needs to know which 24/7 spaces are actually available.

---

## User Stories

### Rachit's Scope (Spaces & Check-ins)

- As a student, I want to browse all study spaces on campus so I can discover places I didn't know existed.
- As a student, I want to see real-time occupancy (12/30 seats) so I don't waste time walking to full locations.
- As a student, I want to check into a space when I arrive so I help others know it's occupied.
- As a student, I want to check out when I leave so occupancy stays accurate.
- As a student, I want to filter spaces by amenities (outlets, WiFi, whiteboards) so I find spots matching my needs.
- As a student, I want to filter spaces by category (library, cafe, lounge) so I find my preferred environment.
- As a student, I want to view space details (capacity, amenities, hours, location) so I can decide before visiting.
- As an admin, I want to add, edit, and delete study spaces so the database stays current.

### Prajakta's Scope (Users & Favorites)

- As a student, I want to create an account so I can save favorites and check in to spaces.
- As a student, I want to log in securely so my data is protected.
- As a student, I want to add spaces to my favorites so I can quickly access them later.
- As a student, I want to remove spaces from favorites so I only see spots I actually use.
- As a student, I want to view all my favorite spaces in one place so I can check their availability at a glance.
- As a student, I want to edit my profile information so I can keep my account updated.
- As a student, I want to see my current check-in status so I know if I'm checked in somewhere.
- As a student, I want to log out so my session is secure.

---

## Technology Stack

### Backend

- **Node.js** with ES6 Modules (`import`/`export` only — no `require`)
- **Express.js** – Web framework
- **MongoDB Native Driver** (no Mongoose)
- **JWT Authentication** with Passport.js
- **bcrypt** – Password hashing

### Frontend

- **HTML5** – Semantic markup
- **CSS3** – Modular organization (one file per component/page)
- **Vanilla JavaScript** – Client-side rendering, ES6 modules (no frameworks)

### Code Quality

- **ESLint** – Linting (`eslint.config.js`)
- **Prettier** – Formatting (`.prettierrc`)

---

## Instructions to Build

### Prerequisites

- Node.js v18.19.0 or higher
- MongoDB Atlas account (or local MongoDB instance)
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

3. **Create a `.env` file in the root directory**

```env
MONGO_URI= mongodb+srv://rachit:rachit@spotcheck.8jcn5xk.mongodb.net/?appName=spotcheck
DB_NAME=spotcheck
PORT=5000
JWT_SECRET=ApiSecretToken
FRONTEND_URL=http://localhost:5000
ALGORITHM_ACCESS_TOKEN = aes-256-cbc
ALGORITHM_API_KEY = aes-64w-cbc
```

> **Important:** Never commit `.env` to version control. It is listed in `.gitignore`.

4. **Start the development server**

```bash
npm run dev
```

5. **Open the application**

```
http://localhost:5000
```

---

## Available Scripts

```bash
npm run dev        # Start development server with nodemon
npm run lint       # Run ESLint
npm run fix        # fix ESLint and Prettier issues
npm run format     # Format code with Prettier
```

---

## Project Structure

```
web-dev-project-2/
├── frontend/
│   ├── css/                      # Modular CSS – one file per page/component
│   ├── images/
│   ├── js/                       # Vanilla JS ES6 modules
│   ├── admin.html
│   ├── favorites.html
│   ├── index.html
│   ├── login.html
│   └── spaces.html
├── src/
│   ├── config/                   # MongoDB connection & Passport JWT strategy
│   ├── constant/                 # Shared constants
│   ├── controller/               # Business logic (one file per resource)
│   ├── middleware/               # Auth & validation middleware
│   ├── models/                   # Database operations (native MongoDB driver)
│   ├── routes/                   # Express route definitions
│   ├── utils/                    # Helper utilities
│   └── server.js                 # Express app entry point
├── node_modules/
├── .env                          # Environment variables (gitignored)
├── .gitignore
├── .prettierignore
├── .prettierrc
├── DESIGN-DOCUMENT.md
├── eslint.config.mjs
├── LICENSE                       # MIT License
├── nodemon.json
├── package-lock.json
├── package.json
└── README.md
```

---

## Database Collections

The application uses **4 MongoDB collections** supporting full CRUD operations:

**users** – Authentication, profile, check-in status, reference to favorites, and an `isAdmin` flag to control access to the admin panel.

**spaces** – Study space records including name, building, capacity, current occupancy, amenities, category, and hours.

**checkins** – Individual check-in/check-out events linking a user to a space with timestamps and an `isActive` flag for real-time occupancy calculation.

**favourites** – Saved space references per user, enabling a personalized quick-access list.

---

## Team Responsibilities

### Rachit Patel

- Spaces collection – full CRUD (create, read, update, delete)
- Check-ins collection – full CRUD
- Real-time occupancy tracking logic
- Space filtering by amenities, category, and building
- Pagination for the spaces API

### Prajakta Avachat

- Users collection – full CRUD
- Favorites collection – full CRUD
- JWT authentication system (register, login, logout)
- Admin panel for managing study spaces

---

## How to Use the App

1. **Register** for an account on the Sign Up page.
2. **Browse** the dashboard to see all study spaces and their live occupancy.
3. **Filter** spaces by amenities (outlets, WiFi, whiteboards), category (library, cafe, lounge), or building.
4. **Click a space** to view full details including capacity, hours, and amenities.
5. **Check in** when you arrive at a space to update its live occupancy for other users.
6. **Check out** when you leave so the count stays accurate.
7. **Favorite** spaces you use often for quick access from the Favorites page.
8. **Log out** when you are done to keep your session secure.

### Admin Access

To access the admin panel, navigate to `admin.html` and log in with the following credentials:

| Field    | Value           |
| -------- | --------------- |
| Email    | admin@gmail.com |
| Password | Admin@123       |

Once logged in with the admin credentials, an **Admin** link will appear in the navigation bar giving you access to the admin panel. From there you can add new study spaces, edit existing space details, and delete spaces to keep the database current.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
