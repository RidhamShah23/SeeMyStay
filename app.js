require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");

// ================= DATABASE =================
mongoose
  .connect(process.env.ATLASDB_URL)
  .then(() => console.log("DB Connected"))
  .catch(console.log);
console.log("MONGO_URL =", process.env.ATLASDB_URL);
console.log("TYPE =", typeof process.env.ATLASDB_URL);

//Mongo Session store
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // reduce session writes
});

store.on("error", (e) => {
  console.log("❌ SESSION STORE ERROR", e);
});

// ================= APP CONFIG =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= SESSION =================
const sessionOptions = {
  name: "wanderlust",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL VARIABLES =================
app.use((req, res, next) => {
  console.log("➡ currentUser:", req.user); // DEBUG LINE
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// ================= ROUTES =================
app.use("/", usersRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
