const HUB_KEY = 'collective_hub_v1';

function loadHub(){
  try{
    const raw = localStorage.getItem(HUB_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  const seed = {
    collectives: [
      {id:'col-001', name:'Collectif de gestion', description:'Tontine, cotisations et investissements solidaires.', members:4, currency:'XAF', created:'2026-01-12'},
      {id:'col-002', name:'Association Solidarité', description:'Épargne collective et redistribution mensuelle.', members:12, currency:'XAF', created:'2026-03-01'}
    ]
  };
  localStorage.setItem(HUB_KEY, JSON.stringify(seed));
  return seed;
}

function saveHub(data){ localStorage.setItem(HUB_KEY, JSON.stringify(data)); }

function toast(m){
  const t = document.getElementById('toast');
  t.textContent = m; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

function initials(name){
  return (name||'?').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
}

function render(){
  const data = loadHub();
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  if(!data.collectives.length){
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = data.collectives.map(c => `
    <article class="card">
      <div class="icon">${initials(c.name)}</div>
      <h2>${c.name}</h2>
      <p>${c.description || 'Espace de gestion dédié'}</p>
      <div class="meta">
        <span>${c.members || 0} membres</span>
        <span>${c.currency || 'XAF'}</span>
      </div>
      <a class="open" href="app.html?id=${encodeURIComponent(c.id)}">Ouvrir cet espace</a>
    </article>
  `).join('');
}

function openModal(){
  const root = document.getElementById('modalRoot');
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h3>Nouveau collectif</h3>
        <div class="field"><label>Nom</label><input id="nName" placeholder="Ex. Collectif Quartier Nord"></div>
        <div class="field"><label>Description</label><textarea id="nDesc" rows="2" placeholder="Objectif du collectif"></textarea></div>
        <div class="field"><label>Devise</label><input id="nCur" value="XAF"></div>
        <div class="modal-actions">
          <button class="btn ghost" type="button" data-close>Annuler</button>
          <button class="btn primary" type="button" id="nSave">Créer</button>
        </div>
      </div>
    </div>`;
  root.onclick = e => {
    if(e.target.classList.contains('modal-backdrop') || e.target.hasAttribute('data-close')) root.innerHTML = '';
  };
  document.getElementById('nSave').onclick = () => {
    const name = document.getElementById('nName').value.trim();
    if(!name){ toast('Nom requis'); return; }
    const data = loadHub();
    const id = 'col-' + Math.random().toString(36).slice(2,8);
    data.collectives.push({
      id, name,
      description: document.getElementById('nDesc').value.trim(),
      members: 0,
      currency: document.getElementById('nCur').value.trim() || 'XAF',
      created: new Date().toISOString().slice(0,10)
    });
    saveHub(data);
    root.innerHTML = '';
    toast('Collectif créé');
    render();
  };
}

document.getElementById('btnAdd').onclick = openModal;
render();
