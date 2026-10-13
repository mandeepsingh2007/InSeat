export type Stadium = {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  sports: string[];
  stands: string[];
};

const ovalStands = ["North Stand", "South Stand", "East Pavilion", "West Pavilion", "Club House"];
const footballStands = ["North Gallery", "South Gallery", "East Block", "West Block", "VIP Block"];
const arenaStands = ["Lower Tier A", "Lower Tier B", "Upper Tier", "Courtside", "Family Zone"];

export const stadiums: Stadium[] = [
  { id: "narendra-modi", name: "Narendra Modi Stadium", city: "Ahmedabad", state: "Gujarat", capacity: 132000, sports: ["cricket"], stands: ["Adani Pavilion", "Reliance End", "North Stand", "South Stand", "Corporate Box"] },
  { id: "eden-gardens", name: "Eden Gardens", city: "Kolkata", state: "West Bengal", capacity: 68000, sports: ["cricket"], stands: ["Club House", "B Block", "D Block", "K Block", "L Block"] },
  { id: "wankhede", name: "Wankhede Stadium", city: "Mumbai", state: "Maharashtra", capacity: 33100, sports: ["cricket"], stands: ["Sunil Gavaskar Stand", "Sachin Tendulkar Stand", "Vijay Merchant Stand", "Garware Pavilion", "North Stand"] },
  { id: "chinnaswamy", name: "M. Chinnaswamy Stadium", city: "Bengaluru", state: "Karnataka", capacity: 40000, sports: ["cricket"], stands: ["P Terrace", "M Stand", "Diamond Box", "N Stand", "Pavilion Terrace"] },
  { id: "chepauk", name: "M. A. Chidambaram Stadium", city: "Chennai", state: "Tamil Nadu", capacity: 38000, sports: ["cricket"], stands: ["Anna Pavilion", "I Stand", "J Stand", "C Stand", "KMK Terrace"] },
  { id: "arun-jaitley", name: "Arun Jaitley Stadium", city: "New Delhi", state: "Delhi", capacity: 41820, sports: ["cricket"], stands: ["Bishan Bedi Stand", "Mohinder Amarnath Stand", "Virender Sehwag Gate", "Old Club House", "East Stand"] },
  { id: "rajiv-gandhi-hyd", name: "Rajiv Gandhi International Stadium", city: "Hyderabad", state: "Telangana", capacity: 55000, sports: ["cricket"], stands: ["North Pavilion", "South Pavilion", "East Stand", "West Stand", "Corporate Box"] },
  { id: "sawai-mansingh", name: "Sawai Mansingh Stadium", city: "Jaipur", state: "Rajasthan", capacity: 30000, sports: ["cricket"], stands: ovalStands },
  { id: "ekana", name: "BRSABV Ekana Stadium", city: "Lucknow", state: "Uttar Pradesh", capacity: 50000, sports: ["cricket"], stands: ovalStands },
  { id: "pca-mohali", name: "PCA IS Bindra Stadium", city: "Mohali", state: "Punjab", capacity: 26950, sports: ["cricket"], stands: ovalStands },
  { id: "dy-patil", name: "DY Patil Stadium", city: "Navi Mumbai", state: "Maharashtra", capacity: 55000, sports: ["cricket", "football"], stands: footballStands },
  { id: "salt-lake", name: "Salt Lake Stadium", city: "Kolkata", state: "West Bengal", capacity: 85000, sports: ["football", "athletics"], stands: footballStands },
  { id: "jln-kochi", name: "Jawaharlal Nehru Stadium", city: "Kochi", state: "Kerala", capacity: 41000, sports: ["football", "cricket"], stands: footballStands },
  { id: "jln-delhi", name: "Jawaharlal Nehru Stadium", city: "New Delhi", state: "Delhi", capacity: 60000, sports: ["football", "athletics"], stands: footballStands },
  { id: "fatorda", name: "Fatorda Stadium", city: "Margao", state: "Goa", capacity: 19000, sports: ["football"], stands: footballStands },
  { id: "kanteerava", name: "Sree Kanteerava Stadium", city: "Bengaluru", state: "Karnataka", capacity: 25810, sports: ["football", "athletics"], stands: footballStands },
  { id: "kalinga", name: "Kalinga Stadium", city: "Bhubaneswar", state: "Odisha", capacity: 15000, sports: ["hockey", "football", "athletics"], stands: footballStands },
  { id: "birsa-munda", name: "Birsa Munda Hockey Stadium", city: "Rourkela", state: "Odisha", capacity: 21800, sports: ["hockey"], stands: ["North Gallery", "South Gallery", "East Block", "West Block", "Players Side"] },
  { id: "dhyan-chand", name: "Major Dhyan Chand National Stadium", city: "New Delhi", state: "Delhi", capacity: 16200, sports: ["hockey"], stands: footballStands },
  { id: "jalandhar-hockey", name: "Surjit Hockey Stadium", city: "Jalandhar", state: "Punjab", capacity: 7000, sports: ["hockey"], stands: arenaStands },
  { id: "gachibowli", name: "Gachibowli Indoor Stadium", city: "Hyderabad", state: "Telangana", capacity: 5000, sports: ["kabaddi", "badminton", "basketball"], stands: arenaStands },
  { id: "nsci-dome", name: "NSCI Dome", city: "Mumbai", state: "Maharashtra", capacity: 5000, sports: ["kabaddi", "basketball"], stands: arenaStands },
  { id: "thyagaraj", name: "Thyagaraj Sports Complex", city: "New Delhi", state: "Delhi", capacity: 4494, sports: ["kabaddi", "badminton"], stands: arenaStands },
  { id: "balewadi", name: "Shree Shiv Chhatrapati Sports Complex", city: "Pune", state: "Maharashtra", capacity: 12000, sports: ["kabaddi", "athletics", "badminton"], stands: arenaStands },
  { id: "patliputra", name: "Patliputra Sports Complex", city: "Patna", state: "Bihar", capacity: 5000, sports: ["kabaddi"], stands: arenaStands },
  { id: "kd-jadhav", name: "KD Jadhav Indoor Hall", city: "New Delhi", state: "Delhi", capacity: 5000, sports: ["badminton"], stands: arenaStands },
  { id: "babu-banarasi", name: "Babu Banarasi Das Indoor Stadium", city: "Lucknow", state: "Uttar Pradesh", capacity: 4000, sports: ["badminton", "basketball"], stands: arenaStands },
  { id: "sdat-chennai", name: "SDAT Tennis Stadium", city: "Chennai", state: "Tamil Nadu", capacity: 5800, sports: ["tennis"], stands: ["Centre Court East", "Centre Court West", "Court 1 Gallery", "Box Seats", "Family Zone"] },
  { id: "ksl-tennis", name: "KSLTA Stadium", city: "Bengaluru", state: "Karnataka", capacity: 7000, sports: ["tennis"], stands: ["Centre Court East", "Centre Court West", "Court 1 Gallery", "Box Seats", "Family Zone"] },
  { id: "dlta", name: "DLTA Complex", city: "New Delhi", state: "Delhi", capacity: 5000, sports: ["tennis"], stands: ["Centre Court East", "Centre Court West", "Court 1 Gallery", "Box Seats", "Family Zone"] },
  { id: "balewadi-tennis", name: "Mhalunge Balewadi Tennis Stadium", city: "Pune", state: "Maharashtra", capacity: 4000, sports: ["tennis"], stands: ["Centre Court East", "Centre Court West", "Court 1 Gallery", "Box Seats", "Family Zone"] },
  { id: "indira-gandhi-arena", name: "Indira Gandhi Arena", city: "New Delhi", state: "Delhi", capacity: 14348, sports: ["basketball", "badminton"], stands: arenaStands },
  { id: "kanteerava-indoor", name: "Kanteerava Indoor Stadium", city: "Bengaluru", state: "Karnataka", capacity: 4000, sports: ["basketball", "kabaddi"], stands: arenaStands },
];

export const stadiumsForSport = (sportId: string) =>
  stadiums.filter((s) => s.sports.includes(sportId)).sort((a, b) => b.capacity - a.capacity);

export const getStadium = (id: string | undefined) => stadiums.find((s) => s.id === id);
