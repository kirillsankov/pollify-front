# Pollify - Educational Project for Creating and Managing Polls

## Project Description

Pollify is a web application for creating, managing, and analyzing polls. The project was developed for educational purposes to demonstrate modern web development technologies and best practices for building user interfaces.

## Technology Stack

### Frontend

- **React (v19.1.0)** - JavaScript library for creating user interfaces, providing a component-based approach to development and efficient DOM updates.
- **TypeScript (v5.8.3)** - typed superset of JavaScript, increasing code reliability and improving development through static typing.
- **Redux (@reduxjs/toolkit v2.7.0)** - library for application state management, providing predictable data flow.
- **React Router (v7.5.1)** - library for routing in React applications, allowing the creation of multi-page SPAs.
- **Sass (v1.86.3)** - CSS preprocessor, extending component styling capabilities.
- **Recharts (v2.15.3)** - library for creating interactive charts and diagrams, used for visualizing poll results.
- **React Helmet Async (v2.0.5)** - component for managing document metadata, improving SEO and page representation in social networks.
- **TanStack React Form (v1.6.3)** - library for managing forms in React applications.

### Development Tools

- **React Scripts (v5.0.1)** - set of scripts and configurations for developing React applications without the need to configure Webpack and Babel.
- **ESLint** - tool for static code analysis, helping to identify and fix code issues.
- **Docker** - platform for containerizing applications, ensuring uniformity of development and deployment environments.

## Project Structure

```
pollify-frontend/
├── public/             # Static files
├── src/                # Source code
│   ├── api/            # Modules for working with API
│   ├── assets/         # Static resources (images, fonts)
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── store/          # Redux store
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types and interfaces
│   ├── App.tsx         # Root component
│   └── index.tsx       # Entry point
├── .dockerignore       # Docker exclusions
├── .gitignore          # Git exclusions
├── Dockerfile          # Instructions for building Docker image
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf          # Nginx configuration for production
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Installation and Launch

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Docker and Docker Compose (optional, for containerization)

### Installing Dependencies

```bash
npm install
```

### Running in Development Mode

```bash
npm start
```

The application will be available at [http://localhost:8080](http://localhost:8080).

### Building for Production

```bash
npm run build
```

The built application will be located in the `build/` directory.

### Running in Docker

```bash
docker-compose up -d
```

## Functionality

- Creating and editing polls with various question types
- Publishing polls and collecting responses
- Analyzing results using charts and diagrams
- Managing users and their permissions
- Exporting results in various formats

## Educational Project Goals

- Mastering the modern frontend development technology stack
- Learning principles of building scalable applications
- Practicing TypeScript in React applications
- Implementing state management using Redux
- Creating adaptive and accessible user interfaces
- Learning methods for testing React components
- Mastering containerization of frontend applications

## Additional Information

This project is part of a web development course and is not intended for use in a production environment without additional refinement and testing.
