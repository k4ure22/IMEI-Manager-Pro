/* =====================================================
   REGISTRO RÁPIDO — JS
   Archivo: Views/js/Registrorapido.js
   ===================================================== */

/* ── Estado interno ── */
let rrTabActual = 'original';   // 'anonimo' | 'original' | 'estandar' | 'detallada'
let rrOperadorDeclaracion = ''; // operador seleccionado para la declaración (logo PDF)

/* ── Operadores disponibles para Declaración ── */
const RR_OPERADORES = [
    { id: 'ETB', label: 'ETB', icon: 'etb.png', rgb: '0,243,255' },
    { id: 'Claro', label: 'Claro', icon: 'claro.png', rgb: '239,68,68' },
    { id: 'Tigo', label: 'Tigo', icon: 'tigo.png', rgb: '29,78,216' },
    { id: 'Movistar', label: 'Movistar', icon: 'movistar.png', rgb: '22,163,74' },
    { id: 'WOM', label: 'WOM', icon: 'wom.png', rgb: '176,38,255' },
];

/* ───────────────────────────────────────
   ABRIR / CERRAR
   ─────────────────────────────────────── */
function abrirRegistroRapido() {
    rrResetearCampos();
    rrCambiarTab('original');
    const overlay = document.getElementById('rrOverlay');
    if (overlay) overlay.classList.add('active');
}
window.abrirRegistroRapido = abrirRegistroRapido;

function cerrarRegistroRapido() {
    const overlay = document.getElementById('rrOverlay');
    if (overlay) overlay.classList.remove('active');
}
window.cerrarRegistroRapido = cerrarRegistroRapido;

/* ── Estado interno de Masivos ── */
window.rrMasivosFilas = window.rrMasivosFilas || [];
window.rrMasivosLineasSeleccionadas = window.rrMasivosLineasSeleccionadas || [];
window.rrMasivosLineasPermanentes = window.rrMasivosLineasPermanentes || [];
window.rrMasivosIncOptions = window.rrMasivosIncOptions || { operador: true, imei: true, modelo: true, linea: true, titular: true };
window.rrMasivosOperadorDeclaracion = window.rrMasivosOperadorDeclaracion || '';

let isTogglingMasivos = false;

function toggleRRMasivos() {
    if (isTogglingMasivos) return;
    isTogglingMasivos = true;

    window.isMasivosActivo = !window.isMasivosActivo;
    const vistaInd = document.getElementById('rrVistaIndividual');
    const vistaMas = document.getElementById('rrVistaMasivos');
    const btnMasivos = document.getElementById('btnRRMasivos');

    if (window.isMasivosActivo) {
        if (btnMasivos) {
            btnMasivos.className = "px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-400 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] flex-shrink-0";
            btnMasivos.innerHTML = `
                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Individual
            `;
        }
        document.querySelectorAll('#btnRrEtb, #btnRrWom, #btnRrSubirGen, #rrFooterInfo').forEach(el => {
            if (el) el.classList.add('hidden');
        });
        const btnEnviar = document.getElementById('btnRRMasivosEnviar');
        if (btnEnviar) btnEnviar.classList.remove('hidden');

        if (!window.rrMasivosFilas || window.rrMasivosFilas.length === 0) {
            window.rrMasivosFilas = [rrCrearFilaVaciaMasivos()];
        }
        rrCargarLineasMasivos();
        rrRenderizarMasivosOpcionesPanel();
        rrActualizarTablaMasivos();

        // Animación suave de salida para Individual y entrada para Masivos
        if (vistaInd) {
            vistaInd.classList.remove('rr-view-enter');
            vistaInd.classList.add('rr-view-leave');
            setTimeout(() => {
                vistaInd.classList.add('hidden');
                vistaInd.classList.remove('rr-view-leave');
                if (vistaMas) {
                    vistaMas.classList.remove('hidden', 'rr-view-leave');
                    vistaMas.classList.add('rr-view-enter');
                }
                isTogglingMasivos = false;
            }, 180);
        } else {
            if (vistaMas) {
                vistaMas.classList.remove('hidden');
                vistaMas.classList.add('rr-view-enter');
            }
            isTogglingMasivos = false;
        }
    } else {
        if (btnMasivos) {
            btnMasivos.className = "px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-green-500/30 text-green-400 hover:text-white hover:bg-green-500 hover:border-green-400 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(74,222,128,0.15)] flex-shrink-0";
            btnMasivos.innerHTML = `
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Masivos
            `;
        }
        const fInfo = document.getElementById('rrFooterInfo');
        if (fInfo) fInfo.classList.remove('hidden');
        const btnEnviar = document.getElementById('btnRRMasivosEnviar');
        if (btnEnviar) btnEnviar.classList.add('hidden');
        window.rrMasivosClienteSeleccionado = '';
        rrValidarFormulario();

        // Animación suave de salida para Masivos y entrada para Individual
        if (vistaMas) {
            vistaMas.classList.remove('rr-view-enter');
            vistaMas.classList.add('rr-view-leave');
            setTimeout(() => {
                vistaMas.classList.add('hidden');
                vistaMas.classList.remove('rr-view-leave');
                if (vistaInd) {
                    vistaInd.classList.remove('hidden', 'rr-view-leave');
                    vistaInd.classList.add('rr-view-enter');
                }
                isTogglingMasivos = false;
            }, 180);
        } else {
            if (vistaInd) {
                vistaInd.classList.remove('hidden');
                vistaInd.classList.add('rr-view-enter');
            }
            isTogglingMasivos = false;
        }
    }
}
window.toggleRRMasivos = toggleRRMasivos;

/* ───────────────────────────────────────
   TABS DE DECLARACIÓN (4 MODOS)
   ─────────────────────────────────────── */
function rrCambiarTab(tab) {
    rrTabActual = tab;

    // Actualizar botones activos
    const tabs = ['anonimo', 'original', 'estandar', 'detallada'];
    tabs.forEach(t => {
        const btn = document.getElementById('rrTab' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) {
            if (t === tab) {
                btn.classList.add('rr-tab-active');
            } else {
                btn.classList.remove('rr-tab-active');
            }
        }
    });

    // Mover el slider a la posición correspondiente
    const slider = document.getElementById('rrTabSlider');
    if (slider) {
        slider.className = 'rr-tab-slider';
        const posIndex = tabs.indexOf(tab);
        if (posIndex !== -1) {
            slider.classList.add('rr-slider-pos-' + posIndex);
        }
    }

    if (window.isMasivosActivo) {
        rrRenderizarMasivosOpcionesPanel();
        rrActualizarTablaMasivos();
    } else {
        // Mostrar/ocultar campos avanzados para estandar y detallada
        const seccionAvanzada = document.getElementById('rrCamposAvanzados');
        if (seccionAvanzada) {
            if (tab === 'estandar' || tab === 'detallada') {
                seccionAvanzada.classList.remove('hidden');
                seccionAvanzada.style.opacity = '1';
                seccionAvanzada.style.maxHeight = 'none';
            } else {
                seccionAvanzada.classList.add('hidden');
                seccionAvanzada.style.opacity = '0';
            }
        }

        // Mostrar/ocultar el grid de operador sólo en detallada
        const operSection = document.getElementById('rrOperadorSection');
        if (operSection) {
            if (tab === 'detallada') {
                operSection.classList.remove('hidden');
                rrRenderizarOperadores();
            } else {
                operSection.classList.add('hidden');
            }
        }

        // Mostrar/ocultar opciones de pantallazo sólo en pestaña Original
        const origSection = document.getElementById('rrOriginalSection');
        if (origSection) {
            if (tab === 'original') {
                origSection.classList.remove('hidden');
            } else {
                origSection.classList.add('hidden');
            }
        }

        // Mostrar/ocultar tags (opcional) y el optional hint sólo en estandar
        const optTags = document.querySelectorAll('.rr-opt-tag');
        const optionalHint = document.getElementById('rrCamposOptionalHint');
        if (tab === 'estandar') {
            optTags.forEach(el => el.classList.remove('hidden'));
            if (optionalHint) optionalHint.classList.remove('hidden');
        } else {
            optTags.forEach(el => el.classList.add('hidden'));
            if (optionalHint) optionalHint.classList.add('hidden');
        }

        // Mostrar/ocultar info anónimo
        const anonimoInfo = document.getElementById('rrAnonimoInfo');
        if (anonimoInfo) {
            if (tab === 'anonimo') anonimoInfo.classList.remove('hidden');
            else anonimoInfo.classList.add('hidden');
        }

        // Mostrar/ocultar preview estándar
        const estandarPrev = document.getElementById('rrEstandarPreview');
        if (estandarPrev) {
            if (tab === 'estandar') estandarPrev.classList.remove('hidden');
            else estandarPrev.classList.add('hidden');
        }

        rrActualizarTextosBotones();
        rrValidarFormulario();
    }
}
window.rrCambiarTab = rrCambiarTab;

