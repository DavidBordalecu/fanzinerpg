/* ============================================================
   Fanzines de Bolsillo — las cuatro aventuras
   Fantasy · Sci-Fi · Horror · Post-apocalíptico
   ============================================================ */

const AVENTURAS = {};

/* ════════════════════════════════════════════════════════════
   N.º 1 — LA TORRE DEL ARCHIMAGO  (Fantasía)
   ════════════════════════════════════════════════════════════ */

AVENTURAS.torre = {
  id: "torre",
  titulo: "La Torre del Archimago",
  subtitulo: "Fanzine n.º 1 · Fantasía · Tú eres el Aprendiz",
  familia: "fantasy",
  arte: "torre",
  inicio: "vestibulo",

  intro: [
    { clase: "tit", texto: "LA TORRE DEL ARCHIMAGO" },
    { clase: "sys", texto: "Anoche, mientras barrías el vestíbulo, el Archimago desapareció. No hubo portazo: hubo un SUSURRO. La puerta del mundo quedó sellada con runas, y en la cima de la torre un portal late como un corazón enfermo." },
    { clase: "sys", texto: "Eres el Aprendiz, y solo hay una manera de averiguar la verdad: subir." },
    { clase: "hint", texto: "Escribe MIRAR para ver la sala, NORTE o SUBIR para moverte. AYUDA si te pierdes." },
  ],

  manual: [
    { tipo: "h2", texto: "La Torre del Archimago" },
    { tipo: "p", texto: "Un juego de un solo jugador y muchas velas. Eres el Aprendiz de la Torre del Archimago. El maestro ha desaparecido tras abrir un portal en la cima; las runas han sellado el exterior. Debes escalar, leer y beber lo que haga falta para cruzar." },
    { tipo: "h3", texto: "Cómo se juega" },
    { tipo: "p", texto: "La aventura se relata en la terminal de abajo. Escribe lo que quieras hacer, en frases cortas y claras." },
    { tipo: "ul", items: [
      "IR NORTE / SUR / ESTE / OESTE (o N, S, E, O) para moverte",
      "SUBIR / BAJAR para escaleras o trampillas",
      "MIRAR para describir de nuevo la sala",
      "TOMER o COGER <cosa> para guardarla en tu zurrón",
      "USAR <cosa> cuando creas que toca",
      "EXAMINAR <cosa> para leer los detalles",
      "LEER <libro> para aprender secretos",
      "INVENTARIO para ver qué llevas",
    ] },
    { tipo: "h3", texto: "Objetivo" },
    { tipo: "p", texto: "Cruza el portal de la cima y descubre qué le ocurrió al Archimago. Hay pistas escondidas en un manuscrito… y una poción que conviene beber antes de atravesar la luz." },
    { tipo: "h3", texto: "Tu personaje" },
    { tipo: "p", texto: "Aprendiz sin nombre, con una ducha mala, un gato gordo y una curiosidad peligrosa. No sabes luchar, pero sabes leer, coger cosas y, sobre todo, arriesgar." },
    { tipo: "destacado", texto: "CONSEJO: lee el manuscrito completo antes de nada. El maestro nunca enseñó NADA sin escribirlo primero." },
    { tipo: "sello", texto: "PG-13 · 1 jugador · ~15 min" },
  ],

  objetos: {
    llave: {
      nombre: "una llave de hierro",
      inicio: "vestibulo",
      alias: ["llave", "hierro"],
      descripcion: "Una llave de hierro, pesada y sin pulir; forjada para una cerradura grande.",
      examinar: "Tiene el mango en forma de dragón. Sus dientes parecen demasiado grandes para una puerta normal.",
      alTomarTexto: "Recoges la llave de hierro; pesa como un secreto.",
      alUsar(m) {
        const h = m.hab;
        if (h !== "biblioteca") return [{ clase: "aviso", texto: "No hay ninguna cerradura digna de esta llave aquí." }];
        if (m.flag("puertaLab")) return [{ clase: "aviso", texto: "La llave ya ha hecho su trabajo: la puerta del laboratorio está abierta." }];
        m.setFlag("puertaLab");
        return [{ clase: "bien", texto: "La llave gira en la cerradura de la puerta este con un chasquido de hueso. ¡Ya está abierta! Puedes ir al ESTE." }];
      },
    },
    manuscrito: {
      nombre: "el Manuscrito del Archimago",
      inicio: "biblioteca",
      alias: ["manuscrito", "libro", "archimago"],
      descripcion: "Un manuscrito abierto sobre un atril de plata. La tinta es verde y aún brilla.",
      examinar: "Es la Última Página Conocida del Archimago. Tiene algo escrito a mano.",
      alLeer(m) {
        m.setFlag("libro");
        return [
          { clase: "sys", texto: "Leyendo… la caligrafía del maestro es ilegible salvo las últimas líneas:" },
          { clase: "aviso", texto: "“Para cruzar el umbral, el cuerpo debe teñirse de luna. Bebed la esencia verde. Levantad el Espejo de Plata y reflejad vuestro rostro en la lumbre.”" },
          { clase: "hint", texto: "(Anotas en tu libreta: esencia verde + espejo de plata.)" },
        ];
      },
    },
    pocion: {
      nombre: "la Poción Esmeralda",
      inicio: "laboratorio",
      alias: ["pocion", "esencia", "esmeralda", "verde", "frasco"],
      descripcion: "Una poción verde en un frasco de cristal que rezuma frío. Brilla como la luna líquida.",
      examinar: "El líquido verde parece respirar. En la etiqueta: “ESENCIA DE LUNA — ADMINISTRAR CON CUIDADO”.",
      alBeber(m) {
        m.setFlag("potion");
        return [
          { clase: "bien", texto: "Bebes la poción. Tus dientes tintinean y tu piel se vuelve translúcida unos segundos. Te sientes… ingrávido, de luna." },
          { clase: "hint", texto: "(Ahora podrías cruzar el portal si tuvieras algo que reflejar la luz.)" },
        ];
      },
    },
    espejo: {
      nombre: "el Espejo de Plata",
      inicio: "laboratorio",
      alias: ["espejo", "plata"],
      descripcion: "Un espejo de plata que muestra tu reflejo… con un segundo de retraso.",
      examinar: "Tu reflejo asiente cuando tú asientes, pero siempre un instante tarde. El marco lleva grabada una luna creciente.",
      alTomarTexto: "Guardas el Espejo de Plata junto al pecho; sigue frío.",
      alUsar(m) {
        if (m.hab !== "cima") return [{ clase: "aviso", texto: "Lo levantas frente a ti. No ocurre nada, aunque tu reflejo parece decepcionado." }];
        if (!m.flag("potion")) {
          return [{ clase: "mal", texto: "Levantas el espejo ante el portal… te ves a ti mismo, mortal y pequeño. La luz te empuja hacia atrás. Te falta algo. (¿La esencia verde?)" }];
        }
        const lineas = [];
        lineas.push({ clase: "sys", texto: "Levantas el Espejo de Plata. La luz del portal golpea el azogue y, por un segundo, tu reflejo te SALUDA." });
        lineas.push({ clase: "sys", texto: m.flag("libro")
          ? "Las palabras del manuscrito cobran sentido: cruzas el umbral hacia la cámara interior…"
          : "Pese a no haber leído el manuscrito del maestro, la poción te sostiene y cruzas el umbral…" });
        lineas.push({ clase: "bien", texto: "Dentro del portal, el Archimago está sentado en mitad del vacío, leyendo un periódico. «¡Ah, por fin! Ven, que se enfría el té. La torre estaba demasiado silenciosa sin ti.»" });
        lineas.push({ clase: "tit", texto: "★ FIN DE LA AVENTURA N.º 1 ★ — Has cruzado la luz. El maestro vive, y os queda un té y un millón de historias. Volverás a la mesa cuando quieras." });
        m.ganar();
        return lineas;
      },
    },
  },

  habitaciones: {
    vestibulo: {
      nombre: "Vestíbulo de la Torre",
      arte: "torre",
      desc: "Una sala circular de piedra tallada. La luna entra por una ventana alta y dibuja un charco de luz sobre una mesa de roble, donde brilla algo metálico. Una escalera de caracol asciende hacia el norte. Al sur, la puerta del mundo está sellada con runas incandescentes.",
      salidas: {
        norte: "biblioteca",
        subir: "biblioteca",
      },
      fijos: {
        puerta_mundo: {
          nombre: "la puerta del mundo",
          alias: ["puerta", "runas", "mundo", "exterior", "sello"],
          desc: "La puerta de roble sellada con runas. Al tacto, las runas se encienden y te queman un recuerdo.",
          on: {
            abrir: () => [{ clase: "mal", texto: "Las runas arden como advertencia: «EL EXTERIOR HA SIDO BORRADO». Desistes." }],
            usar: () => [{ clase: "mal", texto: "No hay forma. El sello es del propio Archimago." }],
            examinar: () => [{ clase: "sys", texto: "Las runas forman una frase en idioma antiguo: «DONDE OLVIDA EL MUNDO, EL APRENDIZ RECUERDA». Buh…" }],
          },
        },
      },
    },

    biblioteca: {
      nombre: "La Biblioteca",
      arte: "biblioteca",
      desc: "Dos plantas abarrotadas de estantes que llegan al techo. Los libros no susurran… pero casi. En el centro, una mesa con una vela encendida y un atril de plata sostiene un manuscrito abierto. Al este, una puerta con una cerradura de hierro descomunal.",
      salidas: {
        sur: "vestibulo",
        este: { dest: "laboratorio", cond: "puertaLab", siNo: "La puerta este está cerrada con una cerradura de hierro descomunal. (Busca la llave… o úsala si la tienes.)" },
      },
      fijos: {
        puerta_lab: {
          nombre: "la puerta del laboratorio",
          alias: ["puerta", "cerradura", "puerta este", "este"],
          desc: "Una puerta al este, rellena de cerradura de hierro en forma de dragón.",
          on: {
            abrir(m) {
              if (m.flag("puertaLab")) return [{ clase: "aviso", texto: "Ya está abierta." }];
              if (!m.inv.includes("llave")) return [{ clase: "mal", texto: "Está cerrada. La cerradura tiene dientes que parecen esperar una llave concreta." }];
              m.setFlag("puertaLab");
              return [{ clase: "bien", texto: "La llave gira y la puerta cede con un quejido. Al otro lado huele a azufre y a menta. Puedes ir al ESTE." }];
            },
            usar() { return this.abrir(m); },
            examinar: () => [{ clase: "sys", texto: "Una cerradura enorme, de hierro sin pulir. Los dientes de una llave encajarían aquí." }],
          },
        },
      },
    },

    laboratorio: {
      nombre: "Laboratorio de Alquimia",
      arte: "laboratorio",
      desc: "Frascos burbujeantes, alambiques y un olor a trueno. Sobre un pedestal de plata, una poción verde respira luz propia; en la pared, un espejo de plata refleja tu rostro un segundo tarde. Una escalera de piedra sube hacia el norte, hacia el viento.",
      salidas: {
        este: "biblioteca",
        norte: "cima",
        subir: "cima",
      },
      fijos: {},
    },

    cima: {
      nombre: "La Cima de la Torre",
      arte: "cima",
      desc: "El techo de la torre ha sido arrancado por algo inmenso. En el centro flota un portal de energía verde, girando lento, y detrás de su luz se intuye una cámara donde alguien está sentado leyendo. El viento huele a lluvia y a sala de estar.",
      salidas: {
        sur: "laboratorio",
        abajo: "laboratorio",
      },
      fijos: {
        portal: {
          nombre: "el portal de energía",
          alias: ["portal", "luz", "energia", "umbral", "vortice"],
          desc: "Una herida redonda en el aire. Dentro, distingues una tetera y un sillón.",
          on: {
            examinar: () => [
              { clase: "sys", texto: "El portal es verde y circular, como una pupila. Tras la cortina de luz, alguien lee un periódico con indiferencia total." },
              { clase: "hint", texto: "El manuscrito decía algo del espejo y de la esencia verde…" },
            ],
            usar(m) {
              if (!m.inv.includes("espejo")) {
                return [{ clase: "aviso", texto: "Acercas las manos al portal y la luz te quema las palmas. Te faltaría algo para reflejarla… (El Manual del Archimago hablaba de un Espejo de Plata.)" }];
              }
              const r = AVENTURAS.torre.objetos.espejo.alUsar(m);
              return r;
            },
            abrir: () => [{ clase: "aviso", texto: "No es una puerta: es una pupila. Quizá haya que REFLEJARLE algo." }],
          },
        },
      },
    },
  },
};

