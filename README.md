# 🔥 Campfire

A React Native mobile app for planning and sharing camping trips with friends. Built with Expo, React Native, and NativeWind (Tailwind CSS).

## For Assignment

### Walkthrough: https://youtu.be/Oh0RmPmz-vw

### Demo: https://youtu.be/u25Hat4CeOI

## Features

### 🗺️ Map Screen

- View all nearby campsites on an interactive map
- Search for specific campsites
- Add new campsites (public or private)
- See campsite details at a glance
- Filter between public and private campsites

### 🏕️ Campsite Details

- View campsite photos and amenities
- Read and create posts about the campsite
- Like and comment on posts
- See things to do at the location
- Browse photo galleries

### 👤 Profile Screen

- View your camping statistics
- Browse past trips
- See upcoming planned trips
- View all your posts
- Manage photo albums
- Track your camping history

### 🎒 Trip Planning

- Create and organize camping trips
- Invite friends to trips
- Manage group checklists (shared items)
- Track personal checklists (what to bring)
- Share private posts with trip members
- See trip details and attendee list
- Mark checklist items as complete
- Track trip progress

### 💬 Social Features

- Post photos and updates at campsites
- Like and comment on posts
- Private trip discussions
- Share camping experiences
- Build a community of outdoor enthusiasts

## Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: JavaScript/JSX
- **Platform**: iOS, Android, and Web

## Project Structure

```
campfire/
├── app/                      # Main app screens
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.jsx        # Map screen
│   │   ├── explore.jsx      # Profile screen
│   │   └── _layout.jsx      # Tab layout
│   ├── campsite/[id].jsx    # Campsite detail screen
│   ├── trip/[id].jsx        # Trip detail screen
│   ├── login.jsx            # Login screen
│   └── _layout.jsx          # Root layout
├── components/              # Reusable components
├── data/                    # Mock data
│   └── mockData.js          # Sample data for prototype
├── constants/               # App constants
├── hooks/                   # Custom React hooks
└── assets/                  # Images and static files
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- **Appwrite account** (for backend services)

### Backend Setup (Appwrite)

This app uses Appwrite for authentication, database, and storage. You'll need to set up your own Appwrite instance:

1. **Create an Appwrite account** at [cloud.appwrite.io](https://cloud.appwrite.io)

2. **Create a new project** in the Appwrite console

3. **Set up the database**:
   - Create a new database
   - Create the following collections with appropriate permissions:
     - `users` - User profiles
     - `campsites` - Campsite information
     - `posts` - User posts and updates
     - `comments` - Post comments
     - `trips` - Trip planning
     - `activities` - Activity tracking
     - `checklists` - Trip checklists

4. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Appwrite credentials:

   ```env
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
   ```

> **Note**: Without setting up Appwrite, you'll see authentication errors when running the app.

### Installation

1. Clone the repository:

```bash
cd campfire
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

## Screen Flows

### 1. Login Flow

`Login Screen` → `Map Screen (Tabs)`

### 2. Discover Campsites

`Map Screen` → `Campsite Detail Screen` → View posts, photos, activities

### 3. Plan a Trip

`Profile Screen` → `Trip Detail Screen` → Manage checklists, invite friends, share updates

### 4. Add a Campsite

`Map Screen` → `Add Campsite Modal` → Set public/private → Save

### 5. Share Experience

`Campsite Detail Screen` → `Create Post` → Share with community

## Mock Data

The app uses mock data located in `/data/mockData.js` including:

- Sample users
- Campsites (Yosemite, Big Sur, Lake Tahoe, etc.)
- Posts with likes and comments
- Planned and past trips
- Checklists
- Things to do at each campsite

## Key Features in Detail

### Public vs Private Campsites

- **Public**: Visible to all users, can be discovered by anyone
- **Private**: Only visible to you and invited friends

### Checklist System

- **Personal Checklist**: Track your own items (sleeping bag, boots, etc.)
- **Group Checklist**: Shared items assigned to specific trip members (tent, cooler, etc.)

### Post Interactions

- **Public Posts**: On campsite detail pages, visible to all users
- **Private Posts**: On trip pages, only visible to trip members
- Both support likes and comments

### Trip Status

- **Planned**: Upcoming trips with active planning
- **Past**: Completed trips for reference

## Customization

### Adding New Features

1. Add new screens in the `app/` directory
2. Update navigation in `app/_layout.jsx`
3. Create mock data in `data/mockData.js`
4. Style with Tailwind classes using NativeWind

### Styling

The app uses NativeWind for styling. Use Tailwind utility classes:

```jsx
<View className="flex-1 bg-gray-50 p-4">
  <Text className="text-2xl font-bold text-orange-500">Hello</Text>
</View>
```

## Contributing

This is a prototype/demonstration project. Feel free to fork and build upon it!

## License

MIT License - Feel free to use this project as a starting point for your own camping app.
