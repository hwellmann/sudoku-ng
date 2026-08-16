import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

let commit = 'unknown';
try {
    commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
} catch {
    // no git checkout available
}

const info = { version, timestamp: new Date().toISOString(), commit };

writeFileSync(
    join(root, 'src', 'version.ts'),
    `export const APP_VERSION = ${JSON.stringify(info, undefined, 4)};\n`
);
