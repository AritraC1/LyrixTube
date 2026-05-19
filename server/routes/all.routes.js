const express = require("express");

const { generateLyrics } = require("../controllers/lyrics.controller");

const router = express.Router();

router.post("/generate-lyrics", generateLyrics);

module.exports = router;
