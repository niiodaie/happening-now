// Vercel serverless function for RSS feed
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Mock news data for RSS feed
    const articles = [
      {
        title: "Breaking: Global Climate Summit Reaches Historic Agreement",
        link: "https://happening-now.vercel.app/news/climate-summit-agreement",
        description: "World leaders unite on ambitious climate targets for 2030, marking a turning point in global environmental policy.",
        pubDate: new Date().toUTCString(),
        guid: "climate-summit-2024-001",
        category: "Environment"
      },
      {
        title: "Tech Giants Announce Revolutionary AI Partnership",
        link: "https://happening-now.vercel.app/news/ai-partnership-announcement",
        description: "Major technology companies collaborate on next-generation artificial intelligence research and development.",
        pubDate: new Date(Date.now() - 3600000).toUTCString(), // 1 hour ago
        guid: "ai-partnership-2024-002",
        category: "Technology"
      },
      {
        title: "Global Markets Rally on Economic Recovery Signs",
        link: "https://happening-now.vercel.app/news/markets-rally-recovery",
        description: "Stock markets worldwide show strong gains as economic indicators point to sustained recovery.",
        pubDate: new Date(Date.now() - 7200000).toUTCString(), // 2 hours ago
        guid: "markets-rally-2024-003",
        category: "Finance"
      },
      {
        title: "Space Mission Discovers Potential Signs of Life",
        link: "https://happening-now.vercel.app/news/space-mission-life-discovery",
        description: "NASA's latest deep space probe transmits data suggesting possible biological activity on distant exoplanet.",
        pubDate: new Date(Date.now() - 10800000).toUTCString(), // 3 hours ago
        guid: "space-discovery-2024-004",
        category: "Science"
      },
      {
        title: "International Sports Championship Breaks Viewership Records",
        link: "https://happening-now.vercel.app/news/sports-championship-records",
        description: "Global sporting event attracts largest television and streaming audience in history.",
        pubDate: new Date(Date.now() - 14400000).toUTCString(), // 4 hours ago
        guid: "sports-championship-2024-005",
        category: "Sports"
      }
    ];

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Happening Now - Real-Time News Feed</title>
    <link>https://happening-now.vercel.app</link>
    <description>Stay updated with the latest trending news from around the world. Real-time updates on politics, technology, business, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>https://happening-now.vercel.app/logo.png</url>
      <title>Happening Now</title>
      <link>https://happening-now.vercel.app</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="https://happening-now.vercel.app/api/rss" rel="self" type="application/rss+xml" />
    
    ${articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${article.link}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${article.pubDate}</pubDate>
      <guid isPermaLink="false">${article.guid}</guid>
      <category>${article.category}</category>
    </item>`).join('')}
    
  </channel>
</rss>`;

    // Set appropriate headers for RSS
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    res.status(200).send(rssXml);
    
  } catch (error) {
    console.error('RSS feed error:', error);
    res.status(500).json({ 
      error: 'Failed to generate RSS feed',
      message: error.message 
    });
  }
}

