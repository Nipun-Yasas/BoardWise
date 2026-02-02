# 🏠 BoardWise

**BoardWise** is a comprehensive student boarding place discovery and management platform that connects students seeking accommodation with boarding place owners. It provides a centralized solution for students to search, compare, and book boarding accommodations near universities, while enabling owners to efficiently manage their properties.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🌟 Features

### For Students
- 🔍 **Smart Search & Filtering** - Find boarding places by location, distance from university, price range, and capacity
- ✅ **Verified Listings** - Browse verified properties with authentic photos and transparent pricing
- ⭐ **Student Reviews** - Read honest reviews from fellow students
- 📅 **Easy Booking** - Simple and secure booking process with instant confirmation
- 📊 **Stay Tracking** - Track arrival/departure dates and monitor stay history
- 💰 **Billing Management** - View billing history with detailed charts and payment tracking
- 📱 **Personal Dashboard** - Access personalized dashboard with boarding status and analytics
- 👤 **Profile Management** - Update personal information and preferences

### For Boarding Place Owners
- 🏢 **Property Management** - Add and manage multiple boarding rooms with capacity and pricing
- 📝 **General Information Tab** - Edit boarding name, description, and main image
- 🏠 **Rooms Management** - Create/edit rooms with capacity, price, descriptions, and images
- 💵 **Billing Configuration** - Configure bill types (electricity, water, etc.) and manage monthly billing
- 📈 **Revenue Dashboard** - Track total monthly revenue, active members, and operational costs
- 📊 **Analytics & Reports** - Monitor room occupancy, member trends, and revenue charts
- 🎯 **Bulk Management** - Efficiently manage multiple properties and associated rooms

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 with React 19.2.4
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Tabler Icons, Lucide Icons
- **Form Handling**: Formik + Yup validation
- **Charts**: Recharts
- **Animation**: Motion library
- **Theme**: next-themes (Dark/Light mode)
- **Date Handling**: date-fns
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB with Mongoose ODM 9.0.2
- **Authentication**: JWT (jose library) with secure HTTP-only cookies
- **Password Security**: bcryptjs (bcrypt hashing)
- **Email Service**: Nodemailer 7.0.13 (Gmail SMTP)

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Linter**: ESLint 9
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (local or cloud)
- Gmail account with App Password (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nipun-Yasas/BoardWise.git
   cd BoardWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Database Configuration
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/boardwise
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   
   # Email Configuration (for password reset functionality)
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   
   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Environment
   NODE_ENV=development
   ```
   
   **Note**: For Gmail, you need to:
   - Enable 2-Factor Authentication on your Google account
   - Generate an App Password at https://myaccount.google.com/apppasswords
   - Use the generated App Password in `EMAIL_PASSWORD`

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
BoardWise/
├── app/                        # Next.js App Router
│   ├── (owner)/               # Owner role routes
│   │   ├── manage/            # Property management
│   │   └── owner-dashboard/   # Owner dashboard
│   ├── (students)/            # Student role routes
│   │   ├── boarding/          # Boarding listings
│   │   ├── profile/           # Student profile
│   │   └── student-dashboard/ # Student dashboard
│   ├── _components/           # Shared components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── boarding/          # Boarding-related components
│   │   ├── landing/           # Landing page components
│   │   └── manage/            # Management components
│   ├── api/                   # API routes
│   │   └── auth/              # Authentication endpoints
│   ├── auth/                  # Authentication pages
│   ├── forgot-password/       # Password reset flow
│   ├── reset-password/        # Password reset page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── context/                   # React Context providers
│   └── AuthContext.tsx        # Authentication context
├── lib/                       # Utility libraries
│   ├── auth.ts                # Session management utilities
│   ├── axios.ts               # Axios configuration
│   ├── db.ts                  # Database connection
│   └── utils.ts               # Helper utilities
├── models/                    # Mongoose models
│   ├── User.ts                # User model
│   └── PasswordReset.ts       # Password reset token model
├── public/                    # Static assets
├── .gitignore                 # Git ignore rules
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔐 Authentication & Authorization

BoardWise uses a secure JWT-based authentication system:

### Authentication Flow
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server creates JWT token with user data (ID, email, role)
3. Token stored in secure HTTP-only cookie (24-hour expiration)
4. Protected routes verify token via `getSession()` utility
5. Role-based routing redirects users to appropriate dashboards

### User Roles
| Role | Dashboard Route | Permissions |
|------|----------------|-------------|
| **Student** | `/student-dashboard` | Browse boarding, book stays, manage profile, view billing |
| **Owner** | `/owner-dashboard` | Manage properties, rooms, billing, view analytics |
| **Guest** | `/auth` | Register or login |

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration (students & owners)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/forgot-password` - Initiate password reset (sends email)
- `POST /api/auth/reset-password` - Complete password reset with token

### Security Features
- ✅ Bcrypt password hashing (10 rounds)
- ✅ HTTP-only secure cookies
- ✅ SameSite cookie policy
- ✅ JWT token encryption
- ✅ CSRF protection
- ✅ Password reset tokens with 1-hour expiration
- ✅ Email verification for password reset

## 📊 Database Models

### User Model
```typescript
{
  name: String,           // User's full name
  email: String,          // Unique email address
  password: String,       // Bcrypt hashed password
  mobile_number: String,  // Contact number
  role: String,           // "student" or "owner"
  timestamps: true        // createdAt, updatedAt
}
```

### PasswordReset Model
```typescript
{
  userId: ObjectId,       // Reference to User
  token: String,          // Hashed reset token
  expiresAt: Date,        // Auto-deletes after 1 hour
  createdAt: Date         // Token creation timestamp
}
```

## 🎨 UI Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode Support** - System-aware theme switching with next-themes
- **Modern Components** - shadcn/ui and Radix UI primitives
- **Smooth Animations** - Motion library for engaging transitions
- **Interactive Charts** - Recharts for data visualization
- **Icon Library** - Tabler Icons and Lucide Icons

## 🧪 Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/boardwise` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `your-super-secret-key-here` |
| `EMAIL_USER` | Gmail address for sending emails | `yourapp@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password | `abcd efgh ijkl mnop` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Nipun Yasas**
- GitHub: [@Nipun-Yasas](https://github.com/Nipun-Yasas)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - Database platform
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">
  Made with ❤️ by Nipun Yasas
</div>
