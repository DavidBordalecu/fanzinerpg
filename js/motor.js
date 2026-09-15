/* ============================================================
   Fanzines de Bolsillo — motor de aventura de texto (estilo Zork)
   Incluye: parseo de comandos, estado del mundo y generación
   procedural de imágenes SVG para cada escena.
   ============================================================ */

"use strict";

/* ---------- utilidades ---------- */

const normalizar = s =>
  s.toLowerCase()
   .replace(/[áàâä]/g, "a").replace(/[éèêë]/g, "e")
   .replace(/[íìîï]/g, "i").replace(/[óòôö]/g, "o")
   .replace(/[úùûü]/g, "u").replace(/ñ/g, "n");

/* ---------- paletas por familia visual ---------- */

const PALETAS = {
  fantasy: {
    fondo:  ["#241a4d", "#0b0720"],   // cielo
    piedra: ["#5c5478", "#2f2a45"],
    piedra2: "#3a3453",
    madera: "#6b4226",
    oro:    "#f0c060",
    luz:    "#ffe9a8",
    acento: "#a35ce6",
    humo:   "#7a6fb0",
  },
  scifi: {
    fondo:  ["#072033", "#01040c"],
    metal:  ["#20303f", "#0a121c"],
    metal2: "#12222e",
    panel:  "#0d5a73",
    neon:   "#2be6ff",
    caliente:"#ff9d3c",
    vidrio: "#123f52",
  },
  lovecraft: {
    fondo:  ["#220808", "#0d0204"],
    madera: ["#3a1717", "#1c0809"],
    muro:   "#4a2323",
    carmin: "#c8102e",
    vela:   "#ffb566",
    humo:   "#6b3b3b",
    palido: "#e8c9b0",
  },
  yermo: {
    fondo:  ["#4a3520", "#170e07"],
    hormigon:["#6b5840", "#33281a"],
    hierro: "#54411f",
    sol:    "#d96c2c",
    ceniza: "#8a7a60",
    debil:  "#f0c98a",
  },
};

/* ---------- ayudantes mini-SVG ---------- */

