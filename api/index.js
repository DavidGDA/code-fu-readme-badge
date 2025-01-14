const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const { exec } = require("child_process");
const port = 10000;

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/badges/:staffName", async (req, res) => {
  const staffName = req.params.staffName;

  let badgeURL = path.join(__dirname, "public/badges", `${staffName}.svg`);

  if (fsSync.existsSync(badgeURL)) {
    return res.sendFile(badgeURL);
  }

  return res.status(404).send("Badge not found");
});

app.get("/generate", async (req, res) => {
  const StaffSelectors = [
    "c-t",
    "hea-t",
    "sm-t",
    "hta-t",
    "ta-t",
    "hca-t",
    "wb-t",
    "ck-t",
  ];

  const url = "https://code-fu.net.ni/staff";
  const generateBagdeBinName = "main.py";
  const generateBagdeBinRoute = path.resolve("util", generateBagdeBinName);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(url);

  let staffData = [];

  StaffSelectors.forEach(async (selector) => {
    try {
      const staffCode = await page.$$eval(`.${selector}`, (element) =>
        element.map((el) => el.id)
      );
      const staffFullName = await page.$$eval(`.${selector} h2`, (element) =>
        element.map((el) => el.textContent)
      );
      const staffCargo = await page.$$eval(
        `.${selector} .info-staff span`,
        (element) => element.map((el) => el.textContent)
      );
      let staffImageUrl = await page.$$eval(`.${selector} img`, (element) =>
        element.map((el) => {
          let imageUrl = el.outerHTML.match(/src="([^"]*)/)[1];
          if (imageUrl.startsWith("data:image")) {
            imageUrl = el.outerHTML.match(/data-src="([^"]*)/)[1];
          }
          return imageUrl;
        })
      );

      staffCode.forEach((code, index) => {
        staffData.push({
          staffCode: code,
          staffFullName: staffFullName[index],
          staffCargo: staffCargo[index],
          staffImageUrl: staffImageUrl[index],
        });
      });
    } catch (error) {
      console.error(error);
    }
  });

  await fs.writeFile("data.json", JSON.stringify(staffData, null, 2));
  let errorGenerating = false;
  const pythonVenvRoute = path.resolve(".venv", "Scripts", "activate");
  exec(`${pythonVenvRoute} & python ${generateBagdeBinRoute}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      errorGenerating = true;
    }
  });

  if (errorGenerating) {
    return res.status(500).send("Error generating badges");
  }

  await browser.close();

  return res.send("Badges generated");
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}
    http://localhost:${port}
    http://localhost:${port}/generate`);
});