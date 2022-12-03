class Validation {
    command = ["login", "deposit", "withdraw", "transfer", "logout"];
    checkCommand(input) {
        if(input) {
            let keys = input.split(' ');
            if (keys[0]) {
                let w = keys[0].toLowerCase();
                if(!this.command.includes(w)) {
                    console.log(`Invalid command`);
                }
            }
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

    validateTransfer(name, userName, amount, customers) {
        if(!name) {
            console.log(`User is not login`);
            return false;
        } if(userName == name) {
            console.log(`You can't select your own account`);
            return false;
        } if(!customers[userName]) {
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