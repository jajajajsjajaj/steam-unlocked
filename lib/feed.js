import axios from "axios";
import cheerio from "cheerio";

function getFeed() {
	return new Promise(async function (resolve, reject) {
		const url = `https://steamunlocked.net/`;
		try {
			const { data } = await axios.get(url);
			const $ = cheerio.load(data);

			var sectionTitles = $(".wpb_wrapper .wpb_text_column");
			var results = {};

			sectionTitles.each((i, item) => {
				var s_title = $(item).text().trim();
				if (s_title) {
					if (!Array.isArray(results[s_title])) {
						results[s_title] = [];
					}
					$(item)
						.next()
						.find(".vc_pageable-slide-wrapper")
						.children()
						.each((i, item) => {
							var itemObj = $(item);

							var id = itemObj
								.find("a.vc_gitem-link")
								.attr("href")
								.split("/")
								.splice(-2)[0];

							var thumbnail = itemObj
								.find(".vc_gitem-zone-img")
								.attr("data-src");
							var date = $(
								itemObj.find(
									".vc_gitem-post-data-source-post_date"
								)[i]
							).text();

							var title = itemObj
								.find("a.vc_gitem-link")
								.attr("title");

							results[s_title].push({
								id,
								title,
								thumbnail,
								date,
							});
						});
				}
			});
			resolve({
				error: false,
				results,
			});
		} catch (err) {
			resolve({ error: true, reason: "No results found!" });
		}
	});
}

export default getFeed;
