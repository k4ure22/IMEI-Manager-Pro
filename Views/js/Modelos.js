/* =====================================================
   MÓDULO MODELOS — JavaScript
   Archivo: Views/js/Modelos.js
   ===================================================== */

/* ─── ESTADO INTERNO ─── */
let _mdScreenshotActual = null;
let _mdCuposTimer = null;

function mdIsHeadless() {
    return ((localStorage.getItem('imei-headless') || '1') === '1');
}

/* ─── ABRIR / CERRAR ─── */
async function abrirModelos() {
    document.getElementById('modelosOverlay').classList.add('active');
    mdLimpiarResultado();
    await mdActualizarCupos();
}

function cerrarModelos() {
    document.getElementById('modelosOverlay').classList.remove('active');
    _mdScreenshotActual = null;
    if (_mdCuposTimer) {
        clearInterval(_mdCuposTimer);
        _mdCuposTimer = null;
    }
}

/* ─── PEGAR IMEI ─── */
async function mdPegarIMEI() {
    try {
        const text = await navigator.clipboard.readText();
        const clean = text.replace(/\D/g, '').substring(0, 15);
        if (clean.length > 0) {
            document.getElementById('mdImeiInput').value = clean;
            showToast('IMEI pegado', 'success');
        }
    } catch {
        showToast('No se pudo leer el portapapeles', 'warning');
    }
}

/* ─── LIMPIAR RESULTADO ─── */
function mdLimpiarResultado() {
    _mdScreenshotActual = null;
    document.getElementById('mdResultArea').classList.add('hidden');
    document.getElementById('mdScreenshotArea').classList.add('hidden');
}

/* ─── VALIDAR IMEI ─── */
function mdGetIMEI() {
    const val = (document.getElementById('mdImeiInput')?.value || '').replace(/\D/g, '');
    if (val.length !== 15) {
        showToast('IMEI inválido — necesita 15 dígitos', 'warning');
        return null;
    }
    return val;
}

