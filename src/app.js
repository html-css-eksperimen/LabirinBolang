import Matter from 'matter-js';

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

let startWaktu = new Date().getTime();
let stopWaktu = new Date().getTime();
let isStarted = false;
let isGameSelesai = false;

let totalWaktu = 0;

const startTimer = () => {
    if (isStarted === false && isGameSelesai === false) {
        isStarted = true;
        startWaktu = new Date().getTime();
    }
};

const stopTimer = () => {
    isStarted = false;
    stopWaktu = new Date().getTime();

    const totalWaktuMs = stopWaktu - startWaktu;
    totalWaktu = Math.round(totalWaktuMs / 1000);
};

// const cellKotak = 10;
const cellHorizontal = 10;
const cellVertikal = 12;
const width = window.innerWidth;
const height = window.innerHeight;

// const unitLengthKotak = width / cellKotak;
const unitLengthX = width / cellHorizontal;
const unitLengthY = height / cellVertikal;

const engines = Engine.create();
// Matikan gravity
engines.world.gravity.y = 0;
const { world } = engines;
const render = Render.create({
    element: document.body,
    engine: engines,
    options: {
        wireframes: false,
        width,
        height,
    },
});

Render.run(render);
Runner.run(Runner.create(), engines);

// Tembok pembatas kanan kiri
const pembatasList = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, pembatasList);

// Fungsi acak labirin
const shuffleLabirin = arr => {
    const arrayData = arr;
    let counter = arrayData.length;

    while (counter > 0) {
        const indexAcak = Math.floor(Math.random() * counter);
        counter -= 1;

        // Tukar data antar index
        const tempData = arrayData[counter];
        arrayData[counter] = arrayData[indexAcak];
        arrayData[indexAcak] = tempData;
    }

    return arrayData;
};

// Array 3 x 3 , contohnya :
// false false false
// false false false
// false false false
// Membuat labirin dengan Array
// Array vertikal
const arrGridKerangka = Array(cellVertikal).fill(null);
// Array horizontal
const arrGrid = arrGridKerangka.map(() => {
    return Array(cellHorizontal).fill(false);
});

// console.log(arrGrid);

// Array garis vertikal
// buat baris dulu, lalu kolom
const arrVertikalGrid = Array(cellVertikal)
    .fill(null)
    .map(() => {
        return Array(cellHorizontal - 1).fill(false);
    });

// false false
// false false
// false false
// console.log(arrVertikalGrid);

// Array garis horizontal, buat baris dulu baru kolom
const arrHorizontalGrid = Array(cellVertikal - 1)
    .fill(null)
    .map(() => {
        // buat kolom
        return Array(cellHorizontal).fill(false);
    });

// false false false
// false false false
// console.log(arrHorizontalGrid);

// Membuat nilai posisi baris dan kolom acak
const startBaris = Math.floor(Math.random() * cellVertikal);
const startKolom = Math.floor(Math.random() * cellHorizontal);

