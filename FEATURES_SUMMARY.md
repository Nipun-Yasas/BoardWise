# BoardWise - Complete Features Summary

## 📱 Application Overview
BoardWise is a comprehensive boarding management system that connects university students with quality accommodation while providing boarding owners with powerful property management tools.

**Tech Stack**: Next.js 16, TypeScript, MongoDB, Tailwind CSS, Google Gemini AI  
**Roles**: Student, Owner  
**Authentication**: JWT-based with bcrypt encryption

---

## 🎓 STUDENT FEATURES

### 1. Registration & Authentication
- **Sign Up**: Create account with student-specific information
  - Name, email, password, mobile number
  - University selection
  - Faculty and academic year
- **Login**: Secure authentication with session management
- **Password Recovery**: Forgot password and reset functionality

### 2. Boarding Search & Discovery
- **Dashboard**: Central hub for browsing available boardings
- **Advanced Filters**:
  - Search by boarding name
  - Filter by university/college
  - Maximum distance from university (slider)
  - Maximum rental price (budget filter)
  - Room capacity (persons per room)
- **Boarding Cards**: Visual cards showing:
  - Boarding image
  - Name and location
  - Distance from university
  - Available rooms
  - Price range
  - Quick view option

### 3. AI-Powered Smart Recommendations ⭐
- **Natural Language Input**: Describe preferences in plain English
  - Example: "Budget-friendly near University of Colombo, max 2km, good WiFi"
- **Intelligent Matching**: Google Gemini AI analyzes preferences
- **Top 5 Recommendations**: Ranked results with:
  - Match score (0-100 points)
  - Breakdown by criteria:
    - Budget match
    - Distance convenience
    - Amenities match
    - Value for money
  - Pros and cons list
  - Detailed explanation of why it matches
  - Alternative suggestions
- **Multi-Criteria Evaluation**: Considers budget, location, amenities, room type

### 4. Boarding Details
- **Detailed View**: Comprehensive information page
  - Main image and image gallery
  - Full description
  - Location and address
  - Nearest university and exact distance
  - Total room capacity
- **Room Listings**: All available rooms with:
  - Room name/number
  - Capacity (persons)
  - Gender specification (Male/Female/Mixed)
  - Monthly rent price
  - Multiple room images
  - Availability status
  - Current occupancy

### 5. My Boarding Management
- **Stay Status Indicator**:
  - Real-time check-in/check-out status
  - Visual indicator (active/inactive)
  - Duration of current stay
- **Check-In/Check-Out**:
  - Easy check-in functionality
  - Check-out with confirmation
  - Stay history tracking
- **Billing Information**:
  - Next payment date display
  - Upcoming bill amount
  - Current month billing breakdown:
    - Rent amount
    - Electricity charges
    - Water charges
    - Internet charges
    - Other custom charges
    - Total amount due
  - Previous month billing summary
  - Payment status tracking
  - Detailed bill history
- **Visual Analytics**:
  - Billing History Chart: Monthly expense trends
  - Stay Calendar: Visual representation of stay dates
    - Highlighted check-in dates
    - Booked dates indicator
    - Interactive date selection
    - Month-by-month view

### 6. Profile Management
- **View/Edit Profile**:
  - Personal information (name, email, mobile)
  - Profile photo upload
  - University details
  - Faculty information
  - Academic year
- **Settings**: Account preferences

### 7. Active Boarding Banner
- Quick access to current boarding
- Shows if student has active accommodation
- Direct link to boarding management page

---

## 🏢 OWNER FEATURES

### 1. Registration & Authentication
- **Sign Up**: Register as boarding owner
  - Name, email, password, mobile number
  - Owner role selection
- **Login**: Secure access to owner dashboard
- **Password Management**: Reset and recovery options

### 2. Owner Dashboard (Analytics Hub)
- **Key Performance Indicators (KPIs)**:
  - **Total Monthly Revenue**: 
    - Calculated from rent payments + monthly bills
    - Month-over-month trend indicator (↑↓)
    - Percentage change from previous month
  - **Total Rooms**: Count across all properties
  - **Active Members**: Current tenant count with trends
  - **Operational Bills**: Total operational costs
