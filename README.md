# E-com Influencer Marketplace - Sign Up

A modern sign-up website for an E-commerce Influencer Marketplace where users can choose between being a Business or Influencer and select their contact preferences.

## Features

- **User Type Selection**: Choose between Business or Influencer role
- **Preference Selection**: 
  - **Business**: Choose to contact influencers or be contacted by them
  - **Influencer**: Choose to contact businesses or be contacted by them
- **User Registration**: Collect name, email, and password
- **Modern UI**: Beautiful gradient design with smooth animations

## Getting Started

### Installation

```bash
npm install
```

### Development

To run both the frontend and backend together:

```bash
npm run dev:all
```

Or run them separately:

**Backend Server:**
```bash
npm run server
```
The backend API will be available at `http://localhost:3001`

**Frontend:**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Database

The application uses SQLite database. The database file (`database.sqlite`) will be automatically created when you first run the server.

### API Endpoints

- `POST /api/signup` - Submit user registration data
- `GET /api/users` - Get all registered users (optional)
- `GET /api/health` - Health check endpoint

## Technology Stack

- React 18
- Vite
- CSS3 (with modern animations and gradients)
- Express.js (Backend API)
- SQLite (Local development) / Supabase (Production)

## Deployment

For instructions on deploying to production with Supabase, see [DEPLOYMENT.md](./DEPLOYMENT.md)
