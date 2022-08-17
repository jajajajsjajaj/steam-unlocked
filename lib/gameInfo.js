import axios from "axios";
import cheerio from "cheerio";

function getGameInfo(game_id) {
	return new Promise(async function (resolve, reject) {
		const url = "https://steamunlocked.net/" + game_id;
		try {
			const { data } = await axios.get(url);
			const $ = cheerio.load(data);

			var title = $(".blog-content-title").text().trim();
			var download = $(".btn-download").attr("href");
			var description = $(".game_area_description p").text();
			var sys_req = [];
			var screenshots = [];

			$('h2:contains("System Requirements")')
				.next("ul")
				.children()
				.each((i, item) => {
					sys_req.push($(item).text().trim());
				});

			$(".size-post-large").each((i, item) => {
				var imageSrc = $(item).attr("src");
				screenshots.push(imageSrc);
			});

			var gameInfo = {
				error: false,
				title,
				description,
				screenshots,
				sys_req,
				download,
			};

			resolve(gameInfo);
		} catch (err) {
			resolve({ error: true, reason: "No results found!" });
		}
	});
}

export default getGameInfo;
