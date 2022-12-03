const prompt = require('prompt');

new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['input'], function (err, result) {
        if (err) {
            reject(err)
        }
        resolve(result.input);
    });
});