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