/* ─── MOSTRAR RESULTADO ─── */
function mdMostrarResultado({ iconClass, label, value, meta = [], loading = false }) {
    const area = document.getElementById('mdResultArea');
    const icon = document.getElementById('mdResultIcon');
    const lbl = document.getElementById('mdResultLabel');
    const val = document.getElementById('mdResultValue');
    const metaEl = document.getElementById('mdResultMeta');

    area.classList.remove('hidden');

    // Icono
    icon.className = `md-result-icon ${iconClass}`;
    if (loading) {
        icon.innerHTML = `<div class="md-spinner"></div>`;
    } else {
        icon.innerHTML = (value && (value.toLowerCase().includes('error') || value.toLowerCase().includes('fallido') || value.toLowerCase().includes('rechazado') || value.toLowerCase().includes('no encontrado'))) || iconClass.includes('error')
            ? `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
            : iconClass.includes('colombia')
                ? `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`
                : `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`;
    }

    lbl.textContent = label;
    val.textContent = value;

    // Meta info
    if (meta.length > 0) {
        metaEl.innerHTML = meta.map(m =>
            `<div class="md-result-meta-item">${m.label}: <span>${m.value}</span></div>`
        ).join('');
        metaEl.classList.remove('hidden');
    } else {
        metaEl.classList.add('hidden');
    }
}

/* ─── MOSTRAR SCREENSHOT ─── */
function mdMostrarScreenshot(ruta) {
    if (!ruta) return;
    _mdScreenshotActual = ruta;
    const area = document.getElementById('mdScreenshotArea');
    const img = document.getElementById('mdScreenshotImg');
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
async function mdConsultarModeloPro() {
    const imei = mdGetIMEI();
    if (!imei) return;

    mdLimpiarResultado();
    mdMostrarResultado({
        iconClass: 'md-icon-loading',
        label: 'Consultando modelo...',
        value: 'Conectando con iunlocker.com',
        loading: true
    });

    showToastLoading('Consultando modelo en iunlocker.com...');

    try {
        const res = await window.pywebview.api.consultar_modelo_pro(imei, true, mdIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            mdMostrarResultado({
                iconClass: 'md-icon-success',
                label: 'Modelo detectado',
                value: res.modelo || 'Sin información',
                meta: [
                    { label: 'IMEI', value: imei },
                    { label: 'Cupos restantes', value: res.consultas_restantes ?? '—' }
                ]
            });

            if (res.screenshot_path) {
                mdMostrarScreenshot(res.screenshot_path);
            }

            showToast(`Modelo: ${res.modelo}`, 'success');

        } else if (res.status === 'sin_cupos' || res.status === 'limite_web') {
            mdMostrarResultado({
                iconClass: 'md-icon-error',
                label: res.status === 'sin_cupos' ? 'Sin cupos disponibles' : 'Límite del sitio alcanzado',
                value: res.mensaje || 'Sin cupos disponibles',
                meta: [
                    { label: 'Disponible en', value: `${res.horas}h ${res.minutos}m` },
                    { label: 'Cupos', value: '0 / 5' }
                ]
            });
            showToast(res.mensaje || 'Sin cupos disponibles', 'warning');

        } else {
            mdMostrarResultado({
                iconClass: 'md-icon-error',
                label: 'Error al consultar',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || 'desconocido'), 'error');
        }

    } catch (e) {
        hideToastLoading();
        mdMostrarResultado({
            iconClass: 'md-icon-error',
            label: 'Error de conexión',
            value: String(e)
        });
    }

    // Actualizar indicador de cupos tras la consulta
    await mdActualizarCupos();
}

/* ─── CONSULTAR MODELO ESTÁNDAR (movical.net - gratuita) ─── */
async function mdConsultarModeloEstandar() {
    const imei = mdGetIMEI();
    if (!imei) return;

    mdLimpiarResultado();
    mdMostrarResultado({
        iconClass: 'md-icon-loading',
        label: 'Consultando modelo...',
        value: 'Conectando con movical.net (estándar)',
        loading: true
    });

    showToastLoading('Consultando modelo estándar...');

    try {
        const res = await window.pywebview.api.consultar_modelo_estandar(imei, mdIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            mdMostrarResultado({
                iconClass: 'md-icon-success',
                label: 'Modelo detectado (Estándar)',
                value: res.modelo || 'Sin información',
                meta: [
                    { label: 'IMEI', value: imei },
                    { label: 'Fuente', value: 'movical.net' }
                ]
            });

            if (res.screenshot_path) {
                mdMostrarScreenshot(res.screenshot_path);
            }

            showToast(`Modelo: ${res.modelo}`, 'success');

        } else {
            mdMostrarResultado({
                iconClass: 'md-icon-error',
                label: 'Error en consulta estándar',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || 'desconocido'), 'error');
        }

    } catch (e) {
        hideToastLoading();
        mdMostrarResultado({
            iconClass: 'md-icon-error',
            label: 'Error de conexión',
            value: String(e)
        });
    }
}

/* ─── CONSULTAR IMEI COLOMBIA (ScraperEstado + screenshot) ─── */
async function mdConsultarImeiColombia() {
    const imei = mdGetIMEI();
    if (!imei) return;

    mdLimpiarResultado();
    mdMostrarResultado({
        iconClass: 'md-icon-loading',
        label: 'Consultando IMEI Colombia...',
        value: 'Tomando pantallazo del resultado',
        loading: true
    });

    showToastLoading('Consultando estado en IMEI Colombia...');

    try {
        const res = await window.pywebview.api.consultar_imei_colombia_con_pantallazo(imei, mdIsHeadless());
        hideToastLoading();

        if (res.status === 'success') {
            mdMostrarResultado({
                iconClass: 'md-icon-colombia',
                label: 'Estado IMEI Colombia',
                value: res.estado || 'Sin información',
                meta: [
                    { label: 'Operador', value: res.operador || '—' },
                    { label: 'IMEI', value: imei }
                ]
            });

            if (res.screenshot_path) {
                mdMostrarScreenshot(res.screenshot_path);
            }

            showToast(`Estado: ${res.estado} | ${res.operador}`, 'success');

        } else {
            mdMostrarResultado({
                iconClass: 'md-icon-error',
                label: 'Error al consultar',
                value: res.mensaje || 'Error desconocido'
            });
            showToast('Error: ' + (res.mensaje || ''), 'error');
        }

    } catch (e) {
        hideToastLoading();
        mdMostrarResultado({
            iconClass: 'md-icon-error',
            label: 'Error de conexión',
            value: String(e)
        });
    }
}

/* ─── BLACKLIST (próximamente) ─── */
function mdConsultarBlacklist() {
    showToast('Blacklist próximamente disponible', 'warning');
}

/* ─── ACTUALIZAR CUPOS ─── */
async function mdActualizarCupos() {
    try {
        const res = await window.pywebview.api.obtener_estado_cupos_modelo();
        mdRenderizarCupos(res);
        // También actualizar el indicador del dock
        mdActualizarDockIndicador(res);
    } catch {
        // Silencioso si el API no está disponible aún
    }
}

function mdRenderizarCupos(res) {
    const dot = document.getElementById('mdCuposDot');
    const text = document.getElementById('mdCuposText');
    if (!dot || !text) return;

    const restantes = res?.consultas_restantes ?? 5;
    const limite = res?.limite ?? 5;
    const bloqueado = res?.bloqueado ?? false;
    const horas = res?.horas ?? 0;
    const minutos = res?.minutos ?? 0;

    // Color del dot según cupos
    dot.className = 'md-cupos-dot';
    if (bloqueado || restantes === 0) {
        dot.classList.add('agotado');
        text.innerHTML = `<span class="md-cupos-count" style="color:#f87171">Agotado</span> · Disponible en ${horas}h ${minutos}m`;
    } else if (restantes <= 2) {
        dot.classList.add('advertencia');
        text.innerHTML = `<span class="md-cupos-count">${restantes}</span> de ${limite} consultas restantes`;
    } else {
        dot.classList.add('disponible');
        text.innerHTML = `<span class="md-cupos-count">${restantes}</span> de ${limite} consultas restantes`;
    }
}

/* ─── INDICADOR DE CUPOS EN DOCK ─── */
function mdActualizarDockIndicador(res) {
    let indicator = document.getElementById('mdDockCuposIndicator');
    if (!indicator) return;

    const restantes = res?.consultas_restantes ?? 5;
    const bloqueado = res?.bloqueado ?? false;

    const dot = indicator.querySelector('.dot');
    const label = indicator.querySelector('.md-label');

    if (bloqueado || restantes === 0) {
        if (dot) { dot.style.background = '#f87171'; dot.style.boxShadow = '0 0 6px #f87171'; }
        if (label) label.textContent = `Modelos: ${res.horas}h ${res.minutos}m`;
    } else if (restantes <= 2) {
        if (dot) { dot.style.background = '#fbbf24'; dot.style.boxShadow = '0 0 6px #fbbf24'; }
        if (label) label.textContent = `Modelos: ${restantes} restantes`;
    } else {
        if (dot) { dot.style.background = '#4ade80'; dot.style.boxShadow = '0 0 6px #4ade80'; }
        if (label) label.textContent = `Modelos: ${restantes}/5`;
    }
    indicator.classList.add('visible');
}

/* ─── AMPLIAR SCREENSHOT (LIGHTBOX) ─── */
function mdAmpliarScreenshot(src) {
    if (!src) src = _mdScreenshotActual;
    if (!src) return;

    // Eliminar lightbox previo si existe
    const previo = document.getElementById('mdLightboxOverlay');
    if (previo) previo.remove();

    // Normalizar ruta
    const webPath = typeof normalizePathForWeb === 'function' ? normalizePathForWeb(src) : src;

    const overlay = document.createElement('div');
    overlay.id = 'mdLightboxOverlay';
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
        let res = await window.pywebview.api.consultar_modelo(imei, mdIsHeadless());

        // 2. Si la respuesta es Error o falla, ejecutar automáticamente ConsultarModeloPro
        if (!res || res.status !== 'success' || !res.modelo) {
            showToast('Modelo Estándar falló. Reintentando con Modo Pro...', 'warning');
            res = await window.pywebview.api.consultar_modelo_pro(imei, false, mdIsHeadless());
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
            if (typeof mdActualizarDockIndicador === 'function') {
                mdActualizarDockIndicador(cuposRes);
            }
        } catch (err) {}
    }
}

/* ─── POLLING DE CUPOS PERIÓDICO ─── */
async function iniciarPollingCuposModelo() {
    // Carga inicial
    await mdActualizarCupos();
    // Actualizar cada 60 segundos
    if (_mdCuposTimer) clearInterval(_mdCuposTimer);
    _mdCuposTimer = setInterval(async () => {
        const res = await window.pywebview.api.obtener_estado_cupos_modelo();
        mdActualizarDockIndicador(res);
    }, 60000);
}

/* ─── EXPONER GLOBALMENTE ─── */
window.abrirModelos = abrirModelos;
window.cerrarModelos = cerrarModelos;
window.mdPegarIMEI = mdPegarIMEI;
window.mdConsultarModeloPro = mdConsultarModeloPro;
window.mdConsultarModeloEstandar = mdConsultarModeloEstandar;
window.mdConsultarModelo = mdConsultarModeloPro; // Alias retrocompatible
window.mdConsultarImeiColombia = mdConsultarImeiColombia;
window.mdConsultarBlacklist = mdConsultarBlacklist;
window.mdActualizarCupos = mdActualizarCupos;
window.mdAmpliarScreenshot = mdAmpliarScreenshot;
window.consultarModeloFila = consultarModeloFila;
window.iniciarPollingCuposModelo = iniciarPollingCuposModelo;