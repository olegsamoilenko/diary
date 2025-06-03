import "dotenv/config";

export default {
  expo: {
    name: "Nemory",
    slug: "nemory",
    scheme: "nemory",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
