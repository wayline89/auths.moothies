const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://wayline:test123@jwtninja.66w0ue0.mongodb.net/node-auth?retryWrites=true&w=majority&appName=JWTNinja";

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3000);
    console.log(`Connected to MongoDB - Connection string :  ${dbURI}`);
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// routes
app.get('*', checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.get("/home", requireAuth, (req, res) => res.render("smoothies"));

app.get('/profil', requireAuth, (req, res) => res.render('profil'));
app.get('/createJob', requireAuth, (req, res) => res.render('createJob'));
app.get('/job', requireAuth, (req, res) => res.render('job'));
app.get('/profile', requireAuth, (req, res) => res.render('profile'));

app.use(authRoutes);