function r(x, y, w, h, fill, extra) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra || ""}/>`;
}
function c(cx, cy, rad, fill, extra) {
  return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" ${extra || ""}/>`;
}
function p(d, fill, extra) {
  return `<path d="${d}" fill="${fill}" ${extra || ""}/>`;
}
function t(x, y, s, fill, fs, extra) {
  const e = extra ? " " + extra : "";
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="'Courier New',monospace" font-size="${fs}" ${e}>${s}</text>`;
}

/* ---------- esquemas de escena ---------- */

const ARTE = {

  /* Fachada nocturna de torre con portal abierto (fantasy: cima) */
  cima: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[0]));
    L.push(r(0, 220, 900, 80, P.fondo[1]));
    L.push(p("M0 250 L120 130 L240 250 Z", P.piedra2));
    L.push(p("M640 250 L760 150 L860 250 Z", P.piedra2));
    L.push(r(0, 240, 900, 60, "#0d091d"));
    // portal de energía
    L.push(c(450, 150, 92, "rgba(163,92,230,.18)"));
    L.push(c(450, 150, 74, "rgba(240,192,96,.25)"));
    L.push(c(450, 150, 52, P.oro));
    L.push(c(450, 150, 40, "#fff6da"));
    L.push(p("M450 84 A66 66 0 0 1 516 150", "none", 'stroke="#f0c060" stroke-width="5"'));
    L.push(p("M450 216 A66 66 0 0 1 384 150", "none", 'stroke="#f0c060" stroke-width="5"'));
    // silueta del mago
    L.push(p("M450 190 L450 168 M450 168 C432 168 428 150 418 140 M450 168 C468 168 472 150 482 140", "none", 'stroke="#120b24" stroke-width="4"'));
    L.push(c(450, 208, 30, "rgba(18,11,36,.9)"));
    L.push(c(420, 138, 6, "#0b071a"));
    L.push(c(480, 138, 6, "#0b071a"));
    L.push(t(450, 292, "EL PORTAL DEL ARCHIMAGO", P.oro, 16, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Interior de torre circular de piedra */
  torre: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(p("M0 0 L900 0 L900 236 Q450 300 0 236 Z", P.piedra[0]));
    L.push(c(450, 215, 240, P.piedra[1]));
    L.push(c(450, 215, 176, P.piedra2));
    L.push(c(450, 215, 148, P.fondo[1]));
    // ventana arqueada con luna
    L.push(p("M150 96 L150 170 Q150 206 186 206 L286 206 Q322 206 322 170 L322 96 Q322 74 300 74 L172 74 Q150 74 150 96 Z", P.piedra2));
    L.push(p("M164 96 L164 170 Q164 192 186 192 L286 192 Q308 192 308 170 L308 96 Z", "#1a1440"));
    L.push(c(250, 130, 26, P.luz));
    L.push(c(262, 122, 6, "#d9a441"));
    L.push(c(240, 140, 4, "#d9a441"));
    // estantería
    L.push(r(560, 130, 150, 130, P.madera));
    for (let i = 0; i < 4; i++) L.push(r(566, 138 + i * 30, 138, 24, P.piedra2));
    for (let i = 0; i < 4; i++) L.push(r(570, 142 + i * 30, 130, 16, i % 2 ? P.acento : P.oro));
    L.push(r(600, 265, 120, 8, P.piedra2));
    // suelo
    L.push(p("M0 260 L900 260 L900 300 L0 300 Z", P.piedra2));
    for (let x = 0; x < 900; x += 60) L.push(r(x, 262, 58, `${80 + Math.sin(x) * 10}`, "rgba(0,0,0,.18)"));
    return L.join("");
  },

  /* Biblioteca: estanterías y mesa */
  biblioteca: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(r(0, 0, 900, 90, P.piedra[0]));
    // dos estanterías grandes
    [[40, 90], [620, 90]].forEach(([x, y]) => {
      L.push(r(x, y, 240, 200, P.madera));
      for (let i = 0; i < 5; i++) L.push(r(x + 10, y + 16 + i * 36, 220, 30, P.piedra2));
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const c1 = [P.oro, P.acento, "#7fb069", "#c95d5d"][(i + j) % 4];
          L.push(r(x + 16 + j * 41, y + 20 + i * 36, 36, 12, c1, `ry="3"`));
        }
      }
    });
    // mesa central con vela
    L.push(r(350, 214, 200, 12, P.madera));
    L.push(r(366, 214, 14, 54, P.madera));
    L.push(r(520, 214, 14, 54, P.madera));
    L.push(r(380, 176, 40, 14, "#e8d9a8"));
    L.push(p("M410 176 Q430 130 452 176 Z", "#ffe9a8", 'opacity=".8"'));
    L.push(p("M410 176 Q430 160 452 176 Z", P.oro));
    L.push(r(900, 0, 0, 0, "none"));
    L.push(p("M0 268 L900 268 L900 300 L0 300 Z", P.piedra2));
    L.push(t(450, 292, "LA BIBLIOTECA DEL ARCHIMAGO", P.oro, 16, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Laboratorio de alquimia */
  laboratorio: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(r(0, 0, 900, 70, P.piedra[0]));
    // mesa de alquimia
    L.push(r(180, 210, 540, 14, P.madera));
    L.push(r(200, 224, 12, 40, P.madera));
    L.push(r(440, 224, 12, 40, P.madera));
    L.push(r(690, 224, 12, 40, P.madera));
    // frascos / alambique
    L.push(p("M250 210 L250 160 C250 140 288 140 288 160 L288 210 Z", "#cfe8f0", 'opacity=".8"'));
    L.push(p("M250 210 L250 176 C250 160 288 160 288 176 L288 210 Z", "#3fbf6f"));
    L.push(p("M380 210 L400 150 L420 210 Z", "#d8d2c0"));
    L.push(c(400, 138, 12, "#d8d2c0"));
    L.push(c(400, 138, 7, "#7fd0a0"));
    L.push(p("M540 210 L540 170 L566 170 L566 210 Z", "#ffd9a0", 'opacity=".85"'));
    L.push(p("M520 210 L582 210 C582 226 520 226 520 210 Z", "#e8b44f"));
    // humo
    L.push(c(560, 120, 16, P.humo, 'opacity=".35"'));
    L.push(c(566, 100, 12, P.humo, 'opacity=".25"'));
    // pozo de escalera de piedra a la derecha
    L.push(p("M760 300 L760 190 L880 120 L900 120 L900 300 Z", P.piedra2));
    L.push(p("M760 300 L820 250 L880 300 Z", P.piedra[1]));
    L.push(t(450, 292, "LABORATORIO DE ALQUIMIA", P.oro, 16, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Pasillo de nave con ventana circular al espacio */
  pasillo: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[0]));
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    // paredes con paneles
    L.push(r(0, 0, 900, 46, P.metal[0]));
    L.push(r(0, 254, 900, 46, P.metal[0]));
    for (let x = 0; x < 900; x += 90) {
      L.push(r(x + 4, 46, 86, 208, P.metal[1], `stroke="#1d3344" stroke-width="2"`));
      L.push(c(x + 47, 170, 16, "#0a1820", `stroke="${P.neon}" stroke-width="2" opacity=".7"`));
    }
    // ventana espacial
    L.push(c(450, 150, 88, "#01040c", `stroke="${P.neon}" stroke-width="6"`));
    L.push(c(450, 150, 86, P.fondo[0]));
    L.push(c(520, 120, 10, P.debil || "#d8e8f0"));
    L.push(ARTE._estrellas(430, 160));
    // suelo
    for (let x = 0; x < 900; x += 150) L.push(r(x, 262, P.hormigon? 0 : 140, 3, P.neon, 'opacity=".25"'));
    L.push(p("M0 276 L900 276 L900 300 L0 300 Z", P.metal[1]));
    L.push(t(450, 292, "CORREDOR PRINCIPAL — VORAGO", P.neon, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  _estrellas(cx, cy) {
    let s = "";
    for (let i = 0; i < 14; i++) {
      const a = i * 1.7 % Math.PI * 2 * (i % 2 ? 1 : 0.6) + i;
      const rx = Math.cos(a) * (20 + i * 3.4);
      const ry = Math.sin(a) * (10 + i * 1.8);
      s += c(cx + rx, cy + ry, i % 3 ? 1.2 : 2, "#eaf6ff", 'opacity=".8"');
    }
    return s;
  },

  /* Puente de mando con consolas */
  puente: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[0]));
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(p("M0 300 L430 60 L470 60 L900 300 Z", P.metal[0]));
    L.push(p("M60 300 L450 110 L470 110 L60 300 Z", "none", `stroke="${P.neon}" stroke-width="3" opacity=".5"`));
    // pantalla principal
    L.push(r(330, 90, 240, 130, "#041018", `stroke="${P.panel}" stroke-width="5"`));
    L.push(ARTE._pantalla(330, 90, P));
    // consolas laterales
    [[60, 190], [620, 190]].forEach(([x, y]) => {
      L.push(r(x, y, 220, 70, P.metal[1], `stroke="#1d3344" stroke-width="3"`));
      L.push(r(x + 20, y + 14, 70, 30, P.panel, `rx="4"`));
      L.push(r(x + 108, y + 14, 90, 30, P.panel, `rx="4"`));
      for (let i = 0; i < 6; i++) L.push(c(x + 24 + i * 34, y + 56, 6, i % 3 ? P.neon : "#203947", 'opacity=".9"'));
    });
    L.push(r(0, 254, 900, 46, P.metal[0]));
    L.push(t(450, 292, "PUENTE DE MANDO", P.neon, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  _pantalla(x, y, P) {
    let s = r(x + 14, y + 14, 212, 102, "#06242f");
    s += t(x + 24, y + 36, "ESTADO VORAGO", P.neon, 13);
    s += t(x + 24, y + 60, "REACTOR: CRITICO", P.caliente || P.oro, 13);
    s += t(x + 24, y + 82, "ESCUDOS: 04%", P.neon, 13);
    s += t(x + 24, y + 104, "BUSCANDO SE&#209;AL…", "#5f8f68", 13);
    for (let i = 0; i < 4; i++) s += r(x + 120 + i * 22, y + 40 + i * 8, 70, 3, P.neon, 'opacity=".3"');
    return s;
  },

  /* Sala de máquinas */
  maquinas: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(r(0, 0, 900, 300, P.metal[0]));
    // tuberías grandes
    L.push(r(0, 20, 900, 54, P.metal[1], `stroke="${P.panel}" stroke-width="3"`));
    L.push(r(30, 20, 900, 54, "none", `stroke="#1d3344" stroke-width="2"`));
    L.push(p("M260 74 L260 150 L180 150 L180 260 L320 260", "none", `stroke="${P.metal[1]}" stroke-width="16"`));
    L.push(p("M240 74 L240 130 L160 130 L160 260 L340 260", "none", `stroke="${P.neon}" stroke-width="3" opacity=".6"`));
    L.push(p("M600 74 L600 190 L720 190 L720 260", "none", `stroke="${P.metal[1]}" stroke-width="16"`));
    // generador central con calor
    L.push(c(450, 190, 66, P.metal[1], `stroke="${P.caliente}" stroke-width="5"`));
    L.push(c(450, 190, 40, "#180b07"));
    L.push(c(450, 190, 22, P.caliente));
    L.push(c(450, 190, 10, "#ffe0b0"));
    for (let i = 0; i < 8; i++) {
      const a = i * 45 * Math.PI / 180;
      L.push(c(450 + Math.cos(a) * 55, 190 + Math.sin(a) * 55, 4, "#0d5a73"));
    }
    // válvulas
    [[120, 280], [780, 280]].forEach(([x, yy]) => {
      L.push(c(x, yy, 12, P.caliente, `stroke="#0a121c" stroke-width="3"`));
      L.push(c(x, yy, 4, "#0a121c"));
    });
    L.push(r(0, 270, 900, 30, P.metal[0]));
    L.push(t(450, 292, "SALA DE MAQUINAS", P.neon, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Salas de criogenia */
  crios: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[0]));
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(r(0, 0, 900, 42, P.metal[0]));
    // capsulas de criogenia
    for (let i = 0; i < 2; i++) {
      const x = 90 + i * 420;
      L.push(p(`M${x} 70 L${x + 140} 70 L${x + 170} 220 L${x - 30} 220 Z`, P.metal[1], `stroke="${P.panel}" stroke-width="4"`));
      L.push(p(`M${x + 8} 86 L${x + 132} 86 L${x + 156} 204 L${x - 16} 204 Z`, "#06202c", `stroke="${P.neon}" stroke-width="2" opacity=".7"`));
      L.push(c(x + 70, 130, 26, "#0a2c3c", `stroke="${P.neon}" stroke-width="2"`));
      L.push(c(x + 66, 126, 6, "#bfe8f5"));
      for (let j = 0; j < 4; j++) L.push(c(x + 40 + j * 20, 220, 3, j % 2 ? P.neon : "#203947"));
    }
    L.push(p("M0 0 L900 0 L900 24 L0 24 Z", P.metal[0]));
    L.push(r(0, 258, 900, 42, P.metal[0]));
    L.push(t(450, 292, "CAMARA DE CRIOGENIA", P.neon, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Mercado saqueado (yermo) */
  mercado: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.hormigon[1]));
    // tinglados
    L.push(p("M40 300 L40 90 L180 60 L320 90 L320 300 Z", P.hierro));
    L.push(r(60, 110, 240, 180, "#241708"));
    L.push(r(76, 126, 208, 12, P.hormigon[0]));
    L.push(r(76, 154, 208, 12, P.hormigon[0]));
    L.push(r(76, 182, 208, 12, P.hormigon[0]));
    // puestos revueltos
    L.push(r(420, 210, 130, 14, P.madera || P.hierro));
    L.push(r(436, 224, 10, 26, P.hierro));
    L.push(r(524, 224, 10, 26, P.hierro));
    L.push(r(600, 200, 80, 90, P.hormigon[0], `stroke="#241708" stroke-width="3"`));
    L.push(r(620, 180, 40, 20, "#120c06"));
    // latas caidas
    for (let i = 0; i < 5; i++) L.push(c(470 + i * 14, 250 - i, 5, i % 2 ? P.sol : P.ceniza));
    // letrero de neón muerto
    L.push(r(700, 60, 160, 44, "#1c140c"));
    L.push(t(780, 90, "MERCADO 9", P.debil, 16, 'text-anchor="middle" letter-spacing="2"'));
    L.push(r(0, 0, 900, 18, P.fondo[0], 'opacity=".6"'));
    L.push(r(0, 282, 900, 18, P.fondo[1], 'opacity=".6"'));
    L.push(t(450, 292, "MERCADO DE LA AVENIDA", P.debil, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Bodega de carga */
  bodega: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(r(0, 0, 900, 300, P.metal[1]));
    for (let i = 0; i < 3; i++) {
      const y = 30 + i * 80;
      L.push(p(`M${40 + i * 20} ${y + 60} L${180 + i * 30} ${y} L${720 - i * 20} ${y} L${860 - i * 40} ${y + 60} Z`, P.metal[0], `stroke="#1d3344" stroke-width="2"`));
    }
    // contenedores apilados
    [[120, 120], [640, 120], [180, 196], [700, 196]].forEach(([x, y]) => {
      L.push(p(`M${x} ${y + 46} L${x + 26} ${y + 26} L${x + 150} ${y + 26} L${x + 150} ${y + 72} L${x + 124} ${y + 96} L${x} ${y + 96} Z`, P.panel, `stroke="${P.neon}" stroke-width="2" opacity=".8"`));
      L.push(p(`M${x} ${y + 46} L${x + 26} ${y + 26} L${x + 46} ${y + 36} L${x + 20} ${y + 56} Z`, "#0a1820"));
    });
    // vellos bichos de luz punzantes (señal)
    for (let i = 0; i < 6; i++) L.push(c(120 + i * 130, 62 + (i % 2) * 70, 3, P.neon, `opacity=".5"`));
    L.push(r(0, 258, 900, 42, P.metal[0]));
    L.push(t(450, 290, "BODEGA DE CARGA", P.neon, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Salón victoriano (horror) */
  salon: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[0]));
    L.push(r(0, 0, 900, 300, P.muro));
    // papel tapiz
    for (let x = 0; x < 900; x += 60) { L.push(r(x, 0, 30, 300, "rgba(255,255,255,.04)")); }
    // chimenea
    L.push(r(120, 120, 180, 150, P.madera[0]));
    L.push(p("M120 120 L210 60 L300 120 Z", P.madera[1]));
    L.push(r(150, 160, 120, 110, "#120405"));
    L.push(p("M160 250 L160 180 Q210 170 260 180 L260 250 Z", "#1c0809"));
    L.push(p("M170 250 L170 196 Q210 188 250 196 L250 250 Z", P.carmin, 'opacity=".9"'));
    // cuadros
    L.push(r(420, 70, 120, 90, P.madera[1]));
    L.push(r(430, 80, 100, 70, "#160707"));
    L.push(t(480, 130, "…", P.palido, 44, 'text-anchor="middle"'));
    L.push(r(600, 70, 120, 90, P.madera[1]));
    L.push(r(610, 80, 100, 70, "#160707"));
    L.push(t(660, 130, "…", P.palido, 44, 'text-anchor="middle"'));
    // lámpara de araña apagada
    L.push(p("M400 0 L400 30 M320 30 L580 30 M320 30 L300 52 M580 30 L600 52", "none", 'stroke="#3a1717" stroke-width="3"'));
    L.push(r(120, 266, 180, 12, P.madera[0]));
    L.push(r(0, 278, 900, 22, P.fondo[1]));
    L.push(t(450, 292, "SALON DE LA CASA", P.carmin, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Estudio / biblioteca de horror */
  estudio: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.muro));
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    // estante de madera oscura con objetos raros
    [[40, 60], [620, 60]].forEach(([x, y]) => {
      L.push(r(x, y, 240, 210, P.madera[0]));
      for (let i = 0; i < 4; i++) L.push(r(x + 10, y + 18 + i * 48, 220, 38, P.madera[1]));
      // objetos raros en los estantes
      for (let j = 0; j < 4; j++) {
        const ox = x + 26 + j * 52;
        L.push(r(ox, y + 26 + (j % 3) * 0, 34, 12, j % 2 ? "#241015" : "#3a1717", `ry="3"`));
      }
    });
    L.push(p("M300 120 Q450 90 600 120", "none", `stroke="#5a2a2a" stroke-width="6" opacity=".5"`));
    // escritorio con libro abierto
    L.push(r(330, 200, 240, 12, P.madera[0]));
    L.push(r(348, 212, 10, 34, P.madera[0]));
    L.push(r(542, 212, 10, 34, P.madera[0]));
    L.push(p("M370 200 L370 176 Q450 168 530 176 L530 200 Z", "#c9b48a"));
    L.push(p("M374 194 L374 178 Q450 172 526 178 L526 194 Z", P.palido, 'opacity=".5"'));
    // ventana con luna roja
    L.push(p("M700 40 L700 200 Q700 224 676 224 L640 224 Q616 224 616 200 L616 40 Q616 20 640 20 L676 20 Q700 20 700 40 Z", P.madera[1]));
    L.push(c(658, 120, 28, P.carmin));
    L.push(c(658, 120, 36, "none", `stroke="#6b0d1f" stroke-width="4"`));
    L.push(r(0, 270, 900, 30, P.fondo[0]));
    L.push(t(450, 292, "ESTUDIO", P.carmin, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Sótano quejumbroso */
  sotano: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, "#120505"));
    L.push(p("M0 300 L900 300 L900 220 L0 180 Z", P.madera[1]));
    // escaleras ornamentadas a la derecha
    L.push(p("M760 200 L760 60 L890 30 L890 170 Z", P.madera[0]));
    for (let i = 0; i < 5; i++) L.push(r(768, 66 + i * 22, 96, 10, P.madera[1]));
    // barriles y cajas
    L.push(c(150, 220, 46, P.madera[0]));
    L.push(c(150, 220, 42, P.madera[1]));
    for (let i = 0; i < 3; i++) L.push(c(150, 220 + i * 0, 42 - i * 14, "rgba(0,0,0,.25)"));
    L.push(r(250, 180, 110, 90, P.madera[1]));
    L.push(r(286, 200, 40, 70, P.madera[0]));
    // humedad / charco
    L.push(p("M0 296 Q300 284 900 296 L900 300 L0 300 Z", "#2a1414", 'opacity=".8"'));
    // jarrones polvo
    L.push(r(520, 160, 60, 110, P.muro, `stroke="#1c0809" stroke-width="3"`));
    L.push(p("M520 170 C520 140 600 140 600 170", P.madera[0]));
    // vela lejana
    L.push(c(620, 150, 4, P.vela, 'opacity=".9"'));
    L.push(c(620, 146, 8, P.vela, 'opacity=".35"'));
    L.push(t(450, 292, "EL SOTANO DE LA CASA", P.carmin, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Cripta / altar del ritual */
  ritual: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.fondo[1]));
    L.push(p("M0 300 L700 200 L730 120 L760 200 L900 300 Z", P.madera[1]));
    L.push(p("M0 0 L900 0 L900 300 L0 300 Z", "none", `stroke="${P.carmin}" stroke-width="8" opacity=".3"`));
    // círculo ritual en suelo
    L.push(c(450, 210, 96, "none", `stroke="${P.carmin}" stroke-width="3" opacity=".8"`));
    L.push(c(450, 210, 70, "none", `stroke="${P.carmin}" stroke-width="2" opacity=".6"`));
    L.push(p("M450 114 L450 306 M354 210 L546 210 M382 142 L518 278 M518 142 L382 278", "none", `stroke="${P.carmin}" stroke-width="1.5" opacity=".5"`));
    // altar
    L.push(r(360, 150, 180, 26, "#170707", `stroke="${P.carmin}" stroke-width="3"`));
    L.push(r(376, 176, 12, 40, P.madera[0]));
    L.push(r(512, 176, 12, 40, P.madera[0]));
    // velas
    [[390, 150], [510, 150]].forEach(([x, y]) => {
      L.push(r(x - 5, y - 30, 10, 30, "#e8c9b0"));
      L.push(c(y % 2 ? x : x, y - 34, 5, P.vela));
      L.push(c(x, y - 38, 9, P.vela, 'opacity=".3"'));
    });
    L.push(c(450, 140, 8, P.carmin, 'opacity=".9"'));
    L.push(c(450, 130, 14, P.carmin, 'opacity=".4"'));
    L.push(t(450, 292, "EL ALTAR DE LA CASA", P.carmin, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Calle devastada (yermo) */
  calle: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.sol));
    L.push(r(0, 0, 900, 300, "#8a6a3a", 'opacity=".25"'));
    // silueta de edificios rotos
    L.push(p("M0 300 L0 60 L90 60 L90 130 L150 130 L150 60 L270 60 L270 300", "#241a10"));
    L.push(p("M620 300 L620 90 L700 90 L700 40 L900 40 L900 300", "#241a10"));
    for (let wy of [150, 200, 250]) L.push(r(30, wy, 60, 40, "#0e0a06", `stroke="#54411f" stroke-width="2"`));
    for (let wy of [150, 200, 250]) L.push(r(660, wy, 60, 40, "#0e0a06", `stroke="#54411f" stroke-width="2"`));
    // fuego lento
    L.push(c(430, 190, 8, P.sol));
    L.push(c(430, 178, 12, P.sol, 'opacity=".4"'));
    L.push(c(430, 168, 16, "#ffd77a", 'opacity=".25"'));
    // carretera
    L.push(r(0, 250, 900, 50, P.hormigon[1]));
    for (let x = 0; x < 900; x += 110) L.push(r(x, 272, 60, 5, P.ceniza));
    // polvo
    L.push(p("M0 292 Q220 282 470 290 T900 292 L900 300 L0 300 Z", P.ceniza, 'opacity=".5"'));
    L.push(t(450, 292, "LA AVENIDA MUERTA", P.debil, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Interior de refugio / estructura de hormigón */
  refugio: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.hormigon[1]));
    L.push(r(0, 0, 900, 300, "#26201a", 'opacity=".35"'));
    // muro de sacos
    L.push(p("M0 300 L0 150 L110 150 L110 120 L220 120 L220 300 Z", P.hormigon[0], `stroke="#0c0805" stroke-width="3"`));
    // panel de radio
    L.push(r(560, 70, 200, 140, "#120c06", `stroke="#54411f" stroke-width="4"`));
    L.push(r(578, 90, 80, 60, "#0a0704"));
    L.push(t(590, 110, "771 khz", P.sol, 13));
    L.push(t(590, 132, "SE&#209;AL: …", P.debil, 13));
    L.push(r(670, 90, 74, 60, "#0a0704"));
    L.push(t(678, 112, "R4", P.debil, 24, 'text-anchor="middle"'));
    L.push(c(590, 180, 8, P.sol, 'opacity=".8"'));
    L.push(r(576, 176, 28, 8, "#0a0704"));
    // catres
    L.push(r(120, 210, 200, 10, P.hierro));
    L.push(r(140, 220, 10, 34, P.hierro));
    L.push(r(290, 220, 10, 34, P.hierro));
    L.push(r(500, 210, 200, 10, P.hierro));
    L.push(r(520, 220, 10, 34, P.hierro));
    L.push(r(670, 220, 10, 34, P.hierro));
    // luz colgante
    L.push(p("M450 0 L450 40", "none", 'stroke="#54411f" stroke-width="3"'));
    L.push(c(450, 48, 16, P.sol, 'opacity=".7"'));
    L.push(p("M0 0 L900 0 L900 24 L0 24 Z", P.hormigon[0]));
    L.push(t(450, 292, "REFUGIO PROVISIONAL", P.debil, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Vagon abandonado del metro */
  vagon: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.hormigon[1]));
    // techo curvo
    L.push(p("M0 0 L900 0 L900 40 Q450 110 0 40 Z", P.hierro));
    for (let i = 0; i < 6; i++) L.push(p("M0 40 L900 40", "none", `stroke="#3a2c18" stroke-width="1" opacity=".6"`));
    // ventanas del vagon
    for (let i = 0; i < 4; i++) {
      const x = 90 + i * 190;
      L.push(r(x, 70, 140, 90, "#060403", `stroke="${P.hierro}" stroke-width="8"`));
      L.push(p(`M${x} 70 L${x} 160 L${x + 140} 160 L${x + 140} 70`, "none", `stroke="#241708" stroke-width="2"`));
    }
    // asientos
    for (let i = 0; i < 4; i++) {
      const x = 100 + i * 190;
      L.push(r(x, 200, 40, 60, P.hierro, `rx="8"`));
      L.push(r(x + 40, 208, 90, 8, P.sol, 'opacity=".5"'));
    }
    // grafiti
    L.push(t(250, 55, "EL FIN DEL CAMINO", P.carmin ? P.carmin : "#8b0f22", 18, 'letter-spacing="4"'));
    L.push(p("M780 210 L840 210 M810 200 Q795 210 800 226 M820 224 Q825 210 838 214", "none", `stroke="${P.sol}" stroke-width="3"`));
    L.push(r(0, 262, 900, 38, P.fondo[1]));
    L.push(t(450, 290, "VAGON 7 — METRO", P.debil, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Hospital / clínica militar */
  hospital: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.hormigon[1]));
    // camilla
    L.push(r(90, 150, 220, 16, P.hierro, `stroke="#241708" stroke-width="3"`));
    L.push(r(108, 166, 10, 44, P.hierro));
    L.push(r(282, 166, 10, 44, P.hierro));
    L.push(r(340, 160, 60, 16, P.sol, 'opacity=".6"'));
    // vitrinas
    L.push(r(520, 60, 120, 130, "#241708", `stroke="#54411f" stroke-width="3"`));
    L.push(r(530, 70, 100, 110, "#0e0a06"));
    L.push(r(530, 70, 100, 36, "#8a6a3a", 'opacity=".4"'));
    L.push(r(600, 60, 120, 130, "#241708", `stroke="#54411f" stroke-width="3"`));
    L.push(r(610, 70, 100, 110, "#0e0a06"));
    // cartel rojo
    L.push(r(60, 40, 140, 46, "#31140f"));
    L.push(t(130, 70, "URGENCIAS", P.debil, 16, 'text-anchor="middle" letter-spacing="2"'));
    // manchas de humo en el techo
    L.push(p("M0 0 L900 0 L900 34 L0 34 Z", "#1c140c"));
    L.push(t(450, 292, "HOSPITAL DE CAMPAÑA", P.debil, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },

  /* Puerto / garita exterior con letrero */
  garita: (P) => {
    const L = [];
    L.push(r(0, 0, 900, 300, P.sol));
    L.push(r(0, 0, 900, 300, "#571f14", 'opacity=".18"'));
    // destello del sol bajo
    L.push(c(710, 90, 46, P.sol, 'opacity=".8"'));
    L.push(c(710, 90, 64, P.sol, 'opacity=".35"'));
    // puerta de refugio
    L.push(p("M300 300 L300 90 L600 90 L600 300 Z", P.hormigon[0], `stroke="#2b2012" stroke-width="6"`));
    L.push(r(330, 110, 240, 190, P.hierro, `stroke="#0c0805" stroke-width="4"`));
    L.push(p("M330 110 L570 110 L570 300 L330 300 Z", "#241708"));
    L.push(c(540, 205, 6, P.debil));
    // farol
    L.push(p("M140 300 L140 140", "none", 'stroke="#241708" stroke-width="6"'));
    L.push(p("M120 140 L160 140 C160 170 120 170 120 140 Z", P.sol, 'opacity=".7"'));
    L.push(r(0, 280, 900, 20, P.ceniza, 'opacity=".5"'));
    L.push(t(450, 336, "", P.debil, 1));
    L.push(t(450, 284, "ENTRADA DEL REFUGIO 4", P.debil, 15, 'text-anchor="middle" letter-spacing="3"'));
    return L.join("");
  },
};

/* esquema por defecto */
ARTE.default = (P) => ARTE.pasillo(P);

/* ============================================================
   MOTOR
   ============================================================ */

class Motor {

  constructor(definicion) {
    this.def = definicion;
    this.familia = definicion.familia || "fantasy";
    this.P = PALETAS[this.familia];
    this.palabra = "";         // salida intercalada a la UI
    this._reset();
  }

  _reset() {
    const def = this.def;
    this.hab = def.inicio;
    this.inv = [];
    this.flags = {};
    this.turnos = 0;
    this.fin = false;
    this.resultado = null;   // "victoria" | null
    this.descripcionNueva = true;
    this._objetosEstado = {};
    for (const id in def.objetos) {
      const o = def.objetos[id];
      // ubicación: nombre de habitación | 'inv' | null (no presente)
      this._objetosEstado[id] = { ubicacion: o.inicio || null };
    }
  }

  reiniciar() {
    this._reset();
  }

  habActual() { return this.def.habitaciones[this.hab]; }

  habDescripcion() {
    const h = this.habActual();
    return typeof h.desc === "function" ? h.desc(this) : h.desc;
  }

arteActual() {
    const h = this.habActual();
    const esq = h.arte || this.def.arte || "default";
    const fn = ARTE[esq] || ARTE.default;
    const cuerpo = fn(this.P);
    const svg = `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${this._esc(h.nombre)}">${cuerpo}</svg>`;
    return { svg, nombre: h.nombre };
  }

  _esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /** objetos tomables que están en la habitación actual */
  objetosAqui() {
    return Object.keys(this._objetosEstado)
      .filter(id => this._objetosEstado[id].ubicacion === this.hab);
  }

  objetosEnInv() { return this.inv.slice(); }

  verObjeto(id) {
    return this.def.objetos[id];
  }

  hayObjeto(id) {
    return !!this._objetosEstado[id] && this._objetosEstado[id].ubicacion === this.hab;
  }

  /** algunos objetos se "revelan" cuando miras bien */
  revelar(id) {
    if (this._objetosEstado[id]) this._objetosEstado[id].ubicacion = this.hab;
  }

  /** coloca un objeto (o lo devuelve) en la habitación actual */
  colocar(id) {
    if (this._objetosEstado[id]) {
      this._objetosEstado[id].ubicacion = this.hab;
      this.inv = this.inv.filter(x => x !== id);
    }
  }

  /** consume un objeto: desaparece del mundo (usado en reactores, velas…) */
  consumir(id) {
    if (this._objetosEstado[id]) this._objetosEstado[id].ubicacion = null;
    this.inv = this.inv.filter(x => x !== id);
  }

  tomar(id) {
    if (!this.hayObjeto(id)) return false;
    this._objetosEstado[id].ubicacion = "inv";
    this.inv.push(id);
    return this.verObjeto(id);
  }

  dejar(id) {
    const i = this.inv.indexOf(id);
    if (i < 0) return false;
    this.inv.splice(i, 1);
    this._objetosEstado[id].ubicacion = this.hab;
  }

  setFlag(f) { this.flags[f] = true; }
  flag(f) { return !!this.flags[f]; }

  irA(id) {
    this.hab = id;
    this.descripcionNueva = true;
    this.turnos++;
  }

  ganar(texto, extra) {
    this.fin = true;
    this.resultado = "victoria";
    return texto;
  }

  perder(texto) {
    this.fin = true;
    this.resultado = "derrota";
    return texto;
  }

  /* ---------- ayudar ---------- */

  manualAyuda() {
    return [
      "Puedes escribir órdenes sencillas. Algunas ideas:",
      "  - ir NORTE / SUR / ESTE / OESTE   (o: n, s, e, o)",
      "  - subir / bajar",
      "  - mirar            (vuelves a observar la escena)",
      "  - tomar <cosa>     (guardar algo en tu mochila)",
      "  - dejar <cosa>",
      "  - usar <cosa>",
      "  - examinar <cosa>  (inspeccionar con detalle)",
      "  - hablar <alguien>",
      "  - inventario       (ver lo que llevas)",
      "  - abrir <puerta>   (si hay alguna cerca)",
      "",
      "Escribe lo que harías con tus propias palabras. Yo interpreto.",
    ].map(x => ({ clase: "hint", texto: x }));
  }

  /* ============================================================
     PARSER
     ============================================================ */

  procesar(frase) {
    const salida = [];
    this.turnos++;

    if (this.fin) {
      salida.push({ clase: "sys", texto: "(La aventura ha terminado. Pulsa REINICIAR para volver a empezar.)" });
      return salida;
    }

    const norm = normalizar(frase).replace(/[.,;:!?"]/g, " ").replace(/\s+/g, " ").trim();
    if (!norm) {
      salida.push({ clase: "hint", texto: "Escribe algo. ¿Quizás 'mirar'?" });
      return salida;
    }

    const tokens = norm.split(" ");
    const primero = tokens[0];

    const gracias = ["gracias", "ok", "vale", "bien", "si", "sí", "jaja", "xd", "perdon", "perdón"];
    if (gracias.includes(primero)) {
      salida.push({ clase: "aviso", texto: "— De nada. La aventura te espera." });
      return salida;
    }

    /* direcciones */
    const dir = this._dirDesde(norm, tokens);
    if (dir) {
      const res = this._mover(dir, tokens);
      salida.push(...res.lineas);
      if (res.movio) {
        this.descripcionNueva = false;
        this._describir(salida);
      }
      this._post(salida);
      return salida;
    }

    /* verbo genérico */
    const verbo = this._verbo(primero, norm);
    switch (verbo) {
      case "mirar": {
        const obj = this._buscarObjeto(norm);
        if (obj) {
          const o = this.verObjeto(obj);
          salida.push({ clase: "sys", texto: o.examinar || o.descripcion });
          const acc = this._accionObjetoFijo("examinar", tokens);
          if (acc) salida.push(...acc);
        } else {
          this._describir(salida);
        }
        break;
      }
      case "tomar": {
        const obj = this._buscarObjeto(norm);
        if (!obj) {
          salida.push({ clase: "mal", texto: "No veo aquí nada parecido que puedas tomar." });
        } else if (this.inv.includes(obj)) {
          salida.push({ clase: "aviso", texto: "Ya lo llevas contigo." });
        } else if (!this.hayObjeto(obj)) {
          salida.push({ clase: "mal", texto: "Eso no está aquí." });
        } else {
          const o = this.tomar(obj);
          salida.push({ clase: "bien", texto: o.alTomarTexto || ("Recoges " + o.nombre + ".") });
          if (o.alTomar) { const extra = o.alTomar(this); if (extra) salida.push(...extra); }
        }
        break;
      }
      case "dejar": {
        const obj = this._buscarObjeto(norm);
        if (!obj || !this.inv.includes(obj)) {
          salida.push({ clase: "mal", texto: "No llevas eso encima." });
        } else {
          this.dejar(obj);
          salida.push({ clase: "sys", texto: "Dejas " + this.verObjeto(obj).nombre + " en el suelo." });
        }
        break;
      }
      case "usar": {
        const obj = this._buscarObjeto(norm);
        const fijo = this._objFijoEnHab(tokens);
        if (fijo && fijo.on && fijo.on.usar) {
          const r = fijo.on.usar(this, tokens);
          salida.push(...r);
        } else if (obj) {
          const o = this.verObjeto(obj);
          if (this.inv.includes(obj) || this.hayObjeto(obj)) {
            if (o.alUsar) {
              const r = o.alUsar(this, tokens);
              if (r && r.length) salida.push(...r);
            } else {
              // si no tiene uso, puede usarse en el objeto fijo de la habitación
              const r2 = this._usarEnFijo(obj, tokens);
              if (r2) salida.push(...r2);
              else salida.push({ clase: "aviso", texto: "Usas " + o.nombre + ", pero no ocurre nada fuera de lo común." });
            }
          } else {
            salida.push({ clase: "mal", texto: "No tienes eso." });
          }
        } else {
          salida.push({ clase: "hint", texto: "¿Usar qué? Indica un objeto (ej: 'usar llave')." });
        }
        break;
      }
      case "examinar": {
        const obj = this._buscarObjeto(norm);
        if (obj) {
          const o = this.verObjeto(obj);
          salida.push({ clase: "sys", texto: o.examinar || o.descripcion });
        } else {
          const fijo = this._objFijoEnHab(tokens);
          if (fijo && fijo.on && fijo.on.examinar) {
            const r = fijo.on.examinar(this, tokens);
            salida.push(...r);
          } else {
            salida.push({ clase: "aviso", texto: "Examinas el lugar con calma… pero no distingues nada nuevo." });
          }
        }
        break;
      }
      case "abrir": {
        const fijo = this._objFijoEnHab(tokens);
        if (fijo && fijo.on && fijo.on.abrir) {
          const r = fijo.on.abrir(this, tokens);
          salida.push(...r);
        } else {
          salida.push({ clase: "aviso", texto: "No hay nada que abrir aquí." });
        }
        break;
      }
      case "inventario": {
        if (!this.inv.length) {
          salida.push({ clase: "sys", texto: "Llevas las manos vacías." });
        } else {
          salida.push({ clase: "tit", texto: "Llevas contigo:" });
          this.inv.forEach(id => salida.push({ clase: "sys", texto: "  · " + this.verObjeto(id).nombre }));
        }
        break;
      }
      case "hablar": {
        const npc = this._npcEnHab();
        if (npc) {
          const r = npc.hablar(this, tokens);
          salida.push(...r);
        } else {
          salida.push({ clase: "aviso", texto: "No hay nadie con quien hablar aquí." });
        }
        break;
      }
      case "atacar": {
        const npc = this._npcEnHab();
        if (npc && npc.atacar) {
          salida.push(...npc.atacar(this, tokens));
        } else {
          salida.push({ clase: "mal", texto: "No atacas a la nada. Respira." });
        }
        break;
      }
      case "buscar": {
        const h = this.habActual();
        if (h.alBuscar) {
          const r = h.alBuscar(this, tokens);
          salida.push(...r);
        } else {
          salida.push({ clase: "aviso", texto: "Lo inspeccionas con cuidado. No encuentras nada oculto." });
        }
        break;
      }
      case "leer": {
        const obj = this._buscarObjeto(norm);
        const o = obj ? this.verObjeto(obj) : null;
        if (o && o.alLeer && (this.inv.includes(obj) || this.hayObjeto(obj))) {
          const r = o.alLeer(this, tokens);
          if (r && r.length) salida.push(...r); else salida.push({ clase: "sys", texto: "Lees " + o.nombre + " con atención." });
        } else if (o) {
          const r2 = o.alUsar ? o.alUsar(this, tokens) : null;
          if (r2 && r2.length) salida.push(...r2);
          else salida.push({ clase: "aviso", texto: "No tiene texto que leer." });
        } else {
          salida.push({ clase: "hint", texto: "No hay nada que leer aquí." });
        }
        break;
      }
      case "beber": {
        const obj = this._buscarObjeto(norm);
        const o = obj ? this.verObjeto(obj) : null;
        if (o && o.alBeber && (this.inv.includes(obj) || this.hayObjeto(obj))) {
          const r = o.alBeber(this, tokens);
          if (r && r.length) salida.push(...r); else salida.push({ clase: "sys", texto: "Bebes " + o.nombre + "." });
        } else {
          salida.push({ clase: "hint", texto: "No hay nada que beber aquí." });
        }
        break;
      }
      case "comer": {
        const obj = this._buscarObjeto(norm);
        const o = obj ? this.verObjeto(obj) : null;
        if (o && o.alComer && (this.inv.includes(obj) || this.hayObjeto(obj))) {
          const r = o.alComer(this, tokens);
          if (r && r.length) salida.push(...r); else salida.push({ clase: "sys", texto: "Comes " + o.nombre + "." });
        } else {
          salida.push({ clase: "hint", texto: "No hay nada comestible a mano." });
        }
        break;
      }
      case "gritar": {
        if (this.familia === "lovecraft") {
          salida.push({ clase: "mal", texto: "Tu grito se apaga en la alfombra. Desde el piso de arriba oyes… el silencio de alguien que SONRÍE." });
        } else {
          salida.push({ clase: "aviso", texto: "Tu grito se pierde sin respuesta." });
        }
        break;
      }
      case "ayuda":
      default:
        if (verbo === "ayuda") { salida.push(...this.manualAyuda()); }
        else {
          salida.push({ clase: "aviso", texto: "No entiendo eso. Escribe 'ayuda' para ver qué puedes hacer." });
        }
    }

    /* descripción tras moverse o tras acciones que la requieran */
    if (this.descripcionNueva) {
      this._describir(salida);
      this.descripcionNueva = false;
    }

    this._post(salida);
    return salida;
  }

  /* ---------- direcciones y movimiento ---------- */

  _dirDesde(norm, tokens) {
    const primero = tokens[0];
    const dirWords = {
      norte: "norte", n: "norte", nor: "norte",
      sur: "sur", s: "sur",
      este: "este", e: "este", oeste: "oeste", o: "oeste",
      noreste: "noreste", ne: "noreste",
      noroeste: "noroeste", no: "noroeste",
      sureste: "sureste", se: "sureste",
      suroeste: "suroeste", so: "suroeste",
      arriba: "arriba", subir: "arriba", sube: "arriba", ascender: "arriba",
      abajo: "abajo", bajar: "abajo", baja: "abajo", descender: "abajo",
    };
    // primera palabra dirección directa
    if (dirWords[primero]) return dirWords[primero];
    // tras ir/ve/vete/camina/moverse
    const mover = ["ir", "ve", "vete", "camina", "caminar", "mover", "moverme", "desplaza", "desplazarme", "entrar", "adelante", "avanzar"];
    if (mover.includes(primero)) {
      for (const tk of tokens) if (dirWords[tk] && tk !== primero) return dirWords[tk];
      // "ir a" sin dirección → tratar como mirar entorno
    }
    return null;
  }

  _mover(dir, tokens) {
    const h = this.habActual();
    const salidas = h.salidas || {};
    const info = salidas[dir];
    const lineas = [];

    if (!info) {
      lineas.push({ clase: "mal", texto: "Por ahí no puedes pasar (pared, puerta cerrada o vacío interestelar)." });
      return { lineas, movio: false };
    }

    const dest = typeof info === "string" ? info : info.dest;
    const cond = typeof info === "object" ? info : null;

    if (cond) {
      if (cond.cond && !this.flag(cond.cond)) {
        lineas.push({ clase: "aviso", texto: cond.siNo || "No puedes pasar todavía." });
        return { lineas, movio: false };
      }
      if (cond.usa && !this.inv.includes(cond.usa)) {
        lineas.push({ clase: "aviso", texto: cond.siNo || "Te falta algo para abrir el paso." });
        return { lineas, movio: false };
      }
    }

    const hNueva = this.def.habitaciones[dest];
    lineas.push({ clase: "aviso", texto: "(" + hNueva.nombre + ")" });
    this.irA(dest);
    if (h.alSalir) { const r = h.alSalir(this, dir); if (r) lineas.push(...r); }
    return { lineas, movio: true };
  }

  _describir(salida) {
    const h = this.habActual();
    salida.push({ clase: "hr", texto: "──────────────────────────────" });
    salida.push({ clase: "tit", texto: h.nombre.toUpperCase() });
    salida.push({ clase: "sys", texto: this.habDescripcion() });

    const aqui = this.objetosAqui();
    if (aqui.length) {
      const nombres = aqui.map(id => this.verObjeto(id).nombre).join(", ");
      salida.push({ clase: "sys", texto: "Aquí ves: " + nombres + "." });
    }

    const npc = this._npcEnHab();
    if (npc) salida.push({ clase: "sys", texto: "Delante de ti: " + npc.nombre + "." });

    const salidas = h.salidas || {};
    const dirs = Object.keys(salidas).map(d => d[0].toUpperCase() + d.slice(1));
    if (dirs.length) salida.push({ clase: "hint", texto: "Salidas: " + dirs.join(", ") + "." });

    this.descripcionNueva = false;
  }

  /* propósito: NPC de la habitación */
  _npcEnHab() {
    const h = this.habActual();
    const npc = h.npc;
    if (!npc) return null;
    if (npc.requiere && !this.flag(npc.requiere)) return null;
    return npc;
  }

  /* busca en la frase el nombre de un objeto (prioriza inventario y habitación) */
  _buscarObjeto(frase) {
    const def = this.def;
    const candidatos = [this.inv, this.objetosAqui()].flat();
    let mejor = null, mejorLong = 0;
    for (const id of candidatos) {
      const o = def.objetos[id];
      const nombres = [id, o.nombre].concat(o.alias || []);
      for (const n of nombres) {
        const k = normalizar(n);
        if (k && frase.includes(k) && k.length > mejorLong) {
          mejor = id; mejorLong = k.length;
        }
      }
    }
    return mejor;
  }

  /* objetos fijos (características de la habitación: puertas, paneles…) */
  _objFijoEnHab(tokens) {
    const h = this.habActual();
    if (!h.fijos) return null;
    for (const fid in h.fijos) {
      const f = h.fijos[fid];
      const nombres = [fid].concat(f.alias || [f.nombre]);
      for (const n of nombres) {
        const k = normalizar(n);
        // buscas alguna palabra token que coincida
        if (tokens.some(tk => tk === k)) return f;
        if (tokens.join(" ").includes(k)) return f;
      }
    }
    return null;
  }

  _usarEnFijo(objId, tokens) {
    const h = this.habActual();
    if (!h.fijos) return null;
    const fijos = Object.values(h.fijos);
    for (const f of fijos) {
      if (f.on && f.on.usarCon && f.on.usarCon[objId]) {
        return f.on.usarCon[objId].call(f.on, this, tokens);
      }
    }
    return null;
  }

  _accionObjetoFijo(accion, tokens) {
    const f = this._objFijoEnHab(tokens);
    if (f && f.on && f.on[accion]) return f.on[accion](this, tokens);
    return null;
  }

  _verbo(primero, norm) {
    const verbos = {
      "mirar": "mirar", "observar": "mirar", "ver": "mirar", "mira": "mirar", "obsérva": "mirar", "observa": "mirar", "l": "mirar",
      "tomar": "tomar", "coger": "tomar", "agarrar": "tomar", "recoger": "tomar", "coge": "tomar", "recoge": "tomar", "guarda": "tomar", "guardar": "tomar", "cog": "tomar",
      "dejar": "dejar", "soltar": "dejar", "deja": "dejar", "suelta": "dejar", "poner": "dejar", "pon": "dejar",
      "usar": "usar", "utilizar": "usar", "utiliza": "usar", "usa": "usar", "emplear": "usar",
      "examinar": "examinar", "inspeccionar": "examinar", "inspecciona": "examinar", "examin": "examinar",
      "abrir": "abrir", "abre": "abrir",
      "inventario": "inventario", "i": "inventario", "bolso": "inventario", "mochila": "inventario", "bolsa": "inventario", "cosas": "inventario",
      "habla": "hablar", "hablar": "hablar", "conversa": "hablar", "pregunta": "hablar", "preguntar": "hablar", "haz": "hablar",
      "atacar": "atacar", "ataca": "atacar", "golpea": "atacar", "golpear": "atacar", "lucha": "atacar", "luchar": "atacar", "pegar": "atacar", "pelea": "atacar",
      "buscar": "buscar", "explora": "buscar", "explorar": "buscar", "registra": "buscar", "mira": "buscar",
      "beber": "beber", "tragarse": "beber",
      "leer": "leer", "lee": "leer", "abre": "examinar",
      "comer": "comer", "come": "comer",
      "gritar": "gritar", "grita": "gritar",
      "ayuda": "ayuda", "help": "ayuda", "?" : "ayuda", "quehago": "ayuda", "que": "ayuda",
    };
    if (verbos[primero]) return verbos[primero];
    // buscar verbo en cualquier posición (frases tipo "quiero ir al norte")
    for (const tk of norm.split(" ")) if (verbos[tk]) return verbos[tk];
    // "ir ..." ya fue tratado
    if (primero === "ir") return "mirar";
    return "noop";
  }

  /* postprocesado: HUD y momento */
  _post(salida) {
    // ganar/perder ya establece fin
    return salida;
  }
}

/* exponemos para el resto */
window.Motor = Motor;
window.PALETAS = PALETAS;
window.ARTE = ARTE;