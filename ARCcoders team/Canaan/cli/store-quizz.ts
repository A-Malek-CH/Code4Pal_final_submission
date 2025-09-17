import { supabase } from "./supabase";

const quizzes = [
	{
		event_id: "238d7c36-00c8-40a0-b894-970b9e8e5877",
		type: "quiz",
		game: {
			title: "Balfour Declaration Is Made",
			date: "November 2, 1917",
			location: "United Kingdom",
			outcome:
				"The British government pledges support for the establishment of a 'national home for the Jewish people' in Palestine.",
			storyElements: [
				{
					text: "During World War I, British Foreign Secretary Arthur Balfour sends a letter to Baron Rothschild, a leader of the British Jewish community.",
					category: "context",
					position: { x: 100, y: 200 },
					options: [
						"During World War I, British Foreign Secretary Arthur Balfour sends a letter to Baron Rothschild, a leader of the British Jewish community.",
						"Following the collapse of the Ottoman Empire, the League of Nations convenes to divide its territories.",
						"The United States declares its intention to mediate peace in the Middle East.",
						"Zionist leaders meet secretly with Ottoman officials to negotiate land purchases.",
					],
					correctAnswer:
						"During World War I, British Foreign Secretary Arthur Balfour sends a letter to Baron Rothschild, a leader of the British Jewish community.",
				},
				{
					text: "The letter, known as the Balfour Declaration, states that the British government views with favour the establishment of a national home for the Jewish people in Palestine.",
					category: "action",
					position: { x: 400, y: 100 },
					options: [
						"The letter, known as the Balfour Declaration, states that the British government views with favour the establishment of a national home for the Jewish people in Palestine.",
						"The letter demands the immediate withdrawal of all Ottoman forces from the Levant.",
						"The letter promises full independence to Arab leaders in exchange for their support in the war.",
						"The letter outlines a plan for joint British and French administration of the region.",
					],
					correctAnswer:
						"The letter, known as the Balfour Declaration, states that the British government views with favour the establishment of a national home for the Jewish people in Palestine.",
				},
				{
					text: "A crucial proviso in the declaration states that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities.",
					category: "detail",
					position: { x: 700, y: 200 },
					options: [
						"A crucial proviso in the declaration states that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities.",
						"The declaration sets a strict timeline of five years for the establishment of the national home.",
						"The letter specifies that the capital of the new entity will be Jerusalem.",
						"The declaration is conditioned on financial contributions from the Rothschild family.",
					],
					correctAnswer:
						"A crucial proviso in the declaration states that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities.",
				},
				{
					text: "The declaration becomes a foundational document for the Zionist movement and later shapes the controversial terms of the British Mandate for Palestine.",
					category: "legacy",
					position: { x: 400, y: 350 },
					options: [
						"The declaration becomes a foundational document for the Zionist movement and later shapes the controversial terms of the British Mandate for Palestine.",
						"The declaration is immediately rejected by the League of Nations and has little long-term effect.",
						"The declaration leads to a lasting alliance between Britain and the Ottoman Empire.",
						"The declaration is praised by Arab leaders as a step towards regional self-determination.",
					],
					correctAnswer:
						"The declaration becomes a foundational document for the Zionist movement and later shapes the controversial terms of the British Mandate for Palestine.",
				},
			],
			storyConnections: [
				{ from: 0, to: 1, relationship: "leads to" },
				{ from: 1, to: 2, relationship: "includes" },
				{ from: 2, to: 3, relationship: "results in" },
			],
			tags: ["Policy-Program"],
			actors: ["Arthur Balfour"],
			locations: ["United Kingdom"],
			related_places: [],
			dateOptions: [
				"November 2, 1917",
				"August 15, 1916",
				"May 14, 1920",
				"January 30, 1918",
			],
			locationOptions: ["United Kingdom", "Palestine", "France", "Egypt"],
			outcomeOptions: [
				"The British government pledges support for the establishment of a 'national home for the Jewish people' in Palestine.",
				"A formal treaty is signed, granting immediate independence to Palestine.",
				"The League of Nations grants Britain administrative control over the Suez Canal.",
				"An agreement is reached to partition Palestine into two separate states.",
			],
		},
	},
	{
		event_id: "00635da7-1037-4d30-8f9b-d6594566a919",
		type: "quiz",
		game: {
			title: "The Nakba (Palestinian Catastrophe)",
			date: "1947-1949",
			location: "Palestine",
			outcome:
				"The mass displacement and dispossession of over 700,000 Palestinians, creating a foundational and ongoing refugee crisis.",
			storyElements: [
				{
					text: "Following the 1947 UN Partition Plan for Palestine, a civil war erupts between Jewish and Arab communities, setting the stage for a major conflict.",
					category: "context",
					position: { x: 100, y: 200 },
					options: [
						"Following the 1947 UN Partition Plan for Palestine, a civil war erupts between Jewish and Arab communities, setting the stage for a major conflict.",
						"The British government decides to extend its Mandate in Palestine indefinitely.",
						"Arab and Jewish leaders sign a power-sharing agreement to prevent conflict.",
						"The Soviet Union invades the region to establish a military presence.",
					],
					correctAnswer:
						"Following the 1947 UN Partition Plan for Palestine, a civil war erupts between Jewish and Arab communities, setting the stage for a major conflict.",
				},
				{
					text: "Between December 1947 and 1949, during the 1948 Palestine War, over 700,000 Palestinians are displaced from their homes through flight and expulsion.",
					category: "action",
					position: { x: 400, y: 100 },
					options: [
						"Between December 1947 and 1949, during the 1948 Palestine War, over 700,000 Palestinians are displaced from their homes through flight and expulsion.",
						"A UN-led peacekeeping force successfully separates the warring factions, preventing displacement.",
						"The British army oversees an orderly transfer of power and relocates communities peacefully.",
						"Most of the fighting is confined to uninhabited desert areas, with minimal civilian impact.",
					],
					correctAnswer:
						"Between December 1947 and 1949, during the 1948 Palestine War, over 700,000 Palestinians are displaced from their homes through flight and expulsion.",
				},
				{
					text: "Hundreds of Palestinian villages and urban neighborhoods are depopulated and subsequently destroyed or resettled by the newly established State of Israel.",
					category: "consequence",
					position: { x: 700, y: 200 },
					options: [
						"Hundreds of Palestinian villages and urban neighborhoods are depopulated and subsequently destroyed or resettled by the newly established State of Israel.",
						"An international reconstruction fund is created to immediately rebuild all damaged villages.",
						"Refugees are granted the right to return to their homes as soon as the fighting stops.",
						"The land is designated as a UN-administered neutral zone.",
					],
					correctAnswer:
						"Hundreds of Palestinian villages and urban neighborhoods are depopulated and subsequently destroyed or resettled by the newly established State of Israel.",
				},
				{
					text: "The event, known as the 'Nakba' (Catastrophe), becomes a foundational element of Palestinian national identity and the origin of the unresolved 'right of return' issue.",
					category: "legacy",
					position: { x: 400, y: 350 },
					options: [
						"The event, known as the 'Nakba' (Catastrophe), becomes a foundational element of Palestinian national identity and the origin of the unresolved 'right of return' issue.",
						"The event is quickly forgotten and has little impact on future generations.",
						"The displacement leads to the complete assimilation of Palestinians into neighboring countries.",
						"A final peace treaty is signed in 1950, resolving all refugee claims.",
					],
					correctAnswer:
						"The event, known as the 'Nakba' (Catastrophe), becomes a foundational element of Palestinian national identity and the origin of the unresolved 'right of return' issue.",
				},
			],
			storyConnections: [
				{ from: 0, to: 1, relationship: "escalates into" },
				{ from: 1, to: 2, relationship: "results in" },
				{ from: 2, to: 3, relationship: "creates legacy of" },
			],
			tags: [],
			actors: [
				"Chaim Weizmann",
				"Haj Amin al-Husseini ",
				"Israel (State)",
				"League of Nations",
			],
			locations: ["Palestine"],
			related_places: [],
			dateOptions: ["1947-1949", "1956-1957", "1936-1939", "1967-1968"],
			locationOptions: ["Palestine", "Egypt", "Syria", "Jordan"],
			outcomeOptions: [
				"The mass displacement and dispossession of over 700,000 Palestinians, creating a foundational and ongoing refugee crisis.",
				"The successful implementation of the UN Partition Plan, creating two stable states.",
				"A long-term ceasefire that preserved the pre-war demographics and borders.",
				"The establishment of a single, secular state governed jointly by Arabs and Jews.",
			],
		},
	},
	{
		event_id: "acabba13-a296-4637-a172-6ae841186bf8",
		type: "quiz",
		game: {
			title: "Suez Crisis",
			date: "October 29 – November 7, 1956",
			location: "Egypt",
			outcome:
				"A political victory for Egypt, but a humiliating failure for Britain and France, marking the end of their era as global superpowers and increasing US/Soviet influence.",
			storyElements: [
				{
					text: "Egyptian President Gamal Abdel Nasser nationalizes the Suez Canal, transferring control from British and French interests to the Egyptian state.",
					category: "trigger",
					position: { x: 100, y: 200 },
					options: [
						"Egyptian President Gamal Abdel Nasser nationalizes the Suez Canal, transferring control from British and French interests to the Egyptian state.",
						"Egypt closes the Suez Canal to all international shipping indefinitely.",
						"The United States provides funding for Egypt to build a second canal parallel to the first.",
						"Britain and France voluntarily hand over control of the canal to the United Nations.",
					],
					correctAnswer:
						"Egyptian President Gamal Abdel Nasser nationalizes the Suez Canal, transferring control from British and French interests to the Egyptian state.",
				},
				{
					text: "In a secret agreement, Britain, France, and Israel conspire to launch a military intervention to retake the canal and depose Nasser.",
					category: "action",
					position: { x: 400, y: 100 },
					options: [
						"In a secret agreement, Britain, France, and Israel conspire to launch a military intervention to retake the canal and depose Nasser.",
						"The UN Security Council authorizes a multinational force to manage the canal.",
						"The Soviet Union provides Egypt with nuclear weapons for defense.",
						"Nasser agrees to internationalize the canal under a new treaty.",
					],
					correctAnswer:
						"In a secret agreement, Britain, France, and Israel conspire to launch a military intervention to retake the canal and depose Nasser.",
				},
				{
					text: "Despite military successes, the invasion is met with overwhelming international condemnation, especially from the United States and the Soviet Union.",
					category: "reaction",
					position: { x: 700, y: 200 },
					options: [
						"Despite military successes, the invasion is met with overwhelming international condemnation, especially from the United States and the Soviet Union.",
						"The invasion receives full backing from NATO, leading to a wider conflict.",
						"The United Nations remains neutral and refuses to intervene in the conflict.",
						"The Arab League launches a successful counter-invasion to support Egypt.",
					],
					correctAnswer:
						"Despite military successes, the invasion is met with overwhelming international condemnation, especially from the United States and the Soviet Union.",
				},
				{
					text: "Under immense financial pressure from the US and military threats from the USSR, the invading forces are forced to withdraw, solidifying Nasser's position as a hero of Arab nationalism.",
					category: "resolution",
					position: { x: 400, y: 350 },
					options: [
						"Under immense financial pressure from the US and military threats from the USSR, the invading forces are forced to withdraw, solidifying Nasser's position as a hero of Arab nationalism.",
						"The invading forces successfully occupy Egypt and install a new government.",
						"The conflict results in a long-term stalemate with the canal remaining closed for years.",
						"Britain and France annex the Canal Zone as a permanent military base.",
					],
					correctAnswer:
						"Under immense financial pressure from the US and military threats from the USSR, the invading forces are forced to withdraw, solidifying Nasser's position as a hero of Arab nationalism.",
				},
			],
			storyConnections: [
				{ from: 0, to: 1, relationship: "prompts" },
				{ from: 1, to: 2, relationship: "leads to" },
				{ from: 2, to: 3, relationship: "forces" },
			],
			tags: [],
			actors: [
				"Anthony Eden ",
				"France",
				"Gamal Abdel Nasser Nasser:",
				"Israel (State)",
			],
			locations: ["Egypt"],
			related_places: [],
			dateOptions: [
				"October 29 – November 7, 1956",
				"June 5–10, 1967",
				"October 6–25, 1973",
				"July 26, 1952",
			],
			locationOptions: ["Egypt", "Israel", "France", "United Kingdom"],
			outcomeOptions: [
				"A political victory for Egypt, but a humiliating failure for Britain and France, marking the end of their era as global superpowers and increasing US/Soviet influence.",
				"The successful re-establishment of international control over the Suez Canal under a UN mandate.",
				"The permanent division of Egypt into two separate states.",
				"A long and costly war that results in a military stalemate and no change in control of the canal.",
			],
		},
	},
	{
		event_id: "d2b17237-1053-4746-b61b-4e72873bdd38",
		type: "quiz",
		game: {
			title: "Oslo Accords",
			date: "September 13, 1993",
			location: "Norway, USA, and Egypt",
			outcome:
				"The creation of the Palestinian Authority with limited self-rule, but the failure to resolve final status issues, leading to the process eventually collapsing.",
			storyElements: [
				{
					text: "After decades of conflict, secret talks facilitated by Norway begin between Israel and the Palestine Liberation Organization (PLO).",
					category: "context",
					position: { x: 100, y: 200 },
					options: [
						"After decades of conflict, secret talks facilitated by Norway begin between Israel and the Palestine Liberation Organization (PLO).",
						"A major war breaks out, forcing both sides to the negotiating table.",
						"The United Nations imposes a peace plan that both parties are required to accept.",
						"A grassroots movement of citizens from both sides organizes a public peace conference.",
					],
					correctAnswer:
						"After decades of conflict, secret talks facilitated by Norway begin between Israel and the Palestine Liberation Organization (PLO).",
				},
				{
					text: "The process leads to a major breakthrough: The PLO officially recognizes the State of Israel, and Israel recognizes the PLO as the representative of the Palestinian people.",
					category: "breakthrough",
					position: { x: 400, y: 100 },
					options: [
						"The process leads to a major breakthrough: The PLO officially recognizes the State of Israel, and Israel recognizes the PLO as the representative of the Palestinian people.",
						"Both sides agree to a complete withdrawal of Israeli forces from all occupied territories immediately.",
						"The PLO disbands its organization in exchange for financial aid.",
						"Israel agrees to a 'one-state solution' with equal rights for all.",
					],
					correctAnswer:
						"The process leads to a major breakthrough: The PLO officially recognizes the State of Israel, and Israel recognizes the PLO as the representative of the Palestinian people.",
				},
				{
					text: "The accords create the Palestinian Authority (PA) for limited self-governance in the West Bank and Gaza, but defer contentious issues like Jerusalem, settlements, and borders.",
					category: "agreement",
					position: { x: 700, y: 200 },
					options: [
						"The accords create the Palestinian Authority (PA) for limited self-governance in the West Bank and Gaza, but defer contentious issues like Jerusalem, settlements, and borders.",
						"The accords establish a fully independent Palestinian state with defined borders.",
						"The agreements create a joint Israeli-Palestinian government to rule the entire region.",
						"The accords focus solely on economic cooperation, avoiding political issues.",
					],
					correctAnswer:
						"The accords create the Palestinian Authority (PA) for limited self-governance in the West Bank and Gaza, but defer contentious issues like Jerusalem, settlements, and borders.",
				},
				{
					text: "Despite initial hope and a Nobel Peace Prize, the process is derailed by extremist violence, the assassination of Yitzhak Rabin, and ultimately collapses, leaving core issues unresolved.",
					category: "legacy",
					position: { x: 400, y: 350 },
					options: [
						"Despite initial hope and a Nobel Peace Prize, the process is derailed by extremist violence, the assassination of Yitzhak Rabin, and ultimately collapses, leaving core issues unresolved.",
						"The accords lead to a lasting and permanent peace treaty within the planned five-year period.",
						"The agreements are unanimously supported by all factions on both sides.",
						"The process is successfully concluded with the establishment of two peaceful states side-by-side.",
					],
					correctAnswer:
						"Despite initial hope and a Nobel Peace Prize, the process is derailed by extremist violence, the assassination of Yitzhak Rabin, and ultimately collapses, leaving core issues unresolved.",
				},
			],
			storyConnections: [
				{ from: 0, to: 1, relationship: "results in" },
				{ from: 1, to: 2, relationship: "establishes" },
				{ from: 2, to: 3, relationship: "ultimately" },
			],
			tags: [],
			actors: [
				"Israel (State)",
				"Mahmoud Abbas ",
				"Palestine Liberation Organization ",
				"United States of America (USA)",
				"Yasser Arafat ",
				"Yitzhak Rabin",
			],
			locations: ["Norway", "United States"],
			related_places: [],
			dateOptions: [
				"September 13, 1993",
				"November 4, 1995",
				"July 25, 2000",
				"December 9, 1987",
			],
			locationOptions: [
				"Norway, USA, and Egypt",
				"Geneva, Switzerland",
				"Madrid, Spain",
				"London, United Kingdom",
			],
			outcomeOptions: [
				"The creation of the Palestinian Authority with limited self-rule, but the failure to resolve final status issues, leading to the process eventually collapsing.",
				"A final, comprehensive peace treaty that established a sovereign Palestinian state.",
				"An agreement for Israel to annex the West Bank in exchange for peace with its neighbors.",
				"The complete dissolution of the PLO and its replacement with a new leadership council.",
			],
		},
	},
	{
		event_id: "f482a3c3-3bfd-44e8-bf35-f111d559beb4",
		type: "quiz",
		game: {
			title: "Gaza War (2023)",
			date: "October 7, 2023 – Present",
			location: "Gaza Strip and Israel",
			outcome:
				"A severe humanitarian crisis in Gaza, mass displacement, and an ongoing, intense military conflict with major international diplomatic repercussions.",
			storyElements: [
				{
					text: "On October 7, 2023, Hamas launches an unprecedented surprise attack on Israel, involving thousands of rockets and a large-scale ground infiltration.",
					category: "trigger",
					position: { x: 100, y: 200 },
					options: [
						"On October 7, 2023, Hamas launches an unprecedented surprise attack on Israel, involving thousands of rockets and a large-scale ground infiltration.",
						"Israel initiates a pre-emptive strike on Gaza to dismantle rocket sites.",
						"A UN-brokered ceasefire is signed, leading to a period of calm.",
						"Egypt opens its border with Gaza, allowing for free movement of people and goods.",
					],
					correctAnswer:
						"On October 7, 2023, Hamas launches an unprecedented surprise attack on Israel, involving thousands of rockets and a large-scale ground infiltration.",
				},
				{
					text: "The initial assault results in a high number of Israeli casualties and the taking of numerous civilian and military hostages into Gaza.",
					category: "consequence",
					position: { x: 400, y: 100 },
					options: [
						"The initial assault results in a high number of Israeli casualties and the taking of numerous civilian and military hostages into Gaza.",
						"The attack is successfully repelled at the border with no Israeli casualties.",
						"The rockets are all intercepted by Israel's Iron Dome defense system.",
						"Hamas immediately releases all captured individuals after the attack.",
					],
					correctAnswer:
						"The initial assault results in a high number of Israeli casualties and the taking of numerous civilian and military hostages into Gaza.",
				},
				{
					text: "In response, Israel declares war and initiates a massive military campaign, including intense aerial bombardments and a ground invasion of the Gaza Strip.",
					category: "reaction",
					position: { x: 700, y: 200 },
					options: [
						"In response, Israel declares war and initiates a massive military campaign, including intense aerial bombardments and a ground invasion of the Gaza Strip.",
						"Israel calls for an immediate diplomatic solution through the United Nations.",
						"The international community imposes a no-fly zone over the region.",
						"Israel responds with a limited special forces operation to retrieve hostages.",
					],
					correctAnswer:
						"In response, Israel declares war and initiates a massive military campaign, including intense aerial bombardments and a ground invasion of the Gaza Strip.",
				},
				{
					text: "The conflict creates a severe humanitarian crisis in Gaza, with widespread destruction and mass displacement, prompting intense international calls for a ceasefire and aid.",
					category: "legacy",
					position: { x: 400, y: 350 },
					options: [
						"The conflict creates a severe humanitarian crisis in Gaza, with widespread destruction and mass displacement, prompting intense international calls for a ceasefire and aid.",
						"The war is resolved within a week with a permanent peace treaty.",
						"The conflict has minimal impact on the civilian population of Gaza.",
						"International aid organizations successfully prevent any humanitarian issues from arising.",
					],
					correctAnswer:
						"The conflict creates a severe humanitarian crisis in Gaza, with widespread destruction and mass displacement, prompting intense international calls for a ceasefire and aid.",
				},
			],
			storyConnections: [
				{ from: 0, to: 1, relationship: "results in" },
				{ from: 1, to: 2, relationship: "prompts" },
				{ from: 2, to: 3, relationship: "leads to" },
			],
			tags: [],
			actors: [
				"Israel (State)",
				"Ismail Haniyeh",
				"Hamas",
				"United States of America (USA)",
			],
			locations: ["Israel", "Palestine"],
			related_places: [],
			dateOptions: [
				"October 7, 2023 – Present",
				"May 10–21, 2021",
				"July 8 – August 26, 2014",
				"December 27, 2008 – January 18, 2009",
			],
			locationOptions: [
				"Gaza Strip and Israel",
				"West Bank and Jerusalem",
				"Lebanon and Syria",
				"Sinai Peninsula",
			],
			outcomeOptions: [
				"A severe humanitarian crisis in Gaza, mass displacement, and an ongoing, intense military conflict with major international diplomatic repercussions.",
				"A swift and decisive military victory for Israel, leading to the complete disarmament of Hamas.",
				"The successful negotiation of a two-state solution, ending the conflict permanently.",
				"A UN-enforced ceasefire that returns the situation to the pre-war status quo.",
			],
		},
	},
];

/**
 * Inserts the array of quiz games into the 'game' table in Supabase.
 */
async function insertGames() {
	console.log("Starting to insert games...");

	// The .insert() method can accept an array of objects for bulk insertion.
	// Each object in the array should correspond to a row you want to insert.
	// We add .select() at the end to return the data that was inserted.
	const { data, error } = await supabase.from("game").insert(quizzes).select();

	// Handle potential errors
	if (error) {
		console.error("Error inserting games:", error.message);
		// More detailed error for debugging if available
		if (error.details) console.error("Details:", error.details);
		if (error.hint) console.error("Hint:", error.hint);
		return;
	}

	// Handle success
	console.log(`Successfully inserted ${data.length} games!`);
}

// Run the function
insertGames();
