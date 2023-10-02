const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

// Initialize an empty cache object
const cache = {};

// Step 3: Define Routes
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Step 4: Data Retrieval (Replace with actual API request)
    const blogData = await getCachedData('blog-stats'); // Implement this function

    // Step 5: Data Analysis
    const totalBlogs = blogData.length;
    const longestBlog = findLongestBlog(blogData);
    const privacyBlogsCount = countPrivacyBlogs(blogData);
    const uniqueBlogTitles = getUniqueBlogTitles(blogData);

    // Step 6: Response
    const statistics = {
      totalBlogs,
      longestBlog,
      privacyBlogsCount,
      uniqueBlogTitles,
    };

    res.json(statistics);
  } catch (error) {
    // Step 8: Error Handling
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Step 7: Blog Search Endpoint
app.get('/api/blog-search', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is missing' });
  }

  try {
    // Check if the search results are cached
    const searchResults = await getCachedData(`blog-search-${query}`);

    // If not cached, fetch data and store in cache
    if (!searchResults) {
      const blogData = await fetchDataFromAPI();
      const filteredResults = blogData.filter(blog =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );

      // Cache the results with a unique key
      cache[`blog-search-${query}`] = filteredResults;
      res.json(filteredResults);
    } else {
      res.json(searchResults);
    }
  } catch (error) {
    // Error Handling
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Helper functions (implement these)
async function fetchDataFromAPI() {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    // Assuming the API returns an array of blog data
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data from the API:', error.message);
    throw new Error('Failed to fetch data from the API');
  }
}

function findLongestBlog(blogData) {
  if (!blogData || blogData.length === 0) {
    return null; // Return null for no data
  }

  let longestTitle = '';
  for (const blog of blogData) {
    if (blog.title.length > longestTitle.length) {
      longestTitle = blog.title;
    }
  }

  return longestTitle;
}

function countPrivacyBlogs(blogData) {
  if (!blogData || blogData.length === 0) {
    return 0; // Return 0 for no data
  }

  const privacyKeyword = 'privacy';
  const privacyBlogs = blogData.filter(blog =>
    blog.title.toLowerCase().includes(privacyKeyword)
  );

  return privacyBlogs.length;
}

function getUniqueBlogTitles(blogData) {
  if (!blogData || blogData.length === 0) {
    return []; // Return an empty array for no data
  }

  const uniqueTitles = [...new Set(blogData.map(blog => blog.title))];
  return uniqueTitles;
}

// Function to get cached data
async function getCachedData(key) {
  // Check if data is in the cache and not expired
  const cachedData = cache[key];
  if (cachedData) {
    return cachedData;
  }
  return null;
}