/* ════════════════════════════════════════════════════════════
   N.º 2 — VORÁGO  (Ciencia ficción)
   ════════════════════════════════════════════════════════════ */

AVENTURAS.vorago = {
  id: "vorago",
  titulo: "Vorágo",
  subtitulo: "Fanzine n.º 2 · Ciencia ficción · Tú eres la Ingeniera de la nave",
  familia: "scifi",
  arte: "pasillo",
  inicio: "crios",

  intro: [
    { clase: "tit", texto: "VORÁGO" },
    { clase: "sys", texto: "Un pitido grave te despierta. La cápsula de criogenia se abre con un siseo que apesta a ozono y a años perdidos. La nave está a la deriva, el reactor está crítico y la única voz amable es la de VAI, el ordenador, que acaba de encenderse por primera vez en vuestro viaje." },
    { clase: "hint", texto: "Escribe MIRAR para orientarte. AYUDA para recordar los comandos." },
  ],

  manual: [
    { tipo: "h2", texto: "Vorágo" },
    { tipo: "p", texto: "Aventura espacial para un solo tripulante. La nave carguera Vorágo despertó de su hibernación con el reactor en rojo y media cubierta sin luz. Tú eres la Ingeniera; el destino no es salvarte, es salvar el envío… y de paso, las ganas de volver a casa." },
    { tipo: "h3", texto: "Cómo se juega" },
    { tipo: "p", texto: "Todo lo que hagas se escribe en la terminal. La nave te escucha." },
    { tipo: "ul", items: [
      "NORTE / SUR / ESTE / OESTE (N, S, E, O) para moverte por la nave",
      "MIRAR para inspeccionar la cubierta actual",
      "TOMER <objeto> para llevarlo contigo",
      "USAR <objeto> en los sistemas y paneles",
      "EXAMINAR <objeto> para leer etiquetas y datos",
      "HABLAR CON VAI para que el ordenador analice la situación",
      "INVENTARIO para ver tu equipo",
    ] },
    { tipo: "h3", texto: "Objetivo" },
    { tipo: "p", texto: "Devolver la energía al reactor, reparar el motor de salto y ejecutar el salto astral hacia el puerto orbital antes de que el núcleo se funda. VAI te guiará si le preguntas." },
    { tipo: "h3", texto: "Tu personaje" },
    { tipo: "p", texto: "Ingeniera de salto de la Vorágo. Tienes la cara marcada por la funda del casco, un destornillador en el bolsillo y la mala costumbre de hablar con las máquinas. Ellas te entienden mejor que nadie." },
    { tipo: "destacado", texto: "CONSEJO: VAI sabe lo que hay que hacer. Pregúntale. La energía va ANTES que los códigos." },
    { tipo: "sello", texto: "PG-13 · 1 jugador · ~15 min" },
  ],

  objetos: {
    bateria: {
      nombre: "la Batería de emergencia",
      inicio: "crios",
      alias: ["bateria", "pila", "emergencia"],
      descripcion: "Una batería de emergencia con cajas de luz y asas de neopreno. Debe ir al reactor.",
      examinar: "Indicador: carga al 94%. Libras de energía portátil. Tiene una pegatina: «PARA EL REACTOR — CON CARIÑO, VAI».",
      alTomarTexto: "Cargas la batería. Pesa como un plan en marcha.",
    },
    herramientas: {
      nombre: "las Llaves de torque",
      inicio: "bodega",
      alias: ["llaves", "herramientas", "torque", "llave inglesa"],
      descripcion: "Una petaca de llaves de torque, engrasadas y felices.",
      examinar: "El kit de reparación del motor de salto. La 11/16 brilla como si alguien la hubiera robado recientemente.",
      alTomarTexto: "Te cuelgas la petaca de herramientas. Huele a trabajo bien hecho (aún pendiente).",
    },
    tarjeta: {
      nombre: "la Tarjeta de acceso",
      inicio: "puente",
      alias: ["tarjeta", "acceso", "llave"],
      descripcion: "Una tarjeta de capitán, notablemente ignorada por todo el mundo.",
      examinar: "Nivel de acceso: CAPITÁN. El retrato de la esquina ha sido tachado con rotulador y la palabra «jefe»."
    },
  },

  habitaciones: {
    crios: {
      nombre: "Cámara de Criogenia",
      arte: "crios",
      desc: "Tres cápsulas abren sus bocas de cristal empañado. La tuya está vaporizando el último sueño. Junto a una cápsula vacía, una batería de emergencia yace en el suelo, a medio arrastrar. La puerta norte conduce al corredor principal.",
      salidas: {
        norte: "pasillo",
        subir: { dest: "pasillo", siNo: "" },
      },
      fijos: {
        capsulas: {
          nombre: "las cápsulas de criogenia",
          alias: ["capsulas", "cápsulas", "cneman", "criogenia"],
          desc: "Cristal helado y un interior moribundo. En la cápsula 2, una tarjeta vacía como la cama de alguien que no volvió.",
          on: { examinar: () => [{ clase: "sys", texto: "La cápsula 2 está vacía. Su etiqueta dice «OFICIAL DE PUENTE». En la 3 hay una toalla doblada y un jersey de capitán." }] },
        },
      },
    },

    pasillo: {
      nombre: "Corredor Principal",
      arte: "pasillo",
      desc: "El corredor de la nave se estira bajo luces de emergencia. A babor, una ventana circular muestra un campo de estrellas inmóvil: la nave dejó de viajar hace años. Las cubiertas vecinas: puente al norte, bodega al este, sala de máquinas al oeste.",
      salidas: {
        norte: "puente",
        este: "bodega",
        oeste: "maquinas",
        sur: "crios",
      },
      fijos: {
        ventana: {
          nombre: "la ventana circular",
          alias: ["ventana", "estrellas", "espacio"],
          desc: "Un ojo de buey que muestra un mar de estrellas completamente quieto.",
          on: { examinar: () => [{ clase: "sys", texto: "Las estrellas no se mueven. La Vorágo está muerta en el agua, salvo tú. Y VAI." }] },
        },
      },
    },

    puente: {
      nombre: "Puente de Mando",
      arte: "puente",
      desc: "Consolas apagadas en cuarto creciente. En la pantalla central parpadea un holograma azul: VAI, el ordenador de a bordo, con cara de exigente mujer con gafas. Sobre una consola abollada, brilla una tarjeta de capitán abandonada.",
      salidas: {
        sur: "pasillo",
      },
      npc: {
        nombre: "VAI, el holograma del puente",
        hablar(m) {
          const falta = [];
          if (!m.flag("energia")) falta.push("energía al reactor");
          if (!m.flag("motor")) falta.push("reparar el motor de salto");
          if (falta.length) {
            return [
              { clase: "sys", texto: "VAI (con el ceño de un científico juzgando): «Estado: reactor crítico. Para el salto necesito, en orden: " + falta.join(" y ") + ". Batería en criogenia. Herramientas en bodega. Los códigos se cargan aquí, con la tarjeta de capitán, PERO solo cuando haya energía.»" },
            ];
          }
          return [
            { clase: "bien", texto: "VAI sonríe (algo que no hace desde el despegue): «Todo listo. Ejecuta el salto en mi consola cuando quieras. El puerto orbital nos está esperando con café.»" },
          ];
        },
        atacar() {
          return [{ clase: "aviso", texto: "VAI: «He contabilizado el golpe. Se descontará de tu sueldo: tres pagas.» (Eres Ingeniera; no tenías sueldo.)" }];
        },
      },
      fijos: {
        consola_salto: {
          nombre: "la consola de salto",
          alias: ["consola", "salto", "panel", "navegacion", "capitan", "tablero"],
          desc: "La consola central de navegación. Está apagada; su pantalla solo refleja tu cansancio.",
          on: {
            examinar: () => [{ clase: "sys", texto: "El selector de salto astral. Una luz testigo parpadea: «CÓDIGOS PENDIENTES»." }],
            usar(m) {
              if (!m.flag("energia")) return [{ clase: "mal", texto: "La consola está muerta. VAI: «Energía primero, tripulante.»" }];
              if (!m.inv.includes("tarjeta")) return [{ clase: "mal", texto: "Necesitas el nivel de acceso del capitán. ¿Dónde está esa tarjeta?" }];
              if (!m.flag("codigos")) {
                m.setFlag("codigos");
                if (m.flag("motor")) {
                  const lineas = [
                    { clase: "bien", texto: "Deslizas la tarjeta. Los códigos de salto astral se cargan con un ronroneo azul y VAI sonríe: «Toda la cadena está lista.»" },
                    { clase: "sys", texto: "«Salto astral en 3… 2… 1…» Las estrellas se convierten en costuras de luz. La Vorágo regresa al puerto orbital con un trofeo en la bodega: un gato, tres años congelado aún negro, y una Ingeniera que vuelve a casa." },
                    { clase: "tit", texto: "★ FIN DE LA AVENTURA N.º 2 ★ — Vorágo. Has devuelto la vida a la nave y al gato. VAI te espera para el siguiente cargamento (oficialmente: «jamón serrano»)." },
                  ];
                  m.ganar();
                  return lineas;
                }
                return [
                  { clase: "bien", texto: "Deslizas la tarjeta. Los códigos de salto astral se cargan en cascada. VAI: «Códigos listos. El motor de salto, sin embargo, sigue averiado.»" },
                  { clase: "hint", texto: "(Necesitas las llaves de torque en la sala de máquinas.)" },
                ];
              }
              if (!m.flag("motor")) return [{ clase: "aviso", texto: "Los códigos ya están cargados. El salto espera… pero el motor sigue averiado. Revisa la sala de máquinas." }];
              const lineas = [
                { clase: "bien", texto: "Confirmas el salto. VAI entona la cuenta y las estrellas se convierten en costuras de luz. La Vorágo regresa al puerto orbital, con su carga, su gato y una Ingeniera que vuelve a casa." },
                { clase: "tit", texto: "★ FIN DE LA AVENTURA N.º 2 ★ — Vorágo. Salto astral completado. VAI te entrega una taza con forma de nave y os ponéis ambos a planificar el siguiente cargamento." },
              ];
              m.ganar();
              return lineas;
            },
            abrir: () => [{ clase: "aviso", texto: "Es una consola, no un armario." }],
          },
        },
      },
    },

    maquinas: {
      nombre: "Sala de Máquinas",
      arte: "maquinas",
      desc: "Calor, tuberías gruesas y un reactor al fondo que pulsa como una arteria expuesta. Al lado del reactor, el motor de salto yace abierto, con un hueco de herramientas del tamaño exacto de una llave de torque. El núcleo está al rojo y lo sabes.",
      salidas: {
        este: "pasillo",
      },
      fijos: {
        reactor: {
          nombre: "el reactor de la nave",
          alias: ["reactor", "nucleo", "corazon"],
          desc: "Un núcleo candente dentro de cristal blindado. El indicador está clavado en ROJO. Debajo hay un receptáculo para una batería de emergencia.",
          on: {
            examinar: () => [{ clase: "sys", texto: "Reactores críticos. Un receptáculo reza: «BATERÍA DE EMERGENCIA» con flechas dibujadas por alguien desesperado." }],
            usarCon: {
              bateria(m) {
                if (m.flag("energia")) return [{ clase: "aviso", texto: "El reactor ya zumba a plena capacidad." }];
                m.setFlag("energia");
                m.consumir("bateria");
                return [
                  { clase: "bien", texto: "Enchufas la batería. El reactor ronca, despierta y las luces de toda la nave dan un latido azul. VAI: «Energía restaurada. Buen trabajo, Ingeniera.»" },
                  { clase: "hint", texto: "(Ahora el puente tiene luz. Quizá los códigos de salto se carguen con la tarjeta…)" },
                ];
              },
            },
          },
        },
        motor: {
          nombre: "el motor de salto",
          alias: ["motor", "salto", "motor de salto"],
          desc: "Un bloque de placas y bobinas, abierto. Faltan dos pernos de torque y un abrazo técnico.",
          on: {
            examinar: () => [{ clase: "sys", texto: "El motor de salto está desmontado. Sobre la bancada hay una nota: «Si pudiera, robaría una llave de torque de la bodega.»" }],
            usarCon: {
              herramientas(m) {
                if (m.flag("motor")) return [{ clase: "aviso", texto: "El motor ya está perfectamente apretado." }];
                m.setFlag("motor");
                return [
                  { clase: "bien", texto: "Tuercas, pernos, un chasquido de caricia. El motor de salto retumba satisfecho. VAI, desde el puente: «Motor operativo. Ponte el cinturón.»" },
                  { clase: "hint", texto: "(Solo falta cargar los códigos en el puente…)" },
                ];
              },
            },
          },
        },
      },
    },

    bodega: {
      nombre: "Bodega de Carga",
      arte: "bodega",
      desc: "Contenedores apilados en la penumbra, turquesa y fríos. Una caja de herramientas está abierta, mostrando sus llaves de torque engrasadas. De algún contenedor sale un ronroneo que no te atreves a investigar.",
      salidas: {
        oeste: "pasillo",
      },
      fijos: {
        cajas: {
          nombre: "los contenedores",
          alias: ["contenedores", "cajas", "ronroneo"],
          desc: "Una montaña de contenedores. De uno, muy adentro, sale un ronroneo metálico.",
          on: { examinar: () => [{ clase: "sys", texto: "El ronroneo proviene de un contenedor marcado «ANIMALES DE COMPAÑÍA — MANTENER SIN SALTO». Hay un gato. Abordo. Hace años." }] },
        },
      },
    },
  },
};

