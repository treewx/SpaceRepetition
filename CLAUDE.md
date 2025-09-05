# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Since this is a frontend-only application with no build process:

- **Run the app**: Serve via HTTP server (recommended) or open `index.html` directly
  - **HTTP Server (recommended)**: `python -m http.server 8000` then visit `http://localhost:8000`
  - **Direct file**: Open `index.html` in browser (AI images may not work due to blob URL restrictions)
- **No build, test, or lint commands**: This is a vanilla JavaScript project without dependencies

## Code Architecture

This is a spaced repetition flash card application built with vanilla HTML, CSS, and JavaScript.

### Core Architecture

**Single-Class Architecture**: The entire application is contained in the `SpacedRepetitionApp` class in `app.js`, following a component-based approach with clear separation of concerns:

- **Data Management**: Cards stored in browser localStorage with JSON serialization
- **State Management**: Application state managed through class properties (`cards`, `currentReviewCards`, `currentCardIndex`, etc.)
- **Event-Driven UI**: All user interactions bound through event listeners in `bindEvents()`

### Key Components

**Spaced Repetition Algorithm**: Implements SM-2 algorithm in `calculateNextReview()`:
- Uses interval, repetitions, and easeFactor properties
- Quality ratings (Hard=3, Good=4, Easy=5) determine next review timing
- Cards automatically scheduled for future review dates

**Tab System**: Two main views managed by `switchTab()`:
- **Manage Section**: Card CRUD operations with modal-based editing
- **Review Section**: Sequential card review with difficulty rating

**AI Image Integration**: Google Gemini API integration for image generation:
- Uses `gemini-2.5-flash-image-preview` model
- Converts base64 responses to blob URLs for storage
- Images can be attached to front or back of cards

### File Structure

- `app.js` - Single SpacedRepetitionApp class containing all logic
- `index.html` - Complete UI structure with modals and sections
- `styles.css` - All styling including responsive design and modal animations
- `README.md` - User documentation with setup and usage instructions

### Data Model

Cards are stored as objects with these properties:
```javascript
{
  id: string,
  front: string,
  back: string,
  frontImage: string|null, // blob URL
  backImage: string|null,  // blob URL
  interval: number,        // days until next review
  repetitions: number,     // successful review count
  easeFactor: number,      // SM-2 algorithm parameter
  nextReview: Date         // when card becomes available
}
```

### API Integration

**Google Gemini API**: 
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
- Authentication: API key in `x-goog-api-key` header
- Image generation with educational prompt enhancement
- Base64 to blob URL conversion for local storage