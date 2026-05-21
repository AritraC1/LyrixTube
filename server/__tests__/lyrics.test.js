const request = require("supertest");
const app = require("../app");

// Mock the lyrics service so tests don't hit real APIs
jest.mock("../services/lyrics.service", () => ({
  getGenerateLyrics: jest.fn(),
}));

const { getGenerateLyrics } = require("../services/lyrics.service");

describe("Lyrics Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/generate-lyrics returns lyrics on success", async () => {
    getGenerateLyrics.mockResolvedValue({
      song: "Never Gonna Give You Up",
      artist: "Rick Astley",
      lyrics: "[Chorus]\nNever gonna give you up",
    });

    const res = await request(app)
      .post("/api/generate-lyrics")
      .send({ link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.song).toBe("Never Gonna Give You Up");
    expect(res.body.data.artist).toBe("Rick Astley");
  });

  it("POST /api/generate-lyrics returns 400 on missing link", async () => {
    const res = await request(app)
      .post("/api/generate-lyrics")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("POST /api/generate-lyrics returns 500 on service error", async () => {
    getGenerateLyrics.mockRejectedValue(new Error("Lyrics not available"));

    const res = await request(app)
      .post("/api/generate-lyrics")
      .send({ link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe("error");
  });
});