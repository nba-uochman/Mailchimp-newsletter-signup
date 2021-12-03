const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
const config = require(__dirname + "/config.js");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// render signup form in the home route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// post response to mailchimp server
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    // const url = "https://us20.api.mailchimp.com/3.0/lists/7070f7a604";

    const options = {
        method: "POST",
        auth: config.auth,
    };

    const request = https.request(config.url, options, function (response) {
        response.on("data", function (data) {
            res.sendFile(__dirname + "/success.html");
        });

    }).on("error", function (err) {
        res.sendFile(__dirname + "/failure.html");
    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", function (req, res) {
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, function () {
    console.log("server is successfully running");
});
