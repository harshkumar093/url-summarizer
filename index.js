const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const urlSummarizer = async (url = "https://example.com") => {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  // Example: Extracting all the text inside <h1> tags
  const headings = [];
  $("h1").each((index, element) => {
    headings.push($(element).text());
  });

  const contents = [];
  $("div").each((index, element) => {
    let text = $(element).text();
    text = text.replace(/\t/g, "").toString();
    text = text.replace(/\n/g, "").toString();
    text.length > 50 && contents.push(text);
  });

  return { headings: headings, contents: contents };
};

const app = express();

app.use(express.json());

app.post("/api/v1/url-summarizer", async (req, res) => {
  try {
    const { url } = req.body;
    const summary = await urlSummarizer(url);
    console.log(summary);
    res.status(200).json({
      status: true,
      message: "Fetched url summary successfully",
      data: summary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch url summary.",
      data: error,
    });
  }
});

app.listen(8000, () => {
  console.log("server started at http://localhost:8000");
});
