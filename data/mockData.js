// Mock data for Campfire app

export const currentUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "Adventure seeker 🏕️ | Nature lover 🌲",
};

export const users = [
  currentUser,
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

export const campsites = [
  {
    id: 1,
    name: "Yosemite Valley",
    latitude: 37.7456,
    longitude: -119.5936,
    description: "Stunning views of Half Dome and El Capitan",
    isPrivate: false,
    addedBy: 1,
    amenities: ["Fire pit", "Picnic tables", "Restrooms", "Hiking trails"],
    photos: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400",
    ],
  },
  {
    id: 2,
    name: "Big Sur Retreat",
    latitude: 36.2704,
    longitude: -121.8081,
    description: "Coastal camping with ocean views",
    isPrivate: false,
    addedBy: 1,
    amenities: ["Beach access", "Fire pit", "Scenic views"],
    photos: [
      "https://images.unsplash.com/photo-1537565732439-5c85c6f9ab60?w=400",
    ],
  },
  {
    id: 3,
    name: "Secret Mountain Spot",
    latitude: 37.8651,
    longitude: -119.5383,
    description: "Hidden gem with amazing stargazing",
    isPrivate: true,
    addedBy: 1,
    amenities: ["Fire pit", "Lake access", "Wildlife viewing"],
    photos: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400",
    ],
  },
  {
    id: 4,
    name: "Lake Tahoe Base",
    latitude: 39.0968,
    longitude: -120.0324,
    description: "Perfect for water activities and hiking",
    isPrivate: false,
    addedBy: 2,
    amenities: ["Lake access", "Boat launch", "Fire pit", "Showers"],
    photos: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
    ],
  },
];

export const posts = [
  {
    id: 1,
    campsiteId: 1,
    userId: 2,
    userName: "Sarah Miller",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    content:
      "Amazing sunrise this morning! The view of Half Dome was incredible 🌄",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
    likes: 15,
    likedBy: [1, 3, 4],
    comments: [
      {
        id: 1,
        userId: 1,
        userName: "Alex Johnson",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        content: "Wow! Can't wait to visit!",
        timestamp: "2 hours ago",
      },
    ],
    timestamp: "5 hours ago",
  },
  {
    id: 2,
    campsiteId: 1,
    userId: 3,
    userName: "Mike Davis",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    content: "Great hiking trails here. Did the Mirror Lake loop today!",
    likes: 8,
    likedBy: [1, 2],
    comments: [],
    timestamp: "1 day ago",
  },
  {
    id: 3,
    campsiteId: 2,
    userId: 1,
    userName: "Alex Johnson",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    content:
      "Beach camping at its finest! The sound of waves is so relaxing 🌊",
    image: "https://images.unsplash.com/photo-1537565732439-5c85c6f9ab60?w=400",
    likes: 23,
    likedBy: [2, 3, 4],
    comments: [
      {
        id: 2,
        userId: 4,
        userName: "Emma Wilson",
        userAvatar: "https://i.pravatar.cc/150?img=4",
        content: "Adding this to my bucket list!",
        timestamp: "3 hours ago",
      },
    ],
    timestamp: "2 days ago",
  },
];

export const trips = [
  {
    id: 1,
    name: "Summer Adventure 2026",
    campsiteId: 1,
    campsiteName: "Yosemite Valley",
    startDate: "2026-07-15",
    endDate: "2026-07-18",
    status: "planned",
    organizer: 1,
    attendees: [1, 2, 3],
    groupChecklist: [
      { id: 1, item: "Tent (large)", completed: true, assignedTo: 2 },
      { id: 2, item: "Camping stove", completed: false, assignedTo: 3 },
      { id: 3, item: "Cooler", completed: true, assignedTo: 1 },
      { id: 4, item: "First aid kit", completed: false, assignedTo: 2 },
    ],
    personalChecklist: [
      { id: 1, item: "Sleeping bag", completed: true },
      { id: 2, item: "Hiking boots", completed: true },
      { id: 3, item: "Water bottle", completed: false },
      { id: 4, item: "Headlamp", completed: false },
    ],
    privatePosts: [
      {
        id: 1,
        userId: 1,
        userName: "Alex Johnson",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        content:
          "Super excited for this trip! Who's bringing the s'mores supplies? 🔥",
        timestamp: "Yesterday",
        comments: [
          {
            id: 1,
            userId: 2,
            userName: "Sarah Miller",
            userAvatar: "https://i.pravatar.cc/150?img=2",
            content:
              "I'll grab them! Also bringing marshmallow roasting sticks",
            timestamp: "20 hours ago",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Memorial Day Weekend",
    campsiteId: 4,
    campsiteName: "Lake Tahoe Base",
    startDate: "2026-05-23",
    endDate: "2026-05-25",
    status: "past",
    organizer: 1,
    attendees: [1, 2, 4],
    groupChecklist: [],
    personalChecklist: [],
    privatePosts: [],
  },
  {
    id: 3,
    name: "Fall Colors Tour",
    campsiteId: 3,
    campsiteName: "Secret Mountain Spot",
    startDate: "2026-10-10",
    endDate: "2026-10-12",
    status: "planned",
    organizer: 1,
    attendees: [1, 3, 4],
    groupChecklist: [
      { id: 1, item: "Tent", completed: false, assignedTo: 3 },
      { id: 2, item: "Firewood", completed: false, assignedTo: 1 },
    ],
    personalChecklist: [
      { id: 1, item: "Warm jacket", completed: false },
      { id: 2, item: "Camera", completed: true },
    ],
    privatePosts: [],
  },
];

export const thingsToDo = {
  1: [
    "Hike to Half Dome",
    "Visit Yosemite Falls",
    "Explore Glacier Point",
    "Wildlife watching",
    "Photography at Tunnel View",
  ],
  2: [
    "Beach bonfire",
    "Coastal hiking",
    "Tide pool exploration",
    "Sunset viewing",
    "Wildlife spotting",
  ],
  3: [
    "Stargazing",
    "Mountain biking",
    "Lake fishing",
    "Nature photography",
    "Bird watching",
  ],
  4: [
    "Kayaking",
    "Swimming",
    "Fishing",
    "Hiking Emerald Bay Trail",
    "Beach volleyball",
  ],
};
