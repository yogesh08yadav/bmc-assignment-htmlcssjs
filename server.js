const http = require("http");
const url = require("url");

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "GET") {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    if (pathname === "/api/content") {
      let filterQuery = query.filter;
      try {
        const response = await fetch(
          filterQuery == ""
            ? "https://www.bmc.com/bin/contentapi/content?rootPath=/content/bmc/language-masters/en/customers&product_interest=981173424,244922277,215078746,163366495,940824846,499579858,507778250,145457443,762200338,794729560,248677372,174236796,180034581,438283521,788612595,004182175,549295455,113394324,642178370,212041549&sortCriteria=recommended&category=rc"
            : `https://www.bmc.com/bin/contentapi/content?rootPath=/content/bmc/language-masters/en/customers&product_interest=981173424,244922277,215078746,163366495,940824846,499579858,507778250,145457443,762200338,794729560,248677372,174236796,180034581,438283521,788612595,004182175,549295455,113394324,642178370,212041549&ic-company-size=${filterQuery}&sortCriteria=recommended&category=rc`
        );
        const data = await response.json();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching data:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("405 Method Not Allowed");
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
