const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require("../config");
const ShopObject = require("../models/shop");
const { catchErrors } = require("../utils/error");

router.post(
  "/",
  catchErrors(async (req, res) => {
    await ShopObject.create({ location: { type: "Point", coordinates: req.body.coordinates }, name: req.body.name });

    return res.status(200).send({ ok: true });
  })
);

router.get(
  "/",
  catchErrors(async (req, res) => {
    const shops = await ShopObject.find();

    if (req.query.geojson === "true") {
      return res.status(200).send({
        type: "FeatureCollection",
        features: shops.map(({ name, location }) => ({
          type: "Feature",
          geometry: location,
          properties: {
            title: name,
          },
        })),
      });
    }

    return res.status(200).send({ ok: true, data: shops });
  })
);

module.exports = router;
