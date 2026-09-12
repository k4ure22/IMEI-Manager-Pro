/* =====================================================
   MÓDULO CHECK — JavaScript
   Archivo: Views/js/Check.js
   (Antes: Modelos.js)
   ===================================================== */

/* ─── ESTADO INTERNO ─── */
let _ckScreenshotActual = null;
let _ckCuposTimer = null;

function ckIsHeadless() {
    return ((localStorage.getItem('imei-headless') || '1') === '1');
}

/* ─── ABRIR / CERRAR ─── */
async function abrirCheck() {
    document.getElementById('checkOverlay').classList.add('active');
    ckLimpiarResultado();
    await ckActualizarCupos();
    await ckActualizarCuposBlacklist();
}

function cerrarCheck() {
    document.getElementById('checkOverlay').classList.remove('active');
    _ckScreenshotActual = null;
    if (_ckCuposTimer) {
        clearInterval(_ckCuposTimer);
        _ckCuposTimer = null;
    }
}

/* ─── PEGAR IMEI ─── */
async function ckPegarIMEI() {
    try {
        const text = await navigator.clipboard.readText();
        const clean = text.replace(/\D/g, '').substring(0, 15);
        if (clean.length > 0) {
            document.getElementById('ckImeiInput').value = clean;
            showToast('IMEI pegado', 'success');
        }
    } catch {
        showToast('No se pudo leer el portapapeles', 'warning');
    }
}

/* ─── LIMPIAR RESULTADO ─── */
function ckLimpiarResultado() {
    _ckScreenshotActual = null;
    document.getElementById('ckResultArea').classList.add('hidden');
    document.getElementById('ckScreenshotArea').classList.add('hidden');

    // Reset Buscar Modelo button to Phase 1
    const btn = document.getElementById('ckBtnBuscarModelo');
    if (btn) {
        btn.setAttribute('data-fase', '1');
        const lbl = document.getElementById('ckBtnModeloLabel');
        const sublbl = document.getElementById('ckBtnModeloSublabel');
        if (lbl) lbl.textContent = 'Buscar Modelo';
        if (sublbl) sublbl.textContent = 'Fase 1: Estándar';
        const iconSvg = btn.querySelector('.ck-action-icon svg');
        if (iconSvg) iconSvg.style.color = '#a78bfa';
    }

    // NO ocultar los contenedores de cupos al limpiar: se mantienen visibles
    // para que el usuario siempre vea el indicador de cupos disponibles.
    // Los cupos se actualizan por ckActualizarCupos() / ckActualizarCuposBlacklist().
}

/* ─── VALIDAR IMEI ─── */
function ckGetIMEI() {
    const val = (document.getElementById('ckImeiInput')?.value || '').replace(/\D/g, '');
    if (val.length !== 15) {
        showToast('IMEI inválido — necesita 15 dígitos', 'warning');
        return null;
    }
    return val;
}

/* ─── MOSTRAR RESULTADO ─── */
function ckMostrarResultado({ iconClass, label, value, meta = [], loading = false }) {
    const area = document.getElementById('ckResultArea');
    const icon = document.getElementById('ckResultIcon');
    const lbl = document.getElementById('ckResultLabel');
    const val = document.getElementById('ckResultValue');
    const metaEl = document.getElementById('ckResultMeta');

    area.classList.remove('hidden');

    // Icono
    icon.className = `ck-result-icon ${iconClass}`;
    if (loading) {
        icon.innerHTML = `<div class="ck-spinner"></div>`;
    } else {
        icon.innerHTML = (value && (value.toLowerCase().includes('error') || value.toLowerCase().includes('fallido') || value.toLowerCase().includes('rechazado') || value.toLowerCase().includes('no encontrado'))) || iconClass.includes('error')
            ? `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
            : iconClass.includes('colombia')
                ? `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`
                : iconClass.includes('blacklist')
                    ? `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`
                    : `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`;
    }

    lbl.textContent = label;
    val.textContent = value;

    // Meta info
    if (meta.length > 0) {
        metaEl.innerHTML = meta.map(m =>
            `<div class="ck-result-meta-item">${m.label}: <span>${m.value}</span></div>`
        ).join('');
        metaEl.classList.remove('hidden');
    } else {
        metaEl.classList.add('hidden');
    }
}

/* ─── MOSTRAR SCREENSHOT ─── */
function ckMostrarScreenshot(ruta) {
    if (!ruta) return;
    _ckScreenshotActual = ruta;
    const area = document.getElementById('ckScreenshotArea');
    const img = document.getElementById('ckScreenshotImg');
    // Normalizar ruta para web y usar timestamp para evitar caché
    const webPath = typeof normalizePathForWeb === 'function' ? normalizePathForWeb(ruta) : ruta;
    img.src = `${webPath}?t=${Date.now()}`;
    // Fallback a file:// si la ruta relativa no carga
    img.onerror = function() {
        this.src = `file://${ruta}?t=${Date.now()}`;
        this.onerror = null;
    };
    area.classList.remove('hidden');
}

