# Prova Final

## Introduction
Welcome to the Prova Final Exam Application, a comprehensive solution designed to streamline the process of conducting and participating in exams. This application represents a harmonious blend of backend robustness and frontend intuitiveness, crafted to deliver a seamless exam experience.

At the heart of Prova Final lies a powerful Node.js backend, leveraging Express and LowDB to efficiently manage and serve exam data. This backend is the cornerstone of the application, ensuring reliable data handling and swift responses to user requests.

Complementing the backend is our elegantly designed frontend, developed with the latest web technologies. It offers users an interactive and user-friendly interface, making the process of taking exams as straightforward and stress-free as possible.

Whether you're an educator looking to create and distribute exams or a student preparing to take them, Prova Final is equipped to meet your needs. Its intuitive design and robust functionality make it an ideal choice for anyone seeking a reliable and efficient exam management system.

Join us as we delve into the details of this application, exploring its structure, setup, and usage. We're excited to guide you through the capabilities of Prova Final and look forward to supporting you in your journey towards efficient exam management and participation.

## Project Structure
The project is divided into two main folders:

- `backend`: Contains the Node.js server and API for managing exam data.
- `frontend`: Holds the frontend code of the application.

### Backend Directory Structure
The `backend` folder contains:
- `package.json` & `package-lock.json`: Node.js configuration files with dependencies.
- `db.json`: A specific JSON file for the application's data.
- `server.js`: The main server file for the backend application.

### Frontend Directory Structure
The `frontend` folder includes:
- `package.json` & `package-lock.json`: Configuration files for Node.js.
- `public`: Public assets and HTML files.
- `src`: Source files for the frontend application.

## Getting Started

### Prerequisites
- Node.js and npm must be installed on your system to run both the frontend and backend. You can download them from [Node.js official website](https://nodejs.org/).

### Option 1: Running with Node.js

#### Setting up the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server
    ```bash
    npm start
    ```

The server will run on http://localhost:3001.

#### Setting up the Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the application
    ```bash
    npm start
    ```

The application will run on http://localhost:3000.

### Option 2: Running with Docker

#### Building and Running with Docker Compose

1. In the root directory of the project, build and start the containers:
    ```bash
    docker-compose up --build -d
    ```
    
This command will set up both the backend and frontend.
The backend will be accessible on http://localhost:3001, and the frontend will be accessible on http://localhost:3000.

2. To stop the Docker containers, use:
    ```bash
    docker-compose down
    ```

## Usage
After starting both the backend and frontend, you can interact with the application through your web browser at http://localhost:3000.

## Contributing
We welcome contributions to this project. Please follow the standard fork-branch-PR workflow.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
Thanks to the Node.js and React communities for the wealth of information and support.


This README file provides a complete guide to setting up and running your application, including details about the project structure, setup instructions for both backend and frontend, and general information about contributing and licensing.
