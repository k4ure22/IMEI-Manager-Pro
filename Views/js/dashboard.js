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
    file: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
};

let registros = [];
let imeiEsperandoPin = null;
let indiceDetallesActual = null;
let todosLosEncargados = [];
let isFirstRender = true;
let headlessEnabled = ((localStorage.getItem('imei-headless') || '1') === '1');

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
        'rojos': 'Rojos primero',
        'pendientes': 'Pendientes primero'
    };
    txt.innerText = labels[sel.value] || 'Ordenar';
}

function getIconPath(base, isHover = false) {
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';
    if (isHover) return `../icons/${base}color.png`;
    if (base === 'logoIMP' || base === 'logotipo') return `../icons/${base}${tema === 'light' ? 'light' : 'dark'}.png`;
    return `../icons/${base}${tema === 'light' ? 'light' : ''}.png`;
}

function actualizarTodosLosIconos() {
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';

    // 1. Actualizar dock items
    document.querySelectorAll('.dock-item img').forEach(img => {
        const alt = (img.getAttribute('alt') || '').toLowerCase();
        const map = { 'nuevo': 'nuevo', 'modelos': 'modelos', 'masivos': 'excel', 'personal': 'personal', 'papelera': 'papelera' };
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
let currentUser = null;
let currentDbStatus = 'active';
let _appInited = false;

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
                mostrarPantallaSleep();
                return;
            }
        }
    } catch (e) {
        console.error("Error al obtener estado inicial de la BD:", e);
    }

    mostrarPantallaLogin();
}

function mostrarPantallaLogin() {
    document.getElementById('authOverlay').classList.remove('hidden');
    document.getElementById('sleepOverlay').classList.add('hidden');
    switchAuthMode('login');
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
    } catch(e) { console.error("Error al cargar clientes base:", e); }
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

/* ============ LÓGICA NEON ============ */
function evaluarNeon(reg) {
    if (!reg.estado || !reg.razon) return "";
    let razon = reg.razon.toLowerCase();
    let estado = reg.estado.toLowerCase();
    if (razon === "registro" || (razon.includes("registro") && !razon.includes("no registro"))) {
        let womExito = reg.reg_wom && reg.reg_wom !== 'No' && reg.reg_wom !== 'Error' && reg.reg_wom !== '';
        let etbExito = reg.reg_etb && reg.reg_etb !== 'No' && reg.reg_etb !== 'Error' && reg.reg_etb !== '';
        return (womExito || etbExito) ? "neon-verde" : "neon-rojo";
    }
    if (razon.includes("desbloqueo") || razon.includes("no registro")) return estado.includes("libre") ? "neon-verde" : "neon-rojo";
    if (razon.includes("bloqueo")) return !estado.includes("libre") ? "neon-verde" : "neon-rojo";
    return "";
}

