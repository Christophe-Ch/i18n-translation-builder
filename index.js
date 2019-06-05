#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const Reader = require('line-by-line');
const path = require('path');
const isValidPath = require('is-valid-path');

program.version('1.0.0').parse(process.argv)

if (program.args.length < 2) {
    console.error('You have to enter your Vue file\'s path and the translations folder\'s path!');
    return;
}

try {
    if (fs.existsSync(program.args[0])) {
        const stats = fs.statSync(program.args[0]);
        if (!stats.isFile()) {
            console.error('The first parameter must be a file.');
            return;
        }
    } else {
        console.error('The file you entered doesn\'t exist.');
        return;
    }

    if (fs.existsSync(program.args[1])) {
        const stats = fs.statSync(program.args[1]);
        if (stats.isFile()) {
            console.error('The second parameter must be a folder.');
            return;
        }
    } else {
        console.error('The folder you entered doesn\'t exist.');
        return;
    }
} catch (err) {
    console.error(err);
    return;
}

const lr = new Reader(program.args[0]);

const filenames = program.args.slice(2);
filenames.forEach(filename => {
    if (!filename.match(/^[a-z0-9]+$/i)) {
        console.error('File names can only contain alphanumeric characters.');
        return;
    }
})

const resultFiles = [];

lr.on('error', function (err) {
    console.error(err);
});

lr.on('line', function (line) {
    let splitLine = line.split('\'');
    if (!Array.isArray(splitLine)) {
        splitLine = [splitLine];
    }

    splitLine.forEach(item => {
        splitItem = item.split('.');
        if (splitItem.length > 1 && (!filenames.length || filenames.includes(splitItem[0]))) {
            if (!detection(splitItem[0])) {
                return;
            }

            let file = resultFiles.find(fileObject => fileObject.filename == splitItem[0]);

            if (!file) {
                file = {
                    filename: splitItem[0],
                    object: {}
                };
                resultFiles.push(file);
            }

            file.object = buildObject(file.object, item);
        }
    });
});

lr.on('end', function () {
    resultFiles.forEach(result => {
        const filePath = path.format({
            dir: program.args[1],
            base: `${result.filename}.php`
        });

        if (fs.existsSync(filePath)) {
            console.log(`The file ${result.filename}.php already exists.`);
        } else {
            fs.writeFileSync(filePath, buildPHPTranslation(result.object));
            console.log(`${result.filename}.php generated!`);
        }
    });
});

const buildObject = (object, textToAdd) => {
    const subparts = textToAdd.split('.').slice(1);

    if (subparts.length == 1) {
        if (!(subparts[0] in object)) {
            object[subparts[0]] = "";
        }
    } else {
        if (!(subparts[0] in object)) {
            object[subparts[0]] = {};
        }
        object[subparts[0]] = buildObject(object[subparts[0]], subparts.join('.'));
    }

    return object;
}

const buildPHPTranslation = (object) => {
    let result = JSON.stringify(object);
    result = result.split('{').join('[\n');
    result = result.split('}').join('\n]\n');
    result = result.split(':').join('=>');
    result = result.split(',').join(',\n');

    result = `<?php \nreturn ${result};`;

    return result;
}

const detection = (name) => {
    if (!isValidPath(path.format({
            dir: program.args[1],
            base: `${name}.php`
        })) 
        || name.trim() === '') {
        return false;
    }

    return true;
}