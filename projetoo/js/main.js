/*
 * =====================================================
 * ARQUIVO: main.js
 * =====================================================
 *
 * RESPONSABILIDADE:
 * Centralizar as interações compartilhadas do portal,
 * incluindo navegação, menu mobile, notificações e
 * validação dos formulários existentes.
 *
 * =====================================================
 */

// ==================================================
// MENU RESPONSIVO E NAVEGAÇÃO GLOBAL
// Cria um controle acessível para abrir e fechar a
// navegação em telas pequenas e mantém os links novos
// disponíveis nas páginas legadas do portal.
// ==================================================
function prepararNavegacao() {
  const nav = document.querySelector('header nav');
  if (!nav) return;

  const linksEssenciais = [
    { href: 'esportes.html', label: 'Esportes' },
    { href: 'editais.html', label: 'Editais' }
  ];

  linksEssenciais.forEach(({ href, label }) => {
    if (!Array.from(nav.querySelectorAll('a')).some(link => link.getAttribute('href') === href)) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      nav.appendChild(link);
    }
  });

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'menu-toggle';
  menuButton.setAttribute('aria-controls', nav.id || 'menu-principal');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
  menuButton.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';

  if (!nav.id) nav.id = 'menu-principal';
  nav.parentElement.insertBefore(menuButton, nav);

  menuButton.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(aberto));
    menuButton.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });
}

function marcarLinkAtivo() {
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    if (link.href.includes(window.location.pathname.split('/').pop())) {
      link.classList.add('active');
    }
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.minWidth = '260px';
  notification.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.25s ease';
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.opacity = '1';
  });

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.addEventListener('transitionend', () => notification.remove(), { once: true });
  }, 3200);
}

// ==================================================
// DADOS LOCAIS DO PORTAL
// Mantém as publicações no navegador para que criar,
// editar e excluir notícias continue funcionando mesmo
// ao trocar de página. Em produção, esta camada deve ser
// substituída por uma API com autenticação no servidor.
// ==================================================
const STORAGE_KEYS = {
  news: 'conectaCampusNoticias',
  sports: 'conectaCampusEsportes',
  editais: 'conectaCampusEditais',
  avisos: 'conectaCampusAvisos',
  adminSession: 'conectaCampusAdminSession'
};

const noticiasIniciais = [
  { id: 'seed-1', titulo: 'Encerramento da Copa IFMA de Ribamar', categoria: 'evento', dataEvento: '2026-07-07', conteudo: 'Hoje é o grande dia do encerramento da Copa IFMA do campus! Acompanhe as finais das modalidades esportivas e celebre com os atletas de Ribamar.', autor: 'Comunicação IFMA', tags: 'esportes, evento', criadoEm: '2026-07-07' },
  { id: 'seed-2', titulo: 'Eleições do Grêmio Guimarães 2026', categoria: 'noticia', dataEvento: '2026-07-07', conteudo: 'Eleições para a posse de duas chapas concorrentes do Grêmio Guimarães. Vote e participe da vida estudantil.', autor: 'Grêmio Guimarães', tags: 'estudantes, eleição', criadoEm: '2026-07-06' },
  { id: 'seed-3', titulo: 'Inauguração do NEABI', categoria: 'noticia', dataEvento: '2026-07-06', conteudo: 'O Núcleo de Estudos Afro-Brasileiros e Indígenas foi oficialmente inaugurado. Conheça suas ações de inclusão e valorização das diversidades.', autor: 'IFMA SJR', tags: 'inclusão, campus', criadoEm: '2026-07-06' },
  { id: 'seed-4', titulo: 'Festa Junina do Campus', categoria: 'evento', dataEvento: '2026-07-10', conteudo: 'Venha celebrar a cultura nordestina em nossa Festa Junina, com comidas típicas, danças e música ao vivo.', autor: 'Comissão de Eventos', tags: 'cultura, evento', criadoEm: '2026-07-05' },
  { id: 'seed-5', titulo: 'Semana Avaliativa Chegando', categoria: 'noticia', dataEvento: '', conteudo: 'A semana avaliativa está chegando. Prepare-se para os testes e procure seus professores em caso de dúvidas.', autor: 'Coordenação Pedagógica', tags: 'avaliação, estudantes', criadoEm: '2026-07-04' },
  { id: 'seed-6', titulo: 'Encerramento do 2º Bimestre e Férias', categoria: 'aviso', dataEvento: '2026-07-20', conteudo: 'O segundo bimestre encerra no dia 20 de julho. Em seguida começam as férias escolares.', autor: 'Secretaria Acadêmica', tags: 'calendário, férias', criadoEm: '2026-07-03' }
];

