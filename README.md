# 🚀 Nebras — Dyslexia Support Platform with Smart Pen Integration

An educational platform dedicated to supporting children in school who suffer from dyslexia, powered by a smart pen and engaging digital features.

![GitHub top language](https://img.shields.io/github/languages/top/AhmedBenRahma/Nebras)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Screenshots & Presentation](#screenshots--presentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Nebras** helps dyslexic students overcome learning challenges using a smart pen paired with a mobile application. The system extracts handwritten text from images, syncs it to a central MongoDB database, and leverages web and mobile apps to track words learned, highlight difficult words, offer personalized learning games, and provide audio pronunciation for words and syllables.

---
[▶️ Watch the demo](demo.mp4)
## Features

- **Smart Pen Mobile Integration**  
  Handwriting is scanned and converted to text via the mobile app and smart pen.
- **Centralized Data Sync**  
  All extracted text is uploaded to MongoDB and made available in the Nebras platform.
- **Word Tracking & Analysis**  
  Today's words, most difficult words, and progress charts.
- **Specialized Educational Games**  
  Focus on hard words and improve retention (interactive and fun).
- **Audio Pronunciation**  
  Children can listen to words and syllables.
- **User Management**  
  Login/Signup, offers for educators/parents.
- **Modern UI/UX**  
  Built for children and educators using ReactJS and Flutter.
- **Backend Services**  
  Python-powered backend for OCR, logic, and API integration.

---

## Technology Stack

- **Frontend:**  
  - [Flutter](https://flutter.dev/) (Mobile App)
  - [ReactJS](https://react.dev/) (Web Platform)
- **Backend:**  
  - [Python](https://www.python.org/) (OCR, API)
- **Database:**  
  - [MongoDB](https://www.mongodb.com/) (Learning data storage)
- **Hardware:**  
  - Smart pen device, mobile phone/tablet
- **Other:**  
  - Audio/Pronunciation services

---

## Architecture

```text
[Smart Pen] → [Mobile App (Flutter)] → [MongoDB]
                                        ↓
                             [Nebras Web Platform (ReactJS)]
                                        ↓
                             [Backend Services (Python)]
                                        ↓
                                 [Games, Audio, Analytics]
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AhmedBenRahma/Nebras.git
cd Nebras
```

### 2. Mobile App Setup (Flutter)

```bash
cd app_mobile/
flutter pub get
flutter run
```

*(Configure physical device/emulator & connect the smart pen!)*

### 3. Web Platform Setup (ReactJS)

```bash
cd Frontend/
npm install
npm start
```

### 4. Backend Setup (Python)

```bash
cd Backend/
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 5. Database Setup

Install and start MongoDB server, then configure connection details in environment variables or config files.

---

## Usage

- **Mobile App:** Scan handwriting, send data to platform.
- **Web Platform:** Log in, view today's words, hard words, play learning games, listen to words.
- **Teachers/Parents:** Get reports, monitor progress, customize offers.
- **Games:** Engage children to master difficult vocabulary.
- **Audio:** Play pronunciation for any word or syllable.

---

## File Structure

```
Nebras/
│-- Backend/                 # Python APIs & OCR logic
│-- Frontend/                # ReactJS app
│-- app_mobile/              # Flutter mobile app
│-- Présentation - Qari.pdf  # Project presentation (Smart Pen)
│-- README.md
│-- ...
```

---

## Screenshots & Presentation

For a detailed system demo, see:
- **Project PDF Presentation:** `Présentation - Qari (قاري) – The Smart Pen.pdf`
- *(Add screenshots here of your platform, games, mobile app, and analytics!)*

---

## Contributing

We welcome pull requests, ideas and testing!  
- Fork the repo, create a feature branch, and submit your PR.
- Major changes? Open an issue for discussion.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

Project by [Ahmed Ben Rahma](https://github.com/AhmedBenRahma).

*Empower every child. Learn, play, and listen with Nebras!*
