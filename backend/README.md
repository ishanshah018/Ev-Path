# EV-PATH Backend Setup

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
PORT=8080
MONGO_CONN=mongodb://localhost:27017/evpath
JWT_SECRET=your_jwt_secret_key_here_make_it_strong_and_random_123456789
```

**Important:** Replace `JWT_SECRET` with a strong, random secret key.

## Database Setup

1. Make sure MongoDB is installed and running on your machine
2. The app will connect to `mongodb://localhost:27017/evpath`
3. The database and collections will be created automatically when you first run the app

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:8080

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user

### Products (Protected)
- `GET /products` - Get products (requires authentication)

## Testing the API

You can test the authentication endpoints using curl or Postman:

### Signup
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Frontend Integration

The frontend is configured to make requests to `http://localhost:8080`. Make sure the backend is running before starting the frontend.


