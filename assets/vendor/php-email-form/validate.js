// ============================================================
//  validate.js — Arduino Day 2026 (versión corregida)
//  Los keys del payload coinciden con name="" del HTML:
//  nombre, celular, email, campus, foto, FechaHoraEnvio
// ============================================================

(function () {
  "use strict";

  var scriptURL = "https://script.google.com/macros/s/AKfycbyMUunnGsUWKmfReVhehX8NVvbFSMEnHEvlb4KgCPTDkNStWsWVfqY9emEnWlhOAFC0/exec";

  // ── Progreso circular ──────────────────────────────────────
  //var campos = ["name", "dni", "email", "celular", "profesion", "educacion", "bufeteoempresa", "departamento", "cuidad", "mediodecontacto"];
  var campos = ["name", "dni", "email", "celular", "bufeteoempresa", "mediodecontacto", "MedioDePago", "DiplomadoCursoTaller", "OtroCurso"];


  function actualizarProgreso() {
    var llenos = campos.filter(function (id) {
      var el = document.getElementById(id);
      if (!el) return false;
      if (el.type === "file") return el.files && el.files.length > 0;
      return el.value.trim() !== "";
    }).length;
    var pct = Math.round((llenos / campos.length) * 100);
    var arc = document.querySelector(".progress");
    var lbl = document.querySelector(".percent-text");
    if (arc) arc.setAttribute("stroke-dasharray", pct + ",100");
    if (lbl) lbl.textContent = pct + "%";
  }

  campos.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", actualizarProgreso);
      if (el.type !== "file") el.addEventListener("input", actualizarProgreso);
    }
  });

  // ── Formato teléfono XXXX-XXXX ─────────────────────────────
  var celularEl = document.getElementById("celular");
  if (celularEl) {
    celularEl.addEventListener("input", function () {
      var v = this.value.replace(/\D/g, "");
      if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4, 8);
      this.value = v;
    });
  }

  // Formato del DNI
  const input = document.getElementById('dni');
  input.addEventListener('input', (e) => {
  // 1. Limpiar: solo dejamos los números
    let v = e.target.value.replace(/\D/g, '');
    // 2. Formatear: xxxx-xxxx-xxxxx
    let formatted = "";
    if (v.length > 0) {
    // Primer bloque (máximo 4)
      formatted = v.substring(0, 4);
      if (v.length > 4) {
      // Segundo bloque (máximo 4)
        formatted += "-" + v.substring(4, 8);
      }
      if (v.length > 8) {
      // Tercer bloque (máximo 5)
        formatted += "-" + v.substring(8, 13);
      }
    }
    // 3. Devolver el valor al input
    e.target.value = formatted;
  });


  // ── Envío del formulario ───────────────────────────────────
  var form = document.getElementById("form");
  if (!form) return;

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();

    var btn     = document.getElementById("submit-button");
    var msgBox  = document.getElementById("message");
    var msgText = document.getElementById("messageText");

    

    // Fecha y hora
    var fechaEl = document.getElementById("fechaHoraEnvio");
    var fecha   = new Date().toLocaleString("es-HN");
    if (fechaEl) fechaEl.value = fecha;

    // ── PAYLOAD: keys en minúscula, igual que name="" en el HTML ──
    var payload = {
      nombre:          document.getElementById("name").value.trim(),
      dni:             document.getElementById("dni").value.trim(),
      email:           document.getElementById("email").value.trim(),
      celular:         document.getElementById("celular").value.trim(),
      fechaHora: new Date().toLocaleString(),
      bufeteoempresa:  document.getElementById("bufeteoempresa").value.trim(),
      mediodecontacto: document.getElementById("mediodecontacto").value.trim(),
      MedioDePago: document.getElementById("MedioDePago").value.trim(),
      DiplomadoCursoTaller: document.getElementById("DiplomadoCursoTaller").value.trim(),
      OtroCurso: document.getElementById("OtroCurso").value.trim()

      //departamento:    document.getElementById("departamento").value.trim(),
      //cuidad:          document.getElementById("cuidad").value.trim(),
      //profesion:       document.getElementById("profesion").value.trim(),
      //educacion:       document.getElementById("educacion").value.trim(),


    };

    // Estado: enviando
    if (btn) {
      btn.disabled = true;
      var sp = btn.querySelector(".btn-text");
      if (sp) sp.textContent = "Enviando...";
    }
    if (msgBox) msgBox.style.display = "none";

    try {
      await fetch(scriptURL, {
        method:  "POST",
        mode:    "no-cors",  // Google Apps Script requiere no-cors
        headers: { "Content-Type": "text/plain" }, // ← text/plain para que no bloquee CORS preflight
        body:    JSON.stringify(payload)
      });

      if (msgBox) {
        msgBox.className     = "message-alert success-alert";
        msgBox.style.display = "flex";
      }
      if (msgText) msgText.textContent = "¡Tu registro fue enviado correctamente!";

      form.reset();
      //window.clearFoto();
      actualizarProgreso();

    } catch (err) {
      if (msgBox) {
        msgBox.className     = "message-alert error-alert";
        msgBox.style.display = "flex";
      }
      if (msgText) msgText.textContent = "Error de conexión. Intenta de nuevo.";

    } finally {
      if (btn) {
        btn.disabled = false;
        var sp2 = btn.querySelector(".btn-text");
        if (sp2) sp2.textContent = "Registrarme Ahora";
      }
    }
  });

})(); 
