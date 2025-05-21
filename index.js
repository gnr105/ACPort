const filterContainer = document.querySelector(".gallery_categories");
const galleryItems = document.querySelectorAll(".project_card");

filterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("filter-item")) {
        // Remover clase 'active' del elemento actualmente activo
        const currentActive = filterContainer.querySelector(".active");
        if (currentActive) {
            currentActive.classList.remove("active");
        }
        // Añadir clase 'active' al elemento clickeado
        event.target.classList.add("active");

        const filterValue = event.target.getAttribute("data-filter");

        galleryItems.forEach(item => {
            if (filterValue === "all" || item.classList.contains(filterValue)) {
                item.classList.remove("hide");
                item.classList.add("show");
            } else {
                item.classList.remove("show");
                item.classList.add("hide");
            }
        });
    }
});

function scrollToSection(sectionId){
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({behavior:"smooth"});
    } else {
        console.warn(`La sección con ID '${sectionId}' no fue encontrada.`);
    }
}
// En index.js
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length === 0) {
        // Opcional: un mensaje en la consola si no se encuentran elementos para animar.
        // console.log("No se encontraron elementos con la clase .reveal-on-scroll para animar.");
        return;
    }

    const revealObserverOptions = {
        root: null, // Observa en relación con el viewport del documento
        threshold: 0.1, // El callback se ejecuta cuando al menos el 10% del elemento está visible
        // rootMargin: "0px 0px -50px 0px" // Opcional: ajusta el margen para disparar la animación un poco antes/después
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Deja de observar el elemento una vez que es visible (buena práctica para el rendimiento)
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el); // Comienza a observar cada elemento marcado
    });
});