function actualizarContadorMasivos(val) {
    const el = document.getElementById('rrMasivosContador');
    if (!el) return;
    const lineas = val.split('\n').filter(l => l.trim().length > 0);
    if (lineas.length > 0) {
        el.innerText = `${lineas.length} registro${lineas.length > 1 ? 's' : ''} detectado${lineas.length > 1 ? 's' : ''}`;
        el.classList.remove('hidden');
    } else {
        el.innerText = '0 registros detectados';
    }
}
window.actualizarContadorMasivos = actualizarContadorMasivos;

function rrActualizarTextosBotones() {
    const btnGen = document.getElementById('btnRrSubirGen');
    const btnEtb = document.getElementById('btnRrEtb');
    const btnWom = document.getElementById('btnRrWom');

    let text = "Guardar Base";
    let icon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
    `;

    if (rrTabActual === 'original') {
        text = "Subir & Pantallazo";
        icon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
            </svg>
        `;
    } else if (rrTabActual === 'estandar') {
        text = "Generar Constancia";
        icon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
        `;
    } else if (rrTabActual === 'detallada') {
        text = "Generar PDF completo";
        icon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="13" x2="15" y2="13"/>
                <line x1="9" y1="17" x2="15" y2="17"/>
            </svg>
        `;
    }

    if (btnGen) {
        btnGen.innerHTML = icon + ' ' + text;
    }
    if (btnEtb) {
        btnEtb.innerHTML = icon + ' Registrar ETB';
    }
    if (btnWom) {
        btnWom.innerHTML = icon + ' Registrar WOM';
    }
}

/* ───────────────────────────────────────
   OPERADORES DE DECLARACIÓN (GRID)
   ─────────────────────────────────────── */
function rrRenderizarOperadores() {
    const grid = document.getElementById('rrOperadoresGrid');
    if (!grid || grid.childElementCount > 0) return;

    const iconsBase = (() => {
        const base = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        return base + '/../icons';
    })();
    grid.innerHTML = '';
    RR_OPERADORES.forEach(op => {
        const btn = document.createElement('button');
        btn.className = 'rr-op-btn';
        btn.style.setProperty('--op-rgb', op.rgb);
        btn.dataset.opId = op.id;
        btn.innerHTML = `
            <img src="${iconsBase}/${op.icon}" alt="${op.label}" onerror="this.style.display='none'">
            <span class="rr-op-label">${op.label}</span>
        `;
        btn.addEventListener('click', () => rrSeleccionarOperador(op.id, btn));
        grid.appendChild(btn);
    });
}

function rrSeleccionarOperador(id, btnEl) {
    rrOperadorDeclaracion = id;
    document.querySelectorAll('.rr-op-btn').forEach(b => b.classList.remove('rr-op-active'));
    if (btnEl) btnEl.classList.add('rr-op-active');
    rrValidarFormulario();
}

/* ───────────────────────────────────────
   IMEI — CLIPBOARD & CONSULTAS
   ─────────────────────────────────────── */
async function rrPegarIMEI() {
    try {
        const text = await navigator.clipboard.readText();
        let clean = text.replace(/\D/g, '').trim().substring(0, 15);
        if (clean.length > 0) {
            const inputImei = document.getElementById('rrImei');
            if (inputImei) {
                inputImei.value = clean;
                if (clean.length === 15) rrConsultarModelo();
            }
        }
    } catch (e) {
        showToast('No se pudo acceder al portapapeles', 'warning');
    }
}
window.rrPegarIMEI = rrPegarIMEI;

async function rrConsultarModelo() {
    const imeiInput = document.getElementById('rrImei');
    if (!imeiInput) return;
    const imei = imeiInput.value.trim();
    if (imei.length !== 15) return showToast('El IMEI debe tener 15 dígitos', 'warning');

    const resultEl = document.getElementById('rrModeloResult');
    const textoEl = document.getElementById('rrModeloText');
    const manualBtn = document.getElementById('rrBtnManual');

    if (resultEl) resultEl.classList.remove('hidden');
    if (textoEl) textoEl.innerText = "Consultando...";
    if (manualBtn) manualBtn.classList.add('hidden');

    try {
        const res = await window.pywebview.api.consultar_modelo_solo(imei);
        if (res && res.status === 'success' && res.modelo) {
            if (textoEl) textoEl.innerText = res.modelo;
            const campoModelo = document.getElementById('rrModelo');
            if (campoModelo) campoModelo.value = res.modelo;
            showToast(`Modelo: ${res.modelo}`, 'success');
        } else {
            if (textoEl) textoEl.innerText = "No encontrado";
            if (manualBtn) {
                manualBtn.classList.remove('hidden');
                manualBtn.href = `https://www.movical.net/chequear-imei-lista-negra?imei=${imei}`;
            }
            showToast(res?.mensaje || 'Modelo no encontrado', 'warning');
        }
    } catch (e) {
        if (textoEl) textoEl.innerText = "Error";
        showToast('Error consultando modelo', 'error');
    }
    rrValidarFormulario();
}
window.rrConsultarModelo = rrConsultarModelo;

/* ───────────────────────────────────────
   VALIDACIÓN FORMULARIO
   ─────────────────────────────────────── */
function rrValidarFormulario() {
    const imei = (document.getElementById('rrImei')?.value || '').trim();
    const imeiOk = imei.length === 15;

    const nombre = (document.getElementById('rrNombre')?.value || '').trim();
    const nombreOk = !!nombre;

    // Acceder a las variables globales del selector de líneas
    const lineaSeleccionada = window.rrLineaSeleccionada;
    const lineaOk = !!lineaSeleccionada;

    const dot = document.getElementById('rrStatusDot');
    const txt = document.getElementById('rrStatusText');

    let mensajes = [];
    if (!imeiOk) mensajes.push('IMEI de 15 dígitos');
    if (!nombreOk) mensajes.push('cliente');

    if (rrTabActual === 'anonimo' || rrTabActual === 'original') {
        if (!lineaOk) mensajes.push('selecciona una línea');
    }

    if (rrTabActual === 'estandar' || rrTabActual === 'detallada') {
        const nombreProp = (document.getElementById('rrNombrePropietario')?.value || '').trim();
        const cedulaProp = (document.getElementById('rrCedulaPropietario')?.value || '').trim();
        if (!nombreProp) mensajes.push('nombre propietario');
        if (!cedulaProp) mensajes.push('cédula propietario');
    }

    if (rrTabActual === 'detallada') {
        const lineaUsuario = (document.getElementById('rrLineaUsuario')?.value || '').trim();
        const ciudad = (document.getElementById('rrCiudad')?.value || '').trim();
        const operOk = rrOperadorDeclaracion !== '';

        if (!lineaUsuario) mensajes.push('línea titular');
        if (!ciudad) mensajes.push('ciudad expedición');
        if (!operOk) mensajes.push('operador');
    }

    const listo = mensajes.length === 0;

    if (dot) {
        dot.className = 'rr-status-dot ' + (listo ? 'ready' : (mensajes.length <= 2 ? 'warning' : ''));
    }
    if (txt) {
        txt.innerText = listo ? 'Listo para procesar' : 'Falta: ' + mensajes.join(', ');
    }

    // Toggle clase ready en el botón footer que esté visible
    let activeBtn = null;
    if (lineaOk) {
        const op = (window.rrOperadorSeleccionado || '').toUpperCase();
        if (op === 'WOM') activeBtn = document.getElementById('btnRrWom');
        else if (op === 'ETB') activeBtn = document.getElementById('btnRrEtb');
    } else {
        activeBtn = document.getElementById('btnRrSubirGen');
    }

    document.querySelectorAll('#btnRrEtb, #btnRrWom, #btnRrSubirGen').forEach(b => {
        if (b) b.classList.remove('ready');
    });

    if (activeBtn && listo) {
        activeBtn.classList.add('ready');
    }

    return listo;
}
window.rrValidarFormulario = rrValidarFormulario;

/* ───────────────────────────────────────
   EJECUTAR ACCIÓN (UNIFICADA)
   ─────────────────────────────────────── */