// Dengan menggunakan continue tapi tidak cocok dengan ESLint
const hitungLangkahCellContinue = (row, column) => {
    // Jika telah mengunjungi cell dengan koordinat (row, column) maka kembali
    if (arrGrid[row][column]) {
        return;
    }

    // Tanda cell ini telah dikunjungi
    arrGrid[row][column] = true;

    // Susun daftar random acak dari cell tetangga
    // dimulai searah jarum jam, atas, kanan, bawah, kiri
    const neighboursCoord = [
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left'],
    ];

    const neighbourCoordAcak = shuffleLabirin(neighboursCoord);

    // Untuk setiap cell tetangga
    for (let i = 0; i < neighbourCoordAcak.length; i += 1) {
        const [nextRow, nextColumn, arahDirection] = neighbourCoordAcak[i];

        // Dengan menggunakan Continue
        // Cek apakah tetangga sudah melewati batas atau tidak
        if (
            nextRow < 0 ||
            nextRow >= cellVertikal ||
            nextColumn < 0 ||
            nextColumn >= cellHorizontal
        ) {
            // lanjutkan loop
            console.log('continue 1');
            // eslint-disable-next-line no-continue
            continue;
        }

        // Jika kita telah mengunjungi cell tetangga tersebut lanjutkan dengan mengunjungi tetangga berikutnya
        if (arrGrid[nextRow][nextColumn]) {
            // lanjutkan loop
            console.log('continue 2');
            // eslint-disable-next-line no-continue
            continue;
        }

        // Hapus tembok horizontal atau vertikal
        if (arahDirection === 'left') {
            arrVertikalGrid[row][column - 1] = true;
        } else if (arahDirection === 'right') {
            arrVertikalGrid[row][column] = true;
        } else if (arahDirection === 'up') {
            arrHorizontalGrid[row - 1][column] = true;
        } else if (arahDirection === 'down') {
            arrHorizontalGrid[row][column] = true;
        }

        hitungLangkahCellContinue(nextRow, nextColumn);
    }

    // Kunjungi cell berikutnya
};

const hitungLangkahCell = (row, column) => {
    // Jika telah mengunjungi cell dengan koordinat (row, column) maka kembali
    if (arrGrid[row][column]) {
        return;
    }

    // Tanda cell ini telah dikunjungi
    arrGrid[row][column] = true;

    // Susun daftar random acak dari cell tetangga
    // dimulai searah jarum jam, atas, kanan, bawah, kiri
    const neighboursCoord = [
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left'],
    ];

    const neighbourCoordAcak = shuffleLabirin(neighboursCoord);

    // Untuk setiap cell tetangga
    for (let i = 0; i < neighbourCoordAcak.length; i += 1) {
        const [nextRow, nextColumn, arahDirection] = neighbourCoordAcak[i];

        // Cek apakah tetangga sudah melewati batas atau tidak
        if (
            nextRow < 0 ||
            nextRow >= cellVertikal ||
            nextColumn < 0 ||
            nextColumn >= cellHorizontal
        ) {
            // tidak jalankan perintah apapun
        } else if (arrGrid[nextRow][nextColumn]) {
            // Jika kita telah mengunjungi cell tetangga tersebut lanjutkan dengan mengunjungi tetangga berikutnya
            // tidak jalankan perintah apapun
        } else {
            // Hapus tembok horizontal atau vertikal
            // True artinya menghapus tembok yang ada
            if (arahDirection === 'left') {
                arrVertikalGrid[row][column - 1] = true;
            } else if (arahDirection === 'right') {
                arrVertikalGrid[row][column] = true;
            } else if (arahDirection === 'up') {
                arrHorizontalGrid[row - 1][column] = true;
            } else if (arahDirection === 'down') {
                arrHorizontalGrid[row][column] = true;
            }

            hitungLangkahCell(nextRow, nextColumn);
        }
    }

    // Kunjungi cell berikutnya
};

hitungLangkahCell(startBaris, startKolom);

// Gambar kotak secara horizontal
// Susun garis horizontal untuk pembatas maze labirin
arrHorizontalGrid.forEach((valuerow, rowindex) => {
    // koordinat X = columnIndex x unit length +  unit length / 2
    // koordinat y = rowIndex x unit length + unit length
    valuerow.forEach((openwall, columnindex) => {
        if (openwall === false) {
            const koordX = columnindex * unitLengthX + unitLengthX / 2;
            const koordY = rowindex * unitLengthY + unitLengthY;

            const wallTembok = Bodies.rectangle(
                koordX,
                koordY,
                unitLengthX,
                10,
                {
                    isStatic: true,
                    label: 'wall',
                    render: {
                        fillStyle: '#525252',
                    },
                },
            );

            World.add(world, wallTembok);
        }
    });
});

