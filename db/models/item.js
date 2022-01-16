const mongoose = require("mongoose");
const MODELNAME = "Item";

const Schema = new mongoose.Schema(
  {
    type: { type: String, enum: ["croissant", "pain-au-chocolat"] },
    fabrication: { type: String, enum: ["home-made", "frozen"] },
    ingredients: [{ type: String }],

    description: { type: String },
    price: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models[MODELNAME] || mongoose.model(MODELNAME, Schema);