async function rrEjecutarAccion() {
    // Buscar el botón activo
    let activeBtn = null;
    const lineaSeleccionada = window.rrLineaSeleccionada;
    if (lineaSeleccionada) {
        const op = (window.rrOperadorSeleccionado || '').toUpperCase();
        if (op === 'WOM') activeBtn = document.getElementById('btnRrWom');
        else if (op === 'ETB') activeBtn = document.getElementById('btnRrEtb');
    } else {
        activeBtn = document.getElementById('btnRrSubirGen');
    }

    // Caso de Registros Masivos
    if (window.isMasivosActivo) {
        const textMasivo = document.getElementById('rrMasivosTextarea')?.value.trim();
        if (!textMasivo) {
            return showToast('Pega los datos de Excel para continuar', 'warning');
        }
        if (activeBtn) {
            activeBtn.classList.add('rr-btn-loading');
            activeBtn.dataset.originalHtml = activeBtn.innerHTML;
            activeBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    style="animation: spin 1s linear infinite">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-opacity="0.2"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                </svg>
                Procesando Masivo...
            `;
        }

        const payload = {
            operador: window.rrOperadorSeleccionado || 'Desconocido',
            masivo: true,
            tipo: document.getElementById('rrMasivosDeclaracion')?.value || 'anonimo',
            textoExcel: textMasivo
        };

        showToastLoading('Guardando registros masivos...');
        try {
            const res = await window.pywebview.api.procesar_fastreg(payload);
            hideToastLoading();
            if (res && res.status === 'success') {
                showToast(res.mensaje || 'Registros masivos guardados', 'success');
                if (activeBtn) {
                    activeBtn.classList.remove('rr-btn-loading');
                    activeBtn.classList.add('ready');
                    activeBtn.style.background = 'rgba(57,255,20,0.2)';
                    activeBtn.style.color = '#39FF14';
                    activeBtn.style.borderColor = '#39FF14';
                    activeBtn.innerHTML = '<svg class="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Exitoso!';
                }
                if (typeof cargarDatosFastReg === 'function' && window.vistaActual === 'registros') {
                    cargarDatosFastReg();
                }
                setTimeout(() => {
                    cerrarRegistroRapido();
                }, 1200);
            } else {
                showToast(res?.mensaje || 'Error al guardar registros masivos', 'error');
                if (activeBtn) {
                    activeBtn.classList.remove('rr-btn-loading');
                    activeBtn.innerHTML = activeBtn.dataset.originalHtml || 'Subir';
                }
            }
        } catch (e) {
            hideToastLoading();
            showToast('Error de comunicación', 'error');
            if (activeBtn) {
                activeBtn.classList.remove('rr-btn-loading');
                activeBtn.innerHTML = activeBtn.dataset.originalHtml || 'Subir';
            }
        }
        return;
    }

    if (!rrValidarFormulario()) {
        if (activeBtn) {
            // Vibración del botón
            activeBtn.style.animation = 'none';
            activeBtn.style.transform = 'translateX(-4px)';
            setTimeout(() => { activeBtn.style.transform = 'translateX(4px)'; }, 80);
            setTimeout(() => { activeBtn.style.transform = 'translateX(-3px)'; }, 160);
            setTimeout(() => { activeBtn.style.transform = 'translateX(0)'; activeBtn.style.animation = ''; }, 240);
        }
        return showToast('Completa todos los campos requeridos', 'warning');
    }

    const imei = document.getElementById('rrImei').value.trim();
    const modelo = document.getElementById('rrModelo').value.trim();
    const marca = document.getElementById('rrMarca') ? document.getElementById('rrMarca').value.trim() : '';

    if (activeBtn) {
        activeBtn.classList.add('rr-btn-loading');
        activeBtn.dataset.originalHtml = activeBtn.innerHTML;
        activeBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                style="animation: spin 1s linear infinite">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-opacity="0.2"/>
                <path d="M21 12a9 9 0 00-9-9"/>
            </svg>
            Procesando...
        `;
    }

    let botExitoso = true;
    let botMensaje = '';

    // 1. Ejecutar automatización si se seleccionó línea permanente
    if (lineaSeleccionada) {
        const op = (window.rrOperadorSeleccionado || '').toUpperCase();
        const conPantallazo = rrTabActual === 'original';
        const opcionesPantallazo = {
            incluir_operador: document.getElementById('rrIncOperador')?.checked ?? true,
            incluir_imei: document.getElementById('rrIncImei')?.checked ?? true,
            incluir_modelo: document.getElementById('rrIncModelo')?.checked ?? true,
            incluir_linea: document.getElementById('rrIncLinea')?.checked ?? true,
            incluir_propietario: document.getElementById('rrIncPropietario')?.checked ?? true,
            modelo: document.getElementById('rrModelo')?.value?.trim() || '',
            propietario: document.getElementById('rrNombrePropietario')?.value?.trim() || document.getElementById('rrNombre')?.value?.trim() || '',
            linea: lineaSeleccionada || ''
        };
        showToast(`Ejecutando bot de automatización ${op}...`, 'info');
        try {
            let botRes = null;
            if (op === 'WOM') {
                botRes = await window.pywebview.api.registrar_wom(imei, lineaSeleccionada, false, conPantallazo, opcionesPantallazo);
            } else if (op === 'ETB') {
                botRes = await window.pywebview.api.registrar_etb(imei, lineaSeleccionada, false, conPantallazo, opcionesPantallazo);
            }
            if (botRes && botRes.status === 'success') {
                botExitoso = true;
                botMensaje = botRes.mensaje || 'Registro de bot exitoso';
                if (botRes.screenshot_path) {
                    showToast('Pantallazo descargado/guardado', 'file');
                }
            } else {
                botExitoso = false;
                botMensaje = botRes?.mensaje || 'Error en el bot de registro';
            }
        } catch (e) {
            botExitoso = false;
            botMensaje = 'Error al ejecutar el bot de registro';
        }
    }

    // 2. Ejecutar procesamiento FastReg y generación de declaración en Backend
    const payload = {
        imei: imei,
        modelo: modelo,
        marca: marca,
        linea: lineaSeleccionada || '',
        operador: window.rrOperadorSeleccionado || 'Desconocido',
        tipo: rrTabActual,
        masivo: false,
        nombre: document.getElementById('rrNombre')?.value.trim() || '',
        nombre_propietario: document.getElementById('rrNombrePropietario')?.value.trim() || '',
        cedula_propietario: document.getElementById('rrCedulaPropietario')?.value.trim() || '',
        cedula: document.getElementById('rrCedula')?.value.trim() || '',
        tipo_doc: 'C.C.',
        ciudad: document.getElementById('rrCiudad')?.value.trim() || '',
        linea_usuario: document.getElementById('rrLineaUsuario')?.value.trim() || '',
        correo: document.getElementById('rrCorreo')?.value.trim() || '',
        operador_declaracion: rrOperadorDeclaracion || window.rrOperadorSeleccionado || 'Desconocido',
        estado: botExitoso ? 'Registrado' : 'Fallido'
    };

    showToastLoading('Guardando registro...');

    try {
        const res = await window.pywebview.api.procesar_fastreg(payload);
        hideToastLoading();

        if (res && res.status === 'success') {
            if (botExitoso) {
                showToast(res.mensaje || 'Registro guardado exitosamente', 'success');
                if (res.pdf_ruta) {
                    showToast('Declaración generada y abierta', 'file');
                }
                if (activeBtn) {
                    activeBtn.classList.remove('rr-btn-loading');
                    activeBtn.classList.add('ready');
                    activeBtn.style.background = 'rgba(57,255,20,0.2)';
                    activeBtn.style.color = '#39FF14';
                    activeBtn.style.borderColor = '#39FF14';
                    activeBtn.innerHTML = '<svg class="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Exitoso!';
                }
            } else {
                showToast(`Registro Fallido: ${botMensaje}`, 'error');
                if (activeBtn) {
                    activeBtn.classList.remove('rr-btn-loading');
                    activeBtn.style.background = 'rgba(239,68,68,0.2)';
                    activeBtn.style.color = '#f87171';
                    activeBtn.style.borderColor = '#ef4444';
                    activeBtn.innerHTML = '<svg class="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Fallido';
                }
            }

            // Recargar vista de registros si aplica
            if (typeof cargarDatosFastReg === 'function' && window.vistaActual === 'registros') {
                cargarDatosFastReg();
            }

            // Cerrar el modal después de un breve delay
            setTimeout(() => {
                cerrarRegistroRapido();
            }, 1800);

        } else {
            showToast(res?.mensaje || 'Error al guardar el registro', 'error');
            if (activeBtn) {
                activeBtn.classList.remove('rr-btn-loading');
                activeBtn.innerHTML = activeBtn.dataset.originalHtml || 'Subir';
            }
        }
    } catch (e) {
        hideToastLoading();
        showToast('Error de comunicación con el servidor', 'error');
        if (activeBtn) {
            activeBtn.classList.remove('rr-btn-loading');
            activeBtn.innerHTML = activeBtn.dataset.originalHtml || 'Subir';
        }
    }
}
window.rrEjecutarAccion = rrEjecutarAccion;
window.rrSubir = rrEjecutarAccion; // Mantener alias

/* ───────────────────────────────────────
   RESET DE CAMPOS
   ─────────────────────────────────────── */
function rrResetearCampos() {
    rrTabActual = 'original';
    rrOperadorDeclaracion = '';

    // Resetear modo masivos
    window.isMasivosActivo = false;
    const vistaInd = document.getElementById('rrVistaIndividual');
    const vistaMas = document.getElementById('rrVistaMasivos');
    const btnMasivos = document.getElementById('btnRRMasivos');
    if (vistaInd) vistaInd.classList.remove('hidden');
    if (vistaMas) vistaMas.classList.add('hidden');
    if (btnMasivos) {
        btnMasivos.classList.remove('bg-green-500', 'text-white', 'border-green-400');
        btnMasivos.classList.add('from-emerald-500/10', 'to-green-500/10', 'text-green-400');
    }

    // Limpiar globales del selector de líneas
    window.rrLineaSeleccionada = null;
    window.rrOperadorSeleccionado = null;

    // Limpiar inputs and remove readOnly locks
    ['rrImei', 'rrMarca', 'rrModelo', 'rrNombre', 'rrNombrePropietario', 'rrCedulaPropietario', 'rrCedula', 'rrCiudad', 'rrLineaUsuario', 'rrCorreo']
        .forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.readOnly = false; } });

    // Ocultar modelo result
    const mr = document.getElementById('rrModeloResult');
    if (mr) mr.classList.add('hidden');

    // Restaurar contenedor de línea
    const lc = document.getElementById('rrLineaContenedor');
    if (lc) {
        lc.style.borderColor = '';
    }
    const lt = document.getElementById('rrLineaText');
    if (lt) {
        lt.innerText = 'Sin seleccionar';
        lt.classList.add('opacity-40');
        lt.classList.remove('text-white');
    }
    const lb = document.getElementById('rrLineaOpBadge');
    if (lb) {
        lb.innerText = '';
        lb.classList.add('hidden');
    }
    const ld = document.getElementById('rrLineaDot');
    if (ld) {
        ld.style.background = '';
        ld.style.boxShadow = '';
    }

    // Ocultar botones específicos del footer y mostrar genérico
    const btnEtb = document.getElementById('btnRrEtb');
    const btnWom = document.getElementById('btnRrWom');
    const btnGen = document.getElementById('btnRrSubirGen');
    if (btnEtb) btnEtb.classList.add('hidden');
    if (btnWom) btnWom.classList.add('hidden');
    if (btnGen) btnGen.classList.remove('hidden');

    // Restaurar botones a su estado visual original
    document.querySelectorAll('#btnRrEtb, #btnRrWom, #btnRrSubirGen').forEach(b => {
        if (b) {
            b.classList.remove('ready', 'rr-btn-loading');
            b.style.background = '';
            b.style.color = '';
            b.style.borderColor = '';
        }
    });

    // Restaurar slider y clases activas
    const tabAnon = document.getElementById('rrTabAnonimo');
    if (tabAnon) tabAnon.classList.add('rr-tab-active');
    const tabOriginal = document.getElementById('rrTabOriginal');
    if (tabOriginal) tabOriginal.classList.remove('rr-tab-active');
    const tabEstandar = document.getElementById('rrTabEstandar');
    if (tabEstandar) tabEstandar.classList.remove('rr-tab-active');
    const tabDetallada = document.getElementById('rrTabDetallada');
    if (tabDetallada) tabDetallada.classList.remove('rr-tab-active');

    const slider = document.getElementById('rrTabSlider');
    if (slider) {
        slider.className = 'rr-tab-slider rr-slider-pos-0';
    }

    // Resetear campos avanzados
    const sa = document.getElementById('rrCamposAvanzados');
    if (sa) {
        sa.classList.add('hidden');
        sa.style.maxHeight = '';
        sa.style.opacity = '';
        sa.style.transition = '';
    }

    const os = document.getElementById('rrOperadorSection');
    if (os) {
        os.classList.add('hidden');
    }

    // Limpiar grid de operadores
    document.querySelectorAll('.rr-op-btn').forEach(b => b.classList.remove('rr-op-active'));

    // Status
    const dot = document.getElementById('rrStatusDot');
    const txt = document.getElementById('rrStatusText');
    if (dot) dot.className = 'rr-status-dot';
    if (txt) txt.innerText = 'Completa los campos requeridos';

    // Restaurar visibilidad de botones cliente y ocultar tarjetas de cliente
    const displayCard = document.getElementById('rrClienteDisplayCard');
    if (displayCard) displayCard.classList.add('hidden');
    const masivosCard = document.getElementById('rrMasivosClienteCard');
    if (masivosCard) masivosCard.classList.add('hidden');
    window.rrMasivosClienteSeleccionado = '';

    const botonesCliente = document.getElementById('rrBotonesCliente');
    if (botonesCliente) botonesCliente.classList.remove('hidden');

    rrActualizarTextosBotones();
}
window.rrResetearCampos = rrResetearCampos;

