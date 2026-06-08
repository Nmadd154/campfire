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
    name: "Waldo Lake Wilderness",
    latitude: 43.7406,
    longitude: -122.0428,
    description: "Crystal clear alpine lake with pristine wilderness camping",
    isPrivate: false,
    addedBy: 1,
    amenities: ["Fire pit", "Picnic tables", "Boat launch", "Hiking trails"],
    photos: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400",
    ],
  },
  {
    id: 2,
    name: "McKenzie River Retreat",
    latitude: 44.1576,
    longitude: -122.2153,
    description: "Riverside camping with stunning waterfalls nearby",
    isPrivate: false,
    addedBy: 1,
    amenities: ["River access", "Fire pit", "Fishing", "Scenic views"],
    photos: [
      "https://images.unsplash.com/photo-1537565732439-5c85c6f9ab60?w=400",
    ],
  },
  {
    id: 3,
    name: "Secret Spencer Butte Spot",
    latitude: 43.9875,
    longitude: -123.0892,
    description: "Hidden gem near Eugene with amazing sunset views",
    isPrivate: true,
    addedBy: 1,
    amenities: ["Fire pit", "Hiking trails", "Wildlife viewing"],
    photos: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400",
    ],
  },
  {
    id: 4,
    name: "Cottage Grove Reservoir",
    latitude: 43.6893,
    longitude: -122.9847,
    description: "Perfect for water activities and family camping",
    isPrivate: false,
    addedBy: 1,
    amenities: [
      "Lake access",
      "Boat launch",
      "Fire pit",
      "Showers",
      "RV hookups",
    ],
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
      "Amazing sunrise this morning! The view of Waldo Lake was incredible 🌄",
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
    content: "Great hiking trails here. Did the Jim Weaver Loop trail today!",
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

// Pending suggestions for public campsites
export const suggestions = [
  {
    id: 1,
    campsiteId: 1,
    campsiteOwnerId: 1,
    userId: 2,
    userName: "Sarah Miller",
    type: "activity",
    content: "Rock climbing at nearby cliffs",
    status: "pending",
    submittedAt: "2026-06-05",
  },
  {
    id: 2,
    campsiteId: 2,
    campsiteOwnerId: 1,
    userId: 3,
    userName: "Mike Davis",
    type: "activity",
    content: "Kayaking tours on McKenzie River",
    status: "pending",
    submittedAt: "2026-06-06",
  },
  {
    id: 3,
    campsiteId: 4,
    campsiteOwnerId: 1,
    userId: 4,
    userName: "Emma Wilson",
    type: "amenity",
    content: "Add: Playground area",
    status: "pending",
    submittedAt: "2026-06-07",
  },
];
