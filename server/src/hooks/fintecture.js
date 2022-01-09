const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const LogObject = require("../models/log");
const { catchErrors } = require("../utils/error");
const { capture } = require("../utils/sentry");

const { ENVIRONMENT } = require("../config");
const FintectureAPI = require("../utils/fintecture");

router.post(
  "/",
  // express.json({
  //   verify: function (req, res, buf, encoding) {
  //     req.headers["x-generated-signature"] = crypto.createHmac("sha256", SHOPIFY_WEBHOOK_TOKEN).update(buf).digest("base64");
  //   },
  // }),
  catchErrors(async (req, res) => {
    res.status(200).send();
    let accessToken = await FintectureAPI.getAccessToken();
    let payment = await FintectureAPI.getPayments(accessToken["access_token"], req.query.session_id);
    let verification = payment.meta.status === req.query.status;

    let { body, headers } = req;
    await LogObject.create({
      name: "fintecture",
      environment: ENVIRONMENT,
      content: JSON.stringify({ headers, body, verification, payment }),
      route: "/fintecture",
    });
  })
);

module.exports = router;
