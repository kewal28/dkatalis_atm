const {Input} = require('./input');
const {Validation} = require('./validation');
const {ATM} = require('./atm');

let input = new Input();
let validation = new Validation();
let atm = new ATM();

let start = async function () {
    try {
        let ipt = await input.getInput();
        validation.checkCommand(ipt);
        atm.process(ipt);
        start();
    } catch(error) {
        console.log(error);
    }
}
start();