- **Revenue Chart**:
  - Interactive yearly revenue trend
  - Monthly breakdown
  - Visual representation of income patterns
  - Identify peak and low seasons
- **Recent Activity Feed**:
  - New bookings
  - Payment status changes
  - Check-in/check-out events
  - Important notifications
- **Quick Actions**: Fast access to key functions

### 3. Property Management (General Info Tab)
- **Create New Boarding**:
  - Upload main boarding image
  - Set boarding name
  - Write detailed description
  - Specify location and address
- **Boarding Configuration**:
  - Select nearest university (dropdown)
  - Set distance from university (with unit: km/miles)
  - Define total room capacity
  - Set availability status
- **Multi-Property Management**:
  - Boarding selector dropdown
  - Switch between properties easily
  - Manage multiple boardings from one account
- **Edit & Update**:
  - Update boarding information
  - Change images
  - Modify descriptions
  - Adjust settings
  - Save changes with real-time updates

### 4. Room Management (Rooms Tab)
- **Room List View**:
  - All rooms displayed as cards
  - Quick overview: name, capacity, gender, price
  - Availability toggle for each room
  - Tenant count indicator
- **Add New Room**:
  - Room name/number
  - Maximum capacity (persons)
  - Gender specification:
    - Male only
    - Female only
    - Mixed/Co-ed
  - Monthly rental price
  - Room description (amenities, features)
  - Upload multiple room images
  - Set availability status
- **Edit Room Details**:
  - Update room information
  - Change pricing
  - Modify capacity
  - Replace images
  - Toggle availability
- **Image Management**:
  - Upload multiple photos per room
  - Drag-and-drop interface
  - Image preview
  - Remove/replace images
- **Tenant Management**:
  - View all tenants per room
  - Tenant information display:
    - Name
    - University
    - Contact details
    - Check-in date
  - Add tenant to room
  - Remove tenant from room
  - Track occupancy rate
  - View tenant history
- **Room Actions**:
  - Edit room
  - Delete room (with confirmation)
  - Duplicate room settings
  - Bulk actions (if multiple rooms)

### 5. Billing Management (Billing Tab) ⭐
- **Bill Type Configuration**:
  - Create custom bill types per room:
    - Electricity
    - Water
    - Internet
    - Gas
    - Maintenance
    - Cleaning
    - Security
    - Any custom charge
  - Set bill type name
  - Assign to specific rooms
  - Delete bill types
- **Monthly Billing**:
  - Month selector (current and future months)
  - Room selector (configure per room)
  - Set amounts for each bill type
  - Due date picker for each bill
  - Save billing configuration
  - Advance planning for upcoming months
- **Bill Amount Management**:
  - Input specific amounts per bill type
  - Different amounts per room
  - Variable billing based on usage
  - Fixed or custom amounts
- **Billing History**:
  - Past month billing records
  - Payment status tracking (Paid/Unpaid)
  - Room-wise billing summary
  - Total amount collected
  - Outstanding amounts
  - Payment date tracking
- **Payment Tracking**:
  - Mark bills as paid
  - Record payment date
  - Add payment notes
  - Track partial payments
  - View payment timeline
- **Financial Reports**:
  - Revenue breakdown by bill type
  - Monthly revenue summaries
  - Room-wise revenue analysis
  - Outstanding payments report
- **Visual Analytics**:
  - Billing trends chart
  - Revenue by bill type graph
  - Payment status overview

### 6. Financial Analytics
- **Revenue Tracking**:
  - Total monthly revenue
  - Revenue by property
  - Revenue by room
  - Revenue by bill type
- **Trend Analysis**:
  - Month-over-month comparison
  - Year-over-year growth
  - Seasonal patterns
  - Forecasting tools
- **Expense Monitoring**:
  - Operational costs tracking
  - Net profit calculation
  - Expense categories
- **Reports Generation**:
  - Exportable reports
  - Custom date ranges
  - Detailed breakdowns

### 7. Owner Profile
- **Profile Management**:
  - Update personal information
  - Change contact details
  - Upload profile photo
  - Business information
- **Account Settings**:
  - Password change
  - Notification preferences
  - Privacy settings

