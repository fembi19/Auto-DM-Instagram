const Nightmare = require('nightmare');
const username = '6289509133696';
const password = 'fni91199';

var XLSX = require('xlsx');
var workbook = XLSX.readFile('list.xlsx');
var xldata = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);

const nighmare = Nightmare({
    show: true,
    waitTimeout: 36000,
    goTimeout: 36000,
    loadTimeout: 36000,
    executionTimeout: 36000,
    webPreferences: {
        partition: 'nopersist',
        images: false,
    }
});

console.log('Mencoba Login Instagram');

nighmare
    .goto('http://instagram.com')
    .wait('input[name=username]')
    .insert('input[name=username]', username)
    .insert('input[name=password]', password)
    .click('button[type="submit"]')
    // .wait('input[placeholder=Search');
    .wait(3000);

nilai = 0;

function proses() {

    jml = xldata.length;
    nilai++;

    if (nilai > jml) {
        console.log("Data Excel Telah dikirim");
        console.log("Proses Selesai");
        process.exit();
    } else {
        namaid = xldata[nilai - 1].username;
        pesan = xldata[nilai - 1].pesan;

        nighmare
            .goto('https://instagram.com/' + namaid)
            .exists('h2[class="rkEop"]')
            .then(function (result) {
                if (result) {
                    console.log('\x1b[33m%s\x1b[0m', "Akun " + namaid + " Private ");
                    proses();
                } else {
                    return nighmare
                        .exists('h2[class="MCXLF"]') //cek akun dihapus/tidak
                        .then(function (cekakun) {
                            if (cekakun) {
                                console.log('\x1b[33m%s\x1b[0m', "Akun " + namaid + " dihapus ");
                                proses();
                            } else {

                                return nighmare
                                    .exists('h2[class="_7UhW9      x-6xq    qyrsm KV-D4          uL8Hv     l4b0S    "]') //cek url akun
                                    .then(function (tesakun) {
                                        if (tesakun) {
                                            console.log('\x1b[33m%s\x1b[0m', "Akun " + namaid + " Tidak ditemukan ");
                                            proses();
                                        } else {
                                            // console.log("Membuka pesan " + namaid);
                                            console.log("Mengirim " + namaid);
                                            return nighmare
                                                .wait(3000)
                                                .evaluate(function () {
                                                    document.getElementsByTagName("button")[0].click();
                                                })
                                                .wait(3000)
                                                .exists('button[class="_7UhW9   xLCgt       qyrsm KV-D4              fDxYl    T0kll "]')
                                                .then(function (cek) {
                                                    if (cek) {
                                                        // console.log("Mengirim " + namaid + "...");
                                                        return nighmare
                                                            .click('button[class="_7UhW9   xLCgt       qyrsm KV-D4              fDxYl    T0kll "]')
                                                            .wait('textarea[placeholder="Message..."]')
                                                            .type('textarea[placeholder="Message..."]', pesan)
                                                            .type('textarea[placeholder="Message..."]', '\u000d')
                                                            .then(function () {
                                                                console.log('\x1b[32m%s\x1b[0m', namaid + " Terkirim");
                                                                proses();
                                                            })
                                                    } else {
                                                        // console.log("Mengirim " + namaid + "...");
                                                        return nighmare
                                                            .wait('textarea[placeholder="Message..."]')
                                                            .type('textarea[placeholder="Message..."]', pesan)
                                                            .type('textarea[placeholder="Message..."]', '\u000d')
                                                            .then(function () {
                                                                console.log('\x1b[32m%s\x1b[0m', namaid + " Terkirim");
                                                                proses();
                                                            })
                                                    }
                                                })
                                        }
                                    })
                            }
                        })

                }
            })
            .catch(function (error) {
                console.log(error);

            });
    }


}

nighmare
    .exists('input[placeholder=Search')
    .then(function (ceklogin) {
        if (!ceklogin) {
            console.log('\x1b[31m%s\x1b[0m', "Gagal Login, Koneksi Lambat Atau Data Salah");
            process.exit();
        } else {
            console.log("Berhasil login");
            console.log('Mendapatkan data Excel');
            console.log('Mulai Mengirim');
            proses();

        }
    });