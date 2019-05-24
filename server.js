const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
var logger = require("morgan");
var db = require("./models");



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
app.use(express.static("public"));
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost/espn_articles", {
  useNewUrlParser: true
});



app.get("/delete_route",function(req,response,){
  console.log("here at delete")
  axios.get("http://espn.com").then(


    response => {
        const $ = cheerio.load(response.data);
        let results = [];
        // console.log(response.data[1][1])

        $(".headlineStack__list > li").each(function (i, element) {
            const title = $(element).text();
            const link = $(element).find("a").attr("href");

            results.push({
                title: title,
                link: `http://espn.com${link}`,
                deleted: false,
                delete_route: "delete_route",
                // link_id: results[link_id]

            })
            // getAjax();
        })

  function getAjax(){
    

// results.forEach(function(element) {
//               console.log(element);
            

//             // for (var i =0;i<results.length;i++){

//             //   if(results[link_id] == element.link_id){
//             //     console.log(element)

//             //   }

//             // }
//           });

  var myquery = { link_id: results[0].link_id}
  var newvalues = {$set: {deleted: true} };
  db.espnArticle.updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    // console.log(results)
    // console.log(db.espnArticle.findOne({ link: myquery }.name))
    

    return;
    // db.close();
  })}
  
  getAjax();
  
})})



app.get("/", function (req, res) {

    



    axios.get("http://espn.com").then(



    
        response => {
            const $ = cheerio.load(response.data);
            let results = [];
          for (var i =0; i<results.length;i++){

          }


            $(".headlineStack__list > li").each(function (i, element) {
                const title = $(element).text();
                const link = $(element).find("a").attr("href");

                results.push({
                    title: title,
                    link: `http://espn.com${link}`,
                    deleted: false,
                    delete_route: "delete_route",
                    link_id: i



                })
                // getAjax();
            })


            // Create a new Article using the `result` object built from scraping
            db.espnArticle.create(results)
                .then(function (dbespnArticle) {
                  // console.log(dbespnArticle);
                  // const puppeteer = require('puppeteer');

                  
                  function getAjax(dbespnArticle){
                    console.log(dbespnArticle)

                  
                  
                  var myquery = { _id: ("5ce13ec86a0d3d9e72329e80") };
                  var newvalues = {$set: {deleted: true} };
                  db.espnArticle.updateOne(myquery, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    return;
                    // db.close();
                  })}

                  

             return;
           
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
            // console.log(results)




                


            res.render("home", {
                results: results,
                link: results


            })
              });

            app.get("/articles", function(req, res) {
                // Grab every document in the Articles collection
                db.espnArticle.find({})
                  .then(function(dbespnArticle) {
                    // If we were able to successfully find Articles, send them back to the client
                    res.json(dbespnArticle);
                  })
                  .catch(function(err) {
                    // If an error occurred, send it to the client
                    
                    res.json(err);
                  });
              });

            //   Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.espnArticle.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("_id")
      .then(function(espnArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(espnArticle.deleted);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      })
      
      
      
      
     
    }) 

      app.post("/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
          .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.espnArticle.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
          })
          .then(function(dbespnArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbespnArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
                     


  
        }
    )
    // module.exports= exporter