/* ─── CONSULTAR MODELO PRO (ConsultarModeloPro + screenshot) ─── */
async function ckConsultarModeloPro() {
    const imei = ckGetIMEI();
    if (!imei) return;

    ckLimpiarResultado();
    ckMostrarResultado({
        iconClass: 'ck-icon-loading',
        label: 'Consultando modelo...',
        value: 'Conectando con iunlocker.com',
        loading: true
    });

    showToastLoading('Consultando modelo en iunlocker.com...');

    try {
        const res = await window.pywebview.api.consultar_modelo_pro(imei, true, ckIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            ckMostrarResultado({
                iconClass: 'ck-icon-success',
                label: 'Modelo detectado',
                value: res.modelo || 'Sin información',
                meta: [
                    { label: 'IMEI', value: imei },
                    { label: 'Fuente', value: 'iunlocker.com' }
                ]
            });

            if (res.screenshot_path) {
                ckMostrarScreenshot(res.screenshot_path);
            }

            showToast(`Modelo: ${res.modelo}`, 'success');

        } else if (res.status === 'sin_cupos' || res.status === 'limite_web') {
            ckMostrarResultado({
                iconClass: 'ck-icon-error',
                label: res.status === 'sin_cupos' ? 'Sin cupos disponibles' : 'Límite del sitio alcanzado',
                value: res.mensaje || 'Sin cupos disponibles',
                meta: [
                    { label: 'Disponible en', value: `${res.horas}h ${res.minutos}m` },
                    { label: 'Cupos', value: '0 / 5' }
                ]
            });
            showToast(res.mensaje || 'Sin cupos disponibles', 'warning');

        } else {
            ckMostrarResultado({
                iconClass: 'ck-icon-error',
                label: 'Error al consultar',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || 'desconocido'), 'error');
        }

    } catch (e) {
        hideToastLoading();
        ckMostrarResultado({
            iconClass: 'ck-icon-error',
            label: 'Error de conexión',
            value: String(e)
        });
    }

    // Actualizar indicador de cupos tras la consulta
    await ckActualizarCupos();
}

/* ─── CONSULTAR MODELO ESTÁNDAR (movical.net - gratuita) ─── */
async function ckConsultarModeloEstandar() {
    const imei = ckGetIMEI();
    if (!imei) return;

    ckLimpiarResultado();
    ckMostrarResultado({
        iconClass: 'ck-icon-loading',
        label: 'Consultando modelo...',
        value: 'Conectando con movical.net (estándar)',
        loading: true
    });

    showToastLoading('Consultando modelo estándar...');

    try {
        const res = await window.pywebview.api.consultar_modelo_estandar(imei, ckIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            ckMostrarResultado({
                iconClass: 'ck-icon-success',
                label: 'Modelo detectado (Estándar)',
                value: res.modelo || 'Sin información',
                meta: [
                    { label: 'IMEI', value: imei },
                    { label: 'Fuente', value: 'movical.net' }
                ]
            });

            if (res.screenshot_path) {
                ckMostrarScreenshot(res.screenshot_path);
            }

            showToast(`Modelo: ${res.modelo}`, 'success');

        } else {
            ckMostrarResultado({
                iconClass: 'ck-icon-error',
                label: 'Error en consulta estándar',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || 'desconocido'), 'error');
        }

    } catch (e) {
        hideToastLoading();
        ckMostrarResultado({
            iconClass: 'ck-icon-error',
            label: 'Error de conexión',
            value: String(e)
        });
    }

    // Transición a la Fase 2 (Pro)
    const btn = document.getElementById('ckBtnBuscarModelo');
    if (btn) {
        btn.setAttribute('data-fase', '2');
        const lbl = document.getElementById('ckBtnModeloLabel');
        const sublbl = document.getElementById('ckBtnModeloSublabel');
        if (lbl) lbl.textContent = 'Buscar Modelo Pro';
        if (sublbl) sublbl.textContent = 'Fase 2: iunlocker.com';
        const iconSvg = btn.querySelector('.ck-action-icon svg');
        if (iconSvg) iconSvg.style.color = '#c084fc';
    }

    const cuposCont = document.getElementById('ckCuposContainer');
    if (cuposCont) {
        cuposCont.style.display = 'flex';
    }
    await ckActualizarCupos();
}

