const express = require("express");
const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    console.log(req.body);
    return res.json(req.body);
  } catch (err) {
    res.json({ err });
  }
});

module.exports = router;
