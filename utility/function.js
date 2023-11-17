const fs = require("fs");
//const validator = require("validator");

// Membuat folder "data" jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Membuat file "contacts.json" jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// mengambil data yang disimpan di file.json
const ambilData = () => {
  const file = fs.readFileSync(dataPath, "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

// menampilkan detail data
const findData = (nama) => {
  const contacts = ambilData();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};

// menyimpan data json ke variabel saveData
const saveData = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts));
};

// menambahkan data contact
const tambahData = (contact) => {
  const contacts = ambilData();
  contacts.push(contact);
  saveData(contacts);
};

// function untuk delete data
const hapusData = (nama) => {
  const contacts = ambilData();
  const contact = contacts.filter((contact) => contact.nama !== nama);
  saveData(contact);
};

// function untuk update data
const updateData = (newContact) => {
  const contacts = ambilData();
  const contactFilter = contacts.filter((contact) => contact.nama !== newContact.oldNama);
  delete newContact.oldNama;
  contactFilter.push(newContact);
  saveData(contactFilter);
};

// membuat validator nama, jika data nama sudah tersedia
const cekNama = (nama) => {
  const contacts = ambilData();
  return (contact = contacts.find((contact) => contact.nama === nama));
};

module.exports = { findData, ambilData, tambahData, cekNama, hapusData, updateData };
