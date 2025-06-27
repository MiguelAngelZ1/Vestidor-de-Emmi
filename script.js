/* script.js corregido */

// Cambia el título y el header del modal según el modo (agregar o editar)
function configurarModal(tabla, modo) {
  let headerId = '', titleId = '', icono = '', texto = '';
  switch (tabla) {
    case 'superior':
      headerId = 'superiorHeader';
      titleId = 'superiorTitle';
      icono = modo === 'editar' ? '<i class="bi bi-pencil"></i>' : '<i class="bi bi-plus-circle"></i>';
      texto = modo === 'editar' ? 'Editar prenda superior' : 'Agregar prenda superior';
      break;
    case 'inferior':
      headerId = 'inferiorHeader';
      titleId = 'inferiorTitle';
      icono = modo === 'editar' ? '<i class="bi bi-pencil"></i>' : '<i class="bi bi-plus-circle"></i>';
      texto = modo === 'editar' ? 'Editar prenda inferior' : 'Agregar prenda inferior';
      break;
    case 'calzados':
      headerId = 'calzadosHeader';
      titleId = 'calzadosTitle';
      icono = modo === 'editar' ? '<i class="bi bi-pencil"></i>' : '<i class="bi bi-plus-circle"></i>';
      texto = modo === 'editar' ? 'Editar calzado' : 'Agregar calzado';
      break;
    case 'accesorios':
      headerId = 'accesoriosHeader';
      titleId = 'accesoriosTitle';
      icono = modo === 'editar' ? '<i class="bi bi-pencil"></i>' : '<i class="bi bi-plus-circle"></i>';
      texto = modo === 'editar' ? 'Editar accesorio' : 'Agregar accesorio';
      break;
  }
  if (headerId && titleId) {
    const header = document.getElementById(headerId);
    const title = document.getElementById(titleId);
    if (header && title) {
      header.className = 'modal-header ' + (modo === 'editar' ? 'bg-warning text-dark' : 'bg-pink text-white');
      title.innerHTML = icono + ' ' + texto;
    }
  }
}

