document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (hamburgerButton && mobileMenu && hamburgerIcon && closeIcon) {
        hamburgerButton.addEventListener('click', () => {
            const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
            hamburgerButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            // Asegúrate de que 'flex' sea la clase correcta para mostrar tu menú si no es 'block'
            // Si tu menú usa 'block' para mostrarse, cambia 'flex' por 'block' aquí.
            mobileMenu.classList.toggle('flex'); 
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }
    
    // --- Smooth Scroll and Close Menu ---
    window.closeMenuAndScrollToSection = function(sectionId) {
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            if (hamburgerButton) hamburgerButton.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex'); // o 'block' si es el caso
            if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        }
        // Scroll to section
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // --- Current Year in Footer ---
    const currentYearFooter = document.getElementById('currentYearFooter');
    if (currentYearFooter) {
        currentYearFooter.textContent = new Date().getFullYear();
    }

    // --- Carousel Functionality ---
    const carousels = document.querySelectorAll('.project-item-carousel');
    carousels.forEach(carousel => {
        const imagesContainer = carousel.querySelector('.carousel-images');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        
        if (imagesContainer && prevButton && nextButton) {
            const imageWidth = () => {
                // Intenta obtener el ancho de la primera imagen visible o el contenedor
                const firstImage = imagesContainer.querySelector('img:not([style*="display: none"])');
                return firstImage ? firstImage.clientWidth : imagesContainer.clientWidth;
            };

            nextButton.addEventListener('click', () => {
                imagesContainer.scrollBy({ left: imageWidth(), behavior: 'smooth' });
            });

            prevButton.addEventListener('click', () => {
                imagesContainer.scrollBy({ left: -imageWidth(), behavior: 'smooth' });
            });
        }
    });

    // --- Contact Modal Functionality ---
    const contactModal = document.getElementById('contactModal');
    const openModalButton = document.getElementById('openContactModalButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const contactForm = document.getElementById('contactForm');
    const successToast = document.getElementById('successToast');
    const formErrorMessage = document.getElementById('formErrorMessage'); // Para mostrar errores
    const submitContactFormButton = document.getElementById('submitContactFormButton'); // Botón de envío

    // Reemplaza con tus IDs de EmailJS
    const EMAILJS_SERVICE_ID = 'service_w3fjyxp';
    const EMAILJS_TEMPLATE_ID = 'template_snmrid8';
    const EMAILJS_USER_ID = 'Ap18UTM9SwoJnojTl'; // O Public Key

    function openModal() {
        if (contactModal) {
            contactModal.classList.remove('hidden');
            contactModal.classList.add('flex'); // Para centrar con Flexbox
            document.body.classList.add('overflow-hidden'); // Evitar scroll del fondo
        }
        if (formErrorMessage) formErrorMessage.classList.add('hidden'); // Ocultar errores al abrir
    }

    function closeModal() {
        if (contactModal) {
            contactModal.classList.add('hidden');
            contactModal.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
            if (contactForm) contactForm.reset(); // Limpiar el formulario al cerrar
            if (formErrorMessage) formErrorMessage.classList.add('hidden'); // Ocultar errores al cerrar
        }
    }

    function showSuccessToast() {
        if (successToast) {
            successToast.classList.remove('hidden');
            setTimeout(() => {
                successToast.classList.add('hidden');
            }, 3000); // El mensaje desaparece después de 3 segundos
        }
    }

    if (openModalButton) {
        openModalButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir cualquier comportamiento por defecto del botón
            openModal();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Cerrar modal si se hace clic fuera de su contenido
    if (contactModal) {
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) { // Si el clic fue en el fondo del modal
                closeModal();
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevenir el envío real del formulario

            if (formErrorMessage) formErrorMessage.classList.add('hidden'); // Ocultar mensaje de error previo
            if (submitContactFormButton) {
                submitContactFormButton.disabled = true;
                submitContactFormButton.textContent = 'Enviando...';
            }

            const formData = new FormData(contactForm);
            const emailRemitente = formData.get('emailRemitente');
            const asunto = formData.get('asunto');
            const mensaje = formData.get('mensaje');
            const name = formData.get('name'); 

            if (!emailRemitente || !asunto || !mensaje || !name) { // Añadir 'name' a la validación
                if (formErrorMessage) {
                     formErrorMessage.textContent = 'Todos los campos (Email, Asunto, Nombre y Mensaje) son obligatorios.';
                    formErrorMessage.classList.remove('hidden');
                }
                if (submitContactFormButton) {
                    submitContactFormButton.disabled = false;
                    submitContactFormButton.textContent = 'Enviar Mensaje';
                }
                return;
            }

            if (!validateEmail(emailRemitente)) {
                if (formErrorMessage) {
                    formErrorMessage.textContent = 'Por favor, introduce un email válido.';
                    formErrorMessage.classList.remove('hidden');
                }
                if (submitContactFormButton) {
                    submitContactFormButton.disabled = false;
                    submitContactFormButton.textContent = 'Enviar Mensaje';
                }
                return;
            }

            // Parámetros para EmailJS (asegúrate que coincidan con tu plantilla de EmailJS)
            // Tu plantilla en EmailJS debe tener variables como {{emailRemitente}}, {{asunto}}, {{mensaje}}
            const templateParams = {
                name: name,
                emailRemitente: emailRemitente,
                asunto: asunto,
                mensaje: mensaje,
                // Puedes añadir más parámetros si los tienes en tu plantilla de EmailJS
                // por ejemplo, to_name: "Agustin" (si quieres que el email diga "Hola Agustin")
            };

            try {
                // Llamada real a EmailJS usando las constantes definidas
                // Asegúrate de haber inicializado EmailJS en tu HTML con tu Public Key:
                // emailjs.init({ publicKey: "Ap18UTM9SwoJnojTl" });
                console.log("Intentando enviar con EmailJS. Service ID:", EMAILJS_SERVICE_ID, "Template ID:", EMAILJS_TEMPLATE_ID);
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                console.log("EmailJS respondió, el mensaje debería haberse enviado.");

                closeModal();
                showSuccessToast();
            } catch (error) {
                console.error('Error al enviar el email:', error);
                if (formErrorMessage) {
                    formErrorMessage.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo más tarde.';
                    formErrorMessage.classList.remove('hidden');
                }
            } finally {
                if (submitContactFormButton) {
                    submitContactFormButton.disabled = false;
                    submitContactFormButton.textContent = 'Enviar Mensaje';
                }
            }
        });
    }
});
