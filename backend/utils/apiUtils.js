function extractAPIKey(req, res) {
  const apiKeyPattern = /Bearer\s+([A-Za-z0-9-_]+)/;
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return "";
  }

  const match = authHeader.match(apiKeyPattern);

  if (match) {
    return match[1];
  } else {
    return "";
  }
}

module.exports = extractAPIKey;