/* ───────────────────────────────────────
   LIVE VALIDATION & DOM
   ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const liveIds = ['rrImei', 'rrModelo', 'rrNombre', 'rrNombrePropietario', 'rrCedulaPropietario', 'rrCedula', 'rrCiudad', 'rrLineaUsuario', 'rrCorreo'];
    liveIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                if (id === 'rrImei') {
                    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 15);
                    if (e.target.value.length === 15) {
                        rrConsultarModelo();
                    }
                }
                rrValidarFormulario();
            });
        }
    });

    if (!document.getElementById('rrSpinStyle')) {
        const style = document.createElement('style');
        style.id = 'rrSpinStyle';
        style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
});

// Función faltante para cerrar el Mini-Modal de líneas en Registro Rápido
function cerrarRRSelectorLineas() {
    const overlay = document.getElementById('rrLineaSelectorOverlay');
    if (overlay) overlay.classList.remove('active');
}
window.cerrarRRSelectorLineas = cerrarRRSelectorLineas;

// Lógica de Selección de Clientes e integración lateral
function rrSeleccionarClienteSugerido(c) {
    if (!c) return;

    if (window.clientSelectionContext === 'registrorapido_masivos' || (window.isMasivosActivo && window.clientSelectionContext !== 'registrorapido')) {
        const inpMasivos = document.getElementById('rrMasivosNombre');
        if (inpMasivos) inpMasivos.value = c.nombre;
        window.rrMasivosClienteSeleccionado = c.nombre;
        const masivosCard = document.getElementById('rrMasivosClienteCard');
        const masivosText = document.getElementById('rrMasivosClienteNombreText');
        if (masivosCard && masivosText) {
            masivosText.innerText = c.nombre;
            masivosCard.classList.remove('hidden');
        }
        showToast(`Cliente '${c.nombre}' seleccionado para Masivos`, "success");
        return;
    }

    const inputNombre = document.getElementById('rrNombre');
    if (inputNombre) inputNombre.value = c.nombre;

    const displayCard = document.getElementById('rrClienteDisplayCard');
    const cardText = document.getElementById('rrClienteCardText');
    if (displayCard && cardText) {
        cardText.innerText = c.nombre + (c.id ? ` • ${c.id}` : '');
        displayCard.classList.remove('hidden');
    }

    const inputCedula = document.getElementById('rrCedula');
    if (inputCedula && c.id) inputCedula.value = c.id;

    const inputCiudad = document.getElementById('rrCiudad');
    if (inputCiudad && c.lugar_expedicion) inputCiudad.value = c.lugar_expedicion;

    const inputCorreo = document.getElementById('rrCorreo');
    if (inputCorreo && c.correo) inputCorreo.value = c.correo;

    const inputTelefono = document.getElementById('rrLineaUsuario');
    if (inputTelefono && c.telefono) inputTelefono.value = c.telefono;

    showToast(`Cliente '${c.nombre}' seleccionado`, "success");
    rrValidarFormulario();
}
window.rrSeleccionarClienteSugerido = rrSeleccionarClienteSugerido;

function rrLimpiarClienteSeleccionado() {
    const ids = ['rrNombre', 'rrCedula', 'rrCiudad', 'rrCorreo', 'rrLineaUsuario'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const displayCard = document.getElementById('rrClienteDisplayCard');
    if (displayCard) displayCard.classList.add('hidden');
    rrValidarFormulario();
}
window.rrLimpiarClienteSeleccionado = rrLimpiarClienteSeleccionado;

function rrLimpiarClienteMasivos() {
    const inp = document.getElementById('rrMasivosNombre');
    if (inp) inp.value = '';
    window.rrMasivosClienteSeleccionado = '';
    const card = document.getElementById('rrMasivosClienteCard');
    if (card) card.classList.add('hidden');
}
window.rrLimpiarClienteMasivos = rrLimpiarClienteMasivos;

function rrAbrirSelectorClientes() {
    window.clientSelectionContext = 'registrorapido';
    if (typeof window.abrirSelectorClientes === 'function') {
        window.abrirSelectorClientes('registrorapido');
    }
}
window.rrAbrirSelectorClientes = rrAbrirSelectorClientes;

function rrIntercambiarARegistroCliente() {
    if (typeof window.abrirSelectorClientes === 'function') {
        window.clientSelectionContext = 'registrorapido';
        const rrModal = document.getElementById('rrModal');
        if (rrModal) rrModal.classList.add('history-open');
        
        const overlay = document.getElementById('clientOverlay');
        const modal = document.getElementById('clientModal');
        if (overlay) overlay.classList.add('active');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.style.transform = "translateX(0)";
                modal.style.opacity = "1";
            }, 10);
        }
        
        document.getElementById('ncNombre').value = '';
        document.getElementById('ncId').value = '';
        const ncCel = document.getElementById('ncCel') || document.getElementById('ncTelefono');
        if (ncCel) ncCel.value = '';
        const ncEmail = document.getElementById('ncEmail');
        if (ncEmail) ncEmail.value = '';
        const ncExp = document.getElementById('ncExpedicion');
        if (ncExp) ncExp.value = '';
    }
}
window.rrIntercambiarARegistroCliente = rrIntercambiarARegistroCliente;

/* ───────────────────────────────────────
   REGISTROS MASIVOS — FUNCIONES DE TABLA Y PANEL
   ─────────────────────────────────────── */
