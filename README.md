# FoodSync
FoodSync is a Software Engineering project designed to link restaurants with food banks to reduce food waste efficiently.

## Setup Instructions

To run the project, follow these steps:

### 1. Install Dependencies
You need to install the required dependencies for both the frontend and backend.

Navigate to the respective folders and run the following command:

```sh
cd frontend
npm install
```

```sh
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in both the `frontend` and `backend` folders with the necessary configurations:

- **Frontend (`frontend/.env`)**:
  ```env
  VITE_API_URL=<your_backend_api_url>
  ```

- **Backend (`backend/.env`)**:
  ```env
  MONGO_URL=<your_mongodb_connection_string>
  PORT=<your_backend_port>
  ```

### 3. Run the Application

- Start the backend server:
  ```sh
  cd backend
  npm run dev
  ```

- Start the frontend application:
  ```sh
  cd frontend
  npm run dev
  ```

Your application should now be running successfully on 
http://localhost:5173
