# Tevvo Atlas

A Vue 3 application to explore countries, featuring Supabase authentication, country search & filter, detailed country views, unit and end‑to‑end tests, and deployment via Vercel.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- ✅ User Authentication via Supabase
- 🌍 Country listing from [restcountries.com](https://restcountries.com)
- 🔍 Real-time search and region filtering
- 📄 Detail view with country info (languages, currencies, borders)
- 📦 State management with Pinia
- 🧪 Unit tests with Vitest
- 🧭 End-to-End tests with Playwright
- 📱 Responsive design using Tailwind CSS

---

## 🛠 Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite, Vue Router
- **Authentication:** Supabase
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Unit Testing:** Vitest, Vue Test Utils
- **E2E Testing:** Playwright
- **Deployment:** Vercel

---

## 🧰 Getting Started

### ✅ Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git

### 📦 Installation

```sh
git clone https://github.com/Beri-P/Tevvo-Atlas.git
cd Tevvo-Atlas
npm install
```

### Environment Variables
Create a .env file in the project root:

```sh
cp .env.example .env
```

Fill in your Supabase credentials:

```sh
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### ▶️ Running the App

```sh
npm run dev
```
Visit http://localhost:5173 in your browser.

## 🧪 Testing

### ✅ Unit Tests

```sh
npm run test:unit
```

### ✅ End-to-End Tests

```sh
npm run test:e2e
```
A code coverage report is generated in the coverage/ directory. You can include a screenshot in this README if desired.


## 🚀 Deployment

This project is deployed on **Vercel**.


To deploy your own version:

1. Push the repo to GitHub

2. Go to https://vercel.com and import the GitHub project

3. Add these Environment Variables in your Vercel project settings:

 -`VITE_SUPABASE_URL`

 -`VITE_SUPABASE_ANON_KEY`

4. Deploy 🎉

🔗 Live Demo

 [tevvo-atlas.vercel.app](https://tevvo-atlas.vercel.app)

## 🤝 Contributing

1. Fork this repository

2. Create a new branch:

```sh
git checkout -b feature/YourFeature
```

3. Commit your changes:

```sh
git commit -m "feat: add YourFeature"
```

4. Push to your branch:

```sh
git push origin feature/YourFeature
```

5. Open a Pull Request

Please follow the existing code style and write tests for new features.

## 📄 License

This project is licensed under the MIT License.
See the LICENSE file for full details.
