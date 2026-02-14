# SpotCheck - Design Document

## Project Information
- **Project Name:** SpotCheck
- **Team Members:** 
  - Rachit Patel (Spaces & Check-ins)
  - Prajakta Avachat (Users & Favorites)
- **Course:** Web Development Project 2
- **Technology Stack:** Node.js, Express, MongoDB, Vanilla JavaScript

---

## 1. Project Description

### Project Name
**SpotCheck - Real-time campus study space availability tracker**

### Team Members
- **Rachit Patel** - Implementing Spaces & Check-ins collections with full CRUD
- **Prajakta Avachat** - Implementing Users & Favorites collections with full CRUD

### Short Description
Students waste 15-30 minutes daily walking across campus searching for available study spots, especially during midterms and finals when libraries are packed. SpotCheck solves this by crowdsourcing real-time occupancy data through user check-ins, showing live availability before students leave their dorm. Our system provides color-coded availability indicators (12/30 seats occupied) updated in real-time as students check in and out. Students can filter spaces by amenities (outlets, WiFi, whiteboards), category, and building location, plus save their favorites for quick access, eliminating wasted trips across campus.

### Technical Independence

**Rachit's Work:**
- **Spaces collection** - name, location, capacity, amenities, currentOccupancy, category, hours
- **Check-ins collection** - userId reference, spaceId, checkInTime, checkOutTime, isActive
- Fully functional for browsing, filtering, and checking in/out

**Prajakta's Work:**
- **Users collection** - name, email, password, favorites array with spaceId references, currentlyStudyingAt
- Full authentication system
- Fully functional for user management and favorites

---

## 2. User Personas

### Persona 1: Sarah
**Computer Science junior who needs quiet spaces with outlets for 4-hour coding sessions**

**Demographics:**
- Age: 21
- Year: Junior
- Major: Computer Science
- Study Habits: 4-hour coding sessions, needs reliable power and quiet environment

**Goals:**
- Find quiet spaces with reliable power outlets
- Avoid loud environments that break concentration
- Minimize time spent searching for study spots
- Discover new productive study locations

**Pain Points:**
- Laptop dies when outlets aren't available
- Loses 20-30 minutes walking to full libraries
- Prefers quiet spaces but library is often too crowded
- Doesn't know about all the study spaces on campus

**How SpotCheck Helps:**
- Filter for spaces with outlets before leaving dorm
- Check real-time availability to avoid wasted trips
- Save favorite quiet spots for quick access
- Discover lesser-known study spaces with her preferred amenities

**Typical User Journey:**
1. Opens SpotCheck at 2 PM to start coding session
2. Filters for "Library" + "Outlets" + "Quiet"
3. Sees Main Library 3rd Floor is 80% full (24/30 occupied)
4. Checks her favorites - Snell Engineering Quiet Room shows 40% full (6/15)
5. Heads to Snell, checks in upon arrival
6. Studies for 4 hours, checks out when leaving

---

### Persona 2: Marcus
**Freshman unfamiliar with campus, wants to discover new study spots near his classes**

**Demographics:**
- Age: 18
- Year: Freshman
- Major: Undeclared
- Study Habits: Short study sessions between classes, exploring campus

**Goals:**
- Discover study spaces near his classes
- Learn which spaces are best for different needs
- Find spaces that are open late when he has night classes
- Build a mental map of campus study options

**Pain Points:**
- Unfamiliar with campus geography
- Doesn't know where study spaces are located
- Unsure which spaces are actually good for studying
- Has limited time between classes to search for spaces

**How SpotCheck Helps:**
- Browse all available spaces by building/location
- View space details including photos and amenities
- See which 24/7 spaces are actually open late
- Build a favorites list as he discovers good spots

**Typical User Journey:**
1. Finishes chemistry class at 11 AM in Science Building
2. Has 2-hour gap before next class
3. Opens SpotCheck, filters by "Near Science Building"
4. Discovers Science Library Collaboration Room (5/20 occupied)
5. Views space details - has whiteboards for practice problems
6. Adds to favorites for future use
7. Checks in and studies

---

### Persona 3: Priya
**Graduate student leading group projects, needs spaces with whiteboards and group seating**

**Demographics:**
- Age: 24
- Year: Graduate Student
- Major: Business/Engineering
- Study Habits: Frequent group meetings, collaborative work sessions

**Goals:**
- Find spaces that accommodate 4-6 people
- Ensure spaces have whiteboards for brainstorming
- Book spaces with good WiFi for presentations
- Coordinate with team members on location