// Susun garis vertikal untuk pembatas maze labirin
arrVertikalGrid.forEach((valuerow, rowindex) => {
    valuerow.forEach((openwall, columnindex) => {
        // koordinat x = column index x unit length + unit length
        // koordinat y = rowIndex x unit length + unit length / 2
        if (openwall === false) {
            const koordX = columnindex * unitLengthX + unitLengthX;
            const koordY = rowindex * unitLengthY + unitLengthY / 2;

            const wallTembokVertikal = Bodies.rectangle(
                koordX,
                koordY,
                10,
                unitLengthY,
                {
                    isStatic: true,
                    label: 'wall',
                    render: {
                        fillStyle: '#525252',
                    },
                },
            );

            World.add(world, wallTembokVertikal);
        }
    });
});

// Membuat kotak putih untuk Finish labirin
// koordX = width x unit length / 2
// koordY = height x unit length / 2
const createGoalPoint = () => {
    const koordX = width - unitLengthX / 2;
    const koordY = height - unitLengthY / 2;
    const goals = Bodies.rectangle(
        koordX,
        koordY,
        unitLengthX * 0.4,
        unitLengthY * 0.4,
        {
            isStatic: true,
            render: {
                fillStyle: '#52de97',
            },
            label: 'kotakgoalpoint',
        },
    );

    return goals;
};

World.add(world, createGoalPoint());

// Buat bola untuk berjalan di labirin
let bolaLabirin = {};
const createBall = () => {
    const koordX = unitLengthX / 2;
    const koordY = unitLengthY / 2;
    const radius = Math.min(unitLengthX, unitLengthY) / 4;

    bolaLabirin = Bodies.circle(koordX, koordY, radius, {
        render: {
            fillStyle: '#ff2e63',
        },
        label: 'bolalabirin',
    });

    World.add(world, bolaLabirin);
};

createBall();

const initListenerKeypress = () => {
    document.addEventListener('keydown', event => {
        const { keyCode } = event;
        const { x: velX, y: velY } = bolaLabirin.velocity;

        // console.log(velX, velY);

        if (keyCode === 37 || keyCode === 65) {
            // Gerak ke kiri
            startTimer();
            Body.setVelocity(bolaLabirin, { x: velX - 5, y: velY });
        } else if (keyCode === 38 || keyCode === 87) {
            // Gerak ke atas
            startTimer();
            Body.setVelocity(bolaLabirin, { x: velX, y: velY - 5 });
        } else if (keyCode === 39 || keyCode === 68) {
            // Gerak ke kanan
            startTimer();
            Body.setVelocity(bolaLabirin, { x: velX + 5, y: velY });
        } else if (keyCode === 40 || keyCode === 83) {
            // Gerak ke bawah
            startTimer();
            Body.setVelocity(bolaLabirin, { x: velX, y: velY + 5 });
        } else {
            // Keycode tidak ada untuk gerak tombol arah
            console.log('Keycode salah langkah');
        }
    });
};

initListenerKeypress();

const setStatusMenang = () => {
    if (isGameSelesai === false) {
        isGameSelesai = true;

        stopTimer();

        const winnerEl = document.querySelector('.kontainer');
        winnerEl.classList.remove('hidden');

        const pElementKeterangan = document.createElement('p');
        pElementKeterangan.innerText = `Selamat anda telah menang! Waktu anda adalah ${totalWaktu} detik.`;

        const menangEl = document.querySelector('.kotakmenang');
        menangEl.innerHTML = '';
        menangEl.appendChild(pElementKeterangan);
    }
};

// Kondisi menang jika bola ke arah finish
Events.on(engines, 'collisionStart', event => {
    const pairColl = event.pairs;
    const labels = ['kotakgoalpoint', 'bolalabirin'];

    pairColl.forEach(collision => {
        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            setStatusMenang();

            world.gravity.y = 1;
            world.bodies.forEach(bodys => {
                if (bodys.label === 'wall') {
                    Body.setStatic(bodys, false);
                }
            });
        }
    });
});
