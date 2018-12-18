const path = require('path');
const fs = require('fs');
const assert = require('assert');

const getReadLineStream = require('../index');

describe('ReadLineStream - ', function () {
    it('should read all 60 lines from file', function (done) {
        const dataFile = path.resolve(__dirname, 'data', 'sample-data.txt');
        const outFile = path.resolve(__dirname, 'data', 'out.txt');
        //this.timeout(30 * 1000); // 5 seconds
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
