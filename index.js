const express = require('express');
const app = express();
const PORT = process.env.PORT || 30000;
const requestIp = require('request-ip');
const momentjs = require('moment-timezone');
const iplookup = require('./lib/iplookup');
const { color } = require('./lib/color');


// Configure express
app.use(express.static('public'));
app.set('view engine', "ejs");
app.use(requestIp.mw());


// Debug express
app.use(async(req, res, next) => {
    // const isApiRoute = /api\/(.+)$/.test(req.path);
    const RouterNames = "router";  // isApiRoute?"api":/files\/(.+)$/.test(req.path)?"files":"router";
    console.log(
        color(`${momentjs.tz("Asia/Jakarta").format()} Express-Action[${RouterNames}]:`, "magenta"),
        color(req.protocol.toUpperCase(), "yellow"),
        req.method,
        color(`"${req.originalUrl}"`),
        color(`host=${req.hostname}`, "blue"),
        `fwd=${req.clientIp}`
    );
    next();
});


// Router Express 
app.get("*", async(req, res) => {
    let iplookup_ = await iplookup(req.clientIp);
    let { ip, city, country, org, timezone } = iplookup_;
    let messageHandler = {
        ID: {
            title_web: "Pergantian Domain Api",
        },
        EN: {
            title_web: "Changed Api Domain"
        }
    }
    res.render('../views/index', {
        title: country === "ID" ? messageHandler.ID.title_web : messageHandler.EN.title_web,
        geolocation: iplookup_
    });
});


app.listen(PORT, function() {
    console.log("App running on port:", PORT);
})
