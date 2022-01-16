const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require("../../../app/config");
const ShopObject = require("../../../db/models/shop");
const { catchErrors } = require("../utils/error");

router.post(
  "/",
  catchErrors(async (req, res) => {
    await ShopObject.create({
      location: {
        type: "Point",
        coordinates: req.body.coordinates,
      },
      name: req.body.name,
    });

    return res.status(200).send({ ok: true });
  })
);

router.get(
  "/:id",
  catchErrors(async (req, res) => {
    const shop = await ShopObject.findById(req.params.id);
    return res.status(200).send({ ok: true, data: shop });
  })
);

router.get(
  "/",
  catchErrors(async (req, res) => {
    const shops = await ShopObject.find();

    if (req.query.geojson === "true") {
      return res.status(200).send({
        type: "FeatureCollection",
        features: shops.map(({ _id, name, location }) => ({
          type: "Feature",
          id: _id,
          geometry: location,
          properties: {
            _id,
            title: name,
          },
        })),
      });
    }

    return res.status(200).send({ ok: true, data: shops });
  })
);

module.exports = router;
