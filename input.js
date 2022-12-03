const prompt = require('prompt');
class Input {

    async getInput() {
        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get(['input'], function (err, result) {
                if (err) {
                    reject(err)
                }
                if(result) {
                    resolve(result.input);
                } else {
                    reject("Exit");
                    console.log("return");
                }
            });
        });
    }
}

module.exports = {
    Input
};