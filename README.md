<div align="center">

  <h1>STAMPD Rewards</h1>
  
  <p>
    <strong>The rewards program built for small businesses.</strong><br>
    Empowering local merchants and rewarding loyal customers through a seamless digital experience.
  </p>

  <p>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" /></a>
    <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>

</div>

---

## 📱 Overview

**STAMPD Rewards** is a dedicated platform designed to modernize loyalty for small businesses. We bridge the gap between local merchants and their customers, replacing clunky paper punch cards with a sleek, digital solution. Whether you're grabbing coffee or shopping locally, STAMPD makes every visit count.

## ✨ Key Features

- **🏆 Digital Loyalty**: Earn tokens and redeem rewards at your favorite local spots with a simple scan.
- **🛍️ Merchant Discovery**: Find and explore new small businesses in your area.
- **📷 Instant Check-in**: Seamless QR code scanning for quick transaction verification and reward redemption.
- **🌗 Adaptive UI**: A modern, premium interface that adapts to your device's Light and Dark modes.
- **⚡ Fast & Smooth**: Built for speed and reliability, ensuring you never hold up the line.

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
│   ├── merchant/        # Merchant detail & reward flows
│   ├── scan.tsx         # QR scanning functionality
│   └── _layout.tsx      # Root layout & theme provider
├── components/          # Reusable UI components
├── assets/              # Branding, icons, and fonts
└── hooks/               # Custom React hooks
```

## 🤝 Contributing

We welcome contributions to help support small businesses! Please follow the standard GitHub flow:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ for <strong>Local Businesses Everywhere</strong></p>
</div>
