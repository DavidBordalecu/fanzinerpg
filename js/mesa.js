/* ============================================================
   Página principal — la mesa y sus fanzines
   ============================================================ */

(function () {
  const fanzines = document.querySelectorAll(".fanzine");
  const abrir = (id) => { window.location.href = "juego.html?juego=" + id; };

  fanzines.forEach(f => {
    f.addEventListener("click", () => abrir(f.dataset.juego));
    f.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir(f.dataset.juego);
      }
    });
  });
})();