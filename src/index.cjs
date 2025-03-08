const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const { exit } = require("process");

/** Variable de puerto de la aplicacion */
const port = process.env.PORT || 3000;

/** Instancia de la aplicacion */
const app = express();

/* Middleware para servir archivos estaticos */
app.use(express.static(path.join(__dirname, "../public")));

/* Ruta principal de la aplicacion */
app.get("/", (req, res) => {
  res.send("App is running");
});

/** Funcion para generar los badges
 * @type {boolean}
 * @returns {boolean} Retorna true si se ejecuto correctamente, si no retorna false
 */
const generateBadges = async () => {
  try {
    /** Selectores de clase HTML de los diferentes tipos de staff en la pagina de staff */
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

    /** URL de la pagina de staff */
    const url = "https://code-fu.net.ni/staff";

    /** Nombre del binario de generacion de badges */
    const generateBagdeBinName = "badges_generator.py";

    /** Ruta del binario de generacion de badges */
    const generateBagdeBinRoute = path.resolve(
      "src",
      "libs",
      generateBagdeBinName
    );

    /** Instancia del navegador de puppeteer */
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    /* se navega a la pagina de staff */
    const page = await browser.newPage();
    await page.goto(url);

    /** Variable para almacenar los datos de los staff */
    const staffData = [];

    /* Se recorren los selectores de staff para obtener los datos de cada staff */
    for (const selector of StaffSelectors) {
      const staffCode = await page.$$eval(`.${selector}`, (elements) =>
        elements.map((el) => el.id)
      );
      const staffFullName = await page.$$eval(`.${selector} h2`, (elements) =>
        elements.map((el) => el.textContent)
      );
      const staffCargo = await page.$$eval(
        `.${selector} .info-staff span`,
        (elements) => elements.map((el) => el.textContent)
      );
      let staffImageUrl = await page.$$eval(`.${selector} img`, (elements) =>
        elements.map((el) => {
          let imageUrl = el.outerHTML.match(/src="([^"]*)/)[1];
          if (imageUrl.startsWith("data:image")) {
            imageUrl = el.outerHTML.match(/data-src="([^"]*)/)[1];
          }
          return imageUrl;
        })
      );

      /* Se copian los datos obtenidos de los selectores al arreglo de datos de staff */
      staffCode.forEach((code, index) => {
        staffData.push({
          staffCode: code,
          staffFullName: staffFullName[index],
          staffCargo: staffCargo[index],
          staffImageUrl: staffImageUrl[index],
        });
      });
    }

    await browser.close();

    /* Se escribe el archivo data.json con los datos obtenidos */
    await fs.writeFile("./src/data.json", JSON.stringify(staffData, null, 2));
    /* let errorGenerating = false; */
    /** Contiene la ruta de el entorno virtual de python */
    const venvPythonPath = path.resolve(".venv", "bin", "python");

    /* Se ejecuta el binario de generacion de badges */
    exec(
      `${venvPythonPath} ${generateBagdeBinRoute}`,
      (err, stdout, stderr) => {
        /* En caso de error se imprime en consola y se retorna false */
        if (err) {
          console.error(`Error: ${err.message}`);
          return false;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return false;
        }
        /* En caso de exito se imprime en consola */
        console.log(`Stdout: ${stdout}`);
      }
    );

    /* Se retorna true en caso de exito */
    return true;
  } catch (error) {
    /* En caso de error se imprime en consola y se retorna false */
    console.error(error);
    await browser.close();
    return false;
  }
};

/* Se inicia el servidor en el puerto especificado */
app.listen(port, async () => {
  /* Se crea el directorio de badges si no existe */
  await fs.mkdir("../public/badges", { recursive: true }, (err) => {
    if (err) throw err;
  });

  /** Ejecuta el servicio de generacion de badges
   * @type {boolean}
   */
  const execGenerate = await generateBadges();

  /* En caso de error al generar las badges se imprime en consola y el servidor deja de ejecutarse */
  if (!execGenerate) {
    console.error("Error generating badges");
    exit(1);
  }

  console.log("Badges generated successfully");
  console.log(`Server is running on the port ${port}`);
});
