const express = require("express");
const sharp = require("sharp");
const router = express.Router();
const axios = require("axios");


router.post("/upload/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const imageResponse = await axios({
      method: "get",
      url: req.body.data,
    });
    const buffer = Buffer.from(imageResponse.data, "binary");
    const datastr = (await sharp(buffer).toFormat(type).toBuffer()).toString(
      "base64"
    );
    const dataUrl = `data:image/${type};base64,${datastr}`;
    console.log("İmage Çevirildi");
    return res.json(dataUrl);
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

module.exports = router;
