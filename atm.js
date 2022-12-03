const {Customer} = require('./customer');
const {Validation} = require('./validation');
class ATM {
    customers = {};
    currentUser = {};
    validation = new Validation();

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
        console.log(`Customer list!`, this.customers);
    }

    login(name) {
        if(this.currentUser.name) {
            console.log(`User is already login`);
            return;
        }
        if (!this.customers[name]) {
            this.customers[name] = new Customer(name);
        }
        this.currentUser = this.customers[name];
        console.log(`Hello, ${name}!`);
    }

    deposit(amount) {
        let name = this.currentUser.name;
        if(!this.validation.validateDeposite(name, amount)) {
            return;
        }
        let amt = parseFloat(amount);
        let customer = this.customers[name];
        customer.balance = (customer.balance > 0) ? (customer.balance+amt) : amt;
        let totalAmount = customer.balance;
        console.log(`Your balance is $${totalAmount}`);
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
        let name = this.currentUser.name;
        if(!this.validation.validateTransfer(name, userName, amount)) {
            return;
        }
        let amt = parseFloat(amount);
        let transferToCustomer = this.customers[userName];
        let customer = this.customers[name];
        if(customer.balance < amount) {
            console.log(`Insufficient balance in your account`);
            return;
        }
        transferToCustomer.balance = transferToCustomer.balance+amt;
        customer.balance = customer.balance-amt;
        let totalAmount = customer.balance;
        console.log(`Transferred $${amt} to ${userName}`);
        console.log(`Your balance is $${totalAmount}`);
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

}

module.exports = {ATM};