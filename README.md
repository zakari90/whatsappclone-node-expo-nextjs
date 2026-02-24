# 💬 WhatsApp Clone - Real-Time Messaging Application

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.76.7-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.13-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A production-grade, full-stack real-time messaging application built with React Native and Node.js**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Screenshots](#-screenshots)

</div>

---

## 🎯 Overview

A feature-rich WhatsApp clone demonstrating modern full-stack development practices. Built from scratch with real-time messaging, online presence tracking, and cross-platform mobile support (iOS, Android, Web).

### **Why This Project?**

This project showcases:

- ✅ **Full-Stack Proficiency** - Complete ownership from database to UI
- ✅ **Real-Time Systems** - WebSocket implementation with Socket.IO
- ✅ **Cross-Platform Development** - Single codebase for iOS, Android, and Web
- ✅ **Production Quality** - Security, performance, and scalability considerations
- ✅ **Modern Tech Stack** - Industry-standard tools and frameworks

---

## ✨ Features

### **Core Messaging**

- 💬 Real-time instant messaging
- ✅ Message read receipts (single/double checkmarks)
- ⌨️ Typing indicators
- 📱 Cross-platform support (iOS, Android, Web)
- 💾 Message persistence

### **User Experience**

- 🟢 Online/offline status tracking
- 👤 User profiles with avatars
- 🎨 Premium gradient UI design
- 🌙 Smooth animations and transitions
- ⚡ Optimized performance (60fps)

### **Security & Authentication**

- 🔐 JWT-based authentication
- 🔒 Password encryption (bcrypt)
- 🛡️ Input validation (Zod)
- 🔑 Secure API endpoints

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework:** React Native 0.76.7 + Expo 52
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand
- **Navigation:** Expo Router (File-based routing)
- **Real-time:** Socket.IO Client
- **Storage:** AsyncStorage
- **UI Libraries:** Expo Vector Icons, Expo Linear Gradient

### **Backend**

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.21
- **Database:** MongoDB with Mongoose 8.13
- **Real-time:** Socket.IO 4.8
- **Authentication:** JWT + bcryptjs
- **Validation:** Zod
- **File Upload:** Multer

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Expo CLI (optional, for mobile development)

### **Installation**

1. **Setup Backend**

```bash
cd server
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "PORT=5000" >> .env

# Start server
npm run dev
```

2. **Setup Frontend**

```bash
cd ../expo-app
npm install

# Create .env file
echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > .env

# Start Expo
npm run start
```

3. **Run the App**

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app for physical device

---

## 📁 Project Structure

```
whatsapp-clone/
├── expo-app/                    # React Native frontend
│   ├── app/                     # File-based routing
│   │   ├── (chat)/             # Chat screens
│   │   │   ├── (tabs)/         # Tab navigation (users, settings)
│   │   │   └── chat/[id].tsx   # Dynamic chat screen
│   │   └── (registration)/     # Auth screens
│   │       ├── index.tsx       # Login
│   │       └── register.tsx    # Registration
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # UI primitives
│   │   ├── imagePicker.tsx     # Image upload component
│   │   └── userElement.tsx     # User list item
│   ├── hooks/                  # Custom hooks
│   │   ├── userStore.ts        # Zustand state management
│   │   └── utils.ts            # Helper functions
│   ├── constants/              # App constants
│   └── assets/                 # Images, fonts
│
└── server/                      # Node.js backend
    ├── controllers/            # Business logic
    │   ├── user.js            # User operations
    │   └── message.js         # Message operations
    ├── models/                # MongoDB schemas
    │   ├── user.js           # User model
    │   └── message.js        # Message model
    ├── routes/               # API endpoints
    │   ├── user.js          # /user routes
    │   └── message.js       # /message routes
    ├── middlewares/         # Custom middleware
    │   ├── isAuth.js       # JWT authentication
    │   └── multer.js       # File upload config
    ├── utils/              # Helper functions
    ├── config.js          # Database connection
    └── index.js          # Server entry point
```

---

## 🏗️ Architecture

### **System Overview**

```
┌─────────────────────────────────────────┐
│         Mobile Clients                  │
│  (iOS, Android, Web - React Native)     │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
   ┌────▼─────┐    ┌────▼─────┐
   │   REST   │    │ WebSocket│
   │   API    │    │(Socket.IO)│
   └────┬─────┘    └────┬─────┘
        │                │
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │  Express.js    │
        │    Server      │
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │    MongoDB     │
        │   Database     │
        └────────────────┘
```

### **Real-Time Message Flow**

1. **User A** types message → emits `sendMessage` event
2. **Server** receives event → saves to MongoDB
3. **Server** emits `receiveMessage` to both User A and User B
4. **User B** opens chat → emits `readMessage` event
5. **Server** updates message status → emits read receipt to User A

---

## 🔐 Security Features

| Feature                | Implementation                     |
| ---------------------- | ---------------------------------- |
| **Password Security**  | bcrypt hashing with 10 salt rounds |
| **API Authentication** | JWT tokens with 7-day expiration   |
| **Socket Security**    | Custom authentication middleware   |
| **Input Validation**   | Zod schema validation              |
| **CORS Protection**    | Configured origin policies         |
| **Error Handling**     | Centralized error middleware       |

---

## 📊 Database Schema

### **User Collection**

```javascript
{
  username: String (required, max 50 chars),
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  profilePicture: String (URL),
  status: String (max 100 chars),
  timestamps: { createdAt, updatedAt }
}
```

### **Message Collection**

```javascript
{
  content: String (required),
  seen: Boolean (default: false),
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  timestamps: { createdAt, updatedAt }
}
```

---

## 🎨 Screenshots

> **Note:** Add screenshots of your app here

<div align="center">

|           Login Screen            |             Chat List             |           Chat Screen           |
| :-------------------------------: | :-------------------------------: | :-----------------------------: |
| ![Login](./screenshots/login.png) | ![Users](./screenshots/users.png) | ![Chat](./screenshots/chat.png) |

</div>

---

## 🚧 Roadmap

### **Phase 1: Enhanced Messaging** (In Progress)

- [ ] Image and video sharing
- [ ] Voice messages
- [ ] Message reactions
- [ ] Message forwarding
- [ ] Message deletion

### **Phase 2: Group Features**

- [ ] Group chat creation
- [ ] Group admin controls
- [ ] Group media sharing

### **Phase 3: Advanced Features**

- [ ] End-to-end encryption
- [ ] Voice/video calling
- [ ] Status/stories feature
- [ ] Push notifications

### **Phase 4: Production**

- [ ] Comprehensive testing
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Cloud deployment

---

## 📝 API Documentation

### **Authentication Endpoints**

```http
POST /user/register
Content-Type: application/json

{
  "username": "zakaria",
  "email": "zakaria@example.com",
  "password": "securePassword123"
}
```

```http
POST /user/login
Content-Type: application/json

{
  "email": "zakaria@example.com",
  "password": "securePassword123"
}
```

### **Message Endpoints**

```http
GET /message/all
Authorization: Bearer <token>
```

### **Socket.IO Events**

**Client → Server:**

- `sendMessage` - Send new message
- `typing` - User started typing
- `stopTyping` - User stopped typing
- `readMessage` - Mark messages as read

**Server → Client:**

- `receiveMessage` - New message received
- `userConnected` - User came online
- `userDisconnected` - User went offline
- `onlineUsers` - List of online users

---

## 👨‍💻 Author

**Zakaria Zineddine**

- GitHub: [@zakari90](https://github.com/zakari90)
- Email:zakariazinedine1@gmail.com

---

## 🙏 Acknowledgments

- Inspired by WhatsApp
- Built with modern web technologies
- Thanks to the open-source community

---
