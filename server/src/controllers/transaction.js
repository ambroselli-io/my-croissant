const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserObject = require("../models/user");
const TransactionObject = require("../models/transaction");
const { catchErrors } = require("../utils/error");
const FintectureAPI = require("../utils/fintecture");
const { FINTECTURE_APP_ID, FINTECTURE_APP_SECRET, FINTECTURE_ENV, FINTECTURE_PRIVATE_KEY, ENVIRONMENT } = require("../config");
const { capture } = require("../utils/sentry");

router.get(
  "/test",
  // passport.authenticate("user", { session: false }),
  catchErrors(async (req, res) => {
    let tokens = await FintectureAPI.getAccessToken();
    let connect = await FintectureAPI.getPisConnect(tokens.access_token, {
      amount: "125",
      currency: "EUR",
      communication: "Thanks mom!",
      customer_full_name: "Bob Smith",
      customer_email: "bob.smith@gmail.com",
      customer_ip: req.ipInfo,
      state: "somestate",
      country: "fr",
      redirect_uri: "https://app-12d7de78-e9a9-40b4-abb9-22a45d8ae76d.cleverapps.io/transaction/redirect",
    });
    console.log({ connect });

    res.status(200).send({ ok: true, connect });
  })
);

router.post(
  "/payment-request",
  // passport.authenticate("user", { session: false }),
  catchErrors(async (req, res) => {
    const { firstName, lastName, amount, email, country, language } = req.body;
    if (!firstName) return res.status(400).send({ ok: false, error: "Please provide your first name, required for any payment" });
    if (!lastName) return res.status(400).send({ ok: false, error: "Please provide your last/family name, required for any payment" });
    if (!email) return res.status(400).send({ ok: false, error: "Please provide your email, required for any payment" });
    if (!amount) return res.status(400).send({ ok: false, error: "Please provide an amount, otherwise I can ask for a million dollar !" });
    if (!currency) return res.status(400).send({ ok: false, error: "Please provide a currency, otherwise I can ask for gold kilograms !" });
    if (!country) return res.status(400).send({ ok: false, error: "A country is required" });

    // check if user first
    let user = await UserObject.findOne({ email });
    if (!!user) {
      if (user.firstName !== firstName) {
        capture("NOT SAME FIRST NAME", { extra: req.body, user });
        res.status(400).send({
          ok: false,
          error: "Your first name doesn't correspond to the one already registered. We'll get back to you soon to solve this issue !",
        });
      }
      if (user.lastName !== lastName) {
        capture("NOT SAME LAST NAME", { extra: req.body, user });
        res.status(400).send({
          ok: false,
          error: "Your first name doesn't correspond to the one already registered. We'll get back to you soon to solve this issue !",
        });
      }
    }
    if (!user) {
      user = await UserObject.create({ email, firstName, lastName });
    }

    // create transaction
    const transaction = await TransactionObject.create({ user, amount, currency, country });

    let tokens = await FintectureAPI.getAccessToken();
    let connect = await FintectureAPI.getPisConnect(tokens.access_token, {
      amount,
      currency,
      communication: `MON-CROISSANT-${transaction._id}`,
      customer_full_name: `${user.firstName} ${user.lastName}`,
      customer_email: user.email,
      customer_ip: req.ipInfo,
      state: JSON.stringify({ user, transaction }),
      country,
      language: language || "en",
      redirect_uri: "https://app-12d7de78-e9a9-40b4-abb9-22a45d8ae76d.cleverapps.io/transaction/redirect",
    });

    res.status(200).send({ ok: true, connect });
  })
);

router.get(
  "/redirect",
  // passport.authenticate("user", { session: false }),
  catchErrors(async (req, res) => {
    res.status(200).send({
      ok: true,
      data: {
        originalUrl: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
      },
    });
  })
);

module.exports = router;