// Convierte un color en formato rgb(a) a hexadecimal
function rgb2hex(rgb) {
  // Soporta formatos: rgb(255, 255, 255) o rgba(255, 255, 255, 1)
  if (!rgb) return '#ff758c'; // Valor por defecto si no hay color
  const result = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!result) return '#ff758c';
  const r = parseInt(result[1]).toString(16).padStart(2, '0');
  const g = parseInt(result[2]).toString(16).padStart(2, '0');
  const b = parseInt(result[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function mostrarMensaje(mensaje, tipo = 'success') {
  const mensajesAnteriores = document.querySelectorAll('.alert-mensaje');
  mensajesAnteriores.forEach(el => el.remove());
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} alert-dismissible fade show alert-mensaje position-fixed top-0 end-0 m-3`;
  alerta.role = 'alert';
  alerta.style.zIndex = '1100';
  alerta.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;
  document.body.appendChild(alerta);
  setTimeout(() => {
    if (alerta.parentNode === document.body) {
      alerta.remove();
    }
  }, 3000);
}

// Estado global para edición y configuración de modales
const estadoEdicion = {
  tabla: null,
  index: null,
  modo: 'agregar' // 'agregar' o 'editar'
};

function mostrar(id) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.add('d-none'));
  document.getElementById(id).classList.remove('d-none');
}

function formatearTexto(txt) {
  if (!txt) return '';
  return txt.trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function validarTexto(txt) {
  if (!txt || txt.trim() === '') return false;
  return /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s\-',.]+$/.test(txt);
}

function agregarFila(tablaId, valores, onEdit, onDelete = null) {
  const tabla = document.getElementById(tablaId);
  const fila = tabla.insertRow();
  const valoresFormateados = valores.map((valor, i) => {
    if ((tablaId === 'tablaAccesorios' && i === 1) || (tablaId !== 'tablaAccesorios' && i === 2)) {
      return valor;
    }
    return formatearTexto(valor);
  });

  valoresFormateados.forEach((valor, i) => {
    const celda = fila.insertCell();
    if ((tablaId === 'tablaAccesorios' && i === 1) || (tablaId !== 'tablaAccesorios' && i === 2)) {
      celda.innerHTML = `<div class='color-celda' style="width: 30px; height: 20px; background-color: ${valor}; border: 1px solid #ccc; margin: 0 auto;"></div>`;
    } else {
      celda.innerText = valor;
    }
  });

  const acciones = fila.insertCell();
  acciones.className = 'text-nowrap';

  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn btn-sm btn-outline-pink btn-editar me-2';
  btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
  btnEditar.title = 'Editar';
  btnEditar.onclick = () => onEdit(fila.rowIndex - 1);

  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn btn-sm btn-outline-danger';
  btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
  btnEliminar.title = 'Eliminar';
  btnEliminar.onclick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(fila.rowIndex - 1);
    } else {
      tabla.deleteRow(fila.rowIndex);
    }
  };

  acciones.appendChild(btnEditar);
  acciones.appendChild(btnEliminar);

  return fila;
}

// Borra todas las prendas superiores
function borrarPrendasSuperiores() {
  localStorage.removeItem('prendasSuperiores');
  renderTablaSuperior();
  mostrarMensaje('Todas las prendas superiores han sido borradas', 'success');
}
// Borra todas las prendas inferiores
function borrarPrendasInferior() {
  localStorage.removeItem('prendasInferiores');
  renderTablaInferior();
  mostrarMensaje('Todas las prendas inferiores han sido borradas', 'success');
}
// Borra todos los calzados
function borrarCalzados() {
  localStorage.removeItem('calzados');
  renderTablaCalzados();
  mostrarMensaje('Todos los calzados han sido borrados', 'success');
}
// Borra todos los accesorios
function borrarAccesorios() {
  localStorage.removeItem('accesorios');
  renderTablaAccesorios();
  mostrarMensaje('Todos los accesorios han sido borrados', 'success');
}

// Renderiza tabla de prendas inferiores
function renderTablaInferior() {
  const tbody = document.getElementById('tablaInferior');
  if (!tbody) return;
  tbody.innerHTML = '';
  const datos = JSON.parse(localStorage.getItem('prendasInferiores') || '[]');
  if (!datos.length) {
    const fila = tbody.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 5;
    celda.className = 'text-center text-muted';
    celda.innerText = 'No hay prendas inferiores guardadas.'; // Consistente con el resto
    return;
  }
  datos.forEach((item, index) => {
    const fila = agregarFila('tablaInferior', [
      item.prenda || '',
      item.talle || '',
      item.color || '#ff758c',
      item.observaciones || ''
    ],
    (idx) => editarFilaInferior(idx),
    (idx) => {
      datos.splice(idx, 1);
      localStorage.setItem('prendasInferiores', JSON.stringify(datos));
      renderTablaInferior();
    });
    fila.setAttribute('data-id', index);
  });
}
// Renderiza tabla de calzados
function renderTablaCalzados() {
  const tbody = document.getElementById('tablaCalzados');
  if (!tbody) return;
  tbody.innerHTML = '';
  const datos = JSON.parse(localStorage.getItem('calzados') || '[]');
  if (!datos.length) {
    const fila = tbody.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 5;
    celda.className = 'text-center text-muted';
    celda.innerText = 'No hay calzados guardados.'; // Consistente con el resto
    return;
  }
  datos.forEach((item, index) => {
    const fila = agregarFila('tablaCalzados', [
      item.tipo || '',
      item.talle || '',
      item.color || '#ff758c',
      item.observaciones || ''
    ],
    (idx) => editarFilaCalzados(idx),
    (idx) => {
      datos.splice(idx, 1);
      localStorage.setItem('calzados', JSON.stringify(datos));
      renderTablaCalzados();
    });
    fila.setAttribute('data-id', index);
  });
}
// Renderiza tabla de accesorios
function renderTablaAccesorios() {
  const tbody = document.getElementById('tablaAccesorios');
  if (!tbody) return;
  tbody.innerHTML = '';
  const datos = JSON.parse(localStorage.getItem('accesorios') || '[]');
  if (!datos.length) {
    const fila = tbody.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 4;
    celda.className = 'text-center text-muted';
    celda.innerText = 'No hay accesorios guardados.'; // Consistente con el resto
    return;
  }
  datos.forEach((item, index) => {
    const fila = agregarFila('tablaAccesorios', [
      item.accesorio || '',
      item.color || '#ff758c',
      item.observaciones || ''
    ],
    (idx) => editarFilaAccesorios(idx),
    (idx) => {
      datos.splice(idx, 1);
      localStorage.setItem('accesorios', JSON.stringify(datos));
      renderTablaAccesorios();
    });
    fila.setAttribute('data-id', index);
  });
}

// Manejo de edición para cada sección (inferior, calzados, accesorios)
function editarFilaInferior(idx) {
  estadoEdicion.tabla = 'inferior';
  estadoEdicion.index = idx;
  estadoEdicion.modo = 'editar';
  const fila = document.getElementById('tablaInferior').rows[idx].cells;
  document.getElementById('prendaInferior').value = fila[0].innerText;
  document.getElementById('talleInferior').value = fila[1].innerText;
  document.getElementById('colorInferior').value = rgb2hex(fila[2].querySelector('div').style.backgroundColor);
  document.getElementById('obsInferior').value = fila[3].innerText;
  configurarModal('inferior', 'editar');
  new bootstrap.Modal(document.getElementById('modalInferior')).show();
}
function editarFilaCalzados(idx) {
  estadoEdicion.tabla = 'calzados';
  estadoEdicion.index = idx;
  estadoEdicion.modo = 'editar';
  const fila = document.getElementById('tablaCalzados').rows[idx].cells;
  document.getElementById('tipoCalzado').value = fila[0].innerText;
  document.getElementById('talleCalzado').value = fila[1].innerText;
  document.getElementById('colorCalzado').value = rgb2hex(fila[2].querySelector('div').style.backgroundColor);
  document.getElementById('obsCalzado').value = fila[3].innerText;
  configurarModal('calzados', 'editar');
  new bootstrap.Modal(document.getElementById('modalCalzados')).show();
}
function editarFilaAccesorios(idx) {
  estadoEdicion.tabla = 'accesorios';
  estadoEdicion.index = idx;
  estadoEdicion.modo = 'editar';
  const fila = document.getElementById('tablaAccesorios').rows[idx].cells;
  document.getElementById('accesorio').value = fila[0].innerText;
  document.getElementById('colorAccesorio').value = rgb2hex(fila[1].querySelector('div').style.backgroundColor);
  document.getElementById('obsAccesorio').value = fila[2].innerText;
  configurarModal('accesorios', 'editar');
  new bootstrap.Modal(document.getElementById('modalAccesorios')).show();
}

// Manejadores de submit para cada formulario
window.onload = () => {
  if (typeof renderTablaSuperior === 'function') renderTablaSuperior();
  if (typeof renderTablaInferior === 'function') renderTablaInferior();
  if (typeof renderTablaCalzados === 'function') renderTablaCalzados();
  if (typeof renderTablaAccesorios === 'function') renderTablaAccesorios();

  const formSuperior = document.getElementById('formSuperior');
  if (formSuperior) formSuperior.addEventListener('submit', manejarSubmitSuperior);
  const formInferior = document.getElementById('formInferior');
  if (formInferior) formInferior.addEventListener('submit', manejarSubmitInferior);
  const formCalzados = document.getElementById('formCalzados');
  if (formCalzados) formCalzados.addEventListener('submit', manejarSubmitCalzados);
  const formAccesorios = document.getElementById('formAccesorios');
  if (formAccesorios) formAccesorios.addEventListener('submit', manejarSubmitAccesorios);
};

function manejarSubmitInferior(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
    return;
  }
  const prenda = formatearTexto(document.getElementById('prendaInferior').value);
  const talle = formatearTexto(document.getElementById('talleInferior').value);
  const color = document.getElementById('colorInferior').value;
  const observaciones = formatearTexto(document.getElementById('obsInferior').value);
  try {
    if (!prenda || !talle) {
      mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
      return;
    }
    const nuevaPrenda = { prenda, talle, color, observaciones, fechaActualizacion: new Date().toISOString() };
    let datos = JSON.parse(localStorage.getItem('prendasInferiores') || '[]');
    if (estadoEdicion && estadoEdicion.tabla === 'inferior' && estadoEdicion.modo === 'editar' && estadoEdicion.index !== null) {
      datos[estadoEdicion.index] = nuevaPrenda;
      mostrarMensaje('¡Prenda actualizada correctamente!', 'success');
    } else {
      nuevaPrenda.fechaCreacion = new Date().toISOString();
      datos.push(nuevaPrenda);
      mostrarMensaje('¡Prenda guardada correctamente!', 'success');
    }
    localStorage.setItem('prendasInferiores', JSON.stringify(datos));
    if (typeof renderTablaInferior === 'function') renderTablaInferior();
  } catch (error) {
    console.error('Error al guardar la prenda inferior:', error);
    mostrarMensaje('Ocurrió un error al guardar la prenda inferior', 'danger');
  } finally {
    form.reset();
    form.classList.remove('was-validated');
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalInferior'));
    if (modal) modal.hide();
    if (typeof estadoEdicion !== 'undefined') {
      estadoEdicion.tabla = null;
      estadoEdicion.index = null;
      estadoEdicion.modo = 'agregar';
    }
  }
}

function manejarSubmitCalzados(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
    return;
  }
  const tipo = formatearTexto(document.getElementById('tipoCalzado').value);
  const talle = formatearTexto(document.getElementById('talleCalzado').value);
  const color = document.getElementById('colorCalzado').value;
  const observaciones = formatearTexto(document.getElementById('obsCalzado').value);
  try {
    if (!tipo || !talle) {
      mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
      return;
    }
    const nuevoCalzado = { tipo, talle, color, observaciones, fechaActualizacion: new Date().toISOString() };
    let datos = JSON.parse(localStorage.getItem('calzados') || '[]');
    if (estadoEdicion && estadoEdicion.tabla === 'calzados' && estadoEdicion.modo === 'editar' && estadoEdicion.index !== null) {
      datos[estadoEdicion.index] = nuevoCalzado;
      mostrarMensaje('¡Calzado actualizado correctamente!', 'success');
    } else {
      nuevoCalzado.fechaCreacion = new Date().toISOString();
      datos.push(nuevoCalzado);
      mostrarMensaje('¡Calzado guardado correctamente!', 'success');
    }
    localStorage.setItem('calzados', JSON.stringify(datos));
    if (typeof renderTablaCalzados === 'function') renderTablaCalzados();
  } catch (error) {
    console.error('Error al guardar el calzado:', error);
    mostrarMensaje('Ocurrió un error al guardar el calzado', 'danger');
  } finally {
    form.reset();
    form.classList.remove('was-validated');
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCalzados'));
    if (modal) modal.hide();
    if (typeof estadoEdicion !== 'undefined') {
      estadoEdicion.tabla = null;
      estadoEdicion.index = null;
      estadoEdicion.modo = 'agregar';
    }
  }
}

function manejarSubmitAccesorios(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
    return;
  }
  const accesorio = formatearTexto(document.getElementById('accesorio').value);
  const color = document.getElementById('colorAccesorio').value;
  const observaciones = formatearTexto(document.getElementById('obsAccesorio').value);
  try {
    if (!accesorio) {
      mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
      return;
    }
    const nuevoAccesorio = { accesorio, color, observaciones, fechaActualizacion: new Date().toISOString() };
    let datos = JSON.parse(localStorage.getItem('accesorios') || '[]');
    if (estadoEdicion && estadoEdicion.tabla === 'accesorios' && estadoEdicion.modo === 'editar' && estadoEdicion.index !== null) {
      datos[estadoEdicion.index] = nuevoAccesorio;
      mostrarMensaje('¡Accesorio actualizado correctamente!', 'success');
    } else {
      nuevoAccesorio.fechaCreacion = new Date().toISOString();
      datos.push(nuevoAccesorio);
      mostrarMensaje('¡Accesorio guardado correctamente!', 'success');
    }
    localStorage.setItem('accesorios', JSON.stringify(datos));
    if (typeof renderTablaAccesorios === 'function') renderTablaAccesorios();
  } catch (error) {
    console.error('Error al guardar el accesorio:', error);
    mostrarMensaje('Ocurrió un error al guardar el accesorio', 'danger');
  } finally {
    form.reset();
    form.classList.remove('was-validated');
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAccesorios'));
    if (modal) modal.hide();
    if (typeof estadoEdicion !== 'undefined') {
      estadoEdicion.tabla = null;
      estadoEdicion.index = null;
      estadoEdicion.modo = 'agregar';
    }
  }
}

// Función global para renderizar la tabla de prendas superiores

// Modal edición para prendas superiores
function editarFilaSuperior(idx) {
  estadoEdicion.tabla = 'superior';
  estadoEdicion.index = idx;
  estadoEdicion.modo = 'editar';
  const fila = document.getElementById('tablaSuperior').rows[idx].cells;
  document.getElementById('prendaSuperior').value = fila[0].innerText;
  document.getElementById('talleSuperior').value = fila[1].innerText;
  document.getElementById('colorSuperior').value = rgb2hex(fila[2].querySelector('div').style.backgroundColor);
  document.getElementById('obsSuperior').value = fila[3].innerText;
  configurarModal('superior', 'editar');
  new bootstrap.Modal(document.getElementById('modalSuperior')).show();
}

function renderTablaSuperior() {
  console.log("renderTablaSuperior llamada");
  const tbody = document.getElementById('tablaSuperior');
  if (!tbody) return;
  tbody.innerHTML = '';
  const datos = JSON.parse(localStorage.getItem('prendasSuperiores') || '[]');
  if (!datos.length) {
    const fila = tbody.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 5;
    celda.className = 'text-center text-muted';
    celda.innerText = 'No hay prendas superiores guardadas.';
    return;
  }
  datos.forEach((item, index) => {
    const fila = agregarFila('tablaSuperior', [
      item.prenda || '',
      item.talle || '',
      item.color || '#ff758c',
      item.observaciones || ''
    ],
    (idx) => editarFilaSuperior(idx),
    (idx) => {
      // Eliminar prenda y refrescar tabla
      datos.splice(idx, 1);
      localStorage.setItem('prendasSuperiores', JSON.stringify(datos));
      renderTablaSuperior();
    });
    fila.setAttribute('data-id', index);
  });
}

// Solo se incluye el bloque de manejo del formSuperior corregido
window.onload = () => {
  if (typeof renderTablaSuperior === 'function') renderTablaSuperior();
  if (typeof renderTablaInferior === 'function') renderTablaInferior();
  if (typeof renderTablaCalzados === 'function') renderTablaCalzados();
  if (typeof renderTablaAccesorios === 'function') renderTablaAccesorios();

  const formSuperior = document.getElementById('formSuperior');
  if (formSuperior) formSuperior.addEventListener('submit', manejarSubmitSuperior);
  const formInferior = document.getElementById('formInferior');
  if (formInferior) formInferior.addEventListener('submit', manejarSubmitInferior);
  const formCalzados = document.getElementById('formCalzados');
  if (formCalzados) formCalzados.addEventListener('submit', manejarSubmitCalzados);
  const formAccesorios = document.getElementById('formAccesorios');
  if (formAccesorios) formAccesorios.addEventListener('submit', manejarSubmitAccesorios);
};

function manejarSubmitSuperior(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
    return;
  }
  const prenda = formatearTexto(document.getElementById('prendaSuperior').value);
  const talle = formatearTexto(document.getElementById('talleSuperior').value);
  const color = document.getElementById('colorSuperior').value;
  const observaciones = formatearTexto(document.getElementById('obsSuperior').value);

  try {
    if (!prenda || !talle) {
      mostrarMensaje('Por favor completa todos los campos requeridos', 'danger');
      return;
    }

    const nuevaPrenda = {
      prenda,
      talle,
      color,
      observaciones,
      fechaActualizacion: new Date().toISOString()
    };

    const datos = JSON.parse(localStorage.getItem('prendasSuperiores') || '[]');

    if (estadoEdicion && estadoEdicion.tabla === 'superior' && estadoEdicion.modo === 'editar' && estadoEdicion.index !== null) {
      datos[estadoEdicion.index] = nuevaPrenda;
      mostrarMensaje('¡Prenda actualizada correctamente!', 'success');
    } else {
      nuevaPrenda.fechaCreacion = new Date().toISOString();
      datos.push(nuevaPrenda);
      mostrarMensaje('¡Prenda guardada correctamente!', 'success');
    }

    localStorage.setItem('prendasSuperiores', JSON.stringify(datos));

    if (typeof renderTablaSuperior === 'function') renderTablaSuperior();
  } catch (error) {
    console.error('Error al guardar la prenda:', error);
    mostrarMensaje('Ocurrió un error al guardar la prenda', 'danger');
  } finally {
    form.reset();
    form.classList.remove('was-validated');
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalSuperior'));
    if (modal) modal.hide();
    if (typeof estadoEdicion !== 'undefined') {
      estadoEdicion.tabla = null;
      estadoEdicion.index = null;
      estadoEdicion.modo = 'agregar';
    }
  }
}
