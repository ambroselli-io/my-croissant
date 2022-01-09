const { FintectureClient } = require("fintecture-client");
const { FINTECTURE_APP_ID, FINTECTURE_APP_SECRET, FINTECTURE_ENV, FINTECTURE_PRIVATE_KEY, ENVIRONMENT } = require("../config");
const { capture } = require("./sentry");

let FintectureAPI = new FintectureClient({
  app_id: FINTECTURE_APP_ID,
  app_secret: FINTECTURE_APP_SECRET,
  private_key: FINTECTURE_PRIVATE_KEY,
  env: FINTECTURE_ENV,
});

module.exports = FintectureAPI;
