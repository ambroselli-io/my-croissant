require("dotenv").config({ path: ".env" });
const express = require("express");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
// const helmet = require("helmet");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const { createRequestHandler } = require("@remix-run/express");

const { globalErrorHandler } = require("./utils/error");

const { PORT, WHITE_LIST_DOMAINS } = require("../../app/config.js");

// require("./mongo");

// Put together a schema
const app = express();
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  // require("../scripts/migrations");
}

app.use(cors({ credentials: true, origin: WHITE_LIST_DOMAINS.split(",") }));

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

// Pre middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.text({ type: ["json", "text"] }));
// app.use(helmet());
app.use(cookieParser());
app.use((req, res, next) => {
  req.ipInfo = (req.headers["x-forwarded-for"] || req.connection.remoteAddress || "")
    .split(",")[0]
    .trim();
  next();
});
// Routes
// app.use("/user", require("./controllers/user"));
// app.use("/transaction", require("./controllers/transaction"));
// app.use("/shop", require("./controllers/shop"));
// app.use("/feedback", require("./controllers/feedback"));
// app.use("/fintecture", require("./hooks/fintecture"));

const now = new Date().toISOString();

// Post middleware
// require("./passport")(app);

app.all(
  "*",
  process.env.NODE_ENV === "production"
    ? createRequestHandler({ build: require("../build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("../build");
        return createRequestHandler({ build, mode: process.env.NODE_ENV })(req, res, next);
      }
);

// Start the server
app.listen(PORT, () => console.log(`RUN ON PORT ${PORT}`));

app.use(globalErrorHandler);

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(path.join(process.cwd(), "server/build"))) {
      delete require.cache[key];
    }
  }
}

module.exports = app;