---

## 🔐 SECURITY FEATURES

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based sessions
- **Password Hashing**: Bcrypt encryption for all passwords
- **Session Management**: Secure session handling
- **Role-based Access Control**: Separate permissions for students and owners
- **Protected Routes**: Authorization required for sensitive pages

### Data Security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based request verification

### Password Management
- **Forgot Password**: Email-based password reset
- **Reset Token**: Time-limited secure tokens
- **Password Requirements**: Strong password validation
- **Secure Storage**: Hashed and salted passwords

---

## 🤖 AI INTEGRATION

### Google Gemini AI
- **Smart Recommendations Engine**:
  - Natural language processing
  - Preference extraction
  - Multi-criteria matching
  - Intelligent ranking algorithm
  - Contextual understanding
- **Scoring System**:
  - 100-point match score
  - Weighted criteria evaluation
  - Detailed score breakdown
- **Analysis Output**:
  - Pros and cons generation
  - Detailed matching explanations
  - Alternative suggestions
  - Value assessment

---

## 🎨 UI/UX FEATURES

### Design System
- **Tailwind CSS v4**: Modern, responsive styling
- **Shadcn UI Components**: Pre-built accessible components
- **Lucide Icons**: Comprehensive icon library
- **Tabler Icons**: Additional icon set

### Theme Support
- **Dark Mode**: Complete dark theme
- **Light Mode**: Clean light theme
- **Theme Toggle**: Easy switching
- **System Preference**: Auto-detect system theme

### Responsive Design
- **Mobile Optimized**: Full mobile support
- **Tablet Friendly**: Responsive layouts
- **Desktop Enhanced**: Optimal desktop experience

### Navigation
- **Sidebar**: Collapsible side navigation
- **Top Navigation**: Quick access bar
- **Breadcrumbs**: Location tracking
- **Quick Actions**: Floating action buttons

### Interactive Elements
- **Charts**: Recharts library for data visualization
- **Calendars**: React Day Picker for date selection
- **Forms**: Formik with Yup validation
- **Modals**: Smooth modal interactions
- **Tooltips**: Helpful hover information
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: Sonner for alerts

### Animations
- **Motion**: Framer Motion for smooth animations
- **Transitions**: Smooth page transitions
- **Hover Effects**: Interactive feedback
- **Loading Animations**: Progress indicators

---

## 🗄️ DATA MODELS

### User Model
- id, name, email, password (hashed)
- mobile_number, role (student/owner)
- university, faculty, academicYear (student-specific)
- image (profile photo)
- createdAt, updatedAt

### Boarding Model
- id, ownerId (reference to User)
- name, description, mainImage
- address, city, nearestUniversity
- distanceFromUniversity, distanceUnit
- totalRooms, isAvailable
- createdAt, updatedAt

### Room Model
- id, boardingId (reference to Boarding)
- name, capacity, gender (Male/Female/Mixed)
- price, description, images[]
- isAvailable
- tenants[] (array of User IDs)
- createdAt, updatedAt

### RentPayment Model
- id, roomId, tenantId
- month (YYYY-MM format)
- rentAmount, isPaid, paidDate
- notes
- createdAt, updatedAt

### MonthlyBill Model
- id, roomId
- month (YYYY-MM format)
- dueDate, isPaid, paidAt
- createdAt, updatedAt

### BillType Model
- id, roomId
- name (e.g., "Electricity", "Water")
- createdAt, updatedAt

### BillAmount Model
- id, monthlyBillId, billTypeId
- amount
- createdAt, updatedAt

### BoardingProfile Model
- Student-specific boarding profile data
- Active boarding tracking
- Preferences and settings

### BoardingMonth Model
- Monthly student boarding records
- Stay duration tracking
- Payment associations

### PasswordReset Model
- Token, userId, expiresAt
- Used for password reset flow

---

## 🔄 API ENDPOINTS

### Authentication (`/api/auth`)
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- GET `/auth/me` - Get current user
- POST `/auth/logout` - User logout
- POST `/auth/forgot-password` - Send reset link
- POST `/auth/reset-password` - Reset password with token

