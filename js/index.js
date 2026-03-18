
// --- SUPABASE CONFIGURACIÓN ---
const SUPABASE_URL = 'https://fhvinwdaaybnwxpsivsi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodmlud2RhYXlibnd4cHNpdnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjg2OTMsImV4cCI6MjA4ODk0NDY5M30.S0wYDW7utGuqRRCMu-k9w8FQ9mAWkk-92aX_GzZJ08E';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarProductos() {
  const { data, error } = await supabaseClient
    .from('productos')
    .select('*');
  if (error) return;
  renderizarProductos(data);
  renderizarBotonesFiltro(data);
}

function renderizarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = '';
  if (productos && productos.length) {
    const template = document.getElementById('plantilla-producto');
    productos.forEach((producto, idx) => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector('.tarjeta-producto');
      card.setAttribute('data-idx', idx);
      const img = card.querySelector('img');
      img.src = producto.imagen_url;
      img.alt = producto.nombre;
      card.querySelector('h3').textContent = producto.nombre;
      card.querySelector('.descripcion-producto').textContent = producto.descripcion;
      card.querySelector('.precio-producto').textContent = producto.precio ? `$${producto.precio.toLocaleString('es-CL', {minimumFractionDigits: 0})}` : '';
      card.querySelector('.cantidad-producto').textContent = `Cantidad: ${producto.cantidad}`;
      card.onclick = function() {
        mostrarModal(productos[idx]);
      };
      contenedor.appendChild(clone);
    });
  } else {
    contenedor.innerHTML = '<p>No hay productos en esta categoría.</p>';
  }
}

function mostrarModal(producto) {
  // Eliminar cualquier modal anterior
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = '';
  const template = document.getElementById('plantilla-modal-producto');
  const clone = template.content.cloneNode(true);
  const modal = clone.querySelector('.modal');
  // Rellenar datos principales
  const imgPrincipal = clone.querySelector('.modal-img-principal');
  imgPrincipal.src = producto.imagen_url;
  imgPrincipal.alt = producto.nombre;
  clone.querySelector('.modal-titulo').textContent = producto.nombre;
  // Descripción corta y completa
  const descCorta = producto.descripcion?.length > 60 ? producto.descripcion.slice(0, 60) + '...' : producto.descripcion;
  clone.querySelector('.modal-descripcion-corta').textContent = descCorta;
  // Botón ver más
  const btnVerMas = clone.querySelector('.modal-ver-mas');
  btnVerMas.onclick = function() {
    clone.querySelector('.modal-descripcion-corta').textContent = producto.descripcion;
    btnVerMas.style.display = 'none';
  };
  // Precio
  clone.querySelector('.modal-precio').textContent = producto.precio ? `CLP$  ${producto.precio.toLocaleString('es-CL', {minimumFractionDigits: 0})}` : '';
  // Cantidad (input y botones)
  const inputCantidad = clone.querySelector('.modal-cantidad-input');
  inputCantidad.value = 1;
  inputCantidad.max = producto.cantidad;
  clone.querySelector('.modal-cantidad-menos').onclick = function() {
    if (parseInt(inputCantidad.value) > 1) inputCantidad.value--;
  };
  clone.querySelector('.modal-cantidad-mas').onclick = function() {
    if (parseInt(inputCantidad.value) < producto.cantidad) inputCantidad.value++;
  };
  // Botón agregar al carrito (solo visual)
  clone.querySelector('.modal-agregar-carrito').onclick = function() {
    alert('Producto agregado (demo visual)');
  };
  // Botón calificar (solo visual)
  clone.querySelector('.modal-calificar').onclick = function() {
    alert('¡Gracias por tu calificación! (demo visual)');
  };
  // Mostrar modal
  modal.style.display = 'block';
  // Cerrar modal al hacer click en la X
  clone.querySelector('.cerrar-modal').onclick = function() {
    modal.style.display = 'none';
    setTimeout(() => { modalContainer.innerHTML = ''; }, 300);
  };
  // Cerrar modal al hacer click fuera del contenido
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      setTimeout(() => { modalContainer.innerHTML = ''; }, 300);
    }
  };
  modalContainer.appendChild(clone);
}



function renderizarBotonesFiltro(productos) {
  const contenedor = document.querySelector('.contenedor-filtros');
  if (!contenedor) return;
  const btns = contenedor.querySelectorAll('.btn');
  btns.forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      activarBoton(btn);
      const filtro = btn.getAttribute('data-categoria');
      if (!filtro || filtro === 'todos') {
        renderizarProductos(productos);
      } else {
        renderizarProductos(productos.filter(p => String(p.categoria)=== filtro));
      }
    };
  });
}

function activarBoton(boton) {
  const current = document.querySelector('.filtros.btn.active');
  if (current) current.classList.remove('active');
  boton.classList.add('active');
}

document.addEventListener("DOMContentLoaded", cargarProductos);



// La lógica del modal ahora está centralizada en mostrarModal()

