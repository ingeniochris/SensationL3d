const Color = require("../models/color");
const router = require("express").Router();

const { ensureAuthentication } = require("../helpers/auth");

router.use((req, res, next) => {
  ensureAuthentication(req, res, next);
});

router.get("/", async (req, res) => {
  let colors = await Color.find({ user: req.user.id }).sort({
    details: "desc",
  });
  res.render("colors/index", {
    colors,
  });
});

router.get("/add", (req, res) => {
  res.render("colors/add");
});

router.post("/add", async (req, res) => {
  let { title, details } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ text: "Agrega un titulo" });
  }
  if (!details) {
    errors.push({ text: "Agrega un color" });
  }
  if (errors.length > 0) {
    res.render("colors/add", {
      errors,
      title,
      details,
    });
  } else {
    const newColor = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
    };
    let col = new Color(newColor);
    await col.save();
    console.log(col);
    req.flash("success_msg", "Color guardado");
    res.redirect("/colors");
  }
});

router.get("/galery", (req, res) => {
  res.render("colors/galery");
});

router.get("/effects", (req, res) => {
  res.render("colors/effects");
});

router.delete("/delete/:id", async (req, res) => {
  await Color.findByIdAndRemove(req.params.id);
  req.flash("success_msg", "Color Borrado");
  res.redirect("/colors");
});

module.exports = router;
