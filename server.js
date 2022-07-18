import express from "express";
import mongoose from "mongoose";
import { ShortUrlSchema } from "./models/shortUrl.js";
import { MONGO_URI } from "./database/database.js";
const app = express();
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/urls", async (req, res) => {
  const shortUrls = await ShortUrlSchema.find();
  res.render("urls", { shortUrls: shortUrls });
});

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrlSchema.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrlSchema.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrlSchema.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
