import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// Common IPTV user agent to avoid blocking from Xtream servers
const IPTV_USER_AGENT = 'IPTVSmartersPlayer/3.1.5 (Linux;Android 11) Mobile';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'streamly-xtream-proxy' });
});

// Proxy for Xtream JSON API
app.get('/api/proxy/api', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      res.status(400).json({ error: 'Invalid URL protocol' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const upstreamRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': IPTV_USER_AGENT,
        'Accept': 'application/json, text/plain, */*',
      },
    });

    clearTimeout(timeout);

    const contentType = upstreamRes.headers.get('content-type') || 'application/json';
    const text = await upstreamRes.text();

    res.status(upstreamRes.status);
    res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (err: any) {
    console.error('API Proxy error:', err?.message || err);
    res.status(502).json({
      error: 'Cannot reach Xtream server',
      details: err?.name === 'AbortError' ? 'Connection timed out (12s)' : (err?.message || 'Network error'),
      url: targetUrl
    });
  }
});

// Function to rewrite M3U8 playlist URLs so nested segments go through proxy
function rewriteM3U8(content: string, baseUrl: string): string {
  const lines = content.split('\n');
  const rewritten: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      rewritten.push(line);
      continue;
    }

    // Rewrite tags containing URI="url"
    if (trimmed.startsWith('#') && trimmed.includes('URI="')) {
      const newLine = trimmed.replace(/URI="([^"]+)"/g, (match, uri) => {
        try {
          const resolved = new URL(uri, baseUrl).toString();
          return `URI="/api/proxy/stream?url=${encodeURIComponent(resolved)}"`;
        } catch {
          return match;
        }
      });
      rewritten.push(newLine);
      continue;
    }

    // Ignore other comment lines
    if (trimmed.startsWith('#')) {
      rewritten.push(line);
      continue;
    }

    // This is a media segment or child m3u8 line
    try {
      const resolved = new URL(trimmed, baseUrl).toString();
      rewritten.push(`/api/proxy/stream?url=${encodeURIComponent(resolved)}`);
    } catch {
      rewritten.push(line);
    }
  }

  return rewritten.join('\n');
}

// Proxy for HLS Streams (.m3u8, .ts, .mp4, etc.)
app.get('/api/proxy/stream', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).send('Missing url parameter');
    return;
  }

  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      res.status(400).send('Invalid URL protocol');
      return;
    }

    const forwardHeaders: Record<string, string> = {
      'User-Agent': IPTV_USER_AGENT,
      'Accept': '*/*',
    };

    if (req.headers.range) {
      forwardHeaders['Range'] = req.headers.range as string;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const upstreamRes = await fetch(targetUrl, {
      headers: forwardHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const contentType = upstreamRes.headers.get('content-type') || '';
    const isM3U8 = contentType.includes('mpegurl') || 
                   contentType.includes('application/x-mpegURL') || 
                   parsed.pathname.endsWith('.m3u8') ||
                   targetUrl.includes('.m3u8');

    if (isM3U8) {
      const text = await upstreamRes.text();
      const rewritten = rewriteM3U8(text, targetUrl);

      res.status(upstreamRes.status);
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(rewritten);
      return;
    }

    // For media chunks (.ts, .mp4, etc.)
    res.status(upstreamRes.status);
    if (upstreamRes.headers.has('content-type')) {
      res.setHeader('Content-Type', upstreamRes.headers.get('content-type')!);
    }
    if (upstreamRes.headers.has('content-length')) {
      res.setHeader('Content-Length', upstreamRes.headers.get('content-length')!);
    }
    if (upstreamRes.headers.has('content-range')) {
      res.setHeader('Content-Range', upstreamRes.headers.get('content-range')!);
    }
    if (upstreamRes.headers.has('accept-ranges')) {
      res.setHeader('Accept-Ranges', upstreamRes.headers.get('accept-ranges')!);
    }

    if (upstreamRes.body) {
      // Pipe stream
      const reader = upstreamRes.body.getReader();
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!res.writableEnded) {
            res.write(value);
          }
        }
        res.end();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(502).send(`Stream proxy error: ${err?.message || 'Failed to fetch media'}`);
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Streamly server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
