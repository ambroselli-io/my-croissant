const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { TIPIMAIL_API_KEY, TIPIMAIL_API_USER, EMAIL_1 } = require("../../../config");
const { catchErrors } = require("../utils/error");
const { capture } = require("../utils/sentry");

router.post(
  "/",
  catchErrors(async (req, res) => {
    const { text, subject } = req.body;
    const response = await fetch("https://api.tipimail.com/v1/messages/send", {
      method: "POST",
      headers: {
        "X-Tipimail-ApiUser": TIPIMAIL_API_USER,
        "X-Tipimail-ApiKey": TIPIMAIL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: TIPIMAIL_API_KEY,
        to: [
          {
            address: EMAIL_1,
          },
        ],
        msg: {
          from: {
            address: "contact@mon-croissant.com",
            personalName: "Mon Croissant",
          },
          subject,
          text,
        },
      }),
    }).catch((err) => capture(err, { extra: { text, subject } }));
    res.status(200).send({ ok: response.statusText === "OK" });
  })
);
module.exports = router;
