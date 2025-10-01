# Unified Jira & Confluence Dashboard - Frontend

Modern, minimalistic Next.js dashboard application for connecting to Jira and Confluence, authenticating users, and displaying data in a unified interface.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Backend API running (see backend README)

### Environment Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd unified-jira-confluence-dashboard-170950-170960/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and configure the required variables (see [Environment Variables](#environment-variables) section).

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## 🔧 Environment Variables

Configure these variables in your `.env.local` file:

### Required Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL (for OAuth redirects) | `http://localhost:3000` |

### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics tracking ID | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | - |

## 🎨 Design Theme

The application follows the **Ocean Professional** theme with a **Classic** style approach:

### Color Palette
- **Primary:** `#1E3A8A` (Blue 900)
- **Secondary:** `#F59E0B` (Amber 500)
- **Success:** `#059669` (Emerald 600)
- **Error:** `#DC2626` (Red 600)
- **Background:** `#F3F4F6` (Gray 100)
- **Surface:** `#FFFFFF` (White)
- **Text:** `#111827` (Gray 900)

### Layout Structure

#### Sidebar Navigation
- Fixed left-hand sidebar on desktop
- Collapsible on mobile devices
- Lists available connectors:
  - Jira
  - Confluence

#### Main Content Area
Dynamic content based on selected connector:

**Jira Panel:**
- OAuth 2.0 connection option
- API token authentication form
- Connected state: List of projects

**Confluence Panel:**
- OAuth 2.0 connection option  
- API token authentication form
- Connected state: List of spaces

## 📱 Features

### Authentication Options
1. **OAuth 2.0 (3LO):** Secure browser-based authentication
2. **API Token:** Direct credential-based authentication

### Data Display
- **Jira Projects:** Name, Key, Type, Avatar
- **Confluence Spaces:** Name, Key, Type, Description

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── auth/             # Authentication components
│   ├── jira/             # Jira-specific components
│   └── confluence/       # Confluence-specific components
├── lib/                  # Utility functions
│   ├── api.ts           # API client functions
│   ├── auth.ts          # Authentication utilities
│   └── utils.ts         # General utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── styles/              # Additional stylesheets
```

## 🔌 API Integration

### Backend Communication

The frontend communicates with the backend through REST API calls:

```typescript
// Example API usage
import { api } from '@/lib/api';

// Start OAuth flow
const { auth_url, state } = await api.auth.jira.startOAuth();

// Get Jira projects
const projects = await api.jira.getProjects();

// Get Confluence spaces
const spaces = await api.confluence.getSpaces();
```

### Authentication Flow

#### OAuth 2.0 Flow
1. User clicks "Connect with Jira/Confluence"
2. Frontend calls `/auth/{service}/oauth/start`
3. User redirected to Atlassian OAuth page
4. User grants permissions
5. Atlassian redirects to frontend callback
6. Frontend sends auth code to backend
7. Backend exchanges code for token
8. User authenticated and data displayed

#### API Token Flow
1. User enters domain, email, and API token
2. Frontend calls `/auth/{service}/api-token`
3. Backend validates credentials
4. User authenticated and data displayed

## 🔍 Component Documentation

### Authentication Components

#### `OAuthButton`
```tsx
<OAuthButton 
  service="jira" 
  onSuccess={(data) => console.log('Authenticated', data)}
  onError={(error) => console.error('Auth failed', error)}
/>
```

#### `ApiTokenForm`
```tsx
<ApiTokenForm 
  service="confluence"
  onSubmit={(credentials) => handleApiAuth(credentials)}
/>
```

### Data Display Components

#### `ProjectList`
```tsx
<ProjectList 
  projects={jiraProjects}
  onProjectSelect={(project) => handleProjectSelect(project)}
/>
```

#### `SpaceList`
```tsx
<SpaceList 
  spaces={confluenceSpaces}
  onSpaceSelect={(space) => handleSpaceSelect(space)}
/>
```

## 🚨 Troubleshooting

### Common Issues

#### OAuth Redirect Issues

**Error:** OAuth callback fails or redirects to wrong URL
- **Solution:** 
  1. Verify `NEXT_PUBLIC_SITE_URL` matches your actual frontend URL
  2. Ensure backend OAuth redirect URIs match frontend URLs
  3. Check that Atlassian app redirect URIs are configured correctly

#### API Connection Issues

**Error:** "Failed to fetch" or network errors
- **Solution:**
  1. Verify `NEXT_PUBLIC_API_BASE_URL` points to running backend
  2. Check that backend is accessible from frontend
  3. Ensure CORS is properly configured in backend

#### Authentication State Issues

**Error:** User appears logged out after refresh
- **Solution:**
  1. Check browser cookies are enabled
  2. Verify session management in backend
  3. Ensure secure cookie settings for HTTPS

### Development Issues

#### Port Conflicts
```bash
# Use a different port
npm run dev -- -p 3001
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Type check
npm run type-check

# Update TypeScript
npm install --save-dev typescript@latest
```

### Performance Optimization

#### Image Optimization
- Use Next.js `Image` component for automatic optimization
- Implement lazy loading for large lists
- Use appropriate image formats (WebP, AVIF)

#### Bundle Size
```bash
# Analyze bundle size
npm run analyze

# Check dependencies
npm run bundle-analyzer
```

## 🚀 Deployment

### Environment-Specific Configuration

#### Staging
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api-staging.yourapp.com
NEXT_PUBLIC_SITE_URL=https://staging.yourapp.com
```

#### Production
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com
NEXT_PUBLIC_SITE_URL=https://yourapp.com
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Static export (if using static deployment)
npm run export
```

### Deployment Platforms

#### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### Other Platforms
- **Netlify:** Use `npm run build && npm run export`
- **AWS Amplify:** Configure build settings
- **Docker:** Use provided Dockerfile

## 🔧 Development

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Testing
npm run test
```

### Git Hooks
Pre-commit hooks are configured to run:
- ESLint
- TypeScript compilation
- Prettier formatting

## 📞 Support

For issues related to:
- **Next.js:** [Next.js Documentation](https://nextjs.org/docs)
- **React:** [React Documentation](https://react.dev/)
- **Tailwind CSS:** [Tailwind Documentation](https://tailwindcss.com/docs)
- **This application:** Check the troubleshooting section above

## 🤝 Contributing

1. Follow the established coding style (Prettier + ESLint)
2. Use TypeScript for all new files
3. Add proper prop types and component documentation
4. Test components thoroughly
5. Update this README for any new features

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Considerations

- All API calls use HTTPS in production
- OAuth tokens are stored securely
- CSRF protection enabled
- Content Security Policy configured
- Regular dependency updates
