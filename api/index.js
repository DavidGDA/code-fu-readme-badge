const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("CDN is on the way");
});

app.get("/badges/:staffName", async (req, res) => {
  const staffName = req.params.staffName;
  try {
    fetch(`https://code-fu-scrapp-staff-data.onrender.com/badges/${staffName}`)
      .then((response) => response.json())
      .then((data) => {
        res.json(data);
      });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
