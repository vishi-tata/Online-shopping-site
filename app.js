const express = require("express");
const path = require("path");
const csrf = require("csurf");

const db = require("./data/database")
const authRoutes = require("./routes/auth.routes");
const csrfTokenMiddleware = require("./middlewares/csrf-token");

const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

app.use(csrf());

app.use(csrfTokenMiddleware);

app.use(authRoutes);

db.connectToDatabase().then(function(){
    app.listen(3000);
}).catch(function(error){
    console.log("Failed to connect to database!");
    console.log(error)
});