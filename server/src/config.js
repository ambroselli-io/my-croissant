const MONGO_URL = process.env.MONGODB_ADDON_URI;
const PORT = process.env.PORT || 8080;
const SECRET = process.env.SECRET || "not_so_secret";
const ENVIRONMENT = process.env.NODE_ENV;
const SENTRY_DSN = process.env.SENTRY_DSN;
const WHITE_LIST_DOMAINS = process.env.WHITE_LIST_DOMAINS;
const TIPIMAIL_API_USER = process.env.TIPIMAIL_API_USER;
const TIPIMAIL_API_KEY = process.env.TIPIMAIL_API_KEY;
const EMAIL_1 = process.env.EMAIL_1;
const FINTECTURE_APP_ID = process.env.FINTECTURE_APP_ID;
const FINTECTURE_APP_SECRET = process.env.FINTECTURE_APP_SECRET;
const FINTECTURE_PRIVATE_KEY = process.env.FINTECTURE_PRIVATE_KEY;
// const FINTECTURE_ENV = ENVIRONMENT === "production" ? "production" : "sandbox";
const FINTECTURE_ENV = "sandbox";

module.exports = {
  MONGO_URL,
  PORT,
  SECRET,
  ENVIRONMENT,
  SENTRY_DSN,
  WHITE_LIST_DOMAINS,
  TIPIMAIL_API_USER,
  TIPIMAIL_API_KEY,
  EMAIL_1,
  FINTECTURE_APP_ID,
  FINTECTURE_APP_SECRET,
  FINTECTURE_PRIVATE_KEY,
  FINTECTURE_ENV,
};
