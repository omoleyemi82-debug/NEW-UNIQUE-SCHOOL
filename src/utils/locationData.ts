export interface CountryConfig {
  name: string;
  code: string;
  phoneLength: number;
  phonePlaceholder: string;
}

// 1. Countries list in alphabetical order
export const countriesList: CountryConfig[] = [
  { name: "Canada", code: "+1", phoneLength: 10, phonePlaceholder: "416 555 0199" },
  { name: "Ghana", code: "+233", phoneLength: 9, phonePlaceholder: "20 123 4567" },
  { name: "Nigeria", code: "+234", phoneLength: 10, phonePlaceholder: "803 123 4567" },
  { name: "United Kingdom", code: "+44", phoneLength: 10, phonePlaceholder: "7911 123456" },
  { name: "United States", code: "+1", phoneLength: 10, phonePlaceholder: "212 555 0199" }
];

// 2. States list per country
export const countryStatesMap: Record<string, string[]> = {
  "Canada": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", 
    "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
  ],
  "Ghana": [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", 
    "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"
  ],
  "Nigeria": [
    "Abia", "Adamawa", "Akwa Ibom", "Anmabra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe", "Imo", 
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ].sort(),
  "United Kingdom": [
    "England", "Northern Ireland", "Scotland", "Wales"
  ],
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ]
};

