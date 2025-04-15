# Finance Tracker Auth System API
This is the backend authentication API for the Finance Tracker application. It provides RESTful endpoints for user registration, login, and secure session handling using JWT tokens and bcrypt. This API is designed to integrate with the [client-side React app](https://github.com/diwakarstha997/finance-tracker-auth-system-client).

## Project Structure
    finance-tracker-auth-system-api/
    ├── config/
    │   └── dbConfig.js           # MongoDB connection logic
    │   └── mailConfig.js           # NodeMailer Configuration
    ├── model/
    ├── schema/
    ├── routers/
    ├── utility/           # Helper Functions
    ├── .env
    ├── server.js
    └── package.json
    └── README.md

## Features
- User Registration
- Secure Login with JWT
- Token-based Authentication
- Password Hashing with bcrypt
- Input Validation
- RESTful API Endpoints

## Tech Stack
- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment variables
- **CORS** for cross-origin requests

## Live Demo Link
> [http://ft-client-bucket.s3-website-ap-southeast-2.amazonaws.com](http://ft-client-bucket.s3-website-ap-southeast-2.amazonaws.com)

## Setup Instruction
### 1. Clone the Repository
> `git clone git@github.com:diwakarstha997/finance-tracker-auth-system-api.git`

> `cd finance-tracker-auth-system-api`

### 2. Install Dependencies
> `yarn install`

### 3. Create .env File
    Create a .env file at the root level with following environment variables:
> **General Environment Variables**

    CLIENT_ROOT_URL = <Frontend URL>            # the URL where your React client runs
    SERVER_PORT = 8080                          # Server Port (you can change this if needed)
    DB_CONNECT_URL = <MongoDB Connection URL>   # Example: mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

> **JWT Secrets (use strong random strings for security)**

    JWT_ACCESS_SECRET = your_random_access_token_secret
    JWT_REFRESH_SECRET = your_random_refresh_token_secret

> **SMTP Configuration (for sending emails like verification or password reset)**

    SMTP_HOST = smtp.gmail.com                 # For Gmail SMTP
    SMTP_PORT=587                              # Port for TLS
    SMTP_USER=your_email@gmail.com             # Sender email address
    SMTP_PASS=your_email_app_password          # App password or SMTP password




### 4. Run the Development Server
> `yarn dev`

## API Endpoints
| Method | Endpoint | Description |
| ----------- | ----------- |----------- |
| POST | /api/v1/users | Register a new user |
| POST | /api/v1/users/login | Authenticate existing user |
| POST | /api/v1/users/logout | Logout user and clear refresh token |
| PATCH | /api/v1/users| Verify user account (email/token verification) |
| GET | /api/v1/users | Fetch authenticated user's information |
| GET | /api/v1/users/accessjwt | Generate new access token using refresh token |

## Client Integration
This API works with the following frontend client:

Frontend Repo Link: [https://github.com/diwakarstha997/finance-tracker-auth-system-client](https://github.com/diwakarstha997/finance-tracker-auth-system-client)

# 📝 Notes
- ### Ensure MongoDB is running and accessible 
    Install the mongoDb and mongo compass based on your system [MongoDb Installation Documentation](https://www.mongodb.com/docs/manual/administration/install-community/) & [MongoDb Compass Installation Documentation](https://www.mongodb.com/docs/compass/current/install/).
