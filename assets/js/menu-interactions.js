document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section"); // Todas las secciones
  const menuLinks = document.querySelectorAll(".navbar .nav-link"); 
  const playLink = document.getElementById('click'); // Cambiado de "playLink" a "click"
  const coverScreen = document.getElementById('coverScreen');
  const playSection = document.getElementById('playWindow');

  function showSection(sectionId) {
      sections.forEach(section => {
          section.classList.toggle("hidden", section.id !== sectionId); // Mostrar/ocultar secciones
      });
  }

  menuLinks.forEach(link => {
      link.addEventListener("click", (event) => {
          event.preventDefault();
          const sectionId = link.getAttribute("href").substring(1); 
          showSection(sectionId);
      });
  });

  showSection("coverScreen"); // Mostrar sección inicial

  // Configurar el clic en el botón "Play" si el elemento existe
  if (playLink && coverScreen && playSection) {
      playLink.addEventListener('click', (event) => {
          event.preventDefault();
          coverScreen.classList.add('hidden');
          playSection.classList.remove('hidden');
          menuLinks.forEach(link => link.classList.remove('active'));
          playLink.classList.add('active');
      });
  } else {
      console.warn("Algunos elementos necesarios no se encontraron en el DOM.");
  }
});

