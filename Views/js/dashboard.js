/* ============ ESTADO GLOBAL ============ */
/* ============ ICONOS SVG ============ */
const ICONS = {
    success: '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
    error: '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
    warning: '<svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
    loading: '<svg class="w-5 h-5 animate-spin text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',
    copy: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>',
    trash: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
    save: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>',
    unlocked: '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>',
    locked: '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>',
    device: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>',
    camera: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
    file: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
    bell: '<svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>'
};

/* ============ UTILIDADES ============ */
function normalizePathForWeb(ruta) {
    if (!ruta) return '';
    // Si es una ruta absoluta del sistema, convertir a relativa desde Views/html/
    const filename = ruta.replace(/\\/g, '/').split('/').pop();
    return `../../Controllers/temp_screenshots/${filename}`;
}

async function pegarDesdePortapapeles() {
    try {
        const text = await navigator.clipboard.readText();
        const clean = text.replace(/\s+/g, '').trim();
        if (clean.length > 0) {
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.value = clean;
                renderizarTabla();
                actualizarBotonClearSearch();
                showToast('Pegado desde portapapeles', 'success');
            }
        }
    } catch (e) {
        showToast('No se pudo leer el portapapeles', 'warning');
    }
}
window.pegarDesdePortapapeles = pegarDesdePortapapeles;

function limpiarBusquedaGlobal() {
    const input = document.getElementById('globalSearch');
    if (input) {
        input.value = '';
        input.focus();
        renderizarTabla();
        actualizarBotonClearSearch();
    }
}
window.limpiarBusquedaGlobal = limpiarBusquedaGlobal;

function actualizarBotonClearSearch() {
    const input = document.getElementById('globalSearch');
    const btnClear = document.getElementById('btnClearSearch');
    if (input && btnClear) {
        if (input.value.trim().length > 0) {
            btnClear.classList.remove('hidden');
        } else {
            btnClear.classList.add('hidden');
        }
    }
}
window.actualizarBotonClearSearch = actualizarBotonClearSearch;

let registros = [];
let datosFastReg = [];
let vistaActual = 'gestor';
let todosLosClientesCache = [];
let todasLasLineasCache = [];
let todosLosEncargados = [];
let currentUser = null;
let currentDbStatus = 'active';
let _appInited = false;
let imeiEsperandoPin = null;
let indiceDetallesActual = null;
let isFirstRender = true;
let headlessEnabled = ((localStorage.getItem('imei-headless') || '1') === '1');
let _hiddenClientNames = new Set();
let _hiddenClientsCache = [];
let _hiddenLinesCache = [];
let _todosClientesModuloCache = [];
let _clienteModuloEditandoId = null;

const SVG_EYE_OPEN = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color)"><path d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_EYE_CLOSED = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color)"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 18.5c-6.5 0-10.5-6.5-10.5-6.5a18.45 18.45 0 0 1 2.45-3.45M8.88 8.88A3 3 0 1 0 13.12 13.12M22.5 12s-4-6.5-10.5-6.5a10.07 10.07 0 0 0-5.94.56L2 2l20 20z"/><path d="M2 13l3-3m7 2V8m7 5l-3-3"/></svg>`; // Ojo con pestañas simplificado

function actualizarBotonHeadless() {
    const iconCont = document.getElementById('headlessIconContainer');
    const textEl = document.getElementById('headlessToggleText');
    if (!iconCont) return;

    // headlessEnabled: true = HIDDEN, false = VISIBLE
    iconCont.innerHTML = headlessEnabled ? SVG_EYE_CLOSED : SVG_EYE_OPEN;
    if (textEl) textEl.innerText = headlessEnabled ? 'Mostrar procesos' : 'Ocultar procesos';
    iconCont.style.opacity = headlessEnabled ? '0.4' : '1';
}

function toggleHeadless() {
    headlessEnabled = !headlessEnabled;
    localStorage.setItem('imei-headless', headlessEnabled ? '1' : '0');
    actualizarBotonHeadless();

    // (Opcional) feedback visual sin romper el UX
}

/* ============ TEMA ============ */
const SVG_SOL = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color)"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const SVG_LUNA = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;


/* ============ ORDENAMIENTO ============ */
function actualizarTextoOrden() {
    const sel = document.getElementById('ordenarRegistros');
    const txt = document.getElementById('sortToggleText');
    if (!sel || !txt) return;
    const labels = {
        'recientes': 'Más recientes',
        'antiguos': 'Más antiguos',
        'rojos': 'Automático',
        'pendientes': 'Sin registrar'
    };
    txt.innerText = labels[sel.value] || 'Ordenar';
}

function getIconPath(base, isHover = false) {
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';
    // Construir ruta absoluta desde la ubicación del HTML (file:// safe)
    const base_url = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    const icons_url = base_url + '/../icons';
    if (isHover) return `${icons_url}/${base}color.png`;
    if (base === 'logoIMP' || base === 'logotipo') return `${icons_url}/${base}${tema === 'light' ? 'light' : 'dark'}.png`;
    return `${icons_url}/${base}${tema === 'light' ? 'light' : ''}.png`;
}

function actualizarTodosLosIconos() {
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';

    // 1. Actualizar dock items
    document.querySelectorAll('.dock-item img').forEach(img => {
        const alt = (img.getAttribute('alt') || '').toLowerCase();
        const map = { 'nuevo': 'nuevo', 'modelos': 'modelos', 'personal': 'personal', 'papelera': 'papelera', 'check': 'modelos' };
        const base = map[alt] || alt;
        img.src = getIconPath(base);
    });

    // 2. Otros iconos estáticos (wom, etb, ojo, etc.)
    document.querySelectorAll('img[data-icon-base]').forEach(img => {
        img.src = getIconPath(img.dataset.iconBase);
    });

    // 3. Forzar re-render si la tabla existe
    if (typeof renderizarTabla === 'function' && !isFirstRender) {
        renderizarTabla();
    }
}

function actualizarBotonTema(tema) {
    const iconCont = document.getElementById('themeIconContainer');
    const textEl = document.getElementById('themeToggleText');
    // Si el tema actual es DARK, el botón debe ofrecer cambiar a CLARO
    if (iconCont) iconCont.innerHTML = tema === 'dark' ? SVG_SOL : SVG_LUNA;
    if (textEl) textEl.innerText = tema === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
}

function toggleTheme() {
    const html = document.documentElement;
    const actual = html.getAttribute('data-theme') || 'dark';
    const nuevo = actual === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nuevo);
    localStorage.setItem('imei-theme', nuevo);
    actualizarBotonTema(nuevo);
    actualizarTodosLosIconos();
    try {
        if (window.pywebview) window.pywebview.api.cambiar_tema(nuevo);
    } catch (e) { }
}

/* ============ INIT ============ */

function hideSplash() {
    const s = document.getElementById('splashOverlay');
    if (!s) return;
    const wrap = document.getElementById('splashWrap');
    if (wrap) {
        wrap.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        wrap.style.opacity = '0';
        wrap.style.transform = 'scale(0.96) translateY(-4px)';
    }
    s.style.opacity = '0';
    s.style.pointerEvents = 'none';
    setTimeout(() => { s.style.display = 'none'; }, 560);
}

async function initApp() {
    if (_appInited) return;
    _appInited = true;

    const temaGuardado = localStorage.getItem('imei-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', temaGuardado);
    actualizarBotonTema(temaGuardado);
    actualizarTodosLosIconos();
    actualizarBotonHeadless();
    actualizarTextoOrden();

    document.title = "IMEI Manager Pro";

    // Verificar estado de la Base de Datos en el inicio
    try {
        const stateRes = await window.pywebview.api.obtener_estado_bd();
        if (stateRes && stateRes.status === 'success') {
            currentDbStatus = stateRes.db_status;
            actualizarVisualizacionEstadoBD(currentDbStatus);
            if (currentDbStatus === 'paused') {
                hideSplash();
                mostrarPantallaSleep();
                return;
            }
        }
    } catch (e) {
        console.error("Error al obtener estado inicial de la BD:", e);
    }

    // Verificar soporte de huella digital (Touch ID)
    await verificarSoporteBiometrico();

    // Sincronizar sesión persistida desde disco (FilesIMP/session_cache.json) hacia localStorage
    try {
        if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.obtener_sesion_local === 'function') {
            const diskRes = await window.pywebview.api.obtener_sesion_local();
            if (diskRes && diskRes.status === 'success' && diskRes.session) {
                localStorage.setItem('imei-last-session', JSON.stringify(diskRes.session));
            } else {
                const lsSessionStr = localStorage.getItem('imei-last-session');
                if (lsSessionStr) {
                    try {
                        const lsSession = JSON.parse(lsSessionStr);
                        if (lsSession && lsSession.email && typeof window.pywebview.api.guardar_sesion_local === 'function') {
                            await window.pywebview.api.guardar_sesion_local(lsSession);
                        }
                    } catch (e) {}
                }
            }
        }
    } catch (e) {
        console.warn("Sincronización de sesión:", e);
    }

    // Siempre mostramos la pantalla de login; switchAuthMode detecta internamente
    // si hay un usuario recordado y adapta el encabezado y los campos.
    window.usuarioRecordadoRechazado = false;
    hideSplash();
    mostrarPantallaLogin();
}

function mostrarPantallaLogin() {
    const authOverlay = document.getElementById('authOverlay');
    if (authOverlay) {
        authOverlay.style.opacity = '1';
        authOverlay.style.pointerEvents = 'auto';
        authOverlay.classList.remove('hidden');
    }
    const sleepOverlay = document.getElementById('sleepOverlay');
    if (sleepOverlay) sleepOverlay.classList.add('hidden');
    switchAuthMode('login');
}

// NOTA: mostrarPantallaSesionRecordada ya no se usa directamente.
// La lógica de usuario recordado vive en switchAuthMode('login').
function mostrarPantallaSesionRecordada(lastSession) {
    // Compatibilidad: si se llama, simplemente ir al login que detecta el usuario.
    window.usuarioRecordadoRechazado = false;
    mostrarPantallaLogin();
}

function mostrarPantallaSleep() {
    document.getElementById('authOverlay').classList.add('hidden');
    document.getElementById('sleepOverlay').classList.remove('hidden');
}

function regresarAlLoginDesdeSleep() {
    mostrarPantallaLogin();
}
async function cargarClientesBase() {
    try {
        todosLosClientesCache = await window.pywebview.api.obtener_todos_clientes() || [];
    } catch (e) { console.error("Error al cargar clientes base:", e); }
}

function cambiarClienteDesdeDetalles() {
    const sel = document.getElementById('detClienteInput');
    sel.innerHTML = '<option value="" class="bg-gray-900">Sin Asignar</option>';
    todosLosClientesCache.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.nombre;
        opt.innerText = c.nombre;
        opt.className = "bg-gray-900 py-1";
        sel.appendChild(opt);
    });
    sel.classList.remove('hidden');
    // Para que actúe visualmente como lista desplegada:
    sel.size = todosLosClientesCache.length > 6 ? 6 : (todosLosClientesCache.length || 1) + 1;
    sel.focus();
}

// Polling robusto: espera hasta que window.pywebview.api esté disponible.
(function waitForApi() {
    if (window.pywebview && window.pywebview.api && window.pywebview.api.obtener_registros) {
        console.log("✅ [JS] API Totalmente Lista y Detectada");
        initApp();
        return;
    }
    // Si no está lista, reintentamos en 100ms
    setTimeout(waitForApi, 100);
})();

document.addEventListener('DOMContentLoaded', () => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    actualizarBotonTema(t);

    // Soporte para lector de barras en campo de búsqueda global
    document.getElementById('globalSearch')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstRow = document.querySelector('#tableBody tr');
            if (firstRow) {
                firstRow.click();
            }
        }
    });

    // Inicializar previsualización interactiva del formulario de personal
    initLivePersonalForm();
    actualizarBotonClearSearch();
});

// Capturar tipeo global para búsqueda
document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT';
    if (!isInput && !document.querySelector('.modal-overlay.active') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (e.key.length === 1 || e.key === 'Backspace') {
            document.getElementById('globalSearch').focus();
        }
    }
});

// Actualizamos las coordenadas del ratón relativas a la fila
document.getElementById('tableBody')?.addEventListener('mousemove', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const rect = tr.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tr.style.setProperty('--mouse-x', `${x}px`);
    tr.style.setProperty('--mouse-y', `${y}px`);
});

/* ============ TOAST ============ */
let toastHideTimer = null;

/* ============ TOAST LOADING (IZQUIERDA) ============ */
let toastLoadingHideTimer = null;

function posicionarToastLoadingDesdeDock() {
    const t = document.getElementById('toastLoading');
    const dock = document.querySelector('.mac-dock');
    if (!t || !dock) return;

    const dockRect = dock.getBoundingClientRect();
    const toastWidth = t.offsetWidth || 310;
    const toastHeight = t.offsetHeight || 74;
    const margenPantalla = 24;

    const y = Math.round(dockRect.top + (dockRect.height / 2) - (toastHeight / 2));
    const attachedRight = Math.round(dockRect.left + 8);
    const startX = Math.round(attachedRight - toastWidth);
    const endX = Math.round(margenPantalla);
    const linkWidth = Math.max(28, attachedRight - (endX + toastWidth) + 18);

    t.style.setProperty('--toast-y', `${y}px`);
    t.style.setProperty('--toast-x-start', `${startX}px`);
    t.style.setProperty('--toast-x-end', `${endX}px`);
    t.style.setProperty('--toast-link-width', `${linkWidth}px`);
}

function showToastLoading(message) {
    const t = document.getElementById('toastLoading');
    if (!t) return;
    const dock = document.querySelector('.mac-dock');
    const msgEl = document.getElementById('toastLoadingMessage');
    const barInner = document.getElementById('toastLoadingBarInner');

    // Ocultar botón flotante de notificaciones cuando sale el toast izquierdo
    const btnNotif = document.getElementById('btnNotificaciones');
    if (btnNotif) {
        btnNotif.style.opacity = '0';
        btnNotif.style.pointerEvents = 'none';
        btnNotif.style.transform = 'translateY(12px)';
    }

    if (toastLoadingHideTimer) {
        clearTimeout(toastLoadingHideTimer);
        toastLoadingHideTimer = null;
    }

    t.classList.remove('show');
    t.removeAttribute('data-toast-state');

    if (msgEl) msgEl.innerText = message;
    posicionarToastLoadingDesdeDock();
    void t.offsetWidth;

    if (dock) {
        dock.classList.remove('toast-core-split-left');
        dock.classList.remove('toast-core-merge-left');
        void dock.offsetWidth;
        dock.classList.add('toast-core-split-left');
    }

    // Reiniciar animación de la barra
    if (barInner) {
        barInner.classList.remove('anim');
        void barInner.offsetWidth;
        barInner.classList.add('anim');
    }

    t.setAttribute('data-toast-state', 'enter');
    t.classList.add('show');
}

function hideToastLoading() {
    const t = document.getElementById('toastLoading');
    if (!t) return;
    const dock = document.querySelector('.mac-dock');

    // Restaurar botón flotante de notificaciones al ocultarse el toast izquierdo
    const btnNotif = document.getElementById('btnNotificaciones');
    if (btnNotif) {
        btnNotif.style.opacity = '1';
        btnNotif.style.pointerEvents = 'auto';
        btnNotif.style.transform = 'translateY(0)';
    }

    t.setAttribute('data-toast-state', 'exit');
    if (dock) {
        dock.classList.remove('toast-core-split-left');
        dock.classList.remove('toast-core-merge-left');
        void dock.offsetWidth;
        dock.classList.add('toast-core-merge-left');
    }

    requestAnimationFrame(() => t.classList.remove('show'));
    toastLoadingHideTimer = setTimeout(() => {
        if (!t.classList.contains('show')) {
            t.removeAttribute('data-toast-state');
        }
        dock?.classList.remove('toast-core-merge-left');
        const barInner = document.getElementById('toastLoadingBarInner');
        barInner?.classList.remove('anim');
    }, 980);
}

function posicionarToastDesdeDock() {
    const t = document.getElementById('toast');
    const dock = document.querySelector('.mac-dock');
    if (!t || !dock) return;

    const dockRect = dock.getBoundingClientRect();
    const toastWidth = t.offsetWidth || 280;
    const toastHeight = t.offsetHeight || 44;
    const margenPantalla = 24;

    const y = Math.round(dockRect.top + (dockRect.height / 2) - (toastHeight / 2));
    const startX = Math.round(dockRect.right - 8);
    const endX = Math.round(Math.max(startX + 20, window.innerWidth - toastWidth - margenPantalla));
    const linkWidth = Math.max(28, endX - startX + 18);

    t.style.setProperty('--toast-y', `${y}px`);
    t.style.setProperty('--toast-x-start', `${startX}px`);
    t.style.setProperty('--toast-x-end', `${endX}px`);
    t.style.setProperty('--toast-link-width', `${linkWidth}px`);
}

function showToast(message, icon = "✅") {
    const t = document.getElementById('toast');
    const dock = document.querySelector('.mac-dock');
    if (!t) return;

    // Ocultar contadores del dock cuando sale el toast derecho
    const contadores = document.getElementById('ckDockIndicatorsContainer');
    if (contadores) {
        contadores.style.opacity = '0';
        contadores.style.pointerEvents = 'none';
        contadores.style.transform = 'translateY(12px)';
    }

    if (toastHideTimer) {
        clearTimeout(toastHideTimer);
        toastHideTimer = null;
    }

    t.classList.remove('show');
    t.removeAttribute('data-toast-state');
    document.getElementById('toastMessage').innerText = message;
    document.getElementById('toastIcon').innerHTML = ICONS[icon] || ICONS.success;

    posicionarToastDesdeDock();
    // Reinicia el timeline para que siempre salga desde el dock.
    void t.offsetWidth;
    if (dock) {
        dock.classList.remove('toast-core-split');
        dock.classList.remove('toast-core-merge');
        void dock.offsetWidth;
        dock.classList.add('toast-core-split');
    }
    t.setAttribute('data-toast-state', 'enter');
    t.classList.add('show');

    toastHideTimer = setTimeout(() => {
        t.setAttribute('data-toast-state', 'exit');
        if (dock) {
            dock.classList.remove('toast-core-split');
            dock.classList.remove('toast-core-merge');
            void dock.offsetWidth;
            dock.classList.add('toast-core-merge');
        }

        // Restaurar contadores cuando el toast derecho empieza a guardarse
        const contadores = document.getElementById('ckDockIndicatorsContainer');
        if (contadores) {
            contadores.style.opacity = '1';
            contadores.style.pointerEvents = 'auto';
            contadores.style.transform = 'translateY(0)';
        }

        requestAnimationFrame(() => t.classList.remove('show'));
        setTimeout(() => {
            if (!t.classList.contains('show')) {
                t.removeAttribute('data-toast-state');
            }
            dock?.classList.remove('toast-core-merge');
        }, 980);
    }, 3000);
}



document.getElementById('toast')?.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    const t = e.currentTarget;
    if (!t.classList.contains('show')) {
        t.removeAttribute('data-toast-state');
    }
});

window.addEventListener('resize', () => {
    const t = document.getElementById('toast');
    if (t && t.classList.contains('show')) {
        posicionarToastDesdeDock();
    }
});

/* ============ TOAST CONFIRMACIÓN CONSULTA INICIAL ============ */
function mostrarToastConfirmacionConsulta(toCheck) {
    const t = document.getElementById('toast');
    const dock = document.querySelector('.mac-dock');
    if (!t) return;

    if (toastHideTimer) {
        clearTimeout(toastHideTimer);
        toastHideTimer = null;
    }

    t.classList.remove('show');
    t.removeAttribute('data-toast-state');

    document.getElementById('toastIcon').innerHTML = ICONS['info'] || ICONS.success;
    document.getElementById('toastMessage').innerHTML =
        `<span style="margin-right:10px">${toCheck.length} registros pendientes</span>` +
        `<button id="toastBtnConsultar" style="
            background: transparent;
            color: #00f3ff;
            font-weight: 800; font-size: 11px;
            padding: 5px 14px; border-radius: 10px;
            border: 1.5px solid #00f3ff;
            box-shadow: 0 0 8px rgba(0,243,255,0.45), inset 0 0 8px rgba(0,243,255,0.08);
            cursor: pointer; text-transform: uppercase; letter-spacing: 0.6px;
            transition: all 0.2s; margin-right: 6px;
        " onmouseover="this.style.background='rgba(0,243,255,0.15)';this.style.boxShadow='0 0 16px rgba(0,243,255,0.7), inset 0 0 10px rgba(0,243,255,0.12)';"
           onmouseout="this.style.background='transparent';this.style.boxShadow='0 0 8px rgba(0,243,255,0.45), inset 0 0 8px rgba(0,243,255,0.08)';"
        >Consultar</button>` +
        `<button id="toastBtnOmitir" style="
            background: transparent;
            color: rgba(255,255,255,0.55); font-weight: 700; font-size: 11px;
            padding: 5px 14px; border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.18);
            cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;
            transition: all 0.2s;
        " onmouseover="this.style.borderColor='rgba(255,255,255,0.4)';this.style.color='rgba(255,255,255,0.85)';"
           onmouseout="this.style.borderColor='rgba(255,255,255,0.18)';this.style.color='rgba(255,255,255,0.55)';"
        >Omitir</button>`;

    posicionarToastDesdeDock();
    void t.offsetWidth;
    if (dock) {
        dock.classList.remove('toast-core-split', 'toast-core-merge');
        void dock.offsetWidth;
        dock.classList.add('toast-core-split');
    }
    t.setAttribute('data-toast-state', 'enter');
    t.classList.add('show');
    t.style.pointerEvents = 'auto';

    function cerrarToastConfirmacion() {
        t.style.pointerEvents = '';
        t.setAttribute('data-toast-state', 'exit');
        if (dock) {
            dock.classList.remove('toast-core-split', 'toast-core-merge');
            void dock.offsetWidth;
            dock.classList.add('toast-core-merge');
        }
        requestAnimationFrame(() => t.classList.remove('show'));
        setTimeout(() => {
            if (!t.classList.contains('show')) {
                t.removeAttribute('data-toast-state');
            }
            dock?.classList.remove('toast-core-merge');
        }, 980);
    }

    setTimeout(() => {
        document.getElementById('toastBtnConsultar')?.addEventListener('click', () => {
            cerrarToastConfirmacion();
            setTimeout(() => {
                showToast(`Consultando ${toCheck.length} registros pendientes/rojos...`, "info");
                procesarColaBackground(toCheck);
            }, 400);
        });
        document.getElementById('toastBtnOmitir')?.addEventListener('click', () => {
            cerrarToastConfirmacion();
            setTimeout(() => showToast("Consulta inicial omitida.", "info"), 400);
        });
    }, 50);
}

/* ============ DATOS ============ */
async function cargarDatos() {
    try {
        if (window.pywebview && window.pywebview.api) {
            const res = await window.pywebview.api.obtener_registros();
            if (res) {
                // El último guardado saldrá arriba
                registros = res.reverse();
                renderizarTabla();
            }
        }
    } catch (e) { console.error(e); }
}

/* ============ AUTOCOMPLETE ============ */
function inicializarAutocomplete() {
    const autoList = document.getElementById('autocomplete-list');
    document.querySelectorAll('.auto-input').forEach(input => {
        input.addEventListener('focus', function () {
            const field = this.getAttribute('data-field');
            const rect = this.getBoundingClientRect();
            const unicos = [...new Set(registros.map(r => r[field]).filter(Boolean))];
            if (unicos.length === 0) return;
            autoList.innerHTML = '';
            unicos.forEach(val => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.textContent = val;
                div.onmousedown = () => { this.value = val; autoList.classList.add('hidden'); };
                autoList.appendChild(div);
            });
            autoList.style.top = `${rect.bottom + window.scrollY + 4}px`;
            autoList.style.left = `${rect.left + window.scrollX}px`;
            autoList.style.width = `${rect.width}px`;
            autoList.classList.remove('hidden');
        });
        input.addEventListener('blur', () => { setTimeout(() => autoList.classList.add('hidden'), 200); });
    });
}

/* ============ AUTOMATIC CHECKER HELPERS ============ */
function esPendienteORojo(reg) {
    const neon = evaluarNeon(reg);
    if (neon === 'neon-rojo') return true;
    if (!reg.estado) return true;
    const est = reg.estado.toLowerCase();
    if (est === '' || est.includes('consultando') || est.includes('pendiente') || est.includes('sin consultar') || est.includes('no cargó página/input') || est.includes('falló 7 veces') || est.includes('error consulta')) {
        return true;
    }
    return false;
}

function encontrarElementoFila(imei) {
    const tbody = document.getElementById("tableBody");
    if (!tbody) return null;
    const rows = tbody.querySelectorAll("tr");
    for (let row of rows) {
        const cell = row.cells[1];
        if (cell && cell.innerText.trim() === imei) {
            return row;
        }
    }
    return null;
}

let backgroundQueueActive = false;
async function procesarColaBackground(toCheck) {
    if (backgroundQueueActive) return;
    backgroundQueueActive = true;

    for (let i = 0; i < toCheck.length; i++) {
        const reg = toCheck[i];
        const index = registros.findIndex(r => r.imei === reg.imei);
        if (index === -1) continue;

        showToast(`Consultando IMEI inicial ${i + 1}/${toCheck.length}: ${reg.imei}`, "info");

        const oldEstado = registros[index] ? registros[index].estado : "";
        const oldNeon = evaluarNeon(registros[index]);

        registros[index].estado = "Consultando...";
        renderizarTabla();

        try {
            const res = await window.pywebview.api.actualizar_imei(reg.imei, headlessEnabled);

            if (res.status === "success") {
                registros[index].estado = res.estado;
                registros[index].operador = res.operador;

                // Solicitar línea (ETB) o PIN (WOM) si y sólo si cambió de libre a Robo/hurto o Extravío
                procesarCambioEstadoBloqueo(registros[index], oldEstado, res.estado, res.operador, index);

                const newNeon = evaluarNeon(registros[index]);
                if (oldNeon !== "neon-verde" && newNeon === "neon-verde") {
                    setTimeout(() => {
                        const rowEl = encontrarElementoFila(reg.imei);
                        if (rowEl) {
                            rowEl.classList.add("row-success-flash");
                            setTimeout(() => rowEl.classList.remove("row-success-flash"), 3000);
                        }
                    }, 50);
                }
            } else {
                registros[index].estado = oldEstado || "Error";
            }
        } catch (e) {
            console.error("Error updating IMEI in background:", e);
            registros[index].estado = oldEstado || "Error";
        }

        renderizarTabla();
        await new Promise(r => setTimeout(r, 1000));
    }

    backgroundQueueActive = false;
    showToast("Consulta inicial en segundo plano completada.", "success");
}

/* ============ LÓGICA NEON ============ */
function evaluarNeon(reg) {
    if (!reg) return "";
    const razon = (reg.razon || "").toLowerCase().trim();
    const estado = (reg.estado || "").toLowerCase().trim();
    if (!razon && !estado) return "";

    const esLibre = estado.includes("libre") || estado.includes("desbloquead");

    // Trámite / acción en proceso para desbloqueo (correo WOM enviado o declaración ETB generada)
    const correoWomEnviado = !!(
        (reg.fecha_correo_wom && String(reg.fecha_correo_wom).trim() !== '' && String(reg.fecha_correo_wom).trim() !== 'null') ||
        reg.correo_enviado === true || reg.correo_enviado === 'true' || reg.correo_enviado === 1
    );
    const docEtbRealizado = !!(
        (reg.fecha_declaracion_generada && String(reg.fecha_declaracion_generada).trim() !== '' && String(reg.fecha_declaracion_generada).trim() !== 'null') ||
        (reg.ruta_declaracion_generada && String(reg.ruta_declaracion_generada).trim() !== '' && String(reg.ruta_declaracion_generada).trim() !== 'null') ||
        reg.archivo_creado === true || reg.archivo_creado === 'true' || reg.archivo_creado === 1 ||
        reg.pdf_generado === true || reg.pdf_generado === 'true' || reg.pdf_generado === 1
    );
    const tieneAccionEnProceso = correoWomEnviado || docEtbRealizado;

    // Detectar tipos de razones (orden y exclusiones estrictas)
    const esDesbloqueo = razon.includes("desbloqueo");
    const esNoRegistro = razon.includes("no registro");
    const esRegistro   = razon.includes("registro") && !esNoRegistro;
    const esBloqueo    = !esDesbloqueo && (razon.includes("bloqueo") || razon === "bloqueo definitivo");

    // ── 1. REGISTRO ──
    // El objetivo es registrar el dispositivo en el operador (WOM o ETB).
    // Verde: El bot registró exitosamente en WOM o ETB.
    // Rojo: No se ha registrado aún en ningún operador.
    if (esRegistro) {
        const womExito = reg.reg_wom && reg.reg_wom !== 'No' && reg.reg_wom !== 'Error' && reg.reg_wom !== '';
        const etbExito = reg.reg_etb && reg.reg_etb !== 'No' && reg.reg_etb !== 'Error' && reg.reg_etb !== '';
        return (womExito || etbExito) ? "neon-verde" : "neon-rojo";
    }

    // ── 2. DESBLOQUEO ──
    // El objetivo es desbloquear un IMEI reportado/bloqueado.
    // Verde: El estado del IMEI ya está "Libre" (desbloqueado con éxito).
    // Amarillo: El estado aún no está "Libre", pero ya se inició el trámite (correo WOM enviado o PDF ETB generado).
    // Rojo: El estado no está "Libre" y no se ha iniciado ningún trámite.
    if (esDesbloqueo) {
        if (esLibre) return "neon-verde";
        if (tieneAccionEnProceso) return "neon-amarillo";
        return "neon-rojo";
    }

    // ── 3. NO REGISTRO ──
    // Bloqueado por falta de registro.
    // Verde: Ya se encuentra "Libre".
    // Amarillo: Aún no está "Libre", pero ya se inició trámite (correo o PDF).
    // Rojo: No está "Libre" y no tiene trámite.
    if (esNoRegistro) {
        if (esLibre) return "neon-verde";
        if (tieneAccionEnProceso) return "neon-amarillo";
        return "neon-rojo";
    }

    // ── 4. BLOQUEO / BLOQUEO DEFINITIVO ──
    // El objetivo es bloquear el IMEI (ej. hurto/extravío reportado por el cliente).
    // Verde: El IMEI está efectivamente bloqueado (!esLibre: Robo/Hurto, Extravío, No Registrado).
    // Rojo: El IMEI sigue "Libre" (no se ha bloqueado todavía).
    if (esBloqueo) {
        return !esLibre ? "neon-verde" : "neon-rojo";
    }

    // ── 5. FALLBACK GENÉRICO ──
    return esLibre ? "neon-verde" : "";
}