const esportesIniciais = [
  { id: 'sport-1', modalidade: 'Futsal', equipeA: 'Informática', equipeB: 'Eletrônica', placarA: 3, placarB: 2, data: '2026-07-07', hora: '15:00', status: 'finalizado' },
  { id: 'sport-2', modalidade: 'Futsal', equipeA: 'Administração', equipeB: 'Jogos Digitais', placarA: 0, placarB: 0, data: '2026-07-12', hora: '15:00', status: 'agendado' }
];

const editaisIniciais = [
  { id: 'edital-1', titulo: 'Iniciação científica PIBIC', area: 'pesquisa', status: 'aberto', abertura: '2026-07-01', encerramento: '2026-08-30', agencia: 'IFMA / CNPq', descricao: 'Seleção de projetos e estudantes para bolsas de pesquisa do ciclo 2026-2027.' },
  { id: 'edital-2', titulo: 'Bolsa permanência', area: 'bolsas', status: 'breve', abertura: '2026-08-01', encerramento: '2026-09-30', agencia: 'IFMA', descricao: 'Programa de apoio à permanência e ao desenvolvimento acadêmico dos estudantes.' },
  { id: 'edital-3', titulo: 'Projetos de extensão', area: 'extensao', status: 'aberto', abertura: '2026-06-15', encerramento: '2026-09-12', agencia: 'IFMA', descricao: 'Chamada para ações que conectem o conhecimento do campus às necessidades da comunidade.' }
];

const avisosIniciais = [
  { id: 'aviso-1', titulo: 'Final da Copa IFMA - Hoje!', gravidade: 'urgente', data: '2026-07-07', conteudo: 'Acompanhe as finais das modalidades esportivas e celebre com os atletas de Ribamar.' },
  { id: 'aviso-2', titulo: 'Refeitório em construção', gravidade: 'importante', data: '2026-07-07', conteudo: 'O refeitório está em fase de construção e reformulação. Atualizações serão informadas em breve.' },
  { id: 'aviso-3', titulo: 'Atualização do Conecta Campus', gravidade: 'leve', data: '2026-07-07', conteudo: 'O portal está recebendo novas funcionalidades e melhorias.' }
];

function obterNoticias() {
  const armazenadas = localStorage.getItem(STORAGE_KEYS.news);
  if (!armazenadas) {
    localStorage.setItem(STORAGE_KEYS.news, JSON.stringify(noticiasIniciais));
    return [...noticiasIniciais];
  }

  try {
    return JSON.parse(armazenadas);
  } catch (erro) {
    localStorage.setItem(STORAGE_KEYS.news, JSON.stringify(noticiasIniciais));
    return [...noticiasIniciais];
  }
}

function salvarNoticias(noticias) {
  localStorage.setItem(STORAGE_KEYS.news, JSON.stringify(noticias));
}

// Lê uma coleção administrativa e cria seus registros iniciais
// apenas na primeira visita, preservando alterações posteriores.
function obterColecao(chave, iniciais) {
  const armazenadas = localStorage.getItem(chave);
  if (!armazenadas) {
    localStorage.setItem(chave, JSON.stringify(iniciais));
    return [...iniciais];
  }
  try {
    return JSON.parse(armazenadas);
  } catch (erro) {
    localStorage.setItem(chave, JSON.stringify(iniciais));
    return [...iniciais];
  }
}

function salvarColecao(chave, itens) {
  localStorage.setItem(chave, JSON.stringify(itens));
}

function obterEsportes() { return obterColecao(STORAGE_KEYS.sports, esportesIniciais); }
function obterEditais() { return obterColecao(STORAGE_KEYS.editais, editaisIniciais); }
function obterAvisos() { return obterColecao(STORAGE_KEYS.avisos, avisosIniciais); }

function usuarioAdministrativoAutenticado() {
  return Boolean(sessionStorage.getItem(STORAGE_KEYS.adminSession) || localStorage.getItem(STORAGE_KEYS.adminSession));
}

function escaparHtml(valor) {
  const elemento = document.createElement('div');
  elemento.textContent = valor || '';
  return elemento.innerHTML;
}

