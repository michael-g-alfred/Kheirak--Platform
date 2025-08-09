# Kheirak Platform 🤝

A comprehensive donation and coupon management platform built with React and Firebase, supporting multiple user roles and real-time interactions.

## 🌟 Features

- **Multi-Role System**: Admin, Donor, Organization, Beneficiary, and Guest roles
- **Coupon Management**: Create, distribute, and redeem coupons with real-time tracking
- **Donation Posts**: Share and manage donation requests
- **Real-time Updates**: Live data synchronization using Firebase Firestore
- **Arabic Support**: Full RTL (Right-to-Left) layout and Arabic localization
- **Responsive Design**: Mobile-first approach with modern UI

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 + Vite
- **Styling**: TailwindCSS 4.1.11
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Form Validation**: Yup + React Hook Form
- **Date Handling**: date-fns with Arabic locale

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Kheirak--Platform.git
cd Kheirak--Platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update Firebase configuration in `src/Firebase/Firebase.js`

4. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── CouponCard.jsx    # Coupon display & redemption
│   ├── PostCard.jsx      # Donation posts
│   ├── Navbar.jsx        # Navigation
│   └── Admin/            # Admin-specific components
├── pages/            # Route pages
│   ├── Home.jsx
│   ├── AdminDashboard.jsx
│   └── Profile pages for each role
├── layouts/          # Layout components
├── context/          # React Context (Auth)
├── Firebase/         # Firebase configuration
├── routes/           # Route definitions
└── utils/            # Utility functions
```

## 👥 User Roles

- **Admin**: Full system management and oversight
- **Donor**: Create donation posts and redeem coupons
- **Organization**: Create and manage coupon campaigns
- **Beneficiary**: Receive donations and use available coupons
- **Guest**: Browse public content with limited access

## 🔥 Firebase Setup

1. **Authentication**: Configure sign-in methods (Email/Password)
2. **Firestore Collections**:
   - `Users`: User profiles and role information
   - `Coupons`: Coupon data and usage tracking
   - `Posts`: Donation posts and requests
   - `Notifications`: User notifications

## 🎨 Key Features

### Coupon System
- Real-time coupon creation and management
- Usage tracking with beneficiary information
- Stock management and availability status
- Confirmation dialogs for redemption

### Donation Management
- Post creation with rich content
- Real-time updates on donation status
- User interaction tracking
- Admin moderation capabilities

### User Management
- Role-based access control
- Profile management for different user types
- Authentication state persistence
- Protected routes and components

## 🚀 Deployment

The project is configured for Firebase Hosting:

```bash
npm run build
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