/* ============ RENDERIZAR TABLA ============ */
function renderizarTabla() {
    if (vistaActual === 'registros') {
        const searchTerm = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();

        let filtrados = datosFastReg.filter(reg => {
            if (!searchTerm) return true;

            const imei = String(reg.IMEI || reg.imei || '').toLowerCase();
            const modelo = String(reg.MODELO || reg.modelo || '').toLowerCase();
            const encargado = String(reg.ENCARGADO || reg.encargado || '').toLowerCase();
            const estado = String(reg.ESTADO || reg.estado || '').toLowerCase();
            const operador = String(reg.OPERADOR || reg.operador || '').toLowerCase();
            const cliente = String(reg.CLIENTE || reg.cliente || '').toLowerCase();
            const linea = String(reg.LÍNEA || reg.LINEA || reg.línea || reg.linea || '').toLowerCase();
            const ingreso = String(reg.INGRESO || reg.ingreso || '').toLowerCase();

            return imei.includes(searchTerm) ||
                modelo.includes(searchTerm) ||
                encargado.includes(searchTerm) ||
                estado.includes(searchTerm) ||
                operador.includes(searchTerm) ||
                cliente.includes(searchTerm) ||
                linea.includes(searchTerm) ||
                ingreso.includes(searchTerm);
        });

        renderizarTablaFastReg(filtrados);
        return;
    }
    const tbody = document.getElementById("tableBody");
    if (!tbody) return;

    // --- FLIP: First ---
    const rectsBefore = {};
    const rows = tbody.querySelectorAll("tr");
    rows.forEach(row => {
        const imeiCell = row.cells[1];
        if (imeiCell) {
            const imei = imeiCell.innerText.trim();
            if (imei) {
                rectsBefore[imei] = row.getBoundingClientRect();
            }
        }
    });

    tbody.innerHTML = "";
    const searchTerm = (document.getElementById('globalSearch')?.value || '').toLowerCase();
    const sortBy = document.getElementById('ordenarRegistros')?.value || 'recientes';

    console.log(`📊 [JS] Renderizando: ${registros.length} registros totales.`);

    let filtrados = registros.filter(reg => {
        const matchText = !searchTerm ||
            (reg.imei && reg.imei.toLowerCase().includes(searchTerm)) ||
            (reg.modelo && reg.modelo.toLowerCase().includes(searchTerm)) ||
            (reg.encargado && reg.encargado.toLowerCase().includes(searchTerm)) ||
            (reg.estado && reg.estado.toLowerCase().includes(searchTerm)) ||
            (reg.operador && reg.operador.toLowerCase().includes(searchTerm)) ||
            (reg.cliente && reg.cliente.toLowerCase().includes(searchTerm)) ||
            (reg.razon && reg.razon.toLowerCase().includes(searchTerm));
        return matchText;
    });

    console.log(`🔍 [JS] Después de filtrar: ${filtrados.length} registros visibles.`);
    if (filtrados.length === 0 && registros.length > 0) {
        console.warn("⚠️ [JS] ¡Atención! Los datos existen pero el filtro los está ocultando todos.");
    }

    filtrados.sort((a, b) => {
        const aIdx = registros.indexOf(a), bIdx = registros.indexOf(b);
        if (sortBy === 'recientes') return bIdx - aIdx;
        if (sortBy === 'antiguos') return aIdx - bIdx;
        if (sortBy === 'automatico') {
            const neonA = evaluarNeon(a);
            const neonB = evaluarNeon(b);

            // 1. Jerarquía de color: 1 = Amarillos, 2 = Rojos, 3 = Resto (Verdes/Otros)
            const getPrio = (neon) => {
                if (neon === 'neon-amarillo') return 1;
                if (neon === 'neon-rojo') return 2;
                return 3;
            };

            const prioA = getPrio(neonA);
            const prioB = getPrio(neonB);

            // Si tienen diferente nivel de prioridad de color (amarillo > rojo > verde/resto)
            if (prioA !== prioB) {
                return prioA - prioB;
            }

            // 2. Si están en la misma categoría de color, ordenar por fecha de ingreso (más reciente primero)
            const rawA = a.ingreso || a.Ingreso || a.INGRESO;
            const rawB = b.ingreso || b.Ingreso || b.INGRESO;
            const fechaA = rawA ? new Date(rawA).getTime() : null;
            const fechaB = rawB ? new Date(rawB).getTime() : null;

            if (fechaA && fechaB && fechaA !== fechaB) {
                return fechaB - fechaA;
            }
            if (fechaA && !fechaB) return -1;
            if (!fechaA && fechaB) return 1;

            return bIdx - aIdx;
        }
        if (sortBy === 'pendientes') {
            let aP = (!a.estado || a.estado.includes('Consultando') || (!a.reg_wom && !a.reg_etb)) ? 1 : 0;
            let bP = (!b.estado || b.estado.includes('Consultando') || (!b.reg_wom && !b.reg_etb)) ? 1 : 0;
            return aP !== bP ? bP - aP : bIdx - aIdx;
        }
        return bIdx - aIdx;
    });

    filtrados.forEach((reg, renderIndex) => {
        try {
            const tr = document.createElement("tr");
            const originalIndex = registros.indexOf(reg);

            if (isFirstRender) {
                tr.classList.add("tr-animate");
                tr.style.animationDelay = `${renderIndex * 0.04}s`;
            }

            const neonClass = evaluarNeon(reg);
            if (neonClass && neonClass.trim() !== "") {
                tr.classList.add(neonClass);
            }

            tr.onclick = () => window.abrirDetalles?.(originalIndex);

            // Color operador
            const tema = document.documentElement.getAttribute('data-theme') || 'dark';
            const highlightText = tema === 'light' ? '#000000' : '#ffffff';

            let opStr = (reg.operador || "").toLowerCase();
            let opColor = opStr.includes("wom") ? "#b026ff" :
                opStr.includes("etb") ? "#00b4cc" :
                    opStr.includes("claro") ? "#ef4444" :
                        opStr.includes("tigo") ? "#1d4ed8" :
                            opStr.includes("movistar") ? "#16a34a" : "";

            let operadorHTML;
            if (opColor) {
                if (tema === 'light') {
                    // Badge pill en modo claro
                    operadorHTML = `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:${opColor}18;color:${opColor};border:1px solid ${opColor}55;">${reg.operador}</span>`;
                } else {
                    // Neon glow en modo oscuro (sin cambios)
                    operadorHTML = `<span style="color:#fff;font-weight:700;text-shadow:0 0 5px ${opColor},0 0 10px ${opColor};">${reg.operador}</span>`;
                }
            } else {
                operadorHTML = `<span style="color:var(--color)">${reg.operador || ''}</span>`;
            }

            // Color encargado
            let encColor = "";
            if (reg.encargado) {
                let enc = todosLosEncargados.find(e => e.nombre === reg.encargado);
                if (enc && enc.color) encColor = enc.color;
            }
            let encName = reg.encargado ? reg.encargado.split(' ')[0] : '';

            let encargadoHTML;
            if (encColor) {
                if (tema === 'light') {
                    // Badge pill en modo claro con color del encargado
                    encargadoHTML = `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:${encColor}22;color:${encColor};border:1px solid ${encColor}66;">${encName}</span>`;
                } else {
                    // Neon glow en modo oscuro (sin cambios)
                    encargadoHTML = `<span style="color:#fff;font-weight:700;text-shadow:0 0 5px ${encColor},0 0 10px ${encColor};">${encName}</span>`;
                }
            } else {
                encargadoHTML = `<span style="color:var(--color)">${encName}</span>`;
            }

            // Estado HTML con glow animado e íconos dinámicos
            let estadoHTML = '';
            if (reg._tomandoCaptura) {
                estadoHTML = `<div class="badge-glow-captura">
                    <span>Tomando captura...</span>
                    <span class="inline-flex items-center gap-1">
                        <span class="rec-dot"></span>
                        <svg class="w-3.5 h-3.5 inline-block text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                    </span>
                </div>`;
            } else if (reg.estado === "Consultando..." || (reg.estado && reg.estado.toLowerCase().includes("consultando"))) {
                estadoHTML = `<div class="badge-glow-consultando">
                    <span>Consultando...</span>
                    <svg class="w-3.5 h-3.5 lupa-icon text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>`;
            } else if (reg.estado) {
                estadoHTML = `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:rgba(var(--hover-acc-rgb),0.10);color:var(--color-sec);border:1px solid rgba(var(--hover-acc-rgb),0.18);">${reg.estado}</span>`;
            }

            // Modelo HTML con glow morado cuando se consulta
            let modeloHTML = '';
            const modVal = (reg.modelo || '').trim();
            if (modVal === "Consultando..." || modVal.toLowerCase().includes("consultando")) {
                modeloHTML = `<div class="badge-glow-modelo">
                    <span>Consultando...</span>
                    <svg class="w-3.5 h-3.5 text-purple-300 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="animation-duration: 2s;">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>`;
            } else {
                modeloHTML = `<span style="color:var(--color);font-weight:600;font-size:13.5px;">${modVal}</span>`;
            }

            tr.innerHTML = `<td style="width:10px;padding:0 0 0 6px;" class="relative"><div class="neon-indicator"></div></td>
                        <td style="font-family:'SF Mono','Fira Code','Courier New',monospace;font-size:12.5px;letter-spacing:0.04em;color:var(--color-sec);font-weight:600;font-variant-numeric:tabular-nums;cursor:pointer;" class="select-all imei-copy-cell" onclick="event.stopPropagation(); navigator.clipboard.writeText('${reg.imei}').then(()=>showToast('IMEI copiado','copy'));" title="Copiar IMEI">${reg.imei}</td>
                        <td id="modelo-${originalIndex}">${modeloHTML}</td>
                        <td id="estado-${originalIndex}">${estadoHTML}</td>
                        <td id="operador-${originalIndex}">${operadorHTML}</td>
                        <td style="color:var(--color-sec);opacity:0.85;font-size:13px;">${reg.cliente || ''}</td>
                        <td style="font-size:10.5px;font-weight:750;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-sec);opacity:0.95;">${reg.razon || ''}</td>
                        <td>${encargadoHTML}</td>
                        <td style="color:var(--color-sec);font-size:12px;font-weight:650;opacity:0.95;">
                            <button onclick="event.stopPropagation(); toggleEstadoPago('${reg.imei}', '${reg.pago || 'No'}', this)" 
                                class="pago-toggle-btn ${(reg.pago === 'S\u00ed') ? 'pago-si' : 'pago-no'}"
                                title="${(reg.pago === 'S\u00ed') ? 'Marcado como Pagado' : 'Sin Pago'}">
                                ${(reg.pago === 'S\u00ed') ? '\u2713 S\u00ed' : '\u00d7 No'}
                            </button>
                        </td>
                        <td style="color:var(--color-sec);font-size:12px;font-weight:650;opacity:0.95;">
                        ${reg.ingreso ? calcularTiempoTranscurrido(reg.ingreso) : 'N/A'}
                        <div style="font-size: 9px; opacity: 0.6; font-weight: normal; margin-top: 2px;">
                            ${reg.ingreso ? new Date(reg.ingreso).toLocaleDateString() : ''}
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="flex justify-center gap-1.5">
                            <button class="btn-icon" onclick="event.stopPropagation(); forzarScraper('${reg.imei}', ${originalIndex})" title="Actualizar">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="event.stopPropagation(); tomarPantallazo('${reg.imei}')" title="Pantallazo">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="event.stopPropagation(); consultarModeloFila('${reg.imei}', ${originalIndex})" title="Consultar Modelo"
                                style="border-color:rgba(167,139,250,0.25); color:#a78bfa;">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="event.stopPropagation(); ejecutarEliminar('${reg.imei}')" title="Eliminar" style="border-color:rgba(255,40,40,0.18); color:#f87171;">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                            </button>
                        </div>
                    </td>`;
            tbody.appendChild(tr);

        } catch (err) {
            console.error("❌ [JS] Error renderizando fila:", err, reg);
        }
    });

    isFirstRender = false;

    // --- FLIP: Last, Invert & Play ---
    const newRows = tbody.querySelectorAll("tr");
    newRows.forEach(row => {
        const imeiCell = row.cells[1];
        if (!imeiCell) return;
        const imei = imeiCell.innerText.trim();
        const beforeRect = rectsBefore[imei];
        if (beforeRect) {
            const afterRect = row.getBoundingClientRect();
            const deltaY = beforeRect.top - afterRect.top;
            if (deltaY !== 0) {
                row.style.transform = `translateY(${ deltaY }px)`;
                row.style.transition = 'none';
                // Force layout reflow
                row.offsetHeight;
                // Transition smoothly
                row.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                row.style.transform = '';
                setTimeout(() => {
                    if (row.style.transform === '') {
                        row.style.transition = '';
                    }
                }, 800);
            }
        }
    });
}

/* ============ TIME AGO ============ */
function timeAgo(dateString) {
    if (!dateString || dateString === 'No' || dateString === 'Error' || dateString === 'Sí') return '';
    let normalized = dateString;
    
    // Check if it already has timezone information
    const hasTimezone = normalized.includes('Z') || normalized.includes('z') || /[+-]\d{2}/.test(normalized.slice(-8));
    
    // Normalizar ISO sin timezone: agregar offset Colombia (-05:00)
    if (typeof normalized === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(normalized) && !hasTimezone) {
        normalized = normalized + '-05:00';
    }
    
    const past = new Date(normalized);
    if (isNaN(past.getTime())) return '';
    
    const ahora = new Date();
    const difMs = ahora - past;
    const segundos = Math.floor(difMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
        return dias === 1 ? "hace 1 día" : `hace ${ dias } días`;
    } else if (horas > 0) {
        return horas === 1 ? "hace 1 hora" : `hace ${ horas } horas`;
    } else if (minutos > 0) {
        return minutos === 1 ? "hace 1 min" : `hace ${ minutos } min`;
    } else {
        return "hace un momento";
    }
}

/* ============ BOTONES WOM/ETB UI ============ */
function actualizarUIBotonesRegistro() {
    if (indiceDetallesActual === null) return;
    const reg = registros[indiceDetallesActual];
    renderizarPanelOperativo(reg);
}

function renderizarPanelOperativo(reg) {
    const container = document.getElementById('panelOperativoInner');
    if (!container) return;

    // Validación para el botón de liquidar (si es el caso)
    const isPagado = reg.pago === 'Sí' || reg.pago === 'Si';

    // 1. Paleta de colores extraída directamente de tu widget inteligente
    const COLORS = {
        registrarWom: { bg: 'rgba(176,38,255,0.07)', bd: 'rgba(176,38,255,0.22)', tx: '#c084fc' },
        registrarEtb: { bg: 'rgba(0,243,255,0.07)', bd: 'rgba(0,243,255,0.22)', tx: '#67e8f9' },
        bloquearWom: { bg: 'rgba(239,68,68,0.07)', bd: 'rgba(239,68,68,0.22)', tx: '#f87171' },
        bloquearEtb: { bg: 'rgba(239,68,68,0.07)', bd: 'rgba(239,68,68,0.22)', tx: '#f87171' },
        desbloquearWom: { bg: 'rgba(57,255,20,0.07)', bd: 'rgba(57,255,20,0.22)', tx: '#86efac' },
        desbloquearEtb: { bg: 'rgba(57,255,20,0.07)', bd: 'rgba(57,255,20,0.22)', tx: '#86efac' },
        declaracionWom: { bg: 'rgba(176,38,255,0.07)', bd: 'rgba(176,38,255,0.22)', tx: '#c084fc' },
        declaracionGen: { bg: 'rgba(0,243,255,0.05)', bd: 'rgba(0,243,255,0.12)', tx: 'rgba(103,232,249,0.4)' }
    };

    // 2. Función generadora de botones usando tus clases exactas (w-btn)
    const btn = (label, onclick, key, id = '') => {
        const c = COLORS[key];
        return `<button ${ id ? `id="${id}"` : '' } class="w-btn w-full flex items-center justify-center min-h-[42px] transition-all hover:scale-[1.02]"
            style = "background:${c.bg};border-color:${c.bd};color:${c.tx};"
            onclick="${onclick}">
                <span class="text-[10px] font-black uppercase tracking-wider text-center drop-shadow-md">${label}</span>
        </button> `;
    };

    // 3. Liquidar trabajo (Condicional: solo se muestra si NO está pagado)
    const liquidarBtn = isPagado ? '' :
        `<button onclick = "marcarComoPagado()" class="w-btn-liquidar mt-3 w-full flex-shrink-0" > Liquidar trabajo</button> `;

    // 4. Inyección directa: Grilla de 2 columnas con todas las 8 opciones siempre visibles
    container.innerHTML = `
                <div class="flex flex-col h-full w-full" >
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        ${btn('Registrar WOM', 'ejecutarRegistroWom()', 'registrarWom')}
                        ${btn('Registrar ETB', 'ejecutarRegistroEtb()', 'registrarEtb')}
                        ${btn('Bloquear WOM', "ejecutarBloqueoDummy('WOM')", 'bloquearWom')}
                        ${btn('Bloquear ETB', "ejecutarBloqueoDummy('ETB')", 'bloquearEtb')}
                        ${btn('Desbloq. WOM', 'solicitarDesbloqueoWom()', 'desbloquearWom')}
                        ${btn('Desbloq. ETB', `abrirModalDesbloqueoETB('${reg.imei}')`, 'desbloquearEtb')}
                        ${btn('Decl. WOM', "generarDeclaracion('wom')", 'declaracionWom', 'btnPanelDeclWom')}
                        ${btn('Decl. General', "generarDeclaracion('general')", 'declaracionGen')}
                    </div>
            ${ liquidarBtn }
        </div>
                `;

    // 5. Validar si la declaración WOM ya se generó para actualizar el texto
    const declWomBtn = document.getElementById('btnPanelDeclWom');
    if (declWomBtn && reg.ruta_declaracion_generada && reg.fecha_declaracion_generada) {
        declWomBtn.innerHTML = `<span class="text-[9px] font-black uppercase tracking-wider text-center drop-shadow-md" > Generado(${ reg.fecha_declaracion_generada })</span> `;
        declWomBtn.style.background = 'rgba(176,38,255,0.25)';
    }
}
window.renderizarPanelOperativo = renderizarPanelOperativo;

/* ============================================================
   WIDGET INTELIGENTE v4 — Expandible, Minimalista y Corrección No Registro
   ============================================================ */

async function actualizarWidgetInteligente(reg) {
    const container = document.getElementById('intelligentWidgetContainer');
    if (!container) return;

    const rzn = (reg.razon || '').toLowerCase();
    const est = (reg.estado || '').toLowerCase();
    const op = (reg.operador || '').toLowerCase();
    const isPagado = reg.pago === 'Sí' || reg.pago === 'Si';

    // 1. Detección de Flujo: ¿Requiere desbloqueo?
    const requiresUnlock = (rzn.includes('bloqueo') && !rzn.includes('definitivo')) || rzn.includes('no registro');
    const isLocked = !est.includes('libre'); // Si no es "libre", consideramos que está pendiente/bloqueado.

    /* ─── Colores por función ─── */
    const COLORS = {
        bloquearWom: { bg: 'rgba(239,68,68,0.07)', bd: 'rgba(239,68,68,0.22)', tx: '#f87171' },
        bloquearEtb: { bg: 'rgba(239,68,68,0.07)', bd: 'rgba(239,68,68,0.22)', tx: '#f87171' },
        registrarWom: { bg: 'rgba(176,38,255,0.07)', bd: 'rgba(176,38,255,0.22)', tx: '#c084fc' },
        registrarEtb: { bg: 'rgba(0,243,255,0.07)', bd: 'rgba(0,243,255,0.22)', tx: '#67e8f9' },
        correo: { bg: 'rgba(57,255,20,0.07)', bd: 'rgba(57,255,20,0.22)', tx: '#86efac' },
        declaracion: { bg: 'rgba(176,38,255,0.07)', bd: 'rgba(176,38,255,0.22)', tx: '#c084fc' },
        desbloquear: { bg: 'rgba(57,255,20,0.07)', bd: 'rgba(57,255,20,0.22)', tx: '#86efac' },
        asignarLinea: { bg: 'rgba(0,243,255,0.07)', bd: 'rgba(0,243,255,0.22)', tx: '#67e8f9' },
        anexos: { bg: 'rgba(255,255,255,0.04)', bd: 'rgba(255,255,255,0.10)', tx: 'var(--color-sec)' },
    };

    const btn = (label, onclick, key) => {
        const c = COLORS[key] || COLORS.anexos;
        return `<button onclick = "${onclick}" class="w-btn w-full h-full"
            style = "background:${c.bg};border-color:${c.bd};color:${c.tx};"
                > <span class="drop-shadow-md">${label}</span></button> `;
    };

    const liquidar = isPagado ? '' :
        `<button onclick = "marcarComoPagado()" class="w-btn-liquidar mt-1 flex-shrink-0" >
                Liquidar trabajo
         </button> `;

    const infoCard = rows => `<div class="w-info-card mt-1 flex-shrink-0" > ${ rows }</div> `;
    const infoRow = (lbl, val, cls = '', onclick = '') =>
        `<div class="w-info-row ${onclick ? 'w-copyable hover:bg-white/5 rounded px-2 py-1 -mx-2 transition cursor-pointer' : ''}" ${ onclick ? `onclick="${onclick}"` : '' }>
            <span class="w-lbl">${lbl}</span>
            <span class="w-val ${cls}">${val}</span>
         </div> `;

    let btn1 = '', btn2 = '', cardContent = '';

    // 2. Construcción del Flujo (Desbloqueo vs Registro)
    if (requiresUnlock) {
        // Si es ETB...
        if (op.includes('etb')) {
            if (isLocked) {
                btn1 = btn('Desbloqueo ETB', `abrirModalDesbloqueoETB('${reg.imei}')`, 'desbloquear');
                btn2 = btn('Imprimir anexos', `etbImprimirAnexos()`, 'anexos');
                cardContent = infoRow('Línea ETB', `<span id="lblLineaActualETB">${reg.linea || 'Toca para asignar'}</span>`, 'w-val-mono text-cyan-400', `abrirSelectorLineaWidget('ETB')`);
            } else {
                btn1 = btn('Bloquear ETB', "ejecutarBloqueoDummy('ETB')", 'bloquearEtb');
                btn2 = btn('Asignar línea', "abrirSelectorLineaWidget('ETB')", 'asignarLinea');
                cardContent = infoRow('Línea actual', `<span id="lblLineaActualETB">${reg.linea || 'Toca para asignar'}</span>`, 'w-val-mono text-cyan-400', `abrirSelectorLineaWidget('ETB')`);
            }
        }
        // Si es WOM (o si es "No Registro" lo forzamos por defecto a WOM)
        else {
            if (isLocked) {
                btn1 = btn('Correo desbloqueo', 'solicitarDesbloqueoWom()', 'correo');
                btn2 = btn('Declaración WOM', "generarDeclaracion('wom')", 'declaracion');

                const pin = (reg.pin_desbloqueo || '').trim();
                const pinContent = pin
                    ? infoRow('PIN Desbloqueo', pin, 'w-val-mono w-val-green', `navigator.clipboard.writeText('${pin}'); showToast('PIN copiado', 'copy')`)
                    : `<div class="w-pin-wrap mt-1 border-t border-white/5 pt-2">
                <div class="w-pin-row">
                    <input type="text" id="widgetPinInput" maxlength="8" placeholder="Ingresa PIN..." class="input-glass w-pin-input">
                    <button onclick="guardarPinDesdeWidget()" class="w-btn-pin">Guardar</button>
                </div>
            </div>`;

                cardContent = infoRow('Línea WOM', `<span id="lblLineaActualWOM">${reg.linea || 'Toca para asignar'}</span>`, 'w-val-mono text-purple-400', `abrirSelectorLineaWidget('WOM')`) + pinContent;
            } else {
                btn1 = btn('Bloquear WOM', "ejecutarBloqueoDummy('WOM')", 'bloquearWom');
                btn2 = btn('Registrar WOM', 'ejecutarRegistroWom()', 'registrarWom');
                cardContent = infoRow('Línea WOM', `<span id="lblLineaActualWOM">${reg.linea || 'Toca para asignar'}</span>`, 'w-val-mono text-purple-400', `abrirSelectorLineaWidget('WOM')`);
            }
        }
    } else {
        // FLUJO DE REGISTRO STANDARD
        btn1 = btn('Registrar ETB', 'ejecutarRegistroEtb()', 'registrarEtb');
        btn2 = btn('Registrar WOM', 'ejecutarRegistroWom()', 'registrarWom');
        const defaultOp = op.includes('etb') ? 'ETB' : 'WOM';
        const colorClass = op.includes('etb') ? 'text-cyan-400' : 'text-purple-400';
        cardContent = infoRow('Línea Asociada', `<span id="lblLineaActual">${reg.linea || 'Toca para asignar'}</span>`, `w-val-mono ${colorClass}`, `abrirSelectorLineaWidget('${defaultOp}')`);
    }

    // 3. Renderizado (ocupando el 100% del alto)
    const html = `
                <div class="flex flex-col h-full w-full gap-2" >
                    <div class="flex-1 grid grid-cols-2 gap-2 min-h-[55px]">
                        ${btn1}
                        ${btn2}
                    </div>
            ${ cardContent ? infoCard(cardContent) : '' }
            ${ liquidar }
        </div>
                `;

    const inner = container.querySelector('.widget-inner') || container;
    inner.innerHTML = html;
}

/* ─── SELECTOR DE LÍNEA PARA WIDGET (Conectado a Supabase) ─── */
async function abrirSelectorLineaWidget(operadorPorDefecto = 'WOM') {
    // Validar que haya un registro seleccionado
    if (indiceDetallesActual === null) {
        showToast('Abre el detalle de un trabajo primero', 'warning');
        return;
    }
    showToastLoading(`Buscando líneas ${ operadorPorDefecto }...`);
    const res = await window.pywebview.api.obtener_lineas();
    hideToastLoading();
    if (res.status === 'success' && res.lineas) {
        const lineasFiltradas = res.lineas.filter(l => {
            const est = (l.estado || l.tipo || '').toLowerCase();
            return l.operador.toUpperCase() === operadorPorDefecto.toUpperCase() &&
                (est === 'disponible' || est === 'suspendida');
        });
        const container = document.getElementById('lineBoxContainer');
        container.innerHTML = '';
        const colorHex = operadorPorDefecto.toUpperCase() === 'WOM' ? '#b026ff' : '#00f3ff';
        const tit = document.getElementById('lineModalOperador');
        if (tit) {
            tit.innerText = operadorPorDefecto.toUpperCase();
            tit.style.color = colorHex;
            tit.style.textShadow = `0 0 12px ${ colorHex }`;
        }
        if (lineasFiltradas.length === 0) {
            container.innerHTML = '<p class="text-xs opacity-50 mt-4 pb-4">No hay líneas Disponibles o Suspendidas.</p>';
        } else {
            lineasFiltradas.forEach(l => {
                const btn = document.createElement('button');
                btn.className = "p-4 rounded-xl border flex justify-between items-center transition-all duration-300 hover:-translate-y-1 group";
                btn.style.cssText = `border-color: ${ colorHex }40; background: var(--card-inner); width: 100 %; margin - bottom: 8px; `;
                btn.onmouseenter = () => { btn.style.background = `${ colorHex }18`; btn.style.borderColor = colorHex; btn.style.boxShadow = `0 4px 15px ${ colorHex }30`; };
                btn.onmouseleave = () => { btn.style.background = 'var(--card-inner)'; btn.style.borderColor = `${ colorHex }40`; btn.style.boxShadow = 'none'; };
                const estColor = (l.estado || '').toLowerCase() === 'disponible' ? '#00f3ff' : '#ef4444';
                btn.innerHTML = `
        <div class="flex flex-col items-start" >
                        <span class="font-mono text-lg tracking-widest font-bold" style="color:var(--color)">${l.numero}</span>
                        <span class="text-[9px] uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">${l.encargado || 'Línea Libre'}</span>
                    </div>
        <div class="px-2 py-1 rounded border text-[9px] font-bold uppercase tracking-wider flex-shrink-0" style="color:${estColor}; border-color:${estColor}50; background:${estColor}10;">
            ${l.estado}
        </div>
    `;
                // Capturar numero en closure en lugar de usar string en onclick
                const numeroLinea = l.numero;
                btn.addEventListener('click', () => {
                    document.getElementById('lineSelectorOverlay').classList.remove('active');
                    guardarLineaAsignada(numeroLinea);
                });
                container.appendChild(btn);
            });
        }
        document.getElementById('lineSelectorOverlay').classList.add('active');
    } else {
        showToast('Error al cargar líneas', 'error');
    }
}

/* ============ TOGGLE PANEL OPERATIVO ============ */
let _panelOperativoAbierto = false;

function togglePanelOperativo() {
    _panelOperativoAbierto = !_panelOperativoAbierto;
    const content = document.getElementById('panelOperativoContent');
    const icon = document.getElementById('iconTogglePanelOp');
    const txt = document.getElementById('txtTogglePanelOp');
    if (!content) return;
    if (_panelOperativoAbierto) {
        // Abrir: calcular altura real para animación suave
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        content.style.marginTop = '1.5rem';
        if (icon) icon.style.transform = 'rotate(180deg)';
        if (txt) txt.textContent = 'Ocultar opciones operativas';
    } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.marginTop = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
        if (txt) txt.textContent = 'Mostrar opciones operativas';
    }
}
window.togglePanelOperativo = togglePanelOperativo;



/* ─── GUARDADO Y SUSPENSIÓN AUTOMÁTICA EN LA BD ─── */
async function guardarLineaAsignada(numeroLinea) {
    if (!numeroLinea) return showToast('Línea inválida', 'warning');
    // Re-validar índice por si el contexto cambió
    if (indiceDetallesActual === null) {
        showToast('Error: no hay trabajo seleccionado', 'error');
        return;
    }
    const imei = registros[indiceDetallesActual].imei;
    showToastLoading('Asignando línea...');
    // 1. Actualiza el campo "linea" (tipo text) en registros
    const res = await window.pywebview.api.actualizar_campo(imei, 'linea', String(numeroLinea));
    if (res.status === 'success') {
        registros[indiceDetallesActual].linea = String(numeroLinea);
        // 2. Suspende la línea en la tabla lineas de Supabase
        const linesRes = await window.pywebview.api.obtener_lineas();
        if (linesRes.status === 'success' && linesRes.lineas) {
            const matchLine = linesRes.lineas.find(l => String(l.numero) === String(numeroLinea));
            if (matchLine) {
                matchLine.estado = 'suspendida';
                matchLine.tipo = 'Suspendida';
                matchLine.imei_vinculado = imei;
                matchLine.encargado = registros[indiceDetallesActual].encargado || matchLine.encargado || '';
                await window.pywebview.api.guardar_linea(matchLine);
            } else {
                const op = (registros[indiceDetallesActual].operador || 'ETB').toUpperCase();
                await window.pywebview.api.guardar_linea({
                    numero: String(numeroLinea),
                    operador: op.includes('WOM') ? 'WOM' : 'ETB',
                    estado: 'suspendida',
                    tipo: 'Suspendida',
                    imei_vinculado: imei,
                    encargado: registros[indiceDetallesActual].encargado || ''
                });
            }
        }
        hideToastLoading();
        showToast(`Línea ${ numeroLinea } asignada`, 'success');
        if (typeof actualizarWidgetInteligente === 'function') {
            actualizarWidgetInteligente(registros[indiceDetallesActual]);
        }
        renderizarTabla();
    } else {
        hideToastLoading();
        showToast('Error al asignar línea: ' + (res.mensaje || ''), 'error');
    }
}

function guardarNuevaLineaManualModal() {
    const input = document.getElementById('inputNuevaLineaModal');
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
        showToast('Escribe un número de línea válido', 'warning');
        return;
    }
    input.value = '';
    document.getElementById('lineSelectorOverlay').classList.remove('active');
    guardarLineaAsignada(val);
}

/**
 * Verifica si tras la consulta el estado cambió de "Libre" a "Robo/hurto" o "Extravío".
 * Si y sólo si ocurre este cambio:
 * - Operador ETB: Solicita línea con la que se bloqueó (disponibles + opción nueva).
 * - Operador WOM: Solicita PIN de desbloqueo.
 */
function procesarCambioEstadoBloqueo(reg, oldEstado, newEstado, newOperador, index) {
    if (!reg) return;

    const newEst = (newEstado || reg.estado || '').trim().toLowerCase();
    const esRoboExtravio = newEst.includes('robo') || newEst.includes('hurto') || newEst.includes('extravi') || newEst.includes('no registrado');
    if (!esRoboExtravio) return;

    const op = (newOperador || reg.operador || '').toLowerCase();
    const idx = (index !== undefined && index !== null && index > -1) ? index : registros.findIndex(r => r.imei === reg.imei);

    if (op.includes('etb')) {
        const tieneLinea = reg.linea && String(reg.linea).trim() !== '' && String(reg.linea).trim() !== 'null';
        if (!tieneLinea) {
            if (idx > -1) {
                indiceDetallesActual = idx;
                abrirDetalles(idx);
                setTimeout(() => {
                    abrirSelectorLineaWidget('ETB');
                }, 200);
            }
        }
    } else if (op.includes('wom')) {
        const tienePin = reg.pin_desbloqueo && String(reg.pin_desbloqueo).trim() !== '' && String(reg.pin_desbloqueo).trim() !== 'null';
        if (!tienePin) {
            if (idx > -1) {
                indiceDetallesActual = idx;
                abrirDetalles(idx);
            }
            imeiEsperandoPin = reg.imei;
            const copyEl = document.getElementById('pinImeiCopy');
            const encEl = document.getElementById('pinEncargadoNombre');
            const inpEl = document.getElementById('inputPinBloqueo') || document.getElementById('detPin');
            if (copyEl) copyEl.innerText = reg.imei;
            if (encEl) encEl.innerText = reg.encargado || "Sin Asignar";
            if (inpEl) inpEl.value = "";
            const pinOverlay = document.getElementById('pinOverlay');
            if (pinOverlay) pinOverlay.classList.add('active');
            setTimeout(() => { if (inpEl) inpEl.focus(); }, 200);
        }
    }
}

/**
 * Cambia un IMEI a "Libre" en memoria y BD para reiniciar su estado.
 */
async function probarCambioALibre(imei) {
    let idx = -1;
    if (imei) {
        idx = registros.findIndex(r => r.imei === imei);
    } else if (indiceDetallesActual !== null) {
        idx = indiceDetallesActual;
    } else if (registros.length > 0) {
        idx = 0;
    }

    if (idx === -1 || !registros[idx]) {
        showToast("No hay un registro disponible para cambiar a Libre", "warning");
        return;
    }

    const reg = registros[idx];
    const targetImei = reg.imei;

    reg.estado = "Libre";
    reg.pin_desbloqueo = "";

    showToast(`Cambiando ${ targetImei } a "Libre"...`, "success");

    try {
        await window.pywebview.api.actualizar_campo(targetImei, 'estado', 'Libre');
        await window.pywebview.api.actualizar_campo(targetImei, 'pin_desbloqueo', '');
    } catch (e) {
        console.error("Error actualizando a Libre en BD:", e);
    }

    renderizarTabla();
    if (indiceDetallesActual === idx) {
        abrirDetalles(idx);
    }
}

/**
 * Función para probar manualmente transiciones de estado de "Libre" a "Extravío" / "Robo/Hurto"
 * con cualquier operador (ej: 'WOM' para probar modal de PIN, 'ETB' para probar modal de línea).
 */
async function probarCambioEstado(imei, nuevoEstado = "Extravío", nuevoOperador = "WOM") {
    if ((nuevoEstado || '').trim().toLowerCase() === 'libre') {
        return probarCambioALibre(imei);
    }

    let idx = -1;
    if (imei) {
        idx = registros.findIndex(r => r.imei === imei);
    } else if (indiceDetallesActual !== null) {
        idx = indiceDetallesActual;
    } else if (registros.length > 0) {
        idx = 0;
    }

    if (idx === -1 || !registros[idx]) {
        showToast("No hay un registro disponible para probar el cambio de estado", "warning");
        return;
    }

    const reg = registros[idx];
    const targetImei = reg.imei;
    const oldEstado = "Libre"; // Simula cambio desde "Libre"

    reg.pin_desbloqueo = ""; // Resetea PIN para forzar modal en WOM
    reg.estado = nuevoEstado;
    reg.operador = nuevoOperador;

    showToast(`Prueba: Cambiando ${ targetImei } a "${nuevoEstado}"(${ nuevoOperador })...`, "info");

    try {
        await window.pywebview.api.actualizar_campo(targetImei, 'estado', nuevoEstado);
        await window.pywebview.api.actualizar_campo(targetImei, 'operador', nuevoOperador);
        await window.pywebview.api.actualizar_campo(targetImei, 'pin_desbloqueo', '');
    } catch (e) {
        console.error("Error actualizando en BD durante prueba de cambio de estado:", e);
    }

    renderizarTabla();
    abrirDetalles(idx);
    procesarCambioEstadoBloqueo(reg, oldEstado, nuevoEstado, nuevoOperador, idx);
}

// Expone las funciones globales
window.abrirSelectorLineaWidget = abrirSelectorLineaWidget;
window.guardarNuevaLineaManualModal = guardarNuevaLineaManualModal;
window.procesarCambioEstadoBloqueo = procesarCambioEstadoBloqueo;
window.probarCambioEstado = probarCambioEstado;
window.probarCambioALibre = probarCambioALibre;
window.guardarLineaAsignada = guardarLineaAsignada;

async function guardarPinDesdeWidget() {
    const input = document.getElementById('widgetPinInput');
    if (!input) return;
    const pin = input.value.trim();
    if (!pin) return showToast('Ingresa el PIN primero', 'warning');
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    const res = await window.pywebview.api.guardar_pin(imei, pin);
    if (res.status === 'success') {
        registros[indiceDetallesActual].pin_desbloqueo = pin;
        showToast('PIN guardado', 'success');
        actualizarWidgetInteligente(registros[indiceDetallesActual]);
    } else {
        showToast('Error al guardar PIN', 'error');
    }
}
window.guardarPinDesdeWidget = guardarPinDesdeWidget;




/* ============ DETALLES ============ */
let clientSelectionContext = 'registration'; // 'registration' or 'details'



