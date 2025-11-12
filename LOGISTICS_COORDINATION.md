# Logistics Coordination in Spine Aid

## Overview
Complete logistics coordination flow from donation listing to delivery confirmation, with integrated messaging, verification, and documentation.

---

## ✅ Implemented Features

### 1. **Donation Flow & Status Tracking**

**Status Progression:**
- `OFFERED` → `ACCEPTED` → `IN_TRANSIT` → `DELIVERED`
- `CANCELLED` (at any stage)

**API Endpoints:**
- `POST /api/donations/create` - List new donation
- `GET /api/donations/browse` - Browse available donations (recipients)
- `GET /api/donations/my` - View own donations (donors)
- `GET /api/donations/[id]` - Get donation details with full history
- `PATCH /api/donations/[id]/status` - Update donation status
- `POST /api/donations/[id]/request` - Request a donation (recipients)
- `POST /api/donations/[id]/accept` - Accept a request (donors)
- `POST /api/donations/[id]/delivery` - Confirm delivery with photos/signature

**Status History:**
- Every status change is tracked in `DonationStatusHistory`
- Includes notes, timestamp, and who made the change
- Visible in donation detail page timeline

---

### 2. **In-App Messaging for Handoffs**

**Features:**
- Messages linked to donations via `donationId` field
- Real-time conversation view in `/dashboard/messages`
- Messages persist with donation record
- Unread message tracking
- Direct link from donation page to message recipient

**API Endpoints:**
- `GET /api/messages/conversations` - List all conversations
- `GET /api/messages/[userId]` - Get messages with specific user
- `POST /api/messages/send` - Send message (can include donationId)

**Usage:**
- Donors and recipients can coordinate pickup/delivery details
- All communication stays within platform
- No need to share phone numbers or WhatsApp

---

### 3. **Verification & Documentation**

**Profile Verification:**
- `requireAuth()` on all donation APIs
- Onboarding flow (`/dashboard/onboarding`) collects:
  - Donor profiles: Organization details, CSR info
  - Recipient profiles: Medical needs, location, verification docs
- `verificationStatus` field tracks: PENDING → VERIFIED → REJECTED

**Document Requirements:**
- e-KYC for donors
- Hospital references for recipients
- CSR documentation for corporate donors
- All stored in user profiles

---

### 4. **Regional Logistics Champions**

**Volunteer Roles** (from `/volunteer` page):
- **Regional Logistics Champion** - Coordinate pickups in Indian cities
- **Translation & Accessibility** - Localize materials
- **Diaspora Donation Concierge** - Support overseas donors
- **Clinical Content Studio** - Curate resources

**Integration:**
- Volunteers can be assigned to donations (future enhancement)
- GiveOrVolunteer component surfaces urgent needs weekly
- Links to volunteer registration

---

### 5. **Global Shipments & Document Management**

**Gemini File API Integration:**
- Upload customs documents, invoices, shipping papers
- Search documents: "What documents are needed for Singapore to India shipment?"
- Generate impact summaries with context
- All via `/api/gemini/*` endpoints

**Document Library:**
- `/dashboard/documents` - Upload, manage, search documents
- Upload CSR guidelines, customs procedures, impact templates
- Search across all uploaded files
- Delete outdated documents

**Use Cases:**
- Diaspora donors upload shipping invoices
- Search: "What's the customs clearance process?"
- Generate CSR reports from uploaded templates
- Store and retrieve compliance documents

---

### 6. **Delivery Confirmation & Proof**

**Features:**
- Delivery confirmation form with:
  - Multiple delivery photos
  - Recipient signature (canvas-based)
  - Delivery notes
- Photos and signature saved to `/uploads/deliveries/[donationId]/`
- Confirmation stored in audit log with metadata
- Both donor and recipient can confirm delivery

**API:**
- `POST /api/donations/[id]/delivery`
- Accepts base64 images for photos and signature
- Creates status history entry
- Sends notifications to both parties

**Proof Trail:**
- All delivery confirmations stored in `AuditLog` with details
- Photos accessible for CSR reports
- Signature for legal compliance
- Timeline visible in donation detail page

---

## 📋 Complete Workflow

### For Donors:
1. **List Donation** → `/dashboard/donations/new`
   - Upload photos, set location, pickup/dropoff options
2. **Receive Requests** → View in donation detail page
3. **Accept Request** → Click "Accept" on a request
4. **Coordinate Logistics** → Message recipient via in-app chat
5. **Update Status** → Mark as "In Transit" when shipped
6. **Confirm Delivery** → Recipient confirms, donor gets notification