**Pain Points:**
- Group rooms are often fully booked
- Walking to spaces only to find them occupied
- Team members scattered across campus
- Needs specific amenities (whiteboards, projectors)

**How SpotCheck Helps:**
- Filter for group spaces with required amenities
- Check real-time availability before team arrives
- Share space information with team members
- Save favorite group study locations

**Typical User Journey:**
1. Team meeting scheduled for 3 PM
2. Opens SpotCheck at 2:45 PM
3. Filters for "Group Space" + "Whiteboard" + "6+ capacity"
4. Finds Curry Student Center Study Room (2/8 occupied)
5. Messages team with location
6. Checks in when team arrives
7. Team uses whiteboard for project planning

---

### Persona 4: Alex
**Night owl studying until 2 AM, needs to know which 24/7 spaces are actually open**

**Demographics:**
- Age: 20
- Year: Sophomore
- Major: Architecture/Engineering
- Study Habits: Late-night study sessions, prefers quiet campus hours

**Goals:**
- Find 24/7 spaces that are actually open late
- Avoid walking to closed buildings at night
- Find safe, well-lit spaces for late-night studying
- Access spaces with outlets for all-night work sessions

**Pain Points:**
- Many "24/7" spaces are actually locked at night
- Campus feels empty - hard to know what's open
- Wastes time walking to closed buildings
- Prefers studying when campus is less crowded

**How SpotCheck Helps:**
- Filter for 24/7 spaces and see current availability
- Check real-time status to confirm spaces are open
- View space hours before making the trip
- See which late-night spots have other students

**Typical User Journey:**
1. Starts architecture project at 11 PM
2. Opens SpotCheck to find open spaces
3. Filters for "24/7" + "Outlets"
4. Sees Snell Library 24/7 Room (3/20 occupied)
5. Confirms it's currently open with active check-ins
6. Walks over and checks in
7. Works until 2 AM, checks out when leaving

---

## 3. User Stories

### Rachit's Implementation (Spaces & Check-ins)

**US-1: Browse and Filter Study Spaces**
> *As a student, I want to browse all study spaces on campus and filter them by amenities (outlets, WiFi, whiteboards) and category (library, cafe, lounge), so I can find spots that match my specific needs.*

**Acceptance Criteria:**
- All spaces displayed in grid/card layout with name, building, category, and current occupancy
- Filter options include: outlets, WiFi, whiteboards, quiet, group-friendly
- Category filters: library, cafe, lounge, study room, outdoor
- Multiple amenities can be selected simultaneously
- Results update in real-time as filters are applied
- Clear filters button resets all selections
- Spaces have color-coded availability indicators (Green <60%, Yellow 60-85%, Red >85%)

---

**US-2: View Real-Time Occupancy and Space Details**
> *As a student, I want to see real-time occupancy (12/30 seats) and view detailed space information (capacity, amenities, hours, location), so I don't waste time walking to full locations and can decide if a space is right for me before visiting.*

**Acceptance Criteria:**
- Occupancy displayed as "X/Y" format (current/total) with percentage
- Color coding updates based on occupancy level
- Clicking a space card opens detailed view
- Detail page shows: capacity, current occupancy, amenities list, hours, location, description, photos
- Shows currently checked-in user count
- Occupancy updates when users check in/out
- Back button returns to browse view

---

**US-3: Check In and Out of Spaces**
> *As a student, I want to check into a space when I arrive and check out when I leave, so I help others know it's occupied and keep occupancy data accurate for the community.*

**Acceptance Criteria:**
- "Check In" button visible on space detail page (must be logged in)
- Cannot check in if already checked in elsewhere
- Check-in time is recorded and occupancy count increments immediately
- "Check Out" button visible when user is checked in
- Check-out time is recorded and occupancy count decrements
- Session duration is calculated and stored
- Success messages confirm both check-in and check-out
- Dashboard shows current check-in status with space name and duration

---

### Prajakta's Implementation (Users & Favorites)

**US-4: Create Account and Login Securely**
> *As a student, I want to create an account with my information and log in securely, so I can save favorites, check into spaces, and have my data protected.*

**Acceptance Criteria:**
- User can register with name, email, password, major, and graduation year
- Email must be unique in the system
- Password is securely hashed before storage
- User can log in with valid email and password credentials
- JWT token is generated and stored upon successful login
- Invalid credentials display clear error messages
- Success message confirms account creation
- User is redirected to dashboard after login
- Session persists across page refreshes
- Logout button clears JWT token and redirects to login page

