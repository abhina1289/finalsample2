const Contact = require('../model/contactModel')

exports.submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body)
    const saved = await contact.save()
    res.json(saved)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
    res.json(contacts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
