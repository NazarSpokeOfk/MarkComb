# **MarkComb**

A tool for discovering and analyzing YouTube channels for advertisers.
MarkComb was built as a full solo project - from concept and design to backend, frontend, deployment, and maintenance.

---

## **Overview**

MarkComb helps advertisers quickly find relevant YouTube creators and access key information about their channels.
The main goal was to simplify the discovery process and provide actionable data in one place.

**Core features included:**

* Search by categories and niches
* Multifaceted filters (Animation, Vlogs, Music, etc.)
* Channel analytics and structured results
* Access to creators’ contact information
* Lightweight CRM-like workflow for managing selected channels

---

## **Tech Stack**

**Frontend:**

* React (SPA)
* React Router

**Backend:**

* Node.js (Express)
* PostgreSQL
* JWT authentication
* Rate limiters, CORS, protected routes
* External API integrations

**Infrastructure:**

* Docker
* Nginx
* VPS deployment
* Git-based data update pipeline

---

## **Architecture**

The system is split into two independent layers:

* **Frontend** - a single-page application responsible for UI, filtering, searching, and data display
* **Backend** - REST API with controllers, services, database access, and custom parsers

Background parsers periodically refreshed channel data and could be triggered locally or remotely through a protected route.

---

## **Project Status**

The project is currently archived.
The live version still operates online, but development has been intentionally discontinued.

This repository is published as a demonstration of real-world architecture, implementation approach, and production-ready code.

---

## **Setup and launch**

Simply copy and use these commands to install and run the application.

```bash
git clone https://github.com/NazarSpokeOfk/markcomb
cd markcomb
npm i
npm start
```

### Start only Backend
in /MarkComb directory 

```bash
npm run dev
```

### Start only Frontend
in /MarkComb directory 

```bash
npm run react
```

Environment variable structure can be found in `.env.example`. <br>
This file contains placeholder variables that you will need to replace yourself. I have described what you need to do to create your own API keys, what to replace the URLs with, etc.

---

## **Preview**


https://github.com/user-attachments/assets/1073ad74-684d-415f-9a38-116b29a74357

## **Screenshots**

### Welcome page
<img width="1427" height="814" alt="Снимок экрана 2025-12-15 в 3 25 05 PM" src="https://github.com/user-attachments/assets/97ec42b8-22ab-4f5c-81fd-126b7e230e4e" />

### Main page
<img width="1425" height="814" alt="main_page" src="https://github.com/user-attachments/assets/21ecce56-39c3-4b38-a7a3-7c0e75a78e32" />

### Purchases
<img width="1423" height="812" alt="Снимок экрана 2025-12-15 в 3 29 48 PM" src="https://github.com/user-attachments/assets/3dd00674-6c9c-469e-bb82-9fb6c6e1d2b1" />

### Profile
<img width="1423" height="812" alt="Снимок экрана 2025-12-15 в 3 31 30 PM" src="https://github.com/user-attachments/assets/5b67025c-2c5c-46bb-a7a7-dcafb3bc9ed7" />

## **License**

MIT License - feel free to explore or reuse the code at your own risk.

---

## **Author**

**Spokeofk** - Full-stack developer and creator of MarkComb.
