# 🪮 **MarkComb**

A tool for searching and analyzing YouTube channels, designed for advertisers.

## **Project Overview**

MarkComb helps advertisers quickly find suitable creators on YouTube and gain access to key information about their channels.

## 🚀 **Key Features:**

* Search by category and niche
* Versatile filters (animation, vlogs, music, etc.)
* Channel analytics and structured results
* Access to creators' contact information
* A streamlined, CRM-like workflow for managing selected channels

## 🛠️ **Stack**

**Frontend:**

* React + React Router

**Backend:**

* Node.js (Express)
* PostgreSQL

**APIs:**
* YooMoney
* YouTube API

**Infrastructure:**

* Nginx
* Deployment to a VPS

## 🏛️ **Architecture**

The system is divided into two independent layers:

* **Frontend** – the client responsible for the user interface, filtering, searching, and data display
* **Backend** – a REST API with controllers, services, database access, and customizable parsers

Background parsers periodically update channel data and can be run locally or remotely via a secure channel.

## 📊 **Project Status**

The project is currently on hold

## 🚀 **Setup and Launch**

Simply copy and use these commands to install and run the application.

```bash
git clone https://github.com/NazarSpokeOfk/markcomb
cd markcomb
npm i
npm start
```

### Run only the backend
in the /MarkComb directory 

```bash
npm run dev
```

### Run only the frontend
in the /MarkComb directory 

```bash
npm run react
```

The structure of the environment variables can be found in the `.env.example` file. <br>
This file contains placeholder variables that you will need to replace yourself. I have described what you need to do to create your own API keys, what to replace the URLs with, etc.

## **Preview**


https://github.com/user-attachments/assets/1073ad74-684d-415f-9a38-116b29a74357

## 📺 **Screenshots**

### Home Page
<img width="1427" height="814" alt=“Screenshot taken on 12/15/2025 at 3:25:05 PM” src="https://github.com/user-attachments/assets/97ec42b8-22ab-4f5c-81fd-126b7e230e4e" />

### Home Page
<img width="1425" height="814" alt="main_page" src="https://github.com/user-attachments/assets/21ecce56-39c3-4b38-a7a3-7c0e75a78e32" />

### Shopping
<img width="1423" height=“812” alt="Screenshot 2025-12-15 at 3:29:48 PM" src="https://github.com/user-attachments/assets/3dd00674-6c9c-469e-bb82-9fb6c6e1d2b1" />

### Profile
<img width="1423" height="812" alt="Screenshot taken on 2025-12-15 at 3:31:30 PM" src="https://github.com/user-attachments/assets/5b67025c -2c5c-46bb-a7a7-dcafb3bc9ed7" />

## 🪪 **License**

MIT License - feel free to study or use this code at your own risk.


## **Author**

**Spokeofk**
