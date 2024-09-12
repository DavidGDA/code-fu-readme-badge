const express = require("express");
const path = require("path");
const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/badges/default-badge", (req, res) => {
  res.redirect("/badges/default-badge.svg");
});

app.get("/badges/cruiz", (req, res) => {
  res.redirect("/badges/cruiz.svg");
});

app.get("/badges/dalvarez", (req, res) => {
  res.redirect("/badges/dalvarez.svg");
});

app.get("/badges/areynosa", (req, res) => {
  res.redirect("/badges/areynosa.svg");
});

app.get("/badges/jsolis", (req, res) => {
  res.redirect("/badges/jsolis.svg");
});

app.get("/badges/ralfaro", (req, res) => {
  res.redirect("/badges/ralfaro.svg");
});

app.get("/badges/afonseca", (req, res) => {
  res.redirect("/badges/afonseca.svg");
});

app.get("/badges/arodriguez", (req, res) => {
  res.redirect("/badges/arodriguez.svg");
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})