---

**US-5: Add and Remove Spaces from Favorites**
> *As a student, I want to add spaces to my favorites list and remove them when my preferences change, so I can quickly access the spots I actually use without searching every time.*

**Acceptance Criteria:**
- Heart/star icon visible on all space cards and detail pages
- Clicking empty icon adds space to favorites with visual feedback
- Clicking filled icon removes space from favorites
- Duplicate favorites are prevented
- Changes reflect immediately across all views
- Favorites list updates in real-time
- Success messages confirm additions and removals

---

**US-6: View All Favorites with Real-Time Availability**
> *As a student, I want to view all my favorite spaces in one dedicated page with their current availability, so I can quickly choose where to study today and check in directly from my favorites.*

**Acceptance Criteria:**
- Dedicated "Favorites" page accessible from main navigation
- All favorited spaces displayed in grid layout
- Each favorite card shows real-time occupancy with color coding
- Empty state message shown when user has no favorites
- Quick "Check In" button on each favorite card for one-click check-in
- Ability to remove spaces from favorites directly on this page
- Page updates automatically when spaces are added or removed from favorites
- Real-time occupancy updates for all favorite spaces

---

## 4. Design Mockups

### 4.1 Authentication Pages

#### Login Page
```
┌─────────────────────────────────────────────────────────────┐
│                         SpotCheck                            │
│                 Find Your Perfect Study Space                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌────────────────────────────┐                 │
│              │      Welcome Back!          │                 │
│              │                             │                 │
│              │  Email                      │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  Password                   │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  [ Remember Me ]            │                 │
│              │                             │                 │
│              │     [    Login    ]         │                 │
│              │                             │                 │
│              │  Don't have an account?     │                 │
│              │       Register here         │                 │
│              └────────────────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Registration Page
```
┌─────────────────────────────────────────────────────────────┐
│                         SpotCheck                            │
│                 Find Your Perfect Study Space                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌────────────────────────────┐                 │
│              │    Create Your Account      │                 │
│              │                             │                 │
│              │  Full Name                  │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  Email                      │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  Password                   │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  Confirm Password           │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  Major                      │                 │
│              │  [___________________]      │                 │
│              │                             │                 │
│              │  Graduation Year            │                 │
│              │  [▼ Select Year     ]       │                 │
│              │                             │                 │
│              │     [   Register   ]        │                 │
│              │                             │                 │
│              │  Already have account?      │                 │
│              │        Login here           │                 │
│              └────────────────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Dashboard / Home Page
```
┌─────────────────────────────────────────────────────────────┐
│  SpotCheck    [Home] [Favorites] [Profile]      Hi, Sarah ▼ │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Current Status: ✓ Checked in at Main Library 3F     │  │
│  │  Since: 2:34 PM (1h 26m ago)                         │  │
│  │                              [Check Out]              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Find Study Spaces                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [🔍 Search...]                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Filters:                                                    │
│  Category: [All ▼]  Building: [All ▼]  Sort: [Avail. ▼]    │
│  Amenities: [ ] Outlets  [ ] WiFi  [ ] Whiteboard  [ ] Quiet│
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  📚 Main    │  │  ☕ Cafe    │  │  🏛️ Snell   │        │
│  │  Library    │  │  Lounge     │  │  Library    │        │
│  │  3rd Floor  │  │             │  │  Quiet Room │        │
│  │             │  │             │  │             │        │
│  │  🟢 12/30   │  │  🟡 18/25   │  │  🟢 4/15    │        │
│  │  (40% full) │  │  (72% full) │  │  (27% full) │        │
│  │             │  │             │  │             │        │
│  │  ⚡ WiFi    │  │  ⚡ ☕ WiFi  │  │  ⚡ 📝 WiFi │        │
│  │  ♥️         │  │             │  │  ♥️         │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  🏫 ISEC    │  │  📖 Curry   │  │  🌳 Outdoor │        │
│  │  Study Room │  │  Study Room │  │  Courtyard  │        │
│  │  204        │  │  301        │  │             │        │
│  │             │  │             │  │             │        │
│  │  🟢 2/8     │  │  🔴 8/8     │  │  🟢 5/20    │        │
│  │  (25% full) │  │  (FULL)     │  │  (25% full) │        │
│  │             │  │             │  │             │        │
│  │  ⚡ 📝 WiFi │  │  ⚡ 📝 WiFi │  │  ☀️ WiFi    │        │
│  │             │  │  ♥️         │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Legend:
🟢 Green: <60% full (Available)
🟡 Yellow: 60-85% full (Filling up)
🔴 Red: >85% full (Nearly full)
⚡ Outlets  📝 Whiteboard  ☕ Cafe  WiFi  ☀️ Outdoor
♥️ Favorited
```

