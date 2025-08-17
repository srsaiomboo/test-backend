

# Test Backend

## Overview

**Test Backend** is a Node.js-based backend application that provides API endpoints for managing an Test Backend. It utilizes **PostgreSQL** (originally MySQL, but configuration indicates PostgreSQL) as the database and is configured using environment variables.

## Technologies Used

* **Node.js**
* **TypeScript**
* **Fastify**
* **PostgreSQL**
* **Prisma ORM**
* **Fastify Swagger**
* **Fastify Swagger UI**

## Installation

To set up the project on your local machine, follow these steps:

### Prerequisites

* Install [Node.js](https://nodejs.org/)
* Install [pnpm](https://pnpm.io/)
* Install PostgreSQL (or MySQL, depending on your configuration)

## Running the Application

To start the development server:

```sh
pnpm run dev
```

To build and run in production:

```sh
pnpm run build
pnpm start
```

## Database Migration

To apply database migrations:

```sh
pnpm prisma migrate dev --name init
```

## API Endpoints

The application exposes various API endpoints. You can test them using tools like Postman or cURL.

## API Documentation

API documentation is available at [`/docs`](http://localhost:3000/docs) when the server is running.


