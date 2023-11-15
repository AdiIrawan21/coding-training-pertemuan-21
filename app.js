const express = require("express"); // import module express.js
const app = express(); // membuat aplikasi express
const expressLayouts = require("express-ejs-layouts"); // import module express-ejs-layouts
const host = "localhost";
const port = 3000; // konfigurasi port
const { ambilData, detailData, tambahData, cekNama } = require("./utility/function"); //import module function.js
const { body, validationResult } = require("express-validator"); // import module express validator, untuk melakukan unique pada data nama

app.set("view engine", "ejs"); //informasi menggunakan ejs
app.use(expressLayouts); // Mengaktifkan fitur layout
app.use(express.static("views")); // untuk memanggil folder/file css, javascript.
app.use(express.urlencoded({ extended: true })); //menggunakan middleware express.urlencoded().

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
app.post(
  "/contact",
  // melakukan pengecekan data nama, jika data nama sudah tersedia di daftar contact.json
  [
    body("nama").custom((value) => {
      const cek = cekNama(value); // deklarasi variabel cek untuk mengetahui apakah ada duplikat atau tidak
      console.log(cek);

      // melakukan pengkondisian pada variabel cekNama
      if (cek) {
        throw new Error("Data Nama sudah terdaftar."); // jika nama yang diinputkan pada form sudah terdaftar maka akan muncul pesan
      } else {
        return true; // jika belum terdaftar, maka akan mengembalikan nilai true
      }
    }),
  ],
  (req, res) => {
    const errors = validationResult(req); // akan mengambil hasil validasi dari middleware express-validator.
    //akan memeriksa apakah objek errors kosong. Jika tidak kosong, berarti ada kesalahan validasi.
    if (!errors.isEmpty()) {
      title = "Page Add Contact";
      res.render("add-contact", {
        layout: "layout/main",
        errors: errors.array(), // akan merender tampilan "add-contact" lagi, dengan meneruskan array kesalahan validasi ke tampilan.
      });
    } else {
      // jika tidak, akan memanggil fungsi tambahData() untuk menambahkan data kontak baru ke contacts.json
      tambahData(req.body);
      res.redirect("/contact");
    }
  }
);

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
