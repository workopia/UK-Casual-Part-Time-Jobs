import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync('.github/scripts/listings.json','utf8')),a=JSON.parse(fs.readFileSync('data/active.json','utf8'));
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(d.meta.sourceTimestamp));
if(a.asOf!==date||a.count!==d.listings.length||Object.keys(a.jobs).length!==a.count)throw new Error('Active state differs from snapshot');
for(const r of d.listings)if(a.jobs[r.id]?.company!==r.company||a.jobs[r.id]?.role!==r.title||a.jobs[r.id]?.location!==r.location)throw new Error('Active row mismatch');
console.log('Active state matches listings');
