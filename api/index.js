const express = require("express");
const path = require("path");
const scrappData = require("../util/getStaffData");
const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("CDN is on the way");
});

app.get("/badges/:staffName", async (req, res) => {
  const staffName = req.params.staff;
  await scrappData(staffName);
  res.sendFile(path.join(__dirname, "../data/images.json"));
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})