### For Recipients:
1. **Browse Donations** → `/dashboard/browse`
   - Filter by category, condition, location
2. **Request Donation** → Click "Request This Donation"
3. **Wait for Acceptance** → Get notification when accepted
4. **Coordinate Pickup** → Message donor via in-app chat
5. **Confirm Delivery** → Upload photos, sign, add notes

---

## 🔄 Status Transition Rules

**Valid Transitions:**
- `OFFERED` → `ACCEPTED` (donor accepts request)
- `OFFERED` → `CANCELLED` (donor cancels)
- `ACCEPTED` → `IN_TRANSIT` (item shipped/picked up)
- `ACCEPTED` → `CANCELLED` (either party cancels)
- `IN_TRANSIT` → `DELIVERED` (delivery confirmed)
- `IN_TRANSIT` → `CANCELLED` (rare, but possible)

**Invalid Transitions:**
- Cannot skip statuses (e.g., OFFERED → DELIVERED)
- Cannot go backwards (e.g., IN_TRANSIT → ACCEPTED)
- Final states (DELIVERED, CANCELLED) cannot be changed

---

## 📱 UI Components

### Donation Detail Page (`/dashboard/donations/[id]`)
- Full donation information
- Status timeline with history
- Request/Accept buttons (role-based)
- Status update buttons
- Delivery confirmation form
- Quick link to messaging
- Matched recipient info

### Delivery Confirmation Component
- Photo upload (multiple)
- Canvas-based signature
- Delivery notes
- Submit confirmation

---

## 🔐 Security & Permissions

**Role-Based Access:**
- Donors: Can list, accept requests, update status of their donations
- Recipients: Can browse, request, confirm delivery of accepted donations
- Admins: Can view and update all donations

**Verification:**
- All API routes use `requireAuth()`
- Status updates verify ownership/relationship
- Delivery confirmation checks recipient/donor relationship

---

## 📊 Audit Trail

**Complete Logging:**
- Every status change logged in `DonationStatusHistory`
- All actions logged in `AuditLog` with:
  - User ID
  - Action type
  - Entity type and ID
  - Timestamp
  - IP address (if available)
  - Additional details (JSON)

**Use Cases:**
- CSR compliance reporting
- Dispute resolution
- Analytics and insights
- Security monitoring

---

## 🚀 Future Enhancements

### Missing Features (Can be added):

1. **Courier API Integration**
   - Connect to Blue Dart, FedEx, etc.
   - Auto-generate shipping labels
   - Real-time tracking updates
   - **Missing:** Courier API credentials and integration

2. **Route Planning**
   - Optimize pickup/delivery routes for volunteers
   - Multi-stop coordination
   - **Missing:** Route optimization algorithm/service

3. **Volunteer Assignment**
   - Assign volunteers to specific donations
   - Volunteer dashboard for assigned tasks
   - **Missing:** Volunteer-donation relationship in schema

4. **Automated Notifications**
   - Email/SMS notifications for status changes
   - WhatsApp integration for Indian users
   - **Missing:** Email/SMS service integration

5. **Document Templates**
   - Pre-filled CSR report templates
   - Customs declaration forms
   - **Missing:** Template library

6. **Real-time Tracking**
   - Live location updates during transit
   - ETA calculations
   - **Missing:** GPS tracking integration

---

## 📝 Current Capabilities Summary

✅ **Complete:**
- Donation listing and browsing
- Request/accept flow
- Status tracking with history
- In-app messaging
- Delivery confirmation with photos/signature
- Document upload and search (Gemini)
- Verification system
- Audit logging

⏳ **Ready for Integration:**
- Courier APIs (need credentials)
- Email/SMS services (need API keys)
- Route optimization (need service selection)
- Volunteer assignment (needs schema update)

---

## 🎯 Best Practices

1. **Always use in-app messaging** for coordination (not WhatsApp/phone)
2. **Update status promptly** so both parties see progress
3. **Upload documents** for global shipments via Gemini File API
4. **Confirm delivery** with photos and signature for proof
5. **Check status timeline** to see full history
6. **Use document search** to find compliance requirements quickly

---

## 📞 Support

For questions about logistics coordination:
- Check donation detail page for status and timeline
- Use in-app messaging for coordination
- Upload documents to Document Library for reference
- Contact support via dashboard if issues arise

