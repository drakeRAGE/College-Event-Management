# Event Registration System

The GBPUAT Event Management System is a robust, web-based platform specifically designed for the Govind Ballabh Pant University of Agriculture and Technology (GBPUAT), Pantnagar, Uttarakhand, India. This system empowers university administrators to efficiently create, manage, and oversee a wide range of academic and cultural events, while providing students with a seamless interface to explore, register, and participate in these activities. Leveraging cutting-edge technologies, the system ensures secure data handling, scalability, and an enhanced user experience tailored to the university's diverse community.


Developed with a focus on the unique needs of GBPUAT, this application integrates advanced features to support event planning, real-time registration tracking, and resource management, contributing to the university's commitment to academic excellence and student engagement. The platform is meticulously crafted to align with institutional goals, offering a professional and reliable solution for event coordination across departments.

## Table of Contents
1. Features
2. Tech Stack
3. Prerequisites
4. Installation 
      - Frontend Setup
      - Backend Setup
6. Running the Application
7. Architecture Diagram
8. Environment Variables
9. Screenshots
10. Contributing
11. Contact

## Features 

### Admin Features:
1. Login with Firebase OAuth
2. Create, edit, and delete events
3. Upload event images to Firebase Storage
4. View registered students


### Student Features:
1. Browse available events
2. Register for events
3. View event details


### Responsive Design: 
Built with Tailwind CSS for a seamless experience across devices

### Secure Authentication: 
JWT-based authentication for backend APIs

## Tech Stack

Below I have shown the used Tech Stack for all services : 

  | Layer          | Technology Used                                     |
  | -------------- | --------------------------------------------------- |
  | **Frontend**   | React.js, Tailwind CSS, Axios                       |
  | **Backend**    | Node.js, Express.js, JWT                            |
  | **Database**   | MongoDB (for event data)                            |
  | **Auth**       | Firebase OAuth (Google), Node/Express + JWT (Email) |
  | **Storage**    | Firebase Storage (for images)                       |
  | **State**      | Redux                                               |
  | **Deployment** | Render (frontend & backend)                         |



### Prerequisites

1. Node.js (v16 or higher)
2. MongoDB Atlas (or local MongoDB instance)
3. Firebase Project (with Storage and OAuth configured)
4. A code editor (e.g., VS Code)
5. Terminal or command-line interface

### Installation

## Frontend Setup
1. Navigate to the frontend folder:
```bash
cd gallery
```


2. Install dependencies:
```bash
npm install
```


## Backend Setup
1. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the backend server:
```bash
npm run dev
```


1. Start the frontend development server:
```bash
cd gallery
npm run dev
```


### Access the application:
Frontend: http://localhost:5173

Backend: http://localhost:5000


### Verify functionality:
Check browser console and terminal logs for errors.
Ensure the backend connects to MongoDB and the frontend communicates with Firebase.

### Architecture Diagram
Below I have shown the architecture overview of the project: 

![image](https://github.com/user-attachments/assets/b16fac85-acf8-4c7a-a3d1-1338d280e489)



### Environment Variables

Both .env files (frontend and backend) should include:

## Environment Variables

| Variable Name            | Description                                      | Scope            |
|--------------------------|--------------------------------------------------|------------------|
| `JWT_SECRET`             | Secret key for JWT authentication               | Both             |
| `MONGO`                  | MongoDB connection string                       | Both             |
| `OPENCAGE_API_KEY`       | OpenCage Geocoding API key                      | Both             |
| `VITE_ADMIN_EMAIL`       | Admin email for authentication                  | Both             |
| `VITE_ADMIN_ID`          | Admin unique identifier                         | Both             |
| `VITE_ADMIN_USERNAME`    | Admin username                                  | Both             |
| `VITE_FIREBASE_API_KEY`  | Firebase API key                                | Both             |
| `VITE_OPENCAGE_API_KEY`  | OpenCage API key (for geolocation services)     | Both             |
| `VITE_BACKEND_BASE_URL`  | Backend API URL (e.g., `http://localhost:5000/api`) | Frontend         |
| `PORT`                   | Server port (default: 5000)                     | Backend          |





## Screenshots
### Student Registration
![WhatsApp Image 2025-06-12 at 16 43 57_c9090bda](https://github.com/user-attachments/assets/b8d6360e-22c3-4581-b64c-45da9f1f6788)

### Search Events
![WhatsApp Image 2025-06-12 at 16 34 28_f57aaf2a](https://github.com/user-attachments/assets/01ee88be-3bbe-42ed-8952-7b8916eee7d7)

### Event Page
![WhatsApp Image 2025-06-12 at 16 31 52_a8c577d1](https://github.com/user-attachments/assets/cb65938b-c227-4700-aa77-575603dfaeb4)

### Contact Page
![WhatsApp Image 2025-06-12 at 16 30 31_705fa004](https://github.com/user-attachments/assets/667ad0e2-a7a3-4a91-86f7-8701c4924c26)

### View Event
![WhatsApp Image 2025-06-12 at 16 28 09_c7b3793f](https://github.com/user-attachments/assets/7919559c-a377-4d0c-a57d-b5e47d35dd36)

### Create Event
![WhatsApp Image 2025-06-12 at 16 27 13_cbf74be2](https://github.com/user-attachments/assets/5304feba-ac5d-42d3-8dfd-2abd2fe51862)




## Contributing

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes and commit (git commit -m "Add feature").
4. Push to the branch (git push origin feature-branch).
5. Create a Pull Request.

## Contact
Contact me on crashbrown2004@gmail.com
