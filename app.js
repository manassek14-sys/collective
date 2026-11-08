const KEY = 'collective_v2_data';
const PASS_KEY = 'collective_v2_unlocked';
const ADMIN_PASS = 'Azerty1234@idiot';

const initial = {
  settings: { name: 'Collectif de gestion', currency: 'XAF', redistribution: 55, investment: 25, treasury: 15, fees: 5, monthlyGoal: 1200000, accent: 'gold' },
  payments: {
    momo: { enabled: true, number: '', owner: '' },
    airtel: { enabled: true, number: '', owner: '' },
    orange: { enabled: true, number: '', owner: '' },
    visa: { enabled: false, number: '', owner: '', bank: '' }
  },
  members: [
    { id: 'MB-001', name: 'Amina Mavoungou', email: 'amina@example.test', phone: '+242 06 000 00 01', joined: '2026-01-12', contribution: 100000, status: 'Actif' },
    { id: 'MB-002', name: 'Junior Nsimba', email: 'junior@example.test', phone: '+242 05 000 00 02', joined: '2026-01-18', contribution: 100000, status: 'Actif' },
    { id: 'MB-003', name: 'Grâce Okemba', email: 'grace@example.test', phone: '+242 06 000 00 03', joined: '2026-02-02', contribution: 75000, status: 'Actif' }
  ],
  contributions: [
    { id: 'CT-001', memberId: 'MB-001', amount: 100000, date: '2026-10-03', status: 'Payé', ref: 'REF-1001' },
    { id: 'CT-002', memberId: 'MB-002', amount: 100000, date: '2026-10-05', status: 'Payé', ref: 'REF-1002' },
    { id: 'CT-003', memberId: 'MB-003', amount: 75000, date: '2026-10-08', status: 'En attente', ref: 'REF-1003' }
  ],
  projects: [
    { id: 'PJ-001', name: 'Plateforme numérique', budget: 1500000, invested: 450000, status: 'En cours', risk: 'Modéré', notes: 'Développement' },
    { id: 'PJ-002', name: 'Fonds commercial', budget: 900000, invested: 220000, status: 'Étude', risk: 'Modéré', notes: '' }
  ],
  transactions: [
    { id: 'TX-001', type: 'Entrée', label: 'Cotisations octobre', amount: 275000, date: '2026-10-05', category: 'Cotisations' },
    { id: 'TX-002', type: 'Sortie', label: 'Frais administratifs', amount: 25000, date: '2026-10-09', category: 'Frais' }
  ],
  governance: [
    { id: 'GV-001', action: 'Validation du règlement', owner: 'Administrateur', date: '2026-01-20', status: 'Fait' },
    { id: 'GV-002', action: 'Revue trimestrielle', owner: 'Technicien principal', date: '2026-03-01', status: 'À faire' }
  ]
};

let state = load();
let unlocked = sessionStorage.getItem(PASS_KEY) === '1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(initial);
    const data = JSON.parse(raw);
    if (!data.payments) data.payments = structuredClone(initial.payments);
    if (!data.settings) data.settings = structuredClone(initial.settings);
    return data;
  } catch (e) { return structuredClone(initial); }
}
function save(msg) { localStorage.setItem(KEY, JSON.stringify(state)); if (msg) toast(msg); }
function fmt(n) { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(n) || 0) + ' ' + (state.settings.currency || 'XAF'); }
function uid(p) { return p + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(); }
function today() { return new Date().toISOString().slice(0, 10); }
function $(s, el = document) { return el.querySelector(s); }
function $$(s, el = document) { return [...el.querySelectorAll(s)]; }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2400); }

