require("dotenv").config({ path: ".env" });
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import mongoose from "mongoose";
import { MONGO_URL } from "./config";

mongoose.connect(MONGO_URL, function (error) {
  if (error) {
    console.log("ERROR CONNECTING MONGO", error);
  } else {
    console.log("CONNECTED OK");
  }
}); // Get Mongoose to use the global promise library

export default function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
