

# BloggIt — Full-Stack Blogging Platform

BloggIt is a full-stack blogging platform built using the **MERN stack**, with a focus on **backend architecture, authentication, and production deployment**.
The application allows users to create, manage, and publish blog posts while providing real-time grammar feedback during content creation.

The project demonstrates practical experience with **RESTful APIs, JWT authentication, Dockerized services, and cloud deployment on AWS**.

### read more about the backend infrastucture here- https://github.com/sukirth-singh-gaur/BloggIt-Backend/
---

## Features

* User authentication using **JWT stored in HTTP-only cookies**
* Role-based access control for protected routes
* CRUD operations for blogs and comments
* Rich text editor with **image uploads to Cloudinary**
* Integrated **grammar-correction microservice** using LanguageTool
* Secure production deployment with **Docker, Nginx, and HTTPS**

---

## Architecture Overview

```
Frontend (React, Vercel)
        |
        | HTTPS (REST APIs)
        v
Backend (Node.js + Express, Docker)
        |
        | Internal API
        v
Grammar Service (LanguageTool, Docker)
        |
        v
MongoDB Atlas
```

* The frontend communicates with the backend via REST APIs.
* Authentication is handled using JWTs stored in HTTP-only cookies.
* Grammar checking is delegated to a separate containerized service.
* Nginx acts as a reverse proxy and handles HTTPS termination.

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* Cloudinary (media storage)

### DevOps & Infrastructure

* Docker
* Nginx
* AWS EC2
* Let’s Encrypt (HTTPS)

### Microservice

* LanguageTool (grammar correction)

---

##  Authentication Flow

1. User logs in with email and password.
2. Backend verifies credentials and issues a JWT.
3. JWT is stored in an **HTTP-only cookie**.
4. Protected routes validate the token via middleware.
5. Role checks determine access permissions.

This approach improves security by preventing client-side access to tokens.

---

##  Deployment Strategy

* Backend and grammar service are containerized using Docker.
* Services are deployed on an AWS EC2 instance.
* Nginx routes incoming HTTPS traffic to backend services.
* Frontend is deployed separately on Vercel.
* Environment variables are used for secrets and configuration.

---

##  Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5001
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=<cloudinary_name>
CLOUDINARY_API_KEY=<cloudinary_key>
CLOUDINARY_API_SECRET=<cloudinary_secret>

LANGUAGETOOL_URL=http://languagetool:8010
NODE_ENV=production
```

---

##  Running Locally with Docker

###  Clone the repository

```bash
git clone https://github.com/sukirth-singh-gaur/BloggIt-Backend.git
cd BloggIt-Backend
```

###  Build and run containers

```bash
docker compose up --build
```

###  Access the application

* Backend API: `http://localhost:5001`
* Grammar Service: `http://localhost:8010`

---

##  Sample API Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/users/register` | Register a new user |
| POST   | `/api/users/login`    | Authenticate user   |
| GET    | `/api/users/profile`  | Get user profile    |
| GET    | `/api/blogs`          | Fetch all blogs     |
| POST   | `/api/blogs`          | Create a blog       |
| POST   | `/api/grammar-check`  | Grammar validation  |

---

##  Key Learnings

* Implementing secure cookie-based authentication across domains
* Handling CORS and HTTPS issues in production
* Containerizing and deploying microservices
* Debugging real-world deployment issues on cloud infrastructure

---

##  License

This project is for educational and learning purposes.

---

##  Author

**Sukirth Singh Gaur**
GitHub: [github.com/sukirth-singh-gaur](https://github.com/sukirth-singh-gaur)

---