function requireUnlock(actionLabel) {
  if (unlocked) return true;
  openPasswordModal(actionLabel);
  return false;
}
function setUnlock(v) {
  unlocked = !!v;
  if (unlocked) sessionStorage.setItem(PASS_KEY, '1');
  else sessionStorage.removeItem(PASS_KEY);
  updateLockUI();
  render();
}
function updateLockUI() {
  const dot = $('#lockDot');
  const btn = $('#toggleLockBtn');
  const mode = $('#wsMode');
  const pill = $('#modePill');
  if (unlocked) {
    dot.classList.add('unlocked'); dot.title = 'Déverrouillé';
    btn.textContent = 'Verrouiller'; btn.classList.add('locked-state');
    mode.textContent = 'Mode édition';
    pill.textContent = 'Édition active'; pill.classList.add('edit');
  } else {
    dot.classList.remove('unlocked'); dot.title = 'Verrouillé';
    btn.textContent = 'Déverrouiller'; btn.classList.remove('locked-state');
    mode.textContent = 'Mode lecture';
    pill.textContent = 'Lecture seule'; pill.classList.remove('edit');
  }
  $('#wsName').textContent = state.settings.name || 'Collectif';
  const parts = (state.settings.name || 'CG').split(' ').filter(Boolean);
  $('#wsAvatar').textContent = (parts[0]?.[0] || 'C') + (parts[1]?.[0] || 'G');
}
function openPasswordModal(reason) {
  openModal(`<h3>Accès administrateur</h3>
    <p style="color:var(--muted);font-size:13px;margin:0 0 14px">Entrez le mot de passe pour ${reason || 'modifier les données'}.</p>
    <div class="form-grid"><div class="field full"><label>Mot de passe</label>
    <input id="passInput" type="password" autocomplete="current-password" placeholder="••••••••"></div></div>
    <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button>
    <button class="btn btn-primary" id="passOk">Valider</button></div>`, () => {
    const input = $('#passInput'); input.focus();
    const go = () => {
      if (input.value === ADMIN_PASS) { setUnlock(true); closeModal(); toast('Espace déverrouillé'); }
      else { toast('Mot de passe incorrect'); input.value = ''; input.focus(); }
    };
    $('#passOk').onclick = go;
    input.onkeydown = e => { if (e.key === 'Enter') go(); };
  });
}
function setPage(page) {
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  const titles = { dashboard: 'Tableau de bord', members: 'Membres', contributions: 'Cotisations', projects: 'Projets & investissements', finance: 'Répartition financière', transactions: 'Trésorerie', payments: 'Moyens de paiement', reports: 'Rapports', governance: 'Gouvernance & conformité', settings: 'Paramètres' };
  const crumbs = { dashboard: 'VUE D’ENSEMBLE', members: 'MEMBRES', contributions: 'COTISATIONS', projects: 'PROJETS', finance: 'RÉPARTITION', transactions: 'TRÉSORERIE', payments: 'PAIEMENTS', reports: 'RAPPORTS', governance: 'GOUVERNANCE', settings: 'PARAMÈTRES' };
  $('#pageTitle').textContent = titles[page] || page;
  $('#crumb').textContent = crumbs[page] || '';
  const root = $('#pageContent'); root.innerHTML = '';
  const map = { dashboard: renderDashboard, members: renderMembers, contributions: renderContributions, projects: renderProjects, finance: renderFinance, transactions: renderTransactions, payments: renderPayments, reports: renderReports, governance: renderGovernance, settings: renderSettings };
  (map[page] || renderDashboard)(root);
}
function memberName(id) { return state.members.find(m => m.id === id)?.name || id; }

