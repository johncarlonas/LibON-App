<div align="center">

<h1>LibON App</h1>

<p>
  A citizen-centered digital municipal platform designed to simplify access to
  local government services, information, and community reporting in Libon, Albay.
</p>

<p>
  Demonstration prototype developed for the <b>Youth Innovation Challenge 2026</b>.
</p>

<p>
  <img src="https://img.shields.io/badge/REACT-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TAILWIND_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FIGMA-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />
</p>

<p>
  <a href="https://www.canva.com/design/DAHWl3z8rNg/oyC2wpzyOrZT9CbyYNAyIQ/view?utlId=h148928ca0f#1">Project Presentation</a>
  &nbsp;•&nbsp;
  <a href="https://github.com/johncarlonas/LibON-App">Source Code</a>
</p>

</div>

---

## Overview

**LibON App** is an interactive web-based prototype of a proposed digital municipal platform for Libon, Albay.

It explores how a centralized digital experience could help residents discover municipal services, access public information, submit community concerns, and track the progress of their reports.

The prototype includes two connected interfaces:

- **Citizen Application** - A mobile-inspired interface for accessing municipal information and submitting concerns.
- **LGU Administrative Dashboard** - A management interface demonstrating how authorized municipal personnel could organize reports, maintain content, and monitor operations.

Both interfaces share a browser-local data store to demonstrate a connected reporting and administration workflow without requiring a production backend.

> **Project status:** This repository contains a functional demonstration prototype, not an officially deployed municipal service. Data, responses, administrative activities, and integrations are simulated for presentation and evaluation purposes.

## Features

### Citizen Application

The citizen-facing interface presents municipal services and information through a mobile-inspired web experience.

| Feature             | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| Municipal Services  | Browse service information, requirements, procedures, and responsible offices.    |
| Community Reporting | Submit structured reports containing a category, description, and location.       |
| Report Tracking     | View report identifiers, processing stages, and status histories.                 |
| Municipal Updates   | Browse simulated announcements, advisories, and community programs.               |
| Opportunities       | Discover listed scholarships, programs, and other opportunities.                  |
| Explore Libon       | Browse sample local destinations, businesses, and community listings.             |
| Help & Contacts     | Access illustrative emergency contacts and municipal office directories.          |
| Unified Search      | Search across available services, contacts, updates, and local listings.          |
| Talk to Bonly       | Interact with a simulated municipal assistant for information and guided actions. |

### LGU Administrative Dashboard

The administrative interface demonstrates workflows for receiving, managing, and monitoring municipal concerns and information.

| Module                 | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Overview               | Displays summary statistics, recent activities, and report information.             |
| Ticket Management      | Review, filter, assign, update, and resolve citizen reports.                        |
| Content Administration | Create and maintain municipal services, updates, contacts, and related information. |
| Knowledge & Routing    | Manage demonstration knowledge-base entries and office-routing rules.               |
| Analytics              | Explore report distributions, operational summaries, and workload information.      |
| Users & Activity       | Demonstrate administrative roles, user management, and activity records.            |

Administrative actions operate on local demonstration data. Role-based interface behavior is simulated and does not provide production authentication or authorization.

## System Architecture

LibON uses a client-side architecture built with React and TypeScript.

The citizen application and administrative dashboard are rendered within the same web application and access a shared demonstration store.

<div align="center">
  <img src="src/assets/system-archi.png" alt="LibON System Architecture" width="550" />
</div>

### Data Management

The prototype uses `src/demoStore.ts` to manage shared application data.

The store provides:

- Predefined demonstration records for reports, municipal content, routing rules, and administrative users.
- State subscriptions through React's `useSyncExternalStore`.
- Local state updates and change notifications.
- Persistence through the browser's `localStorage`.
- Demonstration data reset and reload utilities.

Changes made through either interface can be reflected in the other interface within the running application.

Data is stored locally in the browser. It is not synchronized between devices, accounts, or independent browsers through a backend service.

### Report Workflow

