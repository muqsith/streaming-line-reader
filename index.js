const fs = require('fs');
const { Readable } = require('stream');


class LineStream extends Readable {
    constructor(filePath, options) {
        super(options);
        this.filePath = filePath;
    }

    async mInit() {
        const fd = await this.mGetFd(this.filePath);
        const stat = await this.mGetFstat(fd);
        const fileSize = stat.size;
        let chunkSize = 16 * 1024;
        let position = 0;

        const linesBuffer = [];

        this.reader = () => {
            return new Promise((resolve, reject) => {
                if ((fileSize - position) < chunkSize) {
                    chunkSize = fileSize - position;
                }
                fs.read(fd, Buffer.alloc(chunkSize), 0, chunkSize, position, (err, bytesRead, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (position < fileSize) {
                            const text = buffer.toString('utf8');
                            const lines = text.split(/[\r\n]+/g);
                            for (const line of lines) {
                                linesBuffer.push(line);
                            }
                            position += bytesRead;
                        }
                        if (linesBuffer.length) {
                            resolve(linesBuffer.shift() + '\n');
                        } else {
                            resolve(null);
                        }
                    }
                });
            })
        };
        return this;
    }

    mGetFd(filePath) {
        const promiseHandler = (resolve, reject) => {
            fs.open(filePath, 'r', (err, fd) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(fd);
                }
            });
        };
        return new Promise(promiseHandler);
    };

    mGetFstat(fd) {
        const promiseHandler = (resolve, reject) => {
            fs.fstat(fd, (err, stat) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stat);
                }
            });
        };
        return new Promise(promiseHandler);
    }

    _read(size) {
        this.reader()
        .then((data) => {
            this.push(data);
        })
        .catch((err) => {
            throw err;
        });
    }

}

async function getReadLineStream(filePath) {
    const lineStream = new LineStream(filePath);
    return await lineStream.mInit();
}

module.exports = getReadLineStream;
