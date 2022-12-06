const {Customer} = require('./customer');
const {Validation} = require('./validation');
class ATM {
    transaction = new Transaction();

    process (input) {
        let keys = input.split(' ');
        let command = keys[0];
        let resp = ``;
        switch (command) {
            case 'login':
                if(this.transaction.checkLogin()) {
                    console.log(`User is already login`);
                    return;
                } else {
                    let check = this.transaction.login(keys[1]);
                    if(check) {
                        resp = `${check}\n${this.transaction.printBalance()}\n`;
                    }
                }
                break;
            case 'deposit':
                this.checkActiveSession();
                let session = this.transaction.getActiveCustomer();
                resp = this.transaction.deposit(session, keys[1]);
                resp = `${resp}${this.transaction.printBalance()}\n`;
                break;
            case 'withdraw':
                this.checkActiveSession();
                resp = this.transaction.withdraw(keys[1]);
                resp = `${resp}\n${this.transaction.printBalance()}\n`;
                break;
            case 'transfer':
                this.checkActiveSession();
                resp = this.transaction.transfer(keys[1], keys[2]);
                resp = `${resp}\n${this.transaction.printBalance()}\n`;
                break;
            case 'logout':
                this.transaction.logout();
                break;
        }
        return resp;
    }
    checkActiveSession() {
        if(!this.transaction.checkLogin()) {
            console.log(`User is not login`);
            return;
        }
    }

}

class Transaction {

    bug = false;
    #customers = {};
    #currentUser = {};
    validation = new Validation();

    getActiveCustomer() {
        return this.#currentUser;
    }

    checkLogin() {
        if(this.getActiveCustomer().name) {
            return true;
        }
        return false;
    }

    login(name) {
        let output = ``;
        if(!name) {
            console.log(`Please provide valid username.`);
            return false;
        }
        if (!this.#customers[name]) {
            this.#customers[name] = new Customer(name);
        }
        this.#currentUser = this.#customers[name];
        output = `Hello, ${name}!`;
        this.debug([this.#customers]);
        return output;
    }

    deposit(session, amount) {
        let output = ``;
        let effectiveAmount = amount;
        if (session.borrow && session.borrow < 0) {

            let payBorrow = Math.abs(session.borrow);
            if (Math.abs(session.borrow) > amount) {
                payBorrow = amount;
            }
            effectiveAmount = amount - payBorrow;
            session.borrow = parseInt(session.borrow) + parseInt(payBorrow);

            let tmpOutput = this.#clearOwed(session, payBorrow);
            output = `${output}${tmpOutput}`;
        }
        let newBalance = session.getBalance() + parseInt(effectiveAmount);
        session.setBalance(newBalance);
        return output;
    }

    #clearOwed(session, payBorrow) {
        let output = ``;
        for (let k in session.getOwdeToList()) {
            if (payBorrow > 0) {
                let toCustomer = this.#customers[k];
                let pay = session.getUserOwdeTo(k);
                if (session.getUserOwdeTo(k) > payBorrow) {
                    pay = payBorrow;
                }
                session.setOwedTo(k, session.getUserOwdeTo(k) - pay);
                toCustomer.setOwedFrom(session.name, toCustomer.getUserOwdeFrom(session.name) - pay);
                this.deposit(toCustomer, pay);
                if (session.name == this.#currentUser.name) {
                    output = `${output}\Transferred $${pay} to ${toCustomer.name}\n`;
                }
                payBorrow = payBorrow - pay;
            }
        }
        return output;
    }

    withdraw(amount) {
        let output = ``;
        if(!this.validation.validateWithdraw(amount)) {
            return;
        }
        let amt = parseFloat(amount);
        let customer = this.getActiveCustomer();
        if(customer.balance < amount) {
            console.log(`Insufficient balance in your account`);
            return;
        }
        customer.balance = customer.balance-amt;
        return output;
    }

    transfer(name, amount) {
        let output = '';
        let userName = this.#currentUser.name;
        if (!this.#customers[name]) {
            throw new Error(`No customer exist with name ${name}.`);
        }
        let toCustomer = this.#customers[name];

        if (this.#currentUser.getUserOwdeFrom(name) && this.#currentUser.getUserOwdeFrom(name) != undefined) {
            let virtuallyPaid = amount;
            let remaining = this.#currentUser.getUserOwdeFrom(name) - amount;
            if (this.#currentUser.getUserOwdeFrom(name) < amount) {
                virtuallyPaid = this.#currentUser.getUserOwdeFrom(name);
                remaining = this.#currentUser.getUserOwdeFrom(name) - virtuallyPaid;
            }
            this.#currentUser.setOwedFrom(name, remaining);
            toCustomer.setOwedTo(userName, remaining);
            toCustomer.borrow = toCustomer.borrow + parseInt(virtuallyPaid);
            amount = amount - virtuallyPaid;
        }
        if (amount > 0) {
            let tmpOutput = this.#pustToOwedList(amount, toCustomer);
            output = `${output}${tmpOutput}`;
        }
        return output;
    }

    #pustToOwedList(amount, toCustomer) {
        let output = '';
        let currentBalance = this.#currentUser.getBalance();
        let userName = this.#currentUser.name;
        let effectiveAmount = amount;
        if (currentBalance < amount) {
            let diff = amount - currentBalance;
            this.#currentUser.borrow = this.#currentUser.borrow - parseInt(diff);
            let owedFrom = toCustomer.getUserOwdeFrom(userName) + parseInt(diff);
            toCustomer.setOwedFrom(userName, owedFrom);
            this.#currentUser.setOwedTo(toCustomer.name, owedFrom);
            effectiveAmount = effectiveAmount - diff;
        }
        this.withdraw(effectiveAmount);
        this.deposit(toCustomer, effectiveAmount);
        if (effectiveAmount > 0) {
            output = `${output}\nTransferred $${effectiveAmount} to ${toCustomer.name}`;
        }
        return output;
    }

    printBalance() {
        let output = ``;
        let customer = this.getActiveCustomer();
        output = `Your balance is $${customer.balance}`;
        let owdeToList = customer.owedTo;
        for(let c in customer.owedTo) {
            if(owdeToList[c] > 0) {
                output = `${output} \nOwed $${owdeToList[c]} to ${this.#customers[c].name}`;
            }
        }
        let owdeFromList = customer.owedFrom;
        for(let c in customer.owedFrom) {
            if(owdeFromList[c] > 0) {
                output = `${output} \nOwed $${owdeFromList[c]} From ${this.#customers[c].name}`;
            }
        }
        return output;
    }

    logout() {
        if(!this.#currentUser.name) {
            console.log(`User is not login`);
            return false;
        }
        let name = this.#currentUser.name;
        this.#currentUser = {}
        console.log(`Goodbye, ${name}!`);
    }

    debug(obj = []) {
        if(this.bug) {
            console.log(obj);
        }
    }
}

module.exports = {ATM};