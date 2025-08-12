# Frontend Application

A modern Next.js application for CRO (Conversion Rate Optimization) analysis with a beautiful, responsive UI.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (default: http://localhost:3001)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Configure your backend URL in `.env.local`:
```env
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=CRO Analysis
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── download-report/
│   │   │   └── route.ts          # Report download endpoint
│   │   └── send-report/
│   │       └── route.ts          # Report download endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
```

## API Endpoints

The frontend proxies requests to your backend server:

- `POST /api/download-report` - Download analysis report as PDF
- `POST /api/send-report` - Send analysis report via email

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_URL` | Backend server URL | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `CRO Analysis` |

## Features

### Sequential Analysis
- Comprehensive e-commerce website analysis
- Progress tracking with step-by-step feedback
- Error handling with user-friendly messages

### Modern UI/UX
- Gradient backgrounds and smooth animations
- Responsive design for all screen sizes
- Accessible components with proper ARIA labels
- Loading states and success/error feedback

### Report Management
- Tabbed interface for different page types
- Download reports as PDF
- User information collection modal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the CRO Analysis application.
