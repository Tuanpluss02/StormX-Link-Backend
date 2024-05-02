<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# StormX Link Backend API

This repository contains the backend REST API for the StormX Link URL shortening application. The API is built using NestJS and interacts with a MongoDB database.

## Features

- URL Shortening: Create short, memorable URLs from any long URL.
- URL Edit and deletion: Have endpoint to edit or remove previously shortened URLs.
- API Endpoints: Clearly defined endpoints for interacting with the service.

## Prerequisites
- Node.js (version 12 or later)
- npm (or yarn)
- A running MongoDB instance (local or cloud-based)

## Setup

Clone the repository:

```Bash
git clone https://github.com/your-username/stormx-link-backend.git
cd stormx-link-backend
```

Install dependencies:

```Bash
yarn install
```

Configure environment variables:
Create a `.env` file in the project root with the following variables:
```
MONGODB_URI=mongodb://your-mongodb-connection-string
PORT=3000  # Or your desired port
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

