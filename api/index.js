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
    const url = "https://code-fu.net.ni/staff";
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url);

    const staffFullName = await page.$eval(`#${staffName} h2`, (element) => {
      return element.textContent;
    });

    const staffCargo = await page.$eval(`#${staffName} span`, (element) => {
      return element.textContent;
    });

    let staffImageUrl = await page.$eval(`#${staffName} img`, (element) => {
      return element.outerHTML.match(/src="([^"]*)/)[1];
    });

    if (staffImageUrl.startsWith("data:image")) {
      staffImageUrl = await page.$eval(`#${staffName} img`, (element) => {
        return element.outerHTML.match(/data-src="([^"]*)/)[1];
      });
    }

    const staffInfo = {
      staffFullName: staffFullName,
      staffCargo: staffCargo,
      staffImageUrl: staffImageUrl,
    };

    await browser.close();

    await fs.writeFile("api/images.json", JSON.stringify(staffInfo, null, 2));
  } catch (error) {
    console.error(error);
  }
  res.sendFile(path.join(__dirname, "images.json"));
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
