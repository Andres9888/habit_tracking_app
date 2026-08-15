#!/usr/bin/env node
/**
 * Count npm-audit critical/high findings that have a published fix.
 * image-size has no released patch (latest is 2.0.2) and only reaches
 * this app through Metro's local asset pipeline.
 */
const UNPATCHED = new Set([
  'GHSA-w3rx-r6r6-pgpr',
  'GHSA-5p2g-fcmc-qvqq',
]);

const audit = JSON.parse(await readStdin());
const vulns = audit.vulnerabilities ?? {};

function viaIds(entry, seen = new Set()) {
  return (entry.via ?? []).flatMap((item) => {
    if (typeof item === 'string') {
      if (seen.has(item)) return [];
      seen.add(item);
      return viaIds(vulns[item] ?? {}, seen);
    }
    const url = String(item.url ?? '');
    const fromUrl = url.match(/GHSA-[a-z0-9-]+/i)?.[0];
    return [item.github_advisory_id, fromUrl].filter(Boolean);
  });
}

function isActionable(entry) {
  const ids = viaIds(entry);
  if (ids.length === 0) return entry.severity === 'critical' || entry.severity === 'high';
  return ids.some((id) => !UNPATCHED.has(String(id)));
}

let critical = 0;
let high = 0;
for (const entry of Object.values(vulns)) {
  if (!isActionable(entry)) continue;
  if (entry.severity === 'critical') critical += 1;
  if (entry.severity === 'high') high += 1;
}

process.stdout.write(`${critical} ${high}\n`);
process.exit(critical > 0 || high > 0 ? 1 : 0);

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
