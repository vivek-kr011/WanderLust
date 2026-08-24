if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const cors = require("cors"); 

const User = require("./models/user.js");

/* Routes */
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRoutes = require("./routes/booking.js");
const dashboardRoutes = require("./routes/dashboard.js");


const dbUrl = process.env.ATLASDB_URL;

/* --------------- Database Connection ------------- */

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed");
    console.error(err);
    process.exit(1);
  }
}

connectDB();

/* ------------------ View Engine------------ */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);


/* ---------- Middlewares ------------ */

// CORS (Frontend React)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


/* ------------- Session Store --------------- */

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Mongo Session Store Error", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

/* -------------- Passport --------------  */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------- Global Variables -------------- */

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

/* ----------- Routes ------------ */

app.use("/listings/:id/reviews", reviewRouter);

app.use("/listings/:id/bookings", bookingRoutes);

app.use("/listings", listingRouter);

app.use("/dashboard", dashboardRoutes);

app.use("/", userRouter);


/* ---------- 404 ----------- */

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


/* ------------- Error Handler ------------*/

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

/* ----------------- Server ---------------*/

app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