function rrCrearFilaVaciaMasivos() {
    return {
        imei: '',
        modelo: '',
        operador: '',
        linea: '',
        titular: '',
        nombre_propietario: '',
        cedula_propietario: '',
        linea_usuario: '',
        ciudad: '',
        correo: '',
        operador_declaracion: ''
    };
}

function rrCrearFilaVaciaMasivos() {
    return {
        imei: '',
        modelo: '',
        operador: '',
        linea: '',
        titular: '',
        nombre_propietario: '',
        cedula_propietario: '',
        linea_usuario: '',
        ciudad: '',
        correo: '',
        operador_declaracion: '',
        cargandoModelo: false
    };
}

function rrReasignarLineasMasivos() {
    const lineasSel = window.rrMasivosLineasSeleccionadas || [];
    const lineasPerm = window.rrMasivosLineasPermanentes || [];
    if (!window.rrMasivosFilas || window.rrMasivosFilas.length === 0) return;

    window.rrMasivosFilas.forEach((f, idx) => {
        if (lineasSel.length > 0) {
            const lineaNum = lineasSel[idx % lineasSel.length];
            const lineaObj = lineasPerm.find(l => String(l.numero) === String(lineaNum));
            f.linea = lineaNum;
            if (lineaObj) {
                f.operador = lineaObj.operador || f.operador || '';
                f.titular = lineaObj.encargado || f.titular || '';
            }
        } else {
            f.linea = '';
        }
    });
}
window.rrReasignarLineasMasivos = rrReasignarLineasMasivos;

function rrAgregarFilaMasivos(focusNew = false) {
    if (!window.rrMasivosFilas) window.rrMasivosFilas = [];
    const nuevaFila = rrCrearFilaVaciaMasivos();

    // Auto-asignar línea round-robin a la nueva fila
    const lineasSel = window.rrMasivosLineasSeleccionadas || [];
    const lineasPerm = window.rrMasivosLineasPermanentes || [];
    if (lineasSel.length > 0) {
        const nextIdx = window.rrMasivosFilas.length;
        const lineaNum = lineasSel[nextIdx % lineasSel.length];
        const lineaObj = lineasPerm.find(l => String(l.numero) === String(lineaNum));
        nuevaFila.linea = lineaNum;
        if (lineaObj) {
            nuevaFila.operador = lineaObj.operador || '';
            nuevaFila.titular = lineaObj.encargado || '';
        }
    }

    window.rrMasivosFilas.push(nuevaFila);
    rrActualizarTablaMasivos();

    if (focusNew) {
        requestAnimationFrame(() => {
            const inputs = document.querySelectorAll('#rrTablaMasivosTbody tr input[data-col="imei"]');
            if (inputs.length > 0) {
                const target = inputs[inputs.length - 1];
                target.focus();
                target.select();
            }
        });
    }
}
window.rrAgregarFilaMasivos = rrAgregarFilaMasivos;

function rrEliminarFilaMasivos(index) {
    if (window.rrMasivosFilas && window.rrMasivosFilas.length > index) {
        window.rrMasivosFilas.splice(index, 1);
        if (window.rrMasivosFilas.length === 0) {
            window.rrMasivosFilas = [rrCrearFilaVaciaMasivos()];
        }
        rrReasignarLineasMasivos();
        rrActualizarTablaMasivos();
    }
}
window.rrEliminarFilaMasivos = rrEliminarFilaMasivos;

function rrLimpiarTablaMasivos() {
    window.rrMasivosFilas = [rrCrearFilaVaciaMasivos()];
    rrReasignarLineasMasivos();
    rrActualizarTablaMasivos();
}
window.rrLimpiarTablaMasivos = rrLimpiarTablaMasivos;

