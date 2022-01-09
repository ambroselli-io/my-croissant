const mongoose = require("mongoose");

const MODELNAME = "Log";

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    environment: { type: String },
    content: { type: String, required: true },
    webhookId: { type: String, index: true },
    objectId: { type: String, index: true },
    duplicate: { type: Boolean },
    route: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(MODELNAME, Schema);
