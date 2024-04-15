# Travel Diary API

This is a RESTful API for managing diary entries in a travel diary application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [output](#output)


## Introduction

The Travel Diary API provides endpoints for registering and authenticating users, managing diary entries, and more. It serves as the backend for the Travel Diary web or mobile application.

## Features

- User registration and authentication
- Create, read, update, and delete diary entries
- Secure authentication using JWT tokens
- Swagger documentation for API endpoints

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Swagger for API documentation

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/travel-diary-api.git
   
cd travel-diary-api <br/>
npm install


Run the server: <br/>
npm run dev

## Usage

Once the server is running, you can access the API endpoints using tools like Postman or integrate them into your frontend application.

## API Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Authenticate user and generate JWT token.
- **GET /diary-entries**: Get all diary entries.
- **POST /diary-entries**: Create a new diary entry.
- **GET /diary-entries/:id**: Get a diary entry by ID.
- **PUT /diary-entries/:id**: Update a diary entry by ID.
- **DELETE /diary-entries/:id**: Delete a diary entry by ID.

For detailed documentation of each endpoint and request/response examples, refer to the Swagger documentation at `/api-docs`.

## Output

<a href="https://youtu.be/fGVlGMupxs4?si=qHMM6qz8aeOgBJ7_">Swagger UI - Travel Diary </a>

