const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
var logger = require("morgan");


app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function () {
    console.log(`server listening on port ${app.get('port')}`)
});

// app.use('/api', api); // redirect API calls
// text below is for bootstrap
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.get("/", function (req, res) {

    // Configure middleware

    // Use morgan logger for logging requests
    app.use(logger("dev"));
    // Parse request body as JSON
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    // Make public a static folder
    app.use(express.static("public"));

    // Require all models-to have access to espnArticle variable
    var db = require("./models");
    // Connect to the Mongo DB
    mongoose.connect("mongodb://localhost/espn_articles", {
        useNewUrlParser: true
    });


    axios.get("http://espn.com").then(
        response => {
            const $ = cheerio.load(response.data);
            let results = [];

            $(".headlineStack__list").each(function (i, element) {
                // Create a new Article using the `result` object built from scraping
                db.espnArticle.create(results)
                    .then(function (dbespnArticle) {
                        // View the added result in the console
                        console.log(dbespnArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
                // console.log(results)
                // console.log("____________________________________")

                const title = $(element).text();
                const link = $(element).children().find("a").attr("href");

                results.push({
                    title: title,
                    link: `http://espn.com${link}`,
                    deleted: false


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