// Complete Kenya Counties, Sub-Counties, and Towns with Courier Availability
// Couriers: G4S, Wells Fargo Limited, SGA, Matatu Saccos

export interface Town {
  name: string;
  couriers: string[];
}

export interface SubCounty {
  name: string;
  towns: Town[];
}

export interface County {
  name: string;
  subCounties: SubCounty[];
}

// Major courier hubs and routes
const FULL_COURIER_SERVICE = ["G4S", "Wells Fargo Limited", "SGA", "2NK Sacco", "Super Metro"];
const G4S_ONLY = ["G4S"];
const G4S_WELLS = ["G4S", "Wells Fargo Limited"];
const MATATU_ONLY = ["2NK Sacco", "Super Metro", "Mololine"];
const LIMITED_SERVICE = ["G4S"];

export const COURIER_INFO: Record<string, { name: string; description: string; estimatedDays: number; baseFee: number }> = {
  "G4S": { name: "G4S Kenya", description: "Reliable nationwide courier with tracking", estimatedDays: 2, baseFee: 350 },
  "Wells Fargo Limited": { name: "Wells Fargo Limited", description: "Premium courier for major towns", estimatedDays: 1, baseFee: 450 },
  "SGA": { name: "SGA Security", description: "Secure parcel delivery service", estimatedDays: 2, baseFee: 400 },
  "2NK Sacco": { name: "2NK Sacco", description: "Affordable matatu delivery to Central Kenya", estimatedDays: 1, baseFee: 200 },
  "Super Metro": { name: "Super Metro", description: "Fast matatu service within Nairobi region", estimatedDays: 1, baseFee: 150 },
  "Mololine": { name: "Mololine Sacco", description: "Western Kenya matatu delivery", estimatedDays: 1, baseFee: 250 },
  "Easy Coach": { name: "Easy Coach", description: "Long-distance parcel service", estimatedDays: 1, baseFee: 300 },
  "Modern Coast": { name: "Modern Coast", description: "Coastal region delivery", estimatedDays: 1, baseFee: 350 },
};

