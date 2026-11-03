// Calendário simples

let mês = 7; // Julho
let ano = 2026;

function renderizarCalendario() {
  const primeiroDia = new Date(ano, mês - 1, 1).getDay();
  const diasNoMês = new Date(ano, mês, 0).getDate();
  
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  document.getElementById('monthYear').textContent = meses[mês - 1] + ' ' + ano;
  
  let html = '';
  
  // Dias vazios do mês anterior
  for (let i = 0; i < primeiroDia; i++) {
    html += '<div class="calendar-day other-month"></div>';
  }
  
  // Dias do mês
  for (let dia = 1; dia <= diasNoMês; dia++) {
    html += `<div class="calendar-day">${dia}</div>`;
  }
  
  document.getElementById('calendarDays').innerHTML = html;
}

document.getElementById('prevBtn')?.addEventListener('click', function() {
  mês--;
  if (mês < 1) { mês = 12; ano--; }
  renderizarCalendario();
});

document.getElementById('nextBtn')?.addEventListener('click', function() {
  mês++;
  if (mês > 12) { mês = 1; ano++; }
  renderizarCalendario();
});

renderizarCalendario();