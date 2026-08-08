const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-content');
const modal = document.querySelector('#contact-modal');
const form = document.querySelector('#contact-form');
const toast = document.querySelector('#toast');

menuButton?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.open-contact').forEach((button) => button.addEventListener('click', () => {
  menu.classList.remove('open');
  modal.showModal();
  setTimeout(() => form.elements.name.focus(), 50);
}));

document.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (event) => {
  const bounds = modal.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) modal.close();
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const subject = String(data.get('subject')).trim();
  const message = String(data.get('message')).trim();
  const submitButton = form.querySelector('button[type="submit"]');
  const originalContent = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
  try {
    if (!window.emailjs) throw new Error('EmailJS no está disponible');
    await emailjs.send('service_w3fjyxp', 'template_snmrid8', {
      name, email, subject, message,
      page: 'Portfolio tecnológico',
      time: new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())
    }, { publicKey: 'Ap18UTM9SwoJnojTl' });
    toast.textContent = '¡Mensaje enviado! Te responderé a la brevedad.';
    toast.className = 'toast success show';
    form.reset();
    setTimeout(() => modal.close(), 700);
  } catch (error) {
    console.error('No se pudo enviar el mensaje:', error);
    toast.textContent = 'No se pudo enviar. Intentá nuevamente o escribime por WhatsApp.';
    toast.className = 'toast error show';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalContent;
    setTimeout(() => { toast.className = 'toast'; }, 4500);
  }
});

document.querySelectorAll('.project-filters button').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.project-filters .active')?.classList.remove('active');
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.project-card').forEach((card) => {
    card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
  });
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-on-scroll').forEach((element) => revealObserver.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
