class Customer {
    constructor(name) {
        this.name = name;
        this.balance = 0;
        this.owedTo = Array();
        this.owedFrom = Array();
    }
}
module.exports = {
    Customer
};