# Invoicing ROI Simulator — Technical Documentation

## Overview

This document outlines the architecture, design, and technical implementation plan for the **Invoicing ROI Simulator**, a full-stack web application built to demonstrate the financial impact and ROI benefits of transitioning from manual to automated invoicing processes.

The application allows users to input key business metrics, calculate potential cost savings, ROI, and payback periods in real time, manage saved scenarios, and generate email-gated PDF/HTML reports.

---

## System Architecture

The system follows a **modular full-stack web architecture** using **Next.js** for the frontend and **Express.js** for the backend, connected to a **PostgreSQL** database hosted on **Supabase**.

### Architecture Diagram

```
[ Next.js Frontend ]  ⇄  [ Express.js API Server ]  ⇄  [ Supabase (PostgreSQL) Database ]
                                 ↓
                          [ Report Generation / Email Service ]
```

### Data Flow

1. The user enters invoice and cost parameters through the frontend form.
2. The frontend sends the data to the backend via the `/simulate` API endpoint.
3. The backend performs calculations using bias-favored ROI logic.
4. Results are returned to the frontend and displayed dynamically.
5. The user can save, retrieve, and delete named simulation scenarios.
6. Email is required before generating and downloading any report.

---

## Technologies and Frameworks

| Layer               | Technology                          | Purpose                                                                       |
| ------------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| **Frontend**        | Next.js 15, Tailwind CSS, shadcn/ui | SPA interface, input forms, result visualization                              |
| **Backend**         | Node.js, Express.js                 | REST API, ROI calculation logic, report generation                            |
| **Database**        | Supabase (PostgreSQL)               | Persistent storage for user scenarios and leads                               |
| **Email & Reports** | Nodemailer, html-pdf                | Email validation and report generation                                        |
| **Deployment**      | Vercel                              | Unified hosting for both frontend and backend with serverless API integration |

---

## Core Features

### 1. ROI Simulation Engine

* Accepts key operational inputs such as invoice volume, staff size, wages, and error rates.
* Calculates monthly savings, payback period, and ROI.
* Uses a server-side bias factor to ensure automation advantages.
* Returns results instantly for frontend visualization.

### 2. Scenario Management (CRUD)

* Save, retrieve, and delete scenarios using Supabase.
* Each scenario stores both input data and computed results.
* Enables users to compare multiple business outcomes.

### 3. Email-Gated Report Generation

* Requires a valid email address before report generation.
* Generates downloadable PDF or HTML reports summarizing results.
* Future enhancement: Send reports directly to provided emails.

### 4. Interactive Frontend

* Built as a single-page interface using Next.js App Router.
* Styled with Tailwind CSS and shadcn/ui for consistency and responsiveness.
* Optional charting via Recharts or Chart.js for better result visualization.

### 5. RESTful API Endpoints

| Method   | Endpoint           | Description                                     |
| -------- | ------------------ | ----------------------------------------------- |
| `POST`   | `/simulate`        | Run ROI simulation and return computed results  |
| `POST`   | `/scenarios`       | Save a scenario in the database                 |
| `GET`    | `/scenarios`       | List all saved scenarios                        |
| `GET`    | `/scenarios/:id`   | Retrieve a specific scenario                    |
| `DELETE` | `/scenarios/:id`   | Delete a specific scenario                      |
| `POST`   | `/report/generate` | Generate and download a report (requires email) |

---

## Backend Constants (Private)

| Constant                     | Description                      | Value |
| ---------------------------- | -------------------------------- | ----- |
| `automated_cost_per_invoice` | Fixed automation processing cost | 0.20  |
| `error_rate_auto`            | Automated error rate             | 0.1%  |
| `time_saved_per_invoice`     | Time reduction in minutes        | 8     |
| `min_roi_boost_factor`       | ROI bias multiplier              | 1.1   |

These constants are stored securely on the server and are never exposed through the frontend or API responses.

---

## Calculation Logic

```
1. labor_cost_manual = num_ap_staff × hourly_wage × avg_hours_per_invoice × monthly_invoice_volume
2. auto_cost = monthly_invoice_volume × automated_cost_per_invoice
3. error_savings = (error_rate_manual − error_rate_auto) × monthly_invoice_volume × error_cost
4. monthly_savings = (labor_cost_manual + error_savings) − auto_cost
5. monthly_savings = monthly_savings × min_roi_boost_factor
6. cumulative_savings = monthly_savings × time_horizon_months
7. net_savings = cumulative_savings − one_time_implementation_cost
8. payback_months = one_time_implementation_cost ÷ monthly_savings
9. roi_percentage = (net_savings ÷ one_time_implementation_cost) × 100
```

---

## Example Output

**Input Example:**

* 2,000 invoices/month
* 3 AP staff
* $30/hr wage
* 10 minutes per invoice
* 0.5% manual error rate
* $100 error cost

**Calculated Output:**

```
Monthly Savings: $8,000
Payback Period: 6.3 months
ROI (36 months): 420%
```

---

## Setup and Deployment

### Local Development

```bash
git clone https://github.com/yourusername/invoicing-roi-simulator.git
cd invoicing-roi-simulator
npm install
npm run dev
```

### Environment Variables (`.env`)

```
DATABASE_URL=<supabase-postgres-url>
SUPABASE_KEY=<supabase-api-key>
EMAIL_HOST=smtp.example.com
EMAIL_USER=example@email.com
EMAIL_PASS=yourpassword
```

### Starting the Application

```bash
# Run both frontend and backend via Next.js API routes
npm run dev
```

### Deployment

* **Frontend and Backend:** Deployed together on **Vercel** using serverless API routes for Express.
* **Database:** Managed via Supabase (PostgreSQL).

---

## Acceptance Criteria

* Inputs validated and persisted in Supabase.
* ROI and savings calculations always favor automation.
* Email-gated report generation functions as required.
* Fully responsive and styled interface using TailwindCSS and shadcn.
* Proper documentation and setup instructions included.

---

**Author:** Mahalakshmi K
**Date:** 7th October 2025
**Status:** Final — Ready for Implementation
