# Express Lodash Blog Analyzer

![GitHub repo size](https://img.shields.io/github/repo-size/adityamishra-22/Express-Lodash-Blog-Analyzer)
![GitHub stars](https://img.shields.io/github/stars/adityamishra-22/Express-Lodash-Blog-Analyzer?style=social)
![GitHub forks](https://img.shields.io/github/forks/adityamishra-22/Express-Lodash-Blog-Analyzer?style=social)

This Express.js web application, powered by Lodash, is a blog analytics and search tool. It allows you to fetch data from a third-party blog API, perform various data analyses, search for blogs, and implement a caching mechanism for improved performance.

## Features

- **Data Retrieval**: Fetch blog data from a third-party API.
- **Data Analysis**: Calculate statistics like the total number of blogs, longest blog title, and more.
- **Blog Search**: Search for blogs based on a query string.
- **Caching (Bonus)**: Implement caching to reduce API requests for repeated queries.
- **Error Handling**: Gracefully handle errors during data retrieval and analysis.

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Start the application using `npm start`.
4. Access the API endpoints.

   - Blog Stats: `http://localhost:3000/api/blog-stats`
   - Blog Search: `http://localhost:3000/api/blog-search?query=your_query_here`

## Usage

### Blog Stats Endpoint

- **URL**: `/api/blog-stats`
- **Method**: GET
- **Description**: Retrieve statistics about the blog data.

### Blog Search Endpoint

- **URL**: `/api/blog-search`
- **Method**: GET
- **Parameters**:
  - `query`: The query string to search for in blog titles (case-insensitive).
- **Description**: Search for blogs based on the provided query.

## Caching (Bonus Challenge)

This project implements a caching mechanism using Lodash's `memoize` function to store and retrieve data. Cached data is stored in memory for a certain period to improve performance by reducing API requests for repeated queries.

## Error Handling

- The application handles errors gracefully and responds with appropriate error messages in case of failures during data retrieval, analysis, or search processes.

## Dependencies

- Express.js: Web framework for building the API.
- Axios: HTTP client for making API requests.
- Lodash: Utility library for caching and data manipulation.
