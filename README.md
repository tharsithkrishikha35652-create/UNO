# CALCREDIT

<p align="center">
  <strong>The intentional academic marks, GPA, and CGPA utility engineered for students of College of Engineering, Guindy (CEG), Anna University.</strong>
</p>

<p align="center">
  <em>"Built by Students, for Students · Calculating Today for a Brighter Tomorrow."</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.1-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-v13-FFCA28?style=flat-square&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Capacitor-Android-1192E8?style=flat-square&logo=capacitor" alt="Capacitor Android" />
  <img src="https://img.shields.io/badge/Vitest-Unit_Tested-729B1B?style=flat-square&logo=vitest" alt="Vitest" />
  <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright" alt="Playwright" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [1. Multi-Course Assessment Engine](#1-multi-course-assessment-engine)
  - [2. Anna University Regulation Compliance](#2-anna-university-regulation-compliance)
  - [3. Course & Elective Selection System](#3-course--elective-selection-system)
  - [4. GPA Hub & Predictive Grade Estimation](#4-gpa-hub--predictive-grade-estimation)
  - [5. Cumulative CGPA Hub & Target Planner](#5-cumulative-cgpa-hub--target-planner)
  - [6. "Warm Scholar" Dual-Theme Aesthetic](#6-warm-scholar-dual-theme-aesthetic)
  - [7. Interactive CEG Architectural Artwork](#7-interactive-ceg-architectural-artwork)
  - [8. Cloud Persistence & Guest Mode Privacy](#8-cloud-persistence--guest-mode-privacy)
  - [9. Native Android Support (Capacitor)](#9-native-android-support-capacitor)
- [Grading Scale & Course Weightages](#grading-scale--course-weightages)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running Locally](#running-locally)
  - [Testing](#testing)
  - [Production Build](#production-build)
  - [Android Deployment](#android-deployment)
- [Firebase & Security Architecture](#firebase--security-architecture)
- [Creators & Credits](#creators--credits)

---

## Overview

**CALCREDIT** is a specialized academic companion web and mobile application designed to replace ad-hoc spreadsheets, confusing manual marks calculations, and generic calculators with an accurate, regulation-aware tool.

Built specifically around the autonomous curriculum of **College of Engineering, Guindy (CEG), Anna University**, CalCredit accurately mirrors the dynamic continuous assessment (CA) schemes, laboratory weightages, and 45% end-semester exam (ESE) passing thresholds across all eight semesters.

---

## Key Features

### 1. Multi-Course Assessment Engine
Engineering curricula encompass varying course structures with differing ratios of continuous assessment and semester-end exams. CalCredit natively supports **11 distinct course types**:

- **Theory Courses** (`theory`): CA 40M (Tests 32M + Activities 8M) · ESE 60M (Theory Exam).
- **Laboratory Integrated Theory (2-0-2)** (`2-0-2`): CA 60M (Tests 20M + Activities 5M + Lab 35M) · ESE 40M (Theory Exam).
- **Laboratory Integrated Theory (2-0-4)** (`2-0-4`): CA 50M (Tests 20M + Activities 5M + Lab 25M) · ESE 50M (Theory 40M + Practical Exam 10M).
- **Laboratory Integrated Theory (1-0-2)** (`1-0-2`): CA 60M (Tests 20M + Activities 5M + Lab 35M) · ESE 40M (Theory Exam).
- **Practical Laboratory Courses** (`laboratory-course`): Continuous Assessment 60M (Work 45M + Midterm 15M) · Practical Exam 40M.
- **Project Work** (`project-work`): Continuous Assessment 60M (Review I 10M + Review II 20M + Review III 30M) · ESE 40M (Guide Report 10M + External Thesis 10M + Internal Viva 10M + External Viva 10M).
- **Self Development Courses (SDC)** (`self-development`): CA 60M · ESE 40M.
- **Universal Human Values (UHV)** (`universal-human-values`): 100% Internal Assessment (Tests 70M + Assignments 30M) without ESE.
- **Industry Oriented Courses & Standards Courses**: 100% Internal continuous evaluation (Two 50% Tests).
- **Audit Courses**: Internal assessment without GPA credit weightage.
- **Self-Learning Courses (SLC)** (`self-learning`): External assessment with custom 90–100 scale and configurable pass mark (40 or 50).

### 2. Anna University Regulation Compliance
- **45% Minimum ESE Passing Rule**: Under Anna University regulations, a student who secures full internal marks (e.g. 40/40 or 60/60) will still receive grade **`U` (0 grade points)** if their End-Semester Examination score falls below 45% (e.g. `< 45/100` on Theory/Lab exams, or `< 18/40` on Project Work). CalCredit enforces this critical rule to prevent false-pass estimations.
- **Grade Points**: Computes letter grades from `S` (10 GP) through `C` (5 GP) and `U` (0 GP), preserving official technical grades (`SA` for Shortage of Attendance, `WC` for Course Withdrawal).
- **Incomplete Input Handling**: Automatically withholds final grade assignments until all mandatory components are entered, avoiding premature celebrations.

### 3. Course & Elective Selection System
- Preset curriculum maps spanning **Semester 1 through Semester 8**.
- Dedicated slot support for **Professional Electives (PE)** and **Open Electives (OE)**.
- Clean modal workflows to swap or assign electives without erasing previously saved marks.
- Inline status badges indicating completion, scores, and grade breakdowns.

### 4. GPA Hub & Predictive Grade Estimation
- **Semester GPA Engine**: Pure credit-weighted GPA calculation with automatic handling of variable credits and zero-credit safety.
- **Predictive Estimation**: Unsure about upcoming lab or activity scores? Toggle GPA Estimates with a target percentage (e.g. 80%) to simulate expected GPA while preserving all currently entered marks.
- **GPA History Tracker**: Save snapshots of semester GPA calculations with timestamps, sync them across devices, and revisit past academic records.

### 5. Cumulative CGPA Hub & Target Planner
- Computes overall CGPA across completed semesters with credit-weighted mathematics.
- **Target CGPA Calculator**: Enter your dream CGPA and the tool calculates the exact average GPA required across upcoming semesters to achieve that goal, complete with realistic feasibility warnings.

### 6. "Warm Scholar" Dual-Theme Aesthetic
Designed to feel like an intentional university utility rather than a generic SaaS dashboard:
- **Light Theme**: Warm cream backdrop (`#FAF8F5`) layered with delicate peach and slate decorative educational elements (`warm-scholar-bg.png`).
- **Dark Theme**: Charcoal/navy base (`#161618`) accented with muted copper, deep slate academic motifs, and subtle coordinate grids (`dark-scholar-bg.png`).
- Strict typography using **Plus Jakarta Sans** for crisp form inputs and **Fraunces/Merriweather** serif accents for editorial elegance.
- Intentional sentence-case labeling throughout, preserving technical acronyms (`CA1`, `CA2`, `ESE`, `GPA`, `CGPA`, `CEG`).

### 7. Interactive CEG Architectural Artwork
The Credits view features a bespoke, vector-accurate architectural elevation of the **CEG Main Building Clock Tower**:
- **Real-Time Clock Tower**: Analog hour and minute hands reflect the user's actual local time.
- **Day/Night Responsive**: Synchronizes lighting with the active theme—sunlit brick in light mode and glowing starry night windows in dark mode.
- **Interactive Lighting**: Toggle or tap window bays to illuminate study lamps across campus wings.

### 8. Cloud Persistence & Guest Mode Privacy
- **Firebase Authentication**: Sign in with Email/Password or Google OAuth.
- **Cloud Firestore**: Seamless multi-device sync for courses, subject scores, preferences, and GPA histories.
- **Guest Mode**: Zero login required. Operates completely in-memory with total privacy—no cookies, no trackers, and no unsolicited uploads.
- **Legacy Migration**: Automated one-click import from earlier localStorage iterations.

### 9. Native Android Support (Capacitor)
- Pre-configured with `@capacitor/core` and `@capacitor/android` for compiling into standalone native Android APKs/AABs with edge-to-edge system bar styling.

---

## Grading Scale & Course Weightages

### Letter Grade Scale (Standard Courses)

| Score Range | Letter Grade | Grade Point | Definition |
|---|:---:|:---:|---|
| **91 – 100** | **S** | **10** | Outstanding |
| **81 – 90.99** | **A+** | **9** | Excellent |
| **71 – 80.99** | **A** | **8** | Very Good |
| **61 – 70.99** | **B+** | **7** | Good |
| **56 – 60.99** | **B** | **6** | Average |
| **50 – 55.99** | **C** | **5** | Satisfactory |
| **< 50.00** | **U** | **0** | Re-appearance / Fail |
| *Shortage of Attendance* | **SA** | **0** | Lack of mandatory attendance |
| *Withdrawal* | **WC** | **0** | Officially withdrawn |

*Note: Self-learning courses employ the Anna University 90/80/70/60/50/40 scale where 90 achieves `S`, with selectable 40 or 50 minimum pass marks.*

---

## Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Core Framework** | React 19 (`react`, `react-dom`) | Modern component architecture and UI reactivity |
| **Language** | TypeScript 5.9 | Full type safety across marks, subjects, and grade engines |
| **Build System** | Vite 7.1 | Ultra-fast HMR and optimized asset bundling |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first styling with CSS variables and custom serif tokens |
| **Icons** | Lucide React | Clean, consistent academic and navigation icons |
| **Backend & Cloud** | Firebase v13 (Auth & Firestore) | User authentication, cloud sync, and security rules |
| **Mobile Runtime** | Capacitor 8.5 (`@capacitor/android`) | Native mobile packaging for Android devices |
| **Unit Testing** | Vitest 5.0 + jsdom | Fast, isolated unit and edge-case calculation tests |
| **E2E Testing** | Playwright Test | Cross-browser integration testing (Chromium, Firefox, WebKit) |

---

## Project Architecture

```text
UNO/
├── .agents/                    # Agentic developer workflows and skill definitions
├── public/                     # Static assets (favicons, official wallpaper art)
│   ├── warm-scholar-bg.png     # Official Warm Scholar light backdrop
│   └── dark-scholar-bg.png     # Official Dark Scholar navy/copper backdrop
├── src/
│   ├── __tests__/              # Comprehensive Vitest unit test suites
│   │   ├── calculatorUtils.test.ts # Mark boundary, 0/max, edge-case & 45% ESE tests
│   │   └── gpaEstimates.test.ts    # GPA projection, estimation clamping & ready checks
│   ├── components/             # Modular React UI components
│   │   ├── AcademicProfile.tsx # Student details & identity drawer
│   │   ├── AuthScreen.tsx      # Email/Password & Google sign-in interface
│   │   ├── CGPAHub.tsx         # Cumulative GPA calculator & target planner
│   │   ├── ContinuousAssessmentSection.tsx # CA1 & CA2 mark entry forms
│   │   ├── CreditsScreen.tsx   # Interactive CEG Main Building & creator credits
│   │   ├── EndSemesterSection.tsx # ESE theory & practical marks inputs
│   │   ├── FeedbackHub.tsx     # In-app feedback reporting to Firestore
│   │   ├── GPACalculator.tsx   # Semester GPA calculation & predictive estimation
│   │   ├── MobileBottomNavigation.tsx # Persistent mobile navigation bar
│   │   ├── SemesterCourseDashboard.tsx # Course listing, marks status & elective slots
│   │   ├── StickyResultSummary.tsx # Mobile pinned result & grade indicator
│   │   └── SubjectSelectionDialog.tsx # Modern elective and subject selection modal
│   ├── App.tsx                 # Root application state, tabs, and routing coordinator
│   ├── calculatorUtils.ts      # Pure calculation engine (marks, grades, GPA math)
│   ├── firebase.ts             # Firebase client SDK initialization
│   ├── firebaseData.ts         # Firestore data access layer & workspace synchronization
│   ├── gpaCourses.ts           # Curriculum database & course credit configurations
│   ├── index.css               # Design tokens, Warm Scholar ambient styles & animations
│   ├── main.tsx                # React DOM entry point
│   └── types.ts                # TypeScript interfaces for subjects, courses & grades
├── tests/                      # Playwright E2E browser test specifications
│   └── example.spec.ts         # Cross-browser verification suite
├── capacitor.config.ts         # Capacitor native mobile bridge configuration
├── firestore.rules             # Declarative Firestore security and isolation rules
├── playwright.config.ts        # Playwright E2E test runner configuration
├── vitest.config.ts            # Vitest unit test runner configuration
└── package.json                # Project dependencies, metadata, and scripts
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/tharsithkrishikha35652-create/UNO.git
cd UNO
npm install
```

### Environment Setup
Create a local environment file at `src/.env.local`:

```bash
cp src/.env.example src/.env.local
```

Configure your Firebase credentials inside `src/.env.local`:

```ini
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

*(Note: If you run without `.env.local`, the application will seamlessly default to **Guest Mode** with zero cloud sync).*

### Running Locally
Start the Vite development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Testing

Run unit tests (Vitest):
```bash
npm run test:unit
```

Run unit tests in watch mode:
```bash
npm run test:unit:watch
```

Run end-to-end tests (Playwright):
```bash
npm run test:e2e
```

Run both test suites:
```bash
npm run test:all
```

### Production Build
Compile and bundle for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Android Deployment
To sync web assets and launch in Android Studio:

```bash
npx cap sync android
npx cap open android
```

---

## Firebase & Security Architecture

Cloud Firestore is protected by strictly scoped rules defined in [`firestore.rules`](firestore.rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /feedback/{feedbackId} {
      allow create: if request.auth != null || request.resource.data.userId == 'guest';
      allow read, update, delete: if false;
    }
  }
}
```

- **Per-User Isolation**: Every read and write to `users/{userId}/*` (subjects, grade records, GPA history, settings) requires that `request.auth.uid == userId`. Cross-user data leakage is physically prevented at the database layer.
- **Feedback Submissions**: Allows authenticated or guest users to write feedback while forbidding any public read access.

---

## Creators & Credits

CalCredit was ideated, designed, and developed by undergraduate students at **College of Engineering, Guindy, Anna University**:

| Creator | Role | Department / Batch | Roll No. | Profiles |
|---|---|---|---|---|
| **Tharsith R** | App Developer | Computer Science and Engineering (CSE – N Batch) | `2026103054` | [LinkedIn](https://www.linkedin.com/in/tharsith-r-b0702a372) |
| **Raghu Nandan S** | UI/UX Designer | Electrical Engineering (EE – VLSI) | `2026123013` | [LinkedIn](https://www.linkedin.com/in/raghu-nandan-sudhakar-15b85b381) · [Instagram](https://www.instagram.com/the.creato.lab?vrfl=MXhxYWNlcG05bjI3eg==) |

Special gratitude to the faculty and student community of **College of Engineering, Guindy (CEG) · Anna University, Chennai**.

---

<p align="center">
  <sub>© 2026 CalCredit. Built with pride for College of Engineering, Guindy.</sub>
</p>
