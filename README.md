# Fastbreak Event Dashboard

A full-stack Sports Event Management application where users can create, view, edit, and manage sports events with venue information.

**Live Demo**: [View Here](https://fastbreak-event-dashboard-chi.vercel.app/)

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Form Management**: React Hook Form + Zod validation
- **Deployment**: Vercel

## Features

### Authentication

- Email/password sign up and login
- Protected routes with automatic redirect
- Session management via middleware
- Logout functionality

### Event Management

- Create events with name, sport type, date/time, description, and multiple venues
- Edit existing events
- Delete events with confirmation dialog
- View all events in a responsive grid layout

### Dashboard

- Search events by name (case-insensitive)
- Filter events by sport type
- Real-time filtering with server-side refetch
- Responsive design for mobile and desktop
- Loading states with Suspense boundaries
- Toast notifications for success/error states

## Implementation

### Database Schema

```sql
events table:
- id: uuid (primary key)
- name: text
- sport_type: text
- date_time: timestamptz
- description: text (nullable)
- venues: text[] (array of strings)
- user_id: uuid (foreign key to auth.users)
- created_at: timestamptz
- updated_at: timestamptz
```

### Project Structure

```
app/
├── (dash)/              # Protected dashboard routes
│   ├── page.tsx         # Main dashboard
│   ├── layout.tsx       # Dashboard layout
│   └── event/
│       ├── new/         # Create event
│       └── edit/[id]/   # Edit event
└── auth/                # Public auth routes
    ├── login/
    ├── sign-up/
    └── confirm/

components/
├── ui/                  # Shadcn UI components
├── event-form.tsx       # Event form (create/edit)
├── events-list.tsx      # Event list display
├── events-filter.tsx    # Search/filter UI
├── event-card.tsx       # Individual event card
├── login-form.tsx       # Login form
└── sign-up-form.tsx     # Sign up form

actions/
└── events.ts            # Server actions for CRUD

lib/
├── supabase/
│   ├── client.ts        # Client-side Supabase
│   ├── server.ts        # Server-side Supabase
│   └── proxy.ts         # Session middleware
├── auth-helpers.ts      # Authentication & authorization utilities
├── constants.ts         # App-wide constants (sport types, messages, etc.)
├── error-handler.ts     # Error handling utility
└── utils.ts             # Utility functions (date formatting, venue parsing)
```