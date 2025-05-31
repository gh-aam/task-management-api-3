# task-management-api-3
A simple and modular RESTful API for managing tasks, built with **Express.js** and **MongoDB**.

## Features
- Create, read, update, and delete tasks (CRUD)
- Pagination support for task listing
- Search tasks by title (case-insensitive)
- Data validation and offensive language filtering
- Modular route and error handler structure
- Environment-based configuration
- Graceful shutdown with MongoDB disconnection

## Technologies Used
- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv

## Installation & Usage
Clone the repository:
```bash
git clone https://github.com/gh-aam/task-management-api-3.git
```
Go to project directory:
```bash
cd task-management-api-3
```
Install dependencies:
```bash
npm install
```
Create a `.env` file in the root:
```bash
MONGODB_URI=mongodb://localhost:27017/your_mongodb_database_name
MONGODB_USER=your_mongodb_user_name
MONGODB_PASS=your_mongodb_password
EXPRESS_PORT=3000
OFFENSIVE_WORDS=offword1,offword2,offword3
```
Start the server:
```bash
npm start
```

## API Endpoints
### Base URL
http://localhost:3000
### Routes
`GET /`: Welcome message   
`POST /tasks`: Create a new task   
`GET /tasks`: Get all tasks with pagination   
`GET /tasks/search`: Search tasks by title (case-insensitive)   
`GET /tasks/:id`: Get a specific task by ID   
`PUT /tasks/:id`: Update an existing task by ID   
`DELETE /tasks/:id`: Delete a task by ID
### Query Parameters
`page`: Page number (default: 1)   
`limit`: Items per page (default: 10)   
`title`: Search query for task title