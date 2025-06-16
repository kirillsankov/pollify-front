# Pollify - Educational Project for Creating and Managing Polls

🌐 **Live Demo**: [https://polls-ai.ru/](https://polls-ai.ru/)

## Project Description

Pollify is a web application for creating, managing, and analyzing polls. The project was developed for educational purposes to demonstrate modern web development technologies and best practices for building user interfaces. The application features AI-powered poll generation, real-time analytics, and a modern responsive design.

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
 src/
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

- **AI-Powered Poll Generation** - Create professional polls using advanced AI suggestions
- **Real-Time Analytics** - Watch responses come in live with interactive charts and graphs
- **User Authentication** - Secure registration, login, and email verification system
- **Responsive Design** - Optimized for desktop and mobile devices
- **Poll Management** - Create, edit, delete, and share polls with ease
- **Data Visualization** - Beautiful charts using Recharts library for result analysis
- **Modern UI/UX** - Clean, intuitive interface with loading states and error handling

## Educational Project Goals

- Mastering the modern frontend development technology stack
- Learning principles of building scalable applications
- Practicing TypeScript in React applications
- Implementing state management using Redux
- Creating adaptive and accessible user interfaces
- Learning methods for testing React components
- Mastering containerization of frontend applications
- Implementing user authentication and authorization
- Working with external APIs and handling async operations
- Creating reusable UI components and design systems

## Additional Information

This project demonstrates modern React development practices and is deployed as a live application. While originally created for educational purposes, it showcases production-ready features and best practices for web development.
