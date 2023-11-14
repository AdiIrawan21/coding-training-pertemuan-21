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
const detailData = (nama) => {
  const contacts = ambilData();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
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

module.exports = { detailData, ambilData, tambahData };