function formatarData(data) {
  if (!data) return 'Sem data definida';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${data}T12:00:00`));
}

function rotuloCategoria(categoria) {
  const rotulos = { noticia: 'Notícia', aviso: 'Aviso', evento: 'Evento', seminario: 'Seminário', edital: 'Edital' };
  return rotulos[categoria] || 'Publicação';
}

// ==================================================
// RENDERIZAÇÃO DO MURAL
// Substitui os cards estáticos por dados persistidos e
// oferece uma leitura pública sempre atualizada.
// ==================================================
function renderizarNoticias() {
  const lista = document.querySelector('[data-news-list]');
  if (!lista) return;

  lista.innerHTML = obterNoticias().map(noticia => `<article class="card highlight animate-fade-in">
    <div class="card-header"><span class="badge">${escaparHtml(rotuloCategoria(noticia.categoria))}</span><time class="text-muted">${escaparHtml(formatarData(noticia.criadoEm))}</time></div>
    <h3>${escaparHtml(noticia.titulo)}</h3>
    <p>${escaparHtml(noticia.conteudo)}</p>
    <small class="text-muted">Por ${escaparHtml(noticia.autor)}${noticia.dataEvento ? ` · Evento: ${escaparHtml(formatarData(noticia.dataEvento))}` : ''}</small>
  </article>`).join('');
}

// Renderiza jogos e placares administrados no painel.
function renderizarEsportes() {
  const resultados = document.querySelectorAll('[data-sports-results]');
  const proximos = document.querySelector('[data-sports-upcoming]');
  if (resultados.length === 0 && !proximos) return;
  const jogos = obterEsportes();
  const card = jogo => `<article class="card editorial-card"><div class="card-header"><span class="badge badge-secondary">${escaparHtml(jogo.modalidade)}</span><time class="text-muted">${escaparHtml(formatarData(jogo.data))}</time></div><h3>${escaparHtml(jogo.equipeA)} x ${escaparHtml(jogo.equipeB)}</h3><div class="score-row"><span>${escaparHtml(jogo.equipeA)}</span><strong>${jogo.placarA} x ${jogo.placarB}</strong><span>${escaparHtml(jogo.equipeB)}</span></div><p class="text-center status-${jogo.status}">${escaparHtml(jogo.status === 'finalizado' ? 'Finalizada' : jogo.status === 'andamento' ? 'Em andamento' : `Agendada${jogo.hora ? ` · ${jogo.hora}` : ''}`)}</p></article>`;
  resultados.forEach(resultado => { resultado.innerHTML = jogos.filter(jogo => jogo.status !== 'agendado').map(card).join(''); });
  if (proximos) proximos.innerHTML = jogos.filter(jogo => jogo.status === 'agendado').map(card).join('');
}

// Renderiza editais persistidos para o mural de oportunidades.
function renderizarEditais() {
  const lista = document.querySelector('[data-public-editais]');
  const tabela = document.querySelector('[data-public-editais-table] tbody');
  if (!lista && !tabela) return;
  const editais = obterEditais();
  const area = { pesquisa: 'Pesquisa', extensao: 'Extensão', bolsas: 'Bolsas', academico: 'Acadêmico' };
  const status = { aberto: 'Aberto', breve: 'Em breve', encerrado: 'Encerrado' };
  if (lista) lista.innerHTML = editais.map(edital => `<article class="card editorial-card edital-card" data-area="${edital.area}" data-status="${edital.status}" data-search="${escaparHtml(`${edital.titulo} ${edital.descricao}`.toLowerCase())}"><div class="card-header"><span class="badge ${edital.status === 'aberto' ? 'badge-success' : edital.status === 'breve' ? 'badge-warning' : 'badge-error'}">${status[edital.status]}</span><span class="text-muted">Até ${escaparHtml(formatarData(edital.encerramento))}</span></div><h3>${escaparHtml(edital.titulo)}</h3><p>${escaparHtml(edital.descricao)}</p><small class="text-muted">${escaparHtml(area[edital.area])} · ${escaparHtml(edital.agencia)}</small></article>`).join('');
  if (tabela) tabela.innerHTML = editais.map(edital => `<tr><td>${escaparHtml(edital.titulo)}</td><td>${escaparHtml(formatarData(edital.abertura))}</td><td>${escaparHtml(formatarData(edital.encerramento))}</td><td>${escaparHtml(edital.agencia)}</td><td class="status-${edital.status === 'aberto' ? 'open' : edital.status === 'breve' ? 'soon' : 'closed'}">${status[edital.status]}</td><td><span class="text-muted">${escaparHtml(area[edital.area])}</span></td></tr>`).join('');
}

// Renderiza avisos com sua gravidade visual e textual.
function renderizarAvisos() {
  const lista = document.querySelector('[data-public-avisos]');
  if (!lista) return;
  const nomes = { urgente: 'Urgente', importante: 'Importante', leve: 'Leve' };
  const classes = { urgente: 'badge-error', importante: 'badge-warning', leve: 'badge-success' };
  lista.innerHTML = obterAvisos().map(aviso => `<article class="card highlight aviso-${aviso.gravidade}"><div class="card-header"><span class="badge ${classes[aviso.gravidade]}">${nomes[aviso.gravidade]}</span><time class="text-muted">${escaparHtml(formatarData(aviso.data))}</time></div><h3>${escaparHtml(aviso.titulo)}</h3><p>${escaparHtml(aviso.conteudo)}</p></article>`).join('');
}

function attachCadastroFormHandler() {
  const form = document.getElementById('formCadastro');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const conteudo = document.getElementById('conteudo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const dataEvento = document.getElementById('dataEvento').value;
    const tags = document.getElementById('tags').value.trim();
    const imagem = document.getElementById('imagem');

    if (titulo.length < 5 || !categoria || !autor) {
      window.connectaCampus.showNotification('Preencha título, categoria e autor.', 'error');
      return;
    }

    if (conteudo.length < 10) {
      window.connectaCampus.showNotification('O conteúdo deve ter no mínimo 10 caracteres', 'error');
      return;
    }

    const novaNoticia = { id: `news-${Date.now()}`, titulo, categoria, conteudo, autor, dataEvento, tags, criadoEm: new Date().toISOString().slice(0, 10) };
    const arquivo = imagem?.files?.[0];
    if (arquivo) {
      if (!arquivo.type.startsWith('image/') || arquivo.size > 5 * 1024 * 1024) {
        window.connectaCampus.showNotification('Escolha uma imagem de até 5 MB.', 'error');
        return;
      }
      novaNoticia.imagem = URL.createObjectURL(arquivo);
    }

    salvarNoticias([novaNoticia, ...obterNoticias()]);
    window.connectaCampus.showNotification('✓ Notícia publicada com sucesso!', 'success');
    setTimeout(() => { window.location.href = 'noticias.html'; }, 700);
  });
}

function attachAdminLoginFormHandler() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;

    if (usuario.length < 3) {
      window.connectaCampus.showNotification('Usuário deve ter no mínimo 3 caracteres', 'error');
      return;
    }

    if (senha.length < 6) {
      window.connectaCampus.showNotification('Senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }

    if (!((usuario === 'admin' || usuario === 'admin@ifma.edu.br') && senha === 'admin123')) {
      window.connectaCampus.showNotification('Usuário ou senha administrativos inválidos.', 'error');
      return;
    }

    const lembrar = document.getElementById('lembrar')?.checked;
    const armazenamento = lembrar ? localStorage : sessionStorage;
    armazenamento.setItem(STORAGE_KEYS.adminSession, JSON.stringify({ usuario, loginEm: Date.now() }));
    window.connectaCampus.showNotification('✓ Login realizado com sucesso!', 'success');
    setTimeout(() => { window.location.href = 'admin.html'; }, 700);
  });
}

// ==================================================
// PAINEL ADMINISTRATIVO
// Protege o painel e permite editar ou excluir registros
// persistidos no mesmo armazenamento usado pelo mural.
// ==================================================
function prepararPainelAdministrativo() {
  const painel = document.querySelector('[data-admin-panel]');
  if (!painel) return;
  if (!usuarioAdministrativoAutenticado()) {
    window.location.href = 'login_administrativo.html';
    return;
  }

  const colecoes = {
    noticias: { chave: STORAGE_KEYS.news, obter: obterNoticias, lista: '[data-admin-list="noticias"]', form: '#adminNewsForm', titulo: 'Publicação', campos: ['titulo', 'categoria', 'dataEvento', 'conteudo', 'autor', 'tags'] },
    esportes: { chave: STORAGE_KEYS.sports, obter: obterEsportes, lista: '[data-admin-list="esportes"]', form: '#adminSportsForm', titulo: 'Jogo', campos: ['modalidade', 'equipeA', 'equipeB', 'placarA', 'placarB', 'data', 'hora', 'status'] },
    editais: { chave: STORAGE_KEYS.editais, obter: obterEditais, lista: '[data-admin-list="editais"]', form: '#adminEditaisForm', titulo: 'Edital', campos: ['titulo', 'area', 'status', 'abertura', 'encerramento', 'agencia', 'descricao'] },
    avisos: { chave: STORAGE_KEYS.avisos, obter: obterAvisos, lista: '[data-admin-list="avisos"]', form: '#adminAvisosForm', titulo: 'Aviso', campos: ['titulo', 'gravidade', 'data', 'conteudo'] }
  };
  const estado = Object.fromEntries(Object.keys(colecoes).map(nome => [nome, null]));

  const valorResumo = (nome, item) => {
    if (nome === 'noticias') return `${item.conteudo.slice(0, 140)}${item.conteudo.length > 140 ? '...' : ''}`;
    if (nome === 'esportes') return `${item.equipeA} ${item.placarA} x ${item.placarB} ${item.equipeB} · ${formatarData(item.data)}`;
    if (nome === 'editais') return `${item.descricao} · ${item.agencia}`;
    return `${item.conteudo} · Gravidade: ${item.gravidade}`;
  };

  const renderizar = nome => {
    const config = colecoes[nome];
    const lista = painel.querySelector(config.lista);
    const itens = config.obter();
    lista.innerHTML = itens.length ? itens.map(item => `<article class="admin-item"><div><span class="badge">${escaparHtml(nome === 'avisos' ? item.gravidade : config.titulo)}</span><h3>${escaparHtml(item.titulo || `${item.modalidade}: ${item.equipeA} x ${item.equipeB}`)}</h3><p>${escaparHtml(valorResumo(nome, item))}</p><small>${escaparHtml(item.autor || item.status || '')}</small></div><div class="admin-item-actions"><button type="button" class="btn btn-small" data-collection="${nome}" data-edit-id="${item.id}">Editar</button><button type="button" class="btn btn-small btn-danger" data-collection="${nome}" data-delete-id="${item.id}">Excluir</button></div></article>`).join('') : '<p class="admin-empty">Nenhum item cadastrado.</p>';
  };

  const preencher = (nome, item) => {
    const form = painel.querySelector(colecoes[nome].form);
    colecoes[nome].campos.forEach(campo => { if (form.elements[campo]) form.elements[campo].value = item[campo] ?? ''; });
    estado[nome] = item.id;
    form.querySelector('[type="submit"]').textContent = `Salvar alterações`;
    form.scrollIntoView({ behavior: 'smooth' });
  };

  const configurarColecao = nome => {
    const config = colecoes[nome];
    const lista = painel.querySelector(config.lista);
    const form = painel.querySelector(config.form);
    if (!lista || !form) return;
    lista.addEventListener('click', evento => {
      const botao = evento.target.closest('[data-edit-id], [data-delete-id]');
      if (!botao) return;
      const itens = config.obter();
      if (botao.dataset.editId) preencher(nome, itens.find(item => item.id === botao.dataset.editId));
      if (botao.dataset.deleteId && window.confirm(`Excluir este ${config.titulo.toLowerCase()}?`)) {
        salvarColecao(config.chave, itens.filter(item => item.id !== botao.dataset.deleteId));
        renderizar(nome);
        window.connectaCampus.showNotification(`${config.titulo} excluído.`, 'success');
      }
    });
    form.addEventListener('submit', evento => {
      evento.preventDefault();
      const dados = Object.fromEntries(config.campos.map(campo => [campo, form.elements[campo].value.trim()]));
      const obrigatorios = nome === 'noticias' ? ['titulo', 'categoria', 'conteudo', 'autor'] : nome === 'esportes' ? ['modalidade', 'equipeA', 'equipeB', 'data', 'status'] : nome === 'editais' ? ['titulo', 'area', 'status', 'abertura', 'encerramento', 'agencia', 'descricao'] : ['titulo', 'gravidade', 'data', 'conteudo'];
      if (obrigatorios.some(campo => !dados[campo]) || (dados.conteudo && dados.conteudo.length < 10) || (dados.descricao && dados.descricao.length < 10)) {
        window.connectaCampus.showNotification('Preencha corretamente os campos obrigatórios.', 'error');
        return;
      }
      const itens = config.obter();
      const item = { ...dados, id: estado[nome] || `${nome}-${Date.now()}` };
      salvarColecao(config.chave, estado[nome] ? itens.map(atual => atual.id === estado[nome] ? { ...atual, ...item } : atual) : [item, ...itens]);
      estado[nome] = null;
      form.reset();
      form.querySelector('[type="submit"]').textContent = nome === 'noticias' ? 'Publicar notícia' : `Salvar ${config.titulo.toLowerCase()}`;
      renderizar(nome);
      window.connectaCampus.showNotification(`${config.titulo} salvo com sucesso.`, 'success');
    });
    renderizar(nome);
  };

  const selecionarAba = nome => {
    document.querySelectorAll('[data-admin-tab]').forEach(tab => { const ativa = tab.dataset.adminTab === nome; tab.classList.toggle('is-active', ativa); tab.setAttribute('aria-selected', String(ativa)); });
    document.querySelectorAll('[data-admin-view]').forEach(view => { view.hidden = view.dataset.adminView !== nome; view.classList.toggle('is-active', view.dataset.adminView === nome); });
    history.replaceState(null, '', `admin.html?aba=${nome}`);
  };
  document.querySelectorAll('[data-admin-tab]').forEach(tab => tab.addEventListener('click', () => selecionarAba(tab.dataset.adminTab)));
  Object.keys(colecoes).forEach(configurarColecao);
  selecionarAba(new URLSearchParams(window.location.search).get('aba') || 'noticias');

  painel.querySelector('[data-logout]')?.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
    localStorage.removeItem(STORAGE_KEYS.adminSession);
    window.location.href = 'login_administrativo.html';
  });
}

function attachStudentLoginFormHandler() {
  const form = document.getElementById('studentLoginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const matricula = document.getElementById('matricula').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!/^[A-Za-z0-9.\-_/]{4,}$/.test(matricula)) {
      window.connectaCampus.showNotification('Informe uma matrícula válida com letras, números e/ou pontos.', 'error');
      return;
    }

    if (senha.length < 6) {
      window.connectaCampus.showNotification('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    window.connectaCampus.showNotification('✓ Login realizado com sucesso! Redirecionando...', 'success');
    setTimeout(() => {
      window.location.href = 'homepage.html';
    }, 1200);
  });
}

function validarFormulario(form) {
  const campos = form.querySelectorAll('input[required], textarea[required], select[required]');
  let valido = true;

  campos.forEach(campo => {
    if (!campo.value.trim()) {
      campo.style.borderColor = 'red';
      valido = false;
    } else {
      campo.style.borderColor = '';
    }
  });

  return valido;
}

// ==================================================
// FILTRO DO MURAL DE EDITAIS
// Atualiza os cards conforme palavra-chave, área e
// status selecionados, mantendo o total anunciado para
// leitores de tecnologia assistiva.
// ==================================================
function prepararFiltroEditais() {
  const busca = document.getElementById('buscaEdital');
  const area = document.getElementById('filtroArea');
  const status = document.getElementById('filtroStatus');
  const limpar = document.getElementById('limparFiltros');
  const resultado = document.getElementById('resultadoFiltros');
  const cards = Array.from(document.querySelectorAll('.edital-card'));

  if (!busca || !area || !status || !resultado || cards.length === 0) return;

  const atualizar = () => {
    const termo = busca.value.trim().toLowerCase();
    const cardsVisiveis = cards.filter(card => {
      const correspondeTexto = !termo || card.dataset.search.includes(termo);
      const correspondeArea = !area.value || card.dataset.area === area.value;
      const correspondeStatus = !status.value || card.dataset.status === status.value;
      const visivel = correspondeTexto && correspondeArea && correspondeStatus;
      card.hidden = !visivel;
      return visivel;
    });

    resultado.textContent = `${cardsVisiveis.length} oportunidade(s) encontrada(s).`;
  };

  [busca, area, status].forEach(campo => campo.addEventListener('input', atualizar));
  limpar?.addEventListener('click', () => {
    busca.value = '';
    area.value = '';
    status.value = '';
    atualizar();
    busca.focus();
  });
  atualizar();
}

window.connectaCampus = window.connectaCampus || {};
window.connectaCampus.showNotification = showNotification;

document.addEventListener('DOMContentLoaded', function() {
  prepararNavegacao();
  marcarLinkAtivo();
  renderizarNoticias();
  renderizarEsportes();
  renderizarEditais();
  renderizarAvisos();
  prepararFiltroEditais();
  prepararPainelAdministrativo();
  attachCadastroFormHandler();
  attachAdminLoginFormHandler();
  attachStudentLoginFormHandler();
});