function rrActualizarTablaMasivos() {
    const thead = document.getElementById('rrTablaMasivosThead');
    const tbody = document.getElementById('rrTablaMasivosTbody');
    const contador = document.getElementById('rrMasivosTablaContador');

    if (!thead || !tbody) return;

    if (!window.rrMasivosFilas || window.rrMasivosFilas.length === 0) {
        window.rrMasivosFilas = [rrCrearFilaVaciaMasivos()];
    }

    const filasValidas = window.rrMasivosFilas.filter(f => (f.imei || '').trim().length === 15);
    if (contador) {
        contador.innerText = `${filasValidas.length} de ${window.rrMasivosFilas.length} registro${window.rrMasivosFilas.length > 1 ? 's' : ''}`;
    }

    // Determinar columnas según pestaña activa
    let columnas = ['#', 'IMEI', 'Modelo'];

    if (rrTabActual === 'original') {
        const opts = window.rrMasivosIncOptions || {};
        if (opts.operador) columnas.push('Operador');
        if (opts.linea) columnas.push('Línea');
        if (opts.titular) columnas.push('Titular');
    } else if (rrTabActual === 'estandar') {
        columnas.push('Propietario (opc)', 'Cédula (opc)', 'Línea (opc)', 'Ciudad (opc)', 'Correo (opc)');
    } else if (rrTabActual === 'detallada') {
        columnas.push('Propietario', 'Cédula', 'Línea Titular', 'Ciudad', 'Correo', 'Operador PDF');
    }
    columnas.push(''); // Columna de acciones (eliminar)

    // Renderizar Encabezados
    let trHead = '<tr>';
    columnas.forEach(c => {
        const align = c === '#' || c === '' ? 'text-center' : 'text-left';
        trHead += `<th class="p-2.5 ${align} font-extrabold text-[10px] tracking-wider">${c}</th>`;
    });
    trHead += '</tr>';
    thead.innerHTML = trHead;

    // Auto-fill linea/operador/titular en modo Original si no se han reasignado
    if (rrTabActual === 'original') {
        const lineasSel = window.rrMasivosLineasSeleccionadas || [];
        const lineasPerm = window.rrMasivosLineasPermanentes || [];
        const opts = window.rrMasivosIncOptions || {};
        if (lineasSel.length > 0 && (opts.linea || opts.operador || opts.titular)) {
            window.rrMasivosFilas.forEach((f, idx) => {
                const lineaNum = lineasSel[idx % lineasSel.length];
                const lineaObj = lineasPerm.find(l => String(l.numero) === String(lineaNum));
                if (opts.linea && (!f.linea || !lineasSel.includes(String(f.linea)))) f.linea = lineaNum;
                if (opts.operador && !f.operador && lineaObj) f.operador = lineaObj.operador || '';
                if (opts.titular && !f.titular && lineaObj) f.titular = lineaObj.encargado || '';
            });
        }
    }

    // Renderizar Filas
    tbody.innerHTML = '';
    window.rrMasivosFilas.forEach((f, idx) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-white/5 transition-colors group";

        let html = `<td class="p-2 text-center text-[10px] text-white/40 font-bold">${idx + 1}</td>`;

        // IMEI input (con Enter para nueva fila)
        html += `
            <td class="p-1.5">
                <input type="text" data-col="imei" data-row="${idx}" value="${f.imei || ''}" placeholder="15 dígitos..."
                    class="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono tracking-wider outline-none transition-all placeholder-white/25 min-w-[125px]"
                    maxlength="15"
                    oninput="window.rrMasivosFilas[${idx}].imei=this.value.replace(/\\D/g,'').substring(0,15); if(this.value.length===15 && !window.rrMasivosFilas[${idx}].modelo) rrConsultarModeloFilaMasiva(${idx}); rrActualizarTablaContadorMasivos();"
                    onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }">
            </td>
        `;

        // Modelo input (con spinner de carga cuando f.cargandoModelo es true y Enter para nueva fila)
        html += `
            <td class="p-1.5 relative">
                <div class="relative flex items-center">
                    <input type="text" data-col="modelo" data-row="${idx}" value="${f.modelo || ''}" placeholder="${f.cargandoModelo ? 'Consultando...' : 'Ej: iPhone 15...'}"
                        class="w-full bg-white/[0.04] border ${f.cargandoModelo ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-300' : 'border-white/10 focus:border-cyan-400/80 focus:bg-black/70 text-white'} rounded-xl px-2.5 py-1.5 ${f.cargandoModelo ? 'pr-8' : ''} text-xs font-medium outline-none transition-all placeholder-white/25 min-w-[110px]"
                        oninput="window.rrMasivosFilas[${idx}].modelo=this.value;"
                        onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }">
                    ${f.cargandoModelo ? `
                        <div class="absolute right-2.5 flex items-center pointer-events-none">
                            <svg class="w-3.5 h-3.5 text-cyan-400 animate-spin" viewBox="0 0 24 24" fill="none" style="animation: spin 0.8s linear infinite;">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        </div>
                    ` : ''}
                </div>
            </td>
        `;

        // Campos dinámicos según pestaña
        if (rrTabActual === 'original') {
            const opts = window.rrMasivosIncOptions || {};
            if (opts.operador) {
                html += `<td class="p-1.5"><input type="text" value="${f.operador || ''}" placeholder="Operador..." class="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-medium outline-none transition-all placeholder-white/25 min-w-[95px]" oninput="window.rrMasivosFilas[${idx}].operador=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            }
            if (opts.linea) {
                html += `<td class="p-1.5"><input type="text" value="${f.linea || ''}" placeholder="Línea..." class="w-full bg-white/[0.04] border border-white/10 focus:border-pink-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs font-mono text-pink-300 font-medium outline-none transition-all placeholder-white/25 min-w-[95px]" oninput="window.rrMasivosFilas[${idx}].linea=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            }
            if (opts.titular) {
                html += `<td class="p-1.5"><input type="text" value="${f.titular || ''}" placeholder="Titular..." class="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-emerald-300 font-medium outline-none transition-all placeholder-white/25 min-w-[110px]" oninput="window.rrMasivosFilas[${idx}].titular=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            }
        } else if (rrTabActual === 'estandar' || rrTabActual === 'detallada') {
            html += `<td class="p-1.5"><input type="text" value="${f.nombre_propietario || ''}" placeholder="Nombre..." class="w-full bg-white/[0.04] border border-white/10 focus:border-purple-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-purple-300 font-medium outline-none transition-all placeholder-white/25 min-w-[110px]" oninput="window.rrMasivosFilas[${idx}].nombre_propietario=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            html += `<td class="p-1.5"><input type="text" value="${f.cedula_propietario || ''}" placeholder="Cédula..." class="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium outline-none transition-all placeholder-white/25 min-w-[95px]" oninput="window.rrMasivosFilas[${idx}].cedula_propietario=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            html += `<td class="p-1.5"><input type="text" value="${f.linea_usuario || ''}" placeholder="Línea..." class="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white font-medium outline-none transition-all placeholder-white/25 min-w-[95px]" oninput="window.rrMasivosFilas[${idx}].linea_usuario=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            html += `<td class="p-1.5"><input type="text" value="${f.ciudad || ''}" placeholder="Ciudad..." class="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium outline-none transition-all placeholder-white/25 min-w-[95px]" oninput="window.rrMasivosFilas[${idx}].ciudad=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            html += `<td class="p-1.5"><input type="text" value="${f.correo || ''}" placeholder="Correo..." class="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/80 focus:bg-black/70 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium outline-none transition-all placeholder-white/25 min-w-[110px]" oninput="window.rrMasivosFilas[${idx}].correo=this.value;" onkeydown="if(event.key==='Enter'){ event.preventDefault(); rrAgregarFilaMasivos(true); }"></td>`;
            if (rrTabActual === 'detallada') {
                const opLabel = f.operador_declaracion || 'Operador';
                const opColors = { ETB: '#00b4cc', WOM: '#b026ff', Claro: '#ef4444', Tigo: '#1d4ed8', Movistar: '#16a34a' };
                const opColor = opColors[opLabel] || '#6b7280';
                const hasOp = !!f.operador_declaracion;
                html += `<td class="p-1.5 text-center">
                    <button type="button"
                        style="background:${hasOp ? opColor + '22' : 'rgba(255,255,255,0.04)'};border:1px solid ${hasOp ? opColor + '66' : 'rgba(255,255,255,0.1)'};color:${hasOp ? opColor : 'rgba(255,255,255,0.4)'};font-weight:700;font-size:10px;border-radius:10px;padding:4px 10px;white-space:nowrap;cursor:pointer;transition:all 0.15s;"
                        onclick="rrAbrirOperadorFilaPopover(event, ${idx})"
                    >${opLabel}</button>
                </td>`;
            }
        }

        // Botón eliminar fila
        html += `
            <td class="p-1.5 text-center">
                <button type="button" onclick="rrEliminarFilaMasivos(${idx})" class="p-1 hover:bg-red-500/20 text-red-400 rounded-md transition opacity-60 hover:opacity-100 flex items-center justify-center mx-auto" title="Eliminar Fila">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </td>
        `;

        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}
window.rrActualizarTablaMasivos = rrActualizarTablaMasivos;

function rrActualizarTablaContadorMasivos() {
    const contador = document.getElementById('rrMasivosTablaContador');
    if (!contador || !window.rrMasivosFilas) return;
    const filasValidas = window.rrMasivosFilas.filter(f => (f.imei || '').trim().length === 15);
    contador.innerText = `${filasValidas.length} de ${window.rrMasivosFilas.length} registro${window.rrMasivosFilas.length > 1 ? 's' : ''}`;
}
window.rrActualizarTablaContadorMasivos = rrActualizarTablaContadorMasivos;

async function rrConsultarModeloFilaMasiva(idx) {
    if (!window.rrMasivosFilas || !window.rrMasivosFilas[idx]) return;
    const imei = window.rrMasivosFilas[idx].imei;
    if ((imei || '').length !== 15) return;

    window.rrMasivosFilas[idx].cargandoModelo = true;
    rrActualizarTablaMasivos();

    try {
        let res = await window.pywebview.api.consultar_modelo(imei);
        if (!res || !res.modelo || res.modelo === 'Desconocido' || res.status !== 'success') {
            res = await window.pywebview.api.consultar_modelo_solo(imei);
        }
        if (res && res.modelo && res.modelo !== 'Desconocido') {
            window.rrMasivosFilas[idx].modelo = res.modelo;
        }
    } catch (e) {
        console.error("Error consultando modelo masivo:", e);
    } finally {
        if (window.rrMasivosFilas && window.rrMasivosFilas[idx]) {
            window.rrMasivosFilas[idx].cargandoModelo = false;
        }
        rrActualizarTablaMasivos();
    }
}
window.rrConsultarModeloFilaMasiva = rrConsultarModeloFilaMasiva;

async function rrPegarExcelMasivos() {
    try {
        const text = await navigator.clipboard.readText();
        if (!text || !text.trim()) {
            return showToast('El portapapeles está vacío', 'warning');
        }

        const lineas = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lineas.length === 0) return;

        let nuevasFilas = [];
        lineas.forEach(l => {
            const cols = l.split('\t');
            const imeiVal = cols[0] ? cols[0].replace(/\D/g, '').trim().substring(0, 15) : '';
            if (imeiVal.length >= 5) {
                let f = rrCrearFilaVaciaMasivos();
                f.imei = imeiVal;
                if (cols[1]) f.modelo = cols[1].trim();
                if (cols[2]) f.operador = cols[2].trim();
                if (cols[3]) f.linea = cols[3].trim();
                if (cols[4]) f.titular = cols[4].trim();
                nuevasFilas.push(f);
            }
        });

        if (nuevasFilas.length > 0) {
            if (window.rrMasivosFilas && window.rrMasivosFilas.length === 1 && !window.rrMasivosFilas[0].imei) {
                window.rrMasivosFilas = nuevasFilas;
            } else {
                window.rrMasivosFilas = (window.rrMasivosFilas || []).concat(nuevasFilas);
            }
            rrActualizarTablaMasivos();
            showToast(`${nuevasFilas.length} registros importados desde Excel`, 'success');
        } else {
            showToast('No se detectaron IMEIs válidos en los datos pegados', 'warning');
        }
    } catch (e) {
        showToast('Error al leer del portapapeles', 'error');
    }
}
window.rrPegarExcelMasivos = rrPegarExcelMasivos;

/* ───────────────────────────────────────
   PANEL DERECHO DE MASIVOS (LÍNEAS, CLIENTE, OPCIONES)
   ─────────────────────────────────────── */
async function rrCargarLineasMasivos() {
    const container = document.getElementById('rrMasivosLineasCheckboxes');
    const badge = document.getElementById('rrMasivosLineasCountBadge');
    if (!container) return;

    try {
        const res = await window.pywebview.api.obtener_lineas();
        if (res && res.status === 'success' && res.lineas) {
            const permanentes = res.lineas.filter(l => (l.estado || l.tipo || '').toLowerCase() === 'permanente');
            window.rrMasivosLineasPermanentes = permanentes;
            container.innerHTML = '';

            if (permanentes.length === 0) {
                container.innerHTML = '<p class="text-[10px] text-white/40 text-center py-2">No hay líneas permanentes en la DB.</p>';
            } else {
                if (!window.rrMasivosLineasSeleccionadas || window.rrMasivosLineasSeleccionadas.length === 0) {
                    window.rrMasivosLineasSeleccionadas = permanentes.map(l => String(l.numero));
                }

                permanentes.forEach(l => {
                    const isWom = (l.operador || '').toUpperCase() === 'WOM';
                    const isTigo = (l.operador || '').toUpperCase() === 'TIGO';
                    const isClaro = (l.operador || '').toUpperCase() === 'CLARO';
                    const isMovistar = (l.operador || '').toUpperCase() === 'MOVISTAR';
                    const isEtb = (l.operador || '').toUpperCase() === 'ETB';
                    const opColor = isWom ? '#b026ff' : isTigo ? '#1d4ed8' : isClaro ? '#ef4444' : isMovistar ? '#16a34a' : isEtb ? '#00b4cc' : '#6b7280';
                    const isChecked = window.rrMasivosLineasSeleccionadas.includes(String(l.numero));

                    const label = document.createElement('label');
                    label.className = "flex items-center justify-between p-1.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 cursor-pointer transition-all hover:bg-purple-500/10 group text-[11px]";
                    label.innerHTML = `
                        <div class="flex items-center gap-1.5 min-w-0">
                            <input type="checkbox" value="${l.numero}" ${isChecked ? 'checked' : ''}
                                class="w-3.5 h-3.5 rounded border-white/20 accent-purple-500 cursor-pointer flex-shrink-0"
                                onchange="rrToggleLineaMasiva('${l.numero}', this.checked)">
                            <span class="font-mono font-bold text-white group-hover:text-purple-300 text-[11px] break-all leading-tight">${l.numero}</span>
                        </div>
                        <span class="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1" style="color:${opColor}; background:${opColor}15; border:1px solid ${opColor}40">${l.operador}</span>
                    `;
                    container.appendChild(label);
                });
            }
            if (badge) {
                badge.innerText = `${window.rrMasivosLineasSeleccionadas.length} sel`;
            }
        }
    } catch (e) {
        if (container) container.innerHTML = '<p class="text-[10px] text-red-400 text-center py-2 col-span-full">Error al cargar líneas</p>';
    }
}
window.rrCargarLineasMasivos = rrCargarLineasMasivos;

function rrToggleLineaMasiva(numero, isChecked) {
    if (!window.rrMasivosLineasSeleccionadas) window.rrMasivosLineasSeleccionadas = [];
    const numStr = String(numero);
    if (isChecked) {
        if (!window.rrMasivosLineasSeleccionadas.includes(numStr)) {
            window.rrMasivosLineasSeleccionadas.push(numStr);
        }
    } else {
        window.rrMasivosLineasSeleccionadas = window.rrMasivosLineasSeleccionadas.filter(n => n !== numStr);
    }
    const badge = document.getElementById('rrMasivosLineasCountBadge');
    if (badge) {
        badge.innerText = `${window.rrMasivosLineasSeleccionadas.length} sel`;
    }
    rrReasignarLineasMasivos();
    rrActualizarTablaMasivos();
}
window.rrToggleLineaMasiva = rrToggleLineaMasiva;

function rrRenderizarMasivosOpcionesPanel() {
    const panel = document.getElementById('rrMasivosOpcionesPanel');
    if (!panel) return;
    panel.innerHTML = '';

    if (rrTabActual === 'original') {
        panel.innerHTML = `
            <div class="p-3 rounded-2xl bg-gradient-to-b from-white/5 to-black/30 border border-sky-500/20 backdrop-blur-xl flex flex-col gap-2 shadow-lg">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <span class="rr-dot" style="background:#38bdf8;"></span>
                        Datos a Incluir en Pantallazos
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-1.5 text-xs">
                    <label class="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/50 cursor-pointer">
                        <span class="text-[11px] font-bold text-white">Operador</span>
                        <input type="checkbox" id="rrMasivosIncOp" ${window.rrMasivosIncOptions.operador ? 'checked' : ''} onchange="window.rrMasivosIncOptions.operador=this.checked; rrActualizarTablaMasivos();" class="w-3.5 h-3.5 accent-amber-500">
                    </label>
                    <label class="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-pink-400/50 cursor-pointer">
                        <span class="text-[11px] font-bold text-white">Línea</span>
                        <input type="checkbox" id="rrMasivosIncLinea" ${window.rrMasivosIncOptions.linea ? 'checked' : ''} onchange="window.rrMasivosIncOptions.linea=this.checked; rrActualizarTablaMasivos();" class="w-3.5 h-3.5 accent-pink-500">
                    </label>
                    <label class="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400/50 cursor-pointer col-span-2">
                        <span class="text-[11px] font-bold text-white">Titular</span>
                        <input type="checkbox" id="rrMasivosIncTitular" ${window.rrMasivosIncOptions.titular ? 'checked' : ''} onchange="window.rrMasivosIncOptions.titular=this.checked; rrActualizarTablaMasivos();" class="w-3.5 h-3.5 accent-emerald-500">
                    </label>
                </div>
            </div>
        `;
    } else if (rrTabActual === 'detallada') {
        // En detallada, el operador se selecciona por fila — sin panel global
        panel.innerHTML = '';
    } else if (rrTabActual === 'estandar') {
        // Sin descripción en estandar — la tabla ya es suficientemente clara
        panel.innerHTML = '';
    } else {
        // Anonimo — sin panel extra
        panel.innerHTML = '';
    }
}
window.rrRenderizarMasivosOpcionesPanel = rrRenderizarMasivosOpcionesPanel;

function rrAbrirSelectorClientesMasivos() {
    window.clientSelectionContext = 'registrorapido_masivos';
    if (typeof window.abrirSelectorClientes === 'function') {
        window.abrirSelectorClientes('registrorapido_masivos');
    }
}
window.rrAbrirSelectorClientesMasivos = rrAbrirSelectorClientesMasivos;

function rrIntercambiarARegistroClienteMasivos() {
    window.clientSelectionContext = 'registrorapido_masivos';
    const rrModal = document.getElementById('rrModal');
    if (rrModal) rrModal.classList.add('history-open');
    
    const overlay = document.getElementById('clientOverlay');
    const modal = document.getElementById('clientModal');
    if (overlay) overlay.classList.add('active');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.style.transform = "translateX(0)";
            modal.style.opacity = "1";
        }, 10);
    }
    
    document.getElementById('ncNombre').value = '';
    document.getElementById('ncId').value = '';
    const ncCel = document.getElementById('ncCel') || document.getElementById('ncTelefono');
    if (ncCel) ncCel.value = '';
    const ncEmail = document.getElementById('ncEmail');
    if (ncEmail) ncEmail.value = '';
    const ncExp = document.getElementById('ncExpedicion');
    if (ncExp) ncExp.value = '';
}
window.rrIntercambiarARegistroClienteMasivos = rrIntercambiarARegistroClienteMasivos;