/* ============ DETALLES ============ */
async function abrirDetalles(index) {
    // Reset panel operativo al abrir nuevo registro
    _panelOperativoAbierto = false;
    const _panelContent = document.getElementById('panelOperativoContent');
    const _panelIcon = document.getElementById('iconTogglePanelOp');
    const _panelTxt = document.getElementById('txtTogglePanelOp');
    if (_panelContent) { _panelContent.style.maxHeight = '0'; _panelContent.style.opacity = '0'; _panelContent.style.marginTop = '0'; }
    if (_panelIcon) _panelIcon.style.transform = 'rotate(0deg)';
    if (_panelTxt) _panelTxt.textContent = 'Mostrar opciones operativas';
    // -- código original sin cambios desde aquí --
    indiceDetallesActual = index;
    const reg = registros[index];
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';

    // Header & IMEI
    document.getElementById('detImeiTit').innerText = reg.imei;

    // COL 1: Información Base
    document.getElementById('detModelo').value = reg.modelo === "Error" ? "" : (reg.modelo || '');
    const contenedorError = document.getElementById('contenedorBotonesErrorModelo');
    if (reg.modelo === "Error" || reg.modelo === "Error Pro") {
        contenedorError.classList.remove('hidden');
        document.getElementById('detModelo').placeholder = "Ingresa el modelo manualmente";
    } else {
        contenedorError.classList.add('hidden');
        document.getElementById('detModelo').placeholder = "";
    }
    document.getElementById('detClienteDisplay').innerText = reg.cliente || 'Sin Asignar';
    document.getElementById('detRazon').value = reg.razon || '';

    // Razon dynamic button
    const rznBtnContainer = document.getElementById('detRazonButtonContainer');
    if (reg.razon && reg.razon.toLowerCase() === 'bloqueo') {
        rznBtnContainer.innerHTML = `
        <button onclick = "ejecutarCambioADesbloqueo(event)" class="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[10px] font-black uppercase rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all" >
            Desbloqueo
            </button>
        `;
    } else {
        rznBtnContainer.innerHTML = `
        <button onclick = "abrirSelectorRazon(event)" class="p-2 text-cyan-400 hover:text-cyan-300 transition-colors" >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
        `;
    }

    // Encargado display
    const encLink = document.getElementById('detEncargadoDisplay');
    encLink.innerText = reg.encargado || 'Sin Asignar';
    encLink.style.color = 'var(--color)';
    if (reg.encargado) {
        const encObj = todosLosEncargados.find(e => e.nombre === reg.encargado);
        if (encObj && encObj.color) encLink.style.color = encObj.color;
    }

    // COL 2: Tarjeta de Operadores Unificada (Semáforo)
    const cardStatus = document.getElementById('cardOperadoresStatus');
    const impBadge = document.getElementById('detImpStatusBadge');
    const legalTxt = document.getElementById('detLegalEstadoText');
    const opNeon = document.getElementById('detOperadorNeonText');

    // Reset card classes
    cardStatus.classList.remove('completado', 'pendiente', 'en-proceso', 'card-beam-captura', 'card-beam-consultando');

    // Determine state
    let impStatus = "Pendiente";
    let impColorClass = "pendiente";

    if (reg._tomandoCaptura) {
        impStatus = "Capturando";
        impColorClass = "en-proceso";
        cardStatus.classList.add('card-beam-captura');
        legalTxt.innerHTML = `
            <div class="badge-glow-captura mt-1">
                <span>Tomando captura...</span>
                <span class="inline-flex items-center gap-1">
                    <span class="rec-dot"></span>
                    <svg class="w-3.5 h-3.5 inline-block text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </span>
            </div>
        `;
    } else if (reg.estado === "Consultando..." || reg.reg_wom === "Consultando..." || reg.reg_etb === "Consultando..." || (reg.estado && reg.estado.toLowerCase().includes("consultando"))) {
        impStatus = "En proceso";
        impColorClass = "en-proceso";
        cardStatus.classList.add('card-beam-consultando');
        legalTxt.innerHTML = `
            <div class="badge-glow-consultando mt-1">
                <span>Consultando...</span>
                <svg class="w-3.5 h-3.5 lupa-icon text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
        `;
    } else if (evaluarNeon(reg) === "neon-verde") {
        impStatus = "Completado";
        impColorClass = "completado";
        legalTxt.innerText = reg.estado || 'Sin Consultar';
    } else if (evaluarNeon(reg) === "neon-amarillo") {
        impStatus = "En Proceso";
        impColorClass = "en-proceso";
        legalTxt.innerText = reg.estado || 'Sin Consultar';
    } else {
        impStatus = "Pendiente";
        impColorClass = "pendiente";
        legalTxt.innerText = reg.estado || 'Sin Consultar';
    }

    // Apply styles to merged card
    cardStatus.classList.add(impColorClass);
    impBadge.innerText = impStatus;

    // Operator neon glow
    let opStr = (reg.operador || "").toLowerCase();
    let opColor = opStr.includes("wom") ? "#b026ff" :
        opStr.includes("etb") ? "#00b4cc" :
            opStr.includes("claro") ? "#ef4444" :
                opStr.includes("tigo") ? "#1d4ed8" :
                    opStr.includes("movistar") ? "#16a34a" : "";

    opNeon.innerText = reg.operador || '...';
    if (opColor && tema !== 'light') {
        opNeon.style.color = "#fff";
        opNeon.style.textShadow = `0 0 5px ${ opColor }, 0 0 10px ${ opColor } `;
    } else if (opColor && tema === 'light') {
        opNeon.style.color = opColor;
        opNeon.style.textShadow = "none";
    } else {
        opNeon.style.color = "var(--color-sec)";
        opNeon.style.textShadow = "none";
    }

    // ── Badge Blacklist ──────────────────────────────────────────────
    let blacklistBadge = document.getElementById('detBlacklistBadge');
    if (!blacklistBadge) {
        blacklistBadge = document.createElement('span');
        blacklistBadge.id = 'detBlacklistBadge';
        blacklistBadge.style.cssText = [
            'display:inline-block', 'margin-top:5px', 'padding:2px 8px',
            'border-radius:5px', 'font-size:9px', 'font-weight:900',
            'letter-spacing:0.08em', 'text-transform:uppercase'
        ].join(';');
        // Insertar debajo del texto del operador
        if (opNeon && opNeon.parentNode) {
            opNeon.parentNode.insertBefore(blacklistBadge, opNeon.nextSibling);
        }
    }
    const blVal = (reg.blacklist || '').toLowerCase();
    if (blVal === 'blacklist') {
        blacklistBadge.textContent = 'Blacklist';
        blacklistBadge.style.background = 'rgba(239,68,68,0.18)';
        blacklistBadge.style.color = '#f87171';
        blacklistBadge.style.border = '1px solid rgba(239,68,68,0.35)';
        blacklistBadge.style.display = 'inline-block';
    } else if (blVal === 'clean') {
        blacklistBadge.textContent = 'Clean';
        blacklistBadge.style.background = 'rgba(74,222,128,0.15)';
        blacklistBadge.style.color = '#4ade80';
        blacklistBadge.style.border = '1px solid rgba(74,222,128,0.30)';
        blacklistBadge.style.display = 'inline-block';
    } else {
        // NULL / no consultado — no mostrar nada
        blacklistBadge.style.display = 'none';
        blacklistBadge.textContent = '';
    }

    // Update PIN
    const pinInput = document.getElementById('detPin');
    if (pinInput) {
        pinInput.value = reg.pin_desbloqueo || '';
    }

    // Validación de seguridad para el botón de pago legado
    const btnPagado = document.getElementById('btnPagado');
    if (btnPagado) {
        btnPagado.style.display = reg.pago === 'Sí' ? 'none' : 'flex';
    }

    // RENDER INTELLIGENT WIDGET
    actualizarWidgetInteligente(reg);

    actualizarUIBotonesRegistro();

    renderizarPanelOperativo(reg);

    // Botón Generar Declaración WOM
    const btnDeclWomTxt = document.getElementById('btnGenDeclWomText');
    const btnDeclWom = document.getElementById('btnGenDeclWom');
    if (btnDeclWomTxt && btnDeclWom) {
        if (reg.ruta_declaracion_generada && reg.fecha_declaracion_generada) {
            btnDeclWomTxt.innerHTML = `Generado(${ reg.fecha_declaracion_generada })`;
            btnDeclWom.style.background = 'rgba(176,38,255,0.25)';
            btnDeclWom.style.borderColor = 'rgba(176,38,255,0.8)';
        } else {
            btnDeclWomTxt.innerText = 'Generar Declaración WOM';
            btnDeclWom.style.background = 'rgba(176,38,255,0.10)';
            btnDeclWom.style.borderColor = 'rgba(176,38,255,0.50)';
        }
    }

    document.querySelectorAll('.card-anim').forEach(el => {
        el.style.animation = 'none'; el.offsetHeight; el.style.animation = null;
    });
    document.getElementById('detallesOverlay').classList.add('active');
}
window.abrirDetalles = abrirDetalles;

/* ============ COPÍADO IMEI ============ */
function copiarIMEI() {
    const imei = document.getElementById('detImeiTit').innerText;
    navigator.clipboard.writeText(imei).then(() => {
        showToast("IMEI Copiado al portapapeles", "copy");
    });
}

/* ============ MENÚ CONTEXTUAL ENCARGADO ============ */
let _menuEncargadoAbierto = false;

function abrirMenuEncargado(e) {
    e.stopPropagation();
    e.preventDefault();
    // Evitar doble apertura por bubbling
    if (_menuEncargadoAbierto) return;
    _menuEncargadoAbierto = true;
    const menu = document.getElementById('encargadoContextMenu');
    // Posicionar cerca del cursor pero dentro del viewport
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    menu.style.left = `${ x } px`;
    menu.style.top = `${ y } px`;
    menu.classList.add('show');
    const closeMenu = (ev) => {
        if (!menu.contains(ev.target)) {
            menu.classList.remove('show');
            document.removeEventListener('click', closeMenu);
            _menuEncargadoAbierto = false;
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 200);
}

async function consultarEncargadoDesdeMenu() {
    const nombre = document.getElementById('detEncargadoDisplay').innerText;
    if (nombre === 'Sin Asignar') return showToast("No hay encargado asignado", "warning");
    cerrarDetalles();
    abrirPersonal();
    setTimeout(() => editarFormPersonal(nombre), 300);
}

function cambiarEncargadoDesdeMenu() {
    _menuEncargadoAbierto = false;
    document.getElementById('encargadoContextMenu').classList.remove('show');
    const grid = document.getElementById('encargadoSelectorGrid');
    if (!grid) return;
    grid.innerHTML = '';
    todosLosEncargados.forEach(enc => {
        const color = enc.color || 'var(--hover-acc)';
        const card = document.createElement('div');
        card.className = 'cursor-pointer p-4 rounded-2xl border transition-all hover:scale-[1.02]';
        card.style.cssText = `
    background: var(--card-inner);
    border-color: ${ color }44;
    border-left: 4px solid ${ color };
    box-shadow: 0 2px 10px ${ color }22;
    `;
        card.onmouseenter = () => { card.style.borderColor = color; card.style.boxShadow = `0 4px 18px ${ color }44`; };
        card.onmouseleave = () => { card.style.borderColor = `${ color }44`; card.style.boxShadow = `0 2px 10px ${ color }22`; };
        card.onclick = () => seleccionarEncargadoDelModal(enc.nombre);
        card.innerHTML = `
        <div class="flex items-center gap-3" >
                <div class="w-3 h-3 rounded-full flex-shrink-0" style="background:${color}; box-shadow:0 0 6px ${color};"></div>
                <span class="font-bold text-sm truncate" style="color:var(--color)">${enc.nombre}</span>
            </div>
        <p class="text-[10px] mt-1.5 opacity-50 truncate ml-6">${enc.correo || 'Sin correo'}</p>
    `;
        grid.appendChild(card);
    });
    document.getElementById('encargadoSelectorOverlay').classList.add('active');
}
window.cambiarEncargadoDesdeMenu = cambiarEncargadoDesdeMenu;
// Función directa sin pasar por el menú contextual
function abrirSelectorEncargadoDirecto(e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    // Cerrar el menú si estuviera abierto
    document.getElementById('encargadoContextMenu').classList.remove('show');
    _menuEncargadoAbierto = false;
    // Poblar y abrir el modal
    const grid = document.getElementById('encargadoSelectorGrid');
    if (!grid) return;
    grid.innerHTML = '';
    todosLosEncargados.forEach(enc => {
        const color = enc.color || 'var(--hover-acc)';
        const card = document.createElement('div');
        card.className = 'cursor-pointer p-4 rounded-2xl border transition-all hover:scale-[1.02]';
        card.style.cssText = `
    background: var(--card-inner);
    border-color: ${ color }44;
    border-left: 4px solid ${ color };
    box-shadow: 0 2px 10px ${ color }22;
    `;
        card.onmouseenter = () => { card.style.borderColor = color; card.style.boxShadow = `0 4px 18px ${ color }44`; };
        card.onmouseleave = () => { card.style.borderColor = `${ color }44`; card.style.boxShadow = `0 2px 10px ${ color }22`; };
        card.onclick = () => seleccionarEncargadoDelModal(enc.nombre);
        card.innerHTML = `
        <div class="flex items-center gap-3" >
                <div class="w-3 h-3 rounded-full flex-shrink-0" style="background:${color}; box-shadow:0 0 6px ${color};"></div>
                <span class="font-bold text-sm truncate" style="color:var(--color)">${enc.nombre}</span>
            </div>
        <p class="text-[10px] mt-1.5 opacity-50 truncate ml-6">${enc.correo || 'Sin correo'}</p>
    `;
        grid.appendChild(card);
    });
    document.getElementById('encargadoSelectorOverlay').classList.add('active');
}
window.abrirSelectorEncargadoDirecto = abrirSelectorEncargadoDirecto;

async function seleccionarEncargadoDelModal(nombre) {
    cerrarSelectorEncargado();
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    await window.pywebview.api.actualizar_campo(imei, 'encargado', nombre);
    registros[indiceDetallesActual].encargado = nombre;
    // Actualizar display con color
    const display = document.getElementById('detEncargadoDisplay');
    if (display) {
        display.innerText = nombre || 'Sin Asignar';
        display.style.color = 'var(--color)';
        if (nombre) {
            const encObj = todosLosEncargados.find(e => e.nombre === nombre);
            if (encObj && encObj.color) display.style.color = encObj.color;
        }
    }
    showToast(nombre ? `Encargado: ${ nombre } ` : 'Asignación eliminada', nombre ? 'success' : 'trash');
    renderizarTabla();
}
window.seleccionarEncargadoDelModal = seleccionarEncargadoDelModal;

function cerrarSelectorEncargado() {
    const overlay = document.getElementById('encargadoSelectorOverlay');
    if (overlay) overlay.classList.remove('active');
}
window.cerrarSelectorEncargado = cerrarSelectorEncargado;


async function eliminarEncargadoDesdeMenu() {
    const imei = registros[indiceDetallesActual].imei;
    await window.pywebview.api.actualizar_campo(imei, 'encargado', '');
    registros[indiceDetallesActual].encargado = '';
    document.getElementById('detEncargadoDisplay').innerText = 'Sin Asignar';
    document.getElementById('detEncargadoDisplay').style.color = 'var(--color)';
    showToast("Asignación eliminada", "trash");
    renderizarTabla();
}

function cerrarDetalles() {
    document.getElementById('detallesOverlay').classList.remove('active');
    document.getElementById('encargadoContextMenu').classList.remove('show');
    indiceDetallesActual = null;
}

async function guardarDetalle(campo) {
    let val;
    if (campo === 'encargado') val = document.getElementById('detEncargadoInput').value;
    else if (campo === 'cliente') val = document.getElementById('detClienteInput').value;
    else val = document.getElementById('det' + campo.charAt(0).toUpperCase() + campo.slice(1)).value;

    await editar(indiceDetallesActual, campo, val);

    if (campo === 'encargado') {
        document.getElementById('detEncargadoDisplay').innerText = val || 'Sin Asignar';
        document.getElementById('detEncargadoInput').classList.add('hidden');
    } else if (campo === 'cliente') {
        document.getElementById('detClienteDisplay').innerText = val || 'Sin Asignar';
        document.getElementById('detClienteInput').classList.add('hidden');
    }
}

async function marcarComoPagado() {
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    try {
        await window.pywebview.api.actualizar_campo(imei, 'pago', 'Sí');
        registros[indiceDetallesActual].pago = 'Sí';
        const btnLiquidar = document.querySelector('.w-btn-liquidar');
        if (btnLiquidar) btnLiquidar.style.display = 'none';
        showToast("Trabajo Liquidado con Éxito", "success");
        renderizarTabla();
    } catch (e) {
        console.error(e);
        showToast("Error al liquidar", "error");
    }
}

async function guardarPinDesdeDetalles() {
    const pin = document.getElementById('detPin').value.trim();
    const imei = registros[indiceDetallesActual].imei;
    const res = await window.pywebview.api.guardar_pin(imei, pin);
    if (res.status === "success") { registros[indiceDetallesActual].pin_desbloqueo = pin; showToast("PIN Actualizado", ""); }
}

/* ============ PERSONAL ============ */
async function abrirPersonal() {
    document.getElementById('personalOverlay').classList.add('active');
    await cargarGridPersonal();
}

function cerrarPersonal() {
    document.getElementById('personalOverlay').classList.remove('active');
    volverPersonalLista();
}

async function cargarGridPersonal() {
    todosLosEncargados = await window.pywebview.api.obtener_todos_encargados();
    const grid = document.getElementById('personalGrid');
    grid.innerHTML = "";
    todosLosEncargados.forEach(enc => {
        const color = enc.color || "#39FF14";
        const nombre = enc.nombre || 'Sin nombre';
        // Generar iniciales del encargado
        const partes = nombre.trim().split(/\s+/);
        const iniciales = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : nombre.substring(0, 2).toUpperCase();

        // Conteo de líneas WOM y ETB
        const lineasWom = enc.lineas_wom ? enc.lineas_wom.split(',').filter(l => l.trim()).length : 0;
        const lineasEtb = enc.lineas_etb ? enc.lineas_etb.split(',').filter(l => l.trim()).length : 0;

        const div = document.createElement('div');
        div.className = "card-personal";
        div.style.setProperty('--card-glow-color', `${ color }2c`);
        div.style.setProperty('--card-glow-shadow', `0 12px 30px ${ color }20`);
        div.style.borderColor = `${ color }44`;
        div.onclick = () => editarFormPersonal(enc.nombre);
        div.innerHTML = `
        <div class="card-personal-inner" >
                <div class="card-personal-avatar" style="background:${color}; box-shadow: 0 0 18px ${color}44;">
                    <span class="card-personal-initials">${iniciales}</span>
                </div>
                <div class="card-personal-info">
                    <h3 class="card-personal-name">${nombre}</h3>
                    <p class="card-personal-email">
                        <svg class="w-3.5 h-3.5 opacity-60 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:inline; vertical-align:middle; margin-right:4px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>${enc.correo || 'Sin correo'}
                    </p>
                    <div class="card-personal-badges">
                        ${lineasWom > 0 ? `<span class="badge-operador badge-wom">WOM · ${lineasWom}</span>` : ''}
                        ${lineasEtb > 0 ? `<span class="badge-operador badge-etb">ETB · ${lineasEtb}</span>` : ''}
                        ${lineasWom === 0 && lineasEtb === 0 ? `<span class="badge-operador badge-none">Sin líneas</span>` : ''}
                    </div>
                </div>
            </div> `;
        grid.appendChild(div);
    });
}

function mostrarFormPersonal() {
    document.getElementById('personalVistaLista').classList.add('hidden');
    document.getElementById('personalVistaForm').classList.remove('hidden');
    document.getElementById('personalFormTitulo').innerText = "Añadir Encargado";
    document.getElementById('encFormNombre').readOnly = false;
    document.getElementById('btnBorrarEncargado').classList.add('hidden');
    ['encFormNombre', 'encFormId', 'encFormFecha', 'encFormLugar', 'encFormDir', 'encFormWom', 'encFormEtb', 'encFormCorreo', 'encFormMensaje', 'encFormAppPassword']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('encFormColor').value = "#39FF14";
    const declEl = document.getElementById('encFormDeclaracionNombre');
    declEl.textContent = 'Sin archivo';
    declEl.dataset.ruta = '';
    const ccEl = document.getElementById('encFormCCNombres');
    if (ccEl) {
        ccEl.textContent = 'Sin archivo';
        ccEl.dataset.ruta = '';
    }
    if (window.updatePersonalFormPreview) {
        window.updatePersonalFormPreview();
    }
}
function volverPersonalLista() {
    document.getElementById('personalVistaLista').classList.remove('hidden');
    document.getElementById('personalVistaForm').classList.add('hidden');
}

async function editarFormPersonal(nombre) {
    const enc = todosLosEncargados.find(e => e.nombre === nombre);
    if (!enc) return;
    mostrarFormPersonal();
    document.getElementById('personalFormTitulo').innerText = "Editar Encargado";
    document.getElementById('encFormNombre').readOnly = true;
    document.getElementById('btnBorrarEncargado').classList.remove('hidden');
    document.getElementById('encFormNombre').value = enc.nombre;
    document.getElementById('encFormId').value = enc.identificacion;
    document.getElementById('encFormFecha').value = enc.fecha_expedicion;
    document.getElementById('encFormLugar').value = enc.lugar_expedicion;
    document.getElementById('encFormDir').value = enc.direccion;
    document.getElementById('encFormWom').value = enc.lineas_wom;
    document.getElementById('encFormEtb').value = enc.lineas_etb;
    document.getElementById('encFormCorreo').value = enc.correo;
    document.getElementById('encFormAppPassword').value = enc.app_password || '';
    document.getElementById('encFormMensaje').value = enc.mensaje;
    document.getElementById('encFormColor').value = enc.color || "#39FF14";
    const declPath = enc.declaracion_wom || '';
    const declEl = document.getElementById('encFormDeclaracionNombre');
    if (declPath) {
        const partes = declPath.split('/').pop().split('\\').pop();
        declEl.textContent = partes;
        declEl.dataset.ruta = declPath;
    } else {
        declEl.textContent = 'Sin archivo';
        declEl.dataset.ruta = '';
    }
    const ccPath = enc.foto_cc || '';
    const ccEl = document.getElementById('encFormCCNombres');
    if (ccEl) {
        if (ccPath) {
            const partesCC = ccPath.split('/').pop().split('\\').pop();
            ccEl.textContent = partesCC;
            ccEl.dataset.ruta = ccPath;
        } else {
            ccEl.textContent = 'Sin archivo';
            ccEl.dataset.ruta = '';
        }
    }
    if (window.updatePersonalFormPreview) {
        window.updatePersonalFormPreview();
    }
}

async function guardarFormPersonal() {
    const nombre = document.getElementById('encFormNombre').value.trim();
    if (!nombre) return alert("El nombre es obligatorio.");
    const datos = {
        nombre, identificacion: document.getElementById('encFormId').value,
        fecha_expedicion: document.getElementById('encFormFecha').value,
        lugar_expedicion: document.getElementById('encFormLugar').value,
        direccion: document.getElementById('encFormDir').value,
        lineas_wom: document.getElementById('encFormWom').value,
        lineas_etb: document.getElementById('encFormEtb').value,
        correo: document.getElementById('encFormCorreo').value,
        app_password: document.getElementById('encFormAppPassword').value,
        mensaje: document.getElementById('encFormMensaje').value,
        color: document.getElementById('encFormColor').value,
        declaracion_wom: document.getElementById('encFormDeclaracionNombre').dataset.ruta || '',
        foto_cc: document.getElementById('encFormCCNombres') ? document.getElementById('encFormCCNombres').dataset.ruta || '' : ''
    };
    const res = await window.pywebview.api.guardar_encargado(datos);
    if (res.status === "success") {
        showToast("Personal Guardado", "");
        await cargarGridPersonal();
        volverPersonalLista();
        renderizarTabla();
    } else { alert("Error: " + res.mensaje); }
}

async function borrarEncargado() {
    const nombre = document.getElementById('encFormNombre').value;
    if (confirm(`¿Estás seguro de eliminar a ${ nombre } permanentemente del personal ? `)) {
        const res = await window.pywebview.api.eliminar_encargado(nombre);
        if (res.status === "success") { showToast("Encargado Eliminado", ""); await cargarGridPersonal(); volverPersonalLista(); }
    }
}

/* ============ SCRAPER / IMEI ============ */
async function forzarScraper(imei, index) {
    const idx = registros.findIndex(r => r.imei === imei);
    const targetIdx = idx > -1 ? idx : index;
    if (targetIdx === -1 || !registros[targetIdx]) return;

    const oldEstado = registros[targetIdx].estado;
    registros[targetIdx].estado = "Consultando...";
    renderizarTabla();
    if (indiceDetallesActual === targetIdx) {
        abrirDetalles(targetIdx);
    }
    showToastLoading("Consultando imei con Imei Colombia...");

    try {
        const res = await window.pywebview.api.actualizar_imei(imei, headlessEnabled);
        hideToastLoading();
        if (res.status === "success") {
            const nuevoEstado = (res.estado || '').toLowerCase();
            const eraAmarillo = (() => {
                const r = registros[targetIdx];
                return !!(
                    (r.fecha_correo_wom && String(r.fecha_correo_wom).trim() !== '' && String(r.fecha_correo_wom).trim() !== 'null') ||
                    (r.fecha_declaracion_generada && String(r.fecha_declaracion_generada).trim() !== '' && String(r.fecha_declaracion_generada).trim() !== 'null') ||
                    r.correo_enviado === true || r.correo_enviado === 'true' || r.correo_enviado === 1 ||
                    r.archivo_creado === true || r.archivo_creado === 'true' || r.archivo_creado === 1 ||
                    r.pdf_generado === true || r.pdf_generado === 'true' || r.pdf_generado === 1
                );
            })();

            registros[targetIdx].estado = res.estado;
            registros[targetIdx].operador = res.operador;

            // Si el registro estaba en amarillo (en proceso) y ahora es Libre → limpiar flags
            if (eraAmarillo && (nuevoEstado.includes('libre') || nuevoEstado.includes('desbloquead'))) {
                registros[targetIdx].fecha_correo_wom = null;
                registros[targetIdx].fecha_declaracion_generada = null;
                registros[targetIdx].ruta_declaracion_generada = null;
                registros[targetIdx].correo_enviado = false;
                registros[targetIdx].archivo_creado = false;
                registros[targetIdx].pdf_generado = false;
            }

            renderizarTabla();
            if (indiceDetallesActual === targetIdx) {
                abrirDetalles(targetIdx);
                if (typeof actualizarWidgetInteligente === 'function') {
                    actualizarWidgetInteligente(registros[targetIdx]);
                }
            }
            procesarCambioEstadoBloqueo(registros[targetIdx], oldEstado, res.estado, res.operador, targetIdx);
        } else {
            registros[targetIdx].estado = oldEstado || "Error";
            renderizarTabla();
            if (indiceDetallesActual === targetIdx) {
                abrirDetalles(targetIdx);
            }
            showToast("Error al consultar IMEI: " + (res.mensaje || ""), "error");
        }
    } catch (e) {
        hideToastLoading();
        registros[targetIdx].estado = oldEstado || "Error";
        renderizarTabla();
        if (indiceDetallesActual === targetIdx) {
            abrirDetalles(targetIdx);
        }
        showToast("Error en la consulta", "error");
    }
}

async function guardarPinDetectado() {
    const inp = document.getElementById('inputPinBloqueo') || document.getElementById('detPin');
    if (!inp) return;
    const pin = inp.value.trim();
    if (!pin) return showToast("Ingresa el PIN", "warning");
    const res = await window.pywebview.api.guardar_pin(imeiEsperandoPin, pin);
    if (res.status === "success") {
        const idx = registros.findIndex(r => r.imei === imeiEsperandoPin);
        if (idx > -1) registros[idx].pin_desbloqueo = pin;
        document.getElementById('pinOverlay').classList.remove('active');
        showToast("PIN Guardado", "success");
        if (indiceDetallesActual !== null && registros[indiceDetallesActual]) {
            actualizarWidgetInteligente(registros[indiceDetallesActual]);
        }
    }
}

async function editar(index, campo, valor) {
    const v = valor.trim();
    if (registros[index][campo] === v) return;
    registros[index][campo] = v;
    await window.pywebview.api.actualizar_campo(registros[index].imei, campo, v);
    renderizarTabla();
}

/* ============ CRUD REGISTROS ============ */
/* ============ NUEVO REGISTRO (LOGICA) ============ */
/* ============ NUEVO REGISTRO (LOGICA) ============ */
let regState = { razon: '', encargado: '', cliente: '', cliente_info: null };

function abrirModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');

    // Resetear vistas
    document.getElementById('registrationModal').classList.remove('hidden');
    document.getElementById('clientModal').classList.add('hidden');

    // Limpiar campos
    document.getElementById('regImei').value = '';
    document.getElementById('regModeloResult').classList.add('hidden');
    document.getElementById('regClienteNombre').value = '';
    document.getElementById('clienteSuggestions').classList.add('hidden');

    // Poblar Encargados
    const grid = document.getElementById('gridEncargadosRegistro');
    if (grid) {
        grid.innerHTML = '';
        todosLosEncargados.forEach(enc => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.style.borderLeft = `4px solid ${ enc.color || 'var(--hover-acc)' } `;
            card.onclick = () => selectOption('encargado', enc.nombre, card);
            card.innerHTML = `<span > ${ enc.nombre }</span> `;
            grid.appendChild(card);
        });

        const newCard = document.createElement('div');
        newCard.className = 'option-card border-dashed';
        newCard.onclick = () => { cerrarNuevoRegistro(); abrirPersonal(); };
        newCard.innerHTML = `<span class="text-cyan-400" > + Nuevo</span> `;
        grid.appendChild(newCard);
    }

    // Reset selections
    document.querySelectorAll('#modalOverlay .option-card').forEach(c => c.classList.remove('active'));
    regState = { razon: '', encargado: '', cliente: '', cliente_info: null };
}

function cerrarNuevoRegistro() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function intercambiarARegistroCliente() {
    // Activar desplazamiento en el registro general
    document.getElementById('registrationModal').classList.add('history-open');

    // Mostrar panel lateral de cliente nuevo
    const overlay = document.getElementById('clientOverlay');
    const modal = document.getElementById('clientModal');
    overlay.classList.add('active');
    modal.classList.remove('hidden');

    // Forzar reflow para animación
    setTimeout(() => {
        modal.style.transform = "translateX(0)";
        modal.style.opacity = "1";
    }, 10);

    // Limpiar form
    document.getElementById('ncNombre').value = '';
    document.getElementById('ncId').value = '';
}

function cerrarPanelesLaterales() {
    // Cerrar Historial
    const histOverlay = document.getElementById('historyOverlay');
    const histPanel = document.getElementById('historyPanel');
    if (histOverlay) histOverlay.classList.remove('active');
    if (histPanel) histPanel.classList.remove('active');

    // Cerrar Nuevo Cliente
    const clientOverlay = document.getElementById('clientOverlay');
    const clientModal = document.getElementById('clientModal');
    if (clientOverlay) clientOverlay.classList.remove('active');
    if (clientModal) {
        clientModal.classList.add('hidden');
        clientModal.style.transform = "translateX(100%)";
        clientModal.style.opacity = "0";
    }

    // SIEMPRE quitar el desplazamiento del modal principal al cerrar laterales
    const regModal = document.getElementById('registrationModal');
    if (regModal) regModal.classList.remove('history-open');
    const rrModal = document.getElementById('rrModal');
    if (rrModal) rrModal.classList.remove('history-open');
}

function intercambiarARegistroGeneral() {
    cerrarPanelesLaterales();
}


function limpiarClienteSeleccionado() {
    document.getElementById('regClienteNombre').value = '';
    regState.cliente = '';
    regState.cliente_info = null;
}

async function buscarSugerenciasClientes(query) {
    const list = document.getElementById('clienteSuggestions');
    if (!query || query.length < 2) {
        list.classList.add('hidden');
        return;
    }

    const res = await window.pywebview.api.buscar_cliente(query);
    if (res.status === "success" && res.clientes.length > 0) {
        list.innerHTML = '';
        res.clientes.forEach(c => {
            const item = document.createElement('div');
            item.className = 'px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0';
            item.innerHTML = `
        <div class="text-sm font-bold" > ${ c.nombre }</div>
            <div class="text-[10px] opacity-50">${c.id} - ${c.tipo_id}</div>
    `;
            item.onclick = () => {
                seleccionarClienteSugerido(c);
            };
            list.appendChild(item);
        });
        list.classList.remove('hidden');
    } else {
        list.classList.add('hidden');
    }
}

function seleccionarClienteSugerido(c) {
    regState.cliente = c.nombre;
    regState.cliente_info = c;
    document.getElementById('regClienteNombre').value = c.nombre;
    document.getElementById('clienteSuggestions').classList.add('hidden');
    showToast(`Cliente '${c.nombre}' seleccionado`, "success");
}

async function verificarIdExistente(id) {
    if (!id) return;
    const res = await window.pywebview.api.verificar_id_cliente(id);
    if (res.status === "exists") {
        showToast(`El ID ${ id } ya pertenece a ${ res.nombre } `, "warning");
        // Opcional: podrías preguntar si desea cargarlo directamente
    }
}

async function autoPasteIMEI() {
    try {
        const text = await navigator.clipboard.readText();
        let clean = text.replace(/\D/g, '').trim();
        if (clean.length > 15) clean = clean.substring(0, 15);

        if (clean.length > 0) {
            document.getElementById('regImei').value = clean;
            showToast("IMEI Pegado automáticamente", "success");
            if (clean.length === 15) consultarModeloRegistro();
        }
    } catch (err) {
        console.warn('Clipboard access denied');
    }
}

function selectOption(type, value, el) {
    const container = el.parentElement;
    container.querySelectorAll('.option-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    regState[type] = value;
}

async function confirmarNuevoCliente() {
    const nombreEl = document.getElementById('ncNombre');
    const idEl = document.getElementById('ncId');

    if (!nombreEl || !idEl) {
        console.error("No se encontraron los elementos ncNombre o ncId en el DOM.");
        return showToast("Error interno del formulario", "error");
    }

    const nombre = nombreEl.value.trim();
    const id = idEl.value.trim();

    if (!nombre || !id) return showToast("Nombre e ID obligatorios", "error");

    const tipoIdEl = document.getElementById('ncTipoId');
    const celularEl = document.getElementById('ncCel') || document.getElementById('ncTelefono');
    const emailEl = document.getElementById('ncEmail');
    const expedicionEl = document.getElementById('ncExpedicion');

    const clienteData = {
        nombre,
        tipo_id: tipoIdEl ? tipoIdEl.value : 'C.C',
        id,
        celular: celularEl ? celularEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        expedicion: expedicionEl ? expedicionEl.value.trim() : ''
    };

    try {
        const res = await window.pywebview.api.guardar_cliente(clienteData);
        if (res.status === "success") {
            showToast("Cliente guardado correctamente", "success");
            if (clientSelectionContext === 'registrorapido' || clientSelectionContext === 'registrorapido_masivos') {
                if (typeof window.rrSeleccionarClienteSugerido === 'function') {
                    window.rrSeleccionarClienteSugerido({
                        nombre: nombre,
                        id: id,
                        lugar_expedicion: clienteData.expedicion,
                        correo: clienteData.email,
                        telefono: clienteData.celular
                    });
                }
            } else {
                regState.cliente = nombre;
                regState.cliente_info = clienteData;
                document.getElementById('regClienteNombre').value = nombre;
            }
            intercambiarARegistroGeneral();
        } else {
            showToast("Error al guardar: " + res.mensaje, "error");
        }
    } catch (e) {
        showToast("Error de conexión", "error");
    }
}
async function seleccionarClienteDetalles(c) {
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    await window.pywebview.api.actualizar_campo(imei, 'cliente', c.nombre);
    registros[indiceDetallesActual].cliente = c.nombre;
    document.getElementById('detClienteDisplay').innerText = c.nombre;
    renderizarTabla();
    showToast(`Cliente '${c.nombre}' asignado`, 'success');
}
window.seleccionarClienteDetalles = seleccionarClienteDetalles;

async function abrirSelectorClientes(context) {
    // Guardar contexto: 'details', 'registration', 'registrorapido', o 'registrorapido_masivos'
    clientSelectionContext = context || 'registration';

    document.getElementById('historyOverlay').classList.add('active');
    document.getElementById('historyPanel').classList.add('active');

    // Solo desplazar el modal de registro si venimos de él
    if (clientSelectionContext === 'registration') {
        document.getElementById('registrationModal').classList.add('history-open');
    } else if (clientSelectionContext === 'registrorapido' || clientSelectionContext === 'registrorapido_masivos') {
        document.getElementById('rrModal')?.classList.add('history-open');
    }

    await renderizarHistorialClientes();
}

function cerrarHistorialClientes() {
    document.getElementById('historyOverlay').classList.remove('active');
    document.getElementById('historyPanel').classList.remove('active');
    // Quitar desplazamiento de modales
    if (clientSelectionContext === 'registration') {
        document.getElementById('registrationModal')?.classList.remove('history-open');
    } else if (clientSelectionContext === 'registrorapido' || clientSelectionContext === 'registrorapido_masivos') {
        document.getElementById('rrModal')?.classList.remove('history-open');
    }
}

async function renderizarHistorialClientes() {
    const res = await window.pywebview.api.obtener_todos_clientes();
    todosLosClientesCache = res || [];
    mostrarListaHistorial(todosLosClientesCache);
}

function filtrarHistorialClientes(q) {
    const query = q.toLowerCase();
    const filtrados = todosLosClientesCache.filter(c =>
        c.nombre.toLowerCase().includes(query) ||
        c.id.toString().includes(query)
    );
    mostrarListaHistorial(filtrados);
}

function mostrarListaHistorial(lista) {
    const container = document.getElementById('historialLista');
    container.innerHTML = "";
    lista.forEach(c => {
        const div = document.createElement('div');
        div.className = "p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer group";
        div.innerHTML = `
        <div class="flex justify-between items-center" >
                <div>
                    <div class="text-sm font-bold text-white group-hover:text-purple-300 transition">${c.nombre}</div>
                    <div class="text-[10px] opacity-40 font-mono mt-1">${c.tipo_id}: ${c.id}</div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition">
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>
        `;
        div.onclick = () => {
            if (clientSelectionContext === 'details') {
                seleccionarClienteDetalles(c);
            } else if (clientSelectionContext === 'registrorapido' || clientSelectionContext === 'registrorapido_masivos') {
                if (typeof window.rrSeleccionarClienteSugerido === 'function') {
                    window.rrSeleccionarClienteSugerido(c);
                }
            } else {
                seleccionarClienteSugerido(c);
            }
            cerrarHistorialClientes();
        };
        container.appendChild(div);
    });
}

function crearNuevoClienteDesdeHistorial() {
    cerrarHistorialClientes();
    if (clientSelectionContext === 'details') {
        // Desde detalles: abrir panel lateral de nuevo cliente
        intercambiarARegistroCliente();
    } else {
        // Desde nuevo registro
        intercambiarARegistroCliente();
    }
}
window.crearNuevoClienteDesdeHistorial = crearNuevoClienteDesdeHistorial;



async function consultarModeloRegistro() {
    const imei = document.getElementById('regImei').value;
    if (imei.length < 15) return showToast("IMEI incompleto", "warning");

    const resBox = document.getElementById('regModeloResult');
    const resTxt = document.getElementById('txtModeloResult');
    const btnMan = document.getElementById('btnManualModelo');

    resBox.classList.remove('hidden');
    resTxt.innerText = "Consultando...";
    btnMan.classList.add('hidden');

    const res = await window.pywebview.api.consultar_modelo_solo(imei);
    if (res.status === "success" && res.modelo) {
        resTxt.innerText = res.modelo;
    } else {
        resTxt.innerText = "No encontrado";
        btnMan.classList.remove('hidden');
        btnMan.href = `https://www.movical.net/chequear-imei-lista-negra?imei=${imei}`;
    }
}

async function confirmarRegistro() {
    const imei = document.getElementById('regImei').value;
    const modelo = (document.getElementById('txtModeloResult').innerText === "Consultando..." || document.getElementById('txtModeloResult').innerText === "No encontrado") ? "" : document.getElementById('txtModeloResult').innerText;

    if (imei.length !== 15) return showToast("IMEI Inválido (15 dígitos)", "error");
    if (!regState.razon) return showToast("Seleccione Motivo", "warning");
    if (!regState.encargado) return showToast("Seleccione Encargado", "warning");
    if (!regState.cliente) return showToast("Asigne un cliente", "warning");

    const nuevoReg = {
        imei,
        modelo,
        cliente: regState.cliente,
        razon: regState.razon,
        encargado: regState.encargado,
        cliente_info: regState.cliente_info,
        estado: "Consultando...",
        operador: "...",
        pago: 'No',
        ingreso: new Date().toISOString()
    };

    const res = await window.pywebview.api.guardar_registro(nuevoReg);
    if (res.status === "success") {
        showToast("Registro Guardado con éxito", "success");
        cerrarNuevoRegistro();
        await cargarDatos();
        const newIndex = registros.findIndex(r => r.imei === imei);
        if (newIndex !== -1) forzarScraper(imei, newIndex);
    } else {
        showToast("Error al guardar registro", "error");
    }
}

async function tomarPantallazo(imei) {
    const idx = registros.findIndex(r => r.imei === imei);
    const reg = idx > -1 ? registros[idx] : (registros.find(r => r.imei === imei) || {});
    const isDetallesOpen = document.getElementById('detallesOverlay')?.classList.contains('active');

    if (idx > -1) {
        registros[idx]._tomandoCaptura = true;
        renderizarTabla();
        if (indiceDetallesActual === idx && isDetallesOpen) {
            abrirDetalles(indiceDetallesActual);
        }
    }
    showToastLoading("Tomando captura del imei con Imei colombia");

    const info = {
        modelo: reg.modelo || '',
        estado: reg.estado || '',
        operador: reg.operador || ''
    };

    try {
        const res = await window.pywebview.api.pantallazo_imei(imei, headlessEnabled, info);
        if (res && res.status === "success") {
            showToast("Copiado al portapapeles", "copy");
        } else {
            showToast("Error: " + (res?.mensaje || "No se pudo tomar la captura"), "error");
        }
    } catch (e) {
        showToast("Error al capturar: " + e, "error");
    } finally {
        if (idx > -1 && registros[idx]) {
            delete registros[idx]._tomandoCaptura;
            renderizarTabla();
            if (indiceDetallesActual === idx && document.getElementById('detallesOverlay')?.classList.contains('active')) {
                abrirDetalles(indiceDetallesActual);
            }
        }
        hideToastLoading();
    }
}
window.tomarPantallazo = tomarPantallazo;

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
        let res = await window.pywebview.api.consultar_modelo(imei);

        // 2. Si la respuesta es Error o falla, ejecutar automáticamente ConsultarModeloPro
        if (!res || res.status !== 'success' || !res.modelo) {
            showToast('Modelo Estándar falló. Reintentando con Modo Pro...', 'warning');
            res = await window.pywebview.api.consultar_modelo_pro(imei, false);
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

    if (typeof window.pywebview.api.obtener_estado_cupos_modelo === 'function') {
        try {
            const cuposRes = await window.pywebview.api.obtener_estado_cupos_modelo();
            if (typeof mdActualizarDockIndicador === 'function') mdActualizarDockIndicador(cuposRes);
            if (typeof ckActualizarDockIndicador === 'function') ckActualizarDockIndicador(cuposRes);
        } catch (err) {}
    }
}
window.consultarModeloFila = consultarModeloFila;

async function ejecutarEliminar(imei) {
    if (confirm("¿Mover a papelera?")) {
        showToastLoading("Eliminando registro...");
        const res = await window.pywebview.api.eliminar_registro(imei);
        hideToastLoading();

        if (res.status === "success") {
            showToast("Registro movido a la papelera", "trash");
            await cargarDatos();
        } else {
            // Aquí la magia: Si Supabase rechaza la acción, te lo dirá en pantalla
            console.error("Error al eliminar:", res.mensaje);
            showToast("Error: " + res.mensaje, "error");
        }
    }
}

/* ============ PAPELERA ============ */
async function abrirPapelera() {
    try {
        const data = await window.pywebview.api.obtener_papelera() || [];
        const tb = document.getElementById("papeleraBody");
        tb.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tb.innerHTML = `<tr><td colspan="4" style="text-align:center;opacity:0.4;padding:2rem;font-size:13px;">La papelera está vacía</td></tr>`;
            document.getElementById('papeleraOverlay').classList.add('active');
            return;
        }

        data.forEach(r => {
            const tr = document.createElement("tr");
            const imei = r.imei || '';
            let dateStr = r.fecha_borrado ? new Date(r.fecha_borrado).toLocaleString() : 'Reciente';
            tr.innerHTML = `
                <td style="color:var(--color-muted);font-size:12px;font-family:monospace">${imei}</td>
                <td style="color:var(--color)">${r.modelo || '—'}</td>
                <td style="color:var(--color-muted);font-size:12px">${dateStr}</td>
                <td class="text-center">
                    <div style="display:flex;gap:6px;justify-content:center;align-items:center;">
                        <!-- Restaurar -->
                        <button class="btn-icon" title="Restaurar registro"
                            onclick="restaurarDePapelera('${imei}')"
                            style="color:#22c55e;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                            </svg>
                        </button>
                        <!-- Borrar definitivamente -->
                        <button class="btn-icon" title="Eliminar definitivamente"
                            onclick="borrarDefinitivo('${imei}')"
                            style="color:#ef4444;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/>
                                <path d="M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                        </button>
                    </div>
                </td>`;
            tb.appendChild(tr);
        });
        document.getElementById('papeleraOverlay').classList.add('active');
    } catch (e) {
        console.error("Error abriendo papelera:", e);
        showToast("Error al cargar la papelera", "error");
    }
}

