const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");
async function readContacts () {
    const data = await fs.readFile(contactsPath, {encoding: "utf-8"});
    console.log(data);
    return JSON.parse(data);
}

function writeContacts (contacts) {
    return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2))
}

async function listContacts() {
    const contacts = await readContacts();
    return contacts;
}

async function getContactById(id) {
    const contacts = await readContacts();

    const contact = contacts.find((contact) => contact.id === id);
   
    return contact;
}

async function removeContact(id) {
    const contacts = await readContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
 
    if (index === -1){
        return null;
    }
    const newContacts = [...contacts.slice(0, index), ...contacts.slice(index+1)];

    await writeContacts(newContacts);
    return contacts[index];
}

async function addContact(contact) {
const contacts = await readContacts();
const newContact = {...contact, id: crypto.randomUUID()};

contacts.push(newContact);
await writeContacts (contacts);
return newContact;
}

async function updateContactById(id, contact){
    const contacts = await readContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1){
        return null
    }
    contacts[index] = {id, ...contact};
    await writeContacts(contacts);
    return contacts[index];
}




module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContactById,
    writeContacts,
    readContacts
};