const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = [
    path.join(__dirname, 'src/pages'),
    path.join(__dirname, 'src/features'),
];

targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walkDir(dir, (filePath) => {
        if (!filePath.endsWith('.tsx')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // More precise regex
        // We match <div className="absolute inset-0 z-0"> followed by some whitespace, then <img ... src=... ... /> then </div>
        const blockRegex = /<div\s+className="absolute\s+inset-0\s+z-0">\s*<img\s+(?:[^>]*?\s+)?src=(?:"([^"]+)"|'([^']+)'|\{([^}]+)\})[^>]*\/>\s*<\/div>/g;

        content = content.replace(blockRegex, (match, doubleQuoted, singleQuoted, variable) => {
            let srcVal = doubleQuoted || singleQuoted;
            
            if (srcVal) {
                // Static string
                return `<div \n        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"\n        style={{ backgroundImage: \`url('\${"${srcVal}"}')\` }}\n      ></div>`;
            } else if (variable) {
                // Dynamic variable
                return `<div \n        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"\n        style={{ backgroundImage: \`url('\${${variable}}')\` }}\n      ></div>`;
            }
            return match;
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log('Fixed:', filePath);
        }
    });
});