async function restaurarDePapelera(imei) {
    showToastLoading('Restaurando registro...');
    const res = await window.pywebview.api.restaurar_registro(imei);
    hideToastLoading();
    if (res && res.status === 'success') {
        showToast('Registro restaurado correctamente', 'success');
        await cargarDatos();
        abrirPapelera();
    } else {
        showToast('Error al restaurar: ' + (res?.mensaje || 'desconocido'), 'error');
    }
}

async function borrarDefinitivo(imei) {
    if (!confirm(`¿Eliminar permanentemente el IMEI ${imei}? Esta acción no se puede deshacer.`)) return;
    showToastLoading('Eliminando...');
    const res = await window.pywebview.api.borrar_permanente(imei);
    hideToastLoading();
    if (res && res.status === 'success') {
        showToast('Registro eliminado definitivamente', 'trash');
        abrirPapelera();
    } else {
        showToast('Error al eliminar: ' + (res?.mensaje || 'desconocido'), 'error');
    }
}

async function vaciarPapelera() {
    if (confirm("¿Eliminar todos los registros de la papelera permanentemente?")) {
        await window.pywebview.api.vaciar_papelera();
        abrirPapelera();
    }
}

/* ============ CONSULTAR TODOS ============ */
async function ejecutarConsultarTodos() {
    showToastLoading("Consultando el estado de su imei con Imei Colombia");
    for (let i = 0; i < registros.length; i++) await forzarScraper(registros[i].imei, i);
    hideToastLoading();
    showToast("Masivo completado", "");
}

/* ============ MODAL CHECK (antes MODELOS) ============ */
function abrirModelos() {
    const overlay = document.getElementById('checkOverlay');
    if (overlay) overlay.classList.add('active');
}
window.abrirModelos = abrirModelos;

function cerrarModelos() {
    const overlay = document.getElementById('checkOverlay');
    if (overlay) overlay.classList.remove('active');
}
window.cerrarModelos = cerrarModelos;

async function consultarModelos() {
    const faltantes = registros.filter(r => !r.modelo || r.modelo.trim() === '').map(r => r.imei);
    if (faltantes.length === 0) return showToast("Sin modelos pendientes", "");
    showToast("Consultando modelos...", "");
    showToastLoading("Consultando modelo con Movical");
    faltantes.forEach(imei => {
        const idx = registros.findIndex(r => r.imei === imei);
        if (idx > -1) registros[idx].modelo = "Consultando...";
    });
    renderizarTabla();
    const res = await window.pywebview.api.consultar_modelos(faltantes, headlessEnabled);
    if (res.status === "success") {
        const poll = setInterval(async () => {
            await cargarDatos();
            if (!registros.some(r => r.modelo === "Consultando...")) {
                clearInterval(poll);
                hideToastLoading();
                showToast("Modelos listos", "");
            }
        }, 3000);
    } else {
        hideToastLoading();
        showToast("Error al consultar modelos: " + (res?.mensaje || "desconocido"), "error");
    }
}

/* ============ MASIVOS ============ */
function abrirMasivos() { document.getElementById('masivosOverlay').classList.add('active'); }

async function ejecutarCargarExcel() {
    document.getElementById('masivosOverlay').classList.remove('active');
    const res = await window.pywebview.api.cargar_excel();
    if (res.status === "success") { showToast(res.mensaje, ""); await cargarDatos(); }
    else if (res.status !== "cancelled") showToast("Error al cargar: " + res.mensaje, "error");
}

async function exportarExcel() {
    document.getElementById('masivosOverlay').classList.remove('active');
    showToast("Preparando archivo...", "loading");
    const res = await window.pywebview.api.exportar_excel();
    if (res.status === "success") showToast(res.mensaje, "save");
    else if (res.status !== "cancelled") showToast("Error al exportar: " + res.mensaje, "error");
}

/* ============ REGISTRO WOM / ETB ============ */
let lineaCallback = null;

/* ============ CORREO DESBLOQUEO WOM ============ */
let womDesbIMEIActual = null;
let womDesbFotoRuta = null;

async function solicitarDesbloqueoWom() {
    if (indiceDetallesActual === null) return;
    const reg = registros[indiceDetallesActual];
    const imei = reg.imei;
    womDesbIMEIActual = imei;
    womDesbFotoRuta = null;

    // Rellenar IMEI
    document.getElementById('womDesbIMEI').innerText = imei;

    // Resetear foto
    document.getElementById('womDesbFotoNombre').innerText = 'Sin foto adjunta';
    document.getElementById('womDesbFotoCheck').innerText = '';

    // Obtener encargado
    const encNombre = reg.encargado;
    document.getElementById('womDesbNombre').innerText = encNombre || 'Sin asignar';

    let alertas = [];
    const modeloActual = (reg.modelo || '').trim();
    const modeloLower = modeloActual.toLowerCase();
    if (!modeloActual || modeloLower === 'error' || modeloLower === 'error pro' || modeloLower.startsWith('error')) {
        alertas.push("❌ ERROR CRÍTICO: El modelo del dispositivo es obligatorio para el desbloqueo WOM y NO puede ser 'Error' o 'Error Pro'.");
    }

    if (!encNombre) {
        alertas.push('AVISO: No hay encargado asignado a este IMEI.');
    } else {
        const enc = await window.pywebview.api.obtener_encargado(encNombre);
        if (enc) {
            document.getElementById('womDesbCorreo').innerText = enc.correo || '—';
            document.getElementById('womDesbLineas').innerText = enc.lineas_wom || '—';
            document.getElementById('womDesbCC').innerText = enc.identificacion || '—';
            document.getElementById('womDesbAppPwd').innerText = enc.app_password ? '••••••••' : 'Sin configurar';

            if (!enc.correo) alertas.push('AVISO: El encargado no tiene correo registrado.');
            if (!enc.app_password) alertas.push('AVISO: Falta la contraseña de aplicación Gmail (App Password).');
            if (!enc.identificacion) alertas.push('AVISO: Falta el número de identificación CC.');
            if (!enc.lineas_wom) alertas.push('AVISO: No hay líneas WOM registradas.');

            // Firma PDF (ahora verificamos si se generó la declaración del IMEI)
            const declEl = document.getElementById('womDesbDeclStatus');
            if (reg.ruta_declaracion_generada) {
                declEl.textContent = 'Generada';
                declEl.style.background = 'rgba(57,255,20,0.12)';
                declEl.style.color = '#39FF14';
                declEl.style.borderColor = 'rgba(57,255,20,0.3)';
            } else {
                declEl.textContent = 'Sin generar';
                declEl.style.background = 'rgba(239,68,68,0.12)';
                declEl.style.color = '#f87171';
                declEl.style.borderColor = 'rgba(239,68,68,0.3)';
                alertas.push('AVISO: Falta generar la declaración WOM para este IMEI.');
            }

            // Fotocopia CC
            if (!enc.foto_cc) {
                alertas.push('AVISO: Falta la fotocopia de la CC del encargado (Debe ser ampliada, legible y a color).');
            }

        } else {
            alertas.push('AVISO: Encargado no encontrado en la BD.');
        }
    }

    // PIN
    const pin = reg.pin_desbloqueo || '';
    document.getElementById('womDesbPin').innerText = pin || '(se enviará como PENDIENTE)';
    if (!pin) alertas.push('ℹ El PIN se incluirá como PENDIENTE.');

    // Mostrar/ocultar alertas
    const alertasEl = document.getElementById('womDesbAlertas');
    if (alertas.length > 0) {
        alertasEl.innerHTML = alertas.map(a => `<div>${a}</div>`).join('');
        alertasEl.classList.remove('hidden');
    } else {
        alertasEl.classList.add('hidden');
    }

    document.getElementById('womDesbloqueoOverlay').classList.add('active');
}

async function cargarFotoDispositivoWom() {
    if (!womDesbIMEIActual) return;
    // SIN showToastLoading aquí — el Finder abre inmediatamente
    const res = await window.pywebview.api.seleccionar_foto_dispositivo(womDesbIMEIActual);
    if (res.status === 'success') {
        womDesbFotoRuta = res.ruta;
        const nombre = res.ruta.split('/').pop().split('\\').pop();
        document.getElementById('womDesbFotoNombre').innerText = nombre;
        document.getElementById('womDesbFotoCheck').innerText = '✓';
        showToast('Foto guardada', 'success');
    } else if (res.status !== 'cancelled') {
        showToast('Error: ' + res.mensaje, 'error');
    }
}

async function cargarDeclaracionDesdeModal() {
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    const encNombre = registros[indiceDetallesActual].encargado;
    if (!encNombre) return showToast('Asigna un encargado primero.', 'warning');
    const res = await window.pywebview.api.seleccionar_declaracion_wom(encNombre);
    if (res.status === 'success') {
        showToast('Firma guardada. Generando declaración WOM...', 'file');
        const resGen = await window.pywebview.api.generar_declaracion_wom(imei);
        if (resGen.status === 'success') {
            registros[indiceDetallesActual].ruta_declaracion_generada = resGen.ruta || resGen.path;
            const declEl = document.getElementById('womDesbDeclStatus');
            if (declEl) {
                declEl.textContent = 'Generada';
                declEl.style.background = 'rgba(57,255,20,0.12)';
                declEl.style.color = '#39FF14';
                declEl.style.borderColor = 'rgba(57,255,20,0.3)';
            }
            showToast('Declaración WOM lista con firma', 'success');
        } else {
            showToast('Firma guardada pero error al generar PDF: ' + resGen.mensaje, 'error');
        }
        const alertasEl = document.getElementById('womDesbAlertas');
        if (alertasEl) {
            const lines = alertasEl.innerHTML.split('<div>').filter(l => !l.includes('firma') && !l.includes('declaración WOM')).join('<div>');
            alertasEl.innerHTML = lines;
        }
    } else if (res.status !== 'cancelled') {
        showToast('Error: ' + res.mensaje, 'error');
    }
}

async function seleccionarDeclaracionWom() {
    const nombre = document.getElementById('encFormNombre').value.trim();
    if (!nombre) return alert('Guarda primero el encargado antes de cargar la firma PDF.');
    const res = await window.pywebview.api.seleccionar_declaracion_wom(nombre);
    if (res.status === 'success') {
        const nombreArchivo = res.ruta.split('/').pop().split('\\').pop();
        const declEl = document.getElementById('encFormDeclaracionNombre');
        declEl.textContent = nombreArchivo;
        declEl.dataset.ruta = res.ruta;
        showToast('Firma PDF guardada', 'file');
    } else if (res.status !== 'cancelled') {
        showToast('Error: ' + res.mensaje, 'error');
    }
}

async function seleccionarFotoCC() {
    const nombre = document.getElementById('encFormNombre').value.trim();
    if (!nombre) return alert('Guarda primero el encargado antes de cargar la CC.');
    const res = await window.pywebview.api.seleccionar_foto_cc(nombre);
    if (res.status === 'success') {
        const nombreArchivo = res.ruta.split('/').pop().split('\\').pop();
        const ccEl = document.getElementById('encFormCCNombres');
        ccEl.textContent = nombreArchivo;
        ccEl.dataset.ruta = res.ruta;
        showToast('Fotocopia CC guardada', 'file');
    } else if (res.status !== 'cancelled') {
        showToast('Error: ' + res.mensaje, 'error');
    }
}
/* ============================================================
   AÑADIDOS PARA FUNCIONALIDADES SOLICITADAS
   ============================================================ */

/* ── 1. Consultar Modelo individual desde los detalles ── */
/* ── 1. Consultar Modelo individual desde los detalles ── */
async function consultarModeloDetalles() {
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    const inputModelo = document.getElementById('detModelo');
    const contenedorError = document.getElementById('contenedorBotonesErrorModelo');

    // Ocultar botones de error al iniciar nueva consulta
    contenedorError.classList.add('hidden');
    registros[indiceDetallesActual].modelo = "Consultando...";
    renderizarTabla();
    inputModelo.value = "Consultando...";
    inputModelo.classList.add('input-beam-modelo');
    showToastLoading("Consultando modelo...");

    try {
        const res = await window.pywebview.api.consultar_modelo_solo(imei);
        hideToastLoading();
        inputModelo.classList.remove('input-beam-modelo');
        if (res && res.status === "success" && res.modelo) {
            registros[indiceDetallesActual].modelo = res.modelo;
            inputModelo.value = res.modelo;
            await guardarDetalle('modelo');
            renderizarTabla();
            showToast("Modelo actualizado correctamente", "success");
        } else {
            registros[indiceDetallesActual].modelo = "Error";
            inputModelo.value = "Error";
            await guardarDetalle('modelo');
            renderizarTabla();
            showToast("No se pudo obtener el modelo. Intenta métodos alternativos.", "error");
            contenedorError.classList.remove('hidden');
        }
    } catch (e) {
        hideToastLoading();
        inputModelo.classList.remove('input-beam-modelo');
        registros[indiceDetallesActual].modelo = "Error";
        inputModelo.value = "Error";
        renderizarTabla();
        showToast("Error al consultar modelo: " + e, "error");
    }
}
window.consultarModeloDetalles = consultarModeloDetalles;

/* ── Consultar Modelo PRO desde los detalles ── */
async function consultarModeloProDetalles() {
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    const inputModelo = document.getElementById('detModelo');
    const contenedorError = document.getElementById('contenedorBotonesErrorModelo');

    registros[indiceDetallesActual].modelo = "Consultando Pro...";
    renderizarTabla();
    inputModelo.value = "Consultando Pro...";
    inputModelo.classList.add('input-beam-modelo');
    showToastLoading("Consultando modelo versión Pro...");

    try {
        const res = await window.pywebview.api.consultar_modelo_pro(imei);
        hideToastLoading();
        inputModelo.classList.remove('input-beam-modelo');
        if (res && res.status === "success" && res.modelo) {
            registros[indiceDetallesActual].modelo = res.modelo;
            inputModelo.value = res.modelo;
            await guardarDetalle('modelo');
            renderizarTabla();
            showToast("Modelo Pro obtenido correctamente", "success");
            contenedorError.classList.add('hidden');
        } else {
            registros[indiceDetallesActual].modelo = "Error Pro";
            inputModelo.value = "Error Pro";
            await guardarDetalle('modelo');
            renderizarTabla();
            showToast("La consulta Pro también falló", "error");
        }
    } catch (e) {
        hideToastLoading();
        inputModelo.classList.remove('input-beam-modelo');
        registros[indiceDetallesActual].modelo = "Error Pro";
        inputModelo.value = "Error Pro";
        renderizarTabla();
        showToast("Error en consulta Pro: " + e, "error");
    }
}
window.consultarModeloProDetalles = consultarModeloProDetalles;

function calcularTiempoTranscurrido(fecha) {
    if (!fecha) return "-";
    let normalized = fecha;

    // Check if it already has timezone information
    const hasTimezone = normalized.includes('Z') || normalized.includes('z') || /[+-]\d{2}/.test(normalized.slice(-8));

    // Normalizar ISO sin timezone: agregar offset Colombia (-05:00)
    if (typeof normalized === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(normalized) && !hasTimezone) {
        normalized = normalized + '-05:00';
    }

    const fechaObj = new Date(normalized);
    if (isNaN(fechaObj.getTime())) return "-";

    const ahora = new Date();
    const difMs = ahora - fechaObj;
    const segundos = Math.floor(difMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
        return dias === 1 ? "hace 1 día" : `hace ${dias} días`;
    } else if (horas > 0) {
        return horas === 1 ? "hace 1 hora" : `hace ${horas} horas`;
    } else if (minutos > 0) {
        return minutos === 1 ? "hace 1 min" : `hace ${minutos} min`;
    } else {
        return "hace un momento";
    }
}

/* ── 2. Cambiar Motivo de Bloqueo a Desbloqueo  ── */
async function ejecutarCambioADesbloqueo(e) {
    if (e) e.stopPropagation();
    if (indiceDetallesActual === null) return;

    document.getElementById('detRazon').value = 'Desbloqueo';
    await guardarDetalle('razon');
    showToast("Razón cambiada exitosamente a Desbloqueo", "success");
}
window.ejecutarCambioADesbloqueo = ejecutarCambioADesbloqueo;

/* Funciones asociadas a la visualización de la lista de Razones */
function abrirSelectorRazon(e) {
    if (e) e.stopPropagation();
    const sel = document.getElementById('detRazonInput');
    sel.value = document.getElementById('detRazon').value;
    sel.classList.remove('hidden');
    sel.size = 5;
    sel.focus();
}
window.abrirSelectorRazon = abrirSelectorRazon;

async function guardarDetalleRazon() {
    const sel = document.getElementById('detRazonInput');
    sel.classList.add('hidden');
    document.getElementById('detRazon').value = sel.value;
    await guardarDetalle('razon');
}
window.guardarDetalleRazon = guardarDetalleRazon;




function esModeloValidoWom(modelo) {
    if (!modelo) return false;
    const m = String(modelo).trim().toLowerCase();
    if (!m || m === 'error' || m === 'error pro' || m.startsWith('error') || m === 'consultando...' || m === 'no disponible' || m === 'n/a' || m === 'null' || m === 'undefined') {
        return false;
    }
    return true;
}
window.esModeloValidoWom = esModeloValidoWom;

/* ============================================================
   ACTUALIZACIÓN DEL MÓDULO ETB DESBLOQUEO EN JS
   ============================================================ */
let etbDesbRutaAnexos = null;
async function generarDeclaracion(tipo) {
    if (tipo === 'general') {
        if (indiceDetallesActual === null) return;
        const imei = registros[indiceDetallesActual].imei;
        showToastLoading('Generando declaración General...');
        try {
            const res = await window.pywebview.api.generar_declaracion_general(imei);
            hideToastLoading();
            if (res && res.status === 'success') {
                showToast(res.mensaje || "Declaración general generada", 'file');
            } else {
                showToast(res?.mensaje || "Error al generar declaración general", 'error');
            }
        } catch (e) {
            hideToastLoading();
            showToast('Error al generar declaración general: ' + e, 'error');
        }
        return;
    }
    if (indiceDetallesActual === null) return;
    const regAct = registros[indiceDetallesActual];
    const imei = regAct.imei;

    const modAct = (regAct.modelo || '').trim();
    if (!esModeloValidoWom(modAct)) {
        return showToast("No se puede generar la declaración WOM: El modelo del dispositivo es obligatorio y no puede ser 'Error' o 'Error Pro'.", "error");
    }

    showToastLoading('Generando declaración WOM...');
    try {
        const res = await window.pywebview.api.generar_declaracion_wom(imei);
        hideToastLoading();
        if (res && res.status === 'success') {
            registros[indiceDetallesActual].ruta_declaracion_generada = res.ruta;
            registros[indiceDetallesActual].fecha_declaracion_generada = res.fecha;
            if (typeof renderizarPanelOperativo === 'function') {
                renderizarPanelOperativo(registros[indiceDetallesActual]);
            }
            abrirDetalles(indiceDetallesActual);
            showToast(res.mensaje || "Declaración WOM generada ✓", 'file');
        } else {
            showToast(res?.mensaje || "Error al generar declaración WOM", 'error');
        }
    } catch (e) {
        hideToastLoading();
        showToast('Error al generar declaración WOM: ' + e, 'error');
    }
}
window.generarDeclaracion = generarDeclaracion;

async function confirmarEnvioCorreoWom() {
    if (!womDesbIMEIActual) return;
    const regWom = registros.find(r => r.imei === womDesbIMEIActual);
    const modWom = ((regWom && regWom.modelo) || '').trim();
    if (!esModeloValidoWom(modWom)) {
        return showToast("No se permite el envío de correo: El modelo es obligatorio y no puede ser 'Error' o 'Error Pro'.", "error");
    }

    const btn = document.getElementById('btnEnviarCorreoWom');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.innerText = 'Enviando...';
    showToastLoading(`Enviando correo de desbloqueo WOM para ${womDesbIMEIActual}...`);

    const res = await window.pywebview.api.enviar_correo_desbloqueo_wom(
        womDesbIMEIActual,
        womDesbFotoRuta || ''
    );

    hideToastLoading();
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerText = '✉️ Enviar Correo de Desbloqueo';

    if (res.status === 'success') {
        showToast(res.mensaje, 'save');
        document.getElementById('womDesbloqueoOverlay').classList.remove('active');
        const fechaEnvio = new Date().toISOString();
        if (indiceDetallesActual !== null) {
            registros[indiceDetallesActual].fecha_correo_wom = fechaEnvio;
            if (!registros[indiceDetallesActual].fecha_declaracion_generada) {
                registros[indiceDetallesActual].fecha_declaracion_generada = fechaEnvio;
            }
            actualizarWidgetInteligente(registros[indiceDetallesActual]);
        }

        // Marcar visualmente como enviado/procesado (amarillo) sin sobreescribir el estado real del IMEI
        try {
            const imeiWom = womDesbIMEIActual;
            await window.pywebview.api.actualizar_campo(imeiWom, 'fecha_declaracion_generada', fechaEnvio);
            const idx = registros.findIndex(r => r.imei === imeiWom);
            if (idx !== -1) {
                registros[idx].fecha_declaracion_generada = fechaEnvio;
                registros[idx].fecha_correo_wom = fechaEnvio;
                renderizarTabla();
            }
            showToast('Correo enviado — Trámite en proceso (Amarillo)', 'email');
        } catch (e) {
            console.warn('No se pudo actualizar fecha de correo:', e);
        }
    } else {
        showToast(res.mensaje, 'error');
    }
}

function mostrarSelectorLineasNeon(operador, lineas, callback) {
    lineaCallback = callback;
    const container = document.getElementById('lineBoxContainer');
    container.innerHTML = '';
    const colorHex = operador === 'WOM' ? '#b026ff' : '#00f3ff';
    const tit = document.getElementById('lineModalOperador');
    tit.innerText = operador;
    tit.style.color = colorHex;
    tit.style.textShadow = `0 0 12px ${colorHex}`;
    lineas.forEach(linea => {
        const btn = document.createElement('button');
        btn.className = "py-3.5 rounded-xl border text-xl font-mono tracking-[0.2em] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1";
        btn.style.cssText = `border-color:${colorHex}70;color:var(--color);background:var(--card-inner);box-shadow:0 0 12px ${colorHex}25;`;
        btn.onmouseenter = () => { btn.style.background = `${colorHex}18`; btn.style.boxShadow = `0 0 22px ${colorHex}70`; btn.style.color = colorHex; };
        btn.onmouseleave = () => { btn.style.background = 'var(--card-inner)'; btn.style.boxShadow = `0 0 12px ${colorHex}25`; btn.style.color = 'var(--color)'; };
        btn.innerText = linea;
        btn.onclick = () => { document.getElementById('lineSelectorOverlay').classList.remove('active'); if (lineaCallback) lineaCallback(linea); };
        container.appendChild(btn);
    });
    document.getElementById('lineSelectorOverlay').classList.add('active');
}

function ejecutarRegistroWom() {
    if (indiceDetallesActual === null || !registros[indiceDetallesActual]) return;
    const regActual = registros[indiceDetallesActual];
    const imei = regActual.imei;
    const encNombre = regActual.encargado;
    if (!encNombre) return showToast("Asigna un encargado primero", "warning");
    const enc = todosLosEncargados.find(e => e.nombre === encNombre);
    let lineas = [];
    if (enc && enc.lineas_wom) {
        lineas = enc.lineas_wom.split(',').map(l => l.trim()).filter(l => l !== "");
    }
    if (lineas.length === 0 && regActual.linea) {
        lineas = [regActual.linea];
    }
    
    const persistirYRegistrar = async (l) => {
        showToast("Registrando en FastReg y arrancando Selenium (WOM)...", "info");
        try {
            if (typeof window.pywebview.api.guardar_en_fastreg === 'function') {
                await window.pywebview.api.guardar_en_fastreg({
                    imei: imei,
                    operador: 'WOM',
                    linea: l,
                    encargado: encNombre,
                    modelo: regActual.modelo || '',
                    cliente: regActual.cliente || 'Anónimo',
                    razon: 'Registro WOM'
                });
            }
        } catch (e) {
            console.warn('Error guardando en FastReg:', e);
        }
        await window.pywebview.api.registrar_wom(imei, l);
        if (typeof window.marcarBotonRefrescarDisponible === 'function') window.marcarBotonRefrescarDisponible();
    };

    if (lineas.length > 1) {
        mostrarSelectorLineasNeon('WOM', lineas, persistirYRegistrar);
    } else if (lineas.length === 1) {
        persistirYRegistrar(lineas[0]);
    } else {
        showToast("El encargado no tiene líneas WOM guardadas.", "warning");
    }
}

function ejecutarRegistroEtb() {
    if (indiceDetallesActual === null || !registros[indiceDetallesActual]) return;
    const regActual = registros[indiceDetallesActual];
    const imei = regActual.imei;
    const encNombre = regActual.encargado;
    if (!encNombre) return showToast("Asigna un encargado primero", "warning");
    const enc = todosLosEncargados.find(e => e.nombre === encNombre);
    let lineas = [];
    if (enc && enc.lineas_etb) {
        lineas = enc.lineas_etb.split(',').map(l => l.trim()).filter(l => l !== "");
    }
    if (lineas.length === 0 && regActual.linea) {
        lineas = [regActual.linea];
    }

    const persistirYRegistrar = async (l) => {
        showToast("Registrando en FastReg y arrancando Selenium (ETB)...", "info");
        try {
            if (typeof window.pywebview.api.guardar_en_fastreg === 'function') {
                await window.pywebview.api.guardar_en_fastreg({
                    imei: imei,
                    operador: 'ETB',
                    linea: l,
                    encargado: encNombre,
                    modelo: regActual.modelo || '',
                    cliente: regActual.cliente || 'Anónimo',
                    razon: 'Registro ETB'
                });
            }
        } catch (e) {
            console.warn('Error guardando en FastReg:', e);
        }
        await window.pywebview.api.registrar_etb(imei, l);
        if (typeof window.marcarBotonRefrescarDisponible === 'function') window.marcarBotonRefrescarDisponible();
    };

    if (lineas.length > 1) {
        mostrarSelectorLineasNeon('ETB', lineas, persistirYRegistrar);
    } else if (lineas.length === 1) {
        persistirYRegistrar(lineas[0]);
    } else {
        showToast("El encargado no tiene líneas ETB guardadas.", "warning");
    }
}

/* ============ DOCK MAGNIFY ============ */
const dockIcons = document.querySelectorAll('.dock-item');
document.addEventListener('mousemove', (e) => {
    dockIcons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
        const size = dist < 150 ? 50 + (38 * Math.pow(Math.cos((dist / 150) * (Math.PI / 2)), 2)) : 50;
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        const img = icon.querySelector('img');
        if (img) { img.style.width = `${(size / 50) * 28}px`; img.style.height = `${(size / 50) * 28}px`; }
    });
});
document.addEventListener('mouseleave', () => {
    dockIcons.forEach(i => {
        i.style.width = '50px'; i.style.height = '50px';
        const img = i.querySelector('img');
        if (img) { img.style.width = '28px'; img.style.height = '28px'; }
    });
});


/* Inicializar posición de Toasts */
window.addEventListener('load', () => {
    posicionarToastDesdeDock();
    posicionarToastLoadingDesdeDock();
    actualizarBotonHeadless();
    actualizarBotonTema(document.documentElement.getAttribute('data-theme') || 'dark');
});

