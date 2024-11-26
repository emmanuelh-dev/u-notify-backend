# Project Setup Guide

## Prerequisites

1. Install PostgreSQL on your system:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. Start PostgreSQL service:
   - Windows: It starts automatically
   - Mac: `brew services start postgresql`
   - Linux: `sudo service postgresql start`

3. Create a database:
   ```sql
   psql -U postgres
   CREATE DATABASE mobile_app;
   \q
   ```

## Project Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials if needed

3. Run setup script:
   ```bash
   node setup.js
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Access the admin panel:
   - Visit: http://localhost:3000/admin
   - Login with:
     - Email: admin@example.com
     - Password: admin123

## Default Configuration

- Database Name: mobile_app
- Database User: postgres
- Database Password: postgres
- Server Port: 3000

You can modify these settings in the `.env` file.