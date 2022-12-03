class Validation {
    command = ["login", "deposit", "withdraw", "transfer", "logout"];
    checkCommand(input) {
        let keys = input.split(' ');
        if (!keys.length) {
            throw new Error(`Invalid input`);
        }
        let w = keys[0].toLowerCase();
        if(!this.command.includes(w)) {
            throw new Error(`Invalid command`);
        }
    }

    validateDeposite(name, amount) {
        if(!name) {
            console.log(`User is not login`);
            return false;
        }
        if(amount < 0) {
            console.log(`Amount can't be less than 0`);
            return false;
        }
        return true;
    }

    validateWithdraw(name, amount) {
        if(!name) {
            console.log(`User is not login`);
            return false;
        }
        if(amount < 0) {
            console.log(`Amount can't be less than 0`);
            return false;
        }
        return true;
    }

    validateTransfer(name, userName, amount) {
        if(!name) {
            console.log(`User is not login`);
            return false;
        } if(userName == name) {
            console.log(`You can't select your own account`);
            return false;
        } if(!this.customers[userName]) {
            console.log(`Transfer to not found!`);
            return false;
        } if(amount < 0) {
            console.log(`Amount can't be less than 0`);
            return false;
        }
        return true;
    }

}

module.exports = {
    Validation
};