/* ============ RENDERIZAR TABLA ============ */
function renderizarTabla() {
    const tbody = document.getElementById("tableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    const searchTerm = (document.getElementById('globalSearch')?.value || '').toLowerCase();
    const filtroReg = document.getElementById('filtroRegistro')?.value || 'todos';
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
        let isRegistrado = false;
        let womExito = reg.reg_wom && reg.reg_wom !== 'No' && reg.reg_wom !== 'Error' && reg.reg_wom !== '';
        let etbExito = reg.reg_etb && reg.reg_etb !== 'No' && reg.reg_etb !== 'Error' && reg.reg_etb !== '';
        if (womExito || etbExito) isRegistrado = true;
        const matchReg = filtroReg === 'todos' ||
            (filtroReg === 'registrados' && isRegistrado) ||
            (filtroReg === 'no_registrados' && !isRegistrado);
        return matchText && matchReg;
    });

    console.log(`🔍 [JS] Después de filtrar: ${filtrados.length} registros visibles.`);
    if (filtrados.length === 0 && registros.length > 0) {
        console.warn("⚠️ [JS] ¡Atención! Los datos existen pero el filtro los está ocultando todos.");
    }

    filtrados.sort((a, b) => {
        const aIdx = registros.indexOf(a), bIdx = registros.indexOf(b);
        if (sortBy === 'recientes') return bIdx - aIdx;
        if (sortBy === 'antiguos') return aIdx - bIdx;
        if (sortBy === 'rojos') {
            let aR = evaluarNeon(a) === 'neon-rojo' ? 1 : 0;
            let bR = evaluarNeon(b) === 'neon-rojo' ? 1 : 0;
            return aR !== bR ? bR - aR : bIdx - aIdx;
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

            tr.innerHTML = `
                        <td style="width:10px;padding:0 0 0 6px;" class="relative"><div class="neon-indicator"></div></td>
                        <td style="font-family:'SF Mono','Fira Code','Courier New',monospace;font-size:12.5px;letter-spacing:0.04em;color:var(--color-sec);font-weight:600;font-variant-numeric:tabular-nums;" class="select-all">${reg.imei}</td>
                        <td style="color:var(--color);font-weight:600;font-size:13.5px;">${reg.modelo || ''}</td>
                        <td id="estado-${originalIndex}">${reg.estado ? `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;background:rgba(var(--hover-acc-rgb),0.10);color:var(--color-sec);border:1px solid rgba(var(--hover-acc-rgb),0.18);">${reg.estado}</span>` : ''}</td>
                        <td id="operador-${originalIndex}">${operadorHTML}</td>
                        <td style="color:var(--color-sec);opacity:0.85;font-size:13px;">${reg.cliente || ''}</td>
                        <td style="font-size:10.5px;font-weight:750;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-sec);opacity:0.95;">${reg.razon || ''}</td>
                        <td>${encargadoHTML}</td>
                        <td style="color:var(--color-sec);font-size:12px;font-weight:650;opacity:0.95;">${reg.pago || ''}</td>
                        <td class="text-center">
                            <div class="flex justify-center gap-1.5">
                                <button class="btn-icon" onclick="event.stopPropagation(); forzarScraper('${reg.imei}', ${originalIndex})" title="Actualizar"><img src="${getIconPath('actualizar')}"></button>
                                <button class="btn-icon" onclick="event.stopPropagation(); tomarPantallazo('${reg.imei}')" title="Pantallazo"><img src="${getIconPath('camara')}"></button>
                                <button class="btn-icon" onclick="event.stopPropagation(); ejecutarEliminar('${reg.imei}')" title="Eliminar" style="border-color:rgba(255,40,40,0.18);"><img src="${getIconPath('basura')}"></button>
                            </div>
                        </td>`;
            tbody.appendChild(tr);
        } catch (err) {
            console.error("❌ [JS] Error renderizando fila:", err, reg);
        }
    });

    isFirstRender = false;
}

/* ============ TIME AGO ============ */
function timeAgo(dateString) {
    if (!dateString || dateString === 'No' || dateString === 'Error' || dateString === 'Sí') return '';
    const past = new Date(dateString);
    if (isNaN(past.getTime())) return '';
    const diff = Math.floor((new Date() - past) / 1000);
    if (diff < 60) return "hace unos segs";
    const min = Math.floor(diff / 60);
    if (min < 60) return `hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `hace ${h} h`;
    return `hace ${Math.floor(h / 24)} d`;
}

/* ============ BOTONES WOM/ETB UI ============ */
function actualizarUIBotonesRegistro() {
    if (indiceDetallesActual === null) return;
    const reg = registros[indiceDetallesActual];
    function configurarBoton(btnEl, txtEl, estadoStr, onClickFn, animClass) {
        // Estilo base premium para los botones del modal
        btnEl.className = "py-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all group btn-reg-premium";
        btnEl.style.boxShadow = '';
        btnEl.style.background = '';
        btnEl.style.opacity = '1';

        if (estadoStr === 'Error') {
            btnEl.classList.add('border-red-500/40', 'bg-red-500/10');
            txtEl.innerHTML = "<span class='text-red-400 font-black text-[9px] tracking-tighter'>FALLIDO</span>";
            btnEl.onclick = onClickFn;
        } else if (estadoStr && estadoStr !== 'No' && estadoStr !== '') {
            btnEl.classList.add('border-green-500/40', 'bg-green-500/5', 'cursor-not-allowed');
            btnEl.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.1)';
            let ago = timeAgo(estadoStr);
            txtEl.innerHTML = `<span class='text-green-400 font-black text-[9px] tracking-tighter'>COMPLETADO</span>${ago ? `<br><span class='text-[7px] opacity-50 font-bold'>${ago}</span>` : ''}`;
            btnEl.onclick = null;
        } else {
            btnEl.classList.add(animClass);
            txtEl.innerHTML = "<span class='opacity-50 tracking-widest text-[8px] font-black'>PENDIENTE</span>";
            btnEl.onclick = onClickFn;
        }
    }
    configurarBoton(document.getElementById('btnWom'), document.getElementById('txtEstadoWom'), reg.reg_wom, ejecutarRegistroWom, 'btn-wom-anim');
    configurarBoton(document.getElementById('btnEtb'), document.getElementById('txtEstadoEtb'), reg.reg_etb, ejecutarRegistroEtb, 'btn-etb-anim');
}

/* ============ DETALLES ============ */
async function abrirDetalles(index) {
    indiceDetallesActual = index;
    const reg = registros[index];
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';

    // Header & IMEI
    document.getElementById('detImeiTit').innerText = reg.imei;

    // COL 1: Información Base
    document.getElementById('detModelo').value = reg.modelo === "Error" ? "" : (reg.modelo || '');
    if (reg.modelo === "Error") {
        document.getElementById('btnConsultaManual').classList.remove('hidden');
        document.getElementById('detModelo').placeholder = "Ingresa el modelo manualmente";
    } else {
        document.getElementById('btnConsultaManual').classList.add('hidden');
        document.getElementById('detModelo').placeholder = "";
    }
    document.getElementById('detClienteDisplay').innerText = reg.cliente || 'Sin Asignar';
    document.getElementById('detRazon').value = reg.razon || '';
    
    // Encargado link
    const encLink = document.getElementById('detEncargadoDisplay');
    encLink.innerText = reg.encargado || 'Sin Asignar';
    encLink.style.color = 'var(--color)';
    if (reg.encargado) {
        const encObj = todosLosEncargados.find(e => e.nombre === reg.encargado);
        if (encObj && encObj.color) encLink.style.color = encObj.color;
    }

    // COL 2: Estados
    const cEstado = document.getElementById('detEstado');
    const cEstadoTime = document.getElementById('detEstadoTime');
    const sIcon = document.getElementById('statusIcon');
    const sIconBg = document.getElementById('statusIconBg');
    const badgeLegal = document.getElementById('badgeLegal');
    const legalTime = document.getElementById('legalTime');
    const cardLegal = document.getElementById('cardResultadoLegal');
    const detOp = document.getElementById('detOperador');

    // Reset legal card
    cardLegal.className = "mini-status-card";
    badgeLegal.className = "status-badge-mini";
    detOp.innerText = reg.operador || '';

    // Lógica de Registro (Mini Card 1)
    cEstado.innerText = reg.estado || 'Pendiente';
    cEstadoTime.innerText = '--';
    sIcon.innerHTML = ICONS.device;
    sIconBg.style.background = "rgba(255,255,255,0.05)";
    sIconBg.style.borderColor = "rgba(255,255,255,0.1)";

    if (reg.estado === "Registrado WOM" || reg.estado === "Registrado ETB") {
        sIcon.innerHTML = ICONS.success;
        cEstadoTime.innerText = reg.fecha_registro ? `Registrado el ${reg.fecha_registro}` : 'Completado';
    } else if (reg.estado === "Consultando...") {
        sIcon.innerHTML = ICONS.loading;
        cEstadoTime.innerText = "En proceso...";
    }

    // Lógica Legal (Mini Card 2)
    const neon = evaluarNeon(reg);
    if (neon === 'neon-verde') {
        cardLegal.classList.add('state-unblocked');
        badgeLegal.innerText = "DESBLOQUEADO / LIBRE";
        badgeLegal.style.background = "rgba(57,255,20,0.2)";
        badgeLegal.style.color = "#39FF14";
        legalTime.innerText = reg.fecha_desbloqueo ? `Desde: ${reg.fecha_desbloqueo}` : 'Liberado';
    } else if (neon === 'neon-rojo') {
        badgeLegal.innerText = "BLOQUEADO / NEGATIVO";
        badgeLegal.style.background = "rgba(255,7,58,0.2)";
        badgeLegal.style.color = "#FF073A";
        legalTime.innerText = reg.fecha_bloqueo ? `Desde: ${reg.fecha_bloqueo}` : 'Restringido';
    } else {
        badgeLegal.innerText = "EN VERIFICACIÓN";
        badgeLegal.style.background = "rgba(255,255,255,0.1)";
        badgeLegal.style.color = "var(--color-muted)";
        legalTime.innerText = "Pendiente de respuesta";
    }

    // PIN
    document.getElementById('detPin').value = reg.pin_desbloqueo || '';
    document.getElementById('btnPagado').style.display = reg.pago === 'Sí' ? 'none' : 'flex';

    actualizarUIBotonesRegistro();

    // Botón Generar Declaración WOM
    const btnDeclWomTxt = document.getElementById('btnGenDeclWomText');
    const btnDeclWom = document.getElementById('btnGenDeclWom');
    if (btnDeclWomTxt && btnDeclWom) {
        if (reg.ruta_declaracion_generada && reg.fecha_declaracion_generada) {
            btnDeclWomTxt.innerHTML = `Generado (${reg.fecha_declaracion_generada})`;
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
function abrirMenuEncargado(e) {
    e.stopPropagation();
    const menu = document.getElementById('encargadoContextMenu');
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.classList.add('show');

    // Cerrar al hacer clic fuera
    const closeMenu = () => {
        menu.classList.remove('show');
        document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);
}

async function consultarEncargadoDesdeMenu() {
    const nombre = document.getElementById('detEncargadoDisplay').innerText;
    if (nombre === 'Sin Asignar') return showToast("No hay encargado asignado", "warning");
    cerrarDetalles();
    abrirPersonal();
    setTimeout(() => editarFormPersonal(nombre), 300);
}

function cambiarEncargadoDesdeMenu() {
    const sel = document.getElementById('detEncargadoInput');
    // Generar opciones si no existen
    sel.innerHTML = '<option value="">Sin Asignar</option>';
    todosLosEncargados.forEach(enc => {
        const opt = document.createElement('option');
        opt.value = enc.nombre; opt.innerText = enc.nombre;
        sel.appendChild(opt);
    });
    sel.click(); // Intenta abrir el select nativo
    // Alternativamente, podemos mostrar un prompt o un modal de selección, 
    // pero para mantenerlo simple usaremos el select oculto disparando su apertura si el navegador lo permite
    // o simplemente enfocándolo.
    sel.classList.remove('hidden');
    sel.focus();
}

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
        document.getElementById('btnPagado').style.display = 'none';
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
        const div = document.createElement('div');
        div.className = "card-personal";
        div.style.borderColor = color;
        div.style.boxShadow = `0 4px 15px ${color}22`;
        div.onclick = () => editarFormPersonal(enc.nombre);
        div.innerHTML = `
                    <div class="w-3 h-full absolute top-0 left-0 rounded-l-2xl" style="background:${color};opacity:0.85;"></div>
                    <div class="ml-4">
                        <h3 class="font-bold text-base truncate" style="color:var(--color)">${enc.nombre}</h3>
                        <p class="text-xs truncate mt-1" style="color:var(--color-muted)">${enc.correo || 'Sin correo'}</p>
                    </div>`;
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
    if (confirm(`¿Estás seguro de eliminar a ${nombre} permanentemente del personal?`)) {
        const res = await window.pywebview.api.eliminar_encargado(nombre);
        if (res.status === "success") { showToast("Encargado Eliminado", ""); await cargarGridPersonal(); volverPersonalLista(); }
    }
}

/* ============ SCRAPER / IMEI ============ */
async function forzarScraper(imei, index) {
    document.getElementById(`estado-${index}`).innerText = "Consultando...";
    showToastLoading("Consultando imei con Imei Colombia...");
    const res = await window.pywebview.api.actualizar_imei(imei, headlessEnabled);
    hideToastLoading();
    if (res.status === "success") {
        registros[index].estado = res.estado;
        registros[index].operador = res.operador;
        let rzn = registros[index].razon.toLowerCase();
        let est = res.estado.toLowerCase();
        let op = res.operador.toLowerCase();
        if (rzn.includes("bloqueo") && !est.includes("libre") && op.includes("wom")) {
            if (!registros[index].pin_desbloqueo || registros[index].pin_desbloqueo.trim() === "") {
                imeiEsperandoPin = imei;
                document.getElementById('pinImeiCopy').innerText = imei;
                document.getElementById('pinEncargadoNombre').innerText = registros[index].encargado || "Sin Asignar";
                document.getElementById('inputPinBloqueo').value = "";
                document.getElementById('pinOverlay').classList.add('active');
                setTimeout(() => document.getElementById('inputPinBloqueo').focus(), 100);
            }
        }
    }
    renderizarTabla();
}

async function guardarPinDetectado() {
    const pin = document.getElementById('inputPinBloqueo').value.trim();
    if (!pin) return;
    const res = await window.pywebview.api.guardar_pin(imeiEsperandoPin, pin);
    if (res.status === "success") {
        const idx = registros.findIndex(r => r.imei === imeiEsperandoPin);
        if (idx > -1) registros[idx].pin_desbloqueo = pin;
        document.getElementById('pinOverlay').classList.remove('active');
        showToast("PIN Guardado", "");
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
            card.style.borderLeft = `4px solid ${enc.color || 'var(--hover-acc)'}`; 
            card.onclick = () => selectOption('encargado', enc.nombre, card);
            card.innerHTML = `<span>${enc.nombre}</span>`;
            grid.appendChild(card);
        });
        
        const newCard = document.createElement('div');
        newCard.className = 'option-card border-dashed';
        newCard.onclick = () => { cerrarNuevoRegistro(); abrirPersonal(); };
        newCard.innerHTML = `<span class="text-cyan-400">+ Nuevo</span>`;
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
                <div class="text-sm font-bold">${c.nombre}</div>
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
        showToast(`El ID ${id} ya pertenece a ${res.nombre}`, "warning");
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
            regState.cliente = nombre;
            regState.cliente_info = clienteData;
            document.getElementById('regClienteNombre').value = nombre;
            intercambiarARegistroGeneral();
        } else {
            showToast("Error al guardar: " + res.mensaje, "error");
        }
    } catch (e) {
        showToast("Error de conexión", "error");
    }
}

