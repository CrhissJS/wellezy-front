# Documentación Wellezy Travel Frontend - Flight Reserve System

Wellezy Travel Frontend is a platform to find and book flights depending on the departure and arrival city selected by the user.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)

## Requirements

- Node.js 20+
- npm o yarn
- API Wellezy Travel Backend already working with database

## Installation

Once the repository has been cloned:

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Environment variable configuration:

Create a .Env file at the root of the project with the following information:

```env
VITE_API_BASE_URL='http://localhost:8000/api'
```

## Configuration

Make sure the Laravel Backend is running and available in the URL defined in VITE_API_BASE_URL.This URL will be the basis for all the calls to the API from the Frontend.

Authentication: The application uses Laravel Sanctum in the Backend to authenticate requests and handle user sessions

### Scripts

- Start of the development server:

```bash
npm run dev
# or
yarn dev
```

- Compilación para producción:

```bash
npm run build
# or
yarn build
```

## Project structure

This project follows the recommended VITE structure with React, dividing components and functionalities into key folders:

## App relevant folders in src/

### components

- `Home.tsx`: Home view
- `Login.tsx`: Login view
- `Register.tsx`: Register view
- `FlightSearch.tsx`: Flight search management rendered in Home

### common

- `ConfirmationModal.tsx`: Reusable confirmation modal
- `Loader.tsx`: Reusable Loader
- `Types.ts`: Types used in the application

### assets

- `airplane.svg`: used .ico and used svg of airplane

### services

- `ApiService.ts`: Services abstraction or API abstraction layer
- `AuthMethods.ts`: Authentication Methods
- `FlightService.ts`: Services regarding flights

## App relevant files

### App.tsx

- Here is the general router and the notification container rendering

### index.css

- Here is the initial styles configuration using Tailwind

### main.tsx

- Main file where the application of rect is initialized and where the 'index.css' styles are imported

### Router.tsx

- Archive that contains the project route structure to separate the different views

### .env

- Archive that contains the environment variables, if you are not created you must create it and paste the content of '.env.example' in it

### package.json

- Archive that contains the information of the necessary packages for the correct execution of the project

### tailwind.config.js and postcss.config.js

- Tailwind configuration files

### tsconfig files

- TypeScript configuration files

### vite.config.ts

- VITE configuration file
