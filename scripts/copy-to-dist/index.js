const fs = require('fs-extra');
const path = require('path');

const PATH = {
  targetsJson: path.join(__dirname, './targets.json'),
  src: path.join(__dirname, '../../src'),
  dist: path.join(__dirname, '../../dist'),
};

const json = JSON.parse(fs.readFileSync(PATH.targetsJson, 'utf8'));

console.log('copy to dist ...')

json.forEach((targetPath) => {
  console.log(`* ${targetPath}`);
  fs.copySync(
    path.join(PATH.src, targetPath),
    path.join(PATH.dist, targetPath),
  );
});