/* ─── CONSULTAR IMEI COLOMBIA (ScraperEstado + screenshot) ─── */
async function ckConsultarImeiColombia() {
    const imei = ckGetIMEI();
    if (!imei) return;

    ckLimpiarResultado();
    ckMostrarResultado({
        iconClass: 'ck-icon-loading',
        label: 'Consultando IMEI Colombia...',
        value: 'Tomando pantallazo del resultado',
        loading: true
    });

    showToastLoading('Consultando estado en IMEI Colombia...');

    try {
        const res = await window.pywebview.api.consultar_imei_colombia_con_pantallazo(imei, ckIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            ckMostrarResultado({
                iconClass: 'ck-icon-colombia',
                label: 'Estado IMEI Colombia',
                value: res.estado || 'Sin información',
                meta: [
                    { label: 'Operador', value: res.operador || '—' },
                    { label: 'IMEI', value: imei }
                ]
            });

            if (res.screenshot_path) {
                ckMostrarScreenshot(res.screenshot_path);
            }

            showToast(`Estado: ${res.estado} | ${res.operador}`, 'success');

        } else {
            ckMostrarResultado({
                iconClass: 'ck-icon-error',
                label: 'Error al consultar',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || ''), 'error');
        }

    } catch (e) {
        hideToastLoading();
        ckMostrarResultado({
            iconClass: 'ck-icon-error',
            label: 'Error de conexión',
            value: String(e)
        });
    }
}

/* ─── BLACKLIST (GSMA via iunlocker.com) ─── */
async function ckConsultarBlacklist() {
    const imei = ckGetIMEI();
    if (!imei) return;

    ckLimpiarResultado();
    ckMostrarResultado({
        iconClass: 'ck-icon-loading',
        label: 'Consultando Blacklist GSMA...',
        value: 'Conectando con iunlocker.com',
        loading: true
    });

    showToastLoading('Consultando Blacklist GSMA en iunlocker.com...');

    try {
        const res = await window.pywebview.api.consultar_blacklist(imei, false, ckIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            const enBlacklist = res.en_blacklist || false;
            ckMostrarResultado({
                iconClass: enBlacklist ? 'ck-icon-error' : 'ck-icon-blacklist',
                label: enBlacklist ? 'IMEI en Blacklist GSMA' : 'IMEI Limpio (Clean)',
                value: res.mensaje || (enBlacklist ? 'Este IMEI está reportado en lista negra' : 'No se encontró en lista negra GSMA'),
                meta: [
                    { label: 'IMEI', value: imei },
                    { label: 'Estado GSMA', value: res.resultado_texto || (enBlacklist ? 'Blacklist' : 'Clean') },
                    { label: 'Guardado como', value: res.valor_bd || '—' },
                    { label: 'Fuente', value: res.fuente || 'iunlocker.com' }
                ]
            });

            if (res.screenshot_path) {
                ckMostrarScreenshot(res.screenshot_path);
            }

            showToast(enBlacklist ? 'IMEI en Blacklist GSMA' : 'IMEI Limpio (Clean)', enBlacklist ? 'error' : 'success');

        } else if (res.status === 'sin_cupos' || res.status === 'limite_web') {
            ckMostrarResultado({
                iconClass: 'ck-icon-error',
                label: res.status === 'sin_cupos' ? 'Sin cupos Blacklist' : 'Límite del sitio alcanzado',
                value: res.mensaje || 'Límite del sitio alcanzado',
                meta: [
                    { label: 'Disponible en', value: `${res.horas}h ${res.minutos}m` },
                    { label: 'Cupos', value: '0 / 5' }
                ]
            });
            showToast(res.mensaje || 'Límite del sitio alcanzado', 'warning');

        } else {
            ckMostrarResultado({
                iconClass: 'ck-icon-error',
                label: 'Error en consulta Blacklist',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || 'desconocido'), 'error');
        }

    } catch (e) {
        hideToastLoading();
        ckMostrarResultado({
            iconClass: 'ck-icon-error',
            label: 'Error de conexión',
            value: 'No se pudo conectar con el servicio de Blacklist'
        });
        showToast('Error al consultar Blacklist', 'error');
    } finally {
        const blCuposCont = document.getElementById('ckBlacklistCuposContainer');
        if (blCuposCont) {
            blCuposCont.style.display = 'flex';
        }
        await ckActualizarCuposBlacklist();
    }
}