The reporting module models the following process:

<div align="center">
  <img src="src/assets/report-workflow.png" alt="LibON Report Workflow" width="900" />
</div>

The implemented demonstration uses these report statuses:

1. `Submitted`
2. `Received`
3. `Assigned`
4. `Action Taken`
5. `Resolved`

Each report can contain a generated tracking ID, category, description, location, assigned office, timestamps, status history, and associated notes.

The administrative interface can update report information, while the citizen interface displays corresponding tracking progress.

All of these operations occur in the demonstration environment.

### Bonly - Municipal Assistant Prototype

Bonly represents the proposed conversational municipal assistant.

In the current implementation, its behavior is powered by predefined response logic and information stored in the demonstration content records.

The prototype demonstrates:

- Recognizing selected municipal service and reporting inquiries.
- Providing responses associated with available demonstration content.
- Directing residents to relevant application sections.
- Guiding users toward the community reporting workflow.
- Presenting illustrative appointment-assistance scenarios.

Bonly is **not currently connected to a live large language model, municipal database, or appointment-booking service**.

Its current implementation is intended to illustrate the proposed user experience.

## Tech Stack

| Technology           | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| React 19             | Component-based user interface development.                   |
| TypeScript           | Typed application logic and data structures.                  |
| Vite 8               | Development server and production build tooling.              |
| Tailwind CSS 4       | Utility-first styling support.                                |
| CSS                  | Custom styling for the citizen and administrative interfaces. |
| Heroicons            | Interface icon library.                                       |
| Figma                | Design and interactive prototyping workflow.                  |
| Browser localStorage | Local persistence of demonstration data.                      |
| pnpm                 | Dependency and package management.                            |

## Project Structure

```text
LibON-App/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── ...                 # Application images and assets
│   ├── imports/                # Imported visual assets
│   ├── AdminDashboard.tsx      # LGU administrative interface
│   ├── App.tsx                 # Citizen interface and navigation
│   ├── demoStore.ts            # Shared demo data and state logic
│   ├── admin.css               # Administrative dashboard styles
│   ├── index.css               # Global and citizen interface styles
│   ├── main.tsx                # React entry point
│   └── vite-env.d.ts           # Vite type declarations
├── .gitattributes              # Git LFS tracking configuration
├── .gitignore                  # Git exclusions
├── .mise.toml                  # Development tool versions
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── package-lock.json           # npm dependency lockfile
├── pnpm-lock.yaml              # pnpm dependency lockfile
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite and Figma configuration
```

## Getting Started

Follow these instructions to set up the demonstration prototype locally.

### Prerequisites

Make sure the following tools are installed:

