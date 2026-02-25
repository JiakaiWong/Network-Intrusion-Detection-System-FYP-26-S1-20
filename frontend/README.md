```markdown
# IDS Analysis Dashboard — Frontend

A React + Vite frontend for the Network Intrusion Detection System (IDS) dashboard.

---

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v22+ (LTS recommended)
- npm v10+


```
## To verify:
```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Network-Intrusion-Detection-System-FYP-26-S1-20-.git
cd Network-Intrusion-Detection-System-FYP-26-S1-20-
```

### 2. Navigate to Frontend

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

The app will run at **http://localhost:5173**

---

## Project Structure

```
frontend/
├── public/
│   └── securityimage.jpeg        # Static assets
├── src/
│   ├── pages/
│   │   ├── shared/               # Public-facing pages
│   │   │   ├── Visitor.jsx       # Landing page
│   │   │   ├── Login.jsx         # Login (Analyst & Admin)
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── About.jsx         # About page
│   │   │   ├── Features.jsx      # Features page
│   │   │   ├── Demo.jsx          # Demo page
│   │   │   └── Logout.jsx        # Logout confirmation
│   │   ├── analyst/              # Security Analyst pages
│   │   │   ├── Dashboard.jsx     # Analyst dashboard
│   │   │   ├── Alerts.jsx        # Alerts table
│   │   │   └── Reports.jsx       # Reports page
│   │   └── admin/                # Administrator pages
│   │       ├── AdminDashboard.jsx # Admin home
│   │       └── UserManagement.jsx # User management
│   ├── App.jsx                   # Route configuration
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
└── vite.config.js
```

---

## Page Routes

| Route              | Page            | Access             |
|--------------------|-----------------|-------------------|
| `/`                | Visitor          | Public             |
| `/about`           | About            | Public             |
| `/features`        | Features         | Public             |
| `/demo`            | Demo             | Public             |
| `/login`           | Login            | Public             |
| `/register`        | Register         | Public             |
| `/dashboard`       | Dashboard        | Security Analyst   |
| `/alerts`          | Alerts           | Security Analyst   |
| `/reports`         | Reports          | Security Analyst   |
| `/admin`           | Admin Dashboard  | Administrator      |
| `/usermanagement`  | User Management  | Administrator      |
| `/logout`          | Logout           | Authenticated      |

---

## Dependencies

| Package              | Purpose                    |
|----------------------|----------------------------|
| `react`              | UI framework               |
| `react-dom`          | DOM rendering              |
| `react-router-dom`   | Client-side routing        |
| `vite`               | Build tool and dev server  |

---

## 🔗 Backend Connection


---

## 🛠️ Available Scripts

| Command             | Description                 |
|---------------------|-----------------------------|
| `npm run dev`       | Start development server    |
```