// 3. Districts / Counties / LGAs map per State
export const stateDistrictsMap: Record<string, string[]> = {
  // Nigeria - Lagos LGAs (as exact user request lists)
  "Lagos": [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", 
    "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", 
    "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
  ],
  "FCT Abuja": ["Municipal", "Bwari", "Gwagwalada", "Kuye", "Kwali", "Abaji"],
  "Oyo": ["Akinyele", "Atiba", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Bonny", "Eleme", "Okrika", "Asari-Toru", "Akuku-Toru", "Degema", "Opobo-Nkoro", "Andoni"],
  "Kano": ["Kano Municipal", "Fagge", "Dala", "Gwale", "Nassarawa", "Tarauni", "Ungogo", "Kumbotso"],
  "Kwara": ["Ilorin West", "Ilorin East", "Ilorin South", "Offa", "Edu", "Baruten", "Asa", "Kaiama"],
  "Ogun": ["Abeokuta South", "Abeokuta North", "Ijebu Ode", "Sagamu", "Ado-Odo/Ota", "Ifo", "Ewekoro", "Obafemi Owode"],
  "Anmabra": ["Awka South", "Awka North", "Onitsha North", "Onitsha South", "Nnewi North", "Nnewi South", "Idemili North", "Idemili South", "Aguata"],
  "Enugu": ["Enugu North", "Enugu South", "Enugu East", "Nsukka", "Udi", "Oji River", "Awgu"],
  "Delta": ["Oshimili South", "Oshimili North", "Warri South", "Warri North", "Warri South West", "Uvwie", "Ughelli North", "Ughelli South", "Aniocha South", "Aniocha North"],
  "Edo": ["Oredo", "Egor", "Ikpoba Okha", "Esan West", "Esan Central", "Esan North East", "Etsako West", "Etsako East"],
  
  // Fallback for other Nigerian states (to make select reliable)
  "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umunneochi"],
  "Adamawa": ["Yola North", "Yola South", "Girei", "Mubi North", "Mubi South", "Numan", "Michika"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak", "Ikot Abasi", "Etinan"],
  "Bauchi": ["Bauchi", "Katagum", "Misau", "Jama'are", "Ningí", "Dass", "Alkaleri"],
  "Bayelsa": ["Yenagoa", "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw"],
  "Benue": ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya", "Ador", "Ogbadibo"],
  "Borno": ["Maiduguri", "Jere", "Biu", "Askira/Uba", "Bama", "Chibok", "Gwoza", "Monguno"],
  "Cross River": ["Calabar Municipal", "Calabar South", "Akpabuyo", "Odukpani", "Akamkpa", "Biase", "Yakurr", "Obubra", "Ikom", "Ogoja", "Obudu"],
  "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Izzi", "Ezza North", "Ezza South", "Ohaozara"],
  "Ekiti": ["Ado Ekiti", "Ikere", "Oye", "Aiyekire", "Efon", "Ekiti East", "Ekiti West", "Ijero", "Ikole"],
  "Gombe": ["Gombe", "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  "Imo": ["Owerri Municipal", "Owerri North", "Owerri West", "Orlu", "Okigwe", "Mbaitoli", "Ikeduru", "Oguta", "Mbaise"],
  "Jigawa": ["Dutse", "Hadejia", "Kazaure", "Gumel", "Ringim", "Birnin Kudu", "Babura"],
  "Kaduna": ["Kaduna North", "Kaduna South", "Chikun", "Igabi", "Zaria", "Sabon Gari", "Jema'a"],
  "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma", "Mani", "Kankia"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Jega", "Gwandu"],
  "Kogi": ["Lokoja", "Okene", "Kabba/Bunu", "Idah", "Dekina", "Adavi", "Ajaokuta"],
  "Nasarawa": ["Lafia", "Keffi", "Nasarawa", "Karu", "Akwanga", "Wamba", "Doma"],
  "Niger": ["Minna", "Bida", "Suleja", "Kontagora", "Chanchaga", "Bosso", "Mokwa"],
  "Ondo": ["Akure South", "Akure North", "Ondo West", "Owo", "Ikare", "Okitipupa", "Ile Oluji"],
  "Osun": ["Osogbo", "Ile-Ife", "Ilesa East", "Ilesa West", "Ede North", "Ede South", "Iwo", "Ila"],
  "Plateau": ["Jos North", "Jos South", "Jos East", "Bukuru", "Pankshin", "Shendam", "Mangu"],
  "Sokoto": ["Sokoto North", "Sokoto South", "Wamako", "Gwadabawa", "Wurno", "Shagari"],
  "Taraba": ["Jalingo", "Wukari", "Sardauna", "Bali", "Gashaka", "Donga"],
  "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam", "Bade"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Maradun", "Shinkafi"],

  // USA States Counties
  "California": ["Los Angeles County", "San Diego County", "Orange County", "Santa Clara County", "Alameda County", "Sacramento County", "San Francisco County"],
  "New York": ["New York County", "Kings County", "Queens County", "Bronx County", "Richmond County", "Nassau County", "Suffolk County", "Erie County"],
  "Texas": ["Harris County", "Dallas County", "Tarrant County", "Bexar County", "Travis County", "Collin County", "Denton County", "El Paso County"],
  "Florida": ["Miami-Dade County", "Broward County", "Palm Beach County", "Hillsborough County", "Orange County", "Duval County", "Pinellas County"],
  "Illinois": ["Cook County", "DuPage County", "Lake County", "Will County", "Kane County", "McHenry County"],
  "Pennsylvania": ["Philadelphia County", "Allegheny County", "Montgomery County", "Bucks County", "Delaware County"],
  "Ohio": ["Franklin County", "Cuyahoga County", "Hamilton County", "Summit County", "Montgomery County"],
  "Georgia": ["Fulton County", "Gwinnett County", "Cobb County", "DeKalb County", "Chatham County"],
  "North Carolina": ["Wake County", "Mecklenburg County", "Guilford County", "Forsyth County", "Cumberland County"],
  "Michigan": ["Wayne County", "Oakland County", "Macomb County", "Kent County", "Genesee County"],

  // Other USA states fallback
  "Alabama": ["Jefferson County", "Mobile County", "Madison County"],
  "Alaska": ["Anchorage Municipality", "Fairbanks North Star Borough"],
  "Arizona": ["Maricopa County", "Pima County", "Pinal County"],
  "Arkansas": ["Pulaski County", "Benton County"],
  "Colorado": ["Denver County", "El Paso County", "Arapahoe County"],
  "Connecticut": ["Fairfield County", "Hartford County", "New Haven County"],
  "Delaware": ["New Castle County", "Kent County"],
  "Hawaii": ["Honolulu County", "Hawaii County"],
  "Idaho": ["Ada County", "Canyon County"],
  "Indiana": ["Marion County", "Lake County"],
  "Iowa": ["Polk County", "Linn County"],
  "Kansas": ["Johnson County", "Sedgwick County"],
  "Kentucky": ["Jefferson County", "Fayette County"],
  "Louisiana": ["East Baton Rouge Parish", "Orleans Parish"],
  "Maine": ["Cumberland County", "York County"],
  "Maryland": ["Montgomery County", "Prince George's County"],
  "Massachusetts": ["Middlesex County", "Worcester County", "Essex County"],
  "Minnesota": ["Hennepin County", "Ramsey County"],
  "Mississippi": ["Hinds County", "Harrison County"],
  "Missouri": ["St. Louis County", "Jackson County"],
  "Montana": ["Yellowstone County", "Missoula County"],
  "Nebraska": ["Douglas County", "Lancaster County"],
  "Nevada": ["Clark County", "Washoe County"],
  "New Hampshire": ["Hillsborough County", "Rockingham County"],
  "New Jersey": ["Bergen County", "Essex County", "Middlesex County"],
  "New Mexico": ["Bernalillo County", "Doña Ana County"],
  "North Dakota": ["Cass County", "Burleigh County"],
  "Oklahoma": ["Oklahoma County", "Tulsa County"],
  "Oregon": ["Multnomah County", "Washington County"],
  "Rhode Island": ["Providence County", "Kent County"],
  "South Carolina": ["Greenville County", "Charleston County"],
  "South Dakota": ["Minnehaha County", "Pennington County"],
  "Tennessee": ["Shelby County", "Davidson County", "Knox County"],
  "Utah": ["Salt Lake County", "Utah County"],
  "Vermont": ["Chittenden County", "Rutland County"],
  "Virginia": ["Fairfax County", "Virginia Beach City"],
  "Washington": ["King County", "Pierce County", "Snohomosh County"],
  "West Virginia": ["Kanawha County", "Berkeley County"],
  "Wisconsin": ["Milwaukee County", "Dane County"],
  "Wyoming": ["Laramie County", "Natrona County"],

  // Canada Provinces Districts
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Windsor"],
  "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay"],
  "British Columbia": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Coquitlam", "Kelowna", "Abbotsford", "Victoria"],
  "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Wood Buffalo", "St. Albert"],
  "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
  "Nova Scotia": ["Halifax Regional", "Sydney/Cape Breton", "Truro", "New Glasgow"],
  "New Brunswick": ["Moncton", "Saint John", "Fredericton", "Dieppe", "Riverview"],
  "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
  "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South"],
  "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],

  // UK Countries Districts/Counties
  "England": ["Greater London", "Greater Manchester", "West Midlands", "West Yorkshire", "Merseyside", "South Yorkshire", "Kent", "Essex", "Hampshire", "Surrey", "Hertfordshire"],
  "Scotland": ["Glasgow City", "City of Edinburgh", "Fife", "North Lanarkshire", "South Lanarkshire", "Aberdeenshire", "Highland", "Dundee City", "West Lothian"],
  "Wales": ["Cardiff", "Swansea", "Rhondda Cynon Taf", "Vale of Glamorgan", "Carmarthenshire", "Newport", "Caerphilly", "Flintshire"],
  "Northern Ireland": ["Belfast", "Derry and Strabane", "Armagh Banbridge and Craigavon", "Lisburn and Castlereagh", "Newry Mourne and Down", "Mid and East Antrim"],

  // Ghana Regions Districts
  "Greater Accra": ["Accra Metropolitan", "Tema Metropolitan", "Ga West Municipal", "Ledzokuku-Krowor Municipal", "La Dade-Kotopon Municipal", "Adentan Municipal"],
  "Ashanti": ["Kumasi Metropolitan", "Obuasi Municipal", "Ejisu Municipal", "Mampong Municipal", "Asokore Mampong Municipal", "Offinso Municipal"],
  "Western": ["Sekondi-Takoradi Metropolitan", "Tarkwa-Nsuaem Municipal", "Nzema East Municipal", "Prestea-Huni Valley", "Ahanta West"],
  "Eastern": ["New Juaben Municipal", "East Akim Municipal", "Suhum Municipal", "Asuogyaman District", "Lower Manya Krobo Municipal"],
  "Northern": ["Tamale Metropolitan", "Savelugu Municipal", "Yendi Municipal", "Tolon District", "Kumbungu District"],
  "Volta": ["Ho Municipal", "Keta Municipal", "Hohoe Municipal", "Ket Municipal", "Kpando Municipal"],
  "Central": ["Cape Coast Metropolitan", "Effutu Municipal", "Agona West Municipal", "Komenda-Edina-Eguafo-Abirem Municipal", "Mfantsiman Municipal"],
  "Upper East": ["Bolgatanga Municipal", "Bawku Municipal", "Kasena-Nankana Municipal", "Bongo District"],
  "Upper West": ["Wa Municipal", "Lawra District", "Jirapa District", "Nandom District"],
  "Bono": ["Sunyani Municipal", "Berekum Municipal", "Dormaa Central Municipal", "Wenchi Municipal"],
  "Bono East": ["Techiman Municipal", "Kintampo North Municipal", "Nkoranza South Municipal"],
  "Ahafo": ["Asunafo North Municipal", "Tano North Municipal", "Tano South Municipal"],
  "Savannah": ["Damongo Municipal", "East Gonja Municipal", "Bole District"],
  "North East": ["East Mamprusi Municipal", "West Mamprusi Municipal", "Chereponi District"],
  "Oti": ["Dambai Municipal", "Nkwanta South Municipal", "Kadjebi District"],
  "Western North": ["Sefwi Wiawso Municipal", "Bibiani-Anhwiaso-Bekwai Municipal"]
};

// Return fallback districts/counties if state matches list dynamically
export function getDistrictsForState(stateName: string): string[] {
  if (stateDistrictsMap[stateName]) {
    return stateDistrictsMap[stateName];
  }
  // Try case insensitive find
  const key = Object.keys(stateDistrictsMap).find(k => k.toLowerCase() === stateName.toLowerCase());
  return key ? stateDistrictsMap[key] : ["District 1", "District 2", "District 3", "District 4"];
}
