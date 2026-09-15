/* ============================================================
   Pantalla de juego — manual + escena + terminal
   ============================================================ */

(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const id = params.get("juego") || "";
  const def = window.AVENTURAS && AVENTURAS[id];

  if (!def) {
    window.location.href = "index.html";
    return;
  }

  let motor = null;

  /* ---------- DOM ---------- */
  const $ = (s) => document.querySelector(s);
  const terminal = $("#terminal");
  const form = $("#form-comando");
  const input = $("#input-comando");
  const escenaImg = $("#escena-imagen");
  const escenaEtiqueta = $("#escena-etiqueta");
  const hudTurnos = $("#hud-turnos");
  const hudInv = $("#hud-inv");
  const manualPanel = $("#manual-panel");
  const manualContenido = $("#manual-contenido");

  /* ---------- helpers ---------- */

  function lineaHTML(l) {
    const div = document.createElement("div");
    div.className = "tl " + (l.clase || "sys");
    div.textContent = l.texto;
    return div;
  }

  function pintar(lineas) {
    const frag = document.createDocumentFragment();
    lineas.forEach(l => frag.appendChild(lineaHTML(l)));
    terminal.appendChild(frag);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function actualizarHUD() {
    hudTurnos.textContent = "Turnos: " + motor.turnos;
    hudInv.textContent = "Inventario: " + (motor.objetosEnInv().length
      ? motor.objetosEnInv().map(id => motor.verObjeto(id).nombre.replace(/^(la|el|las|los|una|un)\s+/i, "")).join(" · ")
      : "vacío");
  }

  function refrescarEscena() {
    const a = motor.arteActual();
    escenaImg.innerHTML = a.svg;
    escenaEtiqueta.textContent = a.nombre;
    const clon = escenaImg.cloneNode(true);
    escenaImg.parentNode.replaceChild(clon, escenaImg);
    // reasignar porque clonamos nodo
    const nuevaImg = $("#escena-imagen");
    return nuevaImg;
  }

  /* ---------- manual ---------- */

  function construirManual(m) {
    const bloques = {
      h2: (c) => { const el = document.createElement("h2"); el.textContent = c.texto; return el; },
      h3: (c) => { const el = document.createElement("h3"); el.textContent = c.texto; return el; },
      p: (c) => { const el = document.createElement("p"); el.textContent = c.texto; return el; },
      destacado: (c) => { const el = document.createElement("div"); el.className = "destacado"; el.textContent = c.texto; return el; },
      sello: (c) => { const el = document.createElement("div"); el.className = "sello"; el.textContent = c.texto; return el; },
      ul: (c) => {
        const ul = document.createElement("ul");
        c.items.forEach(it => { const li = document.createElement("li"); li.textContent = it; ul.appendChild(li); });
        return ul;
      },
    };
    const frag = document.createDocumentFragment();
    m.manual.forEach(bl => {
      const fn = bloques[bl.tipo];
      if (fn) frag.appendChild(fn(bl));
    });
    return frag;
  }

  /* ---------- estado inicial ---------- */

  function iniciar() {
    motor = new Motor(def);
    terminal.textContent = "";
    motor.reiniciar();
    pintar(motor.def.intro);
    const sal = [];
    motor._describir(sal);
    pintar(sal);
    actualizarEscenaYHUD();
    input.focus();
  }

  function actualizarEscenaYHUD() {
    refrescarEscena();
    actualizarHUD();
  }

  /* ---------- eventos ---------- */

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const frase = input.value.trim();
    if (!frase) return;
    terminal.appendChild(lineaHTML({ clase: "tag", texto: "▸ " + frase }));
    // pasamos el foco visual hacia abajo del prompt
    const sal = motor.procesar(frase);
    pintar(sal);
    input.value = "";
    actualizarEscenaYHUD();
    if (motor.fin) input.blur();
  });

  $("#btn-volver").addEventListener("click", () => { window.location.href = "index.html"; });
  $("#btn-reiniciar").addEventListener("click", () => { iniciar(); });

  $("#btn-manual").addEventListener("click", () => {
    manualPanel.hidden = false;
  });
  $("#btn-cerrar-manual").addEventListener("click", () => {
    manualPanel.hidden = true;
  });

  /* abre el manual la primera vez para leer las reglas */
  if (!sessionStorage.getItem("manual_visto_" + def.id)) {
    sessionStorage.setItem("manual_visto_" + def.id, "1");
    manualPanel.hidden = false;
  }

  /* ---------- arranque ---------- */

  document.title = def.titulo + " — Fanzines de Bolsillo";
  $("#j-titulo").textContent = def.titulo;
  $("#j-subtitulo").textContent = def.subtitulo;
  $("#terminal-titulo").textContent = "zork://" + def.id;
  manualContenido.appendChild(construirManual(def));
  iniciar();
})();