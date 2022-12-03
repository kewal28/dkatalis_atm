const {Customer} = require('./customer');
class ATM {
    customers = {};
    currentUser = {};

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
            case 'logout':
                this.logout();
                break;    
        
        } 
        // console.log(`Customer list!`, this.customers);
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
        console.log(`Welcome ${name}!`);
    }

    deposit(amount) {
        if(!this.currentUser.name) {
            console.log(`User is not login`);
            return;
        }
        if(amount < 0) {
            console.log(`Amount can't be less than 0`);
            return;
        }
        let amt = parseFloat(amount);
        let name = this.currentUser.name;
        let customer = this.customers[name];
        customer.balance = (customer.balance > 0) ? (customer.balance+amt) : amt;
        let totalAmount = customer.balance;
        console.log(`Your balance is ${totalAmount}`);
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