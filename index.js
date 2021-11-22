const Nightmare = require('nightmare');
const username = '6289509133696';
const password = 'fni91199';

var XLSX = require('xlsx');
var workbook = XLSX.readFile('list.xlsx');
var xldata = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);

const nighmare = Nightmare({
    show: true,
    waitTimeout: 360000,
    goTimeout: 360000,
    loadTimeout: 360000,
    executionTimeout: 360000,
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
    .wait('input[placeholder=Search');

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
                    console.log("akun private");
                } else {
                    return nighmare
                        .exists('h2[class="MCXLF"]') //cek akun dihapus/tidak
                        .then(function (cekakun) {
                            if (cekakun) {
                                console.log("Akun dihapus");
                                proses();
                            } else {
                                console.log("Membuka pesan " + namaid);
                                return nighmare
                                    .wait(3000)
                                    .evaluate(function () {
                                        document.getElementsByTagName("button")[0].click();
                                    })
                                    .wait(3000)
                                    .exists('button[class="_7UhW9   xLCgt       qyrsm KV-D4              fDxYl    T0kll "]')
                                    .then(function (cek) {
                                        if (cek) {
                                            console.log("Mengirim " + namaid + "...");
                                            return nighmare
                                                .click('button[class="_7UhW9   xLCgt       qyrsm KV-D4              fDxYl    T0kll "]')
                                                .wait('textarea[placeholder="Message..."]')
                                                .type('textarea[placeholder="Message..."]', pesan)
                                                .type('textarea[placeholder="Message..."]', '\u000d')
                                                .then(function () {
                                                    proses();
                                                })
                                        } else {
                                            console.log("Mengirim " + namaid + "...");
                                            return nighmare
                                                .wait('textarea[placeholder="Message..."]')
                                                .type('textarea[placeholder="Message..."]', pesan)
                                                .type('textarea[placeholder="Message..."]', '\u000d')
                                                .then(function () {
                                                    console.log("Terkirim");
                                                    proses();
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

proses();


// if (nilai == xldata.length) {
//     console.log("Tugas telah selesai");
// }

// function balik() {
//     nighmare
//         .goto('https://instagram.com/' + xldata[nilai].username)
//         .exists('h2[class="rkEop"]')
//         .then(function (result) {
//             nilai++;
//             if (result) {
//                 console.log("akun private");
//                 balik();
//             } else {
//                 return nighmare
//                     .exists('h2[class="MCXLF"]') //cek akun dihapus/tidak
//                     .then(function (cekakun) {
//                         if (cekakun) {
//                             console.log("Akun dihapus");
//                             balik();
//                         } else {
//                             console.log("siap kirim pesan");
//                             return nighmare
//                                 .wait(3000)
//                                 .evaluate(function () {
//                                     document.getElementsByTagName("button")[0].click();
//                                 })
//                                 .wait(3000)
//                                 .exists('button[class="_7UhW9   xLCgt       qyrsm KV-D4              fDxYl    T0kll "]')
//                                 .then(function (cek) {
//                                     if (cek) {
//                                         return nighmare
//                                             .click('button[class="_7UhW9   xLCgt       qyrsm KV-D4              fDxYl    T0kll "]')
//                                             .wait('textarea[placeholder="Message..."]')
//                                             // .type('textarea[placeholder="Message..."]', xldata2[nilai].pesan)
//                                             .type('textarea[placeholder="Message..."]', 'Testing Pesan')
//                                             .type('textarea[placeholder="Message..."]', '\u000d')
//                                             .then(function () {
//                                                 balik();
//                                             })
//                                     } else {
//                                         return nighmare
//                                             .wait('textarea[placeholder="Message..."]')
//                                             // .type('textarea[placeholder="Message..."]', xldata2[nilai].pesan)
//                                             .type('textarea[placeholder="Message..."]', 'Testing Pesan')
//                                             .type('textarea[placeholder="Message..."]', '\u000d')
//                                             .then(function () {
//                                                 balik();
//                                             })
//                                     }
//                                 })
//                         }
//                     })

//             }
//         })
//         .catch(function (error) {
//             console.log(error);

//         });

// }
// balik();