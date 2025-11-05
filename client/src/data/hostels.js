const hostelData = {
  "muhika-hostel": {
    name: "Muhika Hostel",
    location: "Kikoni",
    images: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://hostels.campusbee.ug/wp-content/uploads/2022/01/IMG_20220127_112025-85b876ea-750x536.jpg",
      "https://dsuj2mkiosyd2.cloudfront.net/a360-rendering/160628/8597/c4dfe2c1/raasrendering-e13c9919-f597-4c76-a131-536b74947ebe.jpg?t=1486699286"
    ],
    contact: "0780562202",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double (Shared) Room", price: 650000, description: "Affordable shared living space.", icon: "fa-user-group" },
      { name: "Single Room (Not Self-Contained)", price: 1000000, description: "Your own private room.", icon: "fa-user" },
      { name: "Single Room (Self-Contained)", price: 1200000, description: "Private room with en-suite bathroom.", icon: "fa-bath" },
      { name: "Single Room (Sliding Door)", price: 1300000, description: "Premium room with a sliding door.", icon: "fa-door-open" },
      { name: "Single Room Extension", price: 1000000, description: "An extended private room.", icon: "fa-user" }
    ]
  },
  "castle-ville-hostel": {
    name: "Castle Ville Hostel",
    location: "Kikoni",
    images: [
      "https://hostels.campusbee.ug/wp-content/uploads/2022/01/IMG_20220127_112025-85b876ea-750x536.jpg",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://dsuj2mkiosyd2.cloudfront.net/a360-rendering/160628/8597/c4dfe2c1/raasrendering-e13c9919-f597-4c76-a131-536b74947ebe.jpg?t=1486699286"
    ],
    contact: "0782206832",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Weekly cleaning service", icon: "fa-broom" },
      { name: "Parking Space", icon: "fa-car" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double (Self-Contained)", price: 800000, description: "Shared room with en-suite bathroom.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1300000, description: "Your own private room and bathroom.", icon: "fa-bath" },
      { name: "Single (Not Self-Contained)", price: 700000, description: "An affordable private room.", icon: "fa-user" }
    ]
  },
  "nakiyingi-hostel": {
    name: "Nakiyingi Hostel",
    location: "Kikoni",
    images: [
      "https://dsuj2mkiosyd2.cloudfront.net/a360-rendering/160628/8597/c4dfe2c1/raasrendering-e13c9919-f597-4c76-a131-536b74947ebe.jpg?t=1486699286",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://hostels.campusbee.ug/wp-content/uploads/2022/01/IMG_20220127_112025-85b876ea-750x536.jpg"
    ],
    contact: "0782473376",
    amenities: [
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Fitness Center", icon: "fa-dumbbell" },
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double (Not Self-Contained)", price: 750000, description: "Shared living with a roommate.", icon: "fa-user-group" },
      { name: "Double (Self-Contained)", price: 1000000, description: "Shared room with en-suite bathroom.", icon: "fa-bath" },
      { name: "Single (Self-Contained, Small)", price: 1300000, description: "A cozy private room and bathroom.", icon: "fa-user" },
      { name: "Single (Self-Contained, Big)", price: 1600000, description: "A spacious private room and bathroom.", icon: "fa-person-shelter" }
    ]
  },
  "frama-hostel": {
    name: "Frama Hostel",
    location: "Kikoni",
    images: [
      "https://i1.sndcdn.com/artworks-000118772753-c3oz0p-t500x500.jpg",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://hostels.campusbee.ug/wp-content/uploads/2022/01/IMG_20220127_112025-85b876ea-750x536.jpg"
    ],
    contact: "0757517299",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Kitchenette", icon: "fa-kitchen-set" },
      { name: "Generator Backup", icon: "fa-bolt" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Not Self-Contained)", price: 850000, description: "A private room.", icon: "fa-user" },
      { name: "Single (Self-Contained)", price: 1200000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "edith-hetty": {
    name: "Edith Hetty",
    location: "Kikoni",
    contact: "0779397186",
    amenities: [
      { name: "Private Bathrooms", icon: "fa-bath" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 650000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 1100000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "baskon-hostel": {
    name: "Baskon Hostel",
    location: "Kikoni",
    contact: "0704509313",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Weekly Cleaning", icon: "fa-broom" },
      { name: "Study Area", icon: "fa-book-open" }
    ],
    rooms: [
      { name: "Double Room", price: 500000, description: "Affordable shared living.", icon: "fa-user-group" },
      { name: "Single Room", price: 750000, description: "A private room for yourself.", icon: "fa-user" }
    ]
  },
  "sunways-hostel": {
    name: "Sunways Hostel",
    location: "Kikoni",
    contact: "0785534364",
    amenities: [
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double (Self-Contained)", price: 800000, description: "Shared room with en-suite bathroom.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1200000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "jessam-hostel": {
    name: "Jessam Hostel",
    location: "Kikoni",
    contact: "0783193518",
    amenities: [
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double (Self-Contained)", price: 900000, description: "Shared premium room.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1200000, description: "Private premium room.", icon: "fa-bath" }
    ]
  },
  "helican-hostel": {
    name: "Helican Hostel",
    location: "Kikumi Kikumi",
    contact: "0771834668",
    amenities: [
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "Weekly Cleaning", icon: "fa-broom" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 650000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1300000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "jerusalem-hostel": {
    name: "Jerusalem Hostel",
    location: "Wandegeya",
    contact: "0779397186",
    amenities: [
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 650000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 1000000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "kare-hostel": {
    name: "Kare Hostel",
    location: "Kikoni",
    contact: "0702470909",
    amenities: [
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 750000, description: "An affordable private room.", icon: "fa-user" },
      { name: "Single (Self-Contained, Small)", price: 900000, description: "A cozy private room and bathroom.", icon: "fa-bath" },
      { name: "Single (Self-Contained, Big)", price: 1000000, description: "A spacious private room and bathroom.", icon: "fa-person-shelter" }
    ]
  },
  "sharks-hostel": {
    name: "Sharks Hostel",
    location: "Kikoni",
    contact: "9782327143",
    amenities: [
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Triple Room", price: 450000, description: "Most affordable shared option.", icon: "fa-users" },
      { name: "Double Room", price: 600000, description: "Shared with one roommate.", icon: "fa-user-group" },
      { name: "Single Room", price: 750000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "wavney-courts": {
    name: "Wavney Courts",
    location: "Kikoni",
    contact: "0777041899",
    amenities: [
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "Parking Available", icon: "fa-car" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Not Self-Contained)", price: 800000, description: "An affordable private room.", icon: "fa-user" },
      { name: "Single (Self-Contained)", price: 1000000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "dream-world-hostel": {
    name: "Dream World Hostel",
    location: "Kikoni",
    contact: "0758501330",
    amenities: [
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1200000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "lady-julianna-girls-hostel": {
    name: "Lady Julianna Girls’ Hostel",
    location: "Wandegeya",
    contact: "070172169826",
    amenities: [
      { name: "Private Bathrooms", icon: "fa-bath" },
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Study Rooms", icon: "fa-book-open" }
    ],
    rooms: [
      { name: "Double Room", price: 750000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 1000000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "new-nana-hostel": {
    name: "New Nana Hostel",
    location: "Kikoni",
    contact: "0776088087",
    amenities: [
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Triple Room", price: 750000, description: "Shared with two roommates.", icon: "fa-users" },
      { name: "Double Room", price: 950000, description: "Shared with one roommate.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1800000, description: "Premium private room.", icon: "fa-bath" }
    ]
  },
  "cheds-hostel": {
    name: "Cheds Hostel",
    location: "Kikumi Kikumi",
    contact: "0787990186",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Triple (Without Balcony)", price: 470000, description: "Most affordable option.", icon: "fa-users" },
      { name: "Double (Without Balcony)", price: 530000, description: "Shared with one roommate.", icon: "fa-user-group" },
      { name: "Double (With Balcony)", price: 600000, description: "Shared room with a balcony.", icon: "fa-door-open" }
    ]
  },
  "clibas-hostel": {
    name: "Clibas Hostel",
    location: "Kikoni",
    contact: "0781917245",
    amenities: [
      { name: "Parking Space", icon: "fa-car" },
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double Room", price: 520000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 800000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "panicol-hostel": {
    name: "Panicol Hostel",
    location: "Wandegeya",
    contact: "0701529927",
    amenities: [
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 1000000, description: "Shared premium room.", icon: "fa-user-group" },
      { name: "Single Room", price: 2000000, description: "The ultimate private room.", icon: "fa-crown" }
    ]
  },
  "jj-hostel": {
    name: "JJ Hostel",
    location: "Kikoni",
    contact: "0392964436",
    amenities: [
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "Study Area", icon: "fa-book-open" }
    ],
    rooms: [
      { name: "Double (Self-Contained)", price: 1000000, description: "Shared premium room.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 2000000, description: "The ultimate private room.", icon: "fa-crown" }
    ]
  },
  "messiah-hostel": {
    name: "Messiah Hostel",
    location: "Kikumi Kikumi",
    contact: "0772456412",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 800000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "paramount-hostel": {
    name: "Paramount Hostel",
    location: "Wandegeya",
    contact: "0782972497",
    amenities: [
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double Room", price: 750000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 1200000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "el-s-hadai-hostel": {
    name: "El-S Hadai Hostel",
    location: "Kikumi Kikumi",
    contact: "0754943057",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 550000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 750000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "felamor-girls-hostel": {
    name: "Felamor Girls Hostel",
    location: "Kikumi Kikumi",
    contact: "0702548193",
    amenities: [
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Study Area", icon: "fa-book-open" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Triple Room", price: 450000, description: "Shared with two roommates.", icon: "fa-users" },
      { name: "Double Room", price: 500000, description: "Shared with one roommate.", icon: "fa-user-group" }
    ]
  },
  "braetd-girls-hostel": {
    name: "Braetd Girls Hostel",
    location: "Kikumi Kikumi",
    contact: "0701183722",
    amenities: [
      { name: "Private Bathrooms", icon: "fa-bath" },
      { name: "Weekly Cleaning", icon: "fa-broom" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Free Wi-Fi", icon: "fa-wifi" }
    ],
    rooms: [
      { name: "Double Room", price: 1000000, description: "Shared premium room.", icon: "fa-user-group" },
      { name: "Single Room", price: 1800000, description: "A private, premium room.", icon: "fa-user" }
    ]
  },
  "god-is-able-hostel": {
    name: "God Is Able Hostel",
    location: "Kikumi Kikumi",
    contact: "0772434755",
    amenities: [
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Triple Room", price: 450000, description: "Shared with two roommates.", icon: "fa-users" },
      { name: "Double Room", price: 600000, description: "Shared with one roommate.", icon: "fa-user-group" },
      { name: "Single Room", price: 900000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "bira-girls-hostel": {
    name: "Bira Girls’ Hostel",
    location: "Kikoni",
    contact: "0775434695",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 500000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 900000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "sami-hostel": {
    name: "Sami Hostel",
    location: "LDC",
    contact: "0777530229",
    amenities: [
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "24/7 Security", icon: "fa-shield-halved" }
    ],
    rooms: [
      { name: "Triple Room", price: 470000, description: "Shared with two roommates.", icon: "fa-users" },
      { name: "Double Room", price: 570000, description: "Shared with one roommate.", icon: "fa-user-group" },
      { name: "Single Room", price: 770000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "kann-hostel": {
    name: "Kann Hostel",
    location: "Kikoni",
    contact: "0700800241",
    amenities: [
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Study Area", icon: "fa-book-open" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1050000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "makerere-intl-students-hostel": {
    name: "Makerere Int'l Students Hostel",
    location: "Kikoni",
    contact: "0751366240",
    amenities: [
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 1000000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "aryan-hostel": {
    name: "Aryan Hostel",
    location: "Wandegeya",
    contact: "0788949213",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Parking Available", icon: "fa-car" },
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double Room", price: 550000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 750000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "prince-hostel": {
    name: "Prince Hostel",
    location: "Kikoni",
    contact: "0780562202",
    amenities: [
      { name: "Study Rooms", icon: "fa-book-open" },
      { name: "Weekly Cleaning", icon: "fa-broom" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Not Self-Contained)", price: 850000, description: "An affordable private room.", icon: "fa-user" },
      { name: "Single (Self-Contained)", price: 1000000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "douglas-villa-hostel": {
    name: "Douglas Villa Hostel",
    location: "Kikoni",
    contact: "0780562202",
    amenities: [
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double (Shared) Room", price: 650000, description: "Affordable shared living space.", icon: "fa-user-group" },
      { name: "Single (Not Self-Contained)", price: 1000000, description: "Your own private room.", icon: "fa-user" },
      { name: "Single (Self-Contained)", price: 1200000, description: "Private room with en-suite bathroom.", icon: "fa-bath" },
      { name: "Single Room (Sliding Door)", price: 1300000, description: "Premium room with a sliding door.", icon: "fa-door-open" },
      { name: "Single Room Extension", price: 1000000, description: "An extended private room.", icon: "fa-user" }
    ]
  },
  "olympia-hostel": {
    name: "Olympia Hostel",
    location: "Kikoni",
    contact: "0780842953",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Air Conditioning", icon: "fa-wind" },
      { name: "Study Area", icon: "fa-book-open" }
    ],
    rooms: [
      { name: "Double/Shared Room", price: 1300000, description: "Premium shared room.", icon: "fa-user-group" },
      { name: "Single Room", price: 1900000, description: "Premium private room.", icon: "fa-user" },
      { name: "Double Single (Single User)", price: 2600000, description: "A double room for single occupancy.", icon: "fa-crown" }
    ]
  },
  "garden-courts-girls-hostel": {
    name: "Garden Courts Girls’ Hostel",
    location: "Kikoni",
    contact: "0782000544",
    amenities: [
      { name: "Gym Access", icon: "fa-dumbbell" },
      { name: "Parking Available", icon: "fa-car" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 750000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single Room", price: 1300000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "apex-girls-hostel": {
    name: "Apex Girls’ Hostel",
    location: "Kikoni",
    contact: "0755396745",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Study Area", icon: "fa-book-open" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Air Conditioning", icon: "fa-wind" }
    ],
    rooms: [
      { name: "Double (Shared) Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Not Self-Contained)", price: 900000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "mwesigwa-hostel": {
    name: "Mwesigwa Hostel",
    location: "Kikoni",
    contact: "0782542397",
    amenities: [
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Generator Backup", icon: "fa-bolt" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 1300000, description: "Premium shared room.", icon: "fa-user-group" },
      { name: "Single (Small)", price: 1500000, description: "Cozy premium private room.", icon: "fa-user" },
      { name: "Single (Big)", price: 2000000, description: "Spacious premium private room.", icon: "fa-person-shelter" }
    ]
  },
  "akwata-empola": {
    name: "Akwata Empola",
    location: "Kikoni",
    contact: "0704578111",
    amenities: [
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Study Area", icon: "fa-book-open" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Single (Not Self-Contained)", price: 900000, description: "Your own private room.", icon: "fa-user" }
    ]
  },
  "nalika-hostel": {
    name: "Nalika Hostel",
    location: "Kikoni",
    contact: "07769949737",
    amenities: [
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double Room", price: 600000, description: "Shared living space.", icon: "fa-user-group" }
    ]
  },
  "lyn-modern-hostel": {
    name: "Lyn Modern Hostel",
    location: "Kikoni",
    contact: "07826477078",
    amenities: [
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Common Kitchen", icon: "fa-kitchen-set" },
      { name: "Lounge Area", icon: "fa-tv" },
      { name: "Study Rooms", icon: "fa-book-open" }
    ],
    rooms: [
      { name: "Double (Not Self-Contained)", price: 600000, description: "Shared living space.", icon: "fa-user-group" },
      { name: "Single (Not Self-Contained)", price: 800000, description: "Your own private room.", icon: "fa-user" }
    ]
  }
};

export default hostelData;