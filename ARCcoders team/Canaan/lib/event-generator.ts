// Using the specific Palestinian historical event data provided
export function generateHistoricalEvent() {
  return {
    title: "Palestinian Peasants in Tiberias Score a Rare Success Against Zionist Land Acquisition",
    date: "8 December 1900 - 11 November 1901",
    location: "Tiberias, Ottoman Palestine",
    outcome: "Sale abrogated by Istanbul",

    // Story broken into connected elements from the actual description
    storyElements: [
      {
        text: "Ottoman Council approves land sale to Narcisse Leven",
        category: "decision",
        position: { x: 200, y: 150 },
        style: {
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          color: "#333",
          width: 220,
          height: 70,
          edgeColor: "#fcb69f",
        },
        options: [
          "Ottoman Council approves land sale to Narcisse Leven",
          "Ottoman Council permits land transfer to Narcisse Leven",
          "Ottoman Council authorizes land purchase by Narcisse Leven",
          "Ottoman Council sanctions land acquisition to Narcisse Leven",
        ],
      },
      {
        text: "Leven acquires 31,500 dunams from Sursock family",
        category: "acquisition",
        position: { x: 500, y: 100 },
        style: {
          background: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
          color: "#333",
          width: 200,
          height: 70,
          edgeColor: "#d299c2",
        },
        options: [
          "Leven acquires 31,500 dunams from Sursock family",
          "Leven purchases 31,500 dunams from Sursock family",
          "Leven obtains 31,500 dunams from Sursock family",
          "Leven secures 31,500 dunams from Sursock family",
        ],
      },
      {
        text: "Palestinian peasants from Lubya and Abbadiyya harass JCA surveyors",
        category: "resistance",
        position: { x: 750, y: 200 },
        style: {
          background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
          color: "#333",
          width: 240,
          height: 80,
          edgeColor: "#66a6ff",
        },
        options: [
          "Palestinian peasants from Lubya and Abbadiyya harass JCA surveyors",
          "Palestinian farmers from Lubya and Abbadiyya obstruct JCA surveyors",
          "Palestinian villagers from Lubya and Abbadiyya disrupt JCA surveyors",
          "Palestinian tenants from Lubya and Abbadiyya interfere with JCA surveyors",
        ],
      },
      {
        text: "Amin Arslan (qa'im maqam) supports peasant protests",
        category: "support",
        position: { x: 600, y: 350 },
        style: {
          background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
          color: "#333",
          width: 220,
          height: 70,
          edgeColor: "#ff9a9e",
        },
        options: [
          "Amin Arslan (qa'im maqam) supports peasant protests",
          "Amin Arslan (subdistrict commissioner) backs peasant protests",
          "Amin Arslan (qa'im maqam) endorses peasant protests",
          "Amin Arslan (district official) champions peasant protests",
        ],
      },
      {
        text: "Istanbul abrogates the land sale",
        category: "resolution",
        position: { x: 350, y: 400 },
        style: {
          background: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
          color: "#333",
          width: 180,
          height: 60,
          edgeColor: "#fad0c4",
        },
        options: [
          "Istanbul abrogates the land sale",
          "Istanbul cancels the land sale",
          "Istanbul revokes the land sale",
          "Istanbul nullifies the land sale",
        ],
      },
      {
        text: "Settlements expand (1901-1904) causing further clashes",
        category: "consequence",
        position: { x: 150, y: 300 },
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          width: 220,
          height: 70,
          edgeColor: "#667eea",
        },
        options: [
          "Settlements expand (1901-1904) causing further clashes",
          "Colonies grow (1901-1904) creating additional conflicts",
          "Settlements increase (1901-1904) leading to more disputes",
          "Colonies spread (1901-1904) resulting in continued clashes",
        ],
      },
    ],

    // Connections between story elements showing relationships
    storyConnections: [
      { from: 0, to: 1, relationship: "enables", color: "#fcb69f" },
      { from: 1, to: 2, relationship: "triggers", color: "#d299c2" },
      { from: 2, to: 3, relationship: "gains", color: "#66a6ff" },
      { from: 3, to: 4, relationship: "leads to", color: "#ff9a9e" },
      { from: 4, to: 5, relationship: "but results in", color: "#fad0c4" },
      { from: 0, to: 5, relationship: "ultimately causes", color: "#667eea" },
    ],

    // Context information
    tags: ["Popular action", "Colonization"],
    actors: ["Palestine Non-Governmental", "Ottoman Empire Governmental", "Zionists Non-Governmental"],
    locations: ["Ottoman Empire", "Palestine"],
    related_places: [{ type: "Place", name: "Lubya" }],

    // Multiple choice options for context
    dateOptions: [
      "8 December 1900 - 11 November 1901",
      "8 December 1900 - 11 October 1901",
      "10 December 1900 - 11 November 1901",
      "8 November 1900 - 11 November 1901",
    ],
    locationOptions: [
      "Tiberias, Ottoman Palestine",
      "Tiberias, Ottoman Syria",
      "Safed, Ottoman Palestine",
      "Haifa, Ottoman Palestine",
    ],
    outcomeOptions: [
      "Sale abrogated by Istanbul",
      "Sale cancelled by Istanbul",
      "Sale rejected by Istanbul",
      "Sale revoked by Istanbul",
    ],
  }
}
