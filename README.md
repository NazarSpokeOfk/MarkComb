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

## **Setup**

```bash
git clone https://github.com/NazarSpokeOfk/markcomb
cd markcomb
```

### Start only Backend
in /MarkComb directory ->

```bash
npm run dev
```

### Start only Frontend
in /MarkComb directory ->

```bash
npm run react
```

### Run both
in MarkComb directory ->

```bash
npm start
```
Environment variable structure can be found in `.env.example`.

---

## **License**

MIT License - feel free to explore or reuse the code at your own risk.

---

## **Author**

**Spokeofk** - Full-stack developer and creator of MarkComb.

---

If you want, I can also prepare a shorter “startup-style” README or a more formal CV-friendly version.
