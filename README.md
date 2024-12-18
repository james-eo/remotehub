# RemoteHub - Advanced Remote Job Board Platform

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Database Schema](#database-schema)
9. [Third-Party Integrations](#third-party-integrations)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [License](#license)

## Introduction

RemoteHub is a sophisticated remote job board platform designed to compete with established job boards like Indeed.com, FlexJobs, Glassdoor, and Remotive. It offers a range of features for both job seekers and employers, providing a seamless experience for finding and posting remote job opportunities.

## Features

- User authentication (signup, login, logout)
- Advanced job search with autocomplete suggestions
- Job listings with infinite scroll
- Detailed job view pages
- Company profiles with reviews
- User dashboard
- Resume builder and parser
- Job recommendations based on user preferences
- Real-time messaging system between employers and job seekers
- Email notifications for job applications and new job postings
- Mobile-responsive design

## Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **API**: RESTful API
- **Real-time Communication**: Socket.io
- **Email Service**: SendGrid
- **Resume Parsing**: Affinda
- **Deployment**: Vercel (Frontend), Heroku (Backend)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/james-eo/remotehub.git
   cd remotehub
   ```

2. Install dependencies for both frontend and backend:

   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the development servers:

   ```
   # Start backend server
   cd backend
   npm start

   # Start frontend server
   cd frontend
   npx next dev
   ```

5. Open `http://localhost:3000` in your browser to view the application.

### Environment Variables

Create a `.env` file in both the `backend` and `frontend` directories with the following variables:

Backend (`backend/.env`):

```
PORT=5000
MONGO_URI=mongodb+srv://james:yKCtHy81r6NEwTsU@jobbaordapi.sxuvd.mongodb.net/jobboard?retryWrites=true&w=majority&appName=jobbaordapi
JWT_SECRET=oYsngNMDK2OPmg7iqJTyPqAhM0H+1Hb25QMdhXHTGMH5O4jQHssZW4cKXpkv8bTL
ZPjomo7O25jTBMyk1f5xkg==

JWT_EXPIRE=15dd
NEXT_PUBLIC_API_URL=http://localhost:5000/api

PORT=5000

Frontend (`frontend/.env.local`):

```
```

## Project Structure


remotehub/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   ├── utils/
│   └── package.json
└── README.md
```

## API Endpoints

- Auth:

  - POST /api/auth/signup
  - POST /api/auth/signin
  - GET /api/auth/signout
  - GET /api/auth/me

- Jobs:

  - GET /api/jobs
  - GET /api/jobs/:id
  - POST /api/jobs (protected, admin only)
  - PUT /api/jobs/:id (protected, admin only)
  - DELETE /api/jobs/:id (protected, admin only)
  - GET /api/jobs/recommendations (protected)

- Users:

  - GET /api/users (protected, admin only)
  - GET /api/users/:id (protected)
  - PUT /api/users/:id (protected)
  - DELETE /api/users/:id (protected, admin only)

- Companies:

  - GET /api/companies/:id/reviews
  - POST /api/companies/:id/reviews (protected)

- Conversations:

  - GET /api/conversations (protected)
  - GET /api/conversations/:id/messages (protected)
  - POST /api/conversations/:id/messages (protected)

- Resume:
  - GET /api/resume (protected)
  - PUT /api/resume (protected)

## Frontend Components

- Layout
- Navbar
- Footer
- JobCard
- JobList
- JobDetails
- AdvancedSearchBar
- CompanyReviews
- UserDashboard
- ResumeBuilder
- MessagingSystem
- JobRecommendations

## Database Schema

- User
- Job
- Company
- Review
- Conversation
- Message
- Resume

## Third-Party Integrations

- SendGrid for email notifications
- Affinda for resume parsing

## Deployment

1. Frontend (Render/Vercel):

   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy

2. Backend (Render/Heroku):
   - Create a new nder/ReHeroku app
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.