/* Cerrar modales al hacer clic en overlay */
document.addEventListener('mousedown', (e) => {
    // No cerrar el selector de encargado con el mousedown global —
    // él se cierra solo con su propio onclick en el HTML
    if (e.target.id === 'encargadoSelectorOverlay') return;
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

/* ==========================================
      SISTEMA DE AUTENTICACIÓN Y ROLES (CLIENTE)
   ========================================== */

async function loginCompletadoExitosamente(user) {
    currentUser = user;

    // Aplicar nombre y avatar en la UI (config modal, etc.)
    applyProfileToUI(
        currentUser.usuario,
        currentUser.avatar_url || ''
    );

    window.usuarioRecordadoRechazado = false;

    // Guardar sesión para recordar el último inicio de sesión (LocalStorage + Python backend)
    const sessionObj = {
        email: currentUser.usuario,
        nombre: currentUser.nombre || currentUser.usuario.split('@')[0],
        avatar_url: currentUser.avatar_url || '',
        access_token: currentUser.access_token || '',
        refresh_token: currentUser.refresh_token || ''
    };
    localStorage.setItem('imei-last-session', JSON.stringify(sessionObj));
    try {
        if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.guardar_sesion_local === 'function') {
            window.pywebview.api.guardar_sesion_local(sessionObj);
        }
    } catch (e) { }

    // Ocultar Overlay de Login con animación suave
    const overlay = document.getElementById('authOverlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.style.opacity = '';
    }, 500);

    // Mostrar botón de cerrar sesión siempre
    document.getElementById('logoutBtn').classList.remove('hidden');

    // === GESTIÓN DE ROLES Y PERMISOS ===
    const esAdmin = (currentUser.rol === 'admin');

    // 1. Mostrar/Ocultar el interruptor de Base de Datos (solo admin)
    const dbToggle = document.getElementById('dbStatusToggle');
    if (dbToggle) dbToggle.classList.toggle('hidden', !esAdmin);

    // 2. Mostrar botones admin de Settings / Ocultos (solo admin)
    const btnHide = document.getElementById('btnAdminHide');
    const btnLnHide = document.getElementById('btnLineasAdminHide');
    const btnClHide = document.getElementById('btnClientesSettingsAdmin');
    const btnLineasSettings = document.getElementById('btnLineasSettingsAdmin');

    [btnHide, btnLnHide, btnClHide, btnLineasSettings].forEach(btn => {
        if (btn) {
            if (esAdmin) {
                btn.classList.remove('hidden');
                btn.style.display = 'flex';
            } else {
                btn.classList.add('hidden');
                btn.style.display = 'none';
            }
        }
    });

    // 3. Todos los usuarios ven Papelera y Personal
    document.querySelectorAll('.dock-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            const alt = (img.getAttribute('alt') || '').toLowerCase();
            if (['personal', 'papelera'].includes(alt)) {
                item.style.display = 'flex';
            }
        }
    });

    // Cargar datos reales de la BD (todos los usuarios cargan encargados y clientes)
    try {
        todosLosEncargados = await window.pywebview.api.obtener_todos_encargados() || [];
        await cargarClientesBase();
    } catch (e) {
        todosLosEncargados = [];
    }

    await cargarDatos();
    inicializarAutocomplete();

    // Actualizar cupos en dock al iniciar sesión
    if (typeof window.ckActualizarCupos === 'function') window.ckActualizarCupos();
    if (typeof window.ckActualizarCuposBlacklist === 'function') window.ckActualizarCuposBlacklist();

    showToast(`Bienvenido, ${currentUser.usuario}. Rol: ${currentUser.rol.toUpperCase()}`);

    // Iniciar temporizador de inactividad (20 minutos)
    reiniciarTemporizadorInactividad();

    // Mostrar toast de confirmación para consulta inicial
    setTimeout(() => {
        const toCheck = registros.filter(esPendienteORojo);
        if (toCheck.length > 0) {
            mostrarToastConfirmacionConsulta(toCheck);
        }
    }, 1500);
}

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btnEl.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>`;
    } else {
        input.type = 'password';
        btnEl.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
    }
}


function switchAuthMode(mode) {
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const rememberedCard = document.getElementById('rememberedCard');

    if (loginCard) loginCard.classList.add('hidden');
    if (registerCard) registerCard.classList.add('hidden');
    if (rememberedCard) rememberedCard.classList.add('hidden');

    if (mode === 'register') {
        if (registerCard) registerCard.classList.remove('hidden');
    } else if (mode === 'remembered') {
        if (rememberedCard) rememberedCard.classList.remove('hidden');
    } else {
        if (loginCard) loginCard.classList.remove('hidden');

        // Lógica de Usuario Recordado
        const headerStandard = document.getElementById('loginHeaderStandard');
        const headerRemembered = document.getElementById('loginHeaderRemembered');
        const userGroup = document.getElementById('loginUserGroup');
        const btnNoSoyYo = document.getElementById('btnNoSoyYo');
        const rememberedAvatar = document.getElementById('loginRememberedAvatar');
        const rememberedInitial = document.getElementById('loginRememberedInitial');
        const rememberedName = document.getElementById('loginRememberedName');
        const rememberedEmail = document.getElementById('loginRememberedEmail');
        const loginUserEl = document.getElementById('loginUser');
        const loginPasswordEl = document.getElementById('loginPassword');

        const lastSessionStr = localStorage.getItem('imei-last-session');
        let lastSession = null;
        if (lastSessionStr && !window.usuarioRecordadoRechazado) {
            try { lastSession = JSON.parse(lastSessionStr); } catch (e) { }
        }

        if (lastSession && lastSession.email) {
            // Activar Vista de Usuario Recordado
            if (headerStandard) headerStandard.classList.add('hidden');
            if (headerRemembered) {
                headerRemembered.classList.remove('hidden');
                headerRemembered.classList.add('flex');
            }
            if (userGroup) userGroup.classList.add('hidden');
            if (btnNoSoyYo) btnNoSoyYo.classList.remove('hidden');

            if (loginUserEl) loginUserEl.value = lastSession.email;
            if (rememberedName) rememberedName.innerText = lastSession.nombre || lastSession.email.split('@')[0];
            if (rememberedEmail) rememberedEmail.innerText = lastSession.email;

            if (rememberedAvatar && rememberedInitial) {
                if (lastSession.avatar_url) {
                    rememberedAvatar.src = lastSession.avatar_url;
                    rememberedAvatar.classList.remove('hidden');
                    rememberedInitial.classList.add('hidden');
                } else {
                    rememberedAvatar.classList.add('hidden');
                    rememberedInitial.innerText = (lastSession.nombre || lastSession.email).charAt(0).toUpperCase();
                    rememberedInitial.classList.remove('hidden');
                }
            }

            if (loginPasswordEl) {
                setTimeout(() => loginPasswordEl.focus(), 150);
            }
        } else {
            // Activar Vista Estándar (Sin usuario recordado)
            if (headerRemembered) {
                headerRemembered.classList.add('hidden');
                headerRemembered.classList.remove('flex');
            }
            if (headerStandard) headerStandard.classList.remove('hidden');
            if (userGroup) userGroup.classList.remove('hidden');
            if (btnNoSoyYo) btnNoSoyYo.classList.add('hidden');

            if (loginUserEl && !loginUserEl.value) {
                setTimeout(() => loginUserEl.focus(), 150);
            }
        }
    }
}

// ==========================================
// LÓGICA DE AUTENTICACIÓN (LOGIN Y REGISTRO)
// ==========================================

async function ejecutarLogin() {
    console.log("🔑 [JS] ejecutarLogin iniciado...");
    const loginUserEl = document.getElementById('loginUser');
    const loginPasswordEl = document.getElementById('loginPassword');
    let user = loginUserEl ? loginUserEl.value.trim() : '';
    const pass = loginPasswordEl ? loginPasswordEl.value : '';

    // Si el usuario está en modo "recordado", asegurar que user se tome del localStorage si el input estuviera vacío
    if (!user) {
        const lastSessionStr = localStorage.getItem('imei-last-session');
        if (lastSessionStr) {
            try {
                const ls = JSON.parse(lastSessionStr);
                if (ls && ls.email) {
                    user = ls.email.trim();
                    if (loginUserEl) loginUserEl.value = user;
                }
            } catch (e) { }
        }
    }

    console.log(`🔑 [JS] Datos ingresados: usuario='${user}', contraseña=${pass ? 'SI' : 'NO'}`);

    // MAGIA: Forzar que las alertas se vean por encima de la pantalla de login (authOverlay z-index es 999999)
    const toastElement = document.getElementById('toast');
    const toastLoadingElement = document.getElementById('toastLoading');
    if (toastElement) toastElement.style.zIndex = "99999999";
    if (toastLoadingElement) toastLoadingElement.style.zIndex = "99999999";

    if (!pass) {
        showToast("Escribe tu contraseña", "warning");
        if (loginPasswordEl) loginPasswordEl.focus();
        return;
    }

    if (!user) {
        showToast("Escribe tu correo electrónico", "warning");
        if (loginUserEl) loginUserEl.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user)) {
        showToast("Por favor escribe un correo electrónico válido", "warning");
        return;
    }

    showToastLoading("Iniciando sesión...");
    try {
        console.log("🔑 [JS] Enviando petición a Python (login_usuario)...");
        // Llama a Python
        const res = await window.pywebview.api.login_usuario(user, pass);
        console.log("🔑 [JS] Respuesta recibida de Python:", res);
        hideToastLoading();

        if (res.status === 'success') {
            // Si todo está bien, entra al sistema
            await loginCompletadoExitosamente(res.user);
        } else if (res.status === 'paused') {
            showToast(res.mensaje, "warning");
            mostrarPantallaSleep();
        } else {
            showToast(res.mensaje, "error");
        }
    } catch (e) {
        console.error("❌ [JS] Error en ejecutarLogin:", e);
        hideToastLoading();
        showToast("Error de conexión al iniciar sesión: " + e.message, "error");
    }
}

async function ejecutarRegistro() {
    const nombre = document.getElementById('regNombre').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;

    // MAGIA: Forzar que las alertas se vean por encima
    const toastElement = document.getElementById('toast');
    if (toastElement) toastElement.style.zIndex = "99999999";

    if (!nombre) {
        showToast("El nombre completo es obligatorio", "warning");
        return;
    }

    if (!user || !pass) {
        showToast("El correo y contraseña son obligatorios", "warning");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user)) {
        showToast("Por favor escribe un correo electrónico válido", "warning");
        return;
    }

    if (pass !== confirm) {
        showToast("Las contraseñas no coinciden", "warning");
        return;
    }

    if (pass.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres", "warning");
        return;
    }

    showToastLoading("Creando cuenta...");
    try {
        // Llama a Python pasando el nombre
        const res = await window.pywebview.api.registrar_usuario(user, pass, nombre);
        hideToastLoading();

        if (res.status === 'success') {
            showToast(res.mensaje, "success");

            // Limpiar formulario
            document.getElementById('regNombre').value = '';
            document.getElementById('regUser').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regPasswordConfirm').value = '';

            // Autocompletar el login para no tener que volver a escribir el usuario
            document.getElementById('loginUser').value = user;
            document.getElementById('loginPassword').value = '';

            // Volver visualmente a la pantalla de login
            switchAuthMode('login');
        } else {
            showToast(res.mensaje, "error");
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de conexión al registrar usuario", "error");
    }
}

async function ejecutarContinuarSesion() {
    const lastSessionStr = localStorage.getItem('imei-last-session');
    if (!lastSessionStr) {
        switchAuthMode('login');
        return;
    }
    const lastSession = JSON.parse(lastSessionStr);
    showToastLoading("Restaurando sesión...");
    try {
        const res = await window.pywebview.api.login_con_token(lastSession.access_token, lastSession.refresh_token);
        hideToastLoading();
        if (res.status === 'success') {
            localStorage.setItem('imei-last-session', JSON.stringify({
                email: res.user.usuario,
                nombre: res.user.nombre,
                avatar_url: res.user.avatar_url || '',
                access_token: res.user.access_token,
                refresh_token: res.user.refresh_token
            }));
            await loginCompletadoExitosamente(res.user);
        } else {
            showToast(res.mensaje || "La sesión ha expirado", "warning");
            localStorage.removeItem('imei-last-session');
            switchAuthMode('login');
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de conexión al restaurar sesión", "error");
        switchAuthMode('login');
    }
}

function rechazarSesionRecordada() {
    localStorage.removeItem('imei-last-session');
    try {
        if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.eliminar_sesion_local === 'function') {
            window.pywebview.api.eliminar_sesion_local();
        }
    } catch (e) { }
    switchAuthMode('login');
}

/**
 * "No soy yo" — No elimina la sesión del disco, solo marca que el
 * usuario quiere iniciar sesión con otra cuenta en esta sesión.
 */
function rechazarUsuarioRecordado() {
    window.usuarioRecordadoRechazado = true;
    const loginUserEl = document.getElementById('loginUser');
    const loginPasswordEl = document.getElementById('loginPassword');
    if (loginUserEl) loginUserEl.value = '';
    if (loginPasswordEl) loginPasswordEl.value = '';
    switchAuthMode('login');
}

async function verificarSoporteBiometrico() {
    try {
        const res = await window.pywebview.api.validar_soporte_biometrico();
        if (res && res.soportado) {
            const btnLogin = document.getElementById('btnBiometriaLogin');
            const btnRemembered = document.getElementById('btnBiometriaRemembered');
            if (btnLogin) btnLogin.classList.remove('hidden');
            if (btnRemembered) btnRemembered.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Error al verificar soporte biométrico:", e);
    }
}

async function ejecutarHuellaDigital() {
    showToastLoading("Coloca tu huella en el sensor Touch ID...");
    try {
        const res = await window.pywebview.api.autenticar_con_huella();
        hideToastLoading();
        if (res.status === 'success') {
            showToast(res.mensaje, "success");

            // Si la huella es correcta, intentamos iniciar sesión usando la sesión guardada
            const lastSessionStr = localStorage.getItem('imei-last-session');
            if (lastSessionStr) {
                await ejecutarContinuarSesion();
            } else {
                showToast("No hay sesión guardada para autenticar con huella. Inicia sesión con contraseña primero.", "warning");
            }
        } else {
            showToast(res.mensaje || "Autenticación biométrica fallida", "error");
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de comunicación con Touch ID", "error");
    }
}

/* =====================================================
   SISTEMA DE CIERRE DE SESIÓN POR INACTIVIDAD (20 MIN)
   ===================================================== */
const TIEMPO_INACTIVIDAD_MS = 20 * 60 * 1000; // 20 minutos (1,200,000 ms)
let _temporizadorInactividad = null;
let _ultimoRegistroActividad = Date.now();

function registrarActividadUsuario() {
    if (!currentUser) return;
    const ahora = Date.now();
    // Throttle de 1 segundo para no saturar CPU con eventos de mouse
    if (ahora - _ultimoRegistroActividad < 1000) return;
    _ultimoRegistroActividad = ahora;

    if (_temporizadorInactividad) {
        clearTimeout(_temporizadorInactividad);
    }
    _temporizadorInactividad = setTimeout(ejecutarLogoutPorInactividad, TIEMPO_INACTIVIDAD_MS);
}

function detenerMonitoreoInactividad() {
    if (_temporizadorInactividad) {
        clearTimeout(_temporizadorInactividad);
        _temporizadorInactividad = null;
    }
}

function reiniciarTemporizadorInactividad() {
    _ultimoRegistroActividad = Date.now();
    detenerMonitoreoInactividad();
    if (currentUser) {
        _temporizadorInactividad = setTimeout(ejecutarLogoutPorInactividad, TIEMPO_INACTIVIDAD_MS);
    }
}

async function ejecutarLogoutPorInactividad() {
    if (!currentUser) return;
    console.log("⏰ [INACTIVIDAD] 20 minutos sin interacción. Cerrando sesión y recordando usuario...");
    detenerMonitoreoInactividad();

    try {
        await window.pywebview.api.logout_usuario();
    } catch (e) {
        console.error("Error al notificar logout en backend:", e);
    }

    currentUser = null;

    // Cerrar cualquier modal abierto
    if (typeof cerrarModalDetalles === 'function') try { cerrarModalDetalles(); } catch (e) {}
    if (typeof cerrarRegistroRapido === 'function') try { cerrarRegistroRapido(); } catch (e) {}
    if (typeof cerrarCheck === 'function') try { cerrarCheck(); } catch (e) {}
    if (typeof cerrarModalPapelera === 'function') try { cerrarModalPapelera(); } catch (e) {}
    if (typeof cerrarModalPersonal === 'function') try { cerrarModalPersonal(); } catch (e) {}

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    const dbToggle = document.getElementById('dbStatusToggle');
    if (dbToggle) dbToggle.classList.add('hidden');
    const sleepOverlay = document.getElementById('sleepOverlay');
    if (sleepOverlay) sleepOverlay.classList.add('hidden');

    registros = [];
    renderizarTabla();

    const authOverlay = document.getElementById('authOverlay');
    if (authOverlay) {
        authOverlay.style.opacity = '1';
        authOverlay.classList.remove('hidden');
    }

    // Mantener al usuario recordado en localStorage
    window.usuarioRecordadoRechazado = false;
    const pwdEl = document.getElementById('loginPassword');
    if (pwdEl) pwdEl.value = '';
    switchAuthMode('login');

    showToast("Sesión cerrada por 20 minutos de inactividad", "warning");
}

// Escuchar eventos globales de interacción del usuario
['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'input'].forEach(evt => {
    window.addEventListener(evt, registrarActividadUsuario, { passive: true });
});

// Publicar funciones a window
window.ejecutarContinuarSesion = ejecutarContinuarSesion;
window.rechazarSesionRecordada = rechazarSesionRecordada;
window.rechazarUsuarioRecordado = rechazarUsuarioRecordado;
window.ejecutarHuellaDigital = ejecutarHuellaDigital;
window.reiniciarTemporizadorInactividad = reiniciarTemporizadorInactividad;
window.detenerMonitoreoInactividad = detenerMonitoreoInactividad;
window.ejecutarLogoutPorInactividad = ejecutarLogoutPorInactividad;

async function ejecutarLogout() {
    try {
        detenerMonitoreoInactividad();
        await window.pywebview.api.logout_usuario();
        currentUser = null;

        document.getElementById('logoutBtn').classList.add('hidden');
        document.getElementById('dbStatusToggle')?.classList.add('hidden');
        document.getElementById('sleepOverlay')?.classList.add('hidden');
        document.getElementById('btnAdminHide')?.classList.add('hidden');
        document.getElementById('btnClientesSettingsAdmin')?.classList.add('hidden');
        document.getElementById('btnLineasSettingsAdmin')?.classList.add('hidden');

        registros = [];
        renderizarTabla();

        document.getElementById('authOverlay').style.opacity = '1';
        document.getElementById('authOverlay').classList.remove('hidden');

        // Al cerrar sesión mantenemos el usuario recordado en localStorage
        // pero reseteamos el flag para que al volver se muestre el perfil.
        window.usuarioRecordadoRechazado = false;
        const pwdEl = document.getElementById('loginPassword');
        if (pwdEl) pwdEl.value = '';
        switchAuthMode('login');

        showToast("Sesión cerrada correctamente", "success");
    } catch (e) {
        showToast("Error al cerrar sesión", "error");
    }
}

function actualizarVisualizacionEstadoBD(status) {
    const dot = document.getElementById('dbStatusIcon');
    const text = document.getElementById('dbStatusText');
    if (!dot || !text) return;

    if (status === 'active') {
        dot.className = "w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] transition-all duration-300";
        text.innerText = "Activa";
    } else {
        dot.className = "w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] transition-all duration-300 animate-pulse";
        text.innerText = "En Reposo";
    }
}

async function toggleDbStatus() {
    if (!currentUser || currentUser.rol !== 'admin') {
        showToast("Acción denegada. Solo Administrador.", "warning");
        return;
    }

    const nuevoEstado = currentDbStatus === 'active' ? 'paused' : 'active';
    showToastLoading(nuevoEstado === 'paused' ? "Deteniendo base de datos..." : "Activando base de datos...");

    try {
        const res = await window.pywebview.api.cambiar_estado_bd(currentUser.usuario, nuevoEstado);
        hideToastLoading();

        if (res.status === 'success') {
            currentDbStatus = res.db_status;
            actualizarVisualizacionEstadoBD(currentDbStatus);
            showToast(res.mensaje, "success");
        } else {
            showToast(res.mensaje, "error");
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error al cambiar estado de base de datos", "error");
    }
}

// Agregar atajos de teclado para inicio de sesión en inputs
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loginUser = document.getElementById('loginUser');
        const loginPass = document.getElementById('loginPassword');
        if (loginUser && loginPass) {
            const handleLoginEnter = (e) => { if (e.key === 'Enter') ejecutarLogin(); };
            loginUser.addEventListener('keydown', handleLoginEnter);
            loginPass.addEventListener('keydown', handleLoginEnter);
        }

        const regUser = document.getElementById('regUser');
        const regPass = document.getElementById('regPassword');
        const regPassConfirm = document.getElementById('regPasswordConfirm');
        if (regUser && regPass && regPassConfirm) {
            const handleRegisterEnter = (e) => { if (e.key === 'Enter') ejecutarRegistro(); };
            regUser.addEventListener('keydown', handleRegisterEnter);
            regPass.addEventListener('keydown', handleRegisterEnter);
            regPassConfirm.addEventListener('keydown', handleRegisterEnter);
        }
    }, 500);
});

/* ============================================================
   MÓDULO DE LÍNEAS v2 — Supabase + Liquid Glass
   ============================================================ */

let lineaEditandoNumero = null;

/* ── ABRIR / CERRAR ── */
async function abrirLineas() {
    document.getElementById('lineasOverlay').classList.remove('hidden');
    document.getElementById('lineasOverlay').classList.add('active');
    await cargarDatosLineas();
}

function cerrarLineas() {
    document.getElementById('lineasOverlay').classList.remove('active');
    document.getElementById('lineasOverlay').classList.add('hidden');
    cerrarFormLinea();
}

/* ── CARGAR DATOS ── */
async function cargarDatosLineas() {
    const res = await window.pywebview.api.obtener_lineas();
    if (res.status === 'success') {
        todasLasLineasCache = res.lineas || [];
    } else {
        todasLasLineasCache = [];
        showToast('Error al cargar líneas: ' + res.mensaje, 'error');
    }
    filtrarLineas(document.getElementById('searchLineas')?.value || '');
}

/* ── FILTRAR ── */
function filtrarLineas(query) {
    const q = (query || '').toLowerCase();
    const op = document.getElementById('filtroOperadorLineas')?.value || 'todos';

    const filtradas = todasLasLineasCache.filter(l => {
        const matchOp = op === 'todos' || (l.operador || '').toLowerCase() === op.toLowerCase();
        const matchQ = !q ||
            (l.numero || '').includes(q) ||
            (l.operador || '').toLowerCase().includes(q) ||
            (l.encargado || '').toLowerCase().includes(q) ||
            (l.imei_vinculado || '').includes(q);
        return matchOp && matchQ;
    });

    const disp = filtradas.filter(l => (l.estado || l.tipo || '').toLowerCase() === 'disponible');
    const susp = filtradas.filter(l => (l.estado || l.tipo || '').toLowerCase() === 'suspendida');
    const perm = filtradas.filter(l => (l.estado || l.tipo || '').toLowerCase() === 'permanente');

    document.getElementById('cntDisponibles').textContent = disp.length;
    document.getElementById('cntSuspendidas').textContent = susp.length;
    document.getElementById('cntPermanentes').textContent = perm.length;

    renderizarColumnaLineas('lineasDisponiblesContainer', disp, 'disponible');
    renderizarColumnaLineas('lineasSuspendidasContainer', susp, 'suspendida');
    renderizarColumnaLineas('lineasPermanentesContainer', perm, 'permanente');
}

/* ── RENDERIZAR COLUMNA ── */
function renderizarColumnaLineas(containerId, lineas, tipo) {
    const cont = document.getElementById(containerId);
    if (!cont) return;
    cont.innerHTML = '';

    if (lineas.length === 0) {
        cont.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10 opacity-30">
                <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span class="text-xs font-bold uppercase tracking-wider">Sin líneas</span>
            </div>`;
        return;
    }

    lineas.forEach(l => {
        const card = document.createElement('div');
        card.className = 'linea-card-v2';
        card.onclick = () => editarLineaForm(l.numero);

        const opColor = getOperadorColor(l.operador);
        const estadoIcon = tipo === 'disponible'
            ? `<div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:#00f3ff; box-shadow:0 0 5px #00f3ff;"></div>`
            : tipo === 'suspendida'
                ? `<div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:#ef4444; box-shadow:0 0 5px #ef4444;"></div>`
                : `<div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:#a855f7; box-shadow:0 0 5px #a855f7;"></div>`;

        const encargadoBadge = l.encargado
            ? `<div class="text-[9px] font-bold uppercase tracking-wider opacity-50 mt-1 truncate">${l.encargado.split(' ')[0]}</div>`
            : '';

        const imeiBadge = l.imei_vinculado
            ? `<div class="font-mono text-[9px] opacity-40 mt-0.5 truncate">IMEI: ${l.imei_vinculado}</div>`
            : '';

        card.innerHTML = `
            <div class="flex items-center gap-2.5">
                ${estadoIcon}
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-sm tracking-wider" style="color:var(--color)">${l.numero}</span>
                        <span class="operator-badge-pill ${(l.operador || '').toLowerCase()}">${l.operador}</span>
                    </div>
                    ${encargadoBadge}
                    ${imeiBadge}
                </div>
                <svg class="w-3.5 h-3.5 flex-shrink-0 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
        `;
        cont.appendChild(card);
    });
}

function getOperadorColor(op) {
    const m = { 'WOM': '#b026ff', 'ETB': '#00b4cc', 'Claro': '#ef4444', 'Movistar': '#16a34a', 'Tigo': '#3b82f6' };
    return m[op] || '#64748b';
}

/* ── FORMULARIO ── */
function actualizarSelectEncargadosLineas() {
    const select = document.getElementById('lnEncargadoV2');
    if (!select) return;
    const valorActual = select.value;
    select.innerHTML = '<option value="" class="bg-gray-900">Seleccione un encargado...</option>';
    if (Array.isArray(todosLosEncargados)) {
        todosLosEncargados.forEach(enc => {
            const opt = document.createElement('option');
            opt.value = enc.nombre;
            opt.textContent = enc.nombre;
            opt.className = 'bg-gray-900';
            select.appendChild(opt);
        });
    }
    select.value = valorActual;
}

function mostrarFormLinea() {
    lineaEditandoNumero = null;
    document.getElementById('lineasFormTituloV2').textContent = 'Nueva Línea';
    document.getElementById('lnNumeroV2').value = '';
    document.getElementById('lnNumeroV2').readOnly = false;
    document.getElementById('lnOperadorV2').value = 'ETB';
    document.getElementById('lnEstadoV2').value = 'disponible';
    document.getElementById('lnSerialV2').value = '';
    document.getElementById('lnImeiV2').value = '';
    actualizarSelectEncargadosLineas();
    document.getElementById('lnEncargadoV2').value = '';
    document.getElementById('btnEliminarLineaV2').classList.add('hidden');
    document.getElementById('lnNumeroError').classList.add('hidden');
    document.getElementById('btnGuardarLineaV2').disabled = true;
    toggleLineasFormCampos();
    document.getElementById('lineasFormOverlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('lnNumeroV2').focus(), 100);
}

function cerrarFormLinea() {
    document.getElementById('lineasFormOverlay').classList.add('hidden');
    lineaEditandoNumero = null;
}

function editarLineaForm(numero) {
    const l = todasLasLineasCache.find(x => x.numero === numero);
    if (!l) return;

    lineaEditandoNumero = numero;
    document.getElementById('lineasFormTituloV2').textContent = 'Editar Línea';
    document.getElementById('lnNumeroV2').value = l.numero;
    document.getElementById('lnNumeroV2').readOnly = true;
    document.getElementById('lnOperadorV2').value = l.operador || 'ETB';
    const estado = (l.estado || l.tipo || 'disponible').toLowerCase();
    document.getElementById('lnEstadoV2').value = estado;
    document.getElementById('lnSerialV2').value = l.serial || '';
    document.getElementById('lnImeiV2').value = l.imei_vinculado || '';
    actualizarSelectEncargadosLineas();
    document.getElementById('lnEncargadoV2').value = l.encargado || '';
    document.getElementById('btnEliminarLineaV2').classList.remove('hidden');
    document.getElementById('lnNumeroError').classList.add('hidden');
    document.getElementById('btnGuardarLineaV2').disabled = false;
    toggleLineasFormCampos();
    document.getElementById('lineasFormOverlay').classList.remove('hidden');
}

function toggleLineasFormCampos() {
    const op = document.getElementById('lnOperadorV2').value;
    const estado = document.getElementById('lnEstadoV2').value;

    const isDisponible = estado === 'disponible';
    const isSuspendida = estado === 'suspendida';
    const isPermanente = estado === 'permanente';
    const isEtb = op === 'ETB';

    // Serial: solo ETB + disponible
    const serialCont = document.getElementById('lnSerialContainer');
    if (isEtb && isDisponible) {
        serialCont.classList.remove('hidden');
    } else {
        serialCont.classList.add('hidden');
        document.getElementById('lnSerialV2').value = '';
    }

    // IMEI: solo suspendida
    const imeiCont = document.getElementById('lnImeiContainer');
    isSuspendida ? imeiCont.classList.remove('hidden') : imeiCont.classList.add('hidden');

    // Encargado: suspendida o permanente
    const encCont = document.getElementById('lnEncargadoContainer');
    (isSuspendida || isPermanente) ? encCont.classList.remove('hidden') : encCont.classList.add('hidden');
}

function validarFormLinea() {
    const num = document.getElementById('lnNumeroV2').value;
    const errEl = document.getElementById('lnNumeroError');
    const btnGuardar = document.getElementById('btnGuardarLineaV2');

    if (num.length > 0 && num.length !== 10) {
        errEl.classList.remove('hidden');
        btnGuardar.disabled = true;
    } else if (num.length === 10) {
        errEl.classList.add('hidden');
        btnGuardar.disabled = false;
    } else {
        errEl.classList.add('hidden');
        btnGuardar.disabled = true;
    }
}

async function autocompletarEncargado(imei) {
    if (!imei || imei.length < 15) return;
    const reg = registros.find(r => r.imei === imei);
    if (reg && reg.encargado) {
        document.getElementById('lnEncargadoV2').value = reg.encargado;
    }
}

async function guardarFormLinea() {
    const numero = document.getElementById('lnNumeroV2').value.trim();
    if (numero.length !== 10) return showToast('El número debe tener 10 dígitos', 'warning');

    const operador = document.getElementById('lnOperadorV2').value;
    const estado = document.getElementById('lnEstadoV2').value;

    const datos = {
        numero,
        operador,
        estado,
        tipo: estado.charAt(0).toUpperCase() + estado.slice(1), // compatibilidad
        serial: document.getElementById('lnSerialV2').value.trim() || '',
        imei_vinculado: document.getElementById('lnImeiV2').value.trim() || '',
        encargado: document.getElementById('lnEncargadoV2').value.trim() || ''
    };

    const res = await window.pywebview.api.guardar_linea(datos);
    if (res.status === 'success') {
        showToast('Línea guardada correctamente', 'success');
        cerrarFormLinea();
        await cargarDatosLineas();
        // Actualizar widget si hay detalles abiertos
        if (indiceDetallesActual !== null) {
            actualizarWidgetInteligente(registros[indiceDetallesActual]);
        }
    } else {
        showToast('Error al guardar: ' + res.mensaje, 'error');
    }
}

async function eliminarLineaActual() {
    const numero = lineaEditandoNumero || document.getElementById('lnNumeroV2').value;
    if (!numero) return;
    if (!confirm(`¿Eliminar la línea ${numero} permanentemente?`)) return;

    const res = await window.pywebview.api.eliminar_linea(numero);
    if (res.status === 'success') {
        showToast('Línea eliminada', 'trash');
        cerrarFormLinea();
        await cargarDatosLineas();
        if (indiceDetallesActual !== null) {
            actualizarWidgetInteligente(registros[indiceDetallesActual]);
        }
    } else {
        showToast('Error al eliminar: ' + res.mensaje, 'error');
    }
}

async function populateAvailableETBLines() {
    const res = await window.pywebview.api.obtener_lineas();
    const sel = document.getElementById('selLineaETB');
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecciona...</option>';
    if (res.status === 'success' && res.lineas) {
        const etbLines = res.lineas.filter(l => {
            const est = (l.estado || l.tipo || '').toLowerCase();
            return l.operador.toUpperCase() === 'ETB' && est === 'disponible';
        });
        etbLines.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.numero;
            opt.innerText = l.numero;
            sel.appendChild(opt);
        });
    }
}

/* ============================================================
   MÓDULO DESBLOQUEO ETB
   ============================================================ */
let etbDesbIMEI = null;
let etbDesbRutaCelular = null;

async function abrirModalDesbloqueoETB(imei) {
    etbDesbIMEI = imei || (indiceDetallesActual !== null ? registros[indiceDetallesActual].imei : null);
    if (!etbDesbIMEI) return showToast('No hay IMEI seleccionado', 'warning');

    etbDesbRutaAnexos = null;
    etbDesbRutaCelular = null;

    // Reset UI
    document.getElementById('etbDesbIMEI').innerText = etbDesbIMEI;
    resetEtbStep('etbStepAnexos');
    resetEtbStep('etbStepCelular');

    document.getElementById('etbDesbloqueoOverlay').classList.add('active');
}
window.abrirModalDesbloqueoETB = abrirModalDesbloqueoETB;

function resetEtbStep(stepId) {
    const step = document.getElementById(stepId);
    if (!step) return;
    step.querySelector('.etb-step-status')?.classList.add('hidden');
    step.querySelector('.etb-step-ok')?.classList.add('hidden');
}

// Paso 1: Imprimir Anexos
async function etbImprimirAnexos() {
    if (!etbDesbIMEI) return;
    showToastLoading('Preparando PDF de impresión...');
    const res = await window.pywebview.api.imprimir_anexos_etb(etbDesbIMEI);
    hideToastLoading();
    if (res.status === 'success') {
        showToast('PDF listo en Preview', 'file');
        const step = document.getElementById('etbStepAnexos');
        step.querySelector('.etb-step-ok').classList.remove('hidden');
        step.querySelector('.etb-step-ok').innerText = '✓ PDF abierto en Preview';
    } else {
        showToast(res.mensaje, 'error');
    }
}
window.etbImprimirAnexos = etbImprimirAnexos;

async function etbCargarAnexosFirmados() {
    if (!etbDesbIMEI) return;
    showToastLoading('Seleccionando anexos firmados...');
    const res = await window.pywebview.api.seleccionar_anexos_pdf_etb(etbDesbIMEI);
    hideToastLoading();
    if (res.status === 'success') {
        etbDesbRutaAnexos = res.ruta;
        const nombre = res.ruta.split('/').pop();
        const step = document.getElementById('etbStepAnexos');
        step.querySelector('.etb-step-ok').classList.remove('hidden');
        step.querySelector('.etb-step-ok').innerText = `✓ ${nombre}`;
        showToast('Anexos cargados', 'success');
    } else if (res.status !== 'cancelled') {
        showToast(res.mensaje, 'error');
    }
}
window.etbCargarAnexosFirmados = etbCargarAnexosFirmados;

// Paso 2: Foto del celular
async function etbCargarFotoCelular() {
    if (!etbDesbIMEI) return;
    showToastLoading('Seleccionando foto del celular...');
    const res = await window.pywebview.api.seleccionar_foto_celular_etb(etbDesbIMEI);
    hideToastLoading();
    if (res.status === 'success') {
        etbDesbRutaCelular = res.ruta;
        const nombre = res.ruta.split('/').pop();
        const step = document.getElementById('etbStepCelular');
        step.querySelector('.etb-step-ok').classList.remove('hidden');
        step.querySelector('.etb-step-ok').innerText = `✓ ${nombre}`;
        showToast('Foto convertida a PDF', 'success');
    } else if (res.status !== 'cancelled') {
        showToast(res.mensaje, 'error');
    }
}
window.etbCargarFotoCelular = etbCargarFotoCelular;



// Generar PDF final unificado ETB
async function etbGenerarPDFFinal() {
    if (!etbDesbIMEI) return;
    if (!etbDesbRutaAnexos) return showToast('Falta cargar los anexos firmados (Paso 1)', 'warning');
    if (!etbDesbRutaCelular) return showToast('Falta la foto del celular (Paso 2)', 'warning');

    showToastLoading(`Generando ${etbDesbIMEI}desbloqueo.pdf...`);

    // La CC se obtiene automáticamente del encargado en Python
    const res = await window.pywebview.api.generar_pdf_desbloqueo_etb(
        etbDesbIMEI, etbDesbRutaAnexos, etbDesbRutaCelular
    );

    hideToastLoading();
    if (res.status === 'success') {
        showToast(res.mensaje, 'save');
        document.getElementById('etbDesbloqueoOverlay').classList.remove('active');

        // Marcar visualmente como archivo creado (amarillo) sin sobreescribir el estado real del IMEI
        const fechaGen = res.fecha || new Date().toISOString();
        const rutaPdf = res.ruta || '';
        try {
            await window.pywebview.api.actualizar_campo(etbDesbIMEI, 'fecha_declaracion_generada', fechaGen);
            if (rutaPdf) {
                await window.pywebview.api.actualizar_campo(etbDesbIMEI, 'ruta_declaracion_generada', rutaPdf);
            }
            const idx = registros.findIndex(r => r.imei === etbDesbIMEI);
            if (idx !== -1) {
                registros[idx].fecha_declaracion_generada = fechaGen;
                if (rutaPdf) registros[idx].ruta_declaracion_generada = rutaPdf;
                renderizarTabla();
                if (indiceDetallesActual === idx) {
                    actualizarWidgetInteligente(registros[idx]);
                }
            }
            showToast('PDF generado — Trámite en proceso (Amarillo)', 'file');
        } catch (e) {
            console.warn('No se pudo actualizar fecha de declaración ETB:', e);
        }
    } else {
        showToast(res.mensaje, 'error');
    }
}


/* ==========================================
   MODAL DE CONFIGURACIÓN Y CONSULTA MASIVA
   ========================================== */

function toggleMasivoMenu() {
    const dropdown = document.getElementById('masivoDropdown');
    dropdown.classList.toggle('hidden');
}

// Cierra el menú masivo si se hace clic afuera
document.addEventListener('click', (e) => {
    const btn = document.getElementById('btnConsultarMasivo');
    const drop = document.getElementById('masivoDropdown');
    if (btn && drop && !btn.contains(e.target) && !drop.contains(e.target)) {
        drop.classList.add('hidden');
    }
});

