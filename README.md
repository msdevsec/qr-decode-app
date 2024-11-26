# QRDecode.AI

A modern web application for scanning and managing QR codes with rate limiting and user authentication.

## Features

- 🔒 User Authentication & Authorization
- 📷 QR Code Scanning (Camera & Upload)
- 📊 Scan History & Statistics
- ⚡ Rate Limiting
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time Updates
- 📱 Responsive Design
- 🔍 Multiple QR Code Types Support
- 📈 Usage Statistics
- 🌐 Multi-platform Support

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Context for State Management
- Real-time Updates
- Progressive Web App (PWA) Support

### Backend
- Express.js with TypeScript
- Prisma ORM
- PostgreSQL Database
- Redis for Rate Limiting & Caching
- JWT Authentication
- Swagger API Documentation

### DevOps & Testing
- Docker & Docker Compose
- Jest for Testing
- GitHub Actions CI/CD
- Comprehensive Test Coverage
- API Documentation

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. Clone the repository
2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cd frontend && cp .env.example .env.local
cd ../backend && cp .env.example .env
```

4. Start the development environment:
```bash
# Start all services
docker-compose up -d

# Start frontend development server
cd frontend
npm run dev

# Start backend development server
cd ../backend
npm run dev
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Documentation: http://localhost:4000/api-docs

## Development

### Project Structure
```
.
├── frontend/               # Next.js frontend application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── context/          # React context providers
│   └── public/           # Static assets
│
├── backend/               # Express.js backend application
│   ├── src/              # Source code
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── prisma/           # Database schema and migrations
│
└── docker/               # Docker configuration files
```

### Testing
```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

### API Documentation
The API documentation is available at http://localhost:4000/api-docs when running the development server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- QR Code scanning powered by jsQR
- UI components inspired by Tailwind UI
- Icons from Heroicons
