# Expense-Tracker-App

A full-stack expense tracker built using the MERN stack to manage personal transactions and visualize transaction data through a dashboard.

## Live Demo

[View Live Application](https://expense-tracker-app-murex-six.vercel.app/)

## Features

- **User Authentication:** Signup and login using JWT authentication.
- **Email OTP Verification:** Email-based OTP verification during registration using Brevo.
- **Password Security:** Password hashing using bcrypt.
- **Forgot Password:** Password recovery and reset functionality.
- **Transaction Management:** Add, view, and manage financial transactions.
- **Dashboard:** View transaction information and visualize transaction data using a line chart.
- **Protected Routes:** Restrict access to authenticated resources.
- **Responsive Interface:** User interface built with React and Tailwind CSS.

## Tech Stack

### Frontend
- React.js
- JavaScript
- Tailwind CSS
- Ant Design
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Brevo Transactional Email API

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB

## Project Structure

```text
Expense-Tracker-App/
├── backend/
│   ├── src/
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.model.js
│   │   │   └── dashboard.route.js
│   │   ├── middleware/
│   │   │   └── guard.middleware.js
│   │   ├── transaction/
│   │   │   ├── transaction.controller.js
│   │   │   ├── transaction.model.js
│   │   │   └── transaction.route.js
│   │   ├── user/
│   │   ├── utils/
│   │   └── index.js
│   ├── nodemon.json
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── Guard/
│   │   ├── layout/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vercel.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Mansii-bit/Expense-Tracker-App.git
cd Expense-Tracker-App
```

### 2. Configure the Backend

Navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
AUTH_SECRET=your_jwt_secret
FORGOT_TOKEN_SECRET=your_password_reset_secret
ENVIRONMENT=development
DOMAIN=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
```

Replace the placeholder values with your own configuration. Use a valid Brevo API key and a verified sender email address. Ensure the environment variable names match those used in your backend code.

Start the backend server using the appropriate script configured in `package.json`. For example:

```bash
npm start
```

### 3. Configure the Frontend

Open a new terminal at the project root and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_BASE_URL=http://localhost:5000
```

Set `VITE_BASE_URL` to the URL where your backend server is running.

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Security

- Passwords are hashed using bcrypt before being stored in the database.
- JWT authentication is used to protect authenticated resources.
- Authentication cookies use the `HttpOnly` attribute when configured, preventing client-side JavaScript from reading them.
- Sensitive configuration values are managed through environment variables.
- Never commit real credentials, API keys, or `.env` files to GitHub.

## Future Improvements

- Monthly and category-wise expense summaries.
- Budget creation and spending-limit alerts.
- Advanced financial analytics and reporting.
- Export transactions to CSV or PDF.
- Transaction filtering and search.

## Author

**Mansi Singh**

- [GitHub Profile](https://github.com/Mansii-bit)
- [Project Repository](https://github.com/Mansii-bit/Expense-Tracker-App)

---

If you find this project useful, consider giving the repository a ⭐.