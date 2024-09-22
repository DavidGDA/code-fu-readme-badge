const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const { exec } = require("child_process");
const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("CDN is on the way");
});

app.get("/badges/:staffName", async (req, res) => {
  const staffName = req.params.staffName;

  let badgeURL = path.join(__dirname, "../public/badges", `${staffName}.svg`);
  if (fsSync.existsSync(badgeURL)) {
    return res.sendFile(badgeURL);
  }

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
      staffCode: staffName,
      staffFullName: staffFullName,
      staffCargo: staffCargo,
      staffImageUrl: staffImageUrl,
    };

    await browser.close();

    await fs.writeFile("data.json", JSON.stringify(staffInfo, null, 2));
    const generateBagdeBin = "generate-badge.exe";
    exec(`cd generate-badge && ${generateBagdeBin}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      res.sendFile(badgeURL);
    });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