/* ─── ACTUALIZAR CUPOS (solo indicador bajo botón Pro) ─── */
async function ckActualizarCupos() {
    try {
        const res = await window.pywebview.api.obtener_estado_cupos_modelo();
        ckRenderizarCupos(res);
        // También actualizar el indicador del dock
        ckActualizarDockIndicador(res);
    } catch {
        // Silencioso si el API no está disponible aún
    }
}

function ckRenderizarCupos(res) {
    const dot = document.getElementById('ckCuposDot');
    const text = document.getElementById('ckCuposText');
    if (!dot || !text) return;

    const restantes = res?.consultas_restantes ?? 5;
    const limite = res?.limite ?? 5;
    const bloqueado = res?.bloqueado ?? false;
    const horas = res?.horas ?? 0;
    const minutos = res?.minutos ?? 0;

    // Color del dot según cupos
    dot.className = 'ck-cupos-dot';
    if (bloqueado || restantes === 0) {
        dot.classList.add('agotado');
        text.innerHTML = `<span class="ck-cupos-count" style="color:#f87171">Agotado</span> · Disponible en ${horas}h ${minutos}m`;
    } else if (restantes <= 2) {
        dot.classList.add('advertencia');
        text.innerHTML = `<span class="ck-cupos-count">${restantes}</span> de ${limite} consultas Pro`;
    } else {
        dot.classList.add('disponible');
        text.innerHTML = `<span class="ck-cupos-count">${restantes}</span> de ${limite} consultas Pro`;
    }
}

/* ─── INDICADOR DE CUPOS EN DOCK ─── */
function ckActualizarDockIndicador(res) {
    let indicator = document.getElementById('ckDockCuposIndicator');
    if (!indicator) return;

    const restantes = res?.consultas_restantes ?? 5;
    const bloqueado = res?.bloqueado ?? false;

    const dot = indicator.querySelector('.dot');
    const label = indicator.querySelector('.ck-label');

    if (bloqueado || restantes === 0) {
        if (dot) { dot.style.background = '#f87171'; dot.style.boxShadow = '0 0 6px #f87171'; }
        if (label) label.textContent = `Check: ${res.horas}h ${res.minutos}m`;
    } else if (restantes <= 2) {
        if (dot) { dot.style.background = '#fbbf24'; dot.style.boxShadow = '0 0 6px #fbbf24'; }
        if (label) label.textContent = `Check: ${restantes} restantes`;
    } else {
        if (dot) { dot.style.background = '#4ade80'; dot.style.boxShadow = '0 0 6px #4ade80'; }
        if (label) label.textContent = `Check: ${restantes}/5`;
    }
    indicator.classList.add('visible');
}

/* ─── ACTUALIZAR CUPOS BLACKLIST ─── */
async function ckActualizarCuposBlacklist() {
    try {
        const res = await window.pywebview.api.obtener_estado_cupos_blacklist();
        ckRenderizarCuposBlacklist(res);
        // También actualizar el indicador del dock
        ckActualizarDockBlacklistIndicador(res);
    } catch (e) {
        console.error("Error al actualizar cupos blacklist:", e);
    }
}

