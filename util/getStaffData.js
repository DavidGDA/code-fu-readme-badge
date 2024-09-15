const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const fs = require("fs").promises;

const url = "https://code-fu.net.ni/staff/";
const staffName = "dalvarez";

async function scrappData() {
  try {
    const executablePath = await chromium.executablePath();
    console.log("Ruta del ejecutable de Chromium:", executablePath);

    if (!executablePath) {
      throw new Error("No se pudo encontrar el ejecutable de Chromium.");
    }

    const browser = await puppeteer.launch({
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      ignoreDefaultArgs: ["--disable-extensions"],
    });

    const page = await browser.newPage();
    // Resto del código para scrapear datos...

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

    await fs.writeFile(
      "../data/images.json",
      JSON.stringify(staffInfo, null, 2)
    );
  } catch (error) {
    console.error("Error al lanzar Chromium:", error);
  }
}

// exportar la función para poder ser utilizada en otro archivo
module.exports = scrappData;
