// lib/levels-data.ts

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  actualYear: number;
  actualCoordinates: [number, number]; // [latitude, longitude]
  location: string;
}

export interface Level {
  id: number;
  name: string;
  events: GameEvent[];
}

export const gameLevels: Level[] = [
  // Level 101: The Mandate Era
  {
    id: 101,
    name: "The Mandate Era",
    events: [
      { id: "l1-e1", name: "Balfour Declaration", description: "British statement supporting a 'national home for the Jewish people' in Palestine.", actualYear: 1917, actualCoordinates: [51.5072, -0.1276], location: "London, UK" },
      { id: "l1-e2", name: "Nebi Musa Riots", description: "Violent riots in Jerusalem following tensions at the Nebi Musa festival.", actualYear: 1920, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
      { id: "l1-e3", name: "Jaffa Riots", description: "Arab-Jewish violence beginning with a May Day parade in Jaffa.", actualYear: 1921, actualCoordinates: [32.0539, 34.7573], location: "Jaffa" },
      { id: "l1-e4", name: "Buraq Uprising", description: "Violent clashes at the Western Wall in Jerusalem over access and customs.", actualYear: 1929, actualCoordinates: [31.7767, 35.2345], location: "Western Wall, Jerusalem" },
      { id: "l1-e5", name: "Black Hand Rebellion", description: "Anti-Zionist and anti-British campaign led by Izz ad-Din al-Qassam.", actualYear: 1935, actualCoordinates: [32.7940, 35.2908], location: "Galilee" },
      { id: "l1-e6", name: "The Great Revolt", description: "A major nationalist uprising by Palestinian Arabs against British rule and mass Jewish immigration.", actualYear: 1936, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
      { id: "l1-e7", name: "Peel Commission Report", description: "A British Royal Commission that recommended the partition of Palestine.", actualYear: 1937, actualCoordinates: [51.5072, -0.1276], location: "London, UK" },
      { id: "l1-e8", name: "White Paper of 1939", description: "A British policy paper that limited Jewish immigration to Palestine.", actualYear: 1939, actualCoordinates: [51.5072, -0.1276], location: "London, UK" },
      { id: "l1-e9", name: "King David Hotel Bombing", description: "An attack by the Irgun on the British administrative headquarters.", actualYear: 1946, actualCoordinates: [31.7744, 35.2219], location: "Jerusalem" },
      { id: "l1-e10", name: "UN Partition Plan", description: "The UN General Assembly passes Resolution 181, recommending the partition of Mandatory Palestine.", actualYear: 1947, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
    ]
  },
  // Level 102: The Nakba & Aftermath
  {
    id: 102,
    name: "The Nakba & Aftermath",
    events: [
      { id: "l2-e1", name: "Deir Yassin Massacre", description: "A pivotal event where over 100 Palestinian villagers were killed.", actualYear: 1948, actualCoordinates: [31.7900, 35.1717], location: "Deir Yassin" },
      { id: "l2-e2", name: "The Nakba", description: "The mass displacement and dispossession of Palestinians during the 1948 Arab-Israeli war.", actualYear: 1948, actualCoordinates: [32.8184, 34.9892], location: "Haifa" },
      { id: "l2-e3", name: "Lydda Death March", description: "The expulsion of 50,000-70,000 Palestinian Arabs from the towns of Lydda and Ramle.", actualYear: 1948, actualCoordinates: [31.9542, 34.8988], location: "Lydda (Lod)" },
      { id: "l2-e4", name: "Establishment of UNRWA", description: "The UN establishes the Relief and Works Agency for Palestine Refugees.", actualYear: 1949, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
      { id: "l2-e5", name: "Suez Crisis", description: "An invasion of Egypt by Israel, followed by the United Kingdom and France.", actualYear: 1956, actualCoordinates: [29.9737, 32.5263], location: "Suez Canal, Egypt" },
      { id: "l2-e6", name: "Founding of Fatah", description: "Yasser Arafat and others form the Fatah political and military organization.", actualYear: 1959, actualCoordinates: [25.276987, 55.296249], location: "Kuwait City, Kuwait" },
      { id: "l2-e7", name: "Founding of the PLO", description: "The Palestine Liberation Organization is formed in Jerusalem.", actualYear: 1964, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
      { id: "l2-e8", name: "Samu Incident", description: "A large Israeli military operation against the Jordanian-controlled village of Samu.", actualYear: 1966, actualCoordinates: [31.4286, 35.0689], location: "As-Samu" },
      { id: "l2-e9", name: "The Six-Day War", description: "Conflict leading to Israeli occupation of the West Bank, Gaza, Sinai, and Golan Heights.", actualYear: 1967, actualCoordinates: [31.5332, 34.4667], location: "Gaza Strip" },
      { id: "l2-e10", name: "Battle of Karameh", description: "An engagement between the IDF and combined forces of the PLO and the Jordanian Army.", actualYear: 1968, actualCoordinates: [31.9333, 35.5833], location: "Karameh, Jordan" },
    ]
  },
  // Level 103: Resistance and Exile
  {
    id: 103,
    name: "Resistance and Exile",
    events: [
        { id: "l3-e1", name: "Black September in Jordan", description: "A conflict fought between the PLO and the Jordanian Armed Forces.", actualYear: 1970, actualCoordinates: [31.9539, 35.9106], location: "Amman, Jordan" },
        { id: "l3-e2", name: "Munich Olympics Attack", description: "An attack during the 1972 Summer Olympics by the Black September group.", actualYear: 1972, actualCoordinates: [48.1351, 11.5820], location: "Munich, Germany" },
        { id: "l3-e3", name: "Yom Kippur War", description: "A coalition of Arab states led by Egypt and Syria launched a surprise attack on Israel.", actualYear: 1973, actualCoordinates: [30.5852, 32.2924], location: "Sinai Peninsula" },
        { id: "l3-e4", name: "Arafat at the UN", description: "Yasser Arafat addresses the UN General Assembly with his famous 'olive branch' speech.", actualYear: 1974, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
        { id: "l3-e5", name: "Land Day", description: "A day commemorating protests against the confiscation of land.", actualYear: 1976, actualCoordinates: [32.7940, 35.2908], location: "Galilee" },
        { id: "l3-e6", name: "Camp David Accords", description: "Agreements signed by Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin.", actualYear: 1978, actualCoordinates: [38.9072, -77.0369], location: "Washington, D.C." },
        { id: "l3-e7", name: "First Lebanon War", description: "Israel invades southern Lebanon.", actualYear: 1982, actualCoordinates: [33.8938, 35.5018], location: "Beirut, Lebanon" },
        { id: "l3-e8", name: "Sabra and Shatila Massacre", description: "The killing of civilians, mostly Palestinians and Lebanese Shiites, in Beirut.", actualYear: 1982, actualCoordinates: [33.8650, 35.5069], location: "Sabra and Shatila, Beirut" },
        { id: "l3-e9", name: "Hamas Founded", description: "Hamas is founded in Gaza by Sheikh Ahmed Yassin and others.", actualYear: 1987, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
        { id: "l3-e10", name: "First Intifada", description: "A sustained series of Palestinian protests and riots in the West Bank and Gaza Strip.", actualYear: 1987, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
    ]
  },
  // Level 104: The Peace Process
  {
    id: 104,
    name: "The Peace Process",
    events: [
        { id: "l4-e1", name: "Palestinian Declaration of Independence", description: "The PLO unilaterally declares the establishment of the State of Palestine.", actualYear: 1988, actualCoordinates: [36.8065, 10.1815], location: "Algiers, Algeria" },
        { id: "l4-e2", name: "Madrid Conference", description: "Peace conference to revive the Israeli-Palestinian peace process.", actualYear: 1991, actualCoordinates: [40.4168, -3.7038], location: "Madrid, Spain" },
        { id: "l4-e3", name: "Oslo I Accord", description: "The first direct, face-to-face agreement between Israel and the PLO.", actualYear: 1993, actualCoordinates: [38.9072, -77.0369], location: "Washington, D.C." },
        { id: "l4-e4", name: "Gaza–Jericho Agreement", description: "Agreement on Palestinian self-rule in Gaza and Jericho.", actualYear: 1994, actualCoordinates: [30.0444, 31.2357], location: "Cairo, Egypt" },
        { id: "l4-e5", name: "Israel–Jordan Peace Treaty", description: "A peace treaty normalizing relations between Israel and Jordan.", actualYear: 1994, actualCoordinates: [29.6104, 35.0117], location: "Arava Valley" },
        { id: "l4-e6", name: "Oslo II Accord", description: "The Interim Agreement on the West Bank and the Gaza Strip.", actualYear: 1995, actualCoordinates: [30.0444, 31.2357], location: "Taba, Egypt" },
        { id: "l4-e7", name: "PA Presidential Election", description: "Yasser Arafat is elected as the first President of the Palestinian National Authority.", actualYear: 1996, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
        { id: "l4-e8", name: "Hebron Protocol", description: "Agreement concerning the redeployment of Israeli military forces in Hebron.", actualYear: 1997, actualCoordinates: [31.5326, 35.0953], location: "Hebron" },
        { id: "l4-e9", name: "Wye River Memorandum", description: "An agreement negotiated to implement the earlier Interim Agreement.", actualYear: 1998, actualCoordinates: [38.9072, -77.0369], location: "Wye River, USA" },
        { id: "l4-e10", name: "Camp David Summit", description: "A summit between Bill Clinton, Ehud Barak, and Yasser Arafat which ended without an agreement.", actualYear: 2000, actualCoordinates: [39.6456, -77.4664], location: "Camp David, USA" },
    ]
  },
  // Level 105: The Second Intifada
  {
    id: 105,
    name: "The Second Intifada",
    events: [
        { id: "l5-e1", name: "Start of Second Intifada", description: "A period of intensified violence, which started in September 2000.", actualYear: 2000, actualCoordinates: [31.7780, 35.2354], location: "Al-Aqsa Compound, Jerusalem" },
        { id: "l5-e2", name: "Taba Summit", description: "Talks between Israel and the PA aimed at reaching a final status settlement.", actualYear: 2001, actualCoordinates: [29.4920, 34.9148], location: "Taba, Egypt" },
        { id: "l5-e3", name: "Beirut Summit (Arab Peace Initiative)", description: "The Arab League proposes a comprehensive peace plan.", actualYear: 2002, actualCoordinates: [33.8938, 35.5018], location: "Beirut, Lebanon" },
        { id: "l5-e4", name: "Operation Defensive Shield", description: "A large-scale Israeli military operation in the West Bank.", actualYear: 2002, actualCoordinates: [31.9074, 35.2073], location: "Jenin" },
        { id: "l5-e5", name: "Road Map for Peace", description: "A plan to resolve the conflict proposed by the Quartet on the Middle East.", actualYear: 2003, actualCoordinates: [38.9072, -77.0369], location: "Washington, D.C." },
        { id: "l5-e6", name: "Geneva Accord", description: "A draft Permanent Status Agreement to end the conflict.", actualYear: 2003, actualCoordinates: [46.2044, 6.1432], location: "Geneva, Switzerland" },
        { id: "l5-e7", name: "ICJ Wall Opinion", description: "The International Court of Justice issues an advisory opinion on the West Bank barrier.", actualYear: 2004, actualCoordinates: [52.0844, 4.3142], location: "The Hague, Netherlands" },
        { id: "l5-e8", name: "Death of Yasser Arafat", description: "The long-time leader of the PLO passes away.", actualYear: 2004, actualCoordinates: [48.8566, 2.3522], location: "Paris, France" },
        { id: "l5-e9", name: "Mahmoud Abbas Elected", description: "Mahmoud Abbas is elected President of the Palestinian National Authority.", actualYear: 2005, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
        { id: "l5-e10", name: "Gaza Disengagement", description: "Israel's unilateral withdrawal of all Israeli settlements from the Gaza Strip.", actualYear: 2005, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
    ]
  },
  // Level 106: Political Shifts
  {
    id: 106,
    name: "Political Shifts",
    events: [
      { id: "l6-e1", name: "Hamas Legislative Victory", description: "Hamas wins the Palestinian legislative election.", actualYear: 2006, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
      { id: "l6-e2", name: "Fatah–Hamas Conflict", description: "A period of armed conflict between Fatah and Hamas in the Gaza Strip.", actualYear: 2007, actualCoordinates: [31.5000, 34.4667], location: "Gaza City" },
      { id: "l6-e3", name: "Gaza Blockade Begins", description: "Egypt and Israel impose a land, air, and sea blockade on the Gaza Strip.", actualYear: 2007, actualCoordinates: [31.5332, 34.4667], location: "Gaza Strip" },
      { id: "l6-e4", name: "Annapolis Conference", description: "A Middle East peace conference held by the United States.", actualYear: 2007, actualCoordinates: [38.9784, -76.4922], location: "Annapolis, USA" },
      { id: "l6-e5", name: "Operation Cast Lead", description: "A three-week armed conflict in the Gaza Strip.", actualYear: 2008, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
      { id: "l6-e6", name: "Goldstone Report", description: "A UN Fact Finding Mission report on the Gaza Conflict.", actualYear: 2009, actualCoordinates: [46.2044, 6.1432], location: "Geneva, Switzerland" },
      { id: "l6-e7", name: "Gaza Flotilla Raid", description: "A military operation by Israel against six civilian ships of the 'Gaza Freedom Flotilla'.", actualYear: 2010, actualCoordinates: [32.7940, 34.9896], location: "International Waters" },
      { id: "l6-e8", name: "Fatah–Hamas Reconciliation Agreements", description: "A series of agreements aimed at ending the Fatah-Hamas rift.", actualYear: 2011, actualCoordinates: [30.0444, 31.2357], location: "Cairo, Egypt" },
      { id: "l6-e9", name: "Palestine joins UNESCO", description: "Palestine is admitted as a full member of UNESCO.", actualYear: 2011, actualCoordinates: [48.8566, 2.3522], location: "Paris, France" },
      { id: "l6-e10", name: "Operation Pillar of Defense", description: "An eight-day Israeli military operation in the Gaza Strip.", actualYear: 2012, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
    ]
  },
  // Level 107: Statehood and Recognition
  {
    id: 107,
    name: "Statehood and Recognition",
    events: [
      { id: "l7-e1", name: "Palestine UN non-member state", description: "The UN General Assembly grants Palestine non-member observer state status.", actualYear: 2012, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
      { id: "l7-e2", name: "Kerry's Peace Talks", description: "A nine-month period of intensive peace negotiations led by US Secretary of State John Kerry.", actualYear: 2013, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
      { id: "l7-e3", name: "Unity Government Formation", description: "Fatah and Hamas agree to form a national unity government.", actualYear: 2014, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
      { id: "l7-e4", name: "Operation Protective Edge", description: "A major military operation launched by Israel on the Gaza Strip.", actualYear: 2014, actualCoordinates: [31.5332, 34.4667], location: "Gaza Strip" },
      { id: "l7-e5", name: "Sweden Recognizes Palestine", description: "Sweden becomes the first major Western European country to recognize the State of Palestine.", actualYear: 2014, actualCoordinates: [59.3293, 18.0686], location: "Stockholm, Sweden" },
      { id: "l7-e6", name: "ICC Membership", description: "Palestine accedes to the Rome Statute, joining the International Criminal Court.", actualYear: 2015, actualCoordinates: [52.0844, 4.3142], location: "The Hague, Netherlands" },
      { id: "l7-e7", name: "Knife Intifada", description: "A period of stabbings, shootings, and vehicular attacks by Palestinians.", actualYear: 2015, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
      { id: "l7-e8", name: "UNESCO Hebron Resolution", description: "UNESCO designates Hebron's Old City as a Palestinian World Heritage site in danger.", actualYear: 2017, actualCoordinates: [50.0755, 14.4378], location: "Kraków, Poland" },
      { id: "l7-e9", name: "US Embassy Move", description: "The United States moves its embassy in Israel to Jerusalem.", actualYear: 2018, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
      { id: "l7-e10", name: "Great March of Return", description: "A series of protests at the Gaza-Israel border.", actualYear: 2018, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
    ]
  },
    // Level 108: Contemporary Issues
    {
        id: 108,
        name: "Contemporary Issues",
        events: [
            { id: "l8-e1", name: "Abraham Accords", description: "Normalization agreements between Israel and several Arab nations.", actualYear: 2020, actualCoordinates: [38.9072, -77.0369], location: "Washington, D.C." },
            { id: "l8-e2", name: "Sheikh Jarrah Protests", description: "Protests over planned evictions in the Sheikh Jarrah neighborhood.", actualYear: 2021, actualCoordinates: [31.7937, 35.2359], location: "Sheikh Jarrah, Jerusalem" },
            { id: "l8-e3", name: "2021 Israel–Palestine Crisis", description: "A major escalation of the conflict involving Gaza and widespread unrest.", actualYear: 2021, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
            { id: "l8-e4", name: "Shireen Abu Akleh Killed", description: "The killing of the veteran Al Jazeera journalist during an IDF raid.", actualYear: 2022, actualCoordinates: [32.4601, 35.2428], location: "Jenin" },
            { id: "l8-e5", name: "Operation Breaking Dawn", description: "A three-day conflict between Israel and Palestinian Islamic Jihad in Gaza.", actualYear: 2022, actualCoordinates: [31.5332, 34.4667], location: "Gaza Strip" },
            { id: "l8-e6", name: "2023 Al-Aqsa Clashes", description: "Clashes between Israeli police and Palestinians at the Al-Aqsa Compound.", actualYear: 2023, actualCoordinates: [31.7780, 35.2354], location: "Al-Aqsa Compound, Jerusalem" },
            { id: "l8-e7", name: "October 7th Attack", description: "A large-scale offensive launched by Hamas from the Gaza Strip.", actualYear: 2023, actualCoordinates: [31.3340, 34.4746], location: "Gaza Envelope" },
            { id: "l8-e8", name: "Israel-Hamas War", description: "Israel launches a major military operation in the Gaza Strip in response to the October 7th attack.", actualYear: 2023, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
            { id: "l8-e9", name: "ICJ Case against Israel", description: "South Africa files a case at the International Court of Justice, accusing Israel of genocide.", actualYear: 2024, actualCoordinates: [52.0844, 4.3142], location: "The Hague, Netherlands" },
            { id: "l8-e10", name: "ICC Arrest Warrants", description: "The Prosecutor of the International Criminal Court applies for arrest warrants for leaders of Hamas and Israel.", actualYear: 2024, actualCoordinates: [52.0844, 4.3142], location: "The Hague, Netherlands" },
        ]
    },
    // Level 109: Cultural Heritage
    {
        id: 109,
        name: "Cultural Heritage",
        events: [
            { id: "l9-e1", name: "Ghassan Kanafani's 'Men in the Sun'", description: "Publication of a seminal novel of Palestinian literature.", actualYear: 1963, actualCoordinates: [33.8938, 35.5018], location: "Beirut, Lebanon" },
            { id: "l9-e2", name: "Mahmoud Darwish's 'Identity Card'", description: "Darwish writes one of his most famous poems of defiance.", actualYear: 1964, actualCoordinates: [32.8184, 34.9892], location: "Haifa" },
            { id: "l9-e3", name: "Naji al-Ali Creates Handala", description: "The iconic cartoon character representing the Palestinian refugee is created.", actualYear: 1969, actualCoordinates: [25.276987, 55.296249], location: "Kuwait" },
            { id: "l9-e4", name: "Edward Said's 'Orientalism'", description: "Publication of a foundational text of postcolonial studies by the Palestinian-American academic.", actualYear: 1978, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
            { id: "l9-e5", name: "Elia Suleiman's 'Chronicle of a Disappearance'", description: "A critically acclaimed film exploring Palestinian identity wins an award at the Venice Film Festival.", actualYear: 1996, actualCoordinates: [45.4408, 12.3155], location: "Venice, Italy" },
            { id: "l9-e6", name: "Palestine National Orchestra Re-established", description: "The orchestra is re-established, performing both in Palestine and internationally.", actualYear: 2004, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
            { id: "l9-e7", name: "Battir's Ancient Terraces (UNESCO)", description: "The ancient irrigation terraces of Battir are recognized as a UNESCO World Heritage site.", actualYear: 2014, actualCoordinates: [31.7136, 35.1386], location: "Battir" },
            { id: "l9-e8", name: "The Idol' (Ya Tayr El Tayer)", description: "A film about the life of Palestinian singer Mohammed Assaf, winner of Arab Idol, is released.", actualYear: 2015, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
            { id: "l9-e9", name: "Palestinian Museum Opens", description: "A museum dedicated to Palestinian art, history and culture opens its doors.", actualYear: 2016, actualCoordinates: [31.9701, 35.2017], location: "Birzeit" },
            { id: "l9-e10", name: "Dabke Dance (UNESCO)", description: "The traditional Dabke dance is inscribed on the UNESCO list of Intangible Cultural Heritage.", actualYear: 2023, actualCoordinates: [48.8566, 2.3522], location: "Paris, France" },
        ]
    },
    // Level 110: The Diaspora
    {
        id: 110,
        name: "The Diaspora",
        events: [
            { id: "l10-e1", name: "Al-Wehdat Refugee Camp Established", description: "One of the largest Palestinian refugee camps is established in Jordan.", actualYear: 1955, actualCoordinates: [31.9328, 35.9427], location: "Amman, Jordan" },
            { id: "l10-e2", name: "Ein al-Hilweh Camp (Lebanon)", description: "The largest Palestinian refugee camp in Lebanon, becoming a major center for the diaspora.", actualYear: 1948, actualCoordinates: [33.5413, 35.3582], location: "Sidon, Lebanon" },
            { id: "l10-e3", name: "Yarmouk Camp (Syria)", description: "Establishment of the largest Palestinian refugee community in Syria.", actualYear: 1957, actualCoordinates: [33.4687, 36.3023], location: "Damascus, Syria" },
            { id: "l10-e4", name: "Palestinian Migration to the Gulf", description: "A significant wave of Palestinian professionals and laborers migrate to the Gulf states for work.", actualYear: 1960, actualCoordinates: [25.276987, 55.296249], location: "Kuwait / UAE / Qatar" },
            { id: "l10-e5", "name": "Palestinian Community in Chile", "description": "The Palestinian community in Chile, one of the largest outside the Middle East, becomes well-established.", "actualYear": 1950, "actualCoordinates": [-33.4489, -70.6693], "location": "Santiago, Chile" },
            { id: "l10-e6", name: "Expulsion from Kuwait", description: "Following the Gulf War, a large number of Palestinians are expelled from Kuwait.", actualYear: 1991, actualCoordinates: [29.3759, 47.9774], location: "Kuwait City, Kuwait" },
            { id: "l10-e7", name: "Right of Return (UN Res 194)", description: "The UN affirms the right of Palestinian refugees to return to their homes.", actualYear: 1948, actualCoordinates: [48.8566, 2.3522], location: "Paris, France" },
            { id: "l10-e8", "name": "Palestinian-American Community Growth", "description": "The Palestinian-American community grows significantly, establishing cultural and political organizations.", "actualYear": 1980, "actualCoordinates": [42.3601, -71.0589], "location": "USA (e.g., Detroit, Chicago)" },
            { id: "l10-e9", name: "Siege of Yarmouk Camp", description: "The Yarmouk refugee camp in Syria is besieged during the Syrian Civil War, leading to a humanitarian crisis.", actualYear: 2012, actualCoordinates: [33.4687, 36.3023], location: "Damascus, Syria" },
            { id: "l10-e10", name: "Palestinian Passport", description: "The Palestinian Authority begins issuing its own passports to citizens.", actualYear: 1995, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
        ]
    },
    // Level 111: Jerusalem
    {
        id: 111,
        name: "Jerusalem",
        events: [
            { id: "l11-e1", name: "Annexation of East Jerusalem", description: "Israel effectively annexes East Jerusalem following the Six-Day War.", actualYear: 1967, actualCoordinates: [31.771959, 35.217018], location: "East Jerusalem" },
            { id: "l11-e2", name: "Jerusalem Law", description: "The Israeli Knesset passes a basic law declaring united Jerusalem as the capital of Israel.", actualYear: 1980, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
            { id: "l11-e3", name: "Temple Mount / Haram al-Sharif Clashes", description: "Riots erupt after a visit by Ariel Sharon to the holy site, triggering the Second Intifada.", actualYear: 2000, actualCoordinates: [31.7780, 35.2354], location: "Al-Aqsa Compound" },
            { id: "l11-e4", name: "Construction of Separation Wall", description: "Construction of the West Bank barrier begins, significantly impacting Palestinian neighborhoods in Jerusalem.", actualYear: 2002, actualCoordinates: [31.8159, 35.2285], location: "Around Jerusalem" },
            { id: "l11-e5", name: "Gilo Settlement Expansion", description: "Significant expansion of the Gilo settlement in East Jerusalem is approved.", actualYear: 2011, actualCoordinates: [31.7317, 35.1878], location: "Gilo, Jerusalem" },
            { id: "l11-e6", name: "Al-Aqsa Mosque Protests (Metal Detectors)", description: "Major protests erupt after Israel installs metal detectors at the entrances to the Al-Aqsa compound.", actualYear: 2017, actualCoordinates: [31.7780, 35.2354], location: "Al-Aqsa Compound" },
            { id: "l11-e7", name: "US Recognizes Jerusalem as Capital", description: "The Trump administration formally recognizes Jerusalem as the capital of Israel and announces embassy move.", actualYear: 2017, actualCoordinates: [38.9072, -77.0369], location: "Washington, D.C." },
            { id: "l11-e8", name: "Damascus Gate Protests", description: "Protests and clashes at the Damascus Gate become a focal point of Palestinian resistance.", actualYear: 2021, actualCoordinates: [31.7818, 35.2307], location: "Damascus Gate, Jerusalem" },
            { id: "l11-e9", name: "Sheikh Jarrah Evictions", description: "Legal battles and protests over the threatened eviction of Palestinian families in Sheikh Jarrah intensify.", actualYear: 2021, actualCoordinates: [31.7937, 35.2359], location: "Sheikh Jarrah" },
            { id: "l11-e10", name: "Flag March Tensions", description: "The annual Israeli 'Flag March' through the Muslim Quarter of the Old City becomes a major point of tension.", actualYear: 2022, actualCoordinates: [31.7781, 35.2323], location: "Muslim Quarter, Jerusalem" },
        ]
    },
    // Level 112: International Diplomacy
    {
        id: 112,
        name: "International Diplomacy",
        events: [
            { id: "l12-e1", name: "UN Resolution 242", description: "Adopted after the Six-Day War, emphasizing the 'inadmissibility of the acquisition of territory by war'.", actualYear: 1967, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
            { id: "l12-e2", name: "Venice Declaration", description: "The European Economic Community calls for Palestinian self-determination.", actualYear: 1980, actualCoordinates: [45.4408, 12.3155], location: "Venice, Italy" },
            { id: "l12-e3", name: "UN Resolution 478", description: "The UN Security Council condemns Israel's 1980 Jerusalem Law.", actualYear: 1980, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
            { id: "l12-e4", name: "The Quartet on the Middle East", description: "The establishment of a foursome of nations and international entities involved in mediating the peace process.", actualYear: 2002, actualCoordinates: [40.4168, -3.7038], location: "Madrid, Spain" },
            { id: "l12-e5", name: "EU Differentiates between Israel and Settlements", description: "The EU issues guidelines to exclude Israeli entities in occupied territories from EU agreements.", actualYear: 2013, actualCoordinates: [50.8503, 4.3517], location: "Brussels, Belgium" },
            { id: "l12-e6", name: "Vatican Recognizes State of Palestine", description: "The Holy See formally recognizes the state of Palestine in a treaty.", actualYear: 2015, actualCoordinates: [41.9029, 12.4534], location: "Vatican City" },
            { id: "l12-e7", name: "UN Security Council Resolution 2334", description: "The resolution condemns Israeli settlement construction.", actualYear: 2016, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
            { id: "l12-e8", name: "Trump Peace Plan ('Deal of the Century')", description: "The Trump administration unveils its controversial peace plan for the Israeli-Palestinian conflict.", actualYear: 2020, actualCoordinates: [38.9072, -77.0369], location: "Washington, D.C." },
            { id: "l12-e9", name: "Ireland, Spain, Norway Recognize Palestine", description: "A coordinated move by three European countries to formally recognize the State of Palestine.", actualYear: 2024, actualCoordinates: [53.3498, -6.2603], location: "Dublin, Ireland" },
            { id: "l12-e10", name: "UN General Assembly Vote for Membership", description: "The UN General Assembly overwhelmingly backs a Palestinian bid for full UN membership.", actualYear: 2024, actualCoordinates: [40.7128, -74.0060], location: "New York, USA" },
        ]
    },
    // Level 113: Leaders and Figures
    {
        id: 113,
        name: "Leaders and Figures",
        events: [
            { id: "l13-e1", name: "Haj Amin al-Husseini", description: "Appointed Grand Mufti of Jerusalem, a prominent nationalist leader.", actualYear: 1921, actualCoordinates: [31.771959, 35.217018], location: "Jerusalem" },
            { id: "l13-e2", name: "Izz ad-Din al-Qassam", description: "A cleric and social reformer who led a resistance movement against British and Zionist rule.", actualYear: 1935, actualCoordinates: [32.8184, 34.9892], location: "Haifa" },
            { id: "l13-e3", name: "George Habash Founds PFLP", description: "The Popular Front for the Liberation of Palestine is founded by George Habash.", actualYear: 1967, actualCoordinates: [31.9539, 35.9106], location: "Amman, Jordan" },
            { id: "l13-e4", name: "Yasser Arafat Becomes PLO Chairman", description: "Yasser Arafat is elected as the Chairman of the Palestine Liberation Organization.", actualYear: 1969, actualCoordinates: [30.0444, 31.2357], location: "Cairo, Egypt" },
            { id: "l13-e5", name: "Leila Khaled Hijacking", description: "PFLP member Leila Khaled becomes an icon after hijacking TWA Flight 840.", actualYear: 1969, actualCoordinates: [41.0082, 28.9784], location: "Over Damascus, Syria" },
            { id: "l13-e6", name: "Hanan Ashrawi", description: "Serves as the official spokesperson of the Palestinian Delegation to the Middle East peace process.", actualYear: 1991, actualCoordinates: [40.4168, -3.7038], location: "Madrid, Spain" },
            { id: "l13-e7", name: "Marwan Barghouti", description: "A leader of the First and Second Intifadas, often seen as a symbol of the Palestinian struggle.", actualYear: 2002, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
            { id: "l13-e8", name: "Ismail Haniyeh Becomes PM", description: "Ismail Haniyeh of Hamas becomes Prime Minister of the Palestinian National Authority.", actualYear: 2006, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
            { id: "l13-e9", name: "Salam Fayyad's 'Fayyadism'", description: "Prime Minister Salam Fayyad pursues a state-building program in the West Bank.", actualYear: 2007, actualCoordinates: [31.9522, 35.2332], location: "Ramallah" },
            { id: "l13-e10", name: "Mohammed Deif ('The Guest')", description: "The supreme military commander of Hamas, known for masterminding military operations.", actualYear: 2023, actualCoordinates: [31.5000, 34.4667], location: "Gaza" },
        ]
    },
    // Level 114: Economic Life
    {
        id: 114,
        name: "Economic Life",
        events: [
            { id: "l14-e1", name: "Jaffa Oranges", description: "Jaffa becomes a major center for the export of its famous oranges, a key part of the Palestinian economy.", actualYear: 1930, actualCoordinates: [32.0539, 34.7573], location: "Jaffa" },
            { id: "l14-e2", name: "Hebron Glass & Ceramics", description: "The ancient craft of glass and ceramic production in Hebron is a significant local industry.", actualYear: 1950, actualCoordinates: [31.5326, 35.0953], location: "Hebron" },
            { id: "l14-e3", name: "Nablus Soap", description: "Nablus is renowned for its olive oil soap industry, a tradition dating back centuries.", actualYear: 1960, actualCoordinates: [32.2212, 35.2544], location: "Nablus" },
            { id: "l14-e4", name: "Paris Protocol", description: "A protocol governing the economic relationship between Israel and the Palestinian Authority.", actualYear: 1994, actualCoordinates: [48.8566, 2.3522], location: "Paris, France" },
            { id: "l14-e5", name: "Bethlehem's Tourism Industry", description: "Tourism, centered around religious sites like the Church of the Nativity, forms a vital part of the local economy.", actualYear: 1995, actualCoordinates: [31.7048, 35.2038], location: "Bethlehem" },
            { id: "l14-e6", name: "Gaza's Fishing Industry", description: "The fishing industry in Gaza faces severe restrictions due to the blockade.", actualYear: 2007, actualCoordinates: [31.5173, 34.4423], location: "Gaza Port" },
            { id: "l14-e7", name: "Rawabi City Construction", description: "The first planned city for Palestinians in the West Bank begins construction.", actualYear: 2010, actualCoordinates: [32.0042, 35.2217], location: "Rawabi" },
            { id: "l14-e8", name: "Palestinian Stock Exchange", description: "The PEX in Nablus operates as the only stock exchange in the Palestinian territories.", actualYear: 1995, actualCoordinates: [32.2212, 35.2544], location: "Nablus" },
            { id: "l14-e9", name: "Olive Harvest", description: "The annual olive harvest remains a cornerstone of the Palestinian agricultural economy and cultural identity.", actualYear: 2000, actualCoordinates: [32.1032, 35.1951], location: "West Bank" },
            { id: "l14-e10", name: "Gaza's Tunnel Economy", description: "A network of tunnels under the Gaza-Egypt border becomes a lifeline for goods during the blockade.", actualYear: 2008, actualCoordinates: [31.2942, 34.2562], location: "Rafah" },
        ]
    },
    // Level 115: Key Locations
    {
        id: 115,
        name: "Key Locations",
        events: [
            { id: "l15-e1", name: "Church of the Holy Sepulchre", description: "A major Christian pilgrimage site in the Old City of Jerusalem.", actualYear: 1950, actualCoordinates: [31.7785, 35.2298], location: "Jerusalem" },
            { id: "l15-e2", name: "Dome of the Rock", description: "An Islamic shrine located on the Temple Mount in the Old City of Jerusalem.", actualYear: 1960, actualCoordinates: [31.7780, 35.2354], location: "Jerusalem" },
            { id: "l15-e3", name: "Church of the Nativity", description: "The basilica in Bethlehem identified as the birthplace of Jesus.", actualYear: 1970, actualCoordinates: [31.7048, 35.2038], location: "Bethlehem" },
            { id: "l15-e4", name: "Ibrahimi Mosque / Cave of the Patriarchs", description: "A series of caves located in the heart of Hebron, a site of immense religious significance.", actualYear: 1980, actualCoordinates: [31.5248, 35.1108], location: "Hebron" },
            { id: "l15-e5", name: "Jericho", description: "One of the oldest continuously inhabited cities in the world.", actualYear: 1994, actualCoordinates: [31.8569, 35.4516], location: "Jericho" },
            { id: "l15-e6", name: "Qalandia Checkpoint", description: "A major checkpoint between Jerusalem and Ramallah, symbolizing the occupation.", actualYear: 2001, actualCoordinates: [31.8617, 35.2158], location: "Qalandia" },
            { id: "l15-e7", name: "Gaza's Great Omari Mosque", description: "The largest and oldest mosque in the Gaza Strip, located in Gaza City.", actualYear: 1990, actualCoordinates: [31.5042, 34.4622], location: "Gaza City" },
            { id: "l15-e8", name: "Birzeit University", description: "A leading Palestinian institution of higher education.", actualYear: 1975, actualCoordinates: [31.9701, 35.2017], location: "Birzeit" },
            { id: "l15-e9", name: "Acre (Akka)", description: "A historic walled port-city with continuous settlement from the Phoenician period.", actualYear: 1955, actualCoordinates: [32.9221, 35.0710], location: "Acre" },
            { id: "l15-e10", name: "Mar Saba Monastery", description: "A Greek Orthodox monastery overlooking the Kidron Valley in the West Bank.", actualYear: 1965, actualCoordinates: [31.7056, 35.3308], location: "Judean Desert" },
        ]
    }
];