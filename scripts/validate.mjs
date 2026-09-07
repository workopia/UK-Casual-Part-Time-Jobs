import fs from 'node:fs';
export function validate(data,{allowDraft=false,search=false}={}){
 const fail=message=>{throw new Error(message)};
 if(data.schemaVersion!==1||data.meta?.country!=='GB'||data.meta?.segment!=='uk'||data.meta?.repo!=='UK-Casual-Part-Time-Jobs')fail('UK country contract mismatch');
 if(!Number.isFinite(Date.parse(data.meta.sourceTimestamp)))fail('Source date missing');
 if(!allowDraft && data.meta.releaseReady!==true)fail('Dataset has not passed release verification');
 if(!Array.isArray(data.listings)||!data.listings.length)fail('Refusing an empty release');
 const ids=new Set();for(const row of data.listings){
  if(!row.id||ids.has(row.id))fail('Missing or duplicate ID');ids.add(row.id);
  if(!row.title||!row.company||!row.location)fail('Missing public job fields');
  if(!['Casual','Part-time','Contract-Temp'].includes(row.employmentType) && !(search && ['hourly-role','thin-bucket'].includes(row.recallExpansion)))fail('Job type outside repo scope');
  if(!(search && row.category == null) && !data.categories.some(c=>c.key===row.category))fail('Unknown category');
  if (!allowDraft && data.meta.scope === (search ? 'full-tagged-employer-feed' : 'selected-tagged-employer-feed')) {
   if(data.meta.tagging_source!=='employmentTypeNorm'||!/^https:\/\//.test(row.sourceUrl||'')||!data.meta.quality?.sourceSha256)fail('Missing tagged-feed provenance');
  } else if (!allowDraft) {
   if (!/^https:\/\//.test(row.sourceUrl || '') || !Number.isFinite(Date.parse(row.sourceVerifiedAt))) fail('Missing official source verification');
   if (data.meta.scope !== (search ? 'full-source-verified' : 'selected-source-verified') || !data.meta.verification?.sourceSha256) fail('Missing release provenance');
  }
 }
 return true;
}
if(process.argv[1] && import.meta.url===new URL('file://'+process.argv[1]).href){validate(JSON.parse(fs.readFileSync('.github/scripts/listings.json','utf8')),{allowDraft:process.argv.includes('--allow-draft')});console.log('UK dataset schema and contract passed');}
