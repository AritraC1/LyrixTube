const play = require("play-dl");
const Genius = require("genius-lyrics");

const Lyrics = require("../models/lyrics.model");
const { formatLyrics } = require("../utils/formatLyrics");

const Client = new Genius.Client(process.env.GENIUS_TOKEN);

const isJunkLyrics = (raw) => {
  if (!raw || raw.length < 100) return true;
  if (raw.length > 50000) return true;
  if (raw.includes("Album Release Calendar")) return true;
  if (raw.includes("Genius Chart")) return true;
  const afterHeader = raw.replace(/^\d+\s*Contributors.*?Lyrics/s, "").trim();
  if (afterHeader.length < 100) return true;
  return false;
};

const getGenerateLyrics = async (link) => {
  // Validate YouTube URL
  const ytType = play.yt_validate(link);

  if (ytType !== "video") {
    throw new Error("Invalid YouTube video URL");
  }

  // Check MongoDB cache
  const existingLyrics = await Lyrics.findOneAndUpdate(
    { yt_url: link },
    { $inc: { search_count: 1 } },
    { returnDocument: "after" },
  );

  // Return cached lyrics if found
  if (existingLyrics) {
    console.log(
      `[Cache] HIT — ${existingLyrics.song_name} by ${existingLyrics.artist}`,
    );
    return {
      song: existingLyrics.song_name,
      artist: existingLyrics.artist,
      lyrics: existingLyrics.lyrics,
    };
  }

  // Fetch YouTube video info
  const info = await play.video_basic_info(link);
  const videoDetails = info.video_details;

  const rawTitle = videoDetails.title;
  const channelName = videoDetails.channel?.name || "";

  // Clean title
  const cleanedTitle = rawTitle
    .replace(/\(.*?\)|\[.*?\]/g, "")
    .replace(
      /official music video|official video|official audio|lyric video|lyrics?/gi,
      "",
    )
    .replace(/ft\.?|feat\.?.*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  let artist = "";
  let song = "";

  // Extract artist/song
  if (cleanedTitle.includes("-")) {
    [artist, song] = cleanedTitle.split("-").map((t) => t.trim());
  } else {
    artist = channelName.trim();
    song = cleanedTitle.trim();
  }

  if (!artist || !song) {
    throw new Error("Unable to detect artist or song name");
  }

  // Search Genius
  const searches = await Client.songs.search(`${artist} ${song}`);

  if (!searches.length) {
    throw new Error("Song not found on Genius");
  }

  // Filter best result
  const geniusSong =
    searches.find((s) => {
      const title = s.title.toLowerCase();
      const fullTitle = s.fullTitle.toLowerCase();
      const geniusArtist = s.artist.name.toLowerCase();

      return (
        geniusArtist.includes(artist.toLowerCase()) &&
        fullTitle.includes(song.toLowerCase()) &&
        !title.includes("translation") &&
        !title.includes("translated") &&
        !title.includes("turkish") &&
        !title.includes("español") &&
        !title.includes("romanized")
      );
    }) || searches[0];

  // Fetch lyrics
  const rawLyrics = await geniusSong.lyrics();

  if (!rawLyrics) {
    throw new Error("Lyrics not available");
  }

  // Validate lyrics content
  if (isJunkLyrics(rawLyrics)) {
    console.warn(
      `[Genius] Junk lyrics detected for "${geniusSong.fullTitle}" — skipping save`,
    );
    throw new Error(
      "Could not retrieve valid lyrics — Genius returned a non-lyrics page",
    );
  }

  // Format lyrics
  const lyrics = formatLyrics(rawLyrics);

  if (!lyrics) {
    throw new Error("Failed to format lyrics");
  }

  console.log(`[Cache] MISS — saving "${song}" by "${artist}" to MongoDB`);

  // Save to DB
  await Lyrics.create({
    song_name: song,
    artist,
    lyrics,
    yt_url: link,
    search_count: 1,
  });

  return {
    song,
    artist,
    lyrics,
  };
};

module.exports = { getGenerateLyrics };
