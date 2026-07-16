const fs = require('fs');
const path = require('path');

const folders = ['whoami', 'aboutme', 'work', 'projects', 'skills', 'experience', 'connect', 'resume', 'links'];
const index = {};

folders.forEach(folder => {
    const dirPath = path.join(__dirname, 'public', folder);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
            .sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
                const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
                return numA - numB;
            });
        index[folder] = files;
    } else {
        index[folder] = [];
    }
});

fs.writeFileSync(path.join(__dirname, 'public', 'frames-index.json'), JSON.stringify(index, null, 2));
console.log('Index generated successfully!');
