const Customer = require("../models/customer.model");

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json({ success: true, data: customers, count: customers.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ success: false, msg: "Customer not found" });

        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, balance, avatar } = req.body;

        if (!name) return res.status(400).json({ success: false, msg: "Name required" });

        const customer = await Customer.create({ name, email, phone, address, balance, avatar });
        res.status(201).json({ success: true, msg: "Customer created", customer });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) return res.status(404).json({ success: false, msg: "Customer not found" });

        res.json({ success: true, msg: "Customer updated", customer });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ success: false, msg: "Customer not found" });

        res.json({ success: true, msg: "Customer deleted" });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