/* ───────────────────────────────────────
   OPERADOR POR FILA (DETALLADA) — POPOVER
   ─────────────────────────────────────── */
const RR_OPERADORES_POPOVER = [
    { id: 'ETB', label: 'ETB', color: '#00b4cc' },
    { id: 'WOM', label: 'WOM', color: '#b026ff' },
    { id: 'Claro', label: 'Claro', color: '#ef4444' },
    { id: 'Tigo', label: 'Tigo', color: '#1d4ed8' },
    { id: 'Movistar', label: 'Movistar', color: '#16a34a' },
];

function rrAbrirOperadorFilaPopover(event, filaIdx) {
    event.stopPropagation();
    const popover = document.getElementById('rrOperadorFilaPopover');
    const grid = document.getElementById('rrOperadorFilaGrid');
    if (!popover || !grid) return;

    grid.innerHTML = '';
    RR_OPERADORES_POPOVER.forEach(op => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = (window.rrMasivosFilas[filaIdx]?.operador_declaracion === op.id);
        Object.assign(btn.style, {
            background: isActive ? `${op.color}22` : 'transparent',
            border: `1px solid ${isActive ? op.color + '55' : 'rgba(255,255,255,0.06)'}`,
            color: isActive ? op.color : 'rgba(255,255,255,0.55)',
            fontWeight: isActive ? '800' : '600',
            fontSize: '11px',
            borderRadius: '10px',
            padding: '7px 12px',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isActive ? `0 0 12px ${op.color}33` : 'none',
        });
        const dot = document.createElement('span');
        Object.assign(dot.style, {
            width: '8px', height: '8px', borderRadius: '50%',
            background: op.color,
            boxShadow: `0 0 6px ${op.color}`,
            flexShrink: '0',
            display: 'inline-block',
        });
        btn.appendChild(dot);
        btn.appendChild(document.createTextNode(op.label));
        btn.onmouseenter = () => {
            if (!isActive) {
                btn.style.background = `${op.color}15`;
                btn.style.color = op.color;
                btn.style.border = `1px solid ${op.color}40`;
            }
        };
        btn.onmouseleave = () => {
            if (!isActive) {
                btn.style.background = 'transparent';
                btn.style.color = 'rgba(255,255,255,0.55)';
                btn.style.border = '1px solid rgba(255,255,255,0.06)';
            }
        };
        btn.onclick = () => {
            if (window.rrMasivosFilas[filaIdx]) {
                window.rrMasivosFilas[filaIdx].operador_declaracion = op.id;
            }
            popover.classList.add('hidden');
            rrActualizarTablaMasivos();
        };
        grid.appendChild(btn);
    });

    // Posición fija centrada — siempre el mismo lugar independiente de la fila
    popover.style.position = 'fixed';
    popover.style.top = '50%';
    popover.style.left = '50%';
    popover.style.transform = 'translate(-50%, -50%)';
    popover.classList.remove('hidden');

    setTimeout(() => {
        const closeHandler = (e) => {
            if (!popover.contains(e.target)) {
                popover.classList.add('hidden');
                document.removeEventListener('click', closeHandler);
            }
        };
        document.addEventListener('click', closeHandler);
    }, 10);
}
window.rrAbrirOperadorFilaPopover = rrAbrirOperadorFilaPopover;