/* ════════════════════════════════════════════════════════════
   N.º 3 — LA CASA CARMÍN  (Horror)
   ════════════════════════════════════════════════════════════ */

AVENTURAS.carmin = {
  id: "carmin",
  titulo: "La Casa Carmín",
  subtitulo: "Fanzine n.º 3 · Terror · Tú heredas la novela y la casa",
  familia: "lovecraft",
  arte: "salon",
  inicio: "entrada",

  intro: [
    { clase: "tit", texto: "LA CASA CARMÍN" },
    { clase: "sys", texto: "Tu tía Margarita te dejó una casa. El abogado insistió en que la vendieras sin visitarla. Tú, por supuesto, has venido a visitarla. La puerta de entrada se cerró detrás de ti con un ruido de huesos que no eran de la madera, y el pomo, ahora, no existe." },
    { clase: "sys", texto: "Todo huele a velas y a libro viejo. La casa quiere algo de ti." },
    { clase: "hint", texto: "Escribe MIRAR para orientarte. Y respira. Cuida tu sangre." },
  ],

  manual: [
    { tipo: "h2", texto: "La Casa Carmín" },
    { tipo: "p", texto: "Una aventura de terror para UNA persona, preferiblemente con la puerta cerrada y una lámpara encendida de verdad. Has heredado una casa en la que las paredes tienen opiniones. Para salir, la casa debe quedarse dormida: es el Ritual del Carmín." },
    { tipo: "h3", texto: "Cómo se juega" },
    { tipo: "p", texto: "La terminal relata la casa. Tú decides cada paso. Sé prudente: esta casa no premia la prisa." },
    { tipo: "ul", items: [
      "IR NORTE / SUR / ESTE / OESTE para moverte por las estancias",
      "MIRAR para sentir la sala",
      "TOMER <cosa> con cuidado",
      "USAR <cosa> en el altar cuando llegue el momento",
      "LEER <libro> — esta tía dejó instrucciones",
      "EXAMINAR <cosa> para notar detalles",
      "INVENTARIO para recordar lo que llevas",
    ] },
    { tipo: "h3", texto: "Objetivo" },
    { tipo: "p", texto: "Realizar el Ritual del Carmín en el altar del sótano: vela negra, sal y una daga de plata… y pronunciar la palabra que solo se aprende leyendo. Si te adelantas sin leer, la casa se ofende." },
    { tipo: "h3", texto: "Tu personaje" },
    { tipo: "p", texto: "Eres la última rama de la familia Carmín. No crees en fantasmas, pero llevas en la sangre la superstición de tres generaciones de abuelas. La casa te reconocerá: hueles igual que la tía Margarita." },
    { tipo: "destacado", texto: "CONSEJO: la tía era bibliotecaria. Si la casa tiene un secreto, estará en un libro primero." },
    { tipo: "sello", texto: "PG-13 · 1 jugador · ~15 min" },
  ],

  objetos: {
    vela: {
      nombre: "una vela de cera negra",
      inicio: "entrada",
      alias: ["vela", "cera", "vela negra"],
      descripcion: "Una vela de cera negra, sin estrenar, sobre la consola del recibidor.",
      examinar: "Cera negra, mecha de lino. En la base, alguien grabó con una uña: «PARA LA ÚLTIMA». Brr.",
      alTomarTexto: "Tomas la vela negra. Está fría como un recuerdo.",
    },
    sal: {
      nombre: "una bolsa de sal",
      inicio: "salon",
      alias: ["sal", "bolsa de sal"],
      descripcion: "Una bolsa de sal de roca, rota por una esquina. Deja un reguero blanco desde la chimenea.",
      examinar: "Sal gruesa de cocina. Se usa para sellar, para conservar y, en esta casa, para otras cosas. La tía la dejó aquí a propósito.",
      alTomarTexto: "Guardas la bolsa de sal; el reguero en el suelo queda como una pregunta.",
    },
    codex: {
      nombre: "el Codex Carmín",
      inicio: "estudio",
      alias: ["codex", "libro", "tomo", "grimorio"],
      descripcion: "Un tomo enorme encuadernado en materia que no quieres identificar. El lomo dice: CODEX CARMÍN.",
      examinar: "Encuadernado en algo… de color carmín. Abre una sola página, la del índice.",
      alLeer(m) {
        m.setFlag("codex");
        return [
          { clase: "sys", texto: "Abres el Codex. La letra es de tu tía, meticulosa como su tagaté. Subrayado en carmín:" },
          { clase: "aviso", texto: "«Ritual del Carmín. En el altar: ENCIENDE la vela negra. TIENDE la sal en el círculo. CLAVA la daga de plata en el corazón de la piedra. Y dí, al fin, mi nombre. Pero solo cuando los tres estén puestos. Si faltara uno… la casa contará hasta uno y será contigo.»" },
          { clase: "hint", texto: "(Necesitas: vela negra, sal y una daga. Y recordar el nombre de la tía: MARGARITA.)" },
        ];
      },
    },
    daga: {
      nombre: "una daga de plata",
      inicio: "sotano",
      alias: ["daga", "plata", "cuchillo"],
      descripcion: "Una daga de plata, pálida, sobre el banco de carnicero del sótano.",
      examinar: "Plata vieja, lampaña de años. El mango tiene la inicial «M». Es la daga de la familia; la última Carmín la usará en la piedra.",
      alTomarTexto: "Tomas la daga de plata. Tu sombra en la pared, por un segundo, hace movimientos por su cuenta.",
    },
  },

  habitaciones: {
    entrada: {
      nombre: "Recibidor",
      arte: "salon",
      desc: "Papel carmesí, un espejo empañado, una araña apagada que no deja de temblar por no sé qué corriente. Sobre la consola, una vela de cera negra recién colocada… y la puerta por la que entraste ya no tiene pomo. Al norte, el salón.",
      salidas: {
        norte: "salon",
      },
      fijos: {
        puerta_calle: {
          nombre: "la puerta de entrada",
          alias: ["puerta", "entrada", "pomo"],
          desc: "La puerta principal. El pomo desapareció; la madera ahora está fría y, al tocarla, brota moho.",
          on: {
            abrir: () => [{ clase: "mal", texto: "La maneta ya no está. La puerta es una pared. La casa ha decidido que te quedas un rato." }],
            usar: () => [{ clase: "mal", texto: "Aporreas con el hombro. La casa emite un suspiro educado. Te quedas." }],
          },
        },
        espejo_viejo: {
          nombre: "el espejo del recibidor",
          alias: ["espejo"],
          desc: "Un espejo empañado donde se adivina poco más que una silueta.",
          on: {
            examinar: () => [{ clase: "sys", texto: "Te acercas. El vaho dibuja una «M» y una flecha hacia arriba, hacia el estudio. Tu tía te está dejando notas con el aliento del otro lado." }],
          },
        },
      },
    },

    salon: {
      nombre: "Salón",
      arte: "salon",
      desc: "Una chimenea sofocada, cuadros con miradas que te siguen al girar la cabeza, y sobre la repisa, un bote de sal de roca. Al norte, el estudio; al este, una trampilla al sótano.",
      salidas: {
        sur: "entrada",
        norte: "estudio",
        este: "sotano",
        bajar: "sotano",
      },
      fijos: {
        chimenea: {
          nombre: "la chimenea",
          alias: ["chimenea", "fuego", "vuelta"],
          desc: "Una chimenea muerta. La leña está dispuesta pero nunca se encendió.",
          on: {
            examinar: () => [{ clase: "sys", texto: "La leña forma una sola palabra con los troncos: «MARGARITA». Los cuadros de la sala respiran aliviados." }],
          },
        },
        cuadros: {
          nombre: "los cuadros",
          alias: ["cuadros", "ojos", "retratos", "cuadro"],
          desc: "Retratos que los miran a uno.",
          on: {
            examinar: () => [{ clase: "sys", texto: "Los retratos de la familia Carmín. Todos los ojos coinciden en un punto de la pared: el manto de la trampilla del sótano." }],
          },
        },
      },
    },

    estudio: {
      nombre: "Estudio de la Tía",
      arte: "estudio",
      desc: "Estantes que huelen a mejor época, una ventana con la luna tan roja que parece parte de la casa. Sobre el escritorio, ABRIRTO: el Codex Carmín. Una silla te observa con la paciencia del que espera.",
      salidas: {
        sur: "salon",
      },
      fijos: {
        ventana_luna: {
          nombre: "la ventana",
          alias: ["ventana", "luna", "cielo"],
          desc: "La luna llena, carmín. Las nubes pasan DETRÁS de la luna, lo cual es físicamente incorrecto.",
          on: {
            examinar: () => [{ clase: "sys", texto: "La luna está tan oscura que la luz que filtra parece tinta. En su «superficie» se ve, por un instante, la silueta de una mujer con coleta leyendo un libro. El reflejo del estudio… solo que tu tía, en TU lugar." }],
          },
        },
      },
    },

    sotano: {
      nombre: "Sótano",
      arte: "sotano",
      desc: "Baja y tibio, huele a limón podrido. Barriles, polvo y en el banco de carnicero, una daga de plata como esperando a alguien. Al norte, una cripta con un círculo trazado. Las escaleras del oeste vuelven al salón.",
      salidas: {
        oeste: "salon",
        norte: "altar",
        subir: "salon",
      },
      fijos: {
        banco: {
          nombre: "el banco de carnicero",
          alias: ["banco", "tabla", "carnicero"],
          desc: "Madera agrietada con un hueco en forma de daga.",
          on: { examinar: () => [{ clase: "sys", texto: "Sobre la tabla descansa la daga de plata. El hueco en la madera coincide exactamente con el ancho de su hoja. Alguien la quiso aquí y la dejó aquí." }] },
        },
      },
    },

    altar: {
      nombre: "Cripta del Altar",
      arte: "ritual",
      desc: "Una cripta circular. En el centro, un altar de mármol rojo dentro de un círculo grabado. Hay dos cuencos vacíos para velas y un hueco en el corazón de la piedra, del tamaño exacto de una hoja de plata. La casa, aquí, está contenida. Contiene la respiración.",
      salidas: {
        sur: "sotano",
      },
      fijos: {
        altar: {
          nombre: "el altar de mármol",
          alias: ["altar", "piedra", "marmol", "circulo", "cripta"],
          desc: "Mármol rojo, frío, en el centro de un círculo ritual. Tiene dos cuencos para velas y el hueco de una hoja.",
          on: {
            examinar: () => [
              { clase: "sys", texto: "El círculo ritual escribe una palabra que repites sin querer: «…Margarita». Los cuencos esperan una vela; el polvo, un trazo de sal; la piedra, una hoja de plata." },
            ],
            usarCon: {
              vela(m) {
                if (m.flag("velaLista")) return [{ clase: "aviso", texto: "La vela negra ya arde en su cuenco." }];
                m.setFlag("velaLista");
                m.consumir("vela");
                return [{ clase: "bien", texto: "Enciendes la vela negra en el cuenco. La llama es recta y silenciosa, como un dedo señalando." }];
              },
              sal(m) {
                if (m.flag("salLista")) return [{ clase: "aviso", texto: "La sal ya cierra el círculo." }];
                m.setFlag("salLista");
                m.consumir("sal");
                return [{ clase: "bien", texto: "Tiendes la sal en el círculo. El grano blanco cruje y la casa, por primera vez, RETROCEDE un centímetro." }];
              },
              daga(m) {
                if (m.flag("dagaLista")) return [{ clase: "aviso", texto: "La daga ya está clavada en la piedra." }];
                m.setFlag("dagaLista");
                m.consumir("daga");
                return [{ clase: "bien", texto: "Clavas la daga en el corazón del mármol. La habitación exhala, y todas las velas de la casa se apagan en bloque." }];
              },
            },
            usar(m) {
              const lista = m.flag("velaLista") && m.flag("salLista") && m.flag("dagaLista");
              if (!lista) return [{ clase: "mal", texto: "Aún falta algo en el altar. Revisa: ¿vela encendida? ¿sal en el círculo? ¿daga? (No hace falta mirar, la casa se encarga de recordártelo en tu nuca.)" }];
              if (!m.flag("codex")) return [{ clase: "mal", texto: "Los tres elementos están puestos. Todo COINCIDE… pero no sabes la palabra. La casa cuenta: «Uno.» Y sonríe. (¡Faltó leer el Codex! Te suena el nombre, ¿no?)" }];
              m.setFlag("ritual");
              const lineasFin3 = [
                { clase: "bien", texto: "Vela, sal y daga. Y la palabra que la tía dejó escrita en el Codex, en el estudio, como todas las cosas importantes. Susurras: «MARGARITA.»" },
                { clase: "sys", texto: "La casa se despereza, se frota los ojos de esquina y suspira largamente… hasta que se queda dormida. La puerta de la calle reaparece, con su pomo, y detrás de ti el amanecer de un lunes cualquiera." },
                { clase: "tit", texto: "★ FIN DE LA AVENTURA N.º 3 ★ — La Casa Carmín duerme. Vendes la casa a quien la quiera (nadie, y todo el mundo). Te espera el día, la calle, y la dulce costumbre de no abrir puertas sin leer primero el manual." },
              ];
              m.ganar();
              return lineasFin3;
            },
          },
        },
      },
    },
  },
};

