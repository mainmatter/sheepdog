import fs from 'node:fs';

const package_json = JSON.parse(fs.readFileSync('./package.json'));
if (!package_json.devDependencies['@sheepdog/svelte']) {
	package_json.devDependencies['@sheepdog/svelte'] = 'link:.';
} else {
	delete package_json.devDependencies['@sheepdog/svelte'];
}
fs.writeFileSync('./package.json', JSON.stringify(package_json, null, '\t'));