---

### 4.3 Space Detail Page
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Browse                        Hi, Sarah ▼         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────┐                           │
│  │                              │   Main Library - 3rd Floor│
│  │      [Space Photo]           │   ♥️ Add to Favorites     │
│  │                              │                           │
│  │                              │   Building: Main Library  │
│  └──────────────────────────────┘   Location: 3rd Floor    │
│                                      Category: Library       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Current Occupancy:  🟢 12 / 30 seats  (40% full)    │  │
│  │                                                        │  │
│  │  [████████░░░░░░░░░░░░]                              │  │
│  │                                                        │  │
│  │  Status: Good availability                            │  │
│  │                                        [Check In]      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  About This Space                                            │
│  Quiet study area on the 3rd floor with individual desks    │
│  and plenty of outlets. Perfect for focused work sessions.  │
│  Popular among CS students for coding projects.              │
│                                                              │
│  Amenities                                                   │
│  ✓ Power Outlets    ✓ WiFi          ✓ Quiet Zone           │
│  ✓ Individual Desks ✓ Good Lighting ✗ Whiteboards          │
│                                                              │
│  Hours                                                       │
│  Monday - Thursday:  7:00 AM - 11:00 PM                     │
│  Friday:             7:00 AM - 9:00 PM                      │
│  Saturday:           9:00 AM - 9:00 PM                      │
│  Sunday:             9:00 AM - 11:00 PM                     │
│                                                              │
│  Currently Studying Here (12 students)                       │
│  [Avatar] [Avatar] [Avatar] [Avatar] +8 more                │
│                                                              │
│  Recent Check-in Activity                                    │
│  • Alex K. checked in 5 minutes ago                         │
│  • Jordan M. checked out 12 minutes ago (stayed 2h 15m)     │
│  • Taylor B. checked in 23 minutes ago                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.4 Favorites Page
```
┌─────────────────────────────────────────────────────────────┐
│  SpotCheck    [Home] [Favorites] [Profile]      Hi, Sarah ▼ │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  My Favorite Spaces (4)                                      │
│                                                              │
│  Quick access to your most-used study spots                  │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  📚 Main Library    │  │  🏛️ Snell Library   │          │
│  │  3rd Floor          │  │  Quiet Room         │          │
│  │                     │  │                     │          │
│  │  🟢 12/30 (40%)     │  │  🟢 4/15 (27%)      │          │
│  │                     │  │                     │          │
│  │  ⚡ WiFi            │  │  ⚡ 📝 WiFi         │          │
│  │                     │  │                     │          │
│  │  [Check In Now]     │  │  [Check In Now]     │          │
│  │  💔 Remove          │  │  💔 Remove          │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  ☕ Cafe Lounge     │  │  🏫 Curry Study     │          │
│  │                     │  │  Room 301           │          │
│  │                     │  │                     │          │
│  │  🟡 18/25 (72%)     │  │  🔴 8/8 (FULL)      │          │
│  │                     │  │                     │          │
│  │  ⚡ ☕ WiFi         │  │  ⚡ 📝 WiFi         │          │
│  │                     │  │                     │          │
│  │  [Check In Now]     │  │  [View Details]     │          │
│  │  💔 Remove          │  │  💔 Remove          │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  💡 Tip: Add more favorites by clicking the ♥️      │    │
│  │     icon on any space card!                        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.5 Profile Page
```
┌─────────────────────────────────────────────────────────────┐
│  SpotCheck    [Home] [Favorites] [Profile]      Hi, Sarah ▼ │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  My Profile                                                  │
│                                                              │
│  ┌──────────────┐                                           │
│  │              │  Sarah Chen                               │
│  │   [Avatar]   │  Computer Science, Class of 2025          │
│  │              │  Member since: September 2024             │
│  └──────────────┘  sarah.chen@university.edu               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Account Information                    [Edit]        │  │
│  │                                                        │  │
│  │  Full Name:        Sarah Chen                         │  │
│  │  Email:            sarah.chen@university.edu          │  │
│  │  Major:            Computer Science                   │  │
│  │  Graduation Year:  2025                               │  │
│  │  Account Created:  September 15, 2024                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Study Statistics                                     │  │
│  │                                                        │  │
│  │  Total Check-ins:       127                           │  │
│  │  Total Study Time:      243 hours 15 minutes          │  │
│  │  Favorite Spaces:       4                             │  │
│  │  Most Visited:          Main Library 3rd Floor (42x)  │  │
│  │  Average Session:       1h 55m                        │  │
│  │  Longest Session:       6h 45m                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Recent Activity                                      │  │
│  │                                                        │  │
│  │  Today                                                 │  │
│  │  • Checked into Main Library 3F at 2:34 PM            │  │
│  │                                                        │  │
│  │  Yesterday                                             │  │
│  │  • Checked out from Snell Quiet Room at 11:15 PM      │  │
│  │    (studied for 3h 45m)                               │  │
│  │  • Checked into Snell Quiet Room at 7:30 PM           │  │
│  │                                                        │  │
│  │  Feb 12, 2026                                          │  │
│  │  • Checked out from ISEC Study Room at 4:20 PM        │  │
│  │    (studied for 2h 10m)                               │  │
│  │  • Added Cafe Lounge to favorites                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Change Password]  [Logout]                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.6 Mobile View (Responsive Design)
```
┌─────────────────────┐
│  SpotCheck      ☰   │
├─────────────────────┤
│                     │
│  Current Status:    │
│  ✓ Main Library 3F  │
│  [Check Out]        │
│                     │
│  [🔍 Search...]     │
│                     │
│  Filters ▼          │
│                     │
│  ┌───────────────┐ │
│  │ 📚 Main Lib   │ │
│  │ 3rd Floor     │ │
│  │               │ │
│  │ 🟢 12/30      │ │
│  │ (40% full)    │ │
│  │               │ │
│  │ ⚡ WiFi ♥️    │ │
│  └───────────────┘ │
│                     │
│  ┌───────────────┐ │
│  │ ☕ Cafe       │ │
│  │ Lounge        │ │
│  │               │ │
│  │ 🟡 18/25      │ │
│  │ (72% full)    │ │
│  │               │ │
│  │ ⚡ ☕ WiFi     │ │
│  └───────────────┘ │
│                     │
│  ┌───────────────┐ │
│  │ 🏛️ Snell     │ │
│  │ Quiet Room    │ │
│  │               │ │
│  │ 🟢 4/15       │ │
│  │ (27% full)    │ │
│  │               │ │
│  │ ⚡ 📝 WiFi ♥️ │ │
│  └───────────────┘ │
│                     │
└─────────────────────┘
```

