# NoVoTracker - AI Agent Instructions

## Project Overview

**NoVoTracker** is a hybrid mobile pantry/food inventory tracker built with React, Vite, and Capacitor. It manages food items with expiration dates and storage locations, supporting both native mobile platforms (iOS/Android) and web browsers.

## Architecture

### Tech Stack

- **Frontend**: React 19 with Material-UI (MUI) v7
- **Build Tool**: Vite v7 with `@vitejs/plugin-react`
- **Mobile**: Capacitor v8 for native iOS/Android deployment
- **Routing**: React Router v7
- **Data Grid**: MUI X DataGrid
- **Styling**: Emotion (MUI's CSS-in-JS solution)

### Project Structure

```
src/react/
├── App.jsx              # Root component with theme and Router setup
├── AppLayout.jsx        # Main layout with BottomNavigation and AppBar
├── AppRoutes.jsx        # Route definitions
├── Components/          # Shared UI components
│   ├── CustomAppBar.jsx    # Dynamic app bar using AppBarProvider
│   └── StyledMenu.jsx
├── Pages/               # Feature pages (Home, Pantry, Emergency)
├── Providers/           # React Context providers
│   └── AppBarProvider.jsx  # Global AppBar configuration state
├── models/              # Data schemas
│   └── pantryColumns.js    # Column definitions for DataGrid
└── utils/
    └── storage.js       # Capacitor Filesystem/Preferences abstraction
```

## Critical Patterns

### 1. Dual Storage System (Native + Browser)

The `storage.js` utility uses **Capacitor Filesystem API** on native platforms and **Preferences API** as browser fallback:

```javascript
if (window.Capacitor?.isNativePlatform()) {
  // Use Filesystem.writeFile() for native
} else {
  // Use Preferences.set() for web
}
```

**Always use these storage utilities** (`loadItems`, `saveItems`, `addItem`, `updateItem`, `deleteItem`) instead of direct `localStorage` or file operations.

### 2. AppBar Dynamic Configuration

Pages configure the `CustomAppBar` via `AppBarProvider` context:

```javascript
const { setConfig } = useAppBar();

useEffect(() => {
  setConfig({
    showBackButton: true,
    backPath: '/', // or '__back__' for navigate(-1)
    icon: <ArrowBackIosIcon />,
    title: 'NoVo-Tracker',
  });
}, [setConfig]);
```

This pattern keeps the AppBar in sync with each page's navigation needs.

### 3. MUI Theme Customization

Global theme defined in [App.jsx](src/react/App.jsx#L12-L68):

- **Colors**: `primary: '#1F3442'`, `accent: '#C2B9E4'`, `special: '#6F0D27'`
- **Component overrides**: `MuiButton`, `MuiBottomNavigation`, etc. all use theme colors
- **CSS resets**: Full viewport sizing via `MuiCssBaseline` overrides

### 4. Data Model: `pantryColumns.js`

The [models/pantryColumns.js](src/react/models/pantryColumns.js) file defines the schema for food items. Column order determines DataGrid display order. Each column specifies:

- `key`, `label`, `type` (string/date/number/select)
- `required` flag
- For selects: `defaultOptions` and `allowCustom`

When adding new fields, update this model first.

## Development Workflows

### Running the App

```bash
npm run dev          # Vite dev server with HMR (runs on --host)
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

### Capacitor Sync (Mobile)

After updating web assets or Capacitor config:

```bash
npx cap sync         # Sync web build to native projects
npx cap open android # Open Android Studio
npx cap open ios     # Open Xcode
```

### Linting

- ESLint configured with flat config ([eslint.config.js](eslint.config.js))
- `npm run lint` for checks
- Ignores unused vars starting with uppercase (e.g., component imports)

## Key Conventions

### File Organization

- Components use PascalCase (`CustomAppBar.jsx`)
- Utils/models use camelCase (`storage.js`, `pantryColumns.js`)
- Pages in feature folders: `Pages/Pantry/Pantry.jsx`
- **Project uses vanilla JavaScript** (no TypeScript) - keep new code as `.js/.jsx`

### React Patterns

- **Functional components** with hooks only (no class components)
- **PropTypes** for context providers (see `AppBarProvider`)
- **Material-UI's sx prop** for styling (avoid inline `style={}`)
- **useTheme()** hook to access theme colors (e.g., `theme.primary`)

### Navigation

- Use `useNavigate()` hook from React Router
- Bottom navigation buttons in [AppLayout.jsx](src/react/AppLayout.jsx#L79-L93) map to `/home`, `/pantry`, `/emergency`
- `/emergency` route is currently a **placeholder** (not yet implemented)
- Hide bottom nav on specific paths via `pathsToHideBottomNav` array

### State Management

- **Local state** with `useState` for component-specific data
- **React Context** for cross-component state (AppBarProvider)
- **No Redux** or external state management currently

## Mobile-Specific Considerations

### Capacitor APIs Used

- `@capacitor/filesystem` - File storage (native only)
- `@capacitor/preferences` - Key-value storage (fallback for web)
- Check `window.Capacitor?.isNativePlatform()` before platform-specific logic

### Service Worker

[App.jsx](src/react/App.jsx#L87-L95) registers a service worker for PWA functionality (though service-worker.js not visible in workspace).

### SSL in Development

Vite config includes `@vitejs/plugin-basic-ssl` for HTTPS during development (required for some Capacitor features).

## Common Tasks

### Adding a New Page

1. Create component in `src/react/Pages/<Feature>/<Feature>.jsx`
2. Add route in [AppRoutes.jsx](src/react/AppRoutes.jsx)
3. Add BottomNavigation button in [AppLayout.jsx](src/react/AppLayout.jsx) if needed
4. Configure AppBar via `useAppBar()` hook in the page's `useEffect`

### Extending Storage

- Modify utility functions in [utils/storage.js](src/react/utils/storage.js)
- Always test both native and browser environments
- Handle file not found errors gracefully
- **Import functionality** is not yet implemented (TODO) - only export exists currently

### Adding DataGrid Columns

1. Update [models/pantryColumns.js](src/react/models/pantryColumns.js)
2. Column order determines display order
3. Update add/edit forms to match new fields

## Debugging Tips

- Console logs in storage operations show what's being saved/loaded
- Check `window.Capacitor?.isNativePlatform()` to verify runtime environment
- MUI theme accessible via `useTheme()` hook for debugging color issues
- DataGrid row IDs must be unique (currently using `item.id`)
  Internationalization (i18n)
- **Current language**: German (e.g., "Vorräte", "Kühlschrank", "Notfall-Liste")
- **Future plan**: Internationalization is planned but not yet implemented
- For now, keep all new UI strings in German for consistency
- When i18n is added, all hardcoded strings will need to be extracted to translation files
  UI text is in **German** (e.g., "Vorräte", "Kühlschrank"). Keep new strings consistent with existing language unless explicitly asked to change.
