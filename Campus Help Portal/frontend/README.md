PREREQUISITES

Install the following before setup:

Node.js (v18 or higher recommended)

npm

MySQL Server

MySQL Workbench (optional but recommended)

Check installation:

node -v
npm -v
__________________________________________________

STEP 1: EXTRACT PROJECT

Extract or clone the project folder.

Open terminal inside the root folder:

cd Campus Help Portal

_________________________________________________

STEP 2: INSTALL DEPENDENCIES

Install root dependencies:

npm install

Install frontend dependencies:

cd frontend
npm install
cd ..

Install backend dependencies:

cd backend
npm install
cd ..

_________________________________________

STEP 3: DATABASE SETUP

Open MySQL Workbench.

copy the SQL code from backend/schema.sql and run in MySQL Workbench.
____________________________________________________

STEP 4: BACKEND ENVIRONMENT FILE

Inside the backend folder, create a file:

backend/.env

Add the following:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=campushelp_db
JWT_SECRET=campushelp_secret_key

Replace YOUR_MYSQL_PASSWORD with your MySQL password.
__________________________________________________

STEP 5: RUN THE PROJECT

From the root folder:

npm start

This will start:

Backend: http://localhost:5000

Frontend: http://localhost:5173
___________________________________________________

DEFAULT ADMIN LOGIN

Email: admin@campushelp.com

Password: admin123