// Reemplaza al antiguo ejecutarConsultarTodos()
async function ejecutarConsultarMasivo(tipo) {
    document.getElementById('masivoDropdown')?.classList.add('hidden');

    let aConsultar = [];
    let nombreTipo = '';

    if (tipo === 'amarillos' || tipo === 'neon-amarillo') {
        nombreTipo = 'amarillos (En proceso)';
        aConsultar = registros.filter(r => evaluarNeon(r) === 'neon-amarillo');
    } else if (tipo === 'rojos' || tipo === 'neon-rojo' || tipo === 'pendientes') {
        nombreTipo = 'rojos';
        aConsultar = registros.filter(r => evaluarNeon(r) === 'neon-rojo');
    } else if (tipo === 'verdes' || tipo === 'neon-verde' || tipo === 'exitosos') {
        nombreTipo = 'verdes';
        aConsultar = registros.filter(r => evaluarNeon(r) === 'neon-verde');
    } else if (tipo === 'todos') {
        nombreTipo = 'todos los registros';
        aConsultar = registros;
    }

    if (aConsultar.length === 0) {
        return showToast(`No hay registros (${nombreTipo}) para consultar`, "warning");
    }

    showToastLoading(`Consultando ${aConsultar.length} registros (${nombreTipo})...`);
    for (let i = 0; i < aConsultar.length; i++) {
        const originalIndex = registros.findIndex(r => r.imei === aConsultar[i].imei);
        if (originalIndex > -1) {
            await forzarScraper(aConsultar[i].imei, originalIndex);
        }
    }
    hideToastLoading();
    showToast(`Consulta masiva de ${nombreTipo} completada`, "success");
}
window.etbGenerarPDFFinal = etbGenerarPDFFinal;
// Abrir módulo de Registros (Pendiente por desarrollar)
function abrirModuloRegistros() {
    showToast("Abriendo módulo de registros...", "info");
    // Aquí irá tu futura funcionalidad
}

/* ==========================================
   EDICIÓN DE PERFIL
   ========================================== */

let _pendingAvatarDataUrl = null; // Avatar nuevo seleccionado pero no guardado aún

function applyProfileToUI(correo, avatarUrl) {
    // Config modal — nombre corto arriba, email abajo
    const nameEl  = document.getElementById('profileUserName');
    const emailEl = document.getElementById('profileUserEmail');
    const initEl  = document.getElementById('profileUserInitial');
    const imgEl   = document.getElementById('profileUserImage');

    // Nombre a mostrar: nombre guardado o parte local del correo
    const nombre = currentUser?.nombre || (correo ? correo.split('@')[0] : 'Usuario');
    if (nameEl)  nameEl.textContent  = nombre;
    if (emailEl) emailEl.textContent = correo || '';
    if (initEl)  initEl.textContent  = (nombre || correo || 'U').charAt(0).toUpperCase();

    if (imgEl && initEl) {
        if (avatarUrl) {
            imgEl.src = avatarUrl;
            imgEl.classList.remove('hidden');
            initEl.classList.add('hidden');
        } else {
            imgEl.src = '';
            imgEl.classList.add('hidden');
            initEl.classList.remove('hidden');
        }
    }
}

function abrirModalEditarPerfil() {
    const nombre = currentUser?.nombre || currentUser?.usuario?.split('@')[0] || '';
    const avatarUrl = currentUser?.avatar_url || '';

    // Poblar el mini modal
    const input = document.getElementById('peNombreInput');
    if (input) input.value = nombre;

    // Avatar preview en el modal de edición
    const peImg = document.getElementById('peAvatarImg');
    const peInit = document.getElementById('peAvatarInitial');
    if (peImg && peInit) {
        if (avatarUrl) {
            peImg.src = avatarUrl;
            peImg.classList.remove('hidden');
            peInit.classList.add('hidden');
        } else {
            peImg.src = '';
            peImg.classList.add('hidden');
            peInit.textContent = (nombre || 'U').charAt(0).toUpperCase();
            peInit.classList.remove('hidden');
        }
    }

    _pendingAvatarDataUrl = null;
    const hint = document.getElementById('peAvatarHint');
    if (hint) hint.classList.add('hidden');

    document.getElementById('profileEditOverlay').classList.add('active');
    setTimeout(() => document.getElementById('peNombreInput')?.focus(), 150);
}

function cerrarModalEditarPerfil() {
    document.getElementById('profileEditOverlay').classList.remove('active');
    _pendingAvatarDataUrl = null;
}

async function seleccionarFotoPerfilNueva() {
    showToastLoading('Abriendo selector de archivo...');
    const res = await window.pywebview.api.seleccionar_archivo_imagen();
    hideToastLoading();

    if (!res || res.status === 'cancelled') return;
    if (res.status === 'error') {
        showToast('Error al abrir selector: ' + res.mensaje, 'error');
        return;
    }

    showToastLoading('Procesando imagen...');
    const b64Res = await window.pywebview.api.leer_imagen_base64(res.ruta);
    hideToastLoading();

    if (!b64Res || b64Res.status !== 'success') {
        showToast('No se pudo leer la imagen', 'error');
        return;
    }

    _pendingAvatarDataUrl = b64Res.data_url;

    // Preview inmediato en el modal de edición
    const peImg = document.getElementById('peAvatarImg');
    const peInit = document.getElementById('peAvatarInitial');
    if (peImg) { peImg.src = _pendingAvatarDataUrl; peImg.classList.remove('hidden'); }
    if (peInit) peInit.classList.add('hidden');

    const hint = document.getElementById('peAvatarHint');
    if (hint) hint.classList.remove('hidden');
}

async function guardarPerfil() {
    const nombre = (document.getElementById('peNombreInput')?.value || '').trim();
    if (!nombre) {
        showToast('El nombre no puede estar vacío', 'warning');
        return;
    }

    const btn = document.getElementById('peBtnGuardar');
    if (btn) btn.disabled = true;

    showToastLoading('Guardando perfil...');
    const avatarToSave = _pendingAvatarDataUrl || '';
    const res = await window.pywebview.api.actualizar_perfil(nombre, avatarToSave);
    hideToastLoading();

    if (btn) btn.disabled = false;

    if (!res || res.status !== 'success') {
        showToast('Error: ' + (res?.mensaje || 'desconocido'), 'error');
        return;
    }

    // Actualizar currentUser local
    if (currentUser) {
        currentUser.nombre = nombre;
        if (avatarToSave) currentUser.avatar_url = avatarToSave;
    }

    // Actualizar todos los elementos UI
    const finalAvatar = avatarToSave || currentUser?.avatar_url || '';
    applyProfileToUI(currentUser?.usuario || nombre, finalAvatar);

    // Actualizar la sesión guardada en localStorage
    const sessionStr = localStorage.getItem('imei-last-session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            session.nombre = nombre;
            if (finalAvatar) session.avatar_url = finalAvatar;
            localStorage.setItem('imei-last-session', JSON.stringify(session));
        } catch (e) { }
    }

    _pendingAvatarDataUrl = null;
    cerrarModalEditarPerfil();
    showToast('Perfil actualizado correctamente', 'success');
}

// Mantener compatibilidad con el onclick antiguo
function cambiarFotoPerfil() { abrirModalEditarPerfil(); }

/* ==========================================
   MODAL DE CONFIGURACIÓN Y PERFIL
   ========================================== */

function abrirConfiguracion() {
    const modal = document.getElementById('configOverlay');
    if (modal) {
        requestAnimationFrame(() => modal.classList.add('active'));
    } else {
        console.error("Error: No se encontró 'configOverlay' en el HTML.");
    }
}

function cerrarConfiguracion() {
    const modal = document.getElementById('configOverlay');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Asegurar que las funciones estén disponibles globalmente para el HTML
window.abrirConfiguracion = abrirConfiguracion;
window.cerrarConfiguracion = cerrarConfiguracion;
window.cambiarFotoPerfil = cambiarFotoPerfil;

// Publicar al window
window.abrirLineas = abrirLineas;
window.cerrarLineas = cerrarLineas;
window.mostrarFormLinea = mostrarFormLinea;
window.cerrarFormLinea = cerrarFormLinea;
window.volverLineasLista = cerrarFormLinea;
window.guardarFormLinea = guardarFormLinea;
window.eliminarLineaActual = eliminarLineaActual;
window.filtrarLineas = filtrarLineas;
window.toggleLineasFormCampos = toggleLineasFormCampos;
window.validarFormLinea = validarFormLinea;
window.autocompletarEncargado = autocompletarEncargado;
window.populateAvailableETBLines = populateAvailableETBLines;
window.guardarLineaAsignada = guardarLineaAsignada;

/* ============================================================
   MODAL: CUENTA DE COBRO
   ============================================================ */

async function abrirCuentaCobroModal() {
    // 1. Asegurar clientes cargados
    try {
        if (!todosLosClientesCache || todosLosClientesCache.length === 0) {
            await cargarClientesBase();
        }
    } catch (e) {
        console.error("Error al cargar clientes base:", e);
    }

    // 2. Poblar selector de clientes
    const selectEl = document.getElementById('ccClienteSelect');
    if (selectEl) {
        const valAnterior = selectEl.value;
        selectEl.innerHTML = '<option value="" class="bg-gray-900">Selecciona un cliente...</option>';

        // Filtrar clientes para asegurar que no se dupliquen o estén vacíos
        const nombresUnicos = new Set();
        todosLosClientesCache.forEach(c => {
            if (c && c.nombre && !nombresUnicos.has(c.nombre)) {
                nombresUnicos.add(c.nombre);
                const opt = document.createElement('option');
                opt.value = c.nombre;
                opt.innerText = c.nombre;
                opt.className = "bg-gray-900 py-1";
                selectEl.appendChild(opt);
            }
        });

        if (valAnterior && nombresUnicos.has(valAnterior)) {
            selectEl.value = valAnterior;
        }
    }

    // 3. Abrir modal overlay
    const overlay = document.getElementById('ccOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => overlay.classList.add('active'));
    }

    // 4. Actualizar textbox
    actualizarContenidoTextboxCC();
}

function cerrarCuentaCobroModal() {
    const overlay = document.getElementById('ccOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function actualizarContenidoTextboxCC() {
    const clienteSel = document.getElementById('ccClienteSelect').value;
    const txtbox = document.getElementById('ccTextbox');
    const labelCount = document.getElementById('ccResumenCount');
    const btnLiquidar = document.getElementById('ccBtnLiquidar');

    if (!clienteSel) {
        txtbox.value = "Selecciona un cliente con trabajos pendientes para generar la cuenta de cobro...";
        labelCount.innerText = "0 trabajos";
        if (btnLiquidar) btnLiquidar.disabled = true;
        return;
    }

    // Filtrar registros en AMBAS tablas (registros + datosFastReg) del cliente, pago = No
    const unpaidWorks = [
        ...registros.filter(r => {
            const isClient = r.cliente && r.cliente.trim().toLowerCase() === clienteSel.trim().toLowerCase();
            const isUnpaid = !r.pago || r.pago.trim() === '' || r.pago.trim().toLowerCase() === 'no';
            return isClient && isUnpaid;
        }).map(r => ({
            imei: r.imei, modelo: r.modelo || 'N/A', razon: r.razon || 'N/A',
            estado: r.estado || 'N/A', operador: r.operador || 'N/A',
            ingreso: r.ingreso, _fuente: 'registros'
        })),
        ...datosFastReg.filter(r => {
            const isClient = r.CLIENTE && r.CLIENTE.trim().toLowerCase() === clienteSel.trim().toLowerCase();
            const isUnpaid = !r.PAGO || r.PAGO.trim() === '' || r.PAGO.trim().toLowerCase() === 'no';
            return isClient && isUnpaid;
        }).map(r => ({
            imei: r.IMEI, modelo: r.MODELO || 'N/A', razon: r.RAZ\u00d3N || 'N/A',
            estado: r.ESTADO || 'N/A', operador: r.OPERADOR || 'N/A',
            ingreso: r.INGRESO, _fuente: 'fastreg'
        }))
    ];
    // Deduplicar por IMEI
    const seenImeis = new Set();
    const unpaidWorksDedup = unpaidWorks.filter(w => {
        if (seenImeis.has(w.imei)) return false;
        seenImeis.add(w.imei);
        return true;
    });
    const unpaidWorksFinal = unpaidWorksDedup;

    labelCount.innerText = `${unpaidWorksFinal.length} trabajos`;
    if (btnLiquidar) {
        btnLiquidar.disabled = unpaidWorksFinal.length === 0;
    }

    if (unpaidWorksFinal.length === 0) {
        txtbox.value = `No hay trabajos pendientes de pago (pago = 'No') para el cliente: ${clienteSel}`;
        return;
    }

    // Checkboxes
    const showModelo = document.getElementById('ccShowModelo').checked;
    const showRazon = document.getElementById('ccShowRazon').checked;
    const showEstado = document.getElementById('ccShowEstado').checked;
    const showOperador = document.getElementById('ccShowOperador').checked;
    const showFecha = document.getElementById('ccShowFecha').checked;

    // Construir tabla
    let headers = ["IMEI"];
    if (showModelo) headers.push("Modelo");
    if (showRazon) headers.push("Razón");
    if (showEstado) headers.push("Estado");
    if (showOperador) headers.push("Operador");
    if (showFecha) headers.push("Fecha");

    let lines = [];
    lines.push(`CUENTA DE COBRO - CLIENTE: ${clienteSel.toUpperCase()}`);
    lines.push(`Fecha de generación: ${new Date().toLocaleDateString()}`);
    lines.push(`Total trabajos pendientes: ${unpaidWorks.length}`);
    lines.push("");
    lines.push(headers.join("\t"));

    unpaidWorksFinal.forEach(w => {
        let row = [w.imei];
        if (showModelo) row.push(w.modelo || 'N/A');
        if (showRazon) row.push(w.razon || 'N/A');
        if (showEstado) row.push(w.estado || 'N/A');
        if (showOperador) row.push(w.operador || 'N/A');
        if (showFecha) {
            const fechaStr = w.ingreso ? new Date(w.ingreso).toLocaleDateString() : 'N/A';
            row.push(fechaStr);
        }
        lines.push(row.join('\t'));
    });

    txtbox.value = lines.join('\n');
}

function parseTextToHtmlTable(textVal) {
    const lines = textVal.split('\n');
    let htmlResult = '<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">';
    let inTable = false;
    let tableHtml = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #e2e8f0; font-size: 13px; margin-top: 10px;">';

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
            if (inTable) {
                tableHtml += '</tbody></table>';
                htmlResult += tableHtml;
                tableHtml = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #e2e8f0; font-size: 13px; margin-top: 10px;">';
                inTable = false;
            }
            htmlResult += '<br/>';
            return;
        }

        if (line.includes('\t')) {
            const cells = line.split('\t');
            if (!inTable) {
                inTable = true;
                tableHtml += '<thead><tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">';
                cells.forEach(cell => {
                    tableHtml += `<th style="border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; font-weight: bold; color: #1e293b;">${cell}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';
            } else {
                tableHtml += '<tr style="border-bottom: 1px solid #e2e8f0;">';
                cells.forEach(cell => {
                    tableHtml += `<td style="border: 1px solid #e2e8f0; padding: 8px 12px; color: #334155;">${cell}</td>`;
                });
                tableHtml += '</tr>';
            }
        } else {
            if (inTable) {
                tableHtml += '</tbody></table>';
                htmlResult += tableHtml;
                tableHtml = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #e2e8f0; font-size: 13px; margin-top: 10px;">';
                inTable = false;
            }
            if (trimmed.startsWith("CUENTA DE COBRO") || trimmed.startsWith("Total trabajos") || trimmed.startsWith("Fecha de")) {
                htmlResult += `<div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #0f172a;">${trimmed}</div>`;
            } else {
                htmlResult += `<div style="font-size: 12px; color: #475569;">${trimmed}</div>`;
            }
        }
    });

    if (inTable) {
        tableHtml += '</tbody></table>';
        htmlResult += tableHtml;
    }

    htmlResult += '</div>';
    return htmlResult;
}

async function copiarCuentaCobro() {
    const txtbox = document.getElementById('ccTextbox');
    if (!txtbox || !txtbox.value || txtbox.value.startsWith("Selecciona un cliente") || txtbox.value.startsWith("No hay trabajos")) {
        showToast("No hay información válida para copiar", "warning");
        return;
    }

    const plainText = txtbox.value;
    const htmlText = parseTextToHtmlTable(plainText);

    try {
        if (typeof ClipboardItem !== "undefined") {
            const textBlob = new Blob([plainText], { type: 'text/plain' });
            const htmlBlob = new Blob([htmlText], { type: 'text/html' });
            const item = new ClipboardItem({
                'text/plain': textBlob,
                'text/html': htmlBlob
            });
            await navigator.clipboard.write([item]);
            showToast("Tabla copiada al portapapeles (Formato enriquecido)", "success");
        } else {
            await navigator.clipboard.writeText(plainText);
            showToast("Copiado como texto plano (Navegador antiguo)", "warning");
        }
    } catch (err) {
        console.error("Error al copiar al portapapeles:", err);
        try {
            await navigator.clipboard.writeText(plainText);
            showToast("Copiado como texto plano", "info");
        } catch (e2) {
            showToast("Error al copiar", "error");
        }
    }
}

async function liquidarTrabajosClienteCC() {
    const clienteSel = document.getElementById('ccClienteSelect').value;
    if (!clienteSel) return;

    // Trabajos sin pagar en AMBAS tablas
    const unpaidRegistros = registros.filter(r => {
        const isClient = r.cliente && r.cliente.trim().toLowerCase() === clienteSel.trim().toLowerCase();
        const isUnpaid = !r.pago || r.pago.trim() === '' || r.pago.trim().toLowerCase() === 'no';
        return isClient && isUnpaid;
    });
    const unpaidFastreg = datosFastReg.filter(r => {
        const isClient = r.CLIENTE && r.CLIENTE.trim().toLowerCase() === clienteSel.trim().toLowerCase();
        const isUnpaid = !r.PAGO || r.PAGO.trim() === '' || r.PAGO.trim().toLowerCase() === 'no';
        return isClient && isUnpaid;
    });

    const total = unpaidRegistros.length + unpaidFastreg.length;
    if (total === 0) { showToast('No hay trabajos para liquidar', 'warning'); return; }

    if (!confirm(`¿Estás seguro de marcar como PAGADOS los ${total} trabajos pendientes de ${clienteSel}?`)) return;

    showToast(`Liquidando ${total} trabajos...`, 'info');
    let exitos = 0, fallos = 0;

    for (const w of unpaidRegistros) {
        try {
            const res = await window.pywebview.api.actualizar_campo(w.imei, 'pago', 'S\u00ed');
            if (res && res.status === 'success') { const idx = registros.findIndex(r => r.imei === w.imei); if (idx !== -1) registros[idx].pago = 'S\u00ed'; exitos++; } else fallos++;
        } catch(e) { fallos++; }
    }
    for (const r of unpaidFastreg) {
        try {
            const res = await window.pywebview.api.actualizar_campo_fastreg(r.IMEI, 'PAGO', 'S\u00ed');
            if (res && res.status === 'success') { r.PAGO = 'S\u00ed'; exitos++; } else fallos++;
        } catch(e) { fallos++; }
    }

    if (exitos > 0) { showToast(`Se liquidaron ${exitos} trabajos con éxito.`, 'success'); renderizarTabla(); actualizarContenidoTextboxCC(); }
    if (fallos > 0) { showToast(`Hubo error al liquidar ${fallos} trabajos.`, 'error'); }
}
/* ============================================================
   CONTROL DE VISTAS Y TABLA DE REGISTROS (FASTREG)
   ============================================================ */
let isMasivosActivo = false;

async function alternarVistaDashboard() {
    const btnText = document.getElementById('txtBtnToggleView');
    const badge = document.getElementById('subtituloVista');

    if (vistaActual === 'gestor') {
        vistaActual = 'registros';
        btnText.innerText = 'Gestor';
        if (badge) badge.classList.remove('hidden'); // Mostrar badge "Registros"
        await cargarDatosFastReg();
    } else {
        vistaActual = 'gestor';
        btnText.innerText = 'Registros';
        if (badge) badge.classList.add('hidden'); // Ocultar badge
        restaurarTablaPrincipal();
        renderizarTabla();
    }
}

async function cargarDatosFastReg() {
    showToastLoading("Cargando base de datos...");

    // Cambiar cabeceras al modelo FastReg
    const theadTr = document.querySelector('thead tr');
    if (theadTr) {
        theadTr.innerHTML = `
            <th style="width: 25px; text-align: center;"></th>
            <th>IMEI</th>
            <th>Modelo</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Línea</th>
            <th>Encargado</th>
            <th>Ingreso</th>
            <th>Operador</th>
            <th>
                <div class="flex items-center gap-1">
                    <span>Pago</span>
                    <button onclick="abrirCuentaCobroModal()" class="hover:text-cyan-400 transition" title="Cuenta de Cobro" style="background:none;border:none;cursor:pointer;padding:2px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg></button>
                </div>
            </th>
            <th class="text-center" style="width: 100px;">Opciones</th>
        `;
    }

    try {
        const res = await window.pywebview.api.obtener_fastreg();
        hideToastLoading();
        if (res.status === 'success') {
            datosFastReg = res.data || [];
            renderizarTablaFastReg();
        } else {
            showToast("Error leyendo BD", "error");
            datosFastReg = [];
            renderizarTablaFastReg();
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de conexión con Supabase", "error");
        datosFastReg = [];
        renderizarTablaFastReg();
    }
}

function toggleGrupoFastReg(grupoId, btnEl) {
    const subRows = document.querySelectorAll(`tr[data-grupo-id="${grupoId}"]`);
    const isHidden = subRows.length > 0 && subRows[0].classList.contains('hidden');

    if (isHidden) {
        // Reveal: slide-in with stagger
        subRows.forEach((r, i) => {
            r.classList.remove('hidden');
            r.classList.add('ios-subrow-animating');
            r.style.animationDelay = `${i * 45}ms`;
            r.addEventListener('animationend', () => {
                r.classList.remove('ios-subrow-animating');
                r.style.animationDelay = '';
            }, { once: true });
        });
    } else {
        subRows.forEach(r => r.classList.add('hidden'));
    }

    // Actualizar indicador visual del botón
    if (btnEl) {
        // Si es el nuevo diseño (botón circular): rotar con CSS
        if (btnEl.classList.contains('group-arrow-btn')) {
            btnEl.style.transform = isHidden ? 'scale(1.3)' : '';
            btnEl.style.background = isHidden
                ? 'rgba(99,179,237,0.9)'
                : 'rgba(99,179,237,0.7)';
        } else {
            // Fallback para diseño anterior con texto
            btnEl.textContent = isHidden ? '▼' : '▶';
        }
    }
}

window.toggleGrupoFastReg = toggleGrupoFastReg;

async function eliminarGrupoFastReg(grupoId, imeis) {
    if (confirm(`¿Enviar todo el lote masivo (${imeis.length} registros) a la papelera?`)) {
        showToastLoading("Borrando lote masivo...");
        let errs = 0;
        for (const imei of imeis) {
            const res = await window.pywebview.api.eliminar_fastreg(imei);
            if (res.status !== 'success') errs++;
        }
        hideToastLoading();
        if (errs === 0) {
            showToast("Lote movido a papelera", "trash");
        } else {
            showToast("Algunos registros no se pudieron borrar", "warning");
        }
        await cargarDatosFastReg();
    }
}
window.eliminarGrupoFastReg = eliminarGrupoFastReg;

function renderizarTablaFastReg(filtrados) {
    const tbody = document.getElementById("tableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const items = Array.isArray(filtrados) ? filtrados : datosFastReg;

    // Estado de Tabla Vacía
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-16 opacity-50">
                    <div class="flex flex-col items-center justify-center">
                        <svg class="w-12 h-12 mb-3 text-cyan-400 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span class="text-xs font-bold uppercase tracking-widest text-cyan-100">La tabla está limpia</span>
                        <span class="text-[10px] mt-1 opacity-60">Aún no hay registros en la base de datos</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const tema = document.documentElement.getAttribute('data-theme') || 'dark';

    // Agrupar ítems por grupo_id o extracción desde RAZÓN
    const grupos = {};
    items.forEach((reg) => {
        let gId = reg.grupo_id;
        if (!gId && reg.RAZÓN) {
            const match = reg.RAZÓN.match(/\[(MASIVO_[^\]]+)\]/);
            if (match) gId = match[1];
        }

        if (gId) {
            if (!grupos[gId]) grupos[gId] = [];
            grupos[gId].push(reg);
        }
    });

    const ordenProcesado = [];
    const gruposAgregados = new Set();

    items.forEach((reg) => {
        let gId = reg.grupo_id;
        if (!gId && reg.RAZÓN) {
            const match = reg.RAZÓN.match(/\[(MASIVO_[^\]]+)\]/);
            if (match) gId = match[1];
        }

        if (gId && grupos[gId]) {
            if (!gruposAgregados.has(gId)) {
                gruposAgregados.add(gId);
                ordenProcesado.push({ tipo: 'grupo', id: gId, items: grupos[gId] });
            }
        } else {
            ordenProcesado.push({ tipo: 'individual', reg: reg });
        }
    });

    const renderFilaIndividual = (reg, isSubrow = false, gId = null) => {
        const tr = document.createElement("tr");
        const ledClass = (reg.ESTADO && reg.ESTADO.toLowerCase() === 'registrado') ? 'neon-verde' : 'neon-rojo';
        tr.classList.add(ledClass);
        if (isSubrow) {
            tr.classList.add('hidden', 'bg-cyan-500/5', 'border-l-2', 'border-cyan-500/40');
            tr.setAttribute('data-grupo-id', gId);
        }

        const dateVal = reg.INGRESO || reg.ingreso;
        const dateText = dateVal ? timeAgo(dateVal) : 'N/A';
        const dateLabel = dateVal ? new Date(dateVal).toLocaleDateString() : 'N/A';

        let opStr = (reg.OPERADOR || "").toLowerCase();
        let opColor = opStr.includes("wom") ? "#b026ff" :
            opStr.includes("etb") ? "#00b4cc" :
                opStr.includes("claro") ? "#ef4444" :
                    opStr.includes("tigo") ? "#1d4ed8" :
                        opStr.includes("movistar") ? "#16a34a" : "";
        let operadorHTML = opColor ? (
            tema === 'light'
                ? `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:${opColor}18;color:${opColor};border:1px solid ${opColor}55;">${reg.OPERADOR}</span>`
                : `<span style="color:#fff;font-weight:700;text-shadow:0 0 5px ${opColor},0 0 10px ${opColor};">${reg.OPERADOR}</span>`
        ) : `<span style="color:var(--color)">${reg.OPERADOR || ''}</span>`;

        const encName = reg.ENCARGADO || reg.encargado || '';
        const encFirstName = encName.split(' ')[0];
        let encargadoHTML;
        if (Array.isArray(window.todosLosEncargados)) {
            const encObj = window.todosLosEncargados.find(e => e.nombre === encName);
            if (encObj && encObj.color) {
                const ec = encObj.color;
                encargadoHTML = tema === 'light'
                    ? `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:${ec}22;color:${ec};border:1px solid ${ec}66;">${encFirstName}</span>`
                    : `<span style="color:#fff;font-weight:700;text-shadow:0 0 5px ${ec},0 0 10px ${ec};">${encFirstName}</span>`;
            } else {
                encargadoHTML = `<span style="color:var(--color)">${encFirstName || 'N/A'}</span>`;
            }
        } else {
            encargadoHTML = `<span style="color:var(--color)">${encFirstName || 'N/A'}</span>`;
        }

        const estadoHTML = reg.ESTADO
            ? `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:rgba(var(--hover-acc-rgb),0.10);color:var(--color-sec);border:1px solid rgba(var(--hover-acc-rgb),0.18);">${reg.ESTADO}</span>`
            : '';

        const imei = reg.IMEI || '';
        const modelo = reg.MODELO || '';
        const cliente = reg.CLIENTE || 'Anónimo';
        const linea = reg.LÍNEA || '';

        const indentHtml = isSubrow ? '<span class="text-cyan-400 font-bold mr-1">└─</span>' : '';

        tr.innerHTML = `
            <td style="width:10px;padding:0 0 0 6px;" class="relative"><div class="neon-indicator"></div></td>
            <td style="font-family:'SF Mono','Fira Code','Courier New',monospace;font-size:12.5px;letter-spacing:0.04em;color:var(--color-sec);font-weight:600;font-variant-numeric:tabular-nums;cursor:pointer;" class="select-all imei-copy-cell" onclick="event.stopPropagation(); navigator.clipboard.writeText('${imei}').then(()=>showToast('IMEI copiado','copy'));" title="Copiar IMEI">${indentHtml}${imei}</td>
            <td style="color:var(--color);font-weight:600;font-size:13.5px;cursor:pointer;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${modelo}').then(()=>showToast('Modelo copiado','copy'));" title="Copiar Modelo">${modelo}</td>
            <td style="color:var(--color-sec);opacity:0.85;font-size:13px;cursor:pointer;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${cliente}').then(()=>showToast('Cliente copiado','copy'));" title="Copiar Cliente">${cliente}</td>
            <td style="cursor:pointer;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${reg.ESTADO || ''}').then(()=>showToast('Estado copiado','copy'));" title="Copiar Estado">${estadoHTML}</td>
            <td style="font-family:'SF Mono','Fira Code','Courier New',monospace;font-size:12px;color:var(--color-sec);cursor:pointer;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${linea}').then(()=>showToast('Línea copiada','copy'));" title="Copiar Línea">${linea}</td>
            <td style="cursor:pointer;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${encName}').then(()=>showToast('Encargado copiado','copy'));" title="Copiar Encargado">${encargadoHTML}</td>
            <td style="color:var(--color-sec);font-size:12px;font-weight:650;opacity:0.95;">${dateText}</td>
            <td style="font-weight:700;cursor:pointer;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${reg.OPERADOR || ''}').then(()=>showToast('Operador copiado','copy'));" title="Copiar Operador">${operadorHTML}</td>
            <td style="color:var(--color-sec);font-size:12px;font-weight:650;opacity:0.95;">
                <button onclick="event.stopPropagation(); toggleEstadoPagoFastReg('${imei}', '${reg.PAGO || 'No'}', this)"
                    class="pago-toggle-btn ${(reg.PAGO === 'S\u00ed') ? 'pago-si' : 'pago-no'}"
                    title="${(reg.PAGO === 'S\u00ed') ? 'Marcado como Pagado' : 'Sin Pago'}">
                    ${(reg.PAGO === 'S\u00ed') ? '\u2713 S\u00ed' : '\u00d7 No'}
                </button>
            </td>
            <td class="text-center">
                <div class="flex justify-center gap-2">
                    <button class="btn-icon" onclick="eliminarRegistroFastReg('${imei}')" title="Mover a Papelera" style="border-color:rgba(239,68,68,0.2); color:#f87171;">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </td>
        `;
        return tr;
    };

    ordenProcesado.forEach(bloque => {
        if (bloque.tipo === 'individual') {
            tbody.appendChild(renderFilaIndividual(bloque.reg));
        } else if (bloque.tipo === 'grupo') {
            const subItems = bloque.items;
            const primerReg = subItems[0];
            const gId = bloque.id;

            const dateVal = primerReg.INGRESO || primerReg.ingreso;
            const dateText = dateVal ? timeAgo(dateVal) : 'N/A';
            const dateLabel = dateVal ? new Date(dateVal).toLocaleDateString('es-CO') : 'N/A';
            const clienteStr = primerReg.CLIENTE || 'Anónimo';

            // Conteo exitosos/fallidos por estado
            const exitosos = subItems.filter(s => {
                const est = (s.ESTADO || '').toLowerCase();
                return est.includes('registrado') || est.includes('éxito') || est.includes('exitoso') || est.includes('ok');
            }).length;
            const fallidos = subItems.length - exitosos;

            // Operadores únicos → pastillas de color
            const operadoresUnicos = [...new Set(subItems.map(s => (s.OPERADOR || '').trim()).filter(Boolean))];
            const opColorMap = (op) => {
                const o = op.toLowerCase();
                if (o.includes('wom'))     return { bg: 'rgba(176,38,255,0.12)', color: '#c084fc', border: 'rgba(176,38,255,0.3)' };
                if (o.includes('etb'))     return { bg: 'rgba(0,180,200,0.12)',  color: '#22d3ee', border: 'rgba(0,180,200,0.3)' };
                if (o.includes('claro'))   return { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' };
                if (o.includes('tigo'))    return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' };
                if (o.includes('movistar'))return { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)' };
                return { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' };
            };
            const opPills = operadoresUnicos.map(op => {
                const c = opColorMap(op);
                return `<span style="font-size:9.5px;font-weight:700;padding:1px 7px;border-radius:9999px;background:${c.bg};color:${c.color};border:1px solid ${c.border};white-space:nowrap;">${op.toUpperCase()}</span>`;
            }).join('');

            const imeisGrupo = subItems.map(s => s.IMEI);
            // Estado de pago del lote (todos pagados = Sí, sino No)
            const todosLotePagados = subItems.every(s => s.PAGO === 'Sí');
            const pagoLoteClass = todosLotePagados ? 'pago-si' : 'pago-no';
            const pagoLoteText = todosLotePagados ? '✓ Todo Pagado' : '× Marcar Pagado';

            const trStack = document.createElement('tr');
            trStack.className = 'lote-header-tr';
            trStack.setAttribute('data-grupo-wrapper', gId);

            // Crear celdas individuales para que la info quede alineada con las columnas
            // Columnas: neon | IMEI | Modelo | Cliente | Estado | Línea | Encargado | Ingreso | Operador | Pago | Acciones
            trStack.innerHTML = `
                <td style="width:10px;padding:0 0 0 6px;" class="relative">
                    <button type="button" class="group-arrow-btn neon-indicator" onclick="toggleGrupoFastReg('${gId}', this)"
                        style="width:8px;height:8px;border-radius:50%;background:rgba(99,179,237,0.7);box-shadow:0 0 6px rgba(99,179,237,0.6);cursor:pointer;border:none;padding:0;display:block;"
                        title="Desplegar lote">
                    </button>
                </td>
                <td style="font-size:11px;font-weight:700;color:rgba(99,179,237,0.9);letter-spacing:0.06em;cursor:pointer;" onclick="toggleGrupoFastReg('${gId}', this.closest('tr').querySelector('.group-arrow-btn'))">
                    LOTE <span style="opacity:0.65;font-weight:600;">#${subItems.length}</span>
                </td>
                <td style="cursor:pointer;" onclick="toggleGrupoFastReg('${gId}', this.closest('tr').querySelector('.group-arrow-btn'))">
                    <span style="font-size:10px;color:rgba(74,222,128,0.85);font-weight:700;">✓ ${exitosos}</span>
                    ${fallidos > 0 ? `<span style="font-size:10px;color:rgba(248,113,113,0.85);font-weight:700;margin-left:5px;">✗ ${fallidos}</span>` : ''}
                </td>
                <td style="font-size:12px;color:rgba(255,255,255,0.55);cursor:pointer;" onclick="toggleGrupoFastReg('${gId}', this.closest('tr').querySelector('.group-arrow-btn'))">${clienteStr}</td>
                <td style="cursor:pointer;" onclick="toggleGrupoFastReg('${gId}', this.closest('tr').querySelector('.group-arrow-btn'))">
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">${opPills}</div>
                </td>
                <td colspan="3" style="font-size:10px;color:rgba(255,255,255,0.3);cursor:pointer;" onclick="toggleGrupoFastReg('${gId}', this.closest('tr').querySelector('.group-arrow-btn'))">
                    ${dateText} · <span style="font-variant-numeric:tabular-nums;">${dateLabel}</span>
                </td>
                <td></td>
                <td onclick="event.stopPropagation();">
                    <button class="pago-toggle-btn ${pagoLoteClass}" onclick="togglePagoLote('${gId}', this)" title="Pago del lote completo" style="font-size:9.5px;padding:1px 8px;">
                        ${pagoLoteText}
                    </button>
                </td>
                <td onclick="event.stopPropagation();">
                    <button class="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-red-400/30 hover:text-red-400/70 transition-all"
                        onclick="eliminarGrupoFastReg('${gId}', ${JSON.stringify(imeisGrupo).replace(/"/g, '&quot;')})" title="Mover lote a Papelera">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </td>
            `;

            tbody.appendChild(trStack);


            subItems.forEach(sReg => {
                const subTr = renderFilaIndividual(sReg, true, gId);
                subTr.classList.add('ios-subrow');
                tbody.appendChild(subTr);
            });
        }
    });
}

function restaurarTablaPrincipal() {
    const theadTr = document.querySelector('thead tr');
    if (theadTr) {
        theadTr.innerHTML = `
            <th style="width: 25px; text-align: center;"></th>
            <th>IMEI</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Operador</th>
            <th>Cliente</th>
            <th>Razón</th>
            <th>Encargado</th>
            <th>
                <div class="flex items-center gap-1">
                    <span>Pago</span>
                    <button onclick="abrirCuentaCobroModal()" class="hover:text-cyan-400 transition" title="Cuenta de Cobro" style="background:none; border:none; cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg></button>
                </div>
            </th>
            <th>Ingreso</th>
            <th class="text-center" style="width: 100px;">Opciones</th>
        `;
    }
}

/* ── Toggle Pago — tabla principal Registros ── */
async function toggleEstadoPago(imei, _estadoLegacy, btn) {
    // Leer estado REAL desde la clase CSS (no del atributo onclick que queda stale)
    const esSi = btn && btn.classList.contains('pago-si');
    const nuevoEstado = esSi ? 'No' : 'S\u00ed';
    if (btn) { btn.disabled = true; btn.textContent = '...'; }
    try {
        const res = await window.pywebview.api.actualizar_campo(imei, 'pago', nuevoEstado);
        if (res && res.status === 'success') {
            const reg = registros.find(r => String(r.imei) === String(imei));
            if (reg) reg.pago = nuevoEstado;
            if (btn) {
                btn.className = `pago-toggle-btn ${nuevoEstado === 'S\u00ed' ? 'pago-si' : 'pago-no'}`;
                btn.textContent = nuevoEstado === 'S\u00ed' ? '\u2713 S\u00ed' : '\u00d7 No';
                btn.disabled = false;
            }
        } else {
            showToast('Error actualizando Pago', 'error');
            if (btn) { btn.textContent = esSi ? '\u2713 S\u00ed' : '\u00d7 No'; btn.disabled = false; }
        }
    } catch(e) {
        showToast('Error de conexi\u00f3n', 'error');
        if (btn) { btn.textContent = esSi ? '\u2713 S\u00ed' : '\u00d7 No'; btn.disabled = false; }
    }
}
window.toggleEstadoPago = toggleEstadoPago;

/* ── Toggle Pago — tabla FastReg (Registros) ── */
async function toggleEstadoPagoFastReg(imei, _estadoLegacy, btn) {
    const esSi = btn && btn.classList.contains('pago-si');
    const nuevoEstado = esSi ? 'No' : 'S\u00ed';
    if (btn) { btn.disabled = true; btn.textContent = '...'; }
    try {
        const res = await window.pywebview.api.actualizar_campo_fastreg(imei, 'PAGO', nuevoEstado);
        if (res && res.status === 'success') {
            const reg = datosFastReg.find(r => String(r.IMEI) === String(imei));
            if (reg) reg.PAGO = nuevoEstado;
            if (btn) {
                btn.className = `pago-toggle-btn ${nuevoEstado === 'S\u00ed' ? 'pago-si' : 'pago-no'}`;
                btn.textContent = nuevoEstado === 'S\u00ed' ? '\u2713 S\u00ed' : '\u00d7 No';
                btn.disabled = false;
            }
        } else {
            showToast('Error actualizando Pago', 'error');
            if (btn) { btn.textContent = esSi ? '\u2713 S\u00ed' : '\u00d7 No'; btn.disabled = false; }
        }
    } catch(e) {
        showToast('Error de conexi\u00f3n', 'error');
        if (btn) { btn.textContent = esSi ? '\u2713 S\u00ed' : '\u00d7 No'; btn.disabled = false; }
    }
}
window.toggleEstadoPagoFastReg = toggleEstadoPagoFastReg;

/* ── Toggle Pago de TODOS los registros de un lote ── */
async function togglePagoLote(grupoId, btn) {
    const regLote = datosFastReg.filter(r => {
        let gId = r.grupo_id;
        if (!gId && r.RAZ\u00d3N) { const m = r.RAZ\u00d3N.match(/\[(MASIVO_[^\]]+)\]/); if (m) gId = m[1]; }
        return gId === grupoId;
    });
    if (!regLote.length) return;
    const todosYaSi = regLote.every(r => r.PAGO === 'S\u00ed');
    const nuevoEstado = todosYaSi ? 'No' : 'S\u00ed';
    if (btn) { btn.disabled = true; btn.textContent = '...'; }
    let ok = 0;
    for (const r of regLote) {
        try {
            const res = await window.pywebview.api.actualizar_campo_fastreg(r.IMEI, 'PAGO', nuevoEstado);
            if (res && res.status === 'success') { r.PAGO = nuevoEstado; ok++; }
        } catch(e) {}
    }
    showToast(`Pago de lote: ${ok}/${regLote.length} actualizados a "${nuevoEstado}"`, ok === regLote.length ? 'success' : 'warning');
    if (btn) {
        btn.disabled = false;
        btn.className = `pago-toggle-btn ${nuevoEstado === 'S\u00ed' ? 'pago-si' : 'pago-no'}`;
        btn.textContent = nuevoEstado === 'S\u00ed' ? '\u2713 Todo Pagado' : '\u00d7 Marcar No Pagado';
    }
    // Actualizar sub-filas visibles
    document.querySelectorAll(`tr[data-grupo-id="${grupoId}"] .pago-toggle-btn`).forEach(b => {
        b.className = `pago-toggle-btn ${nuevoEstado === 'S\u00ed' ? 'pago-si' : 'pago-no'}`;
        b.textContent = nuevoEstado === 'S\u00ed' ? '\u2713 S\u00ed' : '\u00d7 No';
    });
}
window.togglePagoLote = togglePagoLote;

async function eliminarRegistroFastReg(imei) {
    if (confirm("¿Enviar este registro a la papelera?")) {
        showToastLoading("Borrando...");
        const res = await window.pywebview.api.eliminar_fastreg(imei);
        hideToastLoading();
        if (res.status === 'success') {
            showToast("Movido a papelera", "trash");
            await cargarDatosFastReg(); // Recargar
        } else {
            showToast("Error: " + res.mensaje, "error");
        }
    }
}

/* ============================================================
   LÓGICA DEL MODAL DE REGISTRO RÁPIDO
   ============================================================ */
function rrEjecutarAccion() {
    if (typeof window.rrEjecutarAccion === 'function' && window.rrEjecutarAccion !== rrEjecutarAccion) {
        return window.rrEjecutarAccion();
    }
}

/* ============================================================
   ANIMACIÓN DEL TÍTULO DE REGISTROS (Al renderizar tabla)
   ============================================================ */
// Busca tu función renderizarTabla() y pega esto justo al principio de la función:
const lRegistros = document.getElementById('loaderRegistros');
const lineRegistros = document.getElementById('lineLoaderRegistros');
if (lRegistros) lRegistros.classList.remove('hidden');
if (lineRegistros) {
    lineRegistros.style.width = '100%';
    lineRegistros.style.opacity = '1';
}

// Y pega esto al final de renderizarTabla() (después de las animaciones FLIP):
setTimeout(() => {
    if (lRegistros) lRegistros.classList.add('hidden');
    if (lineRegistros) {
        lineRegistros.style.opacity = '0';
        setTimeout(() => { lineRegistros.style.width = '0%'; }, 300);
    }
}, 600);


/* ============================================================
   LÓGICA DEL REGISTRO RÁPIDO (Slider, Líneas y Bots)
   ============================================================ */
window.rrLineaSeleccionada = null;
window.rrOperadorSeleccionado = null;

// Lógica de las pestañas delegada a registroRapido.js

// Lógica para abrir el selector filtrando SOLO PERMANENTES
async function rrAbrirSelectorLineas() {
    showToastLoading('Cargando líneas permanentes...');
    const res = await window.pywebview.api.obtener_lineas();
    hideToastLoading();

    if (res.status === 'success' && res.lineas) {
        // Filtrar estricto: Solo Permanentes
        const permanentes = res.lineas.filter(l => (l.estado || l.tipo || '').toLowerCase() === 'permanente');
        window.rrLineasPermanentes = permanentes; // Guardar globalmente
        const container = document.getElementById('rrLineaContainer');
        container.innerHTML = '';

        if (permanentes.length === 0) {
            container.innerHTML = '<p class="text-xs opacity-50 text-center py-6">No hay líneas permanentes en la base de datos.</p>';
        } else {
            permanentes.forEach(l => {
                const isWom = (l.operador || '').toUpperCase() === 'WOM';
                const opColor = isWom ? '#b026ff' : '#00b4cc';

                const btn = document.createElement('button');
                btn.className = "w-full p-4 rounded-2xl border flex justify-between items-center transition-all hover:scale-[1.02] mb-3 shadow-sm";
                btn.style.cssText = `background:var(--card-inner); border-color:${opColor}40;`;
                btn.onclick = () => seleccionarLineaRR(l.numero, l.operador);

                const lastUseStr = l.las_use ? timeAgo(l.las_use) : 'nunca usado';

                btn.innerHTML = `
                    <div class="flex flex-col items-start">
                        <span class="font-mono font-bold text-lg tracking-widest" style="color:var(--color)">${l.numero}</span>
                        <span class="text-[10.5px] opacity-45" style="font-weight: 500;">Uso: ${lastUseStr}</span>
                    </div>
                    <span class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md" style="color:${opColor}; background:${opColor}15; border:1px solid ${opColor}40">${l.operador}</span>
                `;
                container.appendChild(btn);
            });
        }
        document.getElementById('rrLineaSelectorOverlay').classList.add('active');
    } else {
        showToast('Error al cargar líneas', 'error');
    }
}

function seleccionarLineaRR(numero, operador) {
    window.rrLineaSeleccionada = numero;
    window.rrOperadorSeleccionado = (operador || '').toUpperCase();

    // Actualizar UI del Modal
    const textEl = document.getElementById('rrLineaText');
    textEl.innerText = numero;
    textEl.classList.remove('opacity-40');
    textEl.classList.add('text-white');

    const badge = document.getElementById('rrLineaOpBadge');
    badge.innerText = window.rrOperadorSeleccionado;
    badge.classList.remove('hidden');

    const isWom = window.rrOperadorSeleccionado === 'WOM';
    const color = isWom ? '#c084fc' : '#67e8f9';
    const bg = isWom ? 'rgba(176,38,255,0.15)' : 'rgba(0,243,255,0.15)';
    const border = isWom ? 'rgba(176,38,255,0.4)' : 'rgba(0,243,255,0.4)';
    const contBorder = isWom ? 'rgba(176,38,255,0.2)' : 'rgba(0,243,255,0.2)';

    badge.style.color = color;
    badge.style.background = bg;
    badge.style.border = `1px solid ${border}`;

    document.getElementById('rrLineaContenedor').style.borderColor = contBorder;
    document.getElementById('rrLineaDot').style.background = isWom ? '#b026ff' : '#00f3ff';
    document.getElementById('rrLineaDot').style.boxShadow = `0 0 10px ${isWom ? '#b026ff' : '#00f3ff'}`;

    // Mostrar/Ocultar botones inteligentemente
    document.getElementById('btnRrWom').classList.toggle('hidden', !isWom);
    document.getElementById('btnRrEtb').classList.toggle('hidden', isWom);
    document.getElementById('btnRrSubirGen').classList.add('hidden'); // Ocultar el genérico

    // Manejar lógica específica de WOM
    const inputNombre = document.getElementById('rrNombre');
    const inputCedula = document.getElementById('rrCedula');
    const inputCiudad = document.getElementById('rrCiudad');
    const inputCorreo = document.getElementById('rrCorreo');
    const inputLineaUsuario = document.getElementById('rrLineaUsuario');
    const botonesCliente = document.getElementById('rrBotonesCliente');
    const btnLimpiar = document.getElementById('btnRrLimpiarCliente');

    if (isWom) {
        // Buscar el encargado de esta línea
        const lineObj = (window.rrLineasPermanentes || []).find(l => l.numero === numero);
        const encargadoName = lineObj ? lineObj.encargado : '';
        const encargadoObj = (window.todosLosEncargados || []).find(e => e.nombre === encargadoName);

        if (encargadoObj) {
            if (inputNombre) { inputNombre.readOnly = false; }
            if (inputCedula) { inputCedula.value = encargadoObj.identificacion || ''; inputCedula.readOnly = true; }
            if (inputCiudad) { inputCiudad.value = encargadoObj.lugar_expedicion || ''; inputCiudad.readOnly = true; }
            if (inputCorreo) { inputCorreo.value = encargadoObj.correo || ''; inputCorreo.readOnly = true; }
            if (inputLineaUsuario) { inputLineaUsuario.readOnly = false; }
            if (botonesCliente) botonesCliente.classList.remove('hidden');
            if (btnLimpiar) btnLimpiar.classList.remove('hidden');
        } else {
            // No se encontró encargado
            if (inputNombre) { inputNombre.readOnly = false; }
            if (inputCedula) { inputCedula.value = ''; inputCedula.readOnly = true; }
            if (inputCiudad) { inputCiudad.value = ''; inputCiudad.readOnly = true; }
            if (inputCorreo) { inputCorreo.value = ''; inputCorreo.readOnly = true; }
            if (inputLineaUsuario) { inputLineaUsuario.readOnly = false; }
            if (botonesCliente) botonesCliente.classList.remove('hidden');
            if (btnLimpiar) btnLimpiar.classList.remove('hidden');
        }
    } else {
        // Habilitar campos y permitir edición
        if (inputNombre) { inputNombre.readOnly = false; }
        if (inputCedula) { inputCedula.readOnly = false; }
        if (inputCiudad) { inputCiudad.readOnly = false; }
        if (inputCorreo) { inputCorreo.readOnly = false; }
        if (inputLineaUsuario) { inputLineaUsuario.readOnly = false; }
        if (botonesCliente) botonesCliente.classList.remove('hidden');
        if (btnLimpiar) btnLimpiar.classList.remove('hidden');
    }

    cerrarRRSelectorLineas();
}

async function ejecutarBotRegistroRapido(operadorReq) {
    if (!window.rrLineaSeleccionada || window.rrOperadorSeleccionado !== operadorReq) {
        return showToast(`Selecciona una línea de ${operadorReq} para continuar`, 'warning');
    }
    return rrEjecutarAccion();
}

// ==========================================
// CONTROL DEL MODAL DE REGISTRO RÁPIDO
// ==========================================
function abrirRegistroRapido() {
    const overlay = document.getElementById('rrOverlay');
    if (overlay) overlay.classList.add('active');
}

function cerrarRegistroRapido() {
    const overlay = document.getElementById('rrOverlay');
    if (overlay) overlay.classList.remove('active');
}

// ==========================================
// TOGGLE: REGISTROS <-> MÓDULO GESTOR
// ==========================================

function alternarVistaDashboard() {
    const btnText = document.getElementById('txtBtnToggleView');
    const btn = document.getElementById('btnToggleView');
    const txtIndicador = document.getElementById('txtModuloIndicador');
    const searchInput = document.getElementById('globalSearch');
    const tableWrapper = document.querySelector('.table-wrapper, [id*="tableContainer"], #tableBody')?.closest('section, .section, div[class*="overflow"], div[class*="table"]') || document.getElementById('tableBody')?.parentElement;

    // Apply transition animation to the table area
    const applyTableTransition = () => {
        if (tableWrapper) {
            tableWrapper.classList.remove('table-module-transition');
            void tableWrapper.offsetWidth; // force reflow
            tableWrapper.classList.add('table-module-transition');
            tableWrapper.addEventListener('animationend', () => tableWrapper.classList.remove('table-module-transition'), { once: true });
        }
    };

    if (vistaActual === 'gestor') {
        vistaActual = 'registros';

        if (btnText) btnText.innerText = 'Gestor';
        if (btn) {
            btn.className = "btn-liquid purple whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-purple-500/30 ml-2";
            btn.style.color = "#c084fc";
            btn.style.boxShadow = "0 0 15px rgba(176,38,255,0.2)";
        }
        if (txtIndicador) {
            txtIndicador.innerText = 'Registros';
            txtIndicador.style.color = '#22d3ee';
        }
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = 'Buscar IMEI, modelo, estado, operador...';
        }
        applyTableTransition();
        cargarDatosFastReg();
    } else {
        vistaActual = 'gestor';

        if (btnText) btnText.innerText = 'Registros';
        if (btn) {
            btn.className = "btn-liquid cyan whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-cyan-400/30 ml-2";
            btn.style.color = '';
            btn.style.boxShadow = '';
        }
        if (txtIndicador) {
            txtIndicador.innerText = 'Gestor';
            txtIndicador.style.color = '#c084fc';
        }
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = 'Buscar IMEI, modelo, cliente...';
        }
        applyTableTransition();
        actualizarBotonClearSearch();
        restaurarTablaPrincipal();
        renderizarTabla();
    }
}

