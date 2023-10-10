const express = require("express");
const sharp = require("sharp");
const router = express.Router();
const axios = require("axios");
const JSZip = require("jszip");

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
    return res.json({ src: dataUrl });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

router.post("/zip-download", async (req, res) => {
  try {
    const data = req.body.data;
    const zip = new JSZip();
    data.forEach((element) => {
      console.log(element);
      zip.file(element.name, element.src.split(",")[1], {
        base64: true,
      });
    });
    const content = await zip.generateAsync({ type: "base64" });
    console.log("Sıkıştırıldı");

    return res.json({ src: content });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

module.exports = router;