export const KENYA_LOCATIONS: County[] = [
  {
    name: "Nairobi",
    subCounties: [
      {
        name: "Westlands",
        towns: [
          { name: "Westlands CBD", couriers: FULL_COURIER_SERVICE },
          { name: "Parklands", couriers: FULL_COURIER_SERVICE },
          { name: "Highridge", couriers: FULL_COURIER_SERVICE },
          { name: "Kangemi", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Mountain View", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Lavington", couriers: FULL_COURIER_SERVICE },
          { name: "Kileleshwa", couriers: FULL_COURIER_SERVICE },
        ]
      },
      {
        name: "Langata",
        towns: [
          { name: "Langata", couriers: FULL_COURIER_SERVICE },
          { name: "Karen", couriers: FULL_COURIER_SERVICE },
          { name: "Nairobi West", couriers: FULL_COURIER_SERVICE },
          { name: "South C", couriers: FULL_COURIER_SERVICE },
          { name: "Otiende", couriers: FULL_COURIER_SERVICE },
          { name: "Mugumo-ini", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kibra",
        towns: [
          { name: "Kibera", couriers: G4S_WELLS },
          { name: "Woodley", couriers: FULL_COURIER_SERVICE },
          { name: "Sarangombe", couriers: G4S_WELLS },
          { name: "Makina", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Dagoretti",
        towns: [
          { name: "Dagoretti Corner", couriers: FULL_COURIER_SERVICE },
          { name: "Waithaka", couriers: G4S_WELLS },
          { name: "Riruta", couriers: FULL_COURIER_SERVICE },
          { name: "Kawangware", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Uthiru", couriers: G4S_WELLS },
          { name: "Mutuini", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Starehe",
        towns: [
          { name: "Nairobi CBD", couriers: FULL_COURIER_SERVICE },
          { name: "Pangani", couriers: FULL_COURIER_SERVICE },
          { name: "Ngara", couriers: FULL_COURIER_SERVICE },
          { name: "Ziwani", couriers: G4S_WELLS },
          { name: "Kariokor", couriers: G4S_WELLS },
          { name: "Huruma", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kamukunji",
        towns: [
          { name: "Eastleigh", couriers: FULL_COURIER_SERVICE },
          { name: "Pumwani", couriers: G4S_WELLS },
          { name: "California", couriers: G4S_WELLS },
          { name: "Airbase", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Embakasi East",
        towns: [
          { name: "Embakasi", couriers: FULL_COURIER_SERVICE },
          { name: "Utawala", couriers: G4S_WELLS },
          { name: "Mihang'o", couriers: G4S_WELLS },
          { name: "Upper Savannah", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Embakasi West",
        towns: [
          { name: "Pipeline", couriers: FULL_COURIER_SERVICE },
          { name: "Kariobangi South", couriers: G4S_WELLS },
          { name: "Umoja", couriers: FULL_COURIER_SERVICE },
        ]
      },
      {
        name: "Embakasi Central",
        towns: [
          { name: "Kayole", couriers: G4S_WELLS },
          { name: "Komarock", couriers: FULL_COURIER_SERVICE },
          { name: "Matopeni", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Embakasi South",
        towns: [
          { name: "South B", couriers: FULL_COURIER_SERVICE },
          { name: "Imara Daima", couriers: FULL_COURIER_SERVICE },
          { name: "Kwa Njenga", couriers: G4S_WELLS },
          { name: "Mukuru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Embakasi North",
        towns: [
          { name: "Ruai", couriers: G4S_WELLS },
          { name: "Njiru", couriers: G4S_WELLS },
          { name: "Tena", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kasarani",
        towns: [
          { name: "Kasarani", couriers: FULL_COURIER_SERVICE },
          { name: "Mwiki", couriers: G4S_WELLS },
          { name: "Githurai", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Zimmerman", couriers: G4S_WELLS },
          { name: "Roysambu", couriers: FULL_COURIER_SERVICE },
          { name: "Kahawa West", couriers: G4S_WELLS },
          { name: "Kahawa Wendani", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Ruaraka",
        towns: [
          { name: "Ruaraka", couriers: FULL_COURIER_SERVICE },
          { name: "Baba Dogo", couriers: G4S_WELLS },
          { name: "Utalii", couriers: FULL_COURIER_SERVICE },
          { name: "Lucky Summer", couriers: G4S_WELLS },
          { name: "Mathare North", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Mathare",
        towns: [
          { name: "Mathare", couriers: G4S_ONLY },
          { name: "Huruma", couriers: G4S_WELLS },
          { name: "Ngei", couriers: G4S_WELLS },
          { name: "Mlango Kubwa", couriers: G4S_WELLS },
          { name: "Kiamaiko", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Makadara",
        towns: [
          { name: "Makadara", couriers: FULL_COURIER_SERVICE },
          { name: "Maringo", couriers: G4S_WELLS },
          { name: "Harambee", couriers: G4S_WELLS },
          { name: "Hamza", couriers: G4S_WELLS },
          { name: "Viwandani", couriers: FULL_COURIER_SERVICE },
        ]
      },
    ]
  },
  {
    name: "Mombasa",
    subCounties: [
      {
        name: "Mvita",
        towns: [
          { name: "Mombasa CBD", couriers: [...FULL_COURIER_SERVICE, "Modern Coast"] },
          { name: "Old Town", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Majengo", couriers: G4S_WELLS },
          { name: "Tudor", couriers: [...G4S_WELLS, "Modern Coast"] },
        ]
      },
      {
        name: "Nyali",
        towns: [
          { name: "Nyali", couriers: [...FULL_COURIER_SERVICE, "Modern Coast"] },
          { name: "Mkomani", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Kongowea", couriers: G4S_WELLS },
          { name: "Kadzandani", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Likoni",
        towns: [
          { name: "Likoni", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Mtongwe", couriers: G4S_WELLS },
          { name: "Shika Adabu", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kisauni",
        towns: [
          { name: "Kisauni", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Bamburi", couriers: [...FULL_COURIER_SERVICE, "Modern Coast"] },
          { name: "Mwakirunge", couriers: G4S_WELLS },
          { name: "Mtopanga", couriers: G4S_WELLS },
          { name: "Magogoni", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Changamwe",
        towns: [
          { name: "Changamwe", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Port Reitz", couriers: G4S_WELLS },
          { name: "Miritini", couriers: G4S_WELLS },
          { name: "Chaani", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Jomvu",
        towns: [
          { name: "Jomvu Kuu", couriers: G4S_WELLS },
          { name: "Mikindani", couriers: G4S_WELLS },
          { name: "Miritini", couriers: G4S_WELLS },
        ]
      },
    ]
  },
  {
    name: "Kiambu",
    subCounties: [
      {
        name: "Thika Town",
        towns: [
          { name: "Thika CBD", couriers: [...FULL_COURIER_SERVICE, "2NK Sacco"] },
          { name: "Makongeni", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Landless", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Gatuanyaga", couriers: [...G4S_ONLY, "2NK Sacco"] },
        ]
      },
      {
        name: "Ruiru",
        towns: [
          { name: "Ruiru Town", couriers: [...FULL_COURIER_SERVICE, "2NK Sacco"] },
          { name: "Membley", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Kimbo", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Juja", couriers: [...FULL_COURIER_SERVICE, "2NK Sacco"] },
          { name: "Witeithie", couriers: [...G4S_ONLY, "2NK Sacco"] },
        ]
      },
      {
        name: "Kiambu Town",
        towns: [
          { name: "Kiambu Town", couriers: [...FULL_COURIER_SERVICE, "2NK Sacco"] },
          { name: "Karuri", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Ndumberi", couriers: [...G4S_ONLY, "2NK Sacco"] },
          { name: "Tinganga", couriers: [...G4S_ONLY, "2NK Sacco"] },
        ]
      },
      {
        name: "Kikuyu",
        towns: [
          { name: "Kikuyu Town", couriers: [...FULL_COURIER_SERVICE, "Super Metro"] },
          { name: "Kinoo", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Zambezi", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Kabete", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Sigona", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Limuru",
        towns: [
          { name: "Limuru Town", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Tigoni", couriers: [...G4S_ONLY, "2NK Sacco"] },
          { name: "Ndeiya", couriers: G4S_ONLY },
          { name: "Rironi", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Gatundu North",
        towns: [
          { name: "Gatundu", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Gituamba", couriers: G4S_ONLY },
          { name: "Mangu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Gatundu South",
        towns: [
          { name: "Kiamwangi", couriers: G4S_ONLY },
          { name: "Kiganjo", couriers: G4S_ONLY },
          { name: "Ndarugu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Githunguri",
        towns: [
          { name: "Githunguri", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Githiga", couriers: G4S_ONLY },
          { name: "Ikinu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kabete",
        towns: [
          { name: "Kabete", couriers: [...G4S_WELLS, "Super Metro"] },
          { name: "Muguga", couriers: G4S_WELLS },
          { name: "Nyathuna", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Lari",
        towns: [
          { name: "Lari", couriers: G4S_ONLY },
          { name: "Kijabe", couriers: G4S_WELLS },
          { name: "Kinale", couriers: G4S_ONLY },
          { name: "Kereita", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Nakuru",
    subCounties: [
      {
        name: "Nakuru Town East",
        towns: [
          { name: "Nakuru CBD", couriers: [...FULL_COURIER_SERVICE, "Mololine"] },
          { name: "Biashara", couriers: [...G4S_WELLS, "Mololine"] },
          { name: "Kivumbini", couriers: G4S_WELLS },
          { name: "Flamingo", couriers: FULL_COURIER_SERVICE },
        ]
      },
      {
        name: "Nakuru Town West",
        towns: [
          { name: "Milimani", couriers: FULL_COURIER_SERVICE },
          { name: "London", couriers: G4S_WELLS },
          { name: "Kaptembwa", couriers: G4S_WELLS },
          { name: "Rhoda", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Naivasha",
        towns: [
          { name: "Naivasha Town", couriers: [...FULL_COURIER_SERVICE, "Mololine"] },
          { name: "Kongoni", couriers: G4S_WELLS },
          { name: "Kayole", couriers: G4S_ONLY },
          { name: "Mai Mahiu", couriers: G4S_WELLS },
          { name: "Kinungi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Gilgil",
        towns: [
          { name: "Gilgil Town", couriers: [...G4S_WELLS, "Mololine"] },
          { name: "Elementaita", couriers: G4S_ONLY },
          { name: "Eburru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Molo",
        towns: [
          { name: "Molo Town", couriers: G4S_WELLS },
          { name: "Turi", couriers: G4S_ONLY },
          { name: "Elburgon", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Njoro",
        towns: [
          { name: "Njoro Town", couriers: G4S_WELLS },
          { name: "Mau Narok", couriers: G4S_ONLY },
          { name: "Nessuit", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Subukia",
        towns: [
          { name: "Subukia", couriers: G4S_ONLY },
          { name: "Wanyororo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rongai",
        towns: [
          { name: "Rongai", couriers: G4S_WELLS },
          { name: "Menengai", couriers: G4S_ONLY },
          { name: "Salgaa", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kuresoi North",
        towns: [
          { name: "Kuresoi", couriers: G4S_ONLY },
          { name: "Kamara", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kuresoi South",
        towns: [
          { name: "Keringet", couriers: G4S_ONLY },
          { name: "Tinet", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bahati",
        towns: [
          { name: "Bahati", couriers: G4S_WELLS },
          { name: "Dundori", couriers: G4S_ONLY },
          { name: "Kabatini", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kisumu",
    subCounties: [
      {
        name: "Kisumu Central",
        towns: [
          { name: "Kisumu CBD", couriers: [...FULL_COURIER_SERVICE, "Easy Coach"] },
          { name: "Milimani", couriers: FULL_COURIER_SERVICE },
          { name: "Kondele", couriers: G4S_WELLS },
          { name: "Market Milimani", couriers: FULL_COURIER_SERVICE },
        ]
      },
      {
        name: "Kisumu East",
        towns: [
          { name: "Kajulu", couriers: G4S_WELLS },
          { name: "Kolwa East", couriers: G4S_ONLY },
          { name: "Manyatta", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kisumu West",
        towns: [
          { name: "Maseno", couriers: G4S_WELLS },
          { name: "Kombewa", couriers: G4S_ONLY },
          { name: "Kisumu West", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Nyando",
        towns: [
          { name: "Ahero", couriers: G4S_WELLS },
          { name: "Awasi", couriers: G4S_ONLY },
          { name: "Nyando", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Muhoroni",
        towns: [
          { name: "Muhoroni", couriers: G4S_WELLS },
          { name: "Chemelil", couriers: G4S_ONLY },
          { name: "Koru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Nyakach",
        towns: [
          { name: "Sondu", couriers: G4S_WELLS },
          { name: "Katito", couriers: G4S_ONLY },
          { name: "Pap Onditi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Seme",
        towns: [
          { name: "Kombewa", couriers: G4S_ONLY },
          { name: "Othany", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Machakos",
    subCounties: [
      {
        name: "Machakos Town",
        towns: [
          { name: "Machakos CBD", couriers: FULL_COURIER_SERVICE },
          { name: "Mumbuni", couriers: G4S_WELLS },
          { name: "Mutituni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Athi River",
        towns: [
          { name: "Athi River/Mavoko", couriers: FULL_COURIER_SERVICE },
          { name: "Syokimau", couriers: FULL_COURIER_SERVICE },
          { name: "Mlolongo", couriers: FULL_COURIER_SERVICE },
          { name: "Kinanie", couriers: G4S_WELLS },
          { name: "Lukenya", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kangundo",
        towns: [
          { name: "Kangundo", couriers: G4S_WELLS },
          { name: "Tala", couriers: G4S_WELLS },
          { name: "Matungulu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kathiani",
        towns: [
          { name: "Kathiani", couriers: G4S_WELLS },
          { name: "Mitaboni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mwala",
        towns: [
          { name: "Mwala", couriers: G4S_ONLY },
          { name: "Mbiuni", couriers: G4S_ONLY },
          { name: "Masii", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Yatta",
        towns: [
          { name: "Yatta", couriers: G4S_ONLY },
          { name: "Ikombe", couriers: G4S_ONLY },
          { name: "Matuu", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Masinga",
        towns: [
          { name: "Masinga", couriers: G4S_ONLY },
          { name: "Muthesya", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kajiado",
    subCounties: [
      {
        name: "Kajiado North",
        towns: [
          { name: "Ongata Rongai", couriers: FULL_COURIER_SERVICE },
          { name: "Ngong", couriers: FULL_COURIER_SERVICE },
          { name: "Kiserian", couriers: G4S_WELLS },
          { name: "Matasia", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kajiado East",
        towns: [
          { name: "Kitengela", couriers: FULL_COURIER_SERVICE },
          { name: "Isinya", couriers: G4S_WELLS },
          { name: "Kaputiei", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kajiado Central",
        towns: [
          { name: "Kajiado Town", couriers: G4S_WELLS },
          { name: "Namanga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kajiado West",
        towns: [
          { name: "Magadi", couriers: G4S_ONLY },
          { name: "Ewuaso Kedong", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kajiado South",
        towns: [
          { name: "Loitokitok", couriers: G4S_WELLS },
          { name: "Amboseli", couriers: G4S_ONLY },
          { name: "Entonet", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Uasin Gishu",
    subCounties: [
      {
        name: "Eldoret East",
        towns: [
          { name: "Eldoret CBD", couriers: [...FULL_COURIER_SERVICE, "Easy Coach", "Mololine"] },
          { name: "Langas", couriers: G4S_WELLS },
          { name: "Kipkaren", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Eldoret West",
        towns: [
          { name: "Huruma", couriers: G4S_WELLS },
          { name: "Pioneer", couriers: FULL_COURIER_SERVICE },
          { name: "Racecourse", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Moiben",
        towns: [
          { name: "Moiben", couriers: G4S_ONLY },
          { name: "Karuna", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ainabkoi",
        towns: [
          { name: "Ainabkoi", couriers: G4S_ONLY },
          { name: "Kaptagat", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kapseret",
        towns: [
          { name: "Kapseret", couriers: G4S_ONLY },
          { name: "Ngeria", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kesses",
        towns: [
          { name: "Kesses", couriers: G4S_ONLY },
          { name: "Cheptiret", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kilifi",
    subCounties: [
      {
        name: "Kilifi North",
        towns: [
          { name: "Kilifi Town", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Mnarani", couriers: G4S_WELLS },
          { name: "Matsangoni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kilifi South",
        towns: [
          { name: "Mtwapa", couriers: [...FULL_COURIER_SERVICE, "Modern Coast"] },
          { name: "Shimo La Tewa", couriers: G4S_WELLS },
          { name: "Junju", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Malindi",
        towns: [
          { name: "Malindi Town", couriers: [...FULL_COURIER_SERVICE, "Modern Coast"] },
          { name: "Ganda", couriers: G4S_ONLY },
          { name: "Kakuyuni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Magarini",
        towns: [
          { name: "Magarini", couriers: G4S_ONLY },
          { name: "Marafa", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kaloleni",
        towns: [
          { name: "Kaloleni", couriers: G4S_ONLY },
          { name: "Mariakani", couriers: G4S_WELLS },
          { name: "Kayafungo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rabai",
        towns: [
          { name: "Rabai", couriers: G4S_ONLY },
          { name: "Ruruma", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ganze",
        towns: [
          { name: "Ganze", couriers: G4S_ONLY },
          { name: "Bamba", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Meru",
    subCounties: [
      {
        name: "Imenti North",
        towns: [
          { name: "Meru Town", couriers: FULL_COURIER_SERVICE },
          { name: "Municipality", couriers: FULL_COURIER_SERVICE },
          { name: "Ntima", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Imenti Central",
        towns: [
          { name: "Kiirua", couriers: G4S_WELLS },
          { name: "Abothuguchi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Imenti South",
        towns: [
          { name: "Nkubu", couriers: G4S_WELLS },
          { name: "Mitunguu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Buuri",
        towns: [
          { name: "Timau", couriers: G4S_WELLS },
          { name: "Ruiri", couriers: G4S_ONLY },
          { name: "Kibirichia", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tigania East",
        towns: [
          { name: "Mikinduri", couriers: G4S_ONLY },
          { name: "Kianjai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tigania West",
        towns: [
          { name: "Tigania", couriers: G4S_ONLY },
          { name: "Mbeu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Igembe North",
        towns: [
          { name: "Laare", couriers: G4S_ONLY },
          { name: "Antubochiu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Igembe Central",
        towns: [
          { name: "Igembe", couriers: G4S_ONLY },
          { name: "Kangeta", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Igembe South",
        towns: [
          { name: "Maua", couriers: G4S_WELLS },
          { name: "Athiru Gaiti", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Nyeri",
    subCounties: [
      {
        name: "Nyeri Town",
        towns: [
          { name: "Nyeri Town", couriers: [...FULL_COURIER_SERVICE, "2NK Sacco"] },
          { name: "Ruring'u", couriers: G4S_WELLS },
          { name: "Kamakwa", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Mathira East",
        towns: [
          { name: "Karatina", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Magutu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mathira West",
        towns: [
          { name: "Iriaini", couriers: G4S_ONLY },
          { name: "Kirimukuyu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kieni East",
        towns: [
          { name: "Narumoru", couriers: G4S_WELLS },
          { name: "Kabaru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kieni West",
        towns: [
          { name: "Mweiga", couriers: G4S_WELLS },
          { name: "Endarasha", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tetu",
        towns: [
          { name: "Tetu", couriers: G4S_ONLY },
          { name: "Wamagana", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mukurweini",
        towns: [
          { name: "Mukurweini", couriers: G4S_ONLY },
          { name: "Gikondi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Othaya",
        towns: [
          { name: "Othaya", couriers: G4S_WELLS },
          { name: "Mahiga", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kwale",
    subCounties: [
      {
        name: "Msambweni",
        towns: [
          { name: "Msambweni", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Diani", couriers: [...FULL_COURIER_SERVICE, "Modern Coast"] },
          { name: "Ukunda", couriers: [...G4S_WELLS, "Modern Coast"] },
        ]
      },
      {
        name: "Lunga Lunga",
        towns: [
          { name: "Lunga Lunga", couriers: G4S_ONLY },
          { name: "Vanga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Matuga",
        towns: [
          { name: "Kwale Town", couriers: G4S_WELLS },
          { name: "Tiwi", couriers: G4S_WELLS },
          { name: "Shimba Hills", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kinango",
        towns: [
          { name: "Kinango", couriers: G4S_ONLY },
          { name: "Mackinnon Road", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kakamega",
    subCounties: [
      {
        name: "Lurambi",
        towns: [
          { name: "Kakamega Town", couriers: [...FULL_COURIER_SERVICE, "Easy Coach"] },
          { name: "Butsotso", couriers: G4S_WELLS },
          { name: "Shieywe", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Shinyalu",
        towns: [
          { name: "Shinyalu", couriers: G4S_ONLY },
          { name: "Isukha", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ikolomani",
        towns: [
          { name: "Ikolomani", couriers: G4S_ONLY },
          { name: "Idakho", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Khwisero",
        towns: [
          { name: "Khwisero", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Butere",
        towns: [
          { name: "Butere", couriers: G4S_WELLS },
          { name: "Marama", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mumias East",
        towns: [
          { name: "Mumias", couriers: G4S_WELLS },
          { name: "Lusheya", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mumias West",
        towns: [
          { name: "Shianda", couriers: G4S_ONLY },
          { name: "Musanda", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Matungu",
        towns: [
          { name: "Matungu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Likuyani",
        towns: [
          { name: "Likuyani", couriers: G4S_ONLY },
          { name: "Kongoni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Lugari",
        towns: [
          { name: "Lumakanda", couriers: G4S_ONLY },
          { name: "Mautuma", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Malava",
        towns: [
          { name: "Malava", couriers: G4S_ONLY },
          { name: "Chemuche", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Navakholo",
        towns: [
          { name: "Navakholo", couriers: G4S_ONLY },
          { name: "Ingotse", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // More counties...
  {
    name: "Bungoma",
    subCounties: [
      {
        name: "Kanduyi",
        towns: [
          { name: "Bungoma Town", couriers: [...FULL_COURIER_SERVICE, "Easy Coach"] },
          { name: "Musikoma", couriers: G4S_WELLS },
          { name: "Khalaba", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bumula",
        towns: [
          { name: "Bumula", couriers: G4S_ONLY },
          { name: "Siboti", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Webuye East",
        towns: [
          { name: "Webuye", couriers: G4S_WELLS },
          { name: "Maraka", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Webuye West",
        towns: [
          { name: "Misikhu", couriers: G4S_ONLY },
          { name: "Sitikho", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kimilili",
        towns: [
          { name: "Kimilili", couriers: G4S_ONLY },
          { name: "Maeni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tongaren",
        towns: [
          { name: "Tongaren", couriers: G4S_ONLY },
          { name: "Soysambu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mt. Elgon",
        towns: [
          { name: "Kapsokwony", couriers: G4S_ONLY },
          { name: "Cheptais", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Sirisia",
        towns: [
          { name: "Sirisia", couriers: G4S_ONLY },
          { name: "Chwele", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Trans Nzoia",
    subCounties: [
      {
        name: "Kitale Town",
        towns: [
          { name: "Kitale Town", couriers: [...FULL_COURIER_SERVICE, "Easy Coach", "Mololine"] },
          { name: "Milimani", couriers: G4S_WELLS },
          { name: "Grasslands", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Saboti",
        towns: [
          { name: "Saboti", couriers: G4S_ONLY },
          { name: "Kiminini", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Cherangany",
        towns: [
          { name: "Cherangany", couriers: G4S_ONLY },
          { name: "Makutano", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kwanza",
        towns: [
          { name: "Kwanza", couriers: G4S_ONLY },
          { name: "Kapomboi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Endebess",
        towns: [
          { name: "Endebess", couriers: G4S_ONLY },
          { name: "Suam", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kericho",
    subCounties: [
      {
        name: "Kericho Town",
        towns: [
          { name: "Kericho Town", couriers: FULL_COURIER_SERVICE },
          { name: "Brooke", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Ainamoi",
        towns: [
          { name: "Ainamoi", couriers: G4S_ONLY },
          { name: "Kapsuser", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Belgut",
        towns: [
          { name: "Sosiot", couriers: G4S_ONLY },
          { name: "Waldai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bureti",
        towns: [
          { name: "Litein", couriers: G4S_WELLS },
          { name: "Cheborge", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kipkelion East",
        towns: [
          { name: "Londiani", couriers: G4S_WELLS },
          { name: "Kipkelion", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kipkelion West",
        towns: [
          { name: "Fort Ternan", couriers: G4S_ONLY },
          { name: "Chilchila", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Sigowet/Soin",
        towns: [
          { name: "Sigowet", couriers: G4S_ONLY },
          { name: "Soin", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Bomet",
    subCounties: [
      {
        name: "Bomet Central",
        towns: [
          { name: "Bomet Town", couriers: G4S_WELLS },
          { name: "Silibwet", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bomet East",
        towns: [
          { name: "Longisa", couriers: G4S_ONLY },
          { name: "Kembu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Sotik",
        towns: [
          { name: "Sotik", couriers: G4S_WELLS },
          { name: "Ndanai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Chepalungu",
        towns: [
          { name: "Sigor", couriers: G4S_ONLY },
          { name: "Chebunyo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Konoin",
        towns: [
          { name: "Mogogosiek", couriers: G4S_ONLY },
          { name: "Kimulot", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Nyandarua",
    subCounties: [
      {
        name: "Ol Kalou",
        towns: [
          { name: "Ol Kalou", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Karau", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ol Joro Orok",
        towns: [
          { name: "Ol Joro Orok", couriers: G4S_ONLY },
          { name: "Weru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ndaragwa",
        towns: [
          { name: "Ndaragwa", couriers: G4S_ONLY },
          { name: "Shamata", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kipipiri",
        towns: [
          { name: "Kipipiri", couriers: G4S_ONLY },
          { name: "Geta", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kinangop",
        towns: [
          { name: "Engineer", couriers: G4S_WELLS },
          { name: "Njabini", couriers: G4S_ONLY },
          { name: "North Kinangop", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Muranga",
    subCounties: [
      {
        name: "Murang'a Town",
        towns: [
          { name: "Murang'a Town", couriers: [...FULL_COURIER_SERVICE, "2NK Sacco"] },
          { name: "Maragua", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kigumo",
        towns: [
          { name: "Kigumo", couriers: G4S_ONLY },
          { name: "Kangari", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kandara",
        towns: [
          { name: "Kenol", couriers: G4S_WELLS },
          { name: "Kandara", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Gatanga",
        towns: [
          { name: "Gatanga", couriers: G4S_ONLY },
          { name: "Gatura", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kiharu",
        towns: [
          { name: "Kiharu", couriers: G4S_ONLY },
          { name: "Gaturi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kangema",
        towns: [
          { name: "Kangema", couriers: G4S_ONLY },
          { name: "Rwathia", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mathioya",
        towns: [
          { name: "Kiriaini", couriers: G4S_ONLY },
          { name: "Gitugi", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kirinyaga",
    subCounties: [
      {
        name: "Kirinyaga Central",
        towns: [
          { name: "Kerugoya", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Kutus", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kirinyaga East",
        towns: [
          { name: "Wanguru", couriers: G4S_WELLS },
          { name: "Kagumo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kirinyaga West",
        towns: [
          { name: "Kimbimbi", couriers: G4S_ONLY },
          { name: "Kianyaga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mwea",
        towns: [
          { name: "Wang'uru", couriers: G4S_WELLS },
          { name: "Tebere", couriers: G4S_ONLY },
          { name: "Kagio", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Embu",
    subCounties: [
      {
        name: "Manyatta",
        towns: [
          { name: "Embu Town", couriers: FULL_COURIER_SERVICE },
          { name: "Kianjokoma", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Runyenjes",
        towns: [
          { name: "Runyenjes", couriers: G4S_WELLS },
          { name: "Kagaari", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mbeere North",
        towns: [
          { name: "Siakago", couriers: G4S_ONLY },
          { name: "Evurore", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mbeere South",
        towns: [
          { name: "Kiritiri", couriers: G4S_ONLY },
          { name: "Mavuria", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Tharaka Nithi",
    subCounties: [
      {
        name: "Chuka",
        towns: [
          { name: "Chuka Town", couriers: G4S_WELLS },
          { name: "Mariani", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Maara",
        towns: [
          { name: "Mwimbi", couriers: G4S_ONLY },
          { name: "Chogoria", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Tharaka North",
        towns: [
          { name: "Gatunga", couriers: G4S_ONLY },
          { name: "Mukothima", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tharaka South",
        towns: [
          { name: "Marimanti", couriers: G4S_ONLY },
          { name: "Nkondi", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Laikipia",
    subCounties: [
      {
        name: "Laikipia East",
        towns: [
          { name: "Nanyuki", couriers: FULL_COURIER_SERVICE },
          { name: "Dol Dol", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Laikipia West",
        towns: [
          { name: "Nyahururu", couriers: [...G4S_WELLS, "2NK Sacco"] },
          { name: "Rumuruti", couriers: G4S_WELLS },
          { name: "Kinamba", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Laikipia North",
        towns: [
          { name: "Mukogodo", couriers: G4S_ONLY },
          { name: "Segera", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Nandi",
    subCounties: [
      {
        name: "Nandi Hills",
        towns: [
          { name: "Nandi Hills", couriers: G4S_WELLS },
          { name: "Chepkumia", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Emgwen",
        towns: [
          { name: "Kapsabet", couriers: G4S_WELLS },
          { name: "Chepterwai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mosop",
        towns: [
          { name: "Kabiyet", couriers: G4S_ONLY },
          { name: "Chepterwai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Aldai",
        towns: [
          { name: "Kobujoi", couriers: G4S_ONLY },
          { name: "Kaptumo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Chesumei",
        towns: [
          { name: "Kaptel", couriers: G4S_ONLY },
          { name: "Kosirai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tinderet",
        towns: [
          { name: "Songhor", couriers: G4S_ONLY },
          { name: "Tindiret", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Elgeyo Marakwet",
    subCounties: [
      {
        name: "Keiyo North",
        towns: [
          { name: "Iten", couriers: G4S_WELLS },
          { name: "Tambach", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Keiyo South",
        towns: [
          { name: "Chepkorio", couriers: G4S_ONLY },
          { name: "Kamariny", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Marakwet East",
        towns: [
          { name: "Kapsowar", couriers: G4S_ONLY },
          { name: "Chebiemit", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Marakwet West",
        towns: [
          { name: "Kapyego", couriers: G4S_ONLY },
          { name: "Arror", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Baringo",
    subCounties: [
      {
        name: "Baringo Central",
        towns: [
          { name: "Kabarnet", couriers: G4S_WELLS },
          { name: "Sacho", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Baringo North",
        towns: [
          { name: "Kabartonjo", couriers: G4S_ONLY },
          { name: "Bartabwa", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Baringo South",
        towns: [
          { name: "Marigat", couriers: G4S_WELLS },
          { name: "Mochongoi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Eldama Ravine",
        towns: [
          { name: "Eldama Ravine", couriers: G4S_WELLS },
          { name: "Lembus", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mogotio",
        towns: [
          { name: "Mogotio", couriers: G4S_ONLY },
          { name: "Emining", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tiaty",
        towns: [
          { name: "Chemolingot", couriers: G4S_ONLY },
          { name: "Tangulbei", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // Coastal counties
  {
    name: "Taita Taveta",
    subCounties: [
      {
        name: "Taveta",
        towns: [
          { name: "Taveta Town", couriers: G4S_WELLS },
          { name: "Chumvini", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Wundanyi",
        towns: [
          { name: "Wundanyi", couriers: G4S_WELLS },
          { name: "Werugha", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mwatate",
        towns: [
          { name: "Mwatate", couriers: G4S_ONLY },
          { name: "Bura", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Voi",
        towns: [
          { name: "Voi Town", couriers: [...G4S_WELLS, "Modern Coast"] },
          { name: "Mbololo", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Lamu",
    subCounties: [
      {
        name: "Lamu East",
        towns: [
          { name: "Faza", couriers: G4S_ONLY },
          { name: "Kiunga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Lamu West",
        towns: [
          { name: "Lamu Town", couriers: G4S_WELLS },
          { name: "Mpeketoni", couriers: G4S_ONLY },
          { name: "Witu", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Tana River",
    subCounties: [
      {
        name: "Garsen",
        towns: [
          { name: "Garsen", couriers: G4S_ONLY },
          { name: "Kipini", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Galole",
        towns: [
          { name: "Hola", couriers: G4S_WELLS },
          { name: "Bura", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bura",
        towns: [
          { name: "Bura", couriers: G4S_ONLY },
          { name: "Bangale", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // Nyanza counties
  {
    name: "Siaya",
    subCounties: [
      {
        name: "Siaya",
        towns: [
          { name: "Siaya Town", couriers: G4S_WELLS },
          { name: "Usenge", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Gem",
        towns: [
          { name: "Yala", couriers: G4S_WELLS },
          { name: "Luanda", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ugenya",
        towns: [
          { name: "Ukwala", couriers: G4S_ONLY },
          { name: "Sega", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ugunja",
        towns: [
          { name: "Ugunja", couriers: G4S_ONLY },
          { name: "Sidindi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bondo",
        towns: [
          { name: "Bondo Town", couriers: G4S_WELLS },
          { name: "Usigu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rarieda",
        towns: [
          { name: "Madiany", couriers: G4S_ONLY },
          { name: "Ndori", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Homa Bay",
    subCounties: [
      {
        name: "Homa Bay Town",
        towns: [
          { name: "Homa Bay Town", couriers: G4S_WELLS },
          { name: "Arujo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rangwe",
        towns: [
          { name: "Rangwe", couriers: G4S_ONLY },
          { name: "Asumbi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ndhiwa",
        towns: [
          { name: "Ndhiwa", couriers: G4S_ONLY },
          { name: "Rodi Kopany", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rachuonyo North",
        towns: [
          { name: "Oyugis", couriers: G4S_WELLS },
          { name: "Kendu Bay", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rachuonyo South",
        towns: [
          { name: "Kosele", couriers: G4S_ONLY },
          { name: "Mirogi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kabondo Kasipul",
        towns: [
          { name: "Kadongo", couriers: G4S_ONLY },
          { name: "Rabuor", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Suba North",
        towns: [
          { name: "Mbita", couriers: G4S_ONLY },
          { name: "Mfangano", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Suba South",
        towns: [
          { name: "Gwassi", couriers: G4S_ONLY },
          { name: "Kaksingri", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Migori",
    subCounties: [
      {
        name: "Suna East",
        towns: [
          { name: "Migori Town", couriers: G4S_WELLS },
          { name: "Kuria", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Suna West",
        towns: [
          { name: "Wasimbete", couriers: G4S_ONLY },
          { name: "Wiga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Uriri",
        towns: [
          { name: "Uriri", couriers: G4S_ONLY },
          { name: "Rapogi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Awendo",
        towns: [
          { name: "Awendo", couriers: G4S_WELLS },
          { name: "Rongo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Nyatike",
        towns: [
          { name: "Macalder", couriers: G4S_ONLY },
          { name: "Muhuru Bay", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Rongo",
        towns: [
          { name: "Rongo Town", couriers: G4S_WELLS },
          { name: "Kangeso", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kuria East",
        towns: [
          { name: "Kegonga", couriers: G4S_ONLY },
          { name: "Ntimaru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kuria West",
        towns: [
          { name: "Kehancha", couriers: G4S_WELLS },
          { name: "Isebania", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Kisii",
    subCounties: [
      {
        name: "Kisii Central",
        towns: [
          { name: "Kisii Town", couriers: [...FULL_COURIER_SERVICE, "Easy Coach"] },
          { name: "Daraja Mbili", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Kisii South",
        towns: [
          { name: "Suneka", couriers: G4S_ONLY },
          { name: "Keumbu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Nyaribari Masaba",
        towns: [
          { name: "Masaba", couriers: G4S_ONLY },
          { name: "Ichuni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Nyaribari Chache",
        towns: [
          { name: "Nyabururu", couriers: G4S_ONLY },
          { name: "Birongo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bobasi",
        towns: [
          { name: "Nyamira Town", couriers: G4S_WELLS },
          { name: "Masimba", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bomachoge Chache",
        towns: [
          { name: "Ogembo", couriers: G4S_ONLY },
          { name: "Tabaka", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bomachoge Borabu",
        towns: [
          { name: "Nyansiongo", couriers: G4S_ONLY },
          { name: "Kiabonyoru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "South Mugirango",
        towns: [
          { name: "Etago", couriers: G4S_ONLY },
          { name: "Nyamarambe", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Bonchari",
        towns: [
          { name: "Suneka", couriers: G4S_ONLY },
          { name: "Riana", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Nyamira",
    subCounties: [
      {
        name: "Nyamira North",
        towns: [
          { name: "Nyamira Town", couriers: G4S_WELLS },
          { name: "Ekerenyo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Nyamira South",
        towns: [
          { name: "Keroka", couriers: G4S_WELLS },
          { name: "Sironga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Masaba North",
        towns: [
          { name: "Rigoma", couriers: G4S_ONLY },
          { name: "Gesima", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Borabu",
        towns: [
          { name: "Nyansiongo", couriers: G4S_ONLY },
          { name: "Esise", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Manga",
        towns: [
          { name: "Kemera", couriers: G4S_ONLY },
          { name: "Magombo", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // Western counties
  {
    name: "Vihiga",
    subCounties: [
      {
        name: "Vihiga",
        towns: [
          { name: "Mbale", couriers: G4S_WELLS },
          { name: "Mudete", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Sabatia",
        towns: [
          { name: "Chavakali", couriers: G4S_ONLY },
          { name: "Wodanga", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Hamisi",
        towns: [
          { name: "Serem", couriers: G4S_ONLY },
          { name: "Jepkoyai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Luanda",
        towns: [
          { name: "Luanda Town", couriers: G4S_WELLS },
          { name: "Emuhaya", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Emuhaya",
        towns: [
          { name: "Emuhaya", couriers: G4S_ONLY },
          { name: "Kima", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Busia",
    subCounties: [
      {
        name: "Teso North",
        towns: [
          { name: "Amagoro", couriers: G4S_ONLY },
          { name: "Malaba", couriers: G4S_WELLS },
        ]
      },
      {
        name: "Teso South",
        towns: [
          { name: "Amukura", couriers: G4S_ONLY },
          { name: "Chakol", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Nambale",
        towns: [
          { name: "Nambale", couriers: G4S_ONLY },
          { name: "Mundika", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Matayos",
        towns: [
          { name: "Matayos", couriers: G4S_ONLY },
          { name: "Mayenje", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Butula",
        towns: [
          { name: "Butula", couriers: G4S_ONLY },
          { name: "Kingandole", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Funyula",
        towns: [
          { name: "Funyula", couriers: G4S_ONLY },
          { name: "Sio Port", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Busia Township",
        towns: [
          { name: "Busia Town", couriers: G4S_WELLS },
          { name: "Sofia", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // Northern counties
  {
    name: "Turkana",
    subCounties: [
      {
        name: "Turkana Central",
        towns: [
          { name: "Lodwar", couriers: G4S_WELLS },
          { name: "Kerio", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Turkana South",
        towns: [
          { name: "Lokichar", couriers: G4S_ONLY },
          { name: "Katilu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Turkana North",
        towns: [
          { name: "Kakuma", couriers: G4S_ONLY },
          { name: "Lokitaung", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Turkana East",
        towns: [
          { name: "Kapedo", couriers: G4S_ONLY },
          { name: "Lokori", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Turkana West",
        towns: [
          { name: "Kakuma", couriers: G4S_WELLS },
          { name: "Lokichoggio", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Loima",
        towns: [
          { name: "Loima", couriers: G4S_ONLY },
          { name: "Lorugum", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "West Pokot",
    subCounties: [
      {
        name: "Kapenguria",
        towns: [
          { name: "Kapenguria", couriers: G4S_WELLS },
          { name: "Makutano", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kacheliba",
        towns: [
          { name: "Kacheliba", couriers: G4S_ONLY },
          { name: "Kongelai", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Pokot Central",
        towns: [
          { name: "Sigor", couriers: G4S_ONLY },
          { name: "Lomut", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Pokot South",
        towns: [
          { name: "Chepareria", couriers: G4S_ONLY },
          { name: "Lelan", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Samburu",
    subCounties: [
      {
        name: "Samburu Central",
        towns: [
          { name: "Maralal", couriers: G4S_WELLS },
          { name: "Loosuk", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Samburu East",
        towns: [
          { name: "Wamba", couriers: G4S_ONLY },
          { name: "Archers Post", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Samburu North",
        towns: [
          { name: "Baragoi", couriers: G4S_ONLY },
          { name: "South Horr", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Marsabit",
    subCounties: [
      {
        name: "Saku",
        towns: [
          { name: "Marsabit Town", couriers: G4S_WELLS },
          { name: "Karare", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Laisamis",
        towns: [
          { name: "Laisamis", couriers: G4S_ONLY },
          { name: "Korr", couriers: G4S_ONLY },
        ]
      },
      {
        name: "North Horr",
        towns: [
          { name: "North Horr", couriers: G4S_ONLY },
          { name: "Loiyangalani", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Moyale",
        towns: [
          { name: "Moyale", couriers: G4S_ONLY },
          { name: "Sololo", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Isiolo",
    subCounties: [
      {
        name: "Isiolo",
        towns: [
          { name: "Isiolo Town", couriers: G4S_WELLS },
          { name: "Burat", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Garbatulla",
        towns: [
          { name: "Garbatulla", couriers: G4S_ONLY },
          { name: "Kinna", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Merti",
        towns: [
          { name: "Merti", couriers: G4S_ONLY },
          { name: "Sericho", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Mandera",
    subCounties: [
      {
        name: "Mandera East",
        towns: [
          { name: "Mandera Town", couriers: G4S_ONLY },
          { name: "Arabia", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mandera West",
        towns: [
          { name: "Takaba", couriers: G4S_ONLY },
          { name: "Dandu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mandera North",
        towns: [
          { name: "Rhamu", couriers: G4S_ONLY },
          { name: "Ashabito", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mandera South",
        towns: [
          { name: "Elwak", couriers: G4S_ONLY },
          { name: "Wargadud", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Banissa",
        towns: [
          { name: "Banissa", couriers: G4S_ONLY },
          { name: "Kiliwehiri", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Lafey",
        towns: [
          { name: "Lafey", couriers: G4S_ONLY },
          { name: "Alango", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Wajir",
    subCounties: [
      {
        name: "Wajir East",
        towns: [
          { name: "Wajir Town", couriers: G4S_WELLS },
          { name: "Khorof Harar", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Wajir West",
        towns: [
          { name: "Griftu", couriers: G4S_ONLY },
          { name: "Buna", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Wajir North",
        towns: [
          { name: "Bute", couriers: G4S_ONLY },
          { name: "Gurar", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Wajir South",
        towns: [
          { name: "Habaswein", couriers: G4S_ONLY },
          { name: "Lagboghol", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Eldas",
        towns: [
          { name: "Eldas", couriers: G4S_ONLY },
          { name: "Sarman", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Tarbaj",
        towns: [
          { name: "Tarbaj", couriers: G4S_ONLY },
          { name: "Kutulo", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Garissa",
    subCounties: [
      {
        name: "Garissa Township",
        towns: [
          { name: "Garissa Town", couriers: G4S_WELLS },
          { name: "Galbet", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Balambala",
        towns: [
          { name: "Balambala", couriers: G4S_ONLY },
          { name: "Danyere", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Lagdera",
        towns: [
          { name: "Modogashe", couriers: G4S_ONLY },
          { name: "Bura", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Dadaab",
        towns: [
          { name: "Dadaab", couriers: G4S_ONLY },
          { name: "Liboi", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Fafi",
        towns: [
          { name: "Bura", couriers: G4S_ONLY },
          { name: "Jarajila", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Ijara",
        towns: [
          { name: "Hulugho", couriers: G4S_ONLY },
          { name: "Masalani", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // Central Kenya remaining
  {
    name: "Kitui",
    subCounties: [
      {
        name: "Kitui Central",
        towns: [
          { name: "Kitui Town", couriers: G4S_WELLS },
          { name: "Mulango", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kitui West",
        towns: [
          { name: "Kabati", couriers: G4S_ONLY },
          { name: "Mutonguni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kitui East",
        towns: [
          { name: "Zombe", couriers: G4S_ONLY },
          { name: "Chuluni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kitui South",
        towns: [
          { name: "Mutomo", couriers: G4S_ONLY },
          { name: "Ikutha", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kitui Rural",
        towns: [
          { name: "Mbitini", couriers: G4S_ONLY },
          { name: "Kwavonza", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mwingi North",
        towns: [
          { name: "Mwingi Town", couriers: G4S_WELLS },
          { name: "Tseikuru", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mwingi West",
        towns: [
          { name: "Migwani", couriers: G4S_ONLY },
          { name: "Kiomo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mwingi Central",
        towns: [
          { name: "Mwingi", couriers: G4S_WELLS },
          { name: "Mumbuni", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  {
    name: "Makueni",
    subCounties: [
      {
        name: "Makueni",
        towns: [
          { name: "Wote", couriers: G4S_WELLS },
          { name: "Kathonzweni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kibwezi West",
        towns: [
          { name: "Makindu", couriers: G4S_WELLS },
          { name: "Nguu", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kibwezi East",
        towns: [
          { name: "Mtito Andei", couriers: G4S_WELLS },
          { name: "Ivingoni", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kilome",
        towns: [
          { name: "Kasikeu", couriers: G4S_ONLY },
          { name: "Mukaa", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Kaiti",
        towns: [
          { name: "Kilungu", couriers: G4S_ONLY },
          { name: "Ilima", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Mbooni",
        towns: [
          { name: "Tawa", couriers: G4S_ONLY },
          { name: "Kisau", couriers: G4S_ONLY },
        ]
      },
    ]
  },
  // Remaining Rift Valley
  {
    name: "Narok",
    subCounties: [
      {
        name: "Narok Town",
        towns: [
          { name: "Narok Town", couriers: G4S_WELLS },
          { name: "Olorropil", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Narok East",
        towns: [
          { name: "Suswa", couriers: G4S_ONLY },
          { name: "Keekonyokie", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Narok West",
        towns: [
          { name: "Naikarra", couriers: G4S_ONLY },
          { name: "Sogoo", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Narok South",
        towns: [
          { name: "Kilgoris", couriers: G4S_WELLS },
          { name: "Lolgorian", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Narok North",
        towns: [
          { name: "Ololulung'a", couriers: G4S_ONLY },
          { name: "Melili", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Transmara West",
        towns: [
          { name: "Kilgoris", couriers: G4S_WELLS },
          { name: "Lolgorian", couriers: G4S_ONLY },
        ]
      },
      {
        name: "Transmara East",
        towns: [
          { name: "Kapsasian", couriers: G4S_ONLY },
          { name: "Emarti", couriers: G4S_ONLY },
        ]
      },
    ]
  },
];

// Helper function to get delivery fee based on courier and distance
export const getDeliveryFee = (county: string, courier: string): number => {
  const baseInfo = COURIER_INFO[courier];
  if (!baseInfo) return 300;
  
  // Nairobi is cheapest
  if (county === "Nairobi") return baseInfo.baseFee;
  
  // Nearby counties
  const nearbyCounties = ["Kiambu", "Machakos", "Kajiado"];
  if (nearbyCounties.includes(county)) return baseInfo.baseFee + 50;
  
  // Medium distance
  const mediumCounties = ["Nakuru", "Nyeri", "Meru", "Muranga", "Kirinyaga", "Embu", "Nyandarua"];
  if (mediumCounties.includes(county)) return baseInfo.baseFee + 100;
  
  // Coastal counties
  const coastalCounties = ["Mombasa", "Kilifi", "Kwale", "Tana River", "Lamu", "Taita Taveta"];
  if (coastalCounties.includes(county)) return baseInfo.baseFee + 200;
  
  // Far counties
  return baseInfo.baseFee + 150;
};

// Get estimated delivery days
export const getEstimatedDays = (county: string, courier: string): number => {
  const baseInfo = COURIER_INFO[courier];
  if (!baseInfo) return 5;
  
  // Nairobi same/next day
  if (county === "Nairobi") return baseInfo.estimatedDays;
  
  // Nearby counties
  const nearbyCounties = ["Kiambu", "Machakos", "Kajiado"];
  if (nearbyCounties.includes(county)) return baseInfo.estimatedDays + 1;
  
  // Remote counties
  const remoteCounties = ["Turkana", "Marsabit", "Mandera", "Wajir", "Garissa"];
  if (remoteCounties.includes(county)) return baseInfo.estimatedDays + 5;
  
  return baseInfo.estimatedDays + 2;
};
