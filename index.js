const express = require("express");
const path = require("path");
const port = process.env.PORT || 4000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.redirect("/badges/badge.svg");
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})