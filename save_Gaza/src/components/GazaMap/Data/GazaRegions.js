export const gazaRegions = [
  {
    name: "North Gaza",
    coordinates: [
      [31.592800915584313, 34.49108464943855], // [Latitude, Longitude]
      [31.544689686220615, 34.455254862499515],
      [31.499242097182794, 34.51344243648849],
      [31.539315317984286, 34.56618388286274],
      [31.592800915584313, 34.49108464943855], // Closing the polygon
    ],
    centerCoordinates: {
      lat: 31.5426,
      lng: 34.5035,
    },

    color: "#ff9999",
    population: "360,000",
    area: "61",
    majorCity: "Jabalia",
    keyFacts:
      "Home to the largest refugee camp in Gaza. Agricultural area known for citrus fruits.",
    additionalInfo: {
      mainIndustries: ["Agriculture", "Textiles"],
      landmarks: ["Jabalia Refugee Camp", "Beit Lahia"],
      challenges: ["High population density", "Limited access to resources"],
    },
  },
  {
    name: "Gaza City",
    coordinates: [
      [31.54264249587724, 34.45270669763798],
      [31.482474829461296, 34.39470622798787],
      [31.445041955193304, 34.446290716482],
      [31.499106857774507, 34.51199036351928],
      [31.54264249587724, 34.45270669763798], // Closing the polygon
    ],
    centerCoordinates: {
      lat: 31.5118,
      lng: 34.4564,
    },

    color: "#99ccff",
    population: "600,000",
    area: "45",
    majorCity: "Gaza City",
    keyFacts:
      "Largest city and main port. Houses many historical sites including the Great Mosque of Gaza.",
    additionalInfo: {
      mainIndustries: ["Services", "Commerce", "Fishing"],
      landmarks: [
        "Great Mosque of Gaza",
        "Al-Shifa Hospital",
        "Islamic University of Gaza",
      ],
      challenges: ["Infrastructure damage", "Economic blockade"],
    },
  },
  {
    name: "Central Gaza",
    coordinates: [
      [31.480181514657847, 34.39357628429575], // [Latitude, Longitude]
      [31.394826293527444, 34.30245442018148],
      [31.36503293717313, 34.36139281739581],
      [31.388868378225094, 34.37845393237891],
      [31.444460881340817, 34.443596371405285],
      [31.480181514657847, 34.39357628429575], // Closing the polygon
    ],
    centerCoordinates: {
      lat: 31.4179,
      lng: 34.3508,
    },

    color: "#99ff99",
    population: "270,000",
    area: "58",
    majorCity: "Deir al-Balah",
    keyFacts:
      "Known for its date palms and fishing industry. Contains several refugee camps.",
    additionalInfo: {
      mainIndustries: ["Agriculture", "Fishing"],
      landmarks: ["Deir al-Balah Refugee Camp", "Al-Aqsa University"],
      challenges: ["Water scarcity", "Agricultural land degradation"],
    },
  },
  {
    name: "Khan Yunis",
    coordinates: [
      [31.39184738313193, 34.29974015188876], // [Latitude, Longitude]
      [31.33556132838409, 34.235373218088895],
      [31.247091124241944, 34.30439318324779],
      [31.277253216512765, 34.34006642366699],
      [31.303098764127775, 34.37108663272716],
      [31.36205308189288, 34.35906630171635],
      [31.39184738313193, 34.29974015188876], // Closing the polygon
    ],
    centerCoordinates: {
      lat: 31.3448,
      lng: 34.3031,
    },

    color: "#ffcc99",
    population: "350,000",
    area: "108",
    majorCity: "Khan Yunis",
    keyFacts:
      "Second-largest city in Gaza. Important agricultural center, especially for olive production.",
    additionalInfo: {
      mainIndustries: ["Agriculture", "Construction"],
      landmarks: ["Khan Yunis Refugee Camp", "Khan Yunis Castle"],
      challenges: ["Unemployment", "Limited educational facilities"],
    },
  },
  {
    name: "Rafah",
    coordinates: [
      [31.33243439866182, 34.23405005984202],
      [31.32256933455984, 34.21967826205261],
      [31.293406547494254, 34.242519154967916],
      [31.221228254847848, 34.26766980109938],
      [31.244928125505602, 34.30282937783418],
      [31.33243439866182, 34.23405005984202], // Closing the polygon
    ],
    centerCoordinates: {
      lat: 31.2758,
      lng: 34.2567,
    },

    color: "#cc99ff",
    population: "220,000",
    area: "64",
    majorCity: "Rafah",
    keyFacts:
      "Located on the border with Egypt. Contains the Rafah Border Crossing, Gaza's only connection to Egypt.",
    additionalInfo: {
      mainIndustries: ["Border trade", "Agriculture"],
      landmarks: ["Rafah Border Crossing", "Rafah Refugee Camp"],
      challenges: ["Border restrictions", "Tunnel economy"],
    },
  },
];