function ckRenderizarCuposBlacklist(res) {
    const dot = document.getElementById('ckBlacklistCuposDot');
    const text = document.getElementById('ckBlacklistCuposText');
    if (!dot || !text) return;

    const restantes = res?.consultas_restantes ?? 5;
    const limite = res?.limite ?? 5;
    const bloqueado = res?.bloqueado ?? false;
    const horas = res?.horas ?? 0;
    const minutos = res?.minutos ?? 0;

    dot.className = 'ck-cupos-dot';
    if (bloqueado || restantes === 0) {
        dot.classList.add('agotado');
        text.innerHTML = `<span class="ck-cupos-count" style="color:#f87171">Agotado</span> · Disponible en ${horas}h ${minutos}m`;
    } else if (restantes <= 2) {
        dot.classList.add('advertencia');
        text.innerHTML = `<span class="ck-cupos-count">${restantes}</span> de ${limite} consultas Blacklist`;
    } else {
        dot.classList.add('disponible');
        text.innerHTML = `<span class="ck-cupos-count">${restantes}</span> de ${limite} consultas Blacklist`;
    }
}

/* ─── INDICADOR DE CUPOS BLACKLIST EN DOCK ─── */
function ckActualizarDockBlacklistIndicador(res) {
    let indicator = document.getElementById('ckDockBlacklistIndicator');
    if (!indicator) return;

    const restantes = res?.consultas_restantes ?? 5;
    const bloqueado = res?.bloqueado ?? false;

    const dot = indicator.querySelector('.dot');
    const label = indicator.querySelector('.ck-label');

    if (bloqueado || restantes === 0) {
        if (dot) { dot.style.background = '#f87171'; dot.style.boxShadow = '0 0 6px #f87171'; }
        if (label) label.textContent = `Blacklist: ${res.horas}h ${res.minutos}m`;
    } else if (restantes <= 2) {
        if (dot) { dot.style.background = '#fbbf24'; dot.style.boxShadow = '0 0 6px #fbbf24'; }
        if (label) label.textContent = `Blacklist: ${restantes} restantes`;
    } else {
        if (dot) { dot.style.background = '#4ade80'; dot.style.boxShadow = '0 0 6px #4ade80'; }
        if (label) label.textContent = `Blacklist: ${restantes}/5`;
    }
    indicator.classList.add('visible');
}

/* ─── AMPLIAR SCREENSHOT (LIGHTBOX) ─── */
function ckAmpliarScreenshot(src) {
    if (!src) src = _ckScreenshotActual;
    if (!src) return;

    // Eliminar lightbox previo si existe
    const previo = document.getElementById('ckLightboxOverlay');
    if (previo) previo.remove();

    // Normalizar ruta
    const webPath = typeof normalizePathForWeb === 'function' ? normalizePathForWeb(src) : src;

    const overlay = document.createElement('div');
    overlay.id = 'ckLightboxOverlay';
    overlay.onclick = () => overlay.remove();
    const imgEl = document.createElement('img');
    imgEl.src = `${webPath}?t=${Date.now()}`;
    imgEl.alt = 'Screenshot IMEI';
    imgEl.onerror = function() {
        this.src = `file://${src}?t=${Date.now()}`;
        this.onerror = null;
    };
    overlay.appendChild(imgEl);
    document.body.appendChild(overlay);
}

/* ─── CONSULTAR MODELO DESDE FILA (Estándar con Fallback a Pro) ─── */
async function consultarModeloFila(imei, originalIndex) {
    const idx = (originalIndex !== undefined && originalIndex >= 0 && registros[originalIndex]?.imei === imei)
        ? originalIndex
        : registros.findIndex(r => r.imei === imei);

    if (idx > -1 && registros[idx]) {
        registros[idx].modelo = "Consultando...";
        renderizarTabla();
    }
    showToastLoading("Consultando modelo...");

    try {
        // 1. Ejecutar ConsultarModelo (Estándar) primero
        let res = await window.pywebview.api.consultar_modelo(imei, ckIsHeadless());

        // 2. Si la respuesta es Error o falla, ejecutar automáticamente ConsultarModeloPro
        if (!res || res.status !== 'success' || !res.modelo) {
            showToast('Modelo Estándar falló. Reintentando con Modo Pro...', 'warning');
            res = await window.pywebview.api.consultar_modelo_pro(imei, false, ckIsHeadless());
        }

        if (res && res.status === 'success' && res.modelo) {
            if (idx > -1 && registros[idx]) {
                registros[idx].modelo = res.modelo;
            }
            await window.pywebview.api.actualizar_campo(imei, 'modelo', res.modelo);
            showToast(`Modelo: ${res.modelo}`, 'success');
        } else if (res && (res.status === 'sin_cupos' || res.status === 'limite_web')) {
            showToast(res.mensaje || 'Sin cupos disponibles', 'warning');
            if (idx > -1 && registros[idx]) {
                registros[idx].modelo = 'Sin cupos';
            }
        } else {
            showToast('No se pudo obtener el modelo', 'error');
            if (idx > -1 && registros[idx]) {
                registros[idx].modelo = '';
            }
        }
    } catch (e) {
        showToast('Error: ' + e, 'error');
        if (idx > -1 && registros[idx]) {
            registros[idx].modelo = '';
        }
    } finally {
        hideToastLoading();
        renderizarTabla();
    }

    // Actualizar indicador de cupos en el dock
    if (typeof window.pywebview.api.obtener_estado_cupos_modelo === 'function') {
        try {
            const cuposRes = await window.pywebview.api.obtener_estado_cupos_modelo();
            if (typeof ckActualizarDockIndicador === 'function') {
                ckActualizarDockIndicador(cuposRes);
            }
        } catch (err) {}
    }
}

