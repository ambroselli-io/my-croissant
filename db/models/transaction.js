const mongoose = require("mongoose");
const MODELNAME = "Transaction";

const Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", index: true },
    amount: Number,
    sessionId: String,
    status: String,
    country: String,
    currency: String,
    language: String,
  },
  { timestamps: true }
);

module.exports = mongoose.models[MODELNAME] || mongoose.model(MODELNAME, Schema);