function renderDashboard(root) {
  const paid = state.contributions.filter(c => c.status === 'Payé').reduce((s, c) => s + c.amount, 0);
  const inv = state.projects.reduce((s, p) => s + p.invested, 0);
  const bal = state.transactions.reduce((s, t) => s + (t.type === 'Entrée' ? t.amount : -t.amount), 0);
  root.innerHTML = `<div class="stats">
      <div class="card gold-edge"><div class="stat-label">Membres</div><div class="stat-value">${state.members.length}</div><div class="stat-sub">Espace collectif</div></div>
      <div class="card"><div class="stat-label">Cotisations encaissées</div><div class="stat-value">${fmt(paid)}</div><div class="stat-sub">Statut payé</div></div>
      <div class="card"><div class="stat-label">Investi</div><div class="stat-value">${fmt(inv)}</div><div class="stat-sub">Tous projets</div></div>
      <div class="card"><div class="stat-label">Solde trésorerie</div><div class="stat-value">${fmt(bal)}</div><div class="stat-sub">Entrées − sorties</div></div>
    </div>
    <div class="two-col"><div class="card"><div class="table-top"><b>Dernières cotisations</b></div>
        <div class="table-wrap"><table><thead><tr><th>Membre</th><th>Montant</th><th>Statut</th></tr></thead>
        <tbody>${state.contributions.slice(-6).reverse().map(c => `<tr><td>${memberName(c.memberId)}</td><td>${fmt(c.amount)}</td>
          <td><span class="badge ${c.status === 'Payé' ? 'badge-ok' : 'badge-warn'}">${c.status}</span></td></tr>`).join('')}</tbody></table></div></div>
      <div class="card"><div class="table-top"><b>Projets</b></div>
        ${state.projects.map(p => `<div class="metric-line"><span>${p.name}</span><b>${fmt(p.invested)}</b></div>`).join('') || '<p style="color:var(--muted)">Aucun projet</p>'}</div></div>`;
}
function renderMembers(root) {
  root.innerHTML = `<div class="page-head"><div class="notice" style="margin:0;flex:1">Les modifications nécessitent le déverrouillage administrateur.</div>
      <button class="btn btn-primary" id="addMember">+ Membre</button></div>
    <div class="card"><div class="table-top"><input class="search" id="memberSearch" placeholder="Rechercher un membre...">
        <button class="btn btn-light" id="exportMembers">Export CSV</button></div>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Nom</th><th>Contact</th><th>Cotisation</th><th>Statut</th><th></th></tr></thead>
      <tbody id="memberRows"></tbody></table></div></div>`;
  const draw = () => {
    const q = ($('#memberSearch').value || '').toLowerCase();
    $('#memberRows').innerHTML = state.members.filter(m => !q || m.name.toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q))
      .map(m => `<tr><td>${m.id}</td><td>${m.name}</td><td>${m.email || ''}<br><small style="color:var(--muted)">${m.phone || ''}</small></td>
        <td>${fmt(m.contribution)}</td><td><span class="badge badge-ok">${m.status}</span></td>
        <td><button class="btn btn-ghost" data-edit="${m.id}">Modifier</button></td></tr>`).join('');
    $('#memberNavCount').textContent = state.members.length;
  };
  draw(); $('#memberSearch').oninput = draw;
  $('#exportMembers').onclick = () => exportCSV('membres', ['id', 'name', 'email', 'phone', 'joined', 'contribution', 'status'], state.members);
  $('#addMember').onclick = () => { if (!requireUnlock('ajouter un membre')) return; memberModal(); };
  root.onclick = e => { const b = e.target.closest('[data-edit]'); if (!b) return; if (!requireUnlock('modifier un membre')) return; memberModal(state.members.find(m => m.id === b.dataset.edit)); };
}
function memberModal(m) {
  const isEdit = !!m;
  openModal(`<h3>${isEdit ? 'Modifier' : 'Nouveau'} membre</h3>
    <div class="form-grid">
      <div class="field"><label>Nom</label><input id="mName" value="${m?.name || ''}"></div>
      <div class="field"><label>Email</label><input id="mEmail" value="${m?.email || ''}"></div>
      <div class="field"><label>Téléphone</label><input id="mPhone" value="${m?.phone || ''}"></div>
      <div class="field"><label>Cotisation</label><input id="mContrib" type="number" value="${m?.contribution || 100000}"></div>
      <div class="field"><label>Statut</label><select id="mStatus">
        <option ${!m || m.status === 'Actif' ? 'selected' : ''}>Actif</option>
        <option ${m?.status === 'Suspendu' ? 'selected' : ''}>Suspendu</option>
        <option ${m?.status === 'En attente' ? 'selected' : ''}>En attente</option></select></div></div>
    <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button>
      <button class="btn btn-primary" id="saveMember">Enregistrer</button></div>`, () => {
    $('#saveMember').onclick = () => {
      const row = { id: m?.id || uid('MB'), name: $('#mName').value.trim(), email: $('#mEmail').value.trim(), phone: $('#mPhone').value.trim(), joined: m?.joined || today(), contribution: Number($('#mContrib').value) || 0, status: $('#mStatus').value };
      if (!row.name) return toast('Nom requis');
      if (isEdit) state.members = state.members.map(x => x.id === row.id ? row : x); else state.members.push(row);
      save('Membre enregistré'); closeModal(); setPage('members');
    };
  });
}
function renderContributions(root) {
  root.innerHTML = `<div class="page-head"><div></div><button class="btn btn-primary" id="addContrib">+ Cotisation</button></div>
    <div class="card"><div class="table-wrap"><table><thead><tr><th>Réf</th><th>Membre</th><th>Montant</th><th>Date</th><th>Statut</th></tr></thead>
      <tbody>${state.contributions.map(c => `<tr><td>${c.ref || c.id}</td><td>${memberName(c.memberId)}</td><td>${fmt(c.amount)}</td>
        <td>${c.date}</td><td><span class="badge ${c.status === 'Payé' ? 'badge-ok' : 'badge-warn'}">${c.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addContrib').onclick = () => {
    if (!requireUnlock('enregistrer une cotisation')) return;
    openModal(`<h3>Nouvelle cotisation</h3><div class="form-grid">
        <div class="field"><label>Membre</label><select id="cMember">${state.members.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}</select></div>
        <div class="field"><label>Montant</label><input id="cAmount" type="number" value="100000"></div>
        <div class="field"><label>Date</label><input id="cDate" type="date" value="${today()}"></div>
        <div class="field"><label>Statut</label><select id="cStatus"><option>Payé</option><option>En attente</option></select></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveC">Enregistrer</button></div>`, () => {
      $('#saveC').onclick = () => {
        state.contributions.push({ id: uid('CT'), memberId: $('#cMember').value, amount: Number($('#cAmount').value) || 0, date: $('#cDate').value, status: $('#cStatus').value, ref: 'REF-' + Math.random().toString().slice(2, 6) });
        save('Cotisation ajoutée'); closeModal(); setPage('contributions');
      };
    });
  };
}
function renderProjects(root) {
  root.innerHTML = `<div class="page-head"><div></div><button class="btn btn-primary" id="addProject">+ Projet</button></div>
    <div class="card"><div class="table-wrap"><table><thead><tr><th>Projet</th><th>Budget</th><th>Investi</th><th>Statut</th><th>Risque</th></tr></thead>
      <tbody>${state.projects.map(p => `<tr><td>${p.name}</td><td>${fmt(p.budget)}</td><td>${fmt(p.invested)}</td><td>${p.status}</td><td>${p.risk}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addProject').onclick = () => {
    if (!requireUnlock('ajouter un projet')) return;
    openModal(`<h3>Nouveau projet</h3><div class="form-grid">
        <div class="field full"><label>Nom</label><input id="pName"></div>
        <div class="field"><label>Budget</label><input id="pBudget" type="number" value="1000000"></div>
        <div class="field"><label>Investi</label><input id="pInv" type="number" value="0"></div>
        <div class="field"><label>Statut</label><select id="pStatus"><option>Étude</option><option>En cours</option><option>Clôturé</option></select></div>
        <div class="field"><label>Risque</label><select id="pRisk"><option>Faible</option><option>Moyen</option><option>Modéré</option><option>Élevé</option></select></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveP">Enregistrer</button></div>`, () => {
      $('#saveP').onclick = () => {
        state.projects.push({ id: uid('PJ'), name: $('#pName').value.trim() || 'Projet', budget: Number($('#pBudget').value) || 0, invested: Number($('#pInv').value) || 0, status: $('#pStatus').value, risk: $('#pRisk').value, notes: '' });
        save('Projet ajouté'); closeModal(); setPage('projects');
      };
    });
  };
}
function renderFinance(root) {
  const s = state.settings;
  const total = s.redistribution + s.investment + s.treasury + s.fees;
  root.innerHTML = `<div class="notice">La somme des enveloppes doit rester à 100 %. Actuellement : <b>${total} %</b>. Modification protégée par mot de passe.</div>
    <div class="stats">
      <div class="card gold-edge"><div class="stat-label">Redistribution</div><div class="stat-value">${s.redistribution}%</div></div>
      <div class="card"><div class="stat-label">Investissement</div><div class="stat-value">${s.investment}%</div></div>
      <div class="card"><div class="stat-label">Trésorerie</div><div class="stat-value">${s.treasury}%</div></div>
      <div class="card"><div class="stat-label">Frais</div><div class="stat-value">${s.fees}%</div></div></div>
    <div class="card"><p style="margin-top:0">Simulation sur objectif mensuel (${fmt(s.monthlyGoal)}) :</p>
      <div class="metric-line"><span>Redistribution</span><b>${fmt(s.monthlyGoal * s.redistribution / 100)}</b></div>
      <div class="metric-line"><span>Investissement</span><b>${fmt(s.monthlyGoal * s.investment / 100)}</b></div>
      <div class="metric-line"><span>Trésorerie</span><b>${fmt(s.monthlyGoal * s.treasury / 100)}</b></div>
      <div class="metric-line"><span>Frais</span><b>${fmt(s.monthlyGoal * s.fees / 100)}</b></div>
      <div style="margin-top:14px"><button class="btn btn-primary" id="editAlloc">Modifier les pourcentages</button></div></div>`;
  $('#editAlloc').onclick = () => {
    if (!requireUnlock('modifier la répartition')) return;
    openModal(`<h3>Répartition</h3><div class="form-grid">
        <div class="field"><label>Redistribution %</label><input id="aRed" type="number" value="${s.redistribution}"></div>
        <div class="field"><label>Investissement %</label><input id="aInv" type="number" value="${s.investment}"></div>
        <div class="field"><label>Trésorerie %</label><input id="aTre" type="number" value="${s.treasury}"></div>
        <div class="field"><label>Frais %</label><input id="aFees" type="number" value="${s.fees}"></div>
        <div class="field full"><label>Objectif mensuel</label><input id="aGoal" type="number" value="${s.monthlyGoal}"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveA">Enregistrer</button></div>`, () => {
      $('#saveA').onclick = () => {
        state.settings.redistribution = Number($('#aRed').value) || 0;
        state.settings.investment = Number($('#aInv').value) || 0;
        state.settings.treasury = Number($('#aTre').value) || 0;
        state.settings.fees = Number($('#aFees').value) || 0;
        state.settings.monthlyGoal = Number($('#aGoal').value) || 0;
        save('Répartition mise à jour'); closeModal(); setPage('finance');
      };
    });
  };
}
function renderTransactions(root) {
  root.innerHTML = `<div class="page-head"><div></div><button class="btn btn-primary" id="addTx">+ Mouvement</button></div>
    <div class="card"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Libellé</th><th>Montant</th></tr></thead>
      <tbody>${state.transactions.map(t => `<tr><td>${t.date}</td><td>${t.type}</td><td>${t.label}</td><td>${fmt(t.amount)}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addTx').onclick = () => {
    if (!requireUnlock('ajouter un mouvement')) return;
    openModal(`<h3>Mouvement de trésorerie</h3><div class="form-grid">
        <div class="field"><label>Type</label><select id="tType"><option>Entrée</option><option>Sortie</option></select></div>
        <div class="field"><label>Montant</label><input id="tAmount" type="number" value="10000"></div>
        <div class="field full"><label>Libellé</label><input id="tLabel"></div>
        <div class="field"><label>Date</label><input id="tDate" type="date" value="${today()}"></div>
        <div class="field"><label>Catégorie</label><input id="tCat" value="Divers"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveT">Enregistrer</button></div>`, () => {
      $('#saveT').onclick = () => {
        state.transactions.push({ id: uid('TX'), type: $('#tType').value, label: $('#tLabel').value || 'Mouvement', amount: Number($('#tAmount').value) || 0, date: $('#tDate').value, category: $('#tCat').value });
        save('Mouvement enregistré'); closeModal(); setPage('transactions');
      };
    });
  };
}
function renderPayments(root) {
  const p = state.payments;
  const card = (key, title, cls, extra) => {
    const x = p[key] || {};
    return `<div class="pay-card"><div class="pay-logo ${cls}">${title.slice(0, 2).toUpperCase()}</div>
      <h3>${title}</h3><div class="provider">${x.enabled ? 'Actif pour recevoir' : 'Désactivé'}</div>
      <div class="num">${x.number || 'Non renseigné'}</div>
      <div class="owner">${x.owner || 'Titulaire non défini'}${extra && x.bank ? ' · ' + x.bank : ''}</div></div>`;
  };
  root.innerHTML = `<div class="notice">Configurez vos numéros MoMo, Airtel Money, Orange Money et Visa pour recevoir les fonds. Modification protégée.</div>
    <div class="page-head"><div></div><button class="btn btn-primary" id="editPay">Configurer mes moyens de paiement</button></div>
    <div class="pay-grid">${card('momo', 'Mobile Money (MTN)', 'momo')}${card('airtel', 'Airtel Money', 'airtel')}${card('orange', 'Orange Money', 'orange')}${card('visa', 'Visa / Carte bancaire', 'visa', true)}</div>`;
  $('#editPay').onclick = () => {
    if (!requireUnlock('configurer les paiements')) return;
    const x = state.payments;
    openModal(`<h3>Moyens de paiement</h3><div class="form-grid">
        <div class="field full"><label>MoMo — numéro</label><input id="momoNum" value="${x.momo?.number || ''}" placeholder="06 XXX XX XX"></div>
        <div class="field full"><label>MoMo — titulaire</label><input id="momoOwn" value="${x.momo?.owner || ''}"></div>
        <div class="field full"><label>Airtel Money — numéro</label><input id="airNum" value="${x.airtel?.number || ''}"></div>
        <div class="field full"><label>Airtel — titulaire</label><input id="airOwn" value="${x.airtel?.owner || ''}"></div>
        <div class="field full"><label>Orange Money — numéro</label><input id="oraNum" value="${x.orange?.number || ''}"></div>
        <div class="field full"><label>Orange — titulaire</label><input id="oraOwn" value="${x.orange?.owner || ''}"></div>
        <div class="field full"><label>Visa / IBAN / compte</label><input id="visaNum" value="${x.visa?.number || ''}"></div>
        <div class="field"><label>Titulaire Visa</label><input id="visaOwn" value="${x.visa?.owner || ''}"></div>
        <div class="field"><label>Banque</label><input id="visaBank" value="${x.visa?.bank || ''}"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="savePay">Enregistrer</button></div>`, () => {
      $('#savePay').onclick = () => {
        state.payments = {
          momo: { enabled: true, number: $('#momoNum').value.trim(), owner: $('#momoOwn').value.trim() },
          airtel: { enabled: true, number: $('#airNum').value.trim(), owner: $('#airOwn').value.trim() },
          orange: { enabled: true, number: $('#oraNum').value.trim(), owner: $('#oraOwn').value.trim() },
          visa: { enabled: true, number: $('#visaNum').value.trim(), owner: $('#visaOwn').value.trim(), bank: $('#visaBank').value.trim() }
        };
        save('Moyens de paiement enregistrés'); closeModal(); setPage('payments');
      };
    });
  };
}
function renderReports(root) {
  const paid = state.contributions.filter(c => c.status === 'Payé').reduce((s, c) => s + c.amount, 0);
  const bal = state.transactions.reduce((s, t) => s + (t.type === 'Entrée' ? t.amount : -t.amount), 0);
  root.innerHTML = `<div class="card gold-edge"><h3 style="margin-top:0;font-family:var(--display);font-size:24px">Synthèse</h3>
      <div class="metric-line"><span>Membres</span><b>${state.members.length}</b></div>
      <div class="metric-line"><span>Cotisations payées</span><b>${fmt(paid)}</b></div>
      <div class="metric-line"><span>Solde trésorerie</span><b>${fmt(bal)}</b></div>
      <div class="metric-line"><span>Projets</span><b>${state.projects.length}</b></div>
      <div style="margin-top:16px"><button class="btn btn-primary" onclick="window.print()">Imprimer / PDF</button></div></div>`;
}
function renderGovernance(root) {
  root.innerHTML = `<div class="card"><div class="table-wrap"><table><thead><tr><th>Action</th><th>Responsable</th><th>Date</th><th>Statut</th></tr></thead>
      <tbody>${state.governance.map(g => `<tr><td>${g.action}</td><td>${g.owner}</td><td>${g.date}</td><td>${g.status}</td></tr>`).join('')}</tbody></table></div>
      <p style="color:var(--muted);font-size:12px;margin-top:14px">Voir le dossier <code>gouvernance/</code> du dépôt pour le règlement complet.</p></div>`;
}
function renderSettings(root) {
  const s = state.settings;
  root.innerHTML = `<div class="notice">Changer le nom de l’espace, la devise et l’objectif nécessite le mot de passe administrateur.</div>
    <div class="card"><div class="form-grid">
        <div class="field"><label>Nom de l’espace</label><input id="sName" value="${s.name || ''}" ${unlocked ? '' : 'disabled'}></div>
        <div class="field"><label>Devise</label><input id="sCur" value="${s.currency || 'XAF'}" ${unlocked ? '' : 'disabled'}></div>
        <div class="field"><label>Objectif mensuel</label><input id="sGoal" type="number" value="${s.monthlyGoal || 0}" ${unlocked ? '' : 'disabled'}></div></div>
      <div class="modal-actions" style="justify-content:flex-start;margin-top:16px">
        <button class="btn btn-primary" id="saveSettings" ${unlocked ? '' : 'disabled'}>Enregistrer</button>
        <button class="btn btn-light" id="exportData">Exporter JSON</button>
        <button class="btn btn-light" id="importData">Importer JSON</button>
        <button class="btn btn-danger" id="lockNow">Verrouiller maintenant</button></div></div>`;
  $('#saveSettings').onclick = () => {
    if (!requireUnlock('modifier les paramètres')) return;
    state.settings.name = $('#sName').value.trim() || state.settings.name;
    state.settings.currency = $('#sCur').value.trim() || 'XAF';
    state.settings.monthlyGoal = Number($('#sGoal').value) || 0;
    save('Paramètres enregistrés'); updateLockUI(); setPage('settings');
  };
  $('#exportData').onclick = () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'collective-backup.json'; a.click(); };
  $('#importData').onclick = () => { if (!requireUnlock('importer des données')) return; $('#importFile').click(); };
  $('#lockNow').onclick = () => { setUnlock(false); toast('Espace verrouillé'); };
}
function openModal(html, cb) {
  const root = $('#modalRoot');
  root.innerHTML = `<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
  root.onclick = e => { if (e.target.classList.contains('modal-backdrop') || e.target.hasAttribute('data-close')) closeModal(); };
  if (cb) cb();
}
function closeModal() { $('#modalRoot').innerHTML = ''; }
function exportCSV(name, cols, rows) {
  const lines = [cols.join(';')].concat(rows.map(r => cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(';')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.csv'; a.click();
}
function render() {
  $('#today').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  $('#year').textContent = new Date().getFullYear();
  $('#memberNavCount').textContent = state.members.length;
  updateLockUI();
  setPage('dashboard');
}
$('#exportAll').onclick = () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'collective-backup.json'; a.click(); toast('Export prêt'); };
$('#importFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { state = JSON.parse(r.result); if (!state.payments) state.payments = structuredClone(initial.payments); save('Données importées'); setPage('dashboard'); } catch (err) { toast('Fichier invalide'); } };
  r.readAsText(f); e.target.value = '';
};
$('#toggleLockBtn').onclick = () => { if (unlocked) { setUnlock(false); toast('Espace verrouillé'); } else openPasswordModal('déverrouiller l’espace'); };
$('#nav').addEventListener('click', e => { const b = e.target.closest('[data-page]'); if (b) setPage(b.dataset.page); });
render();
