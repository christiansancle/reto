document.addEventListener('DOMContentLoaded', () => {
  // --- Posts (ya existentes en tu script) ---
  const form = document.getElementById('postForm');
  const container = document.getElementById('postContainer');

  if (form && container) {
    const cargarPosts = () => {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      container.innerHTML = '';
      posts.reverse().forEach(post => renderizarPost(post));
    };

    const guardarPost = (post) => {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.push(post);
      localStorage.setItem('posts', JSON.stringify(posts));
    };

    const actualizarPosts = (posts) => {
      localStorage.setItem('posts', JSON.stringify(posts));
      cargarPosts();
    };

    const renderizarPost = (post) => {
      const card = document.createElement('div');
      card.className = 'card mb-4';
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${post.titulo}</h5>
          <p class="card-text">${post.contenido}</p>
          ${post.imagen ? `<img src="${post.imagen}" class="img-fluid rounded mb-2">` : ''}
          ${post.video ? `<video src="${post.video}" class="img-fluid rounded mb-2" controls></video>` : ''}
          <button class="btn btn-outline-primary btn-sm like-btn">👍 Me gusta <span class="like-count">${post.likes}</span></button>
          <button class="btn btn-outline-danger btn-sm ms-2 delete-btn">🗑 Eliminar</button>

          <div class="mt-3">
            <form class="reply-form">
              <div class="input-group">
                <input type="text" class="form-control reply-input" placeholder="Escribe una respuesta...">
                <button class="btn btn-secondary" type="submit">Responder</button>
              </div>
            </form>
            <ul class="list-group list-group-flush mt-2">
              ${post.respuestas.map(resp => `<li class="list-group-item">${resp}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      container.prepend(card);

      card.querySelector('.like-btn').addEventListener('click', () => {
        post.likes++;
        actualizarLike(post);
      });

      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de eliminar esta publicación?')) {
          eliminarPost(post);
        }
      });

      card.querySelector('.reply-form').addEventListener('submit', e => {
        e.preventDefault();
        const input = card.querySelector('.reply-input');
        const respuesta = input.value.trim();
        if (respuesta) {
          post.respuestas.push(respuesta);
          input.value = '';
          actualizarPostsActual(post);
        }
      });
    };

    const actualizarLike = (postActual) => {
      let posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts = posts.map(post => post.fecha === postActual.fecha ? postActual : post);
      actualizarPosts(posts);
    };

    const eliminarPost = (postActual) => {
      let posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts = posts.filter(post => post.fecha !== postActual.fecha);
      actualizarPosts(posts);
    };

    const actualizarPostsActual = (postActual) => {
      let posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts = posts.map(post => post.fecha === postActual.fecha ? postActual : post);
      actualizarPosts(posts);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const titulo = document.getElementById('postTitulo').value.trim();
      const contenido = document.getElementById('postContenido').value.trim();
      const archivo = document.getElementById('postArchivo').files[0];
      let imagen = '', video = '';

      if (archivo) {
        const url = URL.createObjectURL(archivo);
        if (archivo.type.startsWith('image')) {
          imagen = url;
        } else if (archivo.type.startsWith('video')) {
          video = url;
        }
      }

      if (titulo && contenido) {
        const nuevoPost = {
          titulo,
          contenido,
          imagen,
          video,
          likes: 0,
          respuestas: [],
          fecha: Date.now()
        };
        guardarPost(nuevoPost);
        cargarPosts();
        form.reset();
      }
    });

    cargarPosts();
  }

  // --- Donaciones ---
  const paymentMethod = document.getElementById('paymentMethod');
  const paypalFields = document.getElementById('paypalFields');
  const nequiFields = document.getElementById('nequiFields');
  const donationForm = document.getElementById('donationForm');

  if (paymentMethod && donationForm) {
    paymentMethod.addEventListener('change', () => {
      const selected = paymentMethod.value;
      paypalFields.classList.toggle('d-none', selected !== 'paypal');
      nequiFields.classList.toggle('d-none', selected !== 'nequi');
    });

    donationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const method = paymentMethod.value;
      const amount = document.getElementById('amount').value.trim();
      const email = document.getElementById('paypalEmail').value.trim();
      const phone = document.getElementById('nequiPhone').value.trim();

      if (!method) {
        alert('Por favor selecciona un método de pago.');
        return;
      }

      if (!amount || parseInt(amount) < 1) {
        alert('Ingresa un monto válido.');
        return;
      }

      if (method === 'paypal') {
        if (!email || !email.includes('@')) {
          alert('Por favor ingresa un correo electrónico válido para PayPal.');
          return;
        }
        alert(`¡Gracias por tu donación de $${amount} COP vía PayPal! Correo: ${email}`);
      }

      if (method === 'nequi') {
        if (!phone.match(/^\d{10}$/)) {
          alert('Por favor ingresa un número de teléfono válido de 10 dígitos para Nequi.');
          return;
        }
        alert(`¡Gracias por tu donación de $${amount} COP vía Nequi! Teléfono: ${phone}`);
      }

      // Cierra el modal y limpia
      const modal = bootstrap.Modal.getInstance(document.getElementById('donationModal'));
      modal.hide();
      donationForm.reset();
      paypalFields.classList.add('d-none');
      nequiFields.classList.add('d-none');
    });
  }
});
