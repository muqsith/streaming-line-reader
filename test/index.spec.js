const path = require('path');
const fs = require('fs');
const assert = require('assert');

const getReadLineStream = require('../index');

describe('ReadLineStream - ', function () {
    this.timeout(5 * 60 * 1000);
    it('should read all 60 lines from file', function (done) {
        // const dataFile = path.resolve(__dirname, 'data', 'sample-data.txt');
        // const outFile = path.resolve(__dirname, 'data', 'out.txt');
        const dataFile = '/home/mui/Development/data/enwiktionary.json';
        const outFile = '/home/mui/Development/data/enwiktionary_out.json';
        getReadLineStream(dataFile)
        .then((readLineStream) => {
            const writeStream = fs.createWriteStream(outFile);
            readLineStream.pipe(writeStream);
            writeStream.on('close', () => {
                done();
            });
        })
        .catch((err) => {
            done(err);
        });
    });
});
