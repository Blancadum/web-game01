const themeSwitch = document.getElementById('themeSwitch');
const themeStylesheet = document.getElementById('themeStylesheet');
const gameOverModal = document.getElementById('gameOverModal');

themeSwitch.addEventListener('change', function() {
  console.log("Tema cambiado: " + (themeSwitch.checked ? "Nocturno" : "Diurno"));
  // Ocultar el modal si está visible
  gameOverModal.classList.add('hidden');


  if (themeSwitch.checked) {
    themeStylesheet.setAttribute('href', 'assets/css/night.css');
    themeSwitch.nextElementSibling.textContent = "Modo Diurno";
  } else {
    themeStylesheet.setAttribute('href', 'assets/css/day.css');
    themeSwitch.nextElementSibling.textContent = "Modo Nocturno";
  }
});
