// Complete Kenya Counties, Sub-Counties, and Towns with Carrier Availability
// Includes: Couriers, Matatu Saccos, and Bus Companies

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

export interface Carrier {
  id: string;
  name: string;
  type: 'courier' | 'matatu' | 'bus';
  description: string;
  estimatedDays: number;
  baseFee: number;
  regions: string[]; // Counties served
}

// All carriers available in Kenya
export const CARRIERS: Carrier[] = [
  // Courier Companies
  { id: "g4s", name: "G4S Kenya", type: "courier", description: "Reliable nationwide courier with tracking", estimatedDays: 2, baseFee: 350, regions: ["nationwide"] },
  { id: "wells_fargo", name: "Wells Fargo Limited", type: "courier", description: "Premium courier for major towns", estimatedDays: 1, baseFee: 450, regions: ["nationwide"] },
  { id: "sga", name: "SGA Security", type: "courier", description: "Secure parcel delivery service", estimatedDays: 2, baseFee: 400, regions: ["nationwide"] },
  { id: "fargo_courier", name: "Fargo Courier", type: "courier", description: "Fast delivery across Kenya", estimatedDays: 2, baseFee: 380, regions: ["nationwide"] },
  { id: "posta_kenya", name: "Posta Kenya (EMS)", type: "courier", description: "Government postal service", estimatedDays: 3, baseFee: 250, regions: ["nationwide"] },
  { id: "sendy", name: "Sendy", type: "courier", description: "On-demand delivery platform", estimatedDays: 1, baseFee: 300, regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"] },
  
  // Matatu Saccos - Central Kenya
  { id: "2nk", name: "2NK Sacco", type: "matatu", description: "Central Kenya matatu delivery", estimatedDays: 1, baseFee: 200, regions: ["Nairobi", "Kiambu", "Nyeri", "Muranga", "Kirinyaga"] },
  { id: "super_metro", name: "Super Metro", type: "matatu", description: "Fast Nairobi region service", estimatedDays: 1, baseFee: 150, regions: ["Nairobi", "Kiambu", "Machakos", "Kajiado"] },
  { id: "kikuyu_express", name: "Kikuyu Express", type: "matatu", description: "Kiambu & Nairobi routes", estimatedDays: 1, baseFee: 150, regions: ["Nairobi", "Kiambu"] },
  { id: "forward_travellers", name: "Forward Travellers", type: "matatu", description: "Thika & Muranga routes", estimatedDays: 1, baseFee: 180, regions: ["Nairobi", "Kiambu", "Muranga"] },
  { id: "kenyatta_sacco", name: "Kenyatta Sacco", type: "matatu", description: "Nyeri & Mt Kenya routes", estimatedDays: 1, baseFee: 200, regions: ["Nairobi", "Nyeri", "Kirinyaga", "Embu"] },
  
  // Matatu Saccos - Western & Nyanza
  { id: "mololine", name: "Mololine Sacco", type: "matatu", description: "Western Kenya delivery", estimatedDays: 1, baseFee: 250, regions: ["Nairobi", "Nakuru", "Kisumu", "Kakamega", "Bungoma", "Busia"] },
  { id: "classic_sacco", name: "Classic Sacco", type: "matatu", description: "Kisumu & Nyanza routes", estimatedDays: 1, baseFee: 250, regions: ["Nairobi", "Kisumu", "Siaya", "Homa Bay", "Migori"] },
  { id: "western_express", name: "Western Express", type: "matatu", description: "Bungoma & Trans Nzoia", estimatedDays: 1, baseFee: 280, regions: ["Nairobi", "Bungoma", "Trans Nzoia", "Uasin Gishu"] },
  
  // Matatu Saccos - Rift Valley
  { id: "eldoret_express", name: "Eldoret Express", type: "matatu", description: "North Rift delivery", estimatedDays: 1, baseFee: 300, regions: ["Nairobi", "Nakuru", "Uasin Gishu", "Nandi", "Elgeyo Marakwet"] },
  { id: "naivasha_star", name: "Naivasha Star", type: "matatu", description: "Naivasha & Nakuru routes", estimatedDays: 1, baseFee: 180, regions: ["Nairobi", "Nakuru", "Narok"] },
  { id: "kericho_express", name: "Kericho Express", type: "matatu", description: "Kericho & Bomet routes", estimatedDays: 1, baseFee: 250, regions: ["Nairobi", "Kericho", "Bomet", "Nakuru"] },
  
  // Matatu Saccos - Eastern
  { id: "mwingi_line", name: "Mwingi Line", type: "matatu", description: "Kitui & Machakos routes", estimatedDays: 1, baseFee: 200, regions: ["Nairobi", "Machakos", "Kitui"] },
  { id: "meru_shuttle", name: "Meru Shuttle", type: "matatu", description: "Meru & Tharaka Nithi", estimatedDays: 1, baseFee: 220, regions: ["Nairobi", "Meru", "Tharaka Nithi", "Embu"] },
  { id: "machakos_country", name: "Machakos Country Bus", type: "matatu", description: "Machakos routes", estimatedDays: 1, baseFee: 150, regions: ["Nairobi", "Machakos"] },
  
  // Bus Companies
  { id: "easy_coach", name: "Easy Coach", type: "bus", description: "Long-distance premium bus", estimatedDays: 1, baseFee: 300, regions: ["Nairobi", "Mombasa", "Kisumu", "Bungoma", "Malaba"] },
  { id: "modern_coast", name: "Modern Coast", type: "bus", description: "Coastal region delivery", estimatedDays: 1, baseFee: 350, regions: ["Nairobi", "Mombasa", "Kilifi", "Kwale", "Malindi"] },
  { id: "tahmeed", name: "Tahmeed Bus", type: "bus", description: "Coast & North Eastern", estimatedDays: 1, baseFee: 400, regions: ["Nairobi", "Mombasa", "Garissa", "Wajir", "Mandera"] },
  { id: "mash_east_africa", name: "Mash East Africa", type: "bus", description: "Western Kenya & Uganda border", estimatedDays: 1, baseFee: 350, regions: ["Nairobi", "Kisumu", "Busia", "Kakamega", "Bungoma"] },
  { id: "guardian_bus", name: "Guardian Bus", type: "bus", description: "North Rift routes", estimatedDays: 1, baseFee: 320, regions: ["Nairobi", "Eldoret", "Kitale", "Lodwar"] },
  { id: "dreamliner", name: "Dreamline Express", type: "bus", description: "Premium Mombasa service", estimatedDays: 1, baseFee: 400, regions: ["Nairobi", "Mombasa", "Malindi", "Lamu"] },
  { id: "transline", name: "Transline Classic", type: "bus", description: "Kitale & Western routes", estimatedDays: 1, baseFee: 300, regions: ["Nairobi", "Kitale", "Bungoma", "Kakamega"] },
  { id: "simba_coach", name: "Simba Coach", type: "bus", description: "Kisumu & Lake region", estimatedDays: 1, baseFee: 280, regions: ["Nairobi", "Kisumu", "Siaya", "Homa Bay"] },
  { id: "coast_bus", name: "Coast Bus", type: "bus", description: "Reliable coast service", estimatedDays: 1, baseFee: 350, regions: ["Nairobi", "Mombasa", "Kilifi", "Malindi"] },
  { id: "crown_bus", name: "Crown Bus", type: "bus", description: "North Rift service", estimatedDays: 1, baseFee: 300, regions: ["Nairobi", "Nakuru", "Eldoret", "Kapsabet"] },
];

// Helper to get carrier info
export const COURIER_INFO: Record<string, { name: string; description: string; estimatedDays: number; baseFee: number }> = 
  CARRIERS.reduce((acc, carrier) => {
    acc[carrier.id] = { name: carrier.name, description: carrier.description, estimatedDays: carrier.estimatedDays, baseFee: carrier.baseFee };
    return acc;
  }, {} as Record<string, { name: string; description: string; estimatedDays: number; baseFee: number }>);

// Carrier groups for quick assignment
const ALL_COURIERS = ["g4s", "wells_fargo", "sga", "fargo_courier", "posta_kenya"];
const NAIROBI_FULL = [...ALL_COURIERS, "sendy", "2nk", "super_metro", "kikuyu_express"];
const CENTRAL_KENYA = ["g4s", "wells_fargo", "2nk", "forward_travellers", "kenyatta_sacco"];
const WESTERN_KENYA = ["g4s", "wells_fargo", "mololine", "classic_sacco", "mash_east_africa", "easy_coach"];
const COASTAL = ["g4s", "wells_fargo", "modern_coast", "dreamliner", "coast_bus"];
const RIFT_VALLEY = ["g4s", "wells_fargo", "mololine", "eldoret_express", "crown_bus", "guardian_bus"];
const EASTERN = ["g4s", "wells_fargo", "mwingi_line", "meru_shuttle", "machakos_country"];
const NORTH_EASTERN = ["g4s", "tahmeed"];
const G4S_ONLY = ["g4s"];

// Complete Kenya Counties with Sub-Counties and Towns
export const KENYA_LOCATIONS: County[] = [
  // =============== NAIROBI ===============
  {
    name: "Nairobi",
    subCounties: [
      { name: "Westlands", towns: [
        { name: "Westlands CBD", couriers: NAIROBI_FULL },
        { name: "Parklands", couriers: NAIROBI_FULL },
        { name: "Highridge", couriers: NAIROBI_FULL },
        { name: "Kangemi", couriers: NAIROBI_FULL },
        { name: "Mountain View", couriers: NAIROBI_FULL },
        { name: "Lavington", couriers: NAIROBI_FULL },
        { name: "Kileleshwa", couriers: NAIROBI_FULL },
        { name: "Spring Valley", couriers: NAIROBI_FULL },
      ]},
      { name: "Langata", towns: [
        { name: "Langata", couriers: NAIROBI_FULL },
        { name: "Karen", couriers: NAIROBI_FULL },
        { name: "Nairobi West", couriers: NAIROBI_FULL },
        { name: "South C", couriers: NAIROBI_FULL },
        { name: "Otiende", couriers: NAIROBI_FULL },
        { name: "Mugumo-ini", couriers: NAIROBI_FULL },
        { name: "Hardy", couriers: NAIROBI_FULL },
      ]},
      { name: "Kibra", towns: [
        { name: "Kibera", couriers: NAIROBI_FULL },
        { name: "Woodley", couriers: NAIROBI_FULL },
        { name: "Sarangombe", couriers: NAIROBI_FULL },
        { name: "Makina", couriers: NAIROBI_FULL },
        { name: "Lindi", couriers: NAIROBI_FULL },
      ]},
      { name: "Dagoretti North", towns: [
        { name: "Kilimani", couriers: NAIROBI_FULL },
        { name: "Kawangware", couriers: NAIROBI_FULL },
        { name: "Gatina", couriers: NAIROBI_FULL },
        { name: "Kileleshwa", couriers: NAIROBI_FULL },
      ]},
      { name: "Dagoretti South", towns: [
        { name: "Waithaka", couriers: NAIROBI_FULL },
        { name: "Riruta", couriers: NAIROBI_FULL },
        { name: "Uthiru", couriers: NAIROBI_FULL },
        { name: "Mutuini", couriers: NAIROBI_FULL },
        { name: "Ngando", couriers: NAIROBI_FULL },
      ]},
      { name: "Starehe", towns: [
        { name: "Nairobi CBD", couriers: NAIROBI_FULL },
        { name: "Pangani", couriers: NAIROBI_FULL },
        { name: "Ngara", couriers: NAIROBI_FULL },
        { name: "Ziwani", couriers: NAIROBI_FULL },
        { name: "Kariokor", couriers: NAIROBI_FULL },
        { name: "Landimawe", couriers: NAIROBI_FULL },
      ]},
      { name: "Kamukunji", towns: [
        { name: "Eastleigh North", couriers: NAIROBI_FULL },
        { name: "Eastleigh South", couriers: NAIROBI_FULL },
        { name: "Pumwani", couriers: NAIROBI_FULL },
        { name: "California", couriers: NAIROBI_FULL },
        { name: "Airbase", couriers: NAIROBI_FULL },
      ]},
      { name: "Embakasi East", towns: [
        { name: "Embakasi", couriers: NAIROBI_FULL },
        { name: "Utawala", couriers: NAIROBI_FULL },
        { name: "Mihang'o", couriers: NAIROBI_FULL },
        { name: "Upper Savannah", couriers: NAIROBI_FULL },
        { name: "Lower Savannah", couriers: NAIROBI_FULL },
      ]},
      { name: "Embakasi West", towns: [
        { name: "Pipeline", couriers: NAIROBI_FULL },
        { name: "Kariobangi South", couriers: NAIROBI_FULL },
        { name: "Umoja I", couriers: NAIROBI_FULL },
        { name: "Umoja II", couriers: NAIROBI_FULL },
      ]},
      { name: "Embakasi Central", towns: [
        { name: "Kayole North", couriers: NAIROBI_FULL },
        { name: "Kayole Central", couriers: NAIROBI_FULL },
        { name: "Kayole South", couriers: NAIROBI_FULL },
        { name: "Komarock", couriers: NAIROBI_FULL },
        { name: "Matopeni", couriers: NAIROBI_FULL },
      ]},
      { name: "Embakasi South", towns: [
        { name: "South B", couriers: NAIROBI_FULL },
        { name: "Imara Daima", couriers: NAIROBI_FULL },
        { name: "Kwa Njenga", couriers: NAIROBI_FULL },
        { name: "Mukuru", couriers: NAIROBI_FULL },
        { name: "Kwa Reuben", couriers: NAIROBI_FULL },
      ]},
      { name: "Embakasi North", towns: [
        { name: "Ruai", couriers: NAIROBI_FULL },
        { name: "Njiru", couriers: NAIROBI_FULL },
        { name: "Tena", couriers: NAIROBI_FULL },
        { name: "Dandora", couriers: NAIROBI_FULL },
      ]},
      { name: "Kasarani", towns: [
        { name: "Kasarani", couriers: NAIROBI_FULL },
        { name: "Mwiki", couriers: NAIROBI_FULL },
        { name: "Githurai", couriers: NAIROBI_FULL },
        { name: "Zimmerman", couriers: NAIROBI_FULL },
        { name: "Roysambu", couriers: NAIROBI_FULL },
        { name: "Kahawa West", couriers: NAIROBI_FULL },
        { name: "Kahawa Wendani", couriers: NAIROBI_FULL },
        { name: "Clay City", couriers: NAIROBI_FULL },
      ]},
      { name: "Ruaraka", towns: [
        { name: "Ruaraka", couriers: NAIROBI_FULL },
        { name: "Baba Dogo", couriers: NAIROBI_FULL },
        { name: "Utalii", couriers: NAIROBI_FULL },
        { name: "Lucky Summer", couriers: NAIROBI_FULL },
        { name: "Mathare North", couriers: NAIROBI_FULL },
        { name: "Korogocho", couriers: NAIROBI_FULL },
      ]},
      { name: "Mathare", towns: [
        { name: "Mathare", couriers: NAIROBI_FULL },
        { name: "Huruma", couriers: NAIROBI_FULL },
        { name: "Ngei", couriers: NAIROBI_FULL },
        { name: "Mlango Kubwa", couriers: NAIROBI_FULL },
        { name: "Kiamaiko", couriers: NAIROBI_FULL },
      ]},
      { name: "Makadara", towns: [
        { name: "Makadara", couriers: NAIROBI_FULL },
        { name: "Maringo", couriers: NAIROBI_FULL },
        { name: "Harambee", couriers: NAIROBI_FULL },
        { name: "Hamza", couriers: NAIROBI_FULL },
        { name: "Viwandani", couriers: NAIROBI_FULL },
        { name: "Bahati", couriers: NAIROBI_FULL },
      ]},
    ]
  },
  
  // =============== MOMBASA ===============
  {
    name: "Mombasa",
    subCounties: [
      { name: "Mvita", towns: [
        { name: "Mombasa CBD", couriers: COASTAL },
        { name: "Old Town", couriers: COASTAL },
        { name: "Majengo", couriers: COASTAL },
        { name: "Tudor", couriers: COASTAL },
        { name: "Tononoka", couriers: COASTAL },
      ]},
      { name: "Nyali", towns: [
        { name: "Nyali", couriers: COASTAL },
        { name: "Mkomani", couriers: COASTAL },
        { name: "Kongowea", couriers: COASTAL },
        { name: "Kadzandani", couriers: COASTAL },
        { name: "Frere Town", couriers: COASTAL },
      ]},
      { name: "Likoni", towns: [
        { name: "Likoni", couriers: COASTAL },
        { name: "Mtongwe", couriers: COASTAL },
        { name: "Shika Adabu", couriers: COASTAL },
        { name: "Timbwani", couriers: COASTAL },
      ]},
      { name: "Kisauni", towns: [
        { name: "Kisauni", couriers: COASTAL },
        { name: "Bamburi", couriers: COASTAL },
        { name: "Mwakirunge", couriers: COASTAL },
        { name: "Mtopanga", couriers: COASTAL },
        { name: "Magogoni", couriers: COASTAL },
        { name: "Shanzu", couriers: COASTAL },
      ]},
      { name: "Changamwe", towns: [
        { name: "Changamwe", couriers: COASTAL },
        { name: "Port Reitz", couriers: COASTAL },
        { name: "Miritini", couriers: COASTAL },
        { name: "Chaani", couriers: COASTAL },
        { name: "Airport", couriers: COASTAL },
      ]},
      { name: "Jomvu", towns: [
        { name: "Jomvu Kuu", couriers: COASTAL },
        { name: "Mikindani", couriers: COASTAL },
        { name: "Miritini", couriers: COASTAL },
      ]},
    ]
  },

  // =============== KIAMBU ===============
  {
    name: "Kiambu",
    subCounties: [
      { name: "Thika Town", towns: [
        { name: "Thika CBD", couriers: CENTRAL_KENYA },
        { name: "Makongeni", couriers: CENTRAL_KENYA },
        { name: "Landless", couriers: CENTRAL_KENYA },
        { name: "Gatuanyaga", couriers: CENTRAL_KENYA },
        { name: "Ngoingwa", couriers: CENTRAL_KENYA },
      ]},
      { name: "Ruiru", towns: [
        { name: "Ruiru Town", couriers: CENTRAL_KENYA },
        { name: "Membley", couriers: CENTRAL_KENYA },
        { name: "Kimbo", couriers: CENTRAL_KENYA },
        { name: "Juja", couriers: CENTRAL_KENYA },
        { name: "Witeithie", couriers: CENTRAL_KENYA },
        { name: "Biashara", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kiambu Town", towns: [
        { name: "Kiambu Town", couriers: CENTRAL_KENYA },
        { name: "Karuri", couriers: CENTRAL_KENYA },
        { name: "Ndumberi", couriers: CENTRAL_KENYA },
        { name: "Tinganga", couriers: CENTRAL_KENYA },
        { name: "Riabai", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kikuyu", towns: [
        { name: "Kikuyu Town", couriers: CENTRAL_KENYA },
        { name: "Kinoo", couriers: CENTRAL_KENYA },
        { name: "Zambezi", couriers: CENTRAL_KENYA },
        { name: "Kabete", couriers: CENTRAL_KENYA },
        { name: "Sigona", couriers: CENTRAL_KENYA },
        { name: "Nachu", couriers: CENTRAL_KENYA },
      ]},
      { name: "Limuru", towns: [
        { name: "Limuru Town", couriers: CENTRAL_KENYA },
        { name: "Tigoni", couriers: CENTRAL_KENYA },
        { name: "Ndeiya", couriers: CENTRAL_KENYA },
        { name: "Rironi", couriers: CENTRAL_KENYA },
        { name: "Banana", couriers: CENTRAL_KENYA },
      ]},
      { name: "Gatundu North", towns: [
        { name: "Gatundu", couriers: CENTRAL_KENYA },
        { name: "Gituamba", couriers: CENTRAL_KENYA },
        { name: "Mangu", couriers: CENTRAL_KENYA },
        { name: "Kamwangi", couriers: CENTRAL_KENYA },
      ]},
      { name: "Gatundu South", towns: [
        { name: "Kiamwangi", couriers: CENTRAL_KENYA },
        { name: "Kiganjo", couriers: CENTRAL_KENYA },
        { name: "Ndarugu", couriers: CENTRAL_KENYA },
        { name: "Ngenda", couriers: CENTRAL_KENYA },
      ]},
      { name: "Githunguri", towns: [
        { name: "Githunguri", couriers: CENTRAL_KENYA },
        { name: "Githiga", couriers: CENTRAL_KENYA },
        { name: "Ikinu", couriers: CENTRAL_KENYA },
        { name: "Ngewa", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kabete", towns: [
        { name: "Kabete", couriers: CENTRAL_KENYA },
        { name: "Muguga", couriers: CENTRAL_KENYA },
        { name: "Nyathuna", couriers: CENTRAL_KENYA },
        { name: "Uthiru", couriers: CENTRAL_KENYA },
      ]},
      { name: "Lari", towns: [
        { name: "Lari", couriers: CENTRAL_KENYA },
        { name: "Kijabe", couriers: CENTRAL_KENYA },
        { name: "Kinale", couriers: CENTRAL_KENYA },
        { name: "Kereita", couriers: CENTRAL_KENYA },
        { name: "Kagwe", couriers: CENTRAL_KENYA },
      ]},
    ]
  },

  // =============== NAKURU ===============
  {
    name: "Nakuru",
    subCounties: [
      { name: "Nakuru Town East", towns: [
        { name: "Nakuru CBD", couriers: RIFT_VALLEY },
        { name: "Biashara", couriers: RIFT_VALLEY },
        { name: "Kivumbini", couriers: RIFT_VALLEY },
        { name: "Flamingo", couriers: RIFT_VALLEY },
        { name: "Menengai", couriers: RIFT_VALLEY },
      ]},
      { name: "Nakuru Town West", towns: [
        { name: "Milimani", couriers: RIFT_VALLEY },
        { name: "London", couriers: RIFT_VALLEY },
        { name: "Kaptembwa", couriers: RIFT_VALLEY },
        { name: "Rhoda", couriers: RIFT_VALLEY },
        { name: "Shabab", couriers: RIFT_VALLEY },
      ]},
      { name: "Naivasha", towns: [
        { name: "Naivasha Town", couriers: RIFT_VALLEY },
        { name: "Kongoni", couriers: RIFT_VALLEY },
        { name: "Kayole", couriers: RIFT_VALLEY },
        { name: "Mai Mahiu", couriers: RIFT_VALLEY },
        { name: "Kinungi", couriers: RIFT_VALLEY },
        { name: "Hell's Gate", couriers: RIFT_VALLEY },
      ]},
      { name: "Gilgil", towns: [
        { name: "Gilgil Town", couriers: RIFT_VALLEY },
        { name: "Elementaita", couriers: RIFT_VALLEY },
        { name: "Eburru", couriers: RIFT_VALLEY },
        { name: "Kariandusi", couriers: RIFT_VALLEY },
      ]},
      { name: "Molo", towns: [
        { name: "Molo Town", couriers: RIFT_VALLEY },
        { name: "Turi", couriers: RIFT_VALLEY },
        { name: "Elburgon", couriers: RIFT_VALLEY },
        { name: "Mariashoni", couriers: RIFT_VALLEY },
      ]},
      { name: "Njoro", towns: [
        { name: "Njoro Town", couriers: RIFT_VALLEY },
        { name: "Mau Narok", couriers: RIFT_VALLEY },
        { name: "Nessuit", couriers: RIFT_VALLEY },
        { name: "Lare", couriers: RIFT_VALLEY },
      ]},
      { name: "Subukia", towns: [
        { name: "Subukia", couriers: RIFT_VALLEY },
        { name: "Wanyororo", couriers: RIFT_VALLEY },
        { name: "Kabazi", couriers: RIFT_VALLEY },
      ]},
      { name: "Rongai", towns: [
        { name: "Rongai", couriers: RIFT_VALLEY },
        { name: "Menengai West", couriers: RIFT_VALLEY },
        { name: "Salgaa", couriers: RIFT_VALLEY },
        { name: "Solai", couriers: RIFT_VALLEY },
      ]},
      { name: "Kuresoi North", towns: [
        { name: "Kuresoi", couriers: RIFT_VALLEY },
        { name: "Kamara", couriers: RIFT_VALLEY },
        { name: "Nyota", couriers: RIFT_VALLEY },
      ]},
      { name: "Kuresoi South", towns: [
        { name: "Keringet", couriers: RIFT_VALLEY },
        { name: "Tinet", couriers: RIFT_VALLEY },
        { name: "Kiptagich", couriers: RIFT_VALLEY },
      ]},
      { name: "Bahati", towns: [
        { name: "Bahati", couriers: RIFT_VALLEY },
        { name: "Dundori", couriers: RIFT_VALLEY },
        { name: "Kabatini", couriers: RIFT_VALLEY },
        { name: "Lanet", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== KISUMU ===============
  {
    name: "Kisumu",
    subCounties: [
      { name: "Kisumu Central", towns: [
        { name: "Kisumu CBD", couriers: WESTERN_KENYA },
        { name: "Milimani", couriers: WESTERN_KENYA },
        { name: "Kondele", couriers: WESTERN_KENYA },
        { name: "Market Milimani", couriers: WESTERN_KENYA },
        { name: "Bandani", couriers: WESTERN_KENYA },
      ]},
      { name: "Kisumu East", towns: [
        { name: "Kajulu", couriers: WESTERN_KENYA },
        { name: "Kolwa East", couriers: WESTERN_KENYA },
        { name: "Manyatta", couriers: WESTERN_KENYA },
        { name: "Nyalenda", couriers: WESTERN_KENYA },
      ]},
      { name: "Kisumu West", towns: [
        { name: "Maseno", couriers: WESTERN_KENYA },
        { name: "Kombewa", couriers: WESTERN_KENYA },
        { name: "Otonglo", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyando", towns: [
        { name: "Ahero", couriers: WESTERN_KENYA },
        { name: "Awasi", couriers: WESTERN_KENYA },
        { name: "Nyando", couriers: WESTERN_KENYA },
        { name: "Kabonyo", couriers: WESTERN_KENYA },
      ]},
      { name: "Muhoroni", towns: [
        { name: "Muhoroni", couriers: WESTERN_KENYA },
        { name: "Chemelil", couriers: WESTERN_KENYA },
        { name: "Koru", couriers: WESTERN_KENYA },
        { name: "Tamu", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyakach", towns: [
        { name: "Sondu", couriers: WESTERN_KENYA },
        { name: "Katito", couriers: WESTERN_KENYA },
        { name: "Pap Onditi", couriers: WESTERN_KENYA },
      ]},
      { name: "Seme", towns: [
        { name: "Kombewa", couriers: WESTERN_KENYA },
        { name: "Othany", couriers: WESTERN_KENYA },
        { name: "Central Seme", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== MACHAKOS ===============
  {
    name: "Machakos",
    subCounties: [
      { name: "Machakos Town", towns: [
        { name: "Machakos CBD", couriers: EASTERN },
        { name: "Mumbuni", couriers: EASTERN },
        { name: "Muvuti", couriers: EASTERN },
        { name: "Kalama", couriers: EASTERN },
      ]},
      { name: "Athi River", towns: [
        { name: "Athi River (Mavoko)", couriers: [...EASTERN, "super_metro"] },
        { name: "Syokimau", couriers: [...EASTERN, "super_metro"] },
        { name: "Kinanie", couriers: EASTERN },
        { name: "Lukenya", couriers: EASTERN },
      ]},
      { name: "Kangundo", towns: [
        { name: "Kangundo Town", couriers: EASTERN },
        { name: "Tala", couriers: EASTERN },
        { name: "Matungulu", couriers: EASTERN },
      ]},
      { name: "Kathiani", towns: [
        { name: "Kathiani", couriers: EASTERN },
        { name: "Mitaboni", couriers: EASTERN },
      ]},
      { name: "Matungulu", towns: [
        { name: "Matungulu", couriers: EASTERN },
        { name: "Koma Hill", couriers: EASTERN },
      ]},
      { name: "Mwala", towns: [
        { name: "Mwala", couriers: EASTERN },
        { name: "Mbiuni", couriers: EASTERN },
        { name: "Masii", couriers: EASTERN },
      ]},
      { name: "Yatta", towns: [
        { name: "Yatta", couriers: EASTERN },
        { name: "Ikombe", couriers: EASTERN },
        { name: "Katangi", couriers: EASTERN },
      ]},
      { name: "Masinga", towns: [
        { name: "Masinga", couriers: G4S_ONLY },
        { name: "Ekalakala", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== KAJIADO ===============
  {
    name: "Kajiado",
    subCounties: [
      { name: "Kajiado North", towns: [
        { name: "Ongata Rongai", couriers: [...EASTERN, "super_metro"] },
        { name: "Kiserian", couriers: [...EASTERN, "super_metro"] },
        { name: "Ngong", couriers: [...EASTERN, "super_metro"] },
        { name: "Matasia", couriers: EASTERN },
      ]},
      { name: "Kajiado East", towns: [
        { name: "Kitengela", couriers: [...EASTERN, "super_metro"] },
        { name: "Isinya", couriers: EASTERN },
        { name: "Kaputiei North", couriers: EASTERN },
      ]},
      { name: "Kajiado Central", towns: [
        { name: "Kajiado Town", couriers: EASTERN },
        { name: "Dalalekutuk", couriers: G4S_ONLY },
        { name: "Matapato", couriers: G4S_ONLY },
      ]},
      { name: "Kajiado West", towns: [
        { name: "Magadi", couriers: G4S_ONLY },
        { name: "Ewuaso Kedong", couriers: G4S_ONLY },
      ]},
      { name: "Kajiado South", towns: [
        { name: "Loitokitok", couriers: G4S_ONLY },
        { name: "Kimana", couriers: G4S_ONLY },
        { name: "Rombo", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== KILIFI ===============
  {
    name: "Kilifi",
    subCounties: [
      { name: "Kilifi North", towns: [
        { name: "Kilifi Town", couriers: COASTAL },
        { name: "Mtwapa", couriers: COASTAL },
        { name: "Takaungu", couriers: COASTAL },
        { name: "Tezo", couriers: COASTAL },
      ]},
      { name: "Kilifi South", towns: [
        { name: "Kikambala", couriers: COASTAL },
        { name: "Shimo la Tewa", couriers: COASTAL },
        { name: "Junju", couriers: COASTAL },
      ]},
      { name: "Malindi", towns: [
        { name: "Malindi Town", couriers: COASTAL },
        { name: "Watamu", couriers: COASTAL },
        { name: "Gede", couriers: COASTAL },
      ]},
      { name: "Magarini", towns: [
        { name: "Magarini", couriers: G4S_ONLY },
        { name: "Marafa", couriers: G4S_ONLY },
        { name: "Sabaki", couriers: G4S_ONLY },
      ]},
      { name: "Ganze", towns: [
        { name: "Ganze", couriers: G4S_ONLY },
        { name: "Bamba", couriers: G4S_ONLY },
        { name: "Jaribuni", couriers: G4S_ONLY },
      ]},
      { name: "Rabai", towns: [
        { name: "Rabai", couriers: COASTAL },
        { name: "Kambe", couriers: COASTAL },
      ]},
      { name: "Kaloleni", towns: [
        { name: "Kaloleni", couriers: COASTAL },
        { name: "Mariakani", couriers: COASTAL },
        { name: "Kayafungo", couriers: COASTAL },
      ]},
    ]
  },

  // =============== KWALE ===============
  {
    name: "Kwale",
    subCounties: [
      { name: "Matuga", towns: [
        { name: "Kwale Town", couriers: COASTAL },
        { name: "Tiwi", couriers: COASTAL },
        { name: "Waa", couriers: COASTAL },
      ]},
      { name: "Msambweni", towns: [
        { name: "Msambweni", couriers: COASTAL },
        { name: "Diani", couriers: COASTAL },
        { name: "Ukunda", couriers: COASTAL },
        { name: "Gazi", couriers: COASTAL },
      ]},
      { name: "Lunga Lunga", towns: [
        { name: "Lunga Lunga", couriers: G4S_ONLY },
        { name: "Shimoni", couriers: G4S_ONLY },
        { name: "Vanga", couriers: G4S_ONLY },
      ]},
      { name: "Kinango", towns: [
        { name: "Kinango", couriers: G4S_ONLY },
        { name: "Mackinnon Road", couriers: G4S_ONLY },
        { name: "Samburu", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== UASIN GISHU ===============
  {
    name: "Uasin Gishu",
    subCounties: [
      { name: "Eldoret East", towns: [
        { name: "Eldoret CBD", couriers: RIFT_VALLEY },
        { name: "Huruma", couriers: RIFT_VALLEY },
        { name: "Kamukunji", couriers: RIFT_VALLEY },
      ]},
      { name: "Eldoret West", towns: [
        { name: "West Indies", couriers: RIFT_VALLEY },
        { name: "Pioneer", couriers: RIFT_VALLEY },
        { name: "Langas", couriers: RIFT_VALLEY },
      ]},
      { name: "Kapseret", towns: [
        { name: "Kapseret", couriers: RIFT_VALLEY },
        { name: "Simat", couriers: RIFT_VALLEY },
        { name: "Ngeria", couriers: RIFT_VALLEY },
      ]},
      { name: "Kesses", towns: [
        { name: "Kesses", couriers: RIFT_VALLEY },
        { name: "Racecourse", couriers: RIFT_VALLEY },
        { name: "Cheptiret", couriers: RIFT_VALLEY },
      ]},
      { name: "Moiben", towns: [
        { name: "Moiben", couriers: RIFT_VALLEY },
        { name: "Sergoit", couriers: RIFT_VALLEY },
        { name: "Karuna", couriers: RIFT_VALLEY },
      ]},
      { name: "Soy", towns: [
        { name: "Soy", couriers: RIFT_VALLEY },
        { name: "Moi's Bridge", couriers: RIFT_VALLEY },
        { name: "Ziwa", couriers: RIFT_VALLEY },
      ]},
      { name: "Turbo", towns: [
        { name: "Turbo", couriers: RIFT_VALLEY },
        { name: "Kipkaren", couriers: RIFT_VALLEY },
        { name: "Tapsagoi", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== KAKAMEGA ===============
  {
    name: "Kakamega",
    subCounties: [
      { name: "Kakamega Central", towns: [
        { name: "Kakamega Town", couriers: WESTERN_KENYA },
        { name: "Lurambi", couriers: WESTERN_KENYA },
        { name: "Butsotso", couriers: WESTERN_KENYA },
      ]},
      { name: "Kakamega North", towns: [
        { name: "Malava", couriers: WESTERN_KENYA },
        { name: "Kabras", couriers: WESTERN_KENYA },
        { name: "Chemuche", couriers: WESTERN_KENYA },
      ]},
      { name: "Kakamega South", towns: [
        { name: "Shinyalu", couriers: WESTERN_KENYA },
        { name: "Khwisero", couriers: WESTERN_KENYA },
      ]},
      { name: "Kakamega East", towns: [
        { name: "Navakholo", couriers: WESTERN_KENYA },
        { name: "Mumias", couriers: WESTERN_KENYA },
      ]},
      { name: "Mumias East", towns: [
        { name: "Mumias Town", couriers: WESTERN_KENYA },
        { name: "East Wanga", couriers: WESTERN_KENYA },
      ]},
      { name: "Mumias West", towns: [
        { name: "Matungu", couriers: WESTERN_KENYA },
        { name: "Koyonzo", couriers: WESTERN_KENYA },
      ]},
      { name: "Butere", towns: [
        { name: "Butere", couriers: WESTERN_KENYA },
        { name: "Marama", couriers: WESTERN_KENYA },
      ]},
      { name: "Likuyani", towns: [
        { name: "Likuyani", couriers: WESTERN_KENYA },
        { name: "Nzoia", couriers: WESTERN_KENYA },
      ]},
      { name: "Lugari", towns: [
        { name: "Lugari", couriers: WESTERN_KENYA },
        { name: "Lumakanda", couriers: WESTERN_KENYA },
        { name: "Mautuma", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== BUNGOMA ===============
  {
    name: "Bungoma",
    subCounties: [
      { name: "Bungoma Central", towns: [
        { name: "Bungoma Town", couriers: WESTERN_KENYA },
        { name: "Musikoma", couriers: WESTERN_KENYA },
      ]},
      { name: "Bungoma East", towns: [
        { name: "Webuye", couriers: WESTERN_KENYA },
        { name: "Misikhu", couriers: WESTERN_KENYA },
      ]},
      { name: "Bungoma West", towns: [
        { name: "Sangalo", couriers: WESTERN_KENYA },
        { name: "Bokoli", couriers: WESTERN_KENYA },
      ]},
      { name: "Bungoma North", towns: [
        { name: "Chwele", couriers: WESTERN_KENYA },
        { name: "Tongaren", couriers: WESTERN_KENYA },
      ]},
      { name: "Bungoma South", towns: [
        { name: "Kanduyi", couriers: WESTERN_KENYA },
        { name: "Bukembe", couriers: WESTERN_KENYA },
      ]},
      { name: "Mt Elgon", towns: [
        { name: "Kapsokwony", couriers: G4S_ONLY },
        { name: "Cheptais", couriers: G4S_ONLY },
      ]},
      { name: "Sirisia", towns: [
        { name: "Sirisia", couriers: WESTERN_KENYA },
        { name: "Malakisi", couriers: WESTERN_KENYA },
      ]},
      { name: "Kabuchai", towns: [
        { name: "Kabuchai", couriers: WESTERN_KENYA },
        { name: "Chwele", couriers: WESTERN_KENYA },
      ]},
      { name: "Bumula", towns: [
        { name: "Bumula", couriers: WESTERN_KENYA },
        { name: "Khasoko", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== NYERI ===============
  {
    name: "Nyeri",
    subCounties: [
      { name: "Nyeri Central", towns: [
        { name: "Nyeri Town", couriers: CENTRAL_KENYA },
        { name: "Ruringu", couriers: CENTRAL_KENYA },
        { name: "Kamakwa", couriers: CENTRAL_KENYA },
      ]},
      { name: "Nyeri South", towns: [
        { name: "Othaya", couriers: CENTRAL_KENYA },
        { name: "Chinga", couriers: CENTRAL_KENYA },
        { name: "Mahiga", couriers: CENTRAL_KENYA },
      ]},
      { name: "Mathira East", towns: [
        { name: "Karatina", couriers: CENTRAL_KENYA },
        { name: "Magutu", couriers: CENTRAL_KENYA },
      ]},
      { name: "Mathira West", towns: [
        { name: "Kirimukuyu", couriers: CENTRAL_KENYA },
        { name: "Konyu", couriers: CENTRAL_KENYA },
      ]},
      { name: "Tetu", towns: [
        { name: "Tetu", couriers: CENTRAL_KENYA },
        { name: "Aguthi", couriers: CENTRAL_KENYA },
        { name: "Wamagana", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kieni East", towns: [
        { name: "Naro Moru", couriers: CENTRAL_KENYA },
        { name: "Narumoru", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kieni West", towns: [
        { name: "Endarasha", couriers: CENTRAL_KENYA },
        { name: "Mweiga", couriers: CENTRAL_KENYA },
        { name: "Mwiyogo", couriers: CENTRAL_KENYA },
      ]},
      { name: "Mukurweini", towns: [
        { name: "Mukurweini", couriers: CENTRAL_KENYA },
        { name: "Gikondi", couriers: CENTRAL_KENYA },
      ]},
    ]
  },

  // =============== MERU ===============
  {
    name: "Meru",
    subCounties: [
      { name: "Imenti Central", towns: [
        { name: "Meru Town", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Municipality", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Abothuguchi", couriers: [...EASTERN, "meru_shuttle"] },
      ]},
      { name: "Imenti North", towns: [
        { name: "Nkubu", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Kianjai", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Municipality", couriers: [...EASTERN, "meru_shuttle"] },
      ]},
      { name: "Imenti South", towns: [
        { name: "Nkubu", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Mitunguu", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Igoji", couriers: [...EASTERN, "meru_shuttle"] },
      ]},
      { name: "Tigania West", towns: [
        { name: "Kianjai", couriers: G4S_ONLY },
        { name: "Athwana", couriers: G4S_ONLY },
      ]},
      { name: "Tigania East", towns: [
        { name: "Mikinduri", couriers: G4S_ONLY },
        { name: "Kiguchwa", couriers: G4S_ONLY },
      ]},
      { name: "Tigania Central", towns: [
        { name: "Laare", couriers: G4S_ONLY },
        { name: "Muthara", couriers: G4S_ONLY },
      ]},
      { name: "Igembe North", towns: [
        { name: "Maua", couriers: G4S_ONLY },
        { name: "Antubochiu", couriers: G4S_ONLY },
      ]},
      { name: "Igembe Central", towns: [
        { name: "Athiru Gaiti", couriers: G4S_ONLY },
        { name: "Kangeta", couriers: G4S_ONLY },
      ]},
      { name: "Igembe South", towns: [
        { name: "Maua", couriers: G4S_ONLY },
        { name: "Igembe South", couriers: G4S_ONLY },
      ]},
      { name: "Buuri", towns: [
        { name: "Timau", couriers: G4S_ONLY },
        { name: "Kibirichia", couriers: G4S_ONLY },
        { name: "Ruiri", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== MURANGA ===============
  {
    name: "Muranga",
    subCounties: [
      { name: "Muranga Central", towns: [
        { name: "Muranga Town", couriers: CENTRAL_KENYA },
        { name: "Kimorori", couriers: CENTRAL_KENYA },
      ]},
      { name: "Muranga South", towns: [
        { name: "Makuyu", couriers: CENTRAL_KENYA },
        { name: "Maragua", couriers: CENTRAL_KENYA },
        { name: "Ichagaki", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kandara", towns: [
        { name: "Kandara", couriers: CENTRAL_KENYA },
        { name: "Ng'araria", couriers: CENTRAL_KENYA },
        { name: "Muruka", couriers: CENTRAL_KENYA },
      ]},
      { name: "Gatanga", towns: [
        { name: "Gatanga", couriers: CENTRAL_KENYA },
        { name: "Kariara", couriers: CENTRAL_KENYA },
        { name: "Gitugi", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kigumo", towns: [
        { name: "Kigumo", couriers: CENTRAL_KENYA },
        { name: "Kangari", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kangema", towns: [
        { name: "Kangema", couriers: CENTRAL_KENYA },
        { name: "Kanyenya-ini", couriers: CENTRAL_KENYA },
        { name: "Rwathia", couriers: CENTRAL_KENYA },
      ]},
      { name: "Mathioya", towns: [
        { name: "Kiriani", couriers: CENTRAL_KENYA },
        { name: "Gitugi", couriers: CENTRAL_KENYA },
        { name: "Kiru", couriers: CENTRAL_KENYA },
      ]},
    ]
  },

  // =============== KIRINYAGA ===============
  {
    name: "Kirinyaga",
    subCounties: [
      { name: "Kirinyaga Central", towns: [
        { name: "Kerugoya", couriers: CENTRAL_KENYA },
        { name: "Kutus", couriers: CENTRAL_KENYA },
        { name: "Inoi", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kirinyaga East", towns: [
        { name: "Baricho", couriers: CENTRAL_KENYA },
        { name: "Kianyaga", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kirinyaga West", towns: [
        { name: "Murinduko", couriers: CENTRAL_KENYA },
        { name: "Kagumo", couriers: CENTRAL_KENYA },
      ]},
      { name: "Mwea East", towns: [
        { name: "Wanguru", couriers: CENTRAL_KENYA },
        { name: "Tebere", couriers: CENTRAL_KENYA },
        { name: "Murinduko", couriers: CENTRAL_KENYA },
      ]},
      { name: "Mwea West", towns: [
        { name: "Kangai", couriers: CENTRAL_KENYA },
        { name: "Thiba", couriers: CENTRAL_KENYA },
      ]},
    ]
  },

  // =============== EMBU ===============
  {
    name: "Embu",
    subCounties: [
      { name: "Embu North", towns: [
        { name: "Embu Town", couriers: EASTERN },
        { name: "Runyenjes", couriers: EASTERN },
        { name: "Kanja", couriers: EASTERN },
      ]},
      { name: "Embu East", towns: [
        { name: "Runyenjes", couriers: EASTERN },
        { name: "Kagaari", couriers: EASTERN },
      ]},
      { name: "Embu West", towns: [
        { name: "Kianjokoma", couriers: EASTERN },
        { name: "Kithimu", couriers: EASTERN },
      ]},
      { name: "Mbeere North", towns: [
        { name: "Siakago", couriers: G4S_ONLY },
        { name: "Evurore", couriers: G4S_ONLY },
      ]},
      { name: "Mbeere South", towns: [
        { name: "Kiritiri", couriers: G4S_ONLY },
        { name: "Gachoka", couriers: G4S_ONLY },
        { name: "Kiambere", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== KITUI ===============
  {
    name: "Kitui",
    subCounties: [
      { name: "Kitui Central", towns: [
        { name: "Kitui Town", couriers: [...EASTERN, "mwingi_line"] },
        { name: "Miambani", couriers: EASTERN },
        { name: "Township", couriers: EASTERN },
      ]},
      { name: "Kitui East", towns: [
        { name: "Zombe", couriers: G4S_ONLY },
        { name: "Mutitu", couriers: G4S_ONLY },
      ]},
      { name: "Kitui West", towns: [
        { name: "Kabati", couriers: EASTERN },
        { name: "Matinyani", couriers: EASTERN },
      ]},
      { name: "Kitui South", towns: [
        { name: "Mutomo", couriers: G4S_ONLY },
        { name: "Ikutha", couriers: G4S_ONLY },
      ]},
      { name: "Kitui Rural", towns: [
        { name: "Kwavonza", couriers: G4S_ONLY },
        { name: "Kanyangi", couriers: G4S_ONLY },
      ]},
      { name: "Mwingi Central", towns: [
        { name: "Mwingi Town", couriers: [...G4S_ONLY, "mwingi_line"] },
        { name: "Central", couriers: G4S_ONLY },
      ]},
      { name: "Mwingi North", towns: [
        { name: "Kyuso", couriers: G4S_ONLY },
        { name: "Mumoni", couriers: G4S_ONLY },
      ]},
      { name: "Mwingi West", towns: [
        { name: "Migwani", couriers: G4S_ONLY },
        { name: "Kiomo", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== SIAYA ===============
  {
    name: "Siaya",
    subCounties: [
      { name: "Siaya", towns: [
        { name: "Siaya Town", couriers: WESTERN_KENYA },
        { name: "Alego", couriers: WESTERN_KENYA },
      ]},
      { name: "Gem", towns: [
        { name: "Yala", couriers: WESTERN_KENYA },
        { name: "Wagai", couriers: WESTERN_KENYA },
      ]},
      { name: "Bondo", towns: [
        { name: "Bondo Town", couriers: WESTERN_KENYA },
        { name: "Usenge", couriers: WESTERN_KENYA },
      ]},
      { name: "Rarieda", towns: [
        { name: "Madiany", couriers: WESTERN_KENYA },
        { name: "Asembo", couriers: WESTERN_KENYA },
      ]},
      { name: "Ugunja", towns: [
        { name: "Ugunja", couriers: WESTERN_KENYA },
        { name: "Ukwala", couriers: WESTERN_KENYA },
      ]},
      { name: "Ugenya", towns: [
        { name: "Ukwala", couriers: WESTERN_KENYA },
        { name: "Sidindi", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== HOMA BAY ===============
  {
    name: "Homa Bay",
    subCounties: [
      { name: "Homa Bay Town", towns: [
        { name: "Homa Bay Town", couriers: WESTERN_KENYA },
        { name: "Arujo", couriers: WESTERN_KENYA },
      ]},
      { name: "Rachuonyo North", towns: [
        { name: "Oyugis", couriers: WESTERN_KENYA },
        { name: "Kendu Bay", couriers: WESTERN_KENYA },
      ]},
      { name: "Rachuonyo East", towns: [
        { name: "Kasipul", couriers: WESTERN_KENYA },
      ]},
      { name: "Rachuonyo South", towns: [
        { name: "Kabondo", couriers: WESTERN_KENYA },
        { name: "Kasipul", couriers: WESTERN_KENYA },
      ]},
      { name: "Karachuonyo", towns: [
        { name: "Kendu Bay", couriers: WESTERN_KENYA },
        { name: "Kanyaluo", couriers: WESTERN_KENYA },
      ]},
      { name: "Mbita", towns: [
        { name: "Mbita", couriers: G4S_ONLY },
        { name: "Rusinga Island", couriers: G4S_ONLY },
        { name: "Mfangano Island", couriers: G4S_ONLY },
      ]},
      { name: "Suba South", towns: [
        { name: "Gwassi", couriers: G4S_ONLY },
      ]},
      { name: "Ndhiwa", towns: [
        { name: "Ndhiwa", couriers: WESTERN_KENYA },
        { name: "Riana", couriers: WESTERN_KENYA },
      ]},
      { name: "Rangwe", towns: [
        { name: "Rangwe", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== MIGORI ===============
  {
    name: "Migori",
    subCounties: [
      { name: "Migori", towns: [
        { name: "Migori Town", couriers: WESTERN_KENYA },
        { name: "Suna", couriers: WESTERN_KENYA },
      ]},
      { name: "Rongo", towns: [
        { name: "Rongo Town", couriers: WESTERN_KENYA },
        { name: "South Sakwa", couriers: WESTERN_KENYA },
      ]},
      { name: "Awendo", towns: [
        { name: "Awendo", couriers: WESTERN_KENYA },
      ]},
      { name: "Suna East", towns: [
        { name: "Suna", couriers: WESTERN_KENYA },
      ]},
      { name: "Suna West", towns: [
        { name: "Masara", couriers: WESTERN_KENYA },
        { name: "Wasimbete", couriers: WESTERN_KENYA },
      ]},
      { name: "Uriri", towns: [
        { name: "Uriri", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyatike", towns: [
        { name: "Karungu", couriers: G4S_ONLY },
        { name: "Muhuru Bay", couriers: G4S_ONLY },
      ]},
      { name: "Kuria East", towns: [
        { name: "Kegonga", couriers: G4S_ONLY },
      ]},
      { name: "Kuria West", towns: [
        { name: "Kehancha", couriers: WESTERN_KENYA },
        { name: "Isebania", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== TRANS NZOIA ===============
  {
    name: "Trans Nzoia",
    subCounties: [
      { name: "Trans Nzoia East", towns: [
        { name: "Kitale Town", couriers: RIFT_VALLEY },
        { name: "Cherangany", couriers: RIFT_VALLEY },
      ]},
      { name: "Trans Nzoia West", towns: [
        { name: "Endebess", couriers: RIFT_VALLEY },
        { name: "Matisi", couriers: RIFT_VALLEY },
        { name: "Kiminini", couriers: RIFT_VALLEY },
      ]},
      { name: "Kwanza", towns: [
        { name: "Kwanza", couriers: RIFT_VALLEY },
        { name: "Kapomboi", couriers: RIFT_VALLEY },
      ]},
      { name: "Saboti", towns: [
        { name: "Saboti", couriers: RIFT_VALLEY },
        { name: "Machewa", couriers: RIFT_VALLEY },
      ]},
      { name: "Kiminini", towns: [
        { name: "Kiminini", couriers: RIFT_VALLEY },
        { name: "Sikhendu", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== NANDI ===============
  {
    name: "Nandi",
    subCounties: [
      { name: "Nandi Hills", towns: [
        { name: "Nandi Hills", couriers: RIFT_VALLEY },
        { name: "Kapsabet", couriers: RIFT_VALLEY },
      ]},
      { name: "Nandi Central", towns: [
        { name: "Kapsabet Town", couriers: RIFT_VALLEY },
        { name: "Kobujoi", couriers: RIFT_VALLEY },
      ]},
      { name: "Nandi East", towns: [
        { name: "Nandi Hills", couriers: RIFT_VALLEY },
      ]},
      { name: "Nandi North", towns: [
        { name: "Kaiboi", couriers: RIFT_VALLEY },
        { name: "Mosoriot", couriers: RIFT_VALLEY },
      ]},
      { name: "Nandi South", towns: [
        { name: "Kaptumo", couriers: RIFT_VALLEY },
        { name: "Serem", couriers: RIFT_VALLEY },
      ]},
      { name: "Tinderet", towns: [
        { name: "Tinderet", couriers: RIFT_VALLEY },
        { name: "Songhor", couriers: RIFT_VALLEY },
      ]},
      { name: "Chesumei", towns: [
        { name: "Kapsabet", couriers: RIFT_VALLEY },
        { name: "Chemundu", couriers: RIFT_VALLEY },
      ]},
      { name: "Emgwen", towns: [
        { name: "Chepterwai", couriers: RIFT_VALLEY },
        { name: "Kipkaren", couriers: RIFT_VALLEY },
      ]},
      { name: "Mosop", towns: [
        { name: "Chepterwai", couriers: RIFT_VALLEY },
        { name: "Kabiyet", couriers: RIFT_VALLEY },
      ]},
      { name: "Aldai", towns: [
        { name: "Kobujoi", couriers: RIFT_VALLEY },
        { name: "Terik", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== KERICHO ===============
  {
    name: "Kericho",
    subCounties: [
      { name: "Kericho East", towns: [
        { name: "Kericho Town", couriers: RIFT_VALLEY },
        { name: "Ainamoi", couriers: RIFT_VALLEY },
      ]},
      { name: "Kericho West", towns: [
        { name: "Litein", couriers: RIFT_VALLEY },
        { name: "Kapkatet", couriers: RIFT_VALLEY },
      ]},
      { name: "Kipkelion East", towns: [
        { name: "Kipkelion", couriers: RIFT_VALLEY },
        { name: "Chilchila", couriers: RIFT_VALLEY },
      ]},
      { name: "Kipkelion West", towns: [
        { name: "Londiani", couriers: RIFT_VALLEY },
        { name: "Kedowa", couriers: RIFT_VALLEY },
      ]},
      { name: "Sigowet/Soin", towns: [
        { name: "Sigowet", couriers: RIFT_VALLEY },
        { name: "Soin", couriers: RIFT_VALLEY },
      ]},
      { name: "Belgut", towns: [
        { name: "Sosiot", couriers: RIFT_VALLEY },
        { name: "Kapsuser", couriers: RIFT_VALLEY },
      ]},
      { name: "Bureti", towns: [
        { name: "Litein", couriers: RIFT_VALLEY },
        { name: "Cheborge", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== BOMET ===============
  {
    name: "Bomet",
    subCounties: [
      { name: "Bomet Central", towns: [
        { name: "Bomet Town", couriers: RIFT_VALLEY },
        { name: "Silibwet", couriers: RIFT_VALLEY },
      ]},
      { name: "Bomet East", towns: [
        { name: "Longisa", couriers: RIFT_VALLEY },
        { name: "Kembu", couriers: RIFT_VALLEY },
      ]},
      { name: "Chepalungu", towns: [
        { name: "Sigor", couriers: RIFT_VALLEY },
        { name: "Chebunyo", couriers: RIFT_VALLEY },
      ]},
      { name: "Sotik", towns: [
        { name: "Sotik", couriers: RIFT_VALLEY },
        { name: "Ndanai", couriers: RIFT_VALLEY },
      ]},
      { name: "Konoin", towns: [
        { name: "Mogogosiek", couriers: RIFT_VALLEY },
        { name: "Kimulot", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== NAROK ===============
  {
    name: "Narok",
    subCounties: [
      { name: "Narok Town", towns: [
        { name: "Narok Town", couriers: [...RIFT_VALLEY, "naivasha_star"] },
        { name: "Ololulung'a", couriers: RIFT_VALLEY },
      ]},
      { name: "Narok East", towns: [
        { name: "Suswa", couriers: G4S_ONLY },
        { name: "Mosiro", couriers: G4S_ONLY },
      ]},
      { name: "Narok West", towns: [
        { name: "Naikarra", couriers: G4S_ONLY },
        { name: "Sogoo", couriers: G4S_ONLY },
      ]},
      { name: "Narok South", towns: [
        { name: "Kilgoris", couriers: G4S_ONLY },
        { name: "Lolgorian", couriers: G4S_ONLY },
        { name: "Angata Barikoi", couriers: G4S_ONLY },
      ]},
      { name: "Narok North", towns: [
        { name: "Ololulung'a", couriers: RIFT_VALLEY },
        { name: "Melili", couriers: G4S_ONLY },
      ]},
      { name: "Transmara West", towns: [
        { name: "Kilgoris", couriers: G4S_ONLY },
        { name: "Lolgorian", couriers: G4S_ONLY },
      ]},
      { name: "Transmara East", towns: [
        { name: "Kapsasian", couriers: G4S_ONLY },
        { name: "Emarti", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== NYANDARUA ===============
  {
    name: "Nyandarua",
    subCounties: [
      { name: "Ol Kalou", towns: [
        { name: "Ol Kalou", couriers: CENTRAL_KENYA },
        { name: "Karau", couriers: CENTRAL_KENYA },
      ]},
      { name: "Ol Joro Orok", towns: [
        { name: "Ol Joro Orok", couriers: CENTRAL_KENYA },
        { name: "Gathanji", couriers: CENTRAL_KENYA },
      ]},
      { name: "Ndaragwa", towns: [
        { name: "Ndaragwa", couriers: CENTRAL_KENYA },
        { name: "Shamata", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kipipiri", towns: [
        { name: "Wanjohi", couriers: CENTRAL_KENYA },
        { name: "North Kinangop", couriers: CENTRAL_KENYA },
      ]},
      { name: "Kinangop", towns: [
        { name: "Engineer", couriers: CENTRAL_KENYA },
        { name: "Njabini", couriers: CENTRAL_KENYA },
        { name: "South Kinangop", couriers: CENTRAL_KENYA },
      ]},
    ]
  },

  // =============== LAIKIPIA ===============
  {
    name: "Laikipia",
    subCounties: [
      { name: "Laikipia East", towns: [
        { name: "Nanyuki", couriers: CENTRAL_KENYA },
        { name: "Tigithi", couriers: CENTRAL_KENYA },
      ]},
      { name: "Laikipia West", towns: [
        { name: "Nyahururu", couriers: CENTRAL_KENYA },
        { name: "Rumuruti", couriers: CENTRAL_KENYA },
        { name: "Marmanet", couriers: G4S_ONLY },
      ]},
      { name: "Laikipia North", towns: [
        { name: "Dol Dol", couriers: G4S_ONLY },
        { name: "Mukogodo", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== BUSIA ===============
  {
    name: "Busia",
    subCounties: [
      { name: "Busia", towns: [
        { name: "Busia Town", couriers: WESTERN_KENYA },
        { name: "Burumba", couriers: WESTERN_KENYA },
      ]},
      { name: "Matayos", towns: [
        { name: "Matayos", couriers: WESTERN_KENYA },
        { name: "Mayenje", couriers: WESTERN_KENYA },
      ]},
      { name: "Teso North", towns: [
        { name: "Amagoro", couriers: WESTERN_KENYA },
        { name: "Malaba", couriers: WESTERN_KENYA },
      ]},
      { name: "Teso South", towns: [
        { name: "Amukura", couriers: WESTERN_KENYA },
        { name: "Chakol", couriers: WESTERN_KENYA },
      ]},
      { name: "Nambale", towns: [
        { name: "Nambale", couriers: WESTERN_KENYA },
        { name: "Budalangi", couriers: WESTERN_KENYA },
      ]},
      { name: "Butula", towns: [
        { name: "Butula", couriers: WESTERN_KENYA },
        { name: "Kingandole", couriers: WESTERN_KENYA },
      ]},
      { name: "Samia", towns: [
        { name: "Funyula", couriers: WESTERN_KENYA },
        { name: "Nangina", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== VIHIGA ===============
  {
    name: "Vihiga",
    subCounties: [
      { name: "Vihiga", towns: [
        { name: "Mbale Town", couriers: WESTERN_KENYA },
        { name: "Chavakali", couriers: WESTERN_KENYA },
      ]},
      { name: "Sabatia", towns: [
        { name: "Sabatia", couriers: WESTERN_KENYA },
        { name: "Wodanga", couriers: WESTERN_KENYA },
      ]},
      { name: "Hamisi", towns: [
        { name: "Hamisi", couriers: WESTERN_KENYA },
        { name: "Jepkoyai", couriers: WESTERN_KENYA },
      ]},
      { name: "Luanda", towns: [
        { name: "Luanda", couriers: WESTERN_KENYA },
        { name: "Emuhaya", couriers: WESTERN_KENYA },
      ]},
      { name: "Emuhaya", towns: [
        { name: "Emuhaya", couriers: WESTERN_KENYA },
        { name: "Esibila", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== ELGEYO MARAKWET ===============
  {
    name: "Elgeyo Marakwet",
    subCounties: [
      { name: "Marakwet East", towns: [
        { name: "Kapsowar", couriers: RIFT_VALLEY },
        { name: "Chesoi", couriers: G4S_ONLY },
      ]},
      { name: "Marakwet West", towns: [
        { name: "Kapcherop", couriers: G4S_ONLY },
        { name: "Kapyego", couriers: G4S_ONLY },
      ]},
      { name: "Keiyo North", towns: [
        { name: "Iten", couriers: RIFT_VALLEY },
        { name: "Kamariny", couriers: RIFT_VALLEY },
      ]},
      { name: "Keiyo South", towns: [
        { name: "Chepkorio", couriers: RIFT_VALLEY },
        { name: "Kaptarakwa", couriers: RIFT_VALLEY },
      ]},
    ]
  },

  // =============== BARINGO ===============
  {
    name: "Baringo",
    subCounties: [
      { name: "Baringo Central", towns: [
        { name: "Kabarnet", couriers: RIFT_VALLEY },
        { name: "Kapropita", couriers: RIFT_VALLEY },
      ]},
      { name: "Baringo North", towns: [
        { name: "Kabartonjo", couriers: G4S_ONLY },
        { name: "Barwessa", couriers: G4S_ONLY },
      ]},
      { name: "Baringo South", towns: [
        { name: "Marigat", couriers: G4S_ONLY },
        { name: "Ilchamus", couriers: G4S_ONLY },
      ]},
      { name: "Eldama Ravine", towns: [
        { name: "Eldama Ravine", couriers: RIFT_VALLEY },
        { name: "Mogotio", couriers: RIFT_VALLEY },
      ]},
      { name: "Mogotio", towns: [
        { name: "Mogotio", couriers: RIFT_VALLEY },
        { name: "Emining", couriers: G4S_ONLY },
      ]},
      { name: "Tiaty", towns: [
        { name: "Chemolingot", couriers: G4S_ONLY },
        { name: "Tangulbei", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== WEST POKOT ===============
  {
    name: "West Pokot",
    subCounties: [
      { name: "West Pokot", towns: [
        { name: "Kapenguria", couriers: ["g4s", "guardian_bus"] },
        { name: "Makutano", couriers: ["g4s", "guardian_bus"] },
      ]},
      { name: "Pokot South", towns: [
        { name: "Chepareria", couriers: G4S_ONLY },
        { name: "Lelan", couriers: G4S_ONLY },
      ]},
      { name: "Pokot North", towns: [
        { name: "Kacheliba", couriers: G4S_ONLY },
        { name: "Alale", couriers: G4S_ONLY },
      ]},
      { name: "Pokot Central", towns: [
        { name: "Sigor", couriers: G4S_ONLY },
        { name: "Lomut", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== TURKANA ===============
  {
    name: "Turkana",
    subCounties: [
      { name: "Turkana Central", towns: [
        { name: "Lodwar", couriers: ["g4s", "guardian_bus"] },
        { name: "Kanamkemer", couriers: G4S_ONLY },
      ]},
      { name: "Turkana East", towns: [
        { name: "Lokori", couriers: G4S_ONLY },
        { name: "Katilu", couriers: G4S_ONLY },
      ]},
      { name: "Turkana West", towns: [
        { name: "Kakuma", couriers: G4S_ONLY },
        { name: "Lokichoggio", couriers: G4S_ONLY },
      ]},
      { name: "Turkana North", towns: [
        { name: "Kibish", couriers: G4S_ONLY },
        { name: "Kaaleng", couriers: G4S_ONLY },
      ]},
      { name: "Turkana South", towns: [
        { name: "Lokichar", couriers: G4S_ONLY },
        { name: "Kainuk", couriers: G4S_ONLY },
      ]},
      { name: "Loima", towns: [
        { name: "Lorugum", couriers: G4S_ONLY },
        { name: "Turkwel", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== SAMBURU ===============
  {
    name: "Samburu",
    subCounties: [
      { name: "Samburu Central", towns: [
        { name: "Maralal", couriers: G4S_ONLY },
        { name: "Loosuk", couriers: G4S_ONLY },
      ]},
      { name: "Samburu East", towns: [
        { name: "Wamba", couriers: G4S_ONLY },
        { name: "Archer's Post", couriers: G4S_ONLY },
      ]},
      { name: "Samburu North", towns: [
        { name: "Baragoi", couriers: G4S_ONLY },
        { name: "South Horr", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== ISIOLO ===============
  {
    name: "Isiolo",
    subCounties: [
      { name: "Isiolo", towns: [
        { name: "Isiolo Town", couriers: [...G4S_ONLY, "tahmeed"] },
        { name: "Burat", couriers: G4S_ONLY },
      ]},
      { name: "Merti", towns: [
        { name: "Merti", couriers: G4S_ONLY },
        { name: "Cherab", couriers: G4S_ONLY },
      ]},
      { name: "Garbatulla", towns: [
        { name: "Garbatulla", couriers: G4S_ONLY },
        { name: "Sericho", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== MARSABIT ===============
  {
    name: "Marsabit",
    subCounties: [
      { name: "Saku", towns: [
        { name: "Marsabit Town", couriers: G4S_ONLY },
        { name: "Kargi", couriers: G4S_ONLY },
      ]},
      { name: "Laisamis", towns: [
        { name: "Laisamis", couriers: G4S_ONLY },
        { name: "Korr", couriers: G4S_ONLY },
        { name: "Logologo", couriers: G4S_ONLY },
      ]},
      { name: "North Horr", towns: [
        { name: "North Horr", couriers: G4S_ONLY },
        { name: "Loiyangalani", couriers: G4S_ONLY },
        { name: "Illeret", couriers: G4S_ONLY },
      ]},
      { name: "Moyale", towns: [
        { name: "Moyale", couriers: G4S_ONLY },
        { name: "Sololo", couriers: G4S_ONLY },
        { name: "Uran", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== GARISSA ===============
  {
    name: "Garissa",
    subCounties: [
      { name: "Garissa Township", towns: [
        { name: "Garissa Town", couriers: NORTH_EASTERN },
        { name: "Bura", couriers: G4S_ONLY },
      ]},
      { name: "Balambala", towns: [
        { name: "Balambala", couriers: G4S_ONLY },
        { name: "Danyere", couriers: G4S_ONLY },
      ]},
      { name: "Lagdera", towns: [
        { name: "Modogashe", couriers: G4S_ONLY },
        { name: "Benane", couriers: G4S_ONLY },
      ]},
      { name: "Dadaab", towns: [
        { name: "Dadaab", couriers: G4S_ONLY },
        { name: "Dertu", couriers: G4S_ONLY },
      ]},
      { name: "Fafi", towns: [
        { name: "Bura", couriers: G4S_ONLY },
        { name: "Jarajila", couriers: G4S_ONLY },
      ]},
      { name: "Ijara", towns: [
        { name: "Ijara", couriers: G4S_ONLY },
        { name: "Hulugho", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== WAJIR ===============
  {
    name: "Wajir",
    subCounties: [
      { name: "Wajir East", towns: [
        { name: "Wajir Town", couriers: NORTH_EASTERN },
        { name: "Khorof Harar", couriers: G4S_ONLY },
      ]},
      { name: "Wajir North", towns: [
        { name: "Bute", couriers: G4S_ONLY },
        { name: "Korondile", couriers: G4S_ONLY },
      ]},
      { name: "Wajir South", towns: [
        { name: "Habaswein", couriers: G4S_ONLY },
        { name: "Diff", couriers: G4S_ONLY },
      ]},
      { name: "Wajir West", towns: [
        { name: "Griftu", couriers: G4S_ONLY },
        { name: "Eldas", couriers: G4S_ONLY },
      ]},
      { name: "Eldas", towns: [
        { name: "Eldas", couriers: G4S_ONLY },
        { name: "Wargudud", couriers: G4S_ONLY },
      ]},
      { name: "Tarbaj", towns: [
        { name: "Tarbaj", couriers: G4S_ONLY },
        { name: "Sarman", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== MANDERA ===============
  {
    name: "Mandera",
    subCounties: [
      { name: "Mandera East", towns: [
        { name: "Mandera Town", couriers: NORTH_EASTERN },
        { name: "Arabia", couriers: G4S_ONLY },
      ]},
      { name: "Mandera North", towns: [
        { name: "Rhamu", couriers: G4S_ONLY },
        { name: "Ashabito", couriers: G4S_ONLY },
      ]},
      { name: "Mandera South", towns: [
        { name: "Elwak", couriers: G4S_ONLY },
        { name: "Wargadud", couriers: G4S_ONLY },
      ]},
      { name: "Mandera West", towns: [
        { name: "Takaba", couriers: G4S_ONLY },
        { name: "Dandu", couriers: G4S_ONLY },
      ]},
      { name: "Banissa", towns: [
        { name: "Banissa", couriers: G4S_ONLY },
        { name: "Kiliwehiri", couriers: G4S_ONLY },
      ]},
      { name: "Lafey", towns: [
        { name: "Lafey", couriers: G4S_ONLY },
        { name: "Alango Gof", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== TANA RIVER ===============
  {
    name: "Tana River",
    subCounties: [
      { name: "Garsen", towns: [
        { name: "Garsen", couriers: COASTAL },
        { name: "Kipini", couriers: G4S_ONLY },
        { name: "Witu", couriers: G4S_ONLY },
      ]},
      { name: "Galole", towns: [
        { name: "Hola", couriers: COASTAL },
        { name: "Bura", couriers: G4S_ONLY },
      ]},
      { name: "Bura", towns: [
        { name: "Bura", couriers: G4S_ONLY },
        { name: "Bangale", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== LAMU ===============
  {
    name: "Lamu",
    subCounties: [
      { name: "Lamu East", towns: [
        { name: "Lamu Town", couriers: [...COASTAL, "dreamliner"] },
        { name: "Faza", couriers: G4S_ONLY },
        { name: "Kiunga", couriers: G4S_ONLY },
      ]},
      { name: "Lamu West", towns: [
        { name: "Mpeketoni", couriers: COASTAL },
        { name: "Witu", couriers: G4S_ONLY },
        { name: "Hindi", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== TAITA TAVETA ===============
  {
    name: "Taita Taveta",
    subCounties: [
      { name: "Taveta", towns: [
        { name: "Taveta Town", couriers: COASTAL },
        { name: "Mwatate", couriers: COASTAL },
      ]},
      { name: "Wundanyi", towns: [
        { name: "Wundanyi", couriers: COASTAL },
        { name: "Werugha", couriers: G4S_ONLY },
      ]},
      { name: "Mwatate", towns: [
        { name: "Mwatate", couriers: COASTAL },
        { name: "Bura", couriers: G4S_ONLY },
      ]},
      { name: "Voi", towns: [
        { name: "Voi Town", couriers: COASTAL },
        { name: "Mbololo", couriers: COASTAL },
        { name: "Sagalla", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== MAKUENI ===============
  {
    name: "Makueni",
    subCounties: [
      { name: "Makueni", towns: [
        { name: "Wote", couriers: EASTERN },
        { name: "Kathonzweni", couriers: EASTERN },
      ]},
      { name: "Kibwezi East", towns: [
        { name: "Mtito Andei", couriers: EASTERN },
        { name: "Kibwezi", couriers: EASTERN },
      ]},
      { name: "Kibwezi West", towns: [
        { name: "Makindu", couriers: EASTERN },
        { name: "Emali", couriers: EASTERN },
      ]},
      { name: "Kilome", towns: [
        { name: "Mukaa", couriers: EASTERN },
        { name: "Kasikeu", couriers: EASTERN },
      ]},
      { name: "Kaiti", towns: [
        { name: "Kilungu", couriers: EASTERN },
        { name: "Ilima", couriers: EASTERN },
      ]},
      { name: "Mbooni", towns: [
        { name: "Tawa", couriers: EASTERN },
        { name: "Tulimani", couriers: EASTERN },
      ]},
    ]
  },

  // =============== THARAKA NITHI ===============
  {
    name: "Tharaka Nithi",
    subCounties: [
      { name: "Chuka/Igambang'ombe", towns: [
        { name: "Chuka", couriers: [...EASTERN, "meru_shuttle"] },
        { name: "Igambang'ombe", couriers: EASTERN },
      ]},
      { name: "Maara", towns: [
        { name: "Mwimbi", couriers: EASTERN },
        { name: "Chogoria", couriers: EASTERN },
      ]},
      { name: "Tharaka North", towns: [
        { name: "Gatunga", couriers: G4S_ONLY },
        { name: "Mukothima", couriers: G4S_ONLY },
      ]},
      { name: "Tharaka South", towns: [
        { name: "Marimanti", couriers: G4S_ONLY },
        { name: "Nkondi", couriers: G4S_ONLY },
      ]},
    ]
  },

  // =============== KISII ===============
  {
    name: "Kisii",
    subCounties: [
      { name: "Kisii Central", towns: [
        { name: "Kisii Town", couriers: WESTERN_KENYA },
        { name: "Mosocho", couriers: WESTERN_KENYA },
      ]},
      { name: "Kisii South", towns: [
        { name: "Suneka", couriers: WESTERN_KENYA },
        { name: "Masimba", couriers: WESTERN_KENYA },
      ]},
      { name: "Bobasi", towns: [
        { name: "Ogembo", couriers: WESTERN_KENYA },
        { name: "Gesusu", couriers: WESTERN_KENYA },
      ]},
      { name: "Bomachoge Borabu", towns: [
        { name: "Nyamira", couriers: WESTERN_KENYA },
      ]},
      { name: "Bomachoge Chache", towns: [
        { name: "Kenyenya", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyaribari Chache", towns: [
        { name: "Kisii", couriers: WESTERN_KENYA },
        { name: "Keumbu", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyaribari Masaba", towns: [
        { name: "Masimba", couriers: WESTERN_KENYA },
      ]},
      { name: "Kitutu Chache North", towns: [
        { name: "Marani", couriers: WESTERN_KENYA },
      ]},
      { name: "Kitutu Chache South", towns: [
        { name: "Nyamarambe", couriers: WESTERN_KENYA },
      ]},
      { name: "South Mugirango", towns: [
        { name: "Etago", couriers: WESTERN_KENYA },
        { name: "Tabaka", couriers: WESTERN_KENYA },
      ]},
    ]
  },

  // =============== NYAMIRA ===============
  {
    name: "Nyamira",
    subCounties: [
      { name: "Nyamira", towns: [
        { name: "Nyamira Town", couriers: WESTERN_KENYA },
        { name: "Ekerenyo", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyamira North", towns: [
        { name: "Gesima", couriers: WESTERN_KENYA },
      ]},
      { name: "Nyamira South", towns: [
        { name: "Manga", couriers: WESTERN_KENYA },
      ]},
      { name: "Borabu", towns: [
        { name: "Nyansiongo", couriers: WESTERN_KENYA },
      ]},
      { name: "Manga", towns: [
        { name: "Manga", couriers: WESTERN_KENYA },
        { name: "Kemera", couriers: WESTERN_KENYA },
      ]},
      { name: "Masaba North", towns: [
        { name: "Rigoma", couriers: WESTERN_KENYA },
      ]},
    ]
  },
];

// Get all carriers serving a county
export const getCarriersForCounty = (countyName: string): Carrier[] => {
  return CARRIERS.filter(c => 
    c.regions.includes("nationwide") || c.regions.includes(countyName)
  );
};

// Helper function to get delivery fee based on courier and distance
export const getDeliveryFee = (county: string, carrierId: string): number => {
  const carrier = CARRIERS.find(c => c.id === carrierId);
  if (!carrier) return 300;
  
  // Nairobi is cheapest
  if (county === "Nairobi") return carrier.baseFee;
  
  // Nearby counties
  const nearbyCounties = ["Kiambu", "Machakos", "Kajiado"];
  if (nearbyCounties.includes(county)) return carrier.baseFee + 50;
  
  // Medium distance
  const mediumCounties = ["Nakuru", "Nyeri", "Meru", "Muranga", "Kirinyaga", "Embu", "Nyandarua"];
  if (mediumCounties.includes(county)) return carrier.baseFee + 100;
  
  // Coastal counties
  const coastalCounties = ["Mombasa", "Kilifi", "Kwale", "Tana River", "Lamu", "Taita Taveta"];
  if (coastalCounties.includes(county)) return carrier.baseFee + 200;
  
  // Remote counties
  const remoteCounties = ["Turkana", "Marsabit", "Mandera", "Wajir", "Garissa", "Samburu", "West Pokot"];
  if (remoteCounties.includes(county)) return carrier.baseFee + 350;
  
  // Far counties
  return carrier.baseFee + 150;
};

// Get estimated delivery days
export const getEstimatedDays = (county: string, carrierId: string): number => {
  const carrier = CARRIERS.find(c => c.id === carrierId);
  if (!carrier) return 5;
  
  // Nairobi same/next day
  if (county === "Nairobi") return carrier.estimatedDays;
  
  // Nearby counties
  const nearbyCounties = ["Kiambu", "Machakos", "Kajiado"];
  if (nearbyCounties.includes(county)) return carrier.estimatedDays + 1;
  
  // Remote counties
  const remoteCounties = ["Turkana", "Marsabit", "Mandera", "Wajir", "Garissa", "Samburu"];
  if (remoteCounties.includes(county)) return carrier.estimatedDays + 5;
  
  return carrier.estimatedDays + 2;
};

// Get carrier type label
export const getCarrierTypeLabel = (type: Carrier['type']): string => {
  switch (type) {
    case 'courier': return 'Courier Service';
    case 'matatu': return 'Matatu Sacco';
    case 'bus': return 'Bus Company';
  }
};

// Get carrier by ID
export const getCarrierById = (id: string): Carrier | undefined => {
  return CARRIERS.find(c => c.id === id);
};
