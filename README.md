# Unit Converter Application (DevOps Assignment)

## Group Information
- **Student 1:** [U.L.P. Madhubhashitha] - [ ITBNM-2313-0045 ] - Role: [ Backend Developer]
- **Student 2:** [D.M. Shehani Nikeshala] - [ ITBNM-2313-0053 ] - Role: [ Frontend Developer]
- **Student 3:** [L.A.D.H. Hemal Hansanath] - [ ITBNM-2313-0030 ] - Role: [ DevOps & Integration]

## Project Description
A simple unit conversion web application (MERN) that converts between different measurement units (length, temperature, weight, etc.) and records conversion history via a lightweight API.

## Live Deployment
**Live URL:** [https://unit-convertor-hz.netlify.app/]

## Repository
**GitHub:** https://github.com/HansaHH/unit-converter-application-devops-assignment.git

## Technologies Used
- React.js , TailwindCSS
- Node.js (Express)
- GitHub Actions (CI/CD)

## Technologies Used
- React.js, Tailwind CSS
- Node.js (Express)
- GitHub Actions (CI/CD)
- Deployment platforms: Vercel (Frontend), Railway (Backend)

## Features
- Convert between multiple unit types (length, temperature, mass, etc.)
- Stores conversion history on the backend
- REST API for conversion and history

## Branch Strategy
We implemented the following branching strategy:
- `main` - Production branch
- `develop` - Integration branch
- `backend` - Backend development branch

## Individual Contributions
### [U.L.P. Madhubhashitha (Backend Developer)]
- Designed and developed the RESTful API using Node.js and Express.
- Implemented JWT-based authentication and secure endpoints.
- Managed backend data logic for unit conversions and user history.

### [D.M. Shehani Nikeshala (Frontend Developer)]
- Built the user interface using React.js and Tailwind CSS v4.
- Implemented client-side routing and state management.
- Integrated the frontend with the backend API using Axios.

### [L.A.D.H. Hemal Hansanath (DevOps & Integration)]
- Configured the GitHub Actions CI/CD pipeline for automated testing and deployment.
- Managed the branching strategy and resolved technical integration hurdles.
- Set up and managed the deployment environment on Railway.


## Setup Instructions
**Prerequisites**
- Node.js (version 18 or higher)
- Git

**Installation**

#### Clone the repository
```bash
git clone https://github.com/HansaHH/unit-converter-application-devops-assignment.git
```
#### Navigate to project directory
```bash
cd unit-converter-application-devops-assignment/backend
```
#### Install dependencies
```bash
npm install
```
#### Run development server
```bash
npm run dev
```

**Deployment Process (CI/CD)**
The project uses GitHub Actions for CI/CD. A pipeline runs tests/builds on pushes to `develop` and `main`, and automatically deploys to the configured deployment platform on successful merges to `main`.

## Build Status Badges

![Frontend CI](https://github.com/HansaHH/unit-converter-application-devops-assignment/actions/workflows/Frontend-CI.yml/badge.svg)
![Frontend CD](https://github.com/HansaHH/unit-converter-application-devops-assignment/actions/workflows/Frontend-CD.yml/badge.svg)
![Backend CD](https://github.com/HansaHH/unit-converter-application-devops-assignment/actions/workflows/Backend-CD.yml/badge.svg)
![Backend CI](https://github.com/HansaHH/unit-converter-application-devops-assignment/actions/workflows/Backend-CI.yml/badge.svg)

## Challenges Faced
 - Implementing conditional authentication for the translation endpoint.
 - Configuring Tailwind CSS v4 with PostCSS in a MERN environment.
 - Fixed communication errors between frontend and backend.
 - Synced team roles for smoother API integration.
 - Fixed syntax errors in the Railway deployment script.
 - Resolved branch conflicts during code integration.
 - Fixed broken links and troubleshooting build failures.


