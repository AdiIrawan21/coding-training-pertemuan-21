const express = require("express"); // import module express.js
const app = express(); // membuat aplikasi express
const expressLayouts = require("express-ejs-layouts"); // import module express-ejs-layouts
const host = "localhost";
const port = 3001; // konfigurasi port
const { ambilData, detailData, tambahData } = require("./utility/function"); //import module function.js yang berisi file contact.json

app.set("view engine", "ejs"); //informasi menggunakan ejs

app.use(expressLayouts); // Mengaktifkan fitur layout

app.use(express.static("views")); // untuk memanggil folder/file css, javascript.
app.use(express.urlencoded()); //menggunakan middleware express.urlencoded().

// route ke halaman index/home
app.get("/", (req, res) => {
  // merender view index.ejs untuk route  ("/")
  res.render("index", {
    title: "Page Home",
    layout: "layout/main",
  });
});

// route ke halaman about
app.get("/about", (req, res) => {
  // merender view about.ejs untuk route  ("/about")
  res.render("about", {
    title: "Page About",
    layout: "layout/main",
  });
});

// route ke halaman contact
app.get("/contact", (req, res) => {
  //load data
  const contacts = ambilData();

  // Mengecek apakah variabel `contacts` kosong
  if (contacts.length === 0) {
    // Jika variabel `contacts` kosong, maka render halaman `contact.ejs`
    // dengan data `contacts` yang bernilai `null` dan pesan "Data tidak tersedia"
    res.render("contact", {
      title: "Page Contact",
      layout: "layout/main",
      // contacts: null,
      pesan: "Data tidak tersedia",
    });
  } else {
    // Jika variabel `contacts` tidak kosong, maka render halaman `contact.ejs`
    // dengan data `contacts` yang sudah terisi
    res.render("contact", {
      title: "Page Contact",
      layout: "layout/main",
      contacts,
    });
  }
});

// route ke halaman add data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Page Add Contact",
    layout: "layout/main",
  });
});

//data contact proccess
app.post("/contact", (req, res) => {
  tambahData(req.body);
  res.redirect("/contact");
});

// route ke halaman detail dari contact
app.get("/contact/:nama", (req, res) => {
  const contact = detailData(req.params.nama);

  res.render("detail", {
    contact,
    title: "Page Detail Contact",
    layout: "layout/main",
  });
});

// route error handling jika tidak sesuai, maka akan menampilkan page not found
app.use("/", (req, res) => {
  res.status(404);
  res.send("Page not found : 404");
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`); // menampilkan pesan bahwa port sedang berjalan
});
