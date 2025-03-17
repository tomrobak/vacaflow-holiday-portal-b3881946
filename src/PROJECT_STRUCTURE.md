
# Vacaflow Project Structure

This document provides an overview of the project structure, including components, styling, and page layouts.

## Table of Contents
- [Component Organization](#component-organization)
- [Styling Approach](#styling-approach)
- [Page Layouts](#page-layouts)
- [Key Components](#key-components)
- [Hooks](#hooks)
- [UI Components](#ui-components)

## Component Organization

The application is organized into several key directories:

```
src/
├── components/
│   ├── bookings/      # Booking-related components
│   ├── calendar/      # Calendar view components
│   ├── checkout/      # Checkout flow components
│   ├── customer/      # Customer profile components
│   ├── customers/     # Customer management components
│   ├── dashboard/     # Dashboard components
│   ├── layout/        # Layout components (sidebars, navigation)
│   ├── property/      # Property management components
│   ├── property-calendar/ # Property calendar components
│   ├── sms/           # SMS messaging components
│   └── ui/            # UI component library (shadcn/ui)
├── data/              # Mock data and constants
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
│   ├── customer/      # Customer portal pages
│   └── settings/      # Settings pages
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Styling Approach

This project uses Tailwind CSS for styling with a design system based on shadcn/ui. Key styling features:

1. **Tailwind CSS Classes**: Used throughout for responsive design
2. **CSS Variables**: Defined in `index.css` for theme colors and properties
3. **Dark Mode Support**: Using the `class` strategy
4. **Custom Components**: Extended shadcn/ui components with custom styling

### Color System

The application uses a comprehensive color system defined in `index.css` with CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 217.2 91.2% 59.8%;
}
```

## Page Layouts

### Main Layout Structure

The application uses two primary layouts:

1. **Admin Layout** (`MainLayout.tsx`):
   - Desktop: Sidebar + Main Content
   - Mobile: Top Navigation + Main Content with slide-out menu

2. **Customer Layout** (`CustomerLayout.tsx`):
   - Desktop: Sidebar + Main Content
   - Mobile: Top Navigation + Main Content with slide-out menu

### Responsive Design

All pages implement responsive designs:
- **Mobile First**: Base styling for mobile devices
- **Responsive Breakpoints**: Using Tailwind's `sm`, `md`, `lg`, `xl` breakpoints
- **Flex & Grid**: Used for complex layouts
- **Dynamic Sidebars**: Collapsible on desktop, slide-out on mobile

## Key Components

### Layout Components

- **MainLayout**: Main admin layout with responsive sidebar
- **CustomerLayout**: Customer portal layout
- **DesktopSidebar**: Collapsible sidebar for desktop
- **MobileNavigation**: Mobile navigation with slide-out menu
- **NavigationItem**: Navigation menu item component
- **UserProfileButton**: User profile button in navigation

### Property Components

- **PropertyFormSkeleton**: Loading skeleton for property forms
- **PropertyBasicInfoTab**: Basic property information form
- **PropertyAmenitiesTab**: Property amenities management
- **PropertyAddonsTab**: Property add-ons management
- **PropertyImagesTab**: Property image management
- **PropertyAvailabilityTab**: Property availability settings
- **PropertyBookingCard**: Property booking card for checkout
- **PropertyGallery**: Property image gallery
- **PropertyAmenities**: Property amenities display
- **PropertyLocationMap**: Property location map
- **PropertyReviews**: Property reviews component
- **PropertyAvailabilityCalendar**: Property availability calendar

### Booking Components

- **BookingForm**: Booking creation form
- **BookingActions**: Booking action buttons
- **GoogleCalendarAlert**: Google Calendar integration alert
- **BookingsList**: List of bookings

### Customer Components

- **CustomerInfoCard**: Customer information card
- **CustomerBookingsTab**: Customer bookings tab
- **CustomerPaymentsTab**: Customer payments tab
- **CustomerDetailHeader**: Customer detail header
- **CustomerOverviewCard**: Customer overview card

### Form Components

- **GuestInfoForm**: Guest information form
- **PaymentForm**: Payment form
- **LoginForm**: Login form

### Calendar Components

- **CalendarView**: Calendar view component
- **BookingList**: List of bookings in calendar
- **PropertyStats**: Property statistics
- **CustomerStats**: Customer statistics

## Hooks

- **useNavigation**: Navigation hook for sidebar
- **useIsMobile**: Detect mobile devices
- **usePropertyImages**: Property image management
- **useBookingCalculations**: Calculate booking prices
- **useToast**: Toast notification hook

## UI Components

The project uses shadcn/ui components extended with custom styling:

- **Accordion**: Expandable content sections
- **Alert**: Alert messages
- **AlertDialog**: Modal dialogs for alerts
- **AspectRatio**: Maintain aspect ratios for images
- **Avatar**: User avatars
- **Badge**: Status badges and labels
- **Button**: Various button styles
- **Calendar**: Date selection
- **Card**: Content containers
- **Carousel**: Image carousels
- **Checkbox**: Form checkboxes
- **Command**: Command palettes
- **Dialog**: Modal dialogs
- **Dropdown**: Dropdown menus
- **Form**: Form components with validation
- **Input**: Text input fields
- **Popover**: Popover components
- **Sheet**: Side sheets
- **Skeleton**: Loading skeletons
- **Tabs**: Tabbed interfaces
- **Tooltip**: Tooltip components

## Page Structure Examples

### Property Detail Page

```
PropertyDetail
├── Header Section
│   ├── Title
│   ├── Location
│   └── Actions (Share, Save)
├── PropertyGallery
├── Main Content (Grid Layout)
│   ├── Left Column (2/3)
│   │   ├── Property Info
│   │   ├── PropertyAmenities
│   │   └── Tabs
│   │       ├── Availability Calendar
│   │       ├── Reviews
│   │       └── Location Map
│   └── Right Column (1/3)
│       └── PropertyBookingCard
```

### Dashboard Page

```
Dashboard
├── Header Section
│   ├── Title
│   └── Actions
├── Stats Section (Grid)
│   ├── Revenue Card
│   ├── Bookings Card
│   ├── Occupancy Card
│   └── Reviews Card
├── Upcoming Bookings Section
└── Recent Activity Section
```

### Edit Property Page

```
EditProperty
├── Header Section
│   ├── Title
│   └── Subtitle
├── Tabs
│   ├── Basic Info Tab
│   ├── Features & Amenities Tab
│   ├── Addons Tab
│   ├── Images & Gallery Tab
│   └── Availability Tab
└── Actions
    ├── Cancel Button
    └── Update Button
```
