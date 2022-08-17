import axios from "axios";
import cheerio from "cheerio";

const availableCategories = {
	action: "Action",
	adventure: "Adventure",
	adult: "Adult",
	anime: "Anime",
	classics: "Classics",
	fps: "FPS",
	horror: "Horror",
	indie: "Indie",
	popular: "Popular",
	"open-world": "Open World",
	"ps2-games": "PS2-Games",
	racing: "Racing",
	rpg: "RPG",
	remastered: "Remastered",
	simulation: "Simulation",
	sports: "Sports",
	"virtual-reality": "Virtual Reality",
};

function getCategory(query, page = 1) {
	return new Promise(async function (resolve, reject) {
		if (!availableCategories[query.toLowerCase()]) {
			resolve({
				error: true,
				reason: "No such category found!",
				availableCategories: Object.keys(availableCategories),
			});
		} else {
			const url = `https://steamunlocked.net/category/${query}/page/${page}`;
			try {
				const { data } = await axios.get(url);
				const $ = cheerio.load(data);

				var searchResultItems = $(".cover-items").children();

				var searchResults = [];
				if (searchResultItems.length) {
					searchResultItems.each((i, item) => {
						var titleWrap = $(item).find(".cover-item-title a");
						var title = titleWrap.text().trim();
						var id = titleWrap.attr("href").split("/").slice(-2)[0];
						var thumbnail = $(item)
							.find(".wp-post-image")
							.attr("data-src");
						searchResults.push({
							title,
							id,
							thumbnail,
						});
					});
					var total_pages = parseInt(
						$(".nav-links").children().last().text()
					);
					resolve({
						error: false,
						category: query,
						results: searchResults,
						totalResults: searchResults.length,
						pageInfo: {
							current: page,
							total: total_pages,
						},
					});
				} else {
					resolve({ error: true, reason: "No results found!" });
				}
			} catch (err) {
				resolve({ error: true, reason: "No results found!" });
			}
		}
	});
}

export { availableCategories, getCategory };
