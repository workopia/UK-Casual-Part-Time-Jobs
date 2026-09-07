import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
execFileSync('npm',['run','check'],{stdio:'inherit'});
const d=JSON.parse(fs.readFileSync('.github/scripts/listings.json','utf8')),a=JSON.parse(fs.readFileSync('data/active.json','utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const report={asOf:a.asOf,activeRoles:a.count,employers:new Set(d.listings.map(r=>r.company)).size,checksums:{listings:hash('.github/scripts/listings.json'),active:hash('data/active.json')}};
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync(`dist/data-${a.asOf}.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
