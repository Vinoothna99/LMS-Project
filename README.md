Below is a structured README file that presents the setup instructions based on your summary. This README is intended to guide a user through the process of setting up a project named `LMS` (Learning Management System) which consists of a Django backend and a React frontend. The instructions are formatted for clarity and ease of use.

---

# LMS Setup Guide

Welcome to the Learning Management System (LMS). This guide will walk you through the setup process to get your application up and running on your local machine.

## Prerequisites

Before you start, ensure you have administrative access to your computer and are connected to the internet.

## Step-by-Step Installation

### Step 1: Install Python 3
- Download Python 3 from [python.org](https://www.python.org/downloads/) and follow the installation instructions. Make sure to add Python to your system's PATH.

### Step 2: Install Node.js and npm
- Visit [nodejs.org](https://nodejs.org/) to download and install Node.js. npm is included in the installation. Verify the installation by running `node --version` and `npm --version` in your terminal or command prompt.

### Step 3: Install Visual Studio Code
- Download Visual Studio Code from [code.visualstudio.com](https://code.visualstudio.com/). Follow the provided installation guide for your operating system.

### Step 4: Create the LMS Database
- Use the provided SQL file to create and populate the `lms` database. This can typically be done through a database management tool like MySQL Workbench or a command-line tool such as MySQL command-line client.

### Step 5: Download the Code
- Clone the repository from GitHub using:
  ```
  git clone https://github.com/Vinoothna99/LMS-Project.git
  ```
- Navigate to the cloned directory in Visual Studio Code by opening Visual Studio Code, selecting `File > Open Folder`, and selecting the cloned directory.

### Step 6: Install Dependencies
- **Backend (Django) Dependencies:**
- Open a terminal in Visual studio code and type the following
  ```
  cd lms_controller
  pip install -r requirements.txt
  ```
- **Frontend (React) Dependencies:**
- Open a new terminal in Visual studio code and type the following
  ```
  cd lms_controller/lms_client
  npm install
  ```

### Step 7: Run the Backend
- Open a terminal in Visual Studio Code, navigate to the `lms_controller` directory if not already there, and run:
  ```
  python3 manage.py runserver
  ```

### Step 8: Run the Frontend
- Open a new terminal in Visual Studio Code, navigate to `lms_controller/lms_client`, and execute:
  ```
  npm run dev
  ```

### Step 9: Access the Application
- Open a web browser and go to [http://127.0.0.1:8000](http://127.0.0.1:8000) to access the LMS application.

### Step 10: Login to the System
- To login as a student, use the credentials: Username `EmilyRichards`, Password `password123`.
- To login as an instructor, use the credentials: Username `JessicaJones`, Password `password101`.
- Alternatively, you can register for a new account using the registration form on the website.

## Troubleshooting

If you encounter any issues during the installation or running of the application:
- Ensure all steps were followed correctly.
- Check that all dependencies were installed without errors.
- Make sure the database is properly set up with the initial schema and data.

For further assistance, contact me.

---

This README file provides a clear, step-by-step guide to setting up the LMS project, tailored for users who might not have prior experience with these technologies. 
