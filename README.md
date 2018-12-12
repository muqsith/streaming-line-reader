## read-line-stream

```javascript

    const inputFile = '/sample/input/file.txt';
    const outputFile = '/sample/output/file.txt';
    const readLineStream = await getReadLineStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);
    // you can also create your own Writable stream
    readLineStream.pipe(writeStream);

```