---

### 4.7 Admin Panel (Add/Edit Space)
```
┌─────────────────────────────────────────────────────────────┐
│  SpotCheck - Admin Panel                    Admin Menu ▼    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Add New Study Space                                         │
│                                                              │
│  Basic Information                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Space Name *                                         │  │
│  │  [_____________________________________________]      │  │
│  │                                                        │  │
│  │  Building *                                           │  │
│  │  [▼ Select Building                           ]       │  │
│  │                                                        │  │
│  │  Location/Floor                                       │  │
│  │  [_____________________________________________]      │  │
│  │                                                        │  │
│  │  Category *                                           │  │
│  │  ( ) Library  ( ) Cafe  ( ) Lounge  ( ) Study Room   │  │
│  │  ( ) Outdoor  ( ) Other                              │  │
│  │                                                        │  │
│  │  Capacity (total seats) *                             │  │
│  │  [____]                                               │  │
│  │                                                        │  │
│  │  Description                                          │  │
│  │  [_____________________________________________]      │  │
│  │  [_____________________________________________]      │  │
│  │  [_____________________________________________]      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Amenities                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [✓] Power Outlets    [✓] WiFi         [ ] Whiteboard│  │
│  │  [✓] Quiet Zone       [ ] Group Space  [ ] Projector │  │
│  │  [ ] Coffee Available [ ] Printer      [✓] AC/Heating│  │
│  │  [ ] Natural Light    [ ] Food Allowed [ ] Lockers   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Hours of Operation                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Monday - Thursday:   [7:00 AM] to [11:00 PM]        │  │
│  │  Friday:              [7:00 AM] to [9:00 PM]         │  │
│  │  Saturday:            [9:00 AM] to [9:00 PM]         │  │
│  │  Sunday:              [9:00 AM] to [11:00 PM]        │  │
│  │                                                        │  │
│  │  [ ] 24/7 Access                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Photos                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Upload Photo]  [Choose File]                        │  │
│  │                                                        │  │
│  │  Preview: [No photo uploaded]                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Cancel]                        [Save Space]               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Color Scheme & Design System

### Brand Colors
- **Primary:** #2563EB (Blue) - Main brand color, buttons, links
- **Secondary:** #10B981 (Green) - Success, available spaces
- **Warning:** #F59E0B (Yellow) - Filling up spaces
- **Danger:** #EF4444 (Red) - Full/nearly full spaces
- **Neutral:** #6B7280 (Gray) - Text, borders

### Availability Color Coding
- 🟢 **Green (<60% full):** #10B981 - "Good availability"
- 🟡 **Yellow (60-85% full):** #F59E0B - "Filling up"
- 🔴 **Red (>85% full):** #EF4444 - "Nearly full / Full"

### Typography
- **Headings:** Inter, sans-serif (Bold, 24-32px)
- **Body:** Inter, sans-serif (Regular, 14-16px)
- **Labels:** Inter, sans-serif (Medium, 12-14px)

### Spacing
- **Card Padding:** 16px
- **Card Gap:** 20px
- **Section Margin:** 32px
- **Button Padding:** 12px 24px

### Components
- **Cards:** Rounded corners (8px), subtle shadow
- **Buttons:** Rounded (6px), solid colors, hover effects
- **Icons:** 20px standard size, 16px for inline
- **Inputs:** Border radius 4px, focus state with blue outline

---

## 6. Technical Architecture Overview

### Frontend Stack
- **HTML5** - Semantic markup
- **CSS3** - Modular stylesheets (one per component)
- **Vanilla JavaScript** - Client-side rendering, no frameworks
- **ES6 Modules** - Code organization

### Backend Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB (Native Driver)** - Database (NO Mongoose!)
- **JWT** - Authentication
- **bcrypt** - Password hashing

### API Structure
- RESTful endpoints
- JSON responses
- JWT-based authentication
- Error handling middleware

### Database Collections
1. **users** - User accounts and favorites
2. **spaces** - Study space information
3. **checkins** - Check-in/out records
4. **sessions** (optional) - Active user sessions

---

## 7. Success Metrics

### User Engagement
- Daily active users
- Average check-ins per user
- Favorite spaces per user
- Session duration

### System Performance
- Real-time occupancy accuracy
- Average time to find a space
- Check-in/out success rate
- Page load times

### User Satisfaction
- Time saved per user (vs. walking around)
- Percentage of successful space finds
- Return user rate
- Feature usage statistics

---

## 8. Future Enhancements (Post-MVP)

### Phase 2 Features
- Push notifications for favorite space availability
- Space reservation system (1-hour slots)
- Study group formation and coordination
- Building floor maps with space locations
- Mobile app (iOS/Android)

### Phase 3 Features
- Integration with campus calendar/events
- Quiet hours enforcement tracking
- Study space reviews and ratings
- Analytics dashboard for administrators
- Predictive availability based on historical data

### Phase 4 Features
- Integration with campus ID card check-ins
- Automated occupancy sensors
- Multi-campus support
- API for third-party integrations
- Social features (study buddies, group study matching)

---

## 9. Project Timeline

### Week 1-2: Setup & Authentication
- Project setup and environment configuration
- Database schema design
- User authentication system (Prajakta)
- Basic space CRUD operations (Rachit)

### Week 3-4: Core Features
- Space browsing and filtering (Rachit)
- Check-in/out system (Rachit)
- Favorites system (Prajakta)
- Real-time occupancy updates

### Week 5-6: Frontend Development
- HTML pages for all views
- CSS styling and responsive design
- JavaScript client-side rendering
- API integration

### Week 7: Testing & Polish
- End-to-end testing
- Bug fixes
- Performance optimization
- Documentation

### Week 8: Deployment
- Environment setup
- Database migration
- Server deployment
- Final testing and video demo

---

## 10. Team Responsibilities

### Rachit Patel
**Backend:**
- Spaces collection and CRUD operations
- Check-ins collection and logic
- Space filtering and search APIs
- Admin space management

**Frontend:**
- Space browsing page
- Space detail page
- Check-in/out UI components
- Filter and search interface

### Prajakta Avachat
**Backend:**
- Users collection and authentication
- Favorites system APIs
- User profile management
- JWT token handling

**Frontend:**
- Login/registration pages
- Favorites page
- Profile page
- Navigation and header components

### Shared Responsibilities
- Code reviews
- Testing
- Documentation
- Deployment
- Video demo creation

---

*End of Design Document*