const router = require("express").Router();
const { forwardAuthenticated } = require("../helpers/auth");
router.get("/", forwardAuthenticated, (req, res) => {
  res.render("index", {
    title: "SensationLED"
  });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/insecure", function(req, res) {
  res.send("Dangerous!");
});

module.exports = router;
