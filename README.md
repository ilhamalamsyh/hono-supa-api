# Hono Chat API

A modern chat API built with Hono, TypeScript, and Supabase.

## Features

- 🔐 JWT Authentication (Register/Login)
- 👤 User Profile Management
- 📚 Interactive API Documentation (Swagger)
- 🐳 Docker Support
- ☁️ Vercel Serverless Deployment Ready

## Local Development

### Prerequisites

- Node.js 23
- npm or yarn
- Supabase account and project

### Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd hono-chat-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**

   ```bash
   # For development with hot reload
   npm run dev

   # For development with HTTP server
   npm run dev:server
   ```

5. **Access the API**
   - API: http://localhost:8080
   - Swagger Documentation: http://localhost:8080/docs
   - Health Check: http://localhost:8080/

## Docker Development

```bash
# Build and run with Docker Compose
docker-compose up hono-api-dev

# Build and run in detached mode
docker-compose up -d hono-api-dev

# Stop the services
docker-compose down
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### User (Protected)

- `GET /user/profile` - Get user profile (requires JWT token)

### Health

- `GET /` - Health check

## Vercel Deployment

### Prerequisites

- Vercel account
- Vercel CLI installed

### Deployment Steps

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Set Environment Variables**

   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add JWT_SECRET
   ```

4. **Deploy**

   ```bash
   vercel --prod
   ```

5. **Update Swagger Configuration**
   After deployment, update the production URL in `src/config/swagger.ts`:
   ```typescript
   {
     url: "https://your-actual-vercel-url.vercel.app",
     description: "Production server"
   }
   ```

### Environment Variables in Vercel

Make sure to set these environment variables in your Vercel project:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `JWT_SECRET` - Your JWT secret key

## API Documentation

Once deployed, access the interactive API documentation at:

- Local: http://localhost:8080/docs
- Production: https://your-vercel-url.vercel.app/docs

## Testing Protected Endpoints

1. **Register a user** using `POST /auth/register`
2. **Copy the JWT token** from the response
3. **Use the token** in the Authorization header:
   ```
   Authorization: Bearer your_jwt_token_here
   ```
4. **Test protected endpoints** like `GET /user/profile`

## Project Structure

```
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   ├── config/           # Configuration files
│   ├── controller/       # Request handlers
│   ├── dto/             # Data transfer objects
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── repository/      # Data access layer
│   ├── route/           # Route definitions
│   ├── service/         # Business logic
│   ├── utils/           # Utility functions
│   ├── index.ts         # Main application
│   └── server.ts        # Development server
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
├── docker-compose.yml   # Docker Compose configuration
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## Technologies Used

- **Framework**: Hono.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Vercel (Serverless)
- **Containerization**: Docker
