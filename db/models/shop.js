const mongoose = require("mongoose");
const MODELNAME = "Shop";

const locationSchema = new mongoose.Schema({
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ["Point"], // 'location.type' must be 'Point'
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
});

const Schema = new mongoose.Schema(
  {
    name: { type: String },
    streetName: { type: String },
    zip: { type: String },
    streetNumber: { type: String },
    city: { type: String },
    country: { type: String },

    type: { type: String, enum: ["croissant", "pain-au-chocolat"] },
    description: { type: String },

    location: {
      type: locationSchema,
      index: "2dsphere",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models[MODELNAME] || mongoose.model(MODELNAME, Schema);