window.abrirModuloRegistros = abrirModuloRegistros;

// Exponer globalmente
window.abrirRegistroRapido = abrirRegistroRapido;
window.cerrarRegistroRapido = cerrarRegistroRapido;

// Publicar funciones globales necesarias
window.abrirCuentaCobroModal = abrirCuentaCobroModal;
window.cerrarCuentaCobroModal = cerrarCuentaCobroModal;
window.actualizarContenidoTextboxCC = actualizarContenidoTextboxCC;
window.alSeleccionarClienteCC = function () {
    actualizarContenidoTextboxCC();
};
window.copiarCuentaCobro = copiarCuentaCobro;
window.liquidarTrabajosClienteCC = liquidarTrabajosClienteCC;
window.alternarVistaDashboard = alternarVistaDashboard;
window.eliminarRegistroFastReg = eliminarRegistroFastReg;
window.rrEjecutarAccion = rrEjecutarAccion;

/* ==========================================================================
   CENTRO DE NOTIFICACIONES LOGIC
   ========================================================================= */

var listNotificaciones = [];
var seenNotificationIds = new Set();
var isFirstNotificationLoad = true;

// Helper to extract notification field value case-insensitively and with/without accents
function getNotifField(notif, fieldName) {
    if (!notif) return null;
    if (typeof fieldName !== 'string') return null;

    // Normalizar acentos
    const normalize = str => {
        if (typeof str !== 'string') return '';
        return str.normalize ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : str.toLowerCase();
    };
    const targetNormalized = normalize(fieldName);

    for (const key in notif) {
        if (normalize(key) === targetNormalized) {
            return notif[key];
        }
    }
    return null;
}

function formatNotificationText(notif) {
    try {
        const mensajeDirecto = getNotifField(notif, 'mensaje');
        if (mensajeDirecto && typeof mensajeDirecto === 'string' && mensajeDirecto.trim() !== '') {
            return mensajeDirecto.trim();
        }

        const modelVal = getNotifField(notif, 'modelo') || 'Dispositivo';
        const model = modelVal.toString().trim();

        const imeiVal = getNotifField(notif, 'imei');
        const imei = imeiVal !== null && imeiVal !== undefined ? imeiVal.toString().trim() : '';
        const imeiShort = imei ? `[${imei.slice(0, 5)}...${imei.slice(-3)}]` : '';

        const razon = (getNotifField(notif, 'razon') || '').toString().trim();
        const desc = (getNotifField(notif, 'descripcion') || '').toString().trim();

        let baseMsg = "";
        const razonLow = razon.toLowerCase();
        if (razonLow === 'solicitud_registro') {
            baseMsg = `Solicitud de registro: ${model}`;
        } else if (razonLow === 'solicitud' || razonLow.includes('solicitud')) {
            baseMsg = `Nueva solicitud: ${model}${imei ? ' [' + imei + ']' : ''}`;
        } else if (razonLow === 'bloqueo') {
            baseMsg = `${model} ${imeiShort} ha sido bloqueado`;
        } else if (razonLow === 'desbloqueo') {
            baseMsg = `${model} ${imeiShort} ha sido desbloqueado`;
        } else {
            baseMsg = `${model} ${imeiShort} - ${razon || 'Notificación'}`;
        }

        if (desc && desc !== imei && desc !== model) {
            return `${baseMsg} (${desc})`;
        }
        return baseMsg;
    } catch (err) {
        console.error("Error formatting notification text:", notif, err);
        return "Notificación de Dispositivo";
    }
}

async function cargarNotificaciones() {
    console.log("📡 [JS] Iniciando cargarNotificaciones...");
    // Solo cargar si el usuario está autenticado
    if (!currentUser) return;
    if (!window.pywebview || !window.pywebview.api) {
        console.warn("📡 [JS] pywebview o su API no están disponibles todavía.");
        return;
    }
    try {
        console.log("📡 [JS] Llamando a obtener_notificaciones en Python...");
        const res = await window.pywebview.api.obtener_notificaciones();
        console.log("📡 [JS] Respuesta recibida de obtener_notificaciones:", res);

        if (res && res.status === 'success') {
            const rawData = res.data;
            listNotificaciones = Array.isArray(rawData) ? rawData : [];
            console.log(`📡 [JS] Notificaciones asignadas: ${listNotificaciones.length} elementos.`);

            // Detect and trigger real-time toasts for new notifications
            listNotificaciones.forEach(notif => {
                try {
                    const notifId = getNotifField(notif, 'id');
                    const razon = (getNotifField(notif, 'razon') || '').toString().trim().toLowerCase();
                    if (notifId && !seenNotificationIds.has(notifId)) {
                        seenNotificationIds.add(notifId);
                        if (!isFirstNotificationLoad) {
                            showToast(
                                formatNotificationText(notif),
                                razon === 'solicitud' ? 'bell' : (razon === 'desbloqueo' ? 'unlocked' : 'locked')
                            );
                        }
                    }
                } catch (innerErr) {
                    console.error("Error processing single notification on load:", notif, innerErr);
                }
            });

            isFirstNotificationLoad = false;
        } else {
            console.warn("📡 [JS] Error de backend al cargar notificaciones:", res);
        }
    } catch (e) {
        console.error("📡 [JS] Error de comunicación al obtener notificaciones:", e);
    }

    try {
        console.log("📡 [JS] Llamando a renderizarNotificacionesList() y actualizarBadgeNotificaciones()...");
        renderizarNotificacionesList();
        actualizarBadgeNotificaciones();
    } catch (renderErr) {
        console.error("📡 [JS] Excepción al actualizar interfaz de notificaciones:", renderErr);
    }
}

function actualizarBadgeNotificaciones() {
    const badge = document.getElementById('badgeNotificaciones');
    if (!badge) return;
    if (Array.isArray(listNotificaciones) && listNotificaciones.length > 0) {
        badge.classList.remove('hidden');
        badge.classList.add('badge-pulse');
    } else {
        badge.classList.add('hidden');
        badge.classList.remove('badge-pulse');
    }
}

const _ultimasNotifsRecibidas = new Map();

window.recibirNotificacionRealtime = function (notif) {
    console.log("📡 [JS Realtime] Notificación recibida:", notif);
    if (!notif) return;

    if (!Array.isArray(listNotificaciones)) {
        listNotificaciones = [];
    }

    const notifId = getNotifField(notif, 'id');
    const imei = String(getNotifField(notif, 'IMEI') || getNotifField(notif, 'imei') || '').trim();
    const razon = (getNotifField(notif, 'Razon') || getNotifField(notif, 'razon') || getNotifField(notif, 'tipo') || '').toString().trim().toLowerCase();

    // 1. Deduplicación por ID
    if (notifId && (listNotificaciones.some(n => getNotifField(n, 'id') === notifId) || seenNotificationIds.has(notifId))) {
        return;
    }

    // 2. Deduplicación por IMEI + Razón (ventana de 6 segundos)
    const claveDeduplicacion = `${imei}_${razon}`;
    const ahora = Date.now();
    if (imei && _ultimasNotifsRecibidas.has(claveDeduplicacion)) {
        const tiempoPrevio = _ultimasNotifsRecibidas.get(claveDeduplicacion);
        if (ahora - tiempoPrevio < 6000) {
            console.log(`[JS Realtime] Notificación duplicada ignorada para IMEI ${imei} (${razon})`);
            return;
        }
    }
    if (imei) {
        _ultimasNotifsRecibidas.set(claveDeduplicacion, ahora);
    }

    if (notifId) {
        seenNotificationIds.add(notifId);
    }

    listNotificaciones.unshift(notif);

    showToast(
        formatNotificationText(notif),
        razon === 'solicitud' ? 'bell' : (razon === 'desbloqueo' ? 'unlocked' : 'locked')
    );

    try {
        renderizarNotificacionesList();
        actualizarBadgeNotificaciones();
    } catch (renderErr) {
        console.error("Error in realtime notification render:", renderErr);
    }
};

window.actualizarEstadoImeiRealtime = function (imei, nuevoEstado, nuevoOperador) {
    if (!imei) return;
    const targetImei = String(imei).trim();
    const idx = registros.findIndex(r => String(r.imei).trim() === targetImei);
    if (idx !== -1) {
        const oldEstado = registros[idx].estado;
        if (nuevoEstado) registros[idx].estado = nuevoEstado;
        if (nuevoOperador) registros[idx].operador = nuevoOperador;
        
        renderizarTabla();
        
        // Efecto visual en la fila
        const rowEl = encontrarElementoFila(targetImei);
        if (rowEl) {
            rowEl.classList.add("row-success-flash");
            setTimeout(() => rowEl.classList.remove("row-success-flash"), 3000);
        }

        // Si los detalles de este IMEI están abiertos, refrescar
        if (indiceDetallesActual === idx) {
            abrirDetalles(idx);
            if (typeof actualizarWidgetInteligente === 'function') {
                actualizarWidgetInteligente(registros[idx]);
            }
        }
        
        if (typeof procesarCambioEstadoBloqueo === 'function' && nuevoEstado) {
            procesarCambioEstadoBloqueo(registros[idx], oldEstado, nuevoEstado, nuevoOperador || registros[idx].operador, idx);
        }
    }
};

async function probarNotificacion(tipo = 'desbloqueo', imei = '356789012345678', mensaje = '') {
    if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.probar_notificacion === 'function') {
        showToastLoading(`Emitiendo notificación (${tipo})...`);
        try {
            const res = await window.pywebview.api.probar_notificacion(tipo, imei, mensaje);
            hideToastLoading();
            if (res && res.status === 'success') {
                showToast(res.mensaje || 'Notificación emitida', 'success');
            } else {
                showToast('Error: ' + (res?.mensaje || 'No se pudo emitir'), 'error');
            }
        } catch (e) {
            hideToastLoading();
            showToast('Error al llamar API de notificación: ' + e, 'error');
        }
    } else {
        const titulos = {
            desbloqueo: `El IMEI ${imei} ha sido desbloqueado`,
            bloqueo: `El IMEI ${imei} ha sido bloqueado`,
            solicitud: `Nueva solicitud para IMEI ${imei} (Samsung Galaxy S24)`
        };
        const msg = mensaje || titulos[tipo] || `Notificación de prueba: ${tipo}`;
        showToast(msg, tipo === 'desbloqueo' ? 'unlocked' : (tipo === 'bloqueo' ? 'locked' : 'bell'));
    }
}
window.probarNotificacion = probarNotificacion;

function toggleNotificacionesModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('notificacionesModal');
    if (!modal) return;
    const isVisible = modal.style.display === 'flex';
    if (!isVisible) {
        modal.style.display = 'flex';
        cargarNotificaciones();
    } else {
        modal.style.display = 'none';
    }
}
window.toggleNotificacionesModal = toggleNotificacionesModal;

function renderizarNotificacionesList() {
    console.log("📡 [JS] Ejecutando renderizarNotificacionesList...");
    const container = document.getElementById('notificacionesList');
    if (!container) {
        console.warn("📡 [JS] No se encontró el contenedor de la lista de notificaciones.");
        return;
    }

    // Actualizar contador en la cabecera
    const contadorLabel = document.getElementById('notifContadorLabel');
    if (contadorLabel) {
        const total = Array.isArray(listNotificaciones) ? listNotificaciones.length : 0;
        if (total > 0) {
            contadorLabel.textContent = `${total} nueva${total !== 1 ? 's' : ''}`;
            contadorLabel.classList.remove('hidden');
        } else {
            contadorLabel.classList.add('hidden');
        }
    }

    if (!Array.isArray(listNotificaciones) || listNotificaciones.length === 0) {
        console.log("📡 [JS] Lista de notificaciones vacía.");
        container.innerHTML = `
            <div class="notif-empty-state">
                <svg class="w-7 h-7 mb-2 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                Sin notificaciones
            </div>
        `;
        return;
    }

    console.log(`📡 [JS] Renderizando ${listNotificaciones.length} notificaciones...`);
    container.innerHTML = "";

    listNotificaciones.forEach(notif => {
        try {
            const notifId = getNotifField(notif, 'id');
            const wrapper = document.createElement('div');

            const razon = (getNotifField(notif, 'razon') || '').toString().trim().toLowerCase();
            let typeClass = "notif-type-default";
            let iconHtml = "";

            if (razon === 'solicitud_registro') {
                typeClass = "notif-type-registro";
                iconHtml = '<svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>';
            } else if (razon === 'solicitud' || razon.includes('solicitud')) {
                typeClass = "notif-type-solicitud";
                iconHtml = '<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>';
            } else if (razon === 'desbloqueo') {
                typeClass = "notif-type-desbloqueo";
                iconHtml = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>';
            } else if (razon === 'bloqueo') {
                typeClass = "notif-type-bloqueo";
                iconHtml = '<svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>';
            } else {
                iconHtml = '<svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>';
            }

            wrapper.className = `notif-item-wrapper ${typeClass}`;
            wrapper.id = `notif-wrapper-${notifId}`;

            const deleteBg = document.createElement('div');
            deleteBg.className = 'notif-delete-bg';
            deleteBg.innerText = 'Eliminar';
            wrapper.appendChild(deleteBg);

            const content = document.createElement('div');
            content.className = 'notif-item-content';
            content.id = `notif-content-${notifId}`;

            const ingreso = getNotifField(notif, 'ingreso');
            const relativeTime = timeAgo(ingreso);
            const message = formatNotificationText(notif);

            let actionBtnHtml = "";
            if (razon === 'solicitud_registro' && currentUser && currentUser.usuario === 'martinmh0722@gmail.com') {
                actionBtnHtml = `
                    <button onclick="aprobarRegistroClick(event, ${notifId})"
                        class="mt-2.5 w-full py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                        style="outline: none;">
                        Aprobar Registro
                    </button>
                `;
            }

            content.innerHTML = `
                <div class="notif-icon-circle">${iconHtml}</div>
                <div class="flex-1 min-w-0" style="text-align: left;">
                    <p class="text-[11px] text-white/90 leading-tight font-medium" style="word-break: break-word; text-align: left;">${message}</p>
                    <span class="notif-timestamp text-[9px] text-cyan-400/60 mt-0.5 block font-bold" style="text-align: left;" data-timestamp="${ingreso || ''}">${relativeTime}</span>
                    ${actionBtnHtml}
                </div>
            `;

            content.onclick = (e) => {
                if (content.style.transform && content.style.transform !== 'translateX(0px)') return;
                if (razon === 'solicitud_registro') return;

                const imei = getNotifField(notif, 'imei');
                if (imei) {
                    const imeiStr = imei.toString().trim();
                    const idx = registros.findIndex(r => (r.imei || '').toLowerCase() === imeiStr.toLowerCase());
                    if (idx > -1) {
                        abrirDetalles(idx);
                        const modal = document.getElementById('notificacionesModal');
                        if (modal) modal.style.display = 'none';
                    } else {
                        showToast("Trabajo no encontrado en registros activos", "warning");
                    }
                }
            };

            setupSwipeToDelete(content, notifId);

            wrapper.appendChild(content);
            container.appendChild(wrapper);
        } catch (itemErr) {
            console.error("Error rendering single notification item:", notif, itemErr);
        }
    });
}

async function aprobarRegistroClick(event, notifId) {
    if (event) event.stopPropagation();

    const notif = listNotificaciones.find(n => getNotifField(n, 'id') == notifId);
    if (!notif) return;

    const email = getNotifField(notif, 'modelo');
    const password = getNotifField(notif, 'imei'); // La contraseña está en IMEI

    if (!email || !password) {
        showToast("Datos de registro incompletos", "error");
        return;
    }

    showToastLoading("Aprobando registro...");
    try {
        const res = await window.pywebview.api.aprobar_registro(notifId, email, password);
        hideToastLoading();

        if (res && res.status === 'success') {
            showToast(res.mensaje, "success");

            listNotificaciones = listNotificaciones.filter(n => getNotifField(n, 'id') != notifId);
            renderizarNotificacionesList();
            actualizarBadgeNotificaciones();
        } else {
            showToast(res?.mensaje || "Error al aprobar el registro", "error");
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de conexión al aprobar el registro", "error");
    }
}
window.aprobarRegistroClick = aprobarRegistroClick;

function setupSwipeToDelete(el, notifId) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const threshold = -75;

    el.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        el.setPointerCapture(e.pointerId);
        el.style.transition = 'none';
    });

    el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        if (currentX > 0) currentX = 0;
        if (currentX < -120) currentX = -120;
        el.style.transform = `translateX(${currentX}px)`;
    });

    el.addEventListener('pointerup', async (e) => {
        if (!isDragging) return;
        isDragging = false;
        el.releasePointerCapture(e.pointerId);
        el.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';

        if (currentX <= threshold) {
            el.style.transform = 'translateX(-100%)';
            const wrapper = document.getElementById(`notif-wrapper-${notifId}`);
            if (wrapper) {
                setTimeout(() => {
                    wrapper.classList.add('deleting');
                }, 150);
                setTimeout(async () => {
                    await eliminarNotificacionClick(notifId);
                }, 450);
            }
        } else {
            el.style.transform = 'translateX(0px)';
        }
    });

    el.addEventListener('pointercancel', () => {
        if (!isDragging) return;
        isDragging = false;
        el.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'translateX(0px)';
    });
}

async function eliminarNotificacionClick(id) {
    if (!window.pywebview || !window.pywebview.api) return;
    try {
        const res = await window.pywebview.api.eliminar_notificacion(id);
        if (res && res.status === 'success') {
            listNotificaciones = listNotificaciones.filter(n => n.id !== id);
            renderizarNotificacionesList();
            actualizarBadgeNotificaciones();
        } else {
            showToast("Error al eliminar notificación", "error");
        }
    } catch (e) {
        console.error(e);
    }
}

async function borrarTodasNotifClick(event) {
    if (event) event.stopPropagation();
    if (listNotificaciones.length === 0) return;
    if (!confirm("¿Estás seguro de borrar todas las notificaciones?")) return;
    if (!window.pywebview || !window.pywebview.api) return;
    try {
        const res = await window.pywebview.api.borrar_todas_notificaciones();
        if (res && res.status === 'success') {
            listNotificaciones = [];
            renderizarNotificacionesList();
            actualizarBadgeNotificaciones();
            showToast("Notificaciones borradas", "success");
        } else {
            showToast("Error al borrar notificaciones", "error");
        }
    } catch (e) {
        console.error(e);
    }
}
window.borrarTodasNotifClick = borrarTodasNotifClick;

function inicializarNotificaciones() {
    if (window.pywebview && window.pywebview.api) {
        cargarNotificaciones();
    } else {
        window.addEventListener('pywebviewready', () => {
            cargarNotificaciones();
        });
    }
    // Polling recurrente eliminado: las notificaciones se consultan al iniciar y bajo demanda al abrir el centro de notificaciones

    document.addEventListener('click', (e) => {
        const modal = document.getElementById('notificacionesModal');
        const btn = document.getElementById('btnNotificaciones');
        if (modal && modal.style.display === 'flex' && !modal.contains(e.target) && (!btn || !btn.contains(e.target))) {
            modal.style.display = 'none';
        }
    });
}

// Inicializar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    inicializarNotificaciones();

    // Actualizar marcas temporales de notificaciones cada 30 segundos
    setInterval(() => {
        document.querySelectorAll('.notif-timestamp[data-timestamp]').forEach(el => {
            const ts = el.getAttribute('data-timestamp');
            if (ts) el.textContent = timeAgo(ts);
        });
    }, 30000);
});

