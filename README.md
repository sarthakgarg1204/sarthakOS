<h1 align="center">🧑‍💻 Ubuntu Web OS – Developer Portfolio</h1>

<p align="center">
  A full-stack Ubuntu-style Web Operating System ⚙️ built with Next.js, Tailwind CSS, TypeScript, and Framer Motion.
</p>

<p align="center">
  <a href="https://sarthak-os.vercel.app"><strong>🌐 Live Demo</strong></a> •
  <a href="./LICENSE">🪪 MIT License</a> •
  <a href="https://github.com/sarthakgarg1204/sarthakOS">⭐ GitHub</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/sarthakgarg1204/sarthakOS?style=flat-square" />
  <img src="https://img.shields.io/github/deployments/sarthakgarg1204/sarthakOS/vercel?label=vercel&style=flat-square" />
  <img src="https://img.shields.io/github/stars/sarthakgarg1204/sarthakOS?style=flat-square" />
</p>

---

## 🌟 Features

### 🔐 UX Features

* **Animated Boot Screen** – A smooth power-up simulation to replicate a real OS booting process.
* **Lock Screen** – Unlock with a single left-click gesture.
* **Wallpaper Customization** – Change desktop wallpapers via the Settings app.
* **Power Button Animation** – Shuts down and returns to a static boot screen.
* **Brightness Control** – Adjust screen brightness using a UI slider.

### 🪟 Desktop Environment

* **Ubuntu-Style Interface** – Includes top navbar, sidebar launcher, and taskbar.
* **All Applications** – A dynamic, animated screen to view all installed apps.
* **Activities Overview** – Inspired by GNOME's activity screen.
* **Light/Dark Mode** – Toggle system theme, persisted in localStorage.
* **Windowing System**:

  * Draggable, resizable app windows
  * Minimize, maximize, close functionality
  * Focus management
  * Restore animations with Framer Motion

### 🧩 Preinstalled Applications

* 🌐 **Chrome** — Browser simulation
* 🧮 **Calculator** — Simple calculator
* 💻 **Terminal** — Faux terminal prompt
* 🎵 **Spotify** — Themed music player UI
* ⚙️ **Settings** — Theme, brightness & wallpaper configuration
* 📅 **Calendar** — Date & day viewer
* 📇 **Contact Me** — Social/email links and form
* ✅ **Todo** — Basic productivity app
* 👨‍💻 **AboutSarthak** — Your resume & portfolio in app form

---

## 🔗 Live Demo

🌍 [sarthak-os.vercel.app](https://sarthak-os.vercel.app)

---

## 🛠️ Tech Stack

* **Next.js 14 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **React RND**
* **Lucide Icons**

---

## 📂 Project Structure

```
/public
/src
 ┣ components/
 ┃ ┣ apps/                // All app components (Chrome, Spotify, AboutSarthak, etc.)
 ┃ ┣ context-menu/        // Right-click menus
 ┃ ┣ screens/             // Desktop, Activities, All Apps, Boot, Lock, etc.
 ┃ ┣ ui/                  // Navbar, Sidebar, Taskbar, etc.
 ┃ ┣ windowing/           // Window manager, UbuntuWindow, etc.
 ┃ ┣ util-components/
 ┃ ┣ constants/
 ┃ ┣ types/
 ┃ ┗ utils/
 ┣ hooks
 ┣ app/
 ┗ lib/
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/sarthakgarg1204/sarthakOS.git
cd sarthakOS
pnpm install
pnpm dev
```

> Requires Node.js ≥ 18 & PNPM

---

## 📸 Preview

![Preview Screenshot](/public/images/screenshots/desktop-preview.png)

---

## 🪪 License

This project is open-sourced under the [MIT License](./LICENSE).

---

## 🙋‍♂️ Author

**Sarthak Garg**
📧 [sarthakgarg7124@gmail.com](mailto:sarthakgarg7124@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/sarthakgarg1204) • [GitHub](https://github.com/sarthakgarg1204)
