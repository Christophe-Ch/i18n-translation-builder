const Reader = require('line-by-line');
const lr = new Reader('hello.vue');

const values = [];

const resultObject = {};

lr.on('error', function (err) {
	console.error(err);
});

lr.on('line', function (line) {
    let splitLine = line.split('\'');
    if (!Array.isArray(splitLine)) {
        splitLine = [splitLine];
    }

    splitLine.forEach(item => {
        if (item.indexOf('policy.') == 0) {
            values.push(item);
        }
    });
});

lr.on('end', function () {
    if (values.length > 0) {
        values.forEach(value => buildObject(resultObject, value));
    }
    let result = JSON.stringify(resultObject);
    result = result.split('{').join('[');
    result = result.split('}').join(']');
    result = result.split(':').join('=>');

    result = `<?php return ${result};`;

    console.log(result);
});

const buildObject = (object, textToAdd) => {
    const subparts = textToAdd.split('.').slice(1);
    
    if(subparts.length == 1) {
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