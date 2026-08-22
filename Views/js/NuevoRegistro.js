function abrirNuevoRegistro() {
    nrResetearCampos();
    document.getElementById('nrOverlay').classList.add('active');
}
window.abrirNuevoRegistro = abrirNuevoRegistro;

function cerrarNuevoRegistro() {
    document.getElementById('nrOverlay').classList.remove('active');
}
window.cerrarNuevoRegistro = cerrarNuevoRegistro;

async function nrPegarIMEI() {
    try {
        const text = await navigator.clipboard.readText();
        let clean = text.replace(/\D/g, '').trim().substring(0, 15);
        if (clean.length > 0) {
            document.getElementById('nrImei').value = clean;
            if (clean.length === 15) nrConsultarModelo();
        }
    } catch (e) {
        showToast('No se pudo acceder al portapapeles', 'warning');
    }
}
window.nrPegarIMEI = nrPegarIMEI;

async function nrConsultarModelo() {
    const imei = document.getElementById('nrImei').value.trim();
    if (imei.length !== 15) return showToast('El IMEI debe tener 15 dígitos', 'warning');

    showToastLoading('Consultando modelo...');
    try {
        const res = await window.pywebview.api.consultar_modelo(imei);
        hideToastLoading();

        if (res && res.status === 'success' && res.modelo) {
            const campoModelo = document.getElementById('nrModelo');
            if (campoModelo && !campoModelo.value) campoModelo.value = res.modelo;
            const campoMarca = document.getElementById('nrMarca');
            if (campoMarca && !campoMarca.value) {
                const palabras = res.modelo.split(' ');
                if (palabras.length > 0) campoMarca.value = palabras[0];
            }
            showToast(`Modelo: ${res.modelo}`, 'success');
        } else {
            showToast(res?.mensaje || 'Modelo no encontrado', 'warning');
        }
    } catch (e) {
        hideToastLoading();
        showToast('Error consultando modelo', 'error');
    }
    nrValidarFormulario();
}
window.nrConsultarModelo = nrConsultarModelo;

function nrValidarFormulario() {
    const imei = (document.getElementById('nrImei')?.value || '').trim();
    const marca = (document.getElementById('nrMarca')?.value || '').trim();
    const modelo = (document.getElementById('nrModelo')?.value || '').trim();

    const imeiOk = imei.length === 15;
    const dot = document.getElementById('nrStatusDot');
    const txt = document.getElementById('nrStatusText');
    const submitBtn = document.getElementById('nrBtnSubir');

    let mensajes = [];
    if (!imeiOk) mensajes.push('IMEI de 15 dígitos');
    if (!marca) mensajes.push('marca');
    if (!modelo) mensajes.push('modelo');

    const listo = mensajes.length === 0;

    if (dot) { dot.className = 'nr-status-dot ' + (listo ? 'ready' : (mensajes.length <= 2 ? 'warning' : '')); }
    if (txt) { txt.innerText = listo ? '✓ Listo para guardar' : 'Falta: ' + mensajes.join(', '); }
    if (submitBtn) {
        submitBtn.classList.toggle('ready', listo);
    }
    return listo;
}

async function nrSubir() {
    if (!nrValidarFormulario()) {
        const btn = document.getElementById('nrBtnSubir');
        btn.style.animation = 'none';
        btn.style.transform = 'translateX(-4px)';
        setTimeout(() => { btn.style.transform = 'translateX(4px)'; }, 80);
        setTimeout(() => { btn.style.transform = 'translateX(-3px)'; }, 160);
        setTimeout(() => { btn.style.transform = 'translateX(0)'; btn.style.animation = ''; }, 240);
        return showToast('Completa todos los campos requeridos', 'warning');
    }

    const imei = document.getElementById('nrImei').value.trim();
    const marca = document.getElementById('nrMarca').value.trim();
    const modelo = document.getElementById('nrModelo').value.trim();
    const btn = document.getElementById('nrBtnSubir');

    btn.classList.add('nr-btn-loading');
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            style="animation: spin 1s linear infinite">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-opacity="0.2"/>
            <path d="M21 12a9 9 0 00-9-9"/>
        </svg>
        Guardando...
    `;

    showToastLoading('Guardando registro...');

    try {
        const res = await window.pywebview.api.GuardarNuevoRegistro({
            imei,
            marca,
            modelo
        });

        hideToastLoading();

        if (res.status === 'success') {
            showToast(res.mensaje || 'Registro guardado exitosamente', 'success');
            cerrarNuevoRegistro();
        } else {
            showToast(res.mensaje || 'Error al guardar', 'error');
        }
    } catch (e) {
        hideToastLoading();
        showToast('Error de conexión con la API', 'error');
    }

    btn.classList.remove('nr-btn-loading');
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
        </svg>
        Guardar Registro
    `;
}
window.nrSubir = nrSubir;

function nrResetearCampos() {
    ['nrImei', 'nrMarca', 'nrModelo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const dot = document.getElementById('nrStatusDot');
    const txt = document.getElementById('nrStatusText');
    if (dot) dot.className = 'nr-status-dot';
    if (txt) txt.innerText = 'Completa los campos requeridos';

    const sub = document.getElementById('nrBtnSubir');
    if (sub) sub.classList.remove('ready');
}

document.addEventListener('DOMContentLoaded', () => {
    const liveIds = ['nrImei', 'nrMarca', 'nrModelo'];
    liveIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                if (id === 'nrImei') {
                    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 15);
                }
                nrValidarFormulario();
            });
        }
    });

    if (!document.getElementById('nrSpinStyle')) {
        const style = document.createElement('style');
        style.id = 'nrSpinStyle';
        style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
});

