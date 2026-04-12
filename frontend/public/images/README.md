# Local Images Directory

This directory contains all locally downloaded images for the Hospital website.

## Images List

### Medical Team
- **File**: `medical-team.jpg`
- **Original URL**: https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800&q=80
- **Usage**: Hero section on Home page
- **Updated in**: `/frontend/src/src/pages/Home.tsx`

### Background Pattern
- **File**: `patterns/cubes.png`
- **Original URL**: https://www.transparenttextures.com/patterns/cubes.png
- **Usage**: Background pattern for CTA section on Home page
- **Updated in**: `/frontend/src/src/pages/Home.tsx`

### SVH Logo
- **File**: `svh-youtube-logo.png`
- **Original URL**: https://www.svhospitals.in/img/svh%20YouTube%20logo.png
- **Usage**: Logo in Project Certificate HTML
- **Updated in**: `/Project_Certificate.html`

### Doctor Images (Placeholder files)
- **Files**: `dr_gayatri.jpg`, `dr_suresh.png`
- **Note**: These are referenced in the database but are currently empty placeholder files
- **Database location**: `/backend/src/routes.ts`

### Pharmacy Images
- **File**: `pharmacy-city-medical.jpg`
- **Original URL**: https://images.unsplash.com/photo-1585435557343-3b5dccdd7883?w=600&q=80
- **Usage**: City Medical Pharmacy seed data
- **Database location**: `/backend/src/routes.ts`

- **File**: `pharmacy-svh-hospital.jpg`
- **Original URL**: https://images.unsplash.com/photo-1555421229-88d610b6a451?w=600&q=80
- **Usage**: SVH Hospital Pharmacy seed data
- **Database location**: `/backend/src/routes.ts`

- **File**: `pharmacy-medicare-plus.jpg`
- **Original URL**: https://images.unsplash.com/photo-1584627252723-40e5e325b2d5?w=600&q=80
- **Usage**: MediCare Plus Pharmacy seed data
- **Database location**: `/backend/src/routes.ts`

## Usage

All images are now served locally from the `/public` directory, which means:
- No external dependencies on image URLs
- Faster loading times
- Offline functionality
- Better reliability

## Path References

- Images: `/images/filename.ext`
- Patterns: `/patterns/filename.ext`
