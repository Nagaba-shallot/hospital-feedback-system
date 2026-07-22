# QR-Powered Hospital Feedback System

A modern, mobile-first patient experience evaluation platform built with **Next.js 15 (App Router)** and **Tailwind CSS**. This system enables healthcare facilities to display a centralized check-in landing hub on lobby monitors featuring a dynamically generated, scannable QR code. Patients can scan the display using their smartphones to launch an optimized, multi-step review questionnaire.

---

## ✨ Features

* **Desktop Kiosk Landing Hub**: A clean, professional introductory interface designed for public waiting area monitors and feedback stations.
* **Live QR Code Generator**: Utilizes `qrcode.react` to dynamically evaluate the current local network origin host and generate a highly redundant, scannable matrix block.
* **HCAHPS-Aligned Survey Architecture**: Over 50 clinical quality assurance questions organized across 11 logical healthcare assessment metrics (e.g., Nursing Care, Emergency Dept, Facility Comfort).
* **Multi-Page Questionnaire UI**: Splits massive question pools into digestible step-by-step mobile views to reduce user drop-off rates.
* **Fully Responsive & Accessible**: Fluid scaling using Tailwind configurations providing seamless execution across both large desktop panels and tiny smartphone displays.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Styling**: Tailwind CSS
* **QR Rendering**: `qrcode.react`
* **Icons**: Native Semantic Emojis

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18.0.0 or higher) installed on your system.

### 2. Installation
Clone this repository to your local machine and install the application dependencies:
```bash
git clone https://github.com
cd hospital-feedback-system
npm install
```

### 3. Local Environment Setup
To enable local wireless network smartphone preview testing without triggering cross-origin asset resource blocks, create an environment definition file in the project root:

```bash
touch .env.local
```

Open `.env.local` and specify your developer host configurations:
```text
ALLOWED_DEV_HOSTS="192.168.100.34,192.168.100.78,localhost"
```

### 4. Running the Development Server
Launch the compiler and execution cluster:
```bash
npm run dev
```

Open **`http://localhost:3000`** on your machine to view the desktop dashboard, or use your local Wi-Fi IP address (**`http://192.168.100.34:3000`**) to scan and test on your mobile device!

---


## 🔒 Security & Privacy Compliance

* **No PII Stored**: The survey structure completely omits requests for Patient Identifiable Information (Names, Phone Numbers, Social Security Tokens) to limit regulatory liability.
* **Sanitized Tracking**: Designed to easily plug into backend server actions or secure API handlers (e.g., Supabase or Firebase) using parameterized storage filters.
