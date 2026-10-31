import{readFile,mkdir,writeFile,appendFile,rm,open}from'node:fs/promises';import{createReadStream}from'node:fs';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
const manifest=JSON.parse(await readFile('release.json','utf8'));if(!/^\d+\.\d+\.\d+$/.test(manifest.version))throw Error('Invalid version');await mkdir('downloads',{recursive:true});
const allowed=['JARVIS-Windows-Setup.exe','JARVIS-macOS-Apple-Silicon.dmg','JARVIS-macOS-Apple-Silicon.zip'];
for(const [i,a]of manifest.artifacts.entries()){
 if(!/^[a-f0-9]{64}$/.test(a.sha256))throw Error('Missing artifact checksum');const u=new URL(a.url);if(u.protocol!=='https:'||!u.hostname.endsWith('.blob.core.windows.net'))throw Error('Unexpected artifact host');
 const response=await fetch(u);if(!response.ok)throw Error('Download failed '+response.status);const zip='artifact-'+i+'.zip',file=await open(zip,'wx'),hash=createHash('sha256');let total=0;
 try{for await(const chunk of response.body){total+=chunk.length;if(total>3*1024**3)throw Error('Artifact too large');hash.update(chunk);await file.writeFile(chunk);}}finally{await file.close();}
 if(hash.digest('hex')!==a.sha256)throw Error('Artifact checksum mismatch');
 const names=execFileSync('unzip',['-Z1',zip],{encoding:'utf8'}).trim().split('\n'),extract=[];
 for(const name of names){if(name.endsWith('/'))continue;if(!allowed.includes(name)&&name!=='SHA256SUMS.txt')throw Error('Unexpected artifact file '+name);if(allowed.includes(name))extract.push(name);}
 if(!extract.length)throw Error('Empty artifact');execFileSync('unzip',['-j','-o',zip,...extract,'-d','downloads'],{stdio:'inherit'});await rm(zip);
}
let sums='';for(const name of allowed){const hash=createHash('sha256');for await(const chunk of createReadStream('downloads/'+name))hash.update(chunk);sums+=hash.digest('hex')+'  '+name+'\n';}
await writeFile('downloads/SHA256SUMS.txt',sums);await appendFile(process.env.GITHUB_ENV,'JARVIS_VERSION='+manifest.version+'\n');
