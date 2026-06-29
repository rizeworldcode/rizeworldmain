export interface StateData {
  slug: string;
  name: string;
  cities: string[];
}

const STATES: StateData[] = [
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    cities: ["delhi", "noida", "gurgaon", "faridabad", "ghaziabad"]
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    cities: ["jaipur", "udaipur", "kota", "jodhpur", "alwar"]
  },
  {
    slug: "maharashtra",
    name: "Maharashtra",
    cities: ["mumbai", "pune", "nagpur", "thane", "navi-mumbai"]
  },
  {
    slug: "karnataka",
    name: "Karnataka",
    cities: ["bangalore", "mysore"]
  },
  {
    slug: "gujarat",
    name: "Gujarat",
    cities: ["ahmedabad", "surat", "vadodara", "rajkot"]
  },
  {
    slug: "uttar-pradesh",
    name: "Uttar Pradesh",
    cities: ["lucknow", "kanpur", "prayagraj"]
  },
  {
    slug: "punjab",
    name: "Punjab",
    cities: ["mohali", "ludhiana", "chandigarh"]
  },
  {
    slug: "haryana",
    name: "Haryana",
    cities: ["gurgaon", "faridabad"]
  },
  {
    slug: "madhya-pradesh",
    name: "Madhya Pradesh",
    cities: ["indore", "bhopal"]
  },
  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    cities: ["chennai", "coimbatore"]
  },
  {
    slug: "kerala",
    name: "Kerala",
    cities: ["kochi", "trivandrum"]
  },
  {
    slug: "west-bengal",
    name: "West Bengal",
    cities: ["kolkata"]
  },
  {
    slug: "telangana",
    name: "Telangana",
    cities: ["hyderabad"]
  },
  {
    slug: "andhra-pradesh",
    name: "Andhra Pradesh",
    cities: ["visakhapatnam", "vijayawada"]
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    cities: ["dehradun"]
  },
  {
    slug: "assam",
    name: "Assam",
    cities: ["guwahati"]
  }
];

export default STATES;