/* ───────────────────────────────────────
   CONSULTAR MODELOS MASIVOS (botón Modelos)
   ─────────────────────────────────────── */
async function rrConsultarModelosMasivos() {
    if (!window.rrMasivosFilas || window.rrMasivosFilas.length === 0) return;
    const filasSinModelo = window.rrMasivosFilas
        .map((f, i) => ({ f, i }))
        .filter(({ f }) => (f.imei || '').trim().length === 15 && !(f.modelo || '').trim());

    if (filasSinModelo.length === 0) {
        return showToast('Todos los modelos ya están completos', 'success');
    }

    showToastLoading(`Consultando ${filasSinModelo.length} modelos...`);
    let encontrados = 0;
    for (const { f, i } of filasSinModelo) {
        try {
            const res = await window.pywebview.api.consultar_modelo(f.imei.trim());
            if (res && res.modelo && res.modelo !== 'Desconocido') {
                window.rrMasivosFilas[i].modelo = res.modelo;
                encontrados++;
            }
        } catch (e) {
            // skip
        }
    }
    hideToastLoading();
    rrActualizarTablaMasivos();
    showToast(`${encontrados} modelo${encontrados !== 1 ? 's' : ''} detectado${encontrados !== 1 ? 's' : ''} de ${filasSinModelo.length} consultados`, 'success');
}
window.rrConsultarModelosMasivos = rrConsultarModelosMasivos;

/* ───────────────────────────────────────
   ENVÍO DE REGISTROS MASIVOS
   ─────────────────────────────────────── */
async function rrEnviarRegistrosMasivos() {
    const btn = document.getElementById('btnRRMasivosEnviar');
    const textBtn = document.getElementById('btnRRMasivosEnviarText');

    if (!window.rrMasivosFilas || window.rrMasivosFilas.length === 0) {
        return showToast('Agrega al menos una fila a la tabla', 'warning');
    }

    const filasValidas = window.rrMasivosFilas.filter(f => (f.imei || '').trim().length === 15);
    if (filasValidas.length === 0) {
        return showToast('Ingresa al menos 1 IMEI válido de 15 dígitos en la tabla', 'warning');
    }

    if (!window.rrMasivosLineasSeleccionadas || window.rrMasivosLineasSeleccionadas.length === 0) {
        return showToast('Selecciona al menos 1 línea permanente en la lista de la derecha', 'warning');
    }

    const clienteVal = (window.rrMasivosClienteSeleccionado || document.getElementById('rrMasivosNombre')?.value || '').trim() || 'Anónimo';

    if (btn) {
        btn.disabled = true;
        if (textBtn) textBtn.innerText = 'Procesando Envíos...';
    }

    showToastLoading(`Procesando lote masivo de ${filasValidas.length} registros...`);

    const payload = {
        masivo: true,
        tipo: rrTabActual,
        registros: filasValidas,
        lineas: window.rrMasivosLineasSeleccionadas,
        cliente: clienteVal,
        inc_pantallazo: window.rrMasivosIncOptions,
        operador_declaracion: window.rrMasivosOperadorDeclaracion || rrOperadorDeclaracion || ''
    };

    try {
        const res = await window.pywebview.api.procesar_fastreg(payload);
        hideToastLoading();
        if (btn) btn.disabled = false;

        if (res && res.status === 'success') {
            showToast(res.mensaje || 'Registros masivos guardados correctamente', 'success');
            if (textBtn) textBtn.innerHTML = '<svg class="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Lote Procesado!';

            if (typeof cargarDatosFastReg === 'function' && window.vistaActual === 'registros') {
                cargarDatosFastReg();
            }
            setTimeout(() => {
                cerrarRegistroRapido();
            }, 1200);
        } else {
            showToast(res?.mensaje || 'Error al procesar registros masivos', 'error');
            if (textBtn) textBtn.innerText = 'Enviar Registros';
        }
    } catch (e) {
        hideToastLoading();
        if (btn) btn.disabled = false;
        if (textBtn) textBtn.innerText = 'Enviar Registros';
        showToast('Error de comunicación con la aplicación', 'error');
    }
}
window.rrEnviarRegistrosMasivos = rrEnviarRegistrosMasivos;

/* ── Enter global en vista Masivos → nueva fila ── */
document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    // Solo activo cuando el modal de RR está abierto y modo masivos está activo
    const overlay = document.getElementById('rrOverlay');
    const vistaMas = document.getElementById('rrVistaMasivos');
    if (!overlay || !overlay.classList.contains('active')) return;
    if (!window.isMasivosActivo) return;
    if (!vistaMas || vistaMas.classList.contains('hidden')) return;
    // No interceptar si el foco está en un botón o select
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'BUTTON' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    e.stopPropagation();
    rrAgregarFilaMasivos(true);
}, true);