const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');
const ObjectID = require("bson-objectid");

async function listContacts() {
    try {
        const result = await fs.readFile(contactsPath)
        return await JSON.parse(result);
    } catch (e) {
        console.log(e.message)
    }
}

async function getContactById(contactId) {
    const contacts = await listContacts()
    const result = await contacts.find((item) => item.id === contactId)
    if (!result) return null;
    return result;
}

async function removeContact(contactId) {
    const contacts = await listContacts()
    const idx = contacts.findIndex((item) => item.id === contactId);
    if (idx === -1) return null;
    const [result] = contacts.splice(idx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const newContact = [...contacts, { id: ObjectID(), name, email, phone }];

        const contactsList = JSON.stringify(newContact, null, '\t');
        await fs.writeFile(contactsPath, contactsList, 'utf-8');
    } catch (e) {
        console.log(e.message)
    }
  }

  

module.exports = {listContacts, removeContact, addContact, getContactById}