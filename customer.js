class Customer {
    constructor(name) {
        this.name = name;
        this.balance = 0;
        this.borrow = 0;
        this.owedTo = Array();
        this.owedFrom = Array();
    }

    getBalance() {
        return this.balance;
    }

    setBalance(balance) {
        this.balance = parseInt(balance);
    }

    setOwedFrom(userId, amount) {
        if (!this.owedFrom[userId] || this.owedFrom[userId] == undefined) {
            this.owedFrom[userId] = 0;
        }
        this.owedFrom[userId] = parseInt(amount);
        if (amount <= 0) {
            delete this.owedFrom[userId];
        }
    }

    setOwedTo(userId, amount) {
        if (!this.owedTo[userId] || this.owedTo[userId] == undefined) {
            this.owedTo[userId] = 0;
        }
        this.owedTo[userId] = parseInt(amount);
        if (amount <= 0) {
            delete this.owedTo[userId];
        }
    }

    getUserOwdeFrom(userId) {
        let amount = 0;
        if (this.owedFrom[userId] && this.owedFrom[userId] != undefined) {
            amount = this.owedFrom[userId];
        }
        return parseInt(amount);
    }

    getUserOwdeTo(userId) {
        let amount = 0;
        if (this.owedTo[userId] && this.owedTo[userId] != undefined) {
            amount = this.owedTo[userId];
        }
        return parseInt(amount);
    }

    getOwdeFromList() {
        return this.owedFrom;
    }

    getOwdeToList() {
        return this.owedTo;
    }
}
module.exports = {
    Customer
};