AVENTURAS.carmin.habitaciones.entrada.fijos.puerta_calle.alias = ["puerta", "entrada", "pomo"];

/* ════════════════════════════════════════════════════════════
   N.º 4 — REFUGIO 4  (Post-apocalíptico)
   ════════════════════════════════════════════════════════════ */

AVENTURAS.refugio = {
  id: "refugio",
  titulo: "Refugio 4",
  subtitulo: "Fanzine n.º 4 · Post-apocalíptico · Tú eres la Andariega",
  familia: "yermo",
  arte: "calle",
  inicio: "estacion",

  intro: [
    { clase: "tit", texto: "REFUGIO 4" },
    { clase: "sys", texto: "Tres años desde que el mundo se apagó como una vela. Esta mañana, tu radio de mano ha captado una voz que repite, en bucle: «Refugio 4… Refugio 4… alguien ahí fuera…». La voz suena a café y a aire acondicionado. Suena a CASA." },
    { clase: "hint", texto: "Escribe MIRAR para orientarte. AYUDA para los comandos." },
  ],

  manual: [
    { tipo: "h2", texto: "Refugio 4" },
    { tipo: "p", texto: "Aventura de supervivencia para una sola andariega. El mundo quedó en cenizas, pero bajo la ciudad sigue habiendo latidos: calefacción, una radio y una puerta de acero que NO se abre con buenas palabras. Te hacen falta combustible para el generador, la llave del Refugio y, sobre todo, mantener la calma." },
    { tipo: "h3", texto: "Cómo se juega" },
    { tipo: "p", texto: "Escribe tus acciones en la terminal. El yermo responde con hechos: con humo, con tijeras, con una radio que no cuelga." },
    { tipo: "ul", items: [
      "IR NORTE / SUR / ESTE / OESTE para avanzar por la ciudad",
      "MIRAR para reconocer el lugar",
      "TOMER <objeto> para llevarlo",
      "USAR <objeto> en puertas, generadores y máquinas",
      "ABRIR <vitrina> o buscar en la penumbra",
      "BUSCAR cuando la luz no alcance (te hará falta una linterna)",
      "HABLAR CON LA RADIO para pedir señales",
      "INVENTARIO para ver lo que cargas",
    ] },
    { tipo: "h3", texto: "Objetivo" },
    { tipo: "p", texto: "Atravesar el puesto de control del Refugio 4: generador con gasolina y puerta con llave. Hay un mapa que te orienta y un botiquín que vale su peso en buenas intenciones." },
    { tipo: "h3", texto: "Tu personaje" },
    { tipo: "p", texto: "La Andariega: doce kilos de provincia, tres bolsillos cosidos a mano y la certeza de que la radio no miente. No eres heroína; solo eres la que contesta." },
    { tipo: "destacado", texto: "CONSEJO: en la oscuridad, mira con una linterna. En el hospital, revisa las vitrinas. En el mercado, revisa la trastienda." },
    { tipo: "sello", texto: "PG-13 · 1 jugador · ~15 min" },
  ],

  objetos: {
    linterna: {
      nombre: "una linterna militar",
      inicio: "estacion",
      alias: ["linterna", "luz"],
      descripcion: "Una linterna militar, con su funda y su correa. La luz corta el polvo en seco.",
      examinar: "Funciona. La etiqueta dice «USO EN TIENDAS Y TINAJAS OSCURAS». El soldado que la perdió debía de tener mal que le estorbaran los secretos.",
      alTomarTexto: "Enciendes la linterna una vez: el haz es como abrir el día en mitad de la noche.",
      alUsar(m) {
        if (m.hab !== "mercado") return [{ clase: "aviso", texto: "Enciendes la linterna; el haz busca rincones, pero aquí no oculta nada interesante." }];
        if (m.flag("luzTrastienda")) return [{ clase: "aviso", texto: "La trastienda ya está barrida por la luz y el bidón, contigo." }];
        m.setFlag("luzTrastienda");
        m.revelar("gasolina");
        return [
          { clase: "bien", texto: "Diriges el haz a la trastienda y la oscuridad huye. En el fondo, sellado y mudo, un bidón de gasolina se ha estado guardando el secreto todo este tiempo." },
          { clase: "hint", texto: "(Ahora TOMAR la gasolina.)" },
        ];
      },
    },
    mapa: {
      nombre: "el Mapa de la ciudad",
      inicio: "calle",
      alias: ["mapa", "plano", "papel"],
      descripcion: "Un mapa de la ciudad mojado por la lluvia de hace tres años. Un círculo marca el Refugio 4 al norte.",
      examinar: "Hay trazada una ruta en bolígrafo azul: estación → avenida → hospital y mercado → puesto de control del Refugio 4. Una anotación: «el generador necesita GASOLINA; la puerta, LLAVE».",
      alUsar(m) {
        m.setFlag("mapa");
        return [
          { clase: "sys", texto: "Estudias el mapa: la ruta está clara. El Refugio 4 está tras la garita, al norte del mercado, y hay dos hierros que lo separan de ti: la gasolina del generador y la llave de la puerta." },
          { clase: "hint", texto: "(El mapa queda en tu memoria: gasolina + llave.)" },
        ];
      },
    },
    botiquin: {
      nombre: "el Botiquín de campaña",
      inicio: "hospital",
      alias: ["botiquin", "medicinas", "farmacia", "kit"],
      descripcion: "Una bolsa de campaña con vendas, yodo y dos pastillas que a lo mejor son para esto y a lo mejor para lo otro.",
      examinar: "Vendas, antiséptico, un termómetro roto Ponlo en la curva: toda la información importante cabe en el botiquín.",
      alTomarTexto: "Te cargas el botiquín. Ya no solo eres la que contesta: eres la que remienda.",
    },
    gasolina: {
      nombre: "el Bidón de gasolina",
      inicio: false,
      alias: ["gasolina", "bidon", "combustible"],
      descripcion: "Un bidón de gasolina todavía sellado. Pesan promesas.",
      examinar: "El bidón está a un cuarto de cosa; no gotea. En la etiqueta: «PARA EL GENERADOR DEL REFUGIO 4».",
      alTomarTexto: "Cargas el bidón de gasolina. El mundo huele un poco menos a funeral.",
    },
    llave: {
      nombre: "la Llave del Refugio 4",
      inicio: false,
      alias: ["llave", "refugio"],
      descripcion: "Una llave de acero con una chapa que dice «REFUGIO 4». Tiene el calor de lo que aún funciona.",
      examinar: "Una llave normal, de esas que abrían apartamentos baratos. Ahora abre la única puerta que importa del mundo.",
      alTomarTexto: "Guardas la Llave del Refugio 4. Los dedos te tiemblan una centésima.",
    },
  },

  habitaciones: {
    estacion: {
      nombre: "Estación de Metro",
      arte: "vagon",
      desc: "El vagon 7 duerme enterrado. Grafiti en el techo: «EL FIN DEL CAMINO». En el panel de instrumentos, una linterna militar espera como una herencia de alguien que ya no la necesita. Las escaleras del norte suben a la Avenida.",
      salidas: {
        norte: "calle",
        subir: "calle",
      },
      fijos: {
        panel: {
          nombre: "el panel de instrumentos",
          alias: ["panel", "instrumentos", "tablero"],
          desc: "Un tablero de mandos del veterano metro. Entre polvo y parásitos, hay una linterna enganchada.",
          on: { examinar: () => [{ clase: "sys", texto: "El panel guarda su linterna militar como un trofeo. No te deja el corazón en un puño apropiarte de ella." }] },
        },
      },
    },

    calle: {
      nombre: "La Avenida Muerta",
      arte: "calle",
      desc: "Arena, cristal y un horizonte de costillas de edificios. El sol descansa a ras de suelo como un incendio que no termina de morir. En un puesto de periódicos volcado, un mapa mojado sigue clavado con chinchetas. Al norte asoma un cartel que dice HOSPITAL; al este, unas lonas: MERCADO.",
      salidas: {
        sur: "estacion",
        norte: "hospital",
        este: "mercado",
      },
      fijos: {
        puesto_periodicos: {
          nombre: "el puesto de periódicos",
          alias: ["puesto", "periodicos", "papel"],
          desc: "Un kiosco volcado. Los periódicos se imprimieron con la fecha del fin del mundo.",
          on: {
            examinar: () => [{ clase: "sys", texto: "Entre la tinta desteñida, un mapa de la ciudad sigue clavado. Puedes tomarlo si quieres." }],
            usar: () => [{ clase: "aviso", texto: "El mapa está sujeto con chinchetas. Basta con tomarlo." }],
          },
        },
      },
    },

    hospital: {
      nombre: "Hospital de Campaña",
      arte: "hospital",
      desc: "Camillas que conservan el hueco de los cuerpos, vitrinas de cristal quebrado y un cartel URGENCIAS rojo. Bajo una camilla asoma un botiquín militar. En la pared, una vitrina metálica intacta guarda algo que brilla. A la luz de la tarde, casi todo es posible.",
      salidas: {
        sur: "calle",
      },
      fijos: {
        vitrina: {
          nombre: "la vitrina del guarda",
          alias: ["vitrina", "armario", "cristal", "caja", "taquilla"],
          desc: "Una vitrina metálica con cerradura de palanca y un cristal viejo. Dentro, una llave con una chapa que reza «REFUGIO 4».",
          on: {
            abrir(m) {
              if (m.flag("vitrinaAbierta")) return [{ clase: "aviso", texto: "La vitrina está abierta (y vacía, aparte del polvo)." }];
              m.setFlag("vitrinaAbierta");
              m.revelar("llave");
              return [
                { clase: "bien", texto: "Haces palanca con un travesaño de la camilla. El cristal cede con un ruido de tuerca floja y algo cae dentro: la Llave del Refugio 4." },
                { clase: "hint", texto: "(Ahora TOMAR la llave.)" },
              ];
            },
            usar() { return this.abrir(m); },
            examinar: () => [{ clase: "sys", texto: "De cerca, la vitrina tiene más herrumbre que secretos. Dentro, la llave espera; el cerrajero ya no está." }],
          },
        },
      },
    },

    mercado: {
      nombre: "Mercado de la Avenida",
      arte: "mercado",
      desc: "Tinglados de lona muerta y latas abolladas rodando con la brisa. El letrero «MERCADO 9» ha perdido las vocales. Al fondo, una trastienda negra como un párpado cerrado. Al norte, un callejón conduce a la garita del Refugio 4.",
      salidas: {
        oeste: "calle",
        norte: "garita",
      },
      fijos: {
        trastienda: {
          nombre: "la trastienda",
          alias: ["trastienda", "fondo", "tienda", "cuarto", "detras"],
          desc: "El cuarto trasero del mercado. A oscuras. Algo grande y cuadrado duerme en el fondo.",
          on: {
            usar(m) {
              if (m.flag("luzTrastienda")) return [{ clase: "aviso", texto: "Ya tienes la gasolina. En el fondo solo quedan cajas de chorizo fantasma." }];
              if (!m.inv.includes("linterna")) return [{ clase: "mal", texto: "Entras a tientas. El cuarto es una bóveda de oscuridad y el suelo cruje con consecuencias. Sales; aquí hace falta UNA LUZ." }];
              if (!m.flag("luzTrastienda")) {
                m.setFlag("luzTrastienda");
                m.revelar("gasolina");
                return [
                  { clase: "bien", texto: "El haz de la linterna barre las sombras y encuentra un bidón de gasolina, perfectamente sellado, como si el mundo hubiera terminado justo cuando iba a ir de viaje." },
                  { clase: "hint", texto: "(Ahora TOMAR la gasolina.)" },
                ];
              }
            },
            abrir() { return this.usar(m); },
            examinar: () => [{ clase: "aviso", texto: "El umbral de la trastienda traga la luz. Dentro del todo: silencio y polvo." }],
          },
        },
      },
    },

    garita: {
      nombre: "Garita del Refugio 4",
      arte: "garita",
      desc: "El final del mapa: una garita con su ventanuco y, al fondo, la puerta de acero del Refugio 4. Un generador destartalado jadea en la esquina, y en la radio del mostrador una voz mecánica insiste: «Refugio 4… alguien ahí fuera…». La puerta no se abre sola.",
      salidas: {
        sur: "mercado",
      },
      npc: {
        nombre: "la radio del Refugio",
        hablar(m) {
          const tieneLlave = m.inv.includes("llave");
          const tieneGas = m.flag("generador");
          if (m.flag("mapa")) {
            if (tieneGas && tieneLlave) {
              return [
                { clase: "sys", texto: "Aprietas el pulsador. Una voz humana, ronca de años, responde: «¿Eres real?». Suena a café y a aire acondicionado." },
                { clase: "bien", texto: "— Soy real — dices. Y la voz del otro lado se parte en dos flecos de risa: «Pues corre, que la puerta te está esperando.»" },
              ];
            }
            const falta = [];
            if (!tieneLlave) falta.push("falta la LLAVE de la puerta");
            if (!tieneGas) falta.push("el GENERADOR necesita gasolina");
            return [{ clase: "aviso", texto: "La radio chisporrotea: «¿Encuentras lo que buscas?». El mapa que te diste no miente: " + falta.join(" y ") + "." }];
          }
          return [
            { clase: "sys", texto: "Aprietas el pulsador. Tras un chirrido, la voz mecánica insiste: «Refugio 4… se requiere identificación… llave + combustible…»." },
            { clase: "hint", texto: "(Hay un mapa abandonado en la avenida. Puede que aclare las cosas.)" },
          ];
        },
      },
      fijos: {
        puerta_acero: {
          nombre: "la puerta de acero",
          alias: ["puerta", "acero", "refugio", "entrada"],
          desc: "Una losa de acero más alta que un vertedero. En el centro, una cerradura de tambor limpísima, recién engrasada.",
          on: {
            usar(m) {
              const tieneLlave = m.inv.includes("llave");
              if (!tieneLlave) return [{ clase: "mal", texto: "La cerradura espera su llave. Puedes tocarla con cariño si quieres, pero no cede al romance." }];
              if (!m.flag("generador")) return [{ clase: "mal", texto: "La llave gira, la cerradura se destraba… pero la puerta NO se mueve. Es hidráulica: necesita corriente. Ese generador de la esquina pide gasolina. (USA la gasolina en el generador.)" }];
              m.setFlag("puertaAbierta");
              const lineasFin = [
                { clase: "bien", texto: "La puerta de acero exhala aire viejo y se abre hacia un mundo cálido. Detrás: estanterías con plantas creciendo, una cafetera encendida y tres personas que dejan de fingir que no te esperaban." },
                { clase: "sys", texto: "La voz de la radio, ahora de frente: «Bienvenida al Refugio 4. ¿Aceptas el puesto de segunda tornero de cafeterías?» — Aceptas. Siempre aceptas." },
                { clase: "tit", texto: "★ FIN DE LA AVENTURA N.º 4 ★ — La Andariega llegó a casa. La radio nunca vuelve a mentir: al otro lado siempre hubo una silla, una taza y alguien que te oyó." },
              ];
              m.ganar();
              return lineasFin;
            },
            abrir() { return this.usar(m); },
              examinar: () => [{ clase: "sys", texto: "Cerrojo hidráulico. Placa: «REFUGIO 4 — SALA GRANDE, COMEDOR 24H». Más slogan que puerta." }],
              usarCon: {
                llave(m) { return this.usar(m); },
              },
          },
        },
        generador: {
          nombre: "el generador",
          alias: ["generador", "motor", "maquina"],
          desc: "Un generador manchado de óxido con el depósito vacío. Abierto, como esperando que le eches algo con olor a futuro.",
          on: {
            usarCon: {
              gasolina(m) {
                if (m.flag("generador")) return [{ clase: "aviso", texto: "El generador ya ruge como un león con hipo." }];
                m.setFlag("generador");
                m.consumir("gasolina");
                return [
                  { clase: "bien", texto: "Viertes la gasolina. El generador tose, botón, ACELERA, y un zumbido azul recorre todos los cables de la garita. Las luces de la puerta se encienden como dos ojos." },
                  { clase: "hint", texto: "(La puerta ya tiene corriente. Ahora solo falta... la llave.)" },
                ];
              },
            },
            usar(m) {
              if (!m.inv.includes("gasolina")) return [{ clase: "mal", texto: "El depósito está tan seco que parece el fondo de un bolsillo. NECESITA GASOLINA." }];
              return this.usarCon.gasolina(m);
            },
          },
        },
      },
    },
  },
};

/* exponemos el catálogo */
window.AVENTURAS = AVENTURAS;