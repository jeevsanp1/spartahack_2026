<div align="center">

  <h1>🚀 SpartaHack 2026 Mobile App</h1>
  
  <p>
    <strong>The official companion app for SpartaHack 2026.</strong><br>
    Built with modern mobile technologies to provide a seamless hackathon experience.
  </p>

  <p>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" /></a>
    <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>

</div>

---

## 📱 Overview

The **SpartaHack 2026 App** is designed to connect hackers, merchants, and organizers in a unified platform. Whether you're scanning in for a workshop, redeeming freebies at local merchants, or exploring the venue, this app is your go-to utility.

## ✨ Key Features

- **🛍️ Merchant Redemption**: Seamlessly redeem rewards and perks at participating merchant locations.
- **📷 QR Code Scanning**: Built-in scanner for quick check-ins, networking, and activity logging.
- **🗺️ Exploration**: Discover venue maps, schedules, and important event locations.
- **🌗 Adaptive UI**: Beautifully crafted interface with full support for both Dark and Light modes.
- **⚡ High Performance**: Powered by React Native Reanimated for buttery smooth interactions.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54) & [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (v6)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI/Styling**: Custom Design System with `react-native-svg` & Google Fonts (`Instrument Serif`)
- **Camera/Sensors**: `expo-camera`, `expo-barcode-scanner`

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **npm** or **yarn**
- **Expo Go** app installed on your iOS/Android device.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeevsanp1/spartahack_2026.git
   cd spartahack_2026/spartahack-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code shown in the terminal with your **Expo Go** app (Android) or **Camera** app (iOS).

## 📂 Project Structure

```bash
spartahack-app/
├── app/                 # Expo Router pages & navigation
│   ├── (tabs)/          # Main tab navigation
│   ├── merchant/        # Merchant specific flows
│   ├── scan.tsx         # QR scanning screen
│   └── _layout.tsx      # Root layout & theme provider
├── components/          # Reusable UI components
├── assets/              # Images, fonts, and static resources
└── hooks/               # Custom React hooks (e.g., useColorScheme)
```

## 🤝 Contributing

We welcome contributions! Please follow the standard GitHub flow:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ for <strong>SpartaHack 2026</strong></p>
</div>
