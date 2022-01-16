const mongoose = require("mongoose");
const MODELNAME = "User";

const Schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      match: [/^.+@(?:[\w-]+\.)+\w+$/, "Please fill a valid email address"],
    },
    password: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

Schema.methods.me = function () {
  return {
    _id: this._id,
    pseudo: this.pseudo,
  };
};

module.exports = mongoose.models[MODELNAME] || mongoose.model(MODELNAME, Schema);
