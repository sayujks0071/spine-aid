# Spine Aid - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Mapbox API key for location features

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: (Optional) Mapbox token for maps
   - `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., http://localhost:3000)

3. **Set Up Database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Create Upload Directory**
   ```bash
   mkdir -p public/uploads/donations
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Implemented

### ✅ Core Features
- **Authentication System**: JWT-based auth with role-based access (Donor, Recipient, Admin)
- **Dual Onboarding**: Separate flows for Donors and Recipients with profile creation
- **Donation Management**: 
  - Create donations with photos, condition, location
  - Browse and filter available donations
  - Status tracking (Offered → Accepted → In Transit → Delivered)
- **Messaging System**: Real-time messaging between donors and recipients
- **Dashboard**: 
  - Stats overview
  - Inventory management
  - Request queue
  - Notifications
- **Content Pages**: Homepage, About, Resources, Volunteer
- **Accessibility**: WCAG-compliant design with keyboard navigation

### 🔧 Technical Features
- **Database**: PostgreSQL with Prisma ORM
- **File Uploads**: Photo uploads for donations
- **Audit Trail**: Complete audit logging for all actions
- **Security**: Secure authentication, role-based permissions
- **Responsive Design**: Mobile-first, accessible UI

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Dashboard pages
│   ├── api/             # API routes
│   ├── about/           # About page
│   ├── resources/       # Resources page
│   ├── volunteer/       # Volunteer page
│   └── page.tsx         # Homepage
├── components/          # React components
├── lib/                 # Utilities and helpers
├── prisma/              # Database schema
└── public/              # Static assets
```

## Next Steps (Optional Enhancements)

1. **Map Integration**: Add Mapbox integration for distance calculation
2. **Email Service**: Integrate email service for notifications
3. **Image Optimization**: Add image optimization and CDN
4. **Admin Panel**: Build admin moderation tools
5. **Gamification**: Add milestones and achievements
6. **AI Matching**: Implement AI-powered donation matching

## Production Deployment

1. Set up production database
2. Configure environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Build the application: `npm run build`
5. Deploy to your hosting platform (Vercel, AWS, etc.)

## Support

For issues or questions, please refer to the README.md or create an issue in the repository.

