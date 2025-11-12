# Spine Aid

A responsive web application for raising awareness of spinal cord injuries while coordinating in-kind donations (wheelchairs, mobility aids, medical supplies).

## Features

- **Dual Onboarding**: Separate flows for Donor teams and Recipient support teams with profile verification
- **Donation Matching**: Browse, filter, and request available items with photos and condition details
- **Messaging & Logistics**: Coordinate handoffs with status tracking (offered → accepted → in transit → delivered)
- **Content Pages**: Homepage with mission, impact stats, stories/testimonials, educational resources
- **Dashboard**: Inventory management, request queue, notifications, delivery status timeline
- **Accessibility**: WCAG-compliant design with keyboard navigation and high-contrast options
- **Security**: Secure authentication, role-based permissions, and audit trails

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with role-based access control
- **Maps**: Mapbox for location features
- **File Uploads**: Multer for handling image uploads

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/              # Next.js app directory
│   ├── (auth)/      # Authentication pages
│   ├── (dashboard)/ # Dashboard pages
│   ├── api/         # API routes
│   └── page.tsx     # Homepage
├── components/       # React components
├── lib/             # Utilities and helpers
├── prisma/          # Database schema
└── public/          # Static assets
```

## License

MIT


