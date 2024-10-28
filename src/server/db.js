import "./loadEnvironment.mjs";
import db from "./dbconnect.js";
import express from "express";
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res: "Hello World";
  return res.status(200).json("Hi, Foo")
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
