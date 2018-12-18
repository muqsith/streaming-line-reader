## streaming-line-reader

It will stream lines, so you can wait and write to any source by piping it to output stream (Writable stream). While you wait it doesn't overwhelm your system memory, this is the benefit we get when we use NodeJS Streams.
Process huge files with low memory footprint.

```javascript

    const getReadLineStream = require('streaming-line-reader');

    const inputFile = '/sample/input/file.txt';
    const outputFile = '/sample/output/file.txt';
    const readLineStream = await getReadLineStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);
    // you can also create your own Writable stream
    readLineStream.pipe(writeStream);

```