async function abrirSelectorClientes() {
    document.getElementById('historyOverlay').classList.add('active');
    document.getElementById('historyPanel').classList.add('active');
    document.getElementById('registrationModal').classList.add('history-open');
    renderizarHistorialClientes();
}

function cerrarHistorialClientes() {
    cerrarPanelesLaterales();
}

let todosLosClientesCache = [];
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
            <div class="flex justify-between items-center">
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
            seleccionarClienteSugerido(c);
            cerrarHistorialClientes();
        };
        container.appendChild(div);
    });
}

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
        pago: 'No'
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
    showToastLoading("Tomando captura del imei con Imei colombia");
    const res = await window.pywebview.api.pantallazo_imei(imei, headlessEnabled);
    if (res.status === "success") showToast("Copiado al portapapeles", "");
    else alert("Error: " + res.mensaje);
    hideToastLoading();
}

async function ejecutarEliminar(imei) {
    if (confirm("¿Mover a papelera?")) { await window.pywebview.api.eliminar_registro(imei); await cargarDatos(); }
}

/* ============ PAPELERA ============ */
async function abrirPapelera() {
    const data = await window.pywebview.api.obtener_papelera();
    const tb = document.getElementById("papeleraBody");
    tb.innerHTML = "";
    data.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td style="color:var(--color-muted)">${r.imei}</td>
                    <td style="color:var(--color)">${r.modelo}</td>
                    <td style="color:var(--color-muted);font-size:12px">${r.fecha_borrado}</td>
                    <td class="text-center">
                        <button class="btn-icon" onclick="window.pywebview.api.restaurar_registro('${r.imei}').then(cargarDatos); document.getElementById('papeleraOverlay').classList.remove('active');">
                            <img src="../icons/actualizar.png" style="filter:hue-rotate(90deg);">
                        </button>
                    </td>`;
        tb.appendChild(tr);
    });
    document.getElementById('papeleraOverlay').classList.add('active');
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
    showToast('Abriendo selector de imagen...', 'camera');
    const res = await window.pywebview.api.seleccionar_foto_dispositivo(womDesbIMEIActual);
    if (res.status === 'success') {
        womDesbFotoRuta = res.ruta;
        const nombre = res.ruta.split('/').pop().split('\\').pop();
        document.getElementById('womDesbFotoNombre').innerText = nombre;
        document.getElementById('womDesbFotoCheck').innerText = 'Cargada';
        showToast('Foto guardada', 'success');
    } else if (res.status !== 'cancelled') {
        showToast('Error: ' + res.mensaje, 'error');
    }
}

async function cargarDeclaracionDesdeModal() {
    if (indiceDetallesActual === null) return;
    const encNombre = registros[indiceDetallesActual].encargado;
    if (!encNombre) return showToast('Asigna un encargado primero.', 'warning');
    const res = await window.pywebview.api.seleccionar_declaracion_wom(encNombre);
    if (res.status === 'success') {
        showToast('Firma PDF guardada', 'file');
        const declEl = document.getElementById('womDesbDeclStatus');
        declEl.textContent = 'Cargada';
        declEl.style.background = 'rgba(57,255,20,0.12)';
        declEl.style.color = '#39FF14';
        declEl.style.borderColor = 'rgba(57,255,20,0.3)';
        const alertasEl = document.getElementById('womDesbAlertas');
        const lines = alertasEl.innerHTML.split('<div>').filter(l => !l.includes('firma PDF')).join('<div>');
        alertasEl.innerHTML = lines;
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

async function generarDeclaracion(tipo) {
    if (tipo === 'general') return showToast('Próximamente disponible', 'warning');
    if (indiceDetallesActual === null) return;
    const imei = registros[indiceDetallesActual].imei;
    showToastLoading('Generando declaración WOM...');
    const res = await window.pywebview.api.generar_declaracion_wom(imei);
    hideToastLoading();
    if (res.status === 'success') {
        registros[indiceDetallesActual].ruta_declaracion_generada = res.ruta;
        registros[indiceDetallesActual].fecha_declaracion_generada = res.fecha;
        abrirDetalles(indiceDetallesActual);
        showToast(res.mensaje, 'file');
    } else {
        showToast(res.mensaje, 'error');
    }
}

async function confirmarEnvioCorreoWom() {
    if (!womDesbIMEIActual) return;
    const btn = document.getElementById('btnEnviarCorreoWom');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.innerText = 'Enviando...';
    showToastLoading('Enviando correo de desbloqueo WOM...');

    const res = await window.pywebview.api.enviar_correo_desbloqueo_wom(
        womDesbIMEIActual,
        womDesbFotoRuta || ''
    );

    hideToastLoading();
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerText = '✉️ Enviar Correo de Desbloqueo';

    if (res.status === 'success') {
        showToast(res.mensaje, '');
        document.getElementById('womDesbloqueoOverlay').classList.remove('active');
    } else {
        showToast(res.mensaje, '❌');
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
    const imei = registros[indiceDetallesActual].imei;
    const encNombre = registros[indiceDetallesActual].encargado;
    if (!encNombre) return showToast("Asigna un encargado primero", "");
    const enc = todosLosEncargados.find(e => e.nombre === encNombre);
    if (!enc || !enc.lineas_wom) return showToast("El encargado no tiene líneas WOM.", "");
    const lineas = enc.lineas_wom.split(',').map(l => l.trim()).filter(l => l !== "");
    if (lineas.length > 1) {
        mostrarSelectorLineasNeon('WOM', lineas, async (l) => { showToast("Arrancando Selenium (WOM)...", ""); await window.pywebview.api.registrar_wom(imei, l); });
    } else if (lineas.length === 1) {
        showToast("Arrancando Selenium (WOM)...", "");
        window.pywebview.api.registrar_wom(imei, lineas[0]);
    } else showToast("No hay líneas válidas guardadas.", "");
}

function ejecutarRegistroEtb() {
    const imei = registros[indiceDetallesActual].imei;
    const encNombre = registros[indiceDetallesActual].encargado;
    if (!encNombre) return showToast("Asigna un encargado primero", "");
    const enc = todosLosEncargados.find(e => e.nombre === encNombre);
    if (!enc || !enc.lineas_etb) return showToast("El encargado no tiene líneas ETB.", "");
    const lineas = enc.lineas_etb.split(',').map(l => l.trim()).filter(l => l !== "");
    if (lineas.length > 1) {
        mostrarSelectorLineasNeon('ETB', lineas, async (l) => { showToast("Arrancando Selenium (ETB)...", ""); await window.pywebview.api.registrar_etb(imei, l); });
    } else if (lineas.length === 1) {
        showToast("Arrancando Selenium (ETB)...", "");
        window.pywebview.api.registrar_etb(imei, lineas[0]);
    } else showToast("No hay líneas válidas guardadas.", "");
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
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

/* ==========================================
      SISTEMA DE AUTENTICACIÓN Y ROLES (CLIENTE)
   ========================================== */

async function loginCompletadoExitosamente(user) {
    currentUser = user;
    
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
    if(dbToggle) dbToggle.classList.toggle('hidden', !esAdmin);

    // 2. Todos los usuarios ven Papelera, Masivos y Personal
    document.querySelectorAll('.dock-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            const alt = (img.getAttribute('alt') || '').toLowerCase();
            if (['personal', 'masivos', 'papelera'].includes(alt)) {
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
    
    showToast(`Bienvenido, ${currentUser.usuario}. Rol: ${currentUser.rol.toUpperCase()}`, 'success');
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
    if (mode === 'register') {
        document.getElementById('loginCard').classList.add('hidden');
        document.getElementById('registerCard').classList.remove('hidden');
    } else {
        document.getElementById('registerCard').classList.add('hidden');
        document.getElementById('loginCard').classList.remove('hidden');
    }
}

// ==========================================
// LÓGICA DE AUTENTICACIÓN (LOGIN Y REGISTRO)
// ==========================================

async function ejecutarLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPassword').value;

    // MAGIA: Forzar que las alertas se vean por encima de la pantalla negra
    const toastElement = document.getElementById('toast');
    const toastLoadingElement = document.getElementById('toastLoading');
    if(toastElement) toastElement.style.zIndex = "99999999";
    if(toastLoadingElement) toastLoadingElement.style.zIndex = "99999999";

    if (!user || !pass) {
        showToast("Escribe tu usuario y contraseña", "warning");
        return;
    }

    showToastLoading("Iniciando sesión...");
    try {
        // Llama a Python
        const res = await window.pywebview.api.login_usuario(user, pass);
        hideToastLoading();
        
        if (res.status === 'success') {
            // Si todo está bien, entra al sistema
            await loginCompletadoExitosamente(res.user);
        } else if (res.status === 'paused') {
            showToast(res.mensaje, "warning");
            mostrarPantallaSleep();
        } else {
            // AHORA SÍ VERÁS ESTE ERROR SI LA CONTRASEÑA ESTÁ MAL
            showToast(res.mensaje, "error");
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de conexión al iniciar sesión", "error");
    }
}

async function ejecutarRegistro() {
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;

    // MAGIA: Forzar que las alertas se vean por encima
    const toastElement = document.getElementById('toast');
    if(toastElement) toastElement.style.zIndex = "99999999";

    if (!user || !pass) {
        showToast("El usuario y contraseña son obligatorios", "warning");
        return;
    }

    if (pass !== confirm) {
        showToast("Las contraseñas no coinciden", "warning");
        return;
    }

    if (pass.length < 4) {
        showToast("Contraseña muy corta (mínimo 4 caracteres)", "warning");
        return;
    }

    showToastLoading("Registrando usuario...");
    try {
        // Llama a Python
        const res = await window.pywebview.api.registrar_usuario(user, pass);
        hideToastLoading();
        
        if (res.status === 'success') {
            showToast(res.mensaje, "success");
            
            // Limpiar formulario
            document.getElementById('regUser').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regPasswordConfirm').value = '';
            
            // Autocompletar el login para no tener que volver a escribir el usuario
            document.getElementById('loginUser').value = user;
            document.getElementById('loginPassword').value = '';
            
            // Volver visualmente a la pantalla de login
            switchAuthMode('login');
        } else {
            // AHORA SÍ VERÁS LA ALERTA SI EL USUARIO YA EXISTE
            showToast(res.mensaje, "error");
        }
    } catch (e) {
        hideToastLoading();
        showToast("Error de conexión al registrar usuario", "error");
    }
}
async function ejecutarLogout() {
    try {
        await window.pywebview.api.logout_usuario();
        currentUser = null;
        
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPassword').value = '';

        document.getElementById('logoutBtn').classList.add('hidden');
        document.getElementById('dbStatusToggle').classList.add('hidden');
        document.getElementById('sleepOverlay').classList.add('hidden');

        registros = [];
        renderizarTabla();

        document.getElementById('authOverlay').style.opacity = '1';
        document.getElementById('authOverlay').classList.remove('hidden');

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
        text.innerText = "Base Activa";
    } else {
        dot.className = "w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] transition-all duration-300 animate-pulse";
        text.innerText = "Base en Reposo";
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