### Boardings (`/api/boardings`)
- GET `/boardings` - List owner's boardings (private)
- GET `/boardings/public` - List all boardings (students)
- GET `/boardings/:id/public` - Get boarding details (public)
- POST `/boardings` - Create new boarding
- PUT `/boardings/:id` - Update boarding
- DELETE `/boardings/:id` - Delete boarding

### Rooms (`/api/rooms`)
- GET `/rooms` - List rooms (with filters)
- POST `/rooms` - Create new room
- PUT `/rooms` - Bulk update rooms
- GET `/rooms/:id` - Get room details
- PATCH `/rooms/:id` - Update room (availability, images, etc.)
- DELETE `/rooms/:id` - Delete room
- POST `/rooms/:id/tenants` - Add tenant to room

### Billing (`/api/monthly-bills`)
- GET `/monthly-bills` - Get bills for boarding/month
- POST `/monthly-bills` - Create/update monthly bills

### Bill Types (`/api/bill-types`)
- GET `/bill-types` - List bill types for room
- POST `/bill-types` - Create new bill type
- DELETE `/bill-types/:id` - Delete bill type

### Rent Payments (`/api/rent-payments`)
- GET `/rent-payments` - List rent payments
- POST `/rent-payments` - Create rent payment
- PATCH `/rent-payments/:id` - Update payment status

### Boarding Status (`/api/boarding/status`)
- GET `/boarding/status` - Check student check-in status
- POST `/boarding/status` - Update check-in/check-out

### Boarding Summary (`/api/boarding/summary`)
- GET `/boarding/summary` - Get comprehensive boarding info
  - Current billing
  - Previous billing
  - Stay calendar
  - Billing history chart

### AI Recommendations (`/api/recommendations`)
- POST `/recommendations` - Generate AI boarding recommendations

### User Profile (`/api/users/profile`)
- GET `/users/profile` - Get user profile
- PUT `/users/profile` - Update user profile

### Owner Dashboard (`/api/owner-dashboard`)
- GET `/owner-dashboard` - Get dashboard statistics and analytics

---

## 🌟 UNIQUE SELLING POINTS

1. **AI-Powered Matching**: Only platform with Gemini AI-based recommendations
2. **Dual Role System**: Seamlessly serves both students and owners
3. **Flexible Billing**: Configure unlimited custom bill types
4. **Visual Analytics**: Interactive charts and graphs for insights
5. **Transparent Pricing**: Itemized billing breakdown
6. **Real-time Updates**: Live availability and status tracking
7. **Comprehensive Management**: All-in-one solution for boarding operations
8. **Modern Tech Stack**: Built with latest technologies for performance
9. **Mobile Responsive**: Works perfectly on all devices
10. **Secure & Reliable**: Enterprise-level security practices

---

## 📊 USE CASES

### For Students:
1. Finding accommodation near university
2. Comparing multiple boarding options
3. Getting personalized recommendations
4. Tracking monthly expenses
5. Managing stay and payments
6. Planning budget for accommodation

### For Owners:
1. Managing multiple properties
2. Tracking revenue and expenses
3. Managing room availability
4. Billing tenants efficiently
5. Monitoring occupancy rates
6. Generating financial reports
7. Communicating with tenants

---

## 🚀 FUTURE ENHANCEMENTS (Potential)

- Online payment integration
- Messaging system between students and owners
- Booking/reservation system
- Review and rating system
- Virtual tours of boardings
- Maintenance request tracking
- Contract management
- Mobile app versions
- Push notifications
- Email notifications for payments
- Advanced analytics and reporting
- Export data to Excel/PDF
- Multi-language support
- Integration with university systems

---

## 📈 METRICS & ANALYTICS

### For Students:
- Boarding search success rate
- Average time to find boarding
- Payment history trends
- Stay duration statistics

### For Owners:
- Total revenue (monthly, yearly)
- Occupancy rate
- Revenue per room
- Collection efficiency
- Tenant retention rate
- Average stay duration
- Most profitable rooms
- Seasonal trends

---

This comprehensive features summary provides a complete overview of BoardWise's capabilities. Use this document as a reference when creating content, presentations, or documentation about the platform.
