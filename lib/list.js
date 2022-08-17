import axios from "axios";
import cheerio from "cheerio";

function getGamesList(query, page = 1) {
	return new Promise(async function (resolve, reject) {
		const url = `https://steamunlocked.net/all-games-2/`;
		try {
			const { data } = await axios.get(url);
			const $ = cheerio.load(data);

			var listResultItems = $(".blog-content ul").children();
			var results = [];

			listResultItems.each((i, item) => {
				var obj = $(item).find("a");
				results.push({
					title: obj.text(),
					id: obj.attr("href").split("/").slice(-2)[0],
				});
			});

			resolve({
				error: false,
				results,
				total_items: results.length,
			});
		} catch (err) {
			resolve({ error: true, reason: "No results found!" });
		}
	});
}

export default getGamesList;
