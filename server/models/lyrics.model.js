const mongoose = require("mongoose");

const lyricsSchema = new mongoose.Schema(
  {
    song_name: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    lyrics: {
      type: String,
      required: true,
    },
    yt_url: {
      type: String,
      required: true,
      unique: true,
    },
    search_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Lyrics = mongoose.model("lyrics", lyricsSchema);

module.exports = Lyrics;
