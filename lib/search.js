import axios from "axios";
import cheerio from "cheerio";

function getSearch(query, page = 1) {
	return new Promise(async function (resolve, reject) {
		if (!query) {
			resolve({ error: true, reason: "Invalid Search" });
		} else {
			const url = `https://steamunlocked.net/page/${page}/?s=${query}`;
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
						query,
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

export default getSearch;
