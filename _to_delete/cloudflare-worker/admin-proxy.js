/**
 * Cloudflare Worker: agusdhito-admin-proxy
 *
 * Sits between the site's /admin editor and GitHub, so the browser never
 * needs a GitHub token. Deploy this as-is via the Cloudflare dashboard
 * (Workers & Pages -> Create Worker -> paste this in -> Deploy), then set
 * two secrets under Settings -> Variables and Secrets:
 *
 *   ADMIN_PASSWORD  - a passphrase you choose (this is what you'll type
 *                     into /admin to publish changes)
 *   GITHUB_PAT      - a GitHub fine-grained personal access token scoped
 *                     to ONLY the AgusDhito.github.io repo, with
 *                     "Contents: Read and write" permission. This token
 *                     lives only here, server-side. It is never sent to
 *                     or readable from the browser.
 *
 * GET  /  -> returns the current site-content.json (no password needed;
 *            the repo is public anyway, this just saves the admin page
 *            an extra round trip and keeps everything behind one URL).
 * POST /  -> body: { password: string, content: object }
 *            Checks password, then commits `content` to the repo,
 *            fetching the current file sha itself first.
 */

const OWNER = 'agusdhito';
const REPO = 'AgusDhito.github.io';
const FILE_PATH = 'src/app/data/site-content.json';
const BRANCH = 'main';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

function b64EncodeUnicode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function b64DecodeUnicode(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

async function githubGet(env) {
  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'agusdhito-admin-proxy',
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method === 'GET') {
      const ghRes = await githubGet(env);
      const ghJson = await ghRes.json();
      if (!ghRes.ok) {
        return json({ error: ghJson.message || 'GitHub API error' }, ghRes.status, origin);
      }
      return json(JSON.parse(b64DecodeUnicode(ghJson.content)), 200, origin);
    }

    if (request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'Invalid JSON body' }, 400, origin);
      }

      const { password, content } = body;
      if (!password || password !== env.ADMIN_PASSWORD) {
        return json({ error: 'Wrong password' }, 401, origin);
      }
      if (!content) {
        return json({ error: 'Missing content' }, 400, origin);
      }

      // Fetch the current sha ourselves so the client never has to track it.
      const currentRes = await githubGet(env);
      const currentJson = await currentRes.json();
      const sha = currentRes.ok ? currentJson.sha : undefined;

      const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${env.GITHUB_PAT}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
          'User-Agent': 'agusdhito-admin-proxy',
        },
        body: JSON.stringify({
          message: 'Update site content via admin editor',
          content: b64EncodeUnicode(JSON.stringify(content, null, 2) + '\n'),
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }),
      });

      const putJson = await putRes.json();
      if (!putRes.ok) {
        return json({ error: putJson.message || 'GitHub API error' }, putRes.status, origin);
      }
      return json({ ok: true }, 200, origin);
    }

    return json({ error: 'Method not allowed' }, 405, origin);
  },
};