/* ─── POLLING DE CUPOS PERIÓDICO ─── */
async function iniciarPollingCuposCheck() {
    // Carga inicial
    await ckActualizarCupos();
    await ckActualizarCuposBlacklist();
    // Actualizar cada 60 segundos
    if (_ckCuposTimer) clearInterval(_ckCuposTimer);
    _ckCuposTimer = setInterval(async () => {
        try {
            const res = await window.pywebview.api.obtener_estado_cupos_modelo();
            ckRenderizarCupos(res);
            ckActualizarDockIndicador(res);
        } catch (e) {}
        try {
            const resBl = await window.pywebview.api.obtener_estado_cupos_blacklist();
            ckRenderizarCuposBlacklist(resBl);
            ckActualizarDockBlacklistIndicador(resBl);
        } catch (e) {}
    }, 60000);
}

/* ─── EXPONER GLOBALMENTE ─── */
// Nuevas funciones Check
window.abrirCheck = abrirCheck;
window.cerrarCheck = cerrarCheck;
window.ckPegarIMEI = ckPegarIMEI;
window.ckConsultarModeloPro = ckConsultarModeloPro;
window.ckConsultarModeloEstandar = ckConsultarModeloEstandar;
window.ckConsultarImeiColombia = ckConsultarImeiColombia;
window.ckConsultarBlacklist = ckConsultarBlacklist;
window.ckActualizarCupos = ckActualizarCupos;
window.ckActualizarCuposBlacklist = ckActualizarCuposBlacklist;
window.ckAmpliarScreenshot = ckAmpliarScreenshot;
window.consultarModeloFila = consultarModeloFila;
window.iniciarPollingCuposCheck = iniciarPollingCuposCheck;

// Lógica de dos fases e inputs
async function ckEjecutarBusquedaModelo() {
    const btn = document.getElementById('ckBtnBuscarModelo');
    if (!btn) return;
    const fase = btn.getAttribute('data-fase') || '1';

    if (fase === '1') {
        await ckConsultarModeloEstandar();
    } else if (fase === '2') {
        await ckConsultarModeloPro();
    }
}
window.ckEjecutarBusquedaModelo = ckEjecutarBusquedaModelo;

function ckOnImeiInput() {
    const input = document.getElementById('ckImeiInput');
    if (!input) return;
    input.value = input.value.replace(/\D/g, '').substring(0, 15);
    ckLimpiarResultado();
    if (input.value.length === 15) {
        ckEjecutarBusquedaModelo();
    }
}
window.ckOnImeiInput = ckOnImeiInput;

// Aliases retrocompatibles (para que no se rompa nada)
window.abrirModelos = abrirCheck;
window.cerrarModelos = cerrarCheck;
window.mdConsultarModeloPro = ckConsultarModeloPro;
window.mdConsultarModeloEstandar = ckConsultarModeloEstandar;
window.mdConsultarModelo = ckConsultarModeloPro;
window.mdConsultarImeiColombia = ckConsultarImeiColombia;
window.mdConsultarBlacklist = ckConsultarBlacklist;
window.mdActualizarCupos = ckActualizarCupos;
window.mdAmpliarScreenshot = ckAmpliarScreenshot;
window.iniciarPollingCuposModelo = iniciarPollingCuposCheck;