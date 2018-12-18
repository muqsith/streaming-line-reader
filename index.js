const fs = require('fs');
const { Readable } = require('stream');


class LineStream extends Readable {
    constructor(filePath, options) {
        super(options);
        this.filePath = filePath;
        this.linesBuffer = [];
    }

    async mInit() {
        const fd = await this.mGetFd(this.filePath);
        const stat = await this.mGetFstat(fd);
        const fileSize = stat.size;
        let chunkSize = 16 * 1024;
        let position = 0;
        let previousText = '';

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
                            const currentText = buffer.toString('utf8');
                            let newText = null;
                            if (previousText) {
                                newText = previousText + currentText;
                            } else {
                                newText = currentText;
                            }

                            const lines = newText.split(/[\r\n]+/g);

                            for (let i = 0; i < (lines.length - 1); i += 1) {
                                this.linesBuffer.push(lines[i]);
                            }
                            position += bytesRead;
                            previousText = lines[lines.length - 1];
                            resolve(true);
                        } else if (previousText) {
                            // push the last line
                            this.linesBuffer.push(previousText);
                            previousText = undefined;
                            fs.close(fd, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(false);
                                }
                            });
                        } else {
                            resolve(false);
                            fs.close(fd, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(false);
                                }
                            });
                        }
                    }
                });
            })
        };
        return this;
    }

    mGetLine() {
        if (this.linesBuffer.length) {
            return this.linesBuffer.shift() + '\n';
        } else {
            return null;
        }
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

    mReadData() {
        return new Promise((resolve, reject) => {
            this.reader()
            .then((result) => {
                if (!this.linesBuffer.length && result) {
                    return this.mReadData().then(resolve).catch(reject);
                } else {
                    resolve();
                }
            })
        });
    }

    _read(size) {
        if (this.linesBuffer.length) {
            this.push(this.mGetLine());
        } else {
            this.mReadData()
            .then(() => {
                this.push(this.mGetLine());
            });
        }
    }

}

async function getReadLineStream(filePath) {
    const lineStream = new LineStream(filePath);
    return await lineStream.mInit();
}

module.exports = getReadLineStream;
