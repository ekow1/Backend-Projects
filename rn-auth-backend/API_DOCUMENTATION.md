# Authentication & Profile API Documentation

## Overview
This is a Node.js/Express API with MongoDB for user authentication and profile management. The API provides user registration, login, profile retrieval, and profile updates with JWT-based authentication.

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Model
```javascript
{
  name: String (required),
  phone: String (required, unique),
  password: String (required, hashed),
  address: String (optional),
  email: String (optional),
  gender: String (optional, enum: ['male', 'female', 'other']),
  dateOfBirth: Date (optional),
  image: String (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Endpoints

### Authentication Routes

#### Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user
- **Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "password": "securePassword123",
  "address": "123 Main St, City, Country",
  "email": "john@example.com",
  "gender": "male",
  "dateOfBirth": "1990-01-15",
  "image": "https://example.com/profile.jpg"
}
```
- **Required Fields:** `name`, `phone`, `password`
- **Optional Fields:** `address`, `email`, `gender`, `dateOfBirth`, `image`
- **Response:**
```json
{
  "message": "User created successfully"
}
```
- **Status Codes:**
  - `201`: User created successfully
  - `400`: Phone already in use
  - `500`: Server error

#### Login User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Login user and receive JWT token
- **Request Body:**
```json
{
  "phone": "+1234567890",
  "password": "securePassword123"
}
```
- **Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```
- **Status Codes:**
  - `200`: Login successful
  - `404`: User not found
  - `401`: Invalid credentials
  - `500`: Server error

#### Logout User
- **URL:** `/auth/logout`
- **Method:** `POST`
- **Description:** Logout user (client-side token removal required)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** None required
- **Response:**
```json
{
  "message": "Logged out successfully",
  "instructions": "Please remove the token from client storage"
}
```
- **Status Codes:**
  - `200`: Logout successful
  - `401`: Unauthorized - Invalid or missing token
  - `500`: Server error

### Profile Routes
*All profile routes require authentication*

#### Get User Profile
- **URL:** `/profile/user`
- **Method:** `GET`
- **Description:** Get current user's profile information
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "email": "john@example.com",
  "gender": "male",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "image": "https://example.com/profile.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
- **Status Codes:**
  - `200`: Profile retrieved successfully
  - `401`: Unauthorized
  - `500`: Server error

#### Update User Profile
- **URL:** `/profile/user`
- **Method:** `PUT`
- **Description:** Update user profile information (excluding image)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name": "John Smith",
  "address": "456 New St, City, Country",
  "email": "johnsmith@example.com",
  "gender": "male",
  "dateOfBirth": "1990-01-15"
}
```
- **Note:** All fields are optional. Only provided fields will be updated.
- **Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Smith",
    "phone": "+1234567890",
    "address": "456 New St, City, Country",
    "email": "johnsmith@example.com",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "image": "https://example.com/profile.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```
- **Status Codes:**
  - `200`: Profile updated successfully
  - `401`: Unauthorized
  - `500`: Server error

#### Update Profile Image
- **URL:** `/profile/user/image`
- **Method:** `PATCH`
- **Description:** Upload and update user's profile image to local storage
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`
- **Request Body:** Form data with image file
  - `image`: Image file (max 5MB, supported formats: jpg, jpeg, png, gif, webp)
- **Response:**
```json
{
  "message": "Profile image updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Smith",
    "phone": "+1234567890",
    "address": "456 New St, City, Country",
    "email": "johnsmith@example.com",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "image": "/uploads/user_id_uuid.jpg",
    "imagePath": "user_id/uuid.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  }
}
```
- **Status Codes:**
  - `200`: Image uploaded and updated successfully
  - `400`: Image file is required
  - `401`: Unauthorized
  - `500`: Server error (upload failed)

## Error Responses
All endpoints may return the following error format:
```json
{
  "message": "Error description"
}
```

## Environment Variables
Make sure to set up the following environment variables:
```
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/your-database
PORT=3000
```

## Usage Examples

### Registration Example
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "password": "securePassword123",
    "email": "john@example.com"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "password": "securePassword123"
  }'
```

### Logout Example
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer your-jwt-token"
```

### Get Profile Example
```bash
curl -X GET http://localhost:3000/api/profile/user \
  -H "Authorization: Bearer your-jwt-token"
```

### Update Profile Example
```bash
curl -X PUT http://localhost:3000/api/profile/user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }'
```

### Update Profile Image Example
```bash
curl -X PATCH http://localhost:3000/api/profile/user/image \
  -H "Authorization: Bearer your-jwt-token" \
  -F "image=@/path/to/your/image.jpg"
```

## Security Notes
- Passwords are hashed using bcrypt before storage
- JWT tokens expire in 1 day
- Phone numbers must be unique
- All profile routes require valid JWT authentication
- Passwords are never returned in API responses

## Database Schema
The API uses MongoDB with Mongoose ODM. The User collection includes automatic timestamps and password hashing middleware.

## Swagger Documentation
The API includes Swagger documentation. Access it at:
```
http://localhost:3000/api-docs
```