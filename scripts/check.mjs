import fs from 'node:fs';
import {validate} from './validate.mjs';
import {render} from './render.mjs';
const file='.github/scripts/listings.json';
if(fs.existsSync(file)){
 const data=JSON.parse(fs.readFileSync(file,'utf8'));
 validate(data);
 if(fs.readFileSync('README.md','utf8')!==render(data))throw new Error('README does not match verified listings');
 console.log('Verified release checked');
}else{
 const readme=fs.readFileSync('README.md','utf8');
 if(!readme.includes('Preparation status: the first verified listings release has not been published.'))throw new Error('Missing unpublished status');
 console.log('Pre-launch scaffold checked; no listings published');
}
