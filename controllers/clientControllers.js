// controllers/clientControllers.js
const Client = require('../models/client.model');

// Create a new client
exports.createClient = async (req, res) => {
  const { name, company, email, phone } = req.body;

  try {
    const client = new Client({
      name,
      company,
      email,
      phone,
      createdBy: req.user._id
    });

    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create client', error: err.message });
  }
};

// Get all clients (admin or owner)
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user._id });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch clients', error: err.message });
  }
};

// Get single client by ID
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Optional: check if the client belongs to the logged-in user
    if (client.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get client', error: err.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, company, email, phone } = req.body;

    client.name = name || client.name;
    client.company = company || client.company;
    client.email = email || client.email;
    client.phone = phone || client.phone;

    const updated = await client.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
};

// Delete client (admin only)
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.deleteOne();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client', error: err.message });
  }
};
