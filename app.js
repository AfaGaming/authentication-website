//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// database

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(console.log('connected to DB!')).catch(err => console.log(err))

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// encryption

// secret
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

// routes

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

// app.post here

app.post("/register", function(req, res) {
    const newUser = User.create({
        email: req.body.username,
        password: req.body.password
    }).then(res.render("secrets")).catch(err => console.log(err))
});


app.post("/login",  function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then(function(foundUser) {
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            } else {
                res.send("The username or password is incorrect!");
            }
        } else {
            res.send("The username or password is incorrect!");
        }
    }).catch(err => console.log(err));
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});