const {Customer} = require('./customer');
const {Validation} = require('./validation');
class ATM {
    customers = {};
    currentUser = {};
    validation = new Validation();
    bug = false;

    process (input) {
        let keys = input.split(' ');
        let command = keys[0];
        switch (command) {
            case 'login':
                this.login(keys[1]);
                break;
            case 'deposit':
                this.deposit(keys[1]);
                break;
            case 'withdraw':
                this.withdraw(keys[1]);
                break;
            case 'transfer':
                this.transfer(keys[1], keys[2]);
                break;
            case 'logout':
                this.logout();
                break;
        } 
        this.debug([`Customer list!`, this.customers]);
    }

    login(name) {
        if(!name) {
            console.log(`Please provide valid username.`);
            return;
        }
        if(this.currentUser.name) {
            console.log(`User is already login`);
            return;
        }
        if (!this.customers[name]) {
            this.customers[name] = new Customer(name);
        }
        this.currentUser = this.customers[name];
        let customer = this.customers[name];
        let totalAmount = customer.balance;
        console.log(`Hello, ${name}!`);
        console.log(`Your balance is $${totalAmount}`);
        this.printOwed(name);
    }

    deposit(amount) {
        let name = this.currentUser.name;
        if(!this.validation.validateDeposite(name, amount)) {
            return;
        }
        let amt = parseFloat(amount);
        amt = this.clearOwed(name, amt);
        this.debug(["Now Amt", amt]);
        let customer = this.customers[name];
        customer.balance = (customer.balance > 0) ? (customer.balance+amt) : amt;
        let totalAmount = customer.balance;
        console.log(`Your balance is $${totalAmount}`);
        this.printOwed(name);
    }

    withdraw(amount) {
        let name = this.currentUser.name;
        if(!this.validation.validateWithdraw(name, amount)) {
            return;
        }
        let amt = parseFloat(amount);
        let customer = this.customers[name];
        if(customer.balance < amount) {
            console.log(`Insufficient balance in your account`);
            return;
        }
        customer.balance = customer.balance-amt;
        let totalAmount = customer.balance;
        console.log(`Your balance is $${totalAmount}`);
    }

    transfer(userName, amount) {
        let totalAmount,blcAmout,transferAmt = 0;
        let name = this.currentUser.name;
        if(!this.validation.validateTransfer(name, userName, amount, this.customers)) {
            return;
        }
        let amt = parseFloat(amount);
        let transferToCustomer = this.customers[userName];
        let customer = this.customers[name];
        let owed;
        this.clearOwedTo(userName, name, amt);
        owed = this.clearOwedFrom(name, userName, amt);
        this.debug(['amt', amt]);
        if(!owed) {
            if(customer.balance < amt) {
                transferAmt = customer.balance;
                blcAmout = amt-customer.balance;
                this.addOwedTo(name, userName, blcAmout)
                this.addOwedFrom(userName, name, blcAmout)
                customer.balance = 0;
            } else {
                transferAmt = amt;
                customer.balance = customer.balance-amt;
            }
        }
        transferToCustomer.balance = transferToCustomer.balance+transferAmt;
        totalAmount = customer.balance;
        console.log(`Transferred $${transferAmt} to ${userName}`);
        console.log(`Your balance is $${totalAmount}`);
        this.printOwed(name);
    }

    clearOwed(name, amount) {
        let customer = this.customers[name];
        let blc = amount;
        for(let c of customer.owedTo) {
            let transferAmt;
            let transferToCustomer = this.customers[c.user];
            if(c.amount > blc) {
                c.amount = c.amount-blc;
                transferAmt = blc;
                transferToCustomer.balance = transferToCustomer.balance+transferAmt;
                this.clearOwedFrom(c.user, name, transferAmt);
                console.log(`Transferred $${transferAmt} to ${c.user}`);
                return 0;
            } else {
               blc =  blc - c.amount;
               transferAmt = c.amount;
               c.amount = 0;
               transferToCustomer.balance = transferToCustomer.balance+transferAmt;
               this.clearOwedFrom(c.user, name, transferAmt);
               console.log(`Transferred $${transferAmt} to ${c.user}`);
            }
        }
        return blc;
    }

    clearOwedTo(name, owedTo, amount) {
        let customer = this.customers[name];
        let blc = amount;
        let owed = false;
        for(let c of customer.owedTo) {
            if(owedTo == c.user) {
                if(c.amount > blc) {
                    c.amount = c.amount-blc;
                    break;
                } else {
                    blc = blc-c.amount;
                    c.amount = 0;
                }
                owed = true;
            }
        }
        return owed;
    }

    clearOwedFrom(name, owedFrom, amount) {
        let customer = this.customers[name];
        let blc = amount;
        let owed = false;
        for(let c of customer.owedFrom) {
            if(owedFrom == c.user) {
                if(c.amount > blc) {
                    c.amount = c.amount-blc;
                    break;
                } else {
                    blc = blc-c.amount;
                    c.amount = 0;
                }
                owed = true;
            }
        }
        return owed;
    }

    addOwedTo(name, userName, blcAmout) {
        let customer = this.customers[name];
        let checkFound = false;
        for(let c of customer.owedTo) {
            if(c.user == userName) {
                let newAmout = c.amount+blcAmout;
                c.amount = newAmout;
                checkFound = true;
            }
        }
        if(!checkFound) {
            let owed = {user: userName, amount: blcAmout};
            // console.log(owed);
            customer.owedTo.push(owed);
        }
    }

    addOwedFrom(name, userName, blcAmout) {
        let customer = this.customers[name];
        let checkFound = false;
        for(let c of customer.owedFrom) {
            if(c.user == userName) {
                let newAmout = c.amount-blcAmout;
                c.amount = newAmout;
                checkFound = true;
            }
        }
        if(!checkFound) {
            let owed = {user: userName, amount: blcAmout};
            // console.log(owed);
            customer.owedFrom.push(owed);
        }
    }

    printOwed(name) {
        let customer = this.customers[name];
        for(let c of customer.owedTo) {
            // if(c.amount > 0) {
                console.log(`Owed $${c.amount} to ${c.user}`);
            // }
        }
        for(let c of customer.owedFrom) {
            // if(c.amount > 0) {
                console.log(`Owed $${c.amount} from ${c.user}`);
            // }
        }
    }

    logout() {
        if(!this.currentUser.name) {
            console.log(`User is not login`);
            return;
        }
        let name = this.currentUser.name;
        this.currentUser = {}
        console.log(`Goodbye, ${name}!`);
    }

    debug(obj = []) {
        if(this.bug) {
            console.log(obj);
        }
    }

}

module.exports = {ATM};