const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
const modal = document.querySelector('#contact-modal');
const contactForm = document.querySelector('#contact-form');
const toast = document.querySelector('#toast');

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = carousel.querySelector('.slides');
  const total = slides.children.length;
  const counter = carousel.querySelector('.counter');
  let current = 0;
  const update = () => {
    slides.style.transform = `translateX(-${current * 100}%)`;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  };
  carousel.querySelector('.next').addEventListener('click', () => { current = (current + 1) % total; update(); });
  carousel.querySelector('.prev').addEventListener('click', () => { current = (current - 1 + total) % total; update(); });
});

document.querySelectorAll('.open-contact').forEach((button) => button.addEventListener('click', () => {
  modal.showModal();
  setTimeout(() => contactForm.elements.name.focus(), 50);
}));
document.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (event) => {
  const box = modal.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) modal.close();
});
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const subject = String(data.get('subject')).trim();
  const message = String(data.get('message')).trim();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalContent = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
  try {
    if (!window.emailjs) throw new Error('EmailJS no está disponible');
    await emailjs.send('service_w3fjyxp', 'template_snmrid8', {
      name, email, subject, message,
      page: 'Portfolio industrial',
      time: new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())
    }, { publicKey: 'Ap18UTM9SwoJnojTl' });
    toast.textContent = '¡Mensaje enviado! Te responderé a la brevedad.';
    toast.className = 'toast success show';
    contactForm.reset();
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

const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); currentObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