- [Git](https://git-scm.com/)
- [Git LFS](https://git-lfs.com/)
- [Node.js](https://nodejs.org/) - Version 22
- [pnpm](https://pnpm.io/) - Version 10.34.3

The project includes a `.mise.toml` configuration specifying the Node.js and pnpm versions used by the development environment.

### 1. Clone the Repository

Enable Git LFS before cloning the repository:

```bash
git lfs install
```

Clone the project:

```bash
git clone https://github.com/johncarlonas/LibON-App.git
```

Navigate into the project directory:

```bash
cd LibON-App
```

Retrieve the tracked binary assets:

```bash
git lfs pull
```

Git LFS is required because the repository tracks image assets, fonts, and other binary file formats using LFS.

### 2. Install Dependencies

Install the project's pnpm version if it is not already available:

```bash
npm install -g pnpm@10.34.3
```

Install project dependencies:

```bash
pnpm install --frozen-lockfile
```

This installs the dependencies defined in `package.json` using the committed pnpm lockfile.


### 3. Start the Development Server

Run:

```bash
pnpm dev
```

The development server is configured to use port `8443`.

Open:

```text
http://localhost:8443
```

The application should display the citizen-facing prototype.

### 4. Open the Administrative Dashboard

Navigate to:

```text
http://localhost:8443/admin
```

The administrative dashboard can also be accessed through the application’s demonstration interface.

Because both interfaces operate on the same local demonstration store, report and content changes can be viewed across the connected prototype experience.

## Available Scripts

The following commands are defined in `package.json`.

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `pnpm dev`     | Starts the Vite development server.            |
| `pnpm build`   | Generates the production build.                |
| `pnpm preview` | Serves the production build for local preview. |
| `pnpm format`  | Invokes the configured oxfmt formatter.        |

### Production Build

Generate a production build:

```bash
pnpm build
```

Vite generates the build output in the `dist/` directory.

To preview the generated build:

```bash
pnpm preview
```

The prototype can be hosted on a compatible static hosting platform after its build and configuration requirements are satisfied.

For direct navigation to administrative routes such as `/admin/tickets`, the hosting platform must support appropriate single-page application fallback routing.

## Demonstration Walkthrough

The following workflow demonstrates the connection between the citizen interface and administrative dashboard.

### Citizen Reporting

1. Open the citizen application.
2. Navigate to **Report**.
3. Select a concern category.
4. Provide a description and confirm the demonstration location.
5. Review and submit the report.
6. Open **My Reports** to view the generated report and its tracking status.

### Administrative Processing

1. Open `/admin`.
2. Navigate to **Tickets**.
3. Locate the newly submitted report.
4. Review its details and assign the appropriate office.
5. Update the report status through the available administrative actions.
6. Return to the citizen interface to observe the updated report-tracking information.

These actions demonstrate the proposed information flow between residents and municipal personnel.

No report is transmitted to an actual LGU system.

## Demo Data & Persistence

The repository includes seeded demonstration records for reports, content, municipal offices, administrative users, and related activity.

The application stores modified demonstration data in the browser under the following localStorage key:

```text
libon-pilot-demo-v3
```

To manually reset the local data to the original seeded state, open the browser's developer console and run:

```javascript
localStorage.removeItem("libon-pilot-demo-v3");
window.location.reload();
```

This resets the demonstration data for the current browser origin.

Because persistence is browser-local, clearing site data or using another browser may result in a separate demonstration state.

## Prototype Limitations

LibON App is currently intended for competition demonstration and technical concept validation.

The following production capabilities are not part of the current repository implementation:

- A production backend API or database.
- Real user authentication and secure administrative authorization.
- Synchronization of reports across separate devices or user accounts.
- Direct integration with official LGU information systems.
- A deployed AI language model for Bonly.
- Real-time appointment availability or confirmed municipal bookings.
- Production file uploads and evidence storage.
- Verified, live municipal records and emergency contact information.

The prototype instead uses local demonstration data and simulated interactions to illustrate the intended workflows.

**Important:** Municipal contact information, service details, local listings, report statuses, and appointments shown in the prototype may be fictional or illustrative. They should not be treated as verified government information or relied upon during emergencies.

## Development Notes

This project focuses on demonstrating the user interface, interaction flows, administrative processes, and shared client-side state required for the proposed system.

The codebase currently organizes much of its interface logic into `App.tsx` and `AdminDashboard.tsx`, with demonstration state isolated in `demoStore.ts`.

Future development toward a deployable municipal system would require backend services, secure authentication, persistent shared storage, verified municipal content, and integration testing.

The repository does not currently define an automated test script.

## Project Background

LibON App was developed as a demonstration prototype for the **Youth Innovation Challenge 2026**, presenting a proposed approach to improving digital access to municipal information and services in Libon, Albay.

The broader concept envisions a unified citizen application, an LGU management dashboard, and AI-assisted municipal support.

The scope of this repository is limited to the interactive prototype used to demonstrate that concept.

[View Project Presentation](https://www.canva.com/design/DAHWl3z8rNg/oyC2wpzyOrZT9CbyYNAyIQ/view?utlId=h148928ca0f#1)

---

<div align="center">

**LibON App - Turning Libon digitally ON.**

Developed by [John Carlo E. Nas](https://johncarlonas.me)

</div>
