const form = document.getElementById('form-donacion');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const monto = parseFloat(document.getElementById('monto').value);

  if (!isNaN(monto) && monto > 0) {
    resultado.textContent = `¡Gracias por tu donación de $${monto.toFixed(2)}! Tu apoyo significa mucho.`;
    resultado.classList.remove('d-none');
    resultado.classList.remove('alert-danger');
    resultado.classList.add('alert-success');
    form.reset();
  } else {
    resultado.textContent = 'Por favor ingresa un monto válido.';
    resultado.classList.remove('d-none');
    resultado.classList.remove('alert-success');
    resultado.classList.add('alert-danger');
  }
});
