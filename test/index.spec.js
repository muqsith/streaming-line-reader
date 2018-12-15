const path = require('path');
const fs = require('fs');
const assert = require('assert');

const getReadLineStream = require('../index');

describe('ReadLineStream - ', function () {
    it('should read all 60 lines from file', function (done) {
        //this.timeout(5 * 1000); // 5 seconds
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
