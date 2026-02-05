# Unit Converter Application

A full stack unit conversion tool with authentication, history tracking, and a React-based interface. The project is split into an Express/MongoDB backend API and a Vite-powered React frontend.

## Features
- User authentication with hashed passwords and JWT-based sessions
- Conversion between common unit categories (length, weight, temperature, etc.)
- History of previous conversions stored per user
- Rate limiting, security headers, and CORS controls on the API
- Responsive UI built with React, Tailwind CSS, and React Router

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), Joi validation, JWT auth
- **Tooling:** Nodemon (dev), Helmet, Morgan, Express Rate Limit

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB instance (Atlas URI or local connection string)

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
NODE_ENV=development
JWT_SECRET=your_super_secret_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=https://your-deployed-backend.example.com/api
```
Leave this variable commented or unset for local development so the Vite dev proxy (configured in `frontend/vite.config.js`) forwards `/api` calls to `http://localhost:5000`.

## Installation
Clone the repository and install dependencies in each workspace:

```bash
git clone https://github.com/R-Tharanka/unit-converter-application.git
cd unit-converter-application

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## Running Locally
In two terminals:

1. **Backend**
	```bash
	cd backend
	npm run dev
	```
	Starts Express with Nodemon on port 5000.

2. **Frontend**
	```bash
	cd frontend
	npm run dev
	```
	Starts Vite dev server on port 5173. API calls to `/api` are proxied to the backend.

Visit `http://localhost:5173` to use the app.

## Building for Production
```bash
cd frontend
npm run build
```
Uploads the static assets to `frontend/dist`. Serve these files with a static file host or integrate with the backend.

## Deployment Notes
- Deploy the backend to a Node-compatible host (Railway, Render, Azure, etc.), ensuring environment variables are configured.
- On the frontend host (Netlify, Vercel, etc.), set `VITE_API_BASE_URL` to the deployed backend URL so runtime requests target the live API.
- If serving frontend and backend under the same origin, update `CLIENT_ORIGIN` in the backend `.env` accordingly and adjust any proxy rules as needed.

## Documentation
- API endpoints and request/response schemas are detailed in [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md).

## License
This project is licensed under the terms of the [MIT License](LICENSE).
 