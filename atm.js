class ATM {
    customers = {};
    currentUser = {};

    process (input) {
        let keys = input.split(' ');
        let command = keys[0].toLowerCase();
        switch (command) {
            case 'login':
                this.login(keys[1]);
                break;
        
        } 
        console.log(`Customer list!`, this.customers);
    }

    login(name) {
        if(!this.currentUser) {
            throw new Error(`User is already login`);
        }
        if (!this.customers[name]) {
            this.customers[name] = new Customer(name);
        }
        this.currentUser = this.customers[name];
        console.log(`Welcome ${name}!`);
    }

}

module.exports = {
    ATM
};
