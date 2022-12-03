const {Input} = require('./input');
// const {ATM} = require('./atm');

let input = new Input();
// let atm = new ATM();

let start = async function () {
    try {
        let ipt = await input.getInput();
        console.log(ipt);
    } catch(error) {
        console.log(error);
    }
}
start();