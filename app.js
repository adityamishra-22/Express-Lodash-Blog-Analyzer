const express = require("express");
const axios = require("axios");
const _ = require("lodash");

const app = express();
const port = process.env.PORT || 3000;

// Cache object with expiration support
const cache = {};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Routes
app.get("/api/blog-stats", async (req, res) => {
  try {
    const blogData = await getCachedData("blog-stats", fetchDataFromAPI);

    const totalBlogs = blogData.length;
    const longestBlog = findLongestBlog(blogData);
    const privacyBlogsCount = countPrivacyBlogs(blogData);
    const uniqueBlogTitles = getUniqueBlogTitles(blogData);

    const statistics = {
      totalBlogs,
      longestBlog,
      privacyBlogsCount,
      uniqueBlogTitles,
    };

    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/blog-search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is missing" });
  }

  try {
    const cacheKey = `blog-search-${query}`;
    const searchResults = await getCachedData(cacheKey, async () => {
      const blogData = await fetchDataFromAPI();
      return _.filter(blogData, (blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
    });

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Helper functions
async function fetchDataFromAPI() {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    return response.data.blogs || response.data;
  } catch (error) {
    console.error("Failed to fetch data from the API:", error.message);
    throw new Error("Failed to fetch data from the API");
  }
}

function findLongestBlog(blogData) {
  if (!blogData || blogData.length === 0) return null;
  return _.maxBy(blogData, (blog) => blog.title.length)?.title || null;
}

function countPrivacyBlogs(blogData) {
  if (!blogData || blogData.length === 0) return 0;
  const keyword = "privacy";
  return _.filter(blogData, (blog) =>
    blog.title.toLowerCase().includes(keyword)
  ).length;
}

function getUniqueBlogTitles(blogData) {
  if (!blogData || blogData.length === 0) return [];
  return _.uniq(blogData.map((blog) => blog.title));
}

async function getCachedData(key, fetchFunction) {
  const entry = cache[key];
  const now = Date.now();
  if (entry && now - entry.timestamp < CACHE_DURATION_MS) {
    return entry.data;
  }

  const freshData = await fetchFunction();
  cache[key] = {
    data: freshData,
    timestamp: now,
  };

  return freshData;
}
