const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function () {
    console.log(`server listening on port ${app.get('port')}`)
});
app.get("/", function (req, res) {
    axios.get("http://espn.com").then(
        response => {
            const $ = cheerio.load(response.data);
            let results = [];

            $(".headlineStack__list").each(function (i, element) {
                // console.log(results)
                // console.log("____________________________________")

                const title = $(element).text();
                const link = $(element).children().find("a").attr("href");

                results.push({
                    title: title,
                    link: `espn.com${link}`


                })
            })

            // console.log(results),
            for (var i in results) {
                console.log(results[i])
            }


            res.render("home", {
                results: results,
                link: results


            })
        }
    )

})