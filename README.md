# SecureBank - Advanced Banking Application

A full-featured banking application built with React, featuring account management, money transfers, bill payments, and investment tracking.

## Features

### 🔐 Authentication
- User login and registration
- Secure token-based authentication
- Protected routes

### 💰 Account Management
- View multiple accounts
- Check account balances
- Account details view

### 💸 Money Transfer
- Transfer between accounts
- Add transfer descriptions
- Real-time confirmation

### 📊 Transaction History
- View complete transaction history
- Filter by account
- Transaction details (date, type, amount)

### 📧 Bill Payment
- View pending bills
- Pay bills online
- Custom payment amounts

### 📈 Investments
- View investment portfolio
- Buy stocks
- Sell investments
- Track portfolio value

### 🔔 Notifications
- Receive transaction alerts
- View notification history
- Mark notifications as read

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `VITE_API_URL` in `.env` with your backend API URL

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Transfer.jsx
│   ├── Transactions.jsx
│   ├── Bills.jsx
│   └── Investments.jsx
├── components/      # Reusable components
│   ├── Navbar.jsx
│   └── PrivateRoute.jsx
├── context/         # React Context
│   └── AuthContext.jsx
├── hooks/          # Custom hooks
│   └── useAuth.js
├── services/       # API services
│   └── api.js
├── App.jsx         # Main App component
└── index.css       # Tailwind CSS imports
```

## API Endpoints Required

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Accounts
- `GET /accounts` - Get all accounts
- `GET /accounts/:id` - Get account details
- `GET /accounts/:id/balance` - Get account balance

### Transactions
- `GET /transactions/:accountId` - Get transaction history
- `POST /transactions/transfer` - Transfer money

### Bills
- `GET /bills` - Get all bills
- `POST /bills/pay` - Pay a bill

### Investments
- `GET /investments/portfolio` - Get portfolio
- `POST /investments/buy` - Buy investment
- `POST /investments/sell/:id` - Sell investment

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

## Authentication Flow

The app uses JWT tokens for authentication:
1. User logs in with email and password
2. Backend returns a token
3. Token is stored in localStorage
4. Token is included in all API requests via Authorization header
5. Protected routes check for user session

## Styling

The app uses Tailwind CSS with custom color theme:
- **Primary**: #1F2937 (Dark gray)
- **Secondary**: #10B981 (Green)
- **Accent**: #F59E0B (Amber)

## Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint with ESLint
npm run lint
```

## Notes

- Ensure your backend API is running on the URL specified in `.env`
- All API requests require valid authentication token (except /auth/login and /auth/register)
- The app stores user data and auth token in localStorage for persistence

## Future Enhancements

- Add payment method management
- Implement transaction search and filtering
- Add credit/debit card management
- Mobile app version
- Real-time notifications via WebSocket
- Two-factor authentication
- Transaction receipts export
- Budget management and analytics

## License

MIT
