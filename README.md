# CRO Analysis Frontend

A modern Next.js frontend for the CRO Analysis application with TypeScript, Tailwind CSS, and App Router.

## Features

- 🚀 **Instant Analysis** - Real-time CRO analysis for ecommerce websites
- 🎯 **Actionable Insights** - Clear problems and solutions for conversion optimization
- ⏰ **Real-Time Results** - Live status updates during analysis
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)
- **Backend**: Separate Node.js server (configured via environment variables)

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
│   │   ├── ecommerce-screenshots/
│   │   │   └── route.ts          # SSE endpoint for analysis
│   │   └── send-report/
│   │       └── route.ts          # Report download endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
```

## API Endpoints

The frontend proxies requests to your backend server:

- `GET /api/ecommerce-screenshots?domain={domain}` - Start CRO analysis
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

### Real-time Analysis
- Server-Sent Events (SSE) for live status updates
- Progress tracking with step-by-step feedback
- Error handling with user-friendly messages

### Modern UI/UX
- Gradient backgrounds and smooth animations
- Responsive design for all screen sizes
- Accessible components with proper ARIA labels
- Loading states and success/error feedback

### Report Management
- Tabbed interface for different page types
- Download reports via email
- User information collection modal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the CRO Analysis application.