/* ============ REFRESH MANUAL & RECONEXIÓN DE BASE DE DATOS ============ */
window.refrescarTablaManual = async function () {
    // Requiere sesión activa
    if (!currentUser) return;

    const btn = document.getElementById('btnRefrescarManual');
    const icon = document.getElementById('iconRefrescarManual');
    const badgeNuevos = document.getElementById('badgeRefrescarNuevos');

    if (btn) btn.style.pointerEvents = 'none';
    if (icon) icon.classList.add('animate-spin');
    if (badgeNuevos) badgeNuevos.classList.add('hidden');

    showToast('Reinciando conexión con la base de datos...', 'info');

    try {
        if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.reconectar_bd === 'function') {
            const reconnectRes = await window.pywebview.api.reconectar_bd();
            console.log("🔄 Resultado reconexión BD:", reconnectRes);
        }

        if (window.pywebview && window.pywebview.api) {
            if (vistaActual === 'registros') {
                const res = await window.pywebview.api.obtener_fastreg();
                if (res && res.status === 'success') {
                    datosFastReg = res.data || [];
                    renderizarTablaFastReg();
                }
            } else {
                const res = await window.pywebview.api.obtener_registros();
                if (Array.isArray(res)) {
                    registros = res;
                    renderizarTabla();
                } else if (res && res.status === 'success' && res.data) {
                    registros = res.data;
                    renderizarTabla();
                }
            }
        }

        if (typeof cargarClientesBase === 'function') await cargarClientesBase();
        if (typeof actualizarContadoresElegantes === 'function') actualizarContadoresElegantes();

        showToast('Base de datos reconectada y datos actualizados', 'success');
    } catch (err) {
        console.error("Error al refrescar/reconectar la BD:", err);
        showToast('Error al reconectar con la base de datos', 'error');
    } finally {
        if (icon) setTimeout(() => icon.classList.remove('animate-spin'), 700);
        if (btn) setTimeout(() => btn.style.pointerEvents = 'auto', 700);
    }
};

window.marcarBotonRefrescarDisponible = function () {
    const badgeNuevos = document.getElementById('badgeRefrescarNuevos');
    if (badgeNuevos) badgeNuevos.classList.remove('hidden');
};

window.recibirActualizacionRegistros = async function () {
    console.log('🔄 [Realtime] Novedad en BD (registros), activando indicador de actualización...');
    window.marcarBotonRefrescarDisponible();
};

window.recibirActualizacionFastReg = async function () {
    console.log('🔄 [Realtime] Novedad en BD (FastReg), activando indicador de actualización...');
    window.marcarBotonRefrescarDisponible();
};

/* ============ CONTROLES OPERATIVOS DE DETALLES ============ */
async function forzarScraperDetalles() {
    if (indiceDetallesActual === null) return;
    const reg = registros[indiceDetallesActual];
    if (!reg || !reg.imei) return;
    const targetImei = reg.imei;
    const oldEstado = reg.estado;
    reg.estado = "Consultando...";
    renderizarTabla();
    abrirDetalles(indiceDetallesActual);
    showToastLoading('Consultando estado IMEI...');
    try {
        const res = await window.pywebview.api.actualizar_imei(targetImei, true);
        hideToastLoading();
        if (res && res.status === 'success') {
            showToast('Estado actualizado correctamente', 'success');
            const datos = await window.pywebview.api.obtener_registros();
            if (Array.isArray(datos)) {
                registros = datos;
            } else if (datos && datos.status === 'success' && Array.isArray(datos.data)) {
                registros = datos.data;
            }
            const newIdx = registros.findIndex(r => r.imei === targetImei);
            const activeIdx = newIdx > -1 ? newIdx : indiceDetallesActual;
            if (registros[activeIdx]) {
                registros[activeIdx].estado = res.estado;
                registros[activeIdx].operador = res.operador;
                indiceDetallesActual = activeIdx;
                renderizarTabla();
                abrirDetalles(activeIdx);
                procesarCambioEstadoBloqueo(registros[activeIdx], oldEstado, res.estado, res.operador, activeIdx);
            } else {
                renderizarTabla();
            }
        } else {
            reg.estado = oldEstado || "Error";
            renderizarTabla();
            abrirDetalles(indiceDetallesActual);
            showToast('Error al actualizar: ' + (res?.mensaje || ''), 'error');
        }
    } catch (e) {
        hideToastLoading();
        reg.estado = oldEstado || "Error";
        renderizarTabla();
        abrirDetalles(indiceDetallesActual);
        showToast('Error de conexión', 'error');
    }
}
window.forzarScraperDetalles = forzarScraperDetalles;

async function tomarPantallazoDetalles() {
    if (indiceDetallesActual === null) return;
    const reg = registros[indiceDetallesActual];
    if (!reg || !reg.imei) return;
    await tomarPantallazo(reg.imei);
}
window.tomarPantallazoDetalles = tomarPantallazoDetalles;

async function consultarBlacklistDetalles() {
    if (indiceDetallesActual === null) return;
    const reg = registros[indiceDetallesActual];
    if (!reg || !reg.imei) return;

    showToastLoading('Consultando Blacklist GSMA en iunlocker.com...');
    try {
        const res = await window.pywebview.api.consultar_blacklist(reg.imei);
        hideToastLoading();

        if (res && res.status === 'success') {
            const enBlacklist = res.en_blacklist || false;
            const etiqueta = enBlacklist ? '⚠️ IMEI en Blacklist' : '✅ IMEI Limpio (Clean)';
            showToast(etiqueta, enBlacklist ? 'error' : 'success');

            // Actualizar campo blacklist en el array local
            if (registros[indiceDetallesActual]) {
                registros[indiceDetallesActual].blacklist = res.valor_bd || (enBlacklist ? 'Blacklist' : 'clean');
            }

            // Mostrar badge actualizado sin recargar todo
            const blVal = (res.valor_bd || '').toLowerCase();
            let badge = document.getElementById('detBlacklistBadge');
            if (badge) {
                if (blVal === 'blacklist') {
                    badge.textContent = 'Blacklist';
                    badge.style.background = 'rgba(239,68,68,0.18)';
                    badge.style.color = '#f87171';
                    badge.style.border = '1px solid rgba(239,68,68,0.35)';
                    badge.style.display = 'inline-block';
                } else if (blVal === 'clean') {
                    badge.textContent = 'Clean';
                    badge.style.background = 'rgba(74,222,128,0.15)';
                    badge.style.color = '#4ade80';
                    badge.style.border = '1px solid rgba(74,222,128,0.30)';
                    badge.style.display = 'inline-block';
                }
            }

            // Mostrar pantallazo si está disponible
            if (res.screenshot_path) {
                const webPath = typeof normalizePathForWeb === 'function'
                    ? normalizePathForWeb(res.screenshot_path)
                    : res.screenshot_path;
                // Abrir en lightbox si el módulo Check lo tiene disponible
                if (typeof ckAmpliarScreenshot === 'function') {
                    ckAmpliarScreenshot(res.screenshot_path);
                } else {
                    // Fallback: abrir en ventana nueva
                    window.open(`file://${res.screenshot_path}`, '_blank');
                }
            }

            // Re-renderizar tabla para reflejar cambio
            renderizarTabla();

        } else {
            showToast('Error en Blacklist: ' + (res?.mensaje || 'desconocido'), 'error');
        }
    } catch (e) {
        hideToastLoading();
        showToast('Error al consultar Blacklist', 'error');
        console.error('[Blacklist] Error:', e);
    }
}
window.consultarBlacklistDetalles = consultarBlacklistDetalles;

// ─────────────────────────────────────────────────────────────
//  COPIAR VALOR DE CAMPO AL PORTAPAPELES
// ─────────────────────────────────────────────────────────────
function copiarValorCampo(idCampo) {
    const el = document.getElementById(idCampo);
    if (!el) return;
    const valor = el.value?.trim();
    if (!valor) {
        mostrarToast('⚠️ El campo está vacío', 'warning');
        return;
    }
    navigator.clipboard.writeText(valor)
        .then(() => mostrarToast('📋 Copiado al portapapeles', 'info'))
        .catch(() => mostrarToast('❌ No se pudo copiar', 'error'));
}
window.copiarValorCampo = copiarValorCampo;

function initLivePersonalForm() {
    const nameInput = document.getElementById('encFormNombre');
    const colorInput = document.getElementById('encFormColor');
    const avatar = document.getElementById('formAvatarPreview');
    const initialsSpan = document.getElementById('formAvatarInitials');
    const nameDisplay = document.getElementById('formNameDisplay');
    const colorHex = document.getElementById('colorTextHex');

    function update() {
        if (!avatar) return;
        const color = colorInput.value || "#39FF14";
        avatar.style.background = color;
        avatar.style.boxShadow = `0 0 25px ${color}55`;
        if (colorHex) colorHex.textContent = color.toUpperCase();

        const nombre = nameInput.value.trim() || 'Nuevo Encargado';
        nameDisplay.textContent = nombre;

        const partes = nombre.split(/\s+/);
        const iniciales = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : nombre.substring(0, 2).toUpperCase();
        initialsSpan.textContent = iniciales || '?';
    }

    if (nameInput) nameInput.addEventListener('input', update);
    if (colorInput) colorInput.addEventListener('input', update);

    window.updatePersonalFormPreview = update;
}

/* ============================================================
   MÓDULO DE GESTIÓN DE CLIENTES — CENTRALIZADO
   ============================================================ */

async function abrirModuloClientes() {
    const overlay = document.getElementById('clientesOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.classList.add('active');

    // Resetear formulario si estaba abierto
    volverClientesLista();

    // Limpiar buscador
    const searchInp = document.getElementById('searchClientesModulo');
    if (searchInp) searchInp.value = '';

    // Cargar datos
    await cargarGridClientes();
}

function cerrarModuloClientes() {
    const overlay = document.getElementById('clientesOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
    }
    volverClientesLista();
}

async function cargarGridClientes() {
    const grid = document.getElementById('clientesGrid');
    if (!grid) return;
    grid.innerHTML = '<p class="text-xs opacity-30 text-center py-10 col-span-full">Cargando clientes...</p>';
    try {
        const res = await window.pywebview.api.obtener_todos_clientes();
        _todosClientesModuloCache = res || [];
        const badge = document.getElementById('cntClientesBadge');
        if (badge) badge.textContent = _todosClientesModuloCache.length;
        renderizarGridClientes(_todosClientesModuloCache);
    } catch (e) {
        grid.innerHTML = '<p class="text-xs text-red-400 text-center py-10 col-span-full">Error al cargar clientes</p>';
    }
}

function renderizarGridClientes(clientes) {
    const grid = document.getElementById('clientesGrid');
    if (!grid) return;
    if (!clientes.length) {
        grid.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 col-span-full" style="opacity:0.25">
                <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest">Sin clientes registrados</span>
                <span class="text-[10px] mt-1 opacity-60">Usa el botón Registrar Cliente para agregar el primero</span>
            </div>`;
        return;
    }

    const esAdmin = currentUser && currentUser.rol === 'admin';
    const avatarGradients = [
        'linear-gradient(135deg,#00f3ff,#a855f7)',
        'linear-gradient(135deg,#10b981,#00f3ff)',
        'linear-gradient(135deg,#6366f1,#a855f7)',
        'linear-gradient(135deg,#0ea5e9,#6366f1)',
        'linear-gradient(135deg,#ec4899,#a855f7)',
        'linear-gradient(135deg,#14b8a6,#0ea5e9)',
        'linear-gradient(135deg,#f59e0b,#ef4444)',
        'linear-gradient(135deg,#f97316,#ec4899)',
    ];

    // SVG icons reutilizados
    const icoPhone = `<svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#10b981" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`;
    const icoMail = `<svg class="w-3.5 h-3.5 flex-shrink-0" style="color:#818cf8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`;
    const icoEdit = `<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`;
    const icoLock = `<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`;

    grid.innerHTML = clientes.map((c, idx) => {
        const nombre = c.nombre || 'Sin nombre';
        const partes = nombre.trim().split(/\s+/);
        const iniciales = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : nombre.substring(0, 2).toUpperCase();
        const grad = avatarGradients[idx % avatarGradients.length];
        const tipoId = c.tipo_id || 'CC';
        const safeId = c.id;
        const safeNombre = nombre.replace(/'/g, "\\'");

        const contacto = (c.celular || c.email) ? `
            <div class="card-cliente-contacto">
                ${c.celular ? `<span class="card-cliente-contacto-item">${icoPhone} ${c.celular}</span>` : ''}
                ${c.email  ? `<span class="card-cliente-contacto-item">${icoMail} ${c.email}</span>` : ''}
            </div>` : '';

        const btnHide = esAdmin ? `
            <button class="card-cliente-btn-hide"
                onclick="event.stopPropagation(); agregarClienteAOcultos('${safeId}','${safeNombre}')"
                title="Marcar como oculto">
                ${icoLock} Ocultar
            </button>` : '';

        return `
        <div class="card-cliente" onclick="editarClienteDesdeModulo('${safeId}')">
            <div class="card-cliente-inner">
                <div class="card-cliente-top">
                    <div class="card-cliente-avatar" style="background:${grad}; box-shadow:0 4px 18px rgba(0,0,0,0.35);">${iniciales}</div>
                    <div class="card-cliente-meta">
                        <div class="card-cliente-nombre">${nombre}</div>
                        <div class="card-cliente-id">
                            <span class="card-cliente-tipo-badge">${tipoId}</span>
                            ${safeId}
                        </div>
                    </div>
                </div>
                ${contacto}
                <div class="card-cliente-footer">
                    <button class="card-cliente-btn-edit"
                        onclick="event.stopPropagation(); editarClienteDesdeModulo('${safeId}')">
                        ${icoEdit} Editar
                    </button>
                    ${btnHide}
                </div>
            </div>
        </div>`;
    }).join('');
}

function filtrarClientesModulo(q) {
    const query = (q || '').toLowerCase().trim();
    if (!query) {
        renderizarGridClientes(_todosClientesModuloCache);
        return;
    }
    const filtrados = _todosClientesModuloCache.filter(c =>
        (c.nombre || '').toLowerCase().includes(query) ||
        (c.id || '').toString().toLowerCase().includes(query) ||
        (c.celular || '').toString().toLowerCase().includes(query) ||
        (c.email || '').toLowerCase().includes(query)
    );
    renderizarGridClientes(filtrados);
}

function mostrarFormClienteModulo(cliente = null) {
    document.getElementById('clientesVistaLista')?.classList.add('hidden');
    document.getElementById('clientesVistaForm')?.classList.remove('hidden');

    const titulo = document.getElementById('clientesFormTitulo');
    const idInput = document.getElementById('clFormId');

    if (cliente) {
        _clienteModuloEditandoId = cliente.id;
        if (titulo) titulo.textContent = 'Editar Cliente';
        if (idInput) {
            idInput.value = cliente.id || '';
            idInput.readOnly = true;
        }
        document.getElementById('clFormNombre').value = cliente.nombre || '';
        document.getElementById('clFormTipoId').value = cliente.tipo_id || 'CC';
        document.getElementById('clFormCelular').value = cliente.celular || '';
        document.getElementById('clFormEmail').value = cliente.email || '';
        document.getElementById('clFormExpedicion').value = cliente.expedicion || '';
    } else {
        _clienteModuloEditandoId = null;
        if (titulo) titulo.textContent = 'Añadir Cliente';
        if (idInput) {
            idInput.value = '';
            idInput.readOnly = false;
        }
        ['clFormNombre', 'clFormCelular', 'clFormEmail', 'clFormExpedicion'].forEach(fid => {
            const el = document.getElementById(fid);
            if (el) el.value = '';
        });
        const tipoEl = document.getElementById('clFormTipoId');
        if (tipoEl) tipoEl.value = 'CC';
    }

    const esAdmin = currentUser && currentUser.rol === 'admin';
    const ocultoContainer = document.getElementById('clFormOcultoContainer');
    if (ocultoContainer) ocultoContainer.style.display = esAdmin ? 'flex' : 'none';
    const ocultoCheck = document.getElementById('clFormOculto');
    if (ocultoCheck) ocultoCheck.checked = !!(cliente && cliente.oculto);

    actualizarPreviewClienteForm();
}

function volverClientesLista() {
    document.getElementById('clientesVistaLista')?.classList.remove('hidden');
    document.getElementById('clientesVistaForm')?.classList.add('hidden');
    _clienteModuloEditandoId = null;
}

function actualizarPreviewClienteForm() {
    const nombre = (document.getElementById('clFormNombre')?.value || '').trim();
    const id = (document.getElementById('clFormId')?.value || '').trim();
    const tipo = document.getElementById('clFormTipoId')?.value || 'CC';
    const cel = (document.getElementById('clFormCelular')?.value || '').trim();
    const email = (document.getElementById('clFormEmail')?.value || '').trim();

    const previewNombre = document.getElementById('clPreviewNombre');
    if (previewNombre) previewNombre.textContent = nombre || 'Nuevo Cliente';

    const previewId = document.getElementById('clPreviewId');
    if (previewId) previewId.textContent = id ? `${tipo} · ${id}` : '-';

    const previewCel = document.getElementById('clPreviewCelular');
    if (previewCel) previewCel.textContent = cel || '-';

    const previewEmail = document.getElementById('clPreviewEmail');
    if (previewEmail) previewEmail.textContent = email || '-';

    const initialsSpan = document.getElementById('clAvatarInitials');
    if (initialsSpan) {
        const partes = nombre.split(/\s+/).filter(Boolean);
        const iniciales = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : (nombre ? nombre.substring(0, 2).toUpperCase() : '?');
        initialsSpan.textContent = iniciales || '?';
    }
}

function editarClienteDesdeModulo(id) {
    const cliente = _todosClientesModuloCache.find(c => String(c.id) === String(id));
    if (cliente) {
        mostrarFormClienteModulo(cliente);
    }
}

async function guardarFormClienteModulo() {
    const id = (document.getElementById('clFormId')?.value || '').trim();
    const nombre = (document.getElementById('clFormNombre')?.value || '').trim();
    const tipo_id = document.getElementById('clFormTipoId')?.value || 'CC';
    const celular = (document.getElementById('clFormCelular')?.value || '').trim();
    const email = (document.getElementById('clFormEmail')?.value || '').trim();
    const expedicion = (document.getElementById('clFormExpedicion')?.value || '').trim();
    const oculto = document.getElementById('clFormOculto')?.checked || false;

    if (!id || !nombre) {
        showToast('Documento y Nombre son obligatorios', 'warning');
        return;
    }

    try {
        const payload = { id, nombre, tipo_id, celular, email, expedicion, oculto };
        const res = await window.pywebview.api.guardar_cliente(payload);
        if (res && res.status === 'success') {
            showToast(`Cliente "${nombre}" guardado con éxito`, 'success');
            await cargarClientesBase();
            await cargarGridClientes();
            volverClientesLista();
        } else {
            showToast(res?.mensaje || 'Error al guardar cliente', 'error');
        }
    } catch (e) {
        showToast('Error de conexión', 'error');
    }
}

/* ============================================================
   MÓDULO CLIENTES OCULTOS (HIDE) — SOLO ADMIN
   ============================================================ */

async function abrirHidePanel() {
    const overlay = document.getElementById('hideAdminOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    const si = document.getElementById('hideSearchInput');
    if (si) si.value = '';
    const sug = document.getElementById('hideSuggestions');
    if (sug) sug.innerHTML = '';
    ['hideNuevoId','hideNuevoNombre','hideNuevoCelular'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    await cargarClientesOcultos();
}

function cerrarHidePanel() {
    const overlay = document.getElementById('hideAdminOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
    }
}

async function cargarClientesOcultos() {
    const lista = document.getElementById('hideClientesList');
    if (!lista) return;
    lista.innerHTML = '<p class="text-xs opacity-30 text-center py-4">Cargando...</p>';
    try {
        const res = await window.pywebview.api.obtener_clientes_ocultos();
        if (!res || res.status !== 'success') {
            lista.innerHTML = `<p class="text-xs text-red-400 text-center py-4">${res?.mensaje || 'Error al cargar'}</p>`;
            return;
        }
        _hiddenClientsCache = res.clientes || [];
        renderizarClientesOcultos(_hiddenClientsCache);
        _hiddenClientNames = new Set(_hiddenClientsCache.map(c => (c.nombre || '').toLowerCase()));
    } catch (e) {
        lista.innerHTML = '<p class="text-xs text-red-400 text-center py-4">Error de conexión</p>';
    }
}

function renderizarClientesOcultos(clientes) {
    const lista = document.getElementById('hideClientesList');
    if (!lista) return;
    if (!clientes.length) {
        lista.innerHTML = '<p class="text-xs text-center py-6" style="opacity:0.28">Sin clientes ocultos registrados</p>';
        return;
    }

    const icoEdit = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`;
    const icoRestore = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
    const icoDel = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;

    lista.innerHTML = clientes.map(c => {
        const nombre = c.nombre || 'Sin nombre';
        const partes = nombre.trim().split(/\s+/);
        const iniciales = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : nombre.substring(0, 2).toUpperCase();
        const safeNombre = nombre.replace(/'/g, "\\'");
        return `
        <div class="hide-cliente-item">
            <div class="hide-cliente-item-avatar">${iniciales}</div>
            <div class="hide-cliente-item-info">
                <div class="hide-cliente-item-nombre">${nombre}</div>
                <div class="hide-cliente-item-id">${c.tipo_id || 'CC'} ${c.id}${c.celular ? ' · ' + c.celular : ''}</div>
            </div>
            <div class="hide-cliente-item-actions">
                <button class="hide-cl-action-btn edit" onclick="abrirModalEditarClienteOculto('${c.id}')" title="Editar">${icoEdit}</button>
                <button class="hide-cl-action-btn restore" onclick="sacarClienteAPublico('${c.id}')" title="Hacer público">${icoRestore}</button>
                <button class="hide-cl-action-btn del" onclick="eliminarClienteOcultoConfirm('${c.id}','${safeNombre}')" title="Eliminar">${icoDel}</button>
            </div>
        </div>`;
    }).join('');
}

function abrirModalEditarClienteOculto(id) {
    const c = _hiddenClientsCache.find(x => String(x.id) === String(id));
    if (!c) return;
    document.getElementById('hideEditId').value = c.id || '';
    document.getElementById('hideEditNombre').value = c.nombre || '';
    document.getElementById('hideEditTipoId').value = c.tipo_id || 'CC';
    document.getElementById('hideEditCelular').value = c.celular || '';
    document.getElementById('hideEditEmail').value = c.email || '';
    document.getElementById('hideEditExpedicion').value = c.expedicion || '';
    const modal = document.getElementById('hideEditClienteModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
    }
}

function cerrarModalEditarClienteOculto() {
    const modal = document.getElementById('hideEditClienteModal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.add('hidden');
    }
}

async function guardarEdicionClienteOculto() {
    const id = (document.getElementById('hideEditId')?.value || '').trim();
    const nombre = (document.getElementById('hideEditNombre')?.value || '').trim();
    const tipo_id = document.getElementById('hideEditTipoId')?.value || 'CC';
    const celular = (document.getElementById('hideEditCelular')?.value || '').trim();
    const email = (document.getElementById('hideEditEmail')?.value || '').trim();
    const expedicion = (document.getElementById('hideEditExpedicion')?.value || '').trim();

    if (!id || !nombre) {
        showToast('ID y Nombre son requeridos', 'warning');
        return;
    }

    try {
        const payload = { id, nombre, tipo_id, celular, email, expedicion };
        const res = await window.pywebview.api.editar_cliente_oculto(payload);
        if (res && res.status === 'success') {
            showToast(`Cliente oculto "${nombre}" actualizado`, 'success');
            cerrarModalEditarClienteOculto();
            await cargarClientesOcultos();
        } else {
            showToast(res?.mensaje || 'Error al actualizar cliente oculto', 'error');
        }
    } catch (e) {
        showToast('Error de conexión', 'error');
    }
}

async function sacarClienteAPublico(idCliente) {
    try {
        const r = await window.pywebview.api.toggle_cliente_oculto(idCliente, false);
        if (r && r.status === 'success') {
            showToast('Cliente movido a Clientes públicos', 'success');
            await cargarClientesOcultos();
            await cargarClientesBase();
            const clOverlay = document.getElementById('clientesOverlay');
            if (clOverlay && !clOverlay.classList.contains('hidden')) {
                await cargarGridClientes();
            }
        } else {
            showToast(r?.mensaje || 'Error al mover cliente', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

async function eliminarClienteOcultoConfirm(idCliente, nombre) {
    if (!confirm(`¿Eliminar PERMANENTEMENTE al cliente "${nombre}" (ID: ${idCliente})?\n\nEsta acción NO se puede deshacer.`)) return;
    try {
        const r = await window.pywebview.api.eliminar_cliente_oculto(idCliente);
        if (r && r.status === 'success') {
            showToast('Cliente eliminado permanentemente', 'success');
            await cargarClientesOcultos();
        } else {
            showToast(r?.mensaje || 'Error al eliminar', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

let _hideSearchTimer = null;
async function hideSearchCliente(query) {
    const sug = document.getElementById('hideSuggestions');
    if (!sug) return;
    clearTimeout(_hideSearchTimer);
    if (!query || query.trim().length < 2) { sug.innerHTML = ''; return; }
    _hideSearchTimer = setTimeout(async () => {
        try {
            const r = await window.pywebview.api.buscar_cliente(query.trim());
            if (!r || r.status !== 'success' || !r.clientes.length) {
                sug.innerHTML = '<p class="text-xs opacity-30 py-2 px-1">Sin resultados</p>';
                return;
            }
            sug.innerHTML = r.clientes.map(c => `
                <div class="flex items-center justify-between bg-black/30 rounded-2xl p-3 border border-white/5 gap-2 hover:border-purple-500/20 transition-colors">
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold truncate text-white">${c.nombre}</p>
                        <p class="text-[10px] opacity-40 font-mono">${c.tipo_id || 'CC'} ${c.id}</p>
                    </div>
                    <button onclick="agregarClienteAOcultos('${c.id}', '${(c.nombre || '').replace(/'/g, "\\'")}')"
                        class="text-[10px] px-3 py-1.5 rounded-xl font-bold transition-all flex-shrink-0 cursor-pointer flex items-center gap-1.5"
                        style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.35);color:#c084fc;"
                        onmouseover="this.style.background='rgba(168,85,247,0.28)'"
                        onmouseout="this.style.background='rgba(168,85,247,0.15)'">
                        <svg class="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        Ocultar
                    </button>
                </div>
            `).join('');
        } catch (e) {
            sug.innerHTML = '<p class="text-xs text-red-400 py-2 px-1">Error de búsqueda</p>';
        }
    }, 350);
}

async function agregarClienteAOcultos(idCliente, nombre) {
    try {
        const r = await window.pywebview.api.toggle_cliente_oculto(idCliente, true);
        if (r && r.status === 'success') {
            showToast(`"${nombre}" ahora es un cliente oculto`, 'success');
            const searchInp = document.getElementById('hideSearchInput');
            if (searchInp) searchInp.value = '';
            const sug = document.getElementById('hideSuggestions');
            if (sug) sug.innerHTML = '';
            await cargarClientesOcultos();
            await cargarClientesBase();
            const clOverlay = document.getElementById('clientesOverlay');
            if (clOverlay && !clOverlay.classList.contains('hidden')) {
                await cargarGridClientes();
            }
        } else {
            showToast(r?.mensaje || 'Error al ocultar cliente', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

async function crearNuevoClienteOculto() {
    const id = (document.getElementById('hideNuevoId')?.value || '').trim();
    const nombre = (document.getElementById('hideNuevoNombre')?.value || '').trim();
    const celular = (document.getElementById('hideNuevoCelular')?.value || '').trim();
    const tipoId = document.getElementById('hideNuevoTipoId')?.value || 'CC';
    if (!id || !nombre) { showToast('ID y Nombre son obligatorios', 'warning'); return; }
    try {
        const r = await window.pywebview.api.crear_cliente_oculto({ id, nombre, tipo_id: tipoId, celular });
        if (r && r.status === 'success') {
            showToast(`Cliente oculto "${nombre}" creado`, 'success');
            ['hideNuevoId','hideNuevoNombre','hideNuevoCelular'].forEach(fid => {
                const el = document.getElementById(fid);
                if (el) el.value = '';
            });
            await cargarClientesOcultos();
        } else {
            showToast(r?.mensaje || 'Error al crear cliente', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

/* ============================================================
   MÓDULO LÍNEAS OCULTAS — SOLO ADMIN
   ============================================================ */

async function abrirLineasHidePanel() {
    const overlay = document.getElementById('lineasHideOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    const si = document.getElementById('hideSearchLineaInput');
    if (si) si.value = '';
    const sug = document.getElementById('hideLineasSuggestions');
    if (sug) sug.innerHTML = '';
    ['hideNuevaLineaNumero', 'hideNuevaLineaEncargado'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    await cargarLineasOcultas();
}

function cerrarLineasHidePanel() {
    const overlay = document.getElementById('lineasHideOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
    }
}

async function cargarLineasOcultas() {
    const lista = document.getElementById('hideLineasList');
    if (!lista) return;
    lista.innerHTML = '<p class="text-xs opacity-30 text-center py-4">Cargando...</p>';
    try {
        const res = await window.pywebview.api.obtener_lineas_ocultas();
        if (!res || res.status !== 'success') {
            lista.innerHTML = `<p class="text-xs text-red-400 text-center py-4">${res?.mensaje || 'Error al cargar'}</p>`;
            return;
        }
        _hiddenLinesCache = res.lineas || [];
        renderizarLineasOcultas(_hiddenLinesCache);
    } catch (e) {
        lista.innerHTML = '<p class="text-xs text-red-400 text-center py-4">Error de conexión</p>';
    }
}

function renderizarLineasOcultas(lineas) {
    const lista = document.getElementById('hideLineasList');
    if (!lista) return;
    if (!lineas.length) {
        lista.innerHTML = '<p class="text-xs opacity-30 text-center py-6">No hay líneas ocultas registradas</p>';
        return;
    }
    lista.innerHTML = lineas.map(l => `
        <div class="flex items-center justify-between bg-black/30 rounded-2xl p-3 border border-white/5 gap-3 hover:border-purple-500/20 transition-colors">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-xs tracking-wider text-white">${l.numero}</span>
                    <span class="operator-badge-pill ${(l.operador || '').toLowerCase()}">${l.operador}</span>
                    <span class="text-[9px] opacity-40 uppercase">${l.estado || 'Disponible'}</span>
                </div>
                ${l.encargado ? `<p class="text-[10px] opacity-40 truncate mt-1">${l.encargado}</p>` : ''}
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
                <button onclick="sacarLineaAPublico('${l.numero}')"
                    title="Mover a Líneas públicas"
                    class="px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center gap-1 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    Pública
                </button>
                <button onclick="eliminarLineaOcultaConfirm('${l.numero}')"
                    title="Eliminar permanentemente"
                    class="p-2 rounded-xl text-xs font-bold transition-all text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        </div>
    `).join('');
}

let _hideSearchLineaTimer = null;
async function hideSearchLinea(query) {
    const sug = document.getElementById('hideLineasSuggestions');
    if (!sug) return;
    clearTimeout(_hideSearchLineaTimer);
    if (!query || query.trim().length < 2) { sug.innerHTML = ''; return; }
    _hideSearchLineaTimer = setTimeout(async () => {
        const q = query.toLowerCase().trim();
        const filtradas = todasLasLineasCache.filter(l =>
            (l.numero || '').includes(q) ||
            (l.operador || '').toLowerCase().includes(q) ||
            (l.encargado || '').toLowerCase().includes(q)
        );
        if (!filtradas.length) {
            sug.innerHTML = '<p class="text-xs opacity-30 py-2 px-1">Sin resultados</p>';
            return;
        }
        sug.innerHTML = filtradas.map(l => `
            <div class="flex items-center justify-between bg-black/30 rounded-2xl p-3 border border-white/5 gap-2 hover:border-purple-500/20 transition-colors">
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold truncate text-white font-mono">${l.numero} (${l.operador})</p>
                    <p class="text-[10px] opacity-40">${l.encargado || 'Sin encargado'}</p>
                </div>
                <button onclick="agregarLineaAOcultas('${l.numero}')"
                    class="text-[10px] px-3 py-1.5 rounded-xl font-bold transition-all flex-shrink-0 cursor-pointer flex items-center gap-1.5"
                    style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.35);color:#c084fc;"
                    onmouseover="this.style.background='rgba(168,85,247,0.28)'"
                    onmouseout="this.style.background='rgba(168,85,247,0.15)'">
                    <svg class="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Ocultar
                </button>
            </div>
        `).join('');
    }, 300);
}

async function agregarLineaAOcultas(numero) {
    try {
        const r = await window.pywebview.api.toggle_linea_oculta(numero, true);
        if (r && r.status === 'success') {
            showToast(`Línea ${numero} ahora es oculta`, 'success');
            const searchInp = document.getElementById('hideSearchLineaInput');
            if (searchInp) searchInp.value = '';
            const sug = document.getElementById('hideLineasSuggestions');
            if (sug) sug.innerHTML = '';
            await cargarLineasOcultas();
            await cargarDatosLineas();
        } else {
            showToast(r?.mensaje || 'Error al ocultar línea', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

async function sacarLineaAPublico(numero) {
    try {
        const r = await window.pywebview.api.toggle_linea_oculta(numero, false);
        if (r && r.status === 'success') {
            showToast(`Línea ${numero} movida a líneas públicas`, 'success');
            await cargarLineasOcultas();
            await cargarDatosLineas();
        } else {
            showToast(r?.mensaje || 'Error al mover línea', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

async function crearNuevaLineaOculta() {
    const numero = (document.getElementById('hideNuevaLineaNumero')?.value || '').trim();
    const operador = document.getElementById('hideNuevaLineaOperador')?.value || 'WOM';
    const estado = document.getElementById('hideNuevaLineaEstado')?.value || 'Disponible';
    const encargado = (document.getElementById('hideNuevaLineaEncargado')?.value || '').trim();

    if (!numero) { showToast('Número de línea es obligatorio', 'warning'); return; }

    try {
        const r = await window.pywebview.api.crear_linea_oculta({ numero, operador, estado, encargado });
        if (r && r.status === 'success') {
            showToast(`Línea oculta ${numero} creada`, 'success');
            ['hideNuevaLineaNumero', 'hideNuevaLineaEncargado'].forEach(fid => {
                const el = document.getElementById(fid);
                if (el) el.value = '';
            });
            await cargarLineasOcultas();
            await cargarDatosLineas();
        } else {
            showToast(r?.mensaje || 'Error al crear línea oculta', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

async function eliminarLineaOcultaConfirm(numero) {
    if (!confirm(`¿Eliminar PERMANENTEMENTE la línea ${numero}?\n\nEsta acción NO se puede deshacer.`)) return;
    try {
        const r = await window.pywebview.api.eliminar_linea_oculta(numero);
        if (r && r.status === 'success') {
            showToast('Línea eliminada', 'success');
            await cargarLineasOcultas();
            await cargarDatosLineas();
        } else {
            showToast(r?.mensaje || 'Error al eliminar línea', 'error');
        }
    } catch (e) { showToast('Error de conexión', 'error'); }
}

// ── Exportaciones a window ──
window.abrirModuloClientes = abrirModuloClientes;
window.cerrarModuloClientes = cerrarModuloClientes;
window.cargarGridClientes = cargarGridClientes;
window.renderizarGridClientes = renderizarGridClientes;
window.filtrarClientesModulo = filtrarClientesModulo;
window.mostrarFormClienteModulo = mostrarFormClienteModulo;
window.volverClientesLista = volverClientesLista;
window.actualizarPreviewClienteForm = actualizarPreviewClienteForm;
window.guardarFormClienteModulo = guardarFormClienteModulo;
window.editarClienteDesdeModulo = editarClienteDesdeModulo;

window.abrirHidePanel = abrirHidePanel;
window.cerrarHidePanel = cerrarHidePanel;
window.cargarClientesOcultos = cargarClientesOcultos;
window.renderizarClientesOcultos = renderizarClientesOcultos;
window.abrirModalEditarClienteOculto = abrirModalEditarClienteOculto;
window.cerrarModalEditarClienteOculto = cerrarModalEditarClienteOculto;
window.guardarEdicionClienteOculto = guardarEdicionClienteOculto;
window.sacarClienteAPublico = sacarClienteAPublico;
window.eliminarClienteOcultoConfirm = eliminarClienteOcultoConfirm;
window.hideSearchCliente = hideSearchCliente;
window.agregarClienteAOcultos = agregarClienteAOcultos;
window.crearNuevoClienteOculto = crearNuevoClienteOculto;

window.abrirLineasHidePanel = abrirLineasHidePanel;
window.cerrarLineasHidePanel = cerrarLineasHidePanel;
window.cargarLineasOcultas = cargarLineasOcultas;
window.renderizarLineasOcultas = renderizarLineasOcultas;
window.hideSearchLinea = hideSearchLinea;
window.agregarLineaAOcultas = agregarLineaAOcultas;
window.sacarLineaAPublico = sacarLineaAPublico;
window.crearNuevaLineaOculta = crearNuevaLineaOculta;
window.eliminarLineaOcultaConfirm = eliminarLineaOcultaConfirm;

