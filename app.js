const KEY='collective_v1_data';
const initial={settings:{name:'Collectif de gestion',currency:'XAF',redistribution:55,investment:25,treasury:15,fees:5,monthlyGoal:1200000},members:[{id:'MB-001',name:'Amina Mavoungou',email:'amina@example.test',phone:'+242 06 000 00 01',joined:'2026-01-12',contribution:100000,status:'Actif'},{id:'MB-002',name:'Junior Nsimba',email:'junior@example.test',phone:'+242 05 000 00 02',joined:'2026-01-18',contribution:100000,status:'Actif'},{id:'MB-003',name:'Grâce Okemba',email:'grace@example.test',phone:'+242 06 000 00 03',joined:'2026-02-02',contribution:75000,status:'Actif'}],contributions:[{id:'CT-001',memberId:'MB-001',amount:100000,date:'2026-02-01',status:'Payé',ref:'REF-2401'},{id:'CT-002',memberId:'MB-002',amount:100000,date:'2026-02-03',status:'Payé',ref:'REF-2402'},{id:'CT-003',memberId:'MB-003',amount:75000,date:'2026-02-05',status:'En attente',ref:'REF-2403'}],projects:[{id:'PJ-001',name:'Commerce de proximité',budget:2500000,invested:800000,status:'En cours',risk:'Moyen',notes:'Phase 1 ouverte'},{id:'PJ-002',name:'Équipements agricoles',budget:4000000,invested:1200000,status:'Étude',risk:'Élevé',notes:'Étude de faisabilité'}],transactions:[{id:'TX-001',type:'Entrée',label:'Cotisations février',amount:200000,date:'2026-02-04',category:'Cotisations'},{id:'TX-002',type:'Sortie',label:'Frais de gestion',amount:15000,date:'2026-02-06',category:'Frais'}],governance:[{id:'GV-001',action:'Validation du règlement',owner:'Administrateur',date:'2026-01-20',status:'Fait'},{id:'GV-002',action:'Revue trimestrielle',owner:'Technicien principal',date:'2026-03-01',status:'À faire'}]};

function load(){try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):structuredClone(initial)}catch(e){return structuredClone(initial)}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d));state=d}
let state=load();

const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const fmt=n=>new Intl.NumberFormat('fr-FR').format(n||0)+' '+(state.settings.currency||'XAF');
const uid=p=>p+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
const today=()=>new Date().toISOString().slice(0,10);

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

function setPage(page){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const titles={dashboard:"Tableau de bord",members:"Membres",contributions:"Cotisations",projects:"Projets & investissements",finance:"Répartition financière",transactions:"Trésorerie",reports:"Rapports",governance:"Gouvernance & conformité",guide:"Guide de commandes",settings:"Paramètres"};
  const crumbs={dashboard:"VUE D’ENSEMBLE",members:"MEMBRES",contributions:"COTISATIONS",projects:"PROJETS",finance:"RÉPARTITION",transactions:"TRÉSORERIE",reports:"RAPPORTS",governance:"GOUVERNANCE",guide:"GUIDE",settings:"PARAMÈTRES"};
  $('#pageTitle').textContent=titles[page]||page;
  $('#crumb').textContent=crumbs[page]||'';
  const root=$('#pageContent');
  root.innerHTML='';
  const renderers={dashboard:renderDashboard,members:renderMembers,contributions:renderContributions,projects:renderProjects,finance:renderFinance,transactions:renderTransactions,reports:renderReports,governance:renderGovernance,guide:renderGuide,settings:renderSettings};
  (renderers[page]||renderDashboard)(root);
}

function renderDashboard(root){
  const m=state.members.length;
  const paid=state.contributions.filter(c=>c.status==='Payé').reduce((s,c)=>s+c.amount,0);
  const inv=state.projects.reduce((s,p)=>s+p.invested,0);
  const bal=state.transactions.reduce((s,t)=>s+(t.type==='Entrée'?t.amount:-t.amount),0);
  root.innerHTML=`<div class="stats">
    <div class="card"><div class="stat-label">Membres actifs</div><div class="stat-value">${m}</div><div class="stat-sub">Espace collectif</div></div>
    <div class="card"><div class="stat-label">Cotisations encaissées</div><div class="stat-value">${fmt(paid)}</div><div class="stat-sub">Statut payé</div></div>
    <div class="card"><div class="stat-label">Investi dans les projets</div><div class="stat-value">${fmt(inv)}</div><div class="stat-sub">Tous projets</div></div>
    <div class="card"><div class="stat-label">Solde trésorerie</div><div class="stat-value">${fmt(bal)}</div><div class="stat-sub">Entrées − sorties</div></div>
  </div>
  <div class="two-col">
    <div class="card"><div class="table-top"><b>Dernières cotisations</b></div><div class="table-wrap"><table class="table"><thead><tr><th>Membre</th><th>Montant</th><th>Statut</th></tr></thead><tbody>${state.contributions.slice(-5).reverse().map(c=>{const mem=state.members.find(m=>m.id===c.memberId);return `<tr><td>${mem?mem.name:c.memberId}</td><td>${fmt(c.amount)}</td><td><span class="badge ${c.status==='Payé'?'badge-ok':'badge-warn'}">${c.status}</span></td></tr>`}).join('')}</tbody></table></div></div>
    <div class="card"><div class="table-top"><b>Projets</b></div>${state.projects.map(p=>`<div class="metric-line" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)"><span>${p.name}</span><b>${fmt(p.invested)}</b></div>`).join('')}</div>
  </div>`;
}

function renderMembers(root){
  root.innerHTML=`<div class="page-head"><div></div><button class="btn btn-primary" id="addMember">+ Nouveau membre</button></div>
  <div class="card"><div class="table-top"><input class="search" id="memberSearch" placeholder="Rechercher..."><button class="btn btn-light" id="exportMembers">Export CSV</button></div>
  <div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Nom</th><th>Contact</th><th>Cotisation</th><th>Statut</th><th></th></tr></thead><tbody id="memberRows"></tbody></table></div></div>`;
  const draw=()=>{
    const q=($('#memberSearch').value||'').toLowerCase();
    $('#memberRows').innerHTML=state.members.filter(m=>!q||m.name.toLowerCase().includes(q)||m.email.toLowerCase().includes(q)).map(m=>`<tr><td>${m.id}</td><td>${m.name}</td><td>${m.email}<br><small>${m.phone||''}</small></td><td>${fmt(m.contribution)}</td><td><span class="badge badge-ok">${m.status}</span></td><td><button class="btn btn-ghost" data-edit="${m.id}">Modifier</button></td></tr>`).join('');
    $('#memberNavCount').textContent=state.members.length;
  };
  draw();
  $('#memberSearch').oninput=draw;
  $('#exportMembers').onclick=()=>exportCSV('membres',['id','name','email','phone','joined','contribution','status'],state.members);
  $('#addMember').onclick=()=>memberModal();
  root.onclick=e=>{const b=e.target.closest('[data-edit]');if(b)memberModal(state.members.find(m=>m.id===b.dataset.edit))};
}

function memberModal(m){
  const isEdit=!!m;
  openModal(`<h3>${isEdit?'Modifier':'Nouveau'} membre</h3>
  <div class="form-grid">
    <div class="field"><label>Nom</label><input id="mName" value="${m?.name||''}"></div>
    <div class="field"><label>Email</label><input id="mEmail" value="${m?.email||''}"></div>
    <div class="field"><label>Téléphone</label><input id="mPhone" value="${m?.phone||''}"></div>
    <div class="field"><label>Cotisation</label><input id="mContrib" type="number" value="${m?.contribution||100000}"></div>
    <div class="field"><label>Statut</label><select id="mStatus"><option ${!m||m.status==='Actif'?'selected':''}>Actif</option><option ${m?.status==='Suspendu'?'selected':''}>Suspendu</option></select></div>
  </div>
  <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveMember">Enregistrer</button></div>`,()=>{
    $('#saveMember').onclick=()=>{
      const row={id:m?.id||uid('MB'),name:$('#mName').value.trim(),email:$('#mEmail').value.trim(),phone:$('#mPhone').value.trim(),joined:m?.joined||today(),contribution:Number($('#mContrib').value)||0,status:$('#mStatus').value};
      if(!row.name)return toast('Nom requis');
      if(isEdit)state.members=state.members.map(x=>x.id===row.id?row:x);else state.members.push(row);
      save(state);closeModal();setPage('members');toast('Membre enregistré');
    };
  });
}

function renderContributions(root){
  root.innerHTML=`<div class="page-head"><div></div><button class="btn btn-primary" id="addContrib">+ Cotisation</button></div>
  <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Réf</th><th>Membre</th><th>Montant</th><th>Date</th><th>Statut</th></tr></thead><tbody>${state.contributions.map(c=>{const mem=state.members.find(m=>m.id===c.memberId);return `<tr><td>${c.ref||c.id}</td><td>${mem?mem.name:c.memberId}</td><td>${fmt(c.amount)}</td><td>${c.date}</td><td><span class="badge ${c.status==='Payé'?'badge-ok':'badge-warn'}">${c.status}</span></td></tr>`}).join('')}</tbody></table></div></div>`;
  $('#addContrib').onclick=()=>{
    openModal(`<h3>Nouvelle cotisation</h3><div class="form-grid">
      <div class="field"><label>Membre</label><select id="cMember">${state.members.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></div>
      <div class="field"><label>Montant</label><input id="cAmount" type="number" value="100000"></div>
      <div class="field"><label>Date</label><input id="cDate" type="date" value="${today()}"></div>
      <div class="field"><label>Statut</label><select id="cStatus"><option>Payé</option><option>En attente</option></select></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveC">Enregistrer</button></div>`,()=>{
      $('#saveC').onclick=()=>{state.contributions.push({id:uid('CT'),memberId:$('#cMember').value,amount:Number($('#cAmount').value)||0,date:$('#cDate').value,status:$('#cStatus').value,ref:'REF-'+Math.random().toString().slice(2,6)});save(state);closeModal();setPage('contributions');toast('Cotisation ajoutée')};
    });
  };
}

function renderProjects(root){
  root.innerHTML=`<div class="page-head"><div></div><button class="btn btn-primary" id="addProject">+ Projet</button></div>
  <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Projet</th><th>Budget</th><th>Investi</th><th>Statut</th><th>Risque</th></tr></thead><tbody>${state.projects.map(p=>`<tr><td>${p.name}</td><td>${fmt(p.budget)}</td><td>${fmt(p.invested)}</td><td>${p.status}</td><td>${p.risk}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addProject').onclick=()=>{
    openModal(`<h3>Nouveau projet</h3><div class="form-grid">
      <div class="field full"><label>Nom</label><input id="pName"></div>
      <div class="field"><label>Budget</label><input id="pBudget" type="number" value="1000000"></div>
      <div class="field"><label>Investi</label><input id="pInv" type="number" value="0"></div>
      <div class="field"><label>Statut</label><select id="pStatus"><option>Étude</option><option>En cours</option><option>Clôturé</option></select></div>
      <div class="field"><label>Risque</label><select id="pRisk"><option>Faible</option><option>Moyen</option><option>Élevé</option></select></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveP">Enregistrer</button></div>`,()=>{
      $('#saveP').onclick=()=>{state.projects.push({id:uid('PJ'),name:$('#pName').value.trim()||'Projet',budget:Number($('#pBudget').value)||0,invested:Number($('#pInv').value)||0,status:$('#pStatus').value,risk:$('#pRisk').value,notes:''});save(state);closeModal();setPage('projects');toast('Projet ajouté')};
    });
  };
}

function renderFinance(root){
  const s=state.settings;const total=s.redistribution+s.investment+s.treasury+s.fees;
  root.innerHTML=`<div class="notice">La somme des enveloppes doit rester à 100 %. Actuellement : <b>${total} %</b>.</div>
  <div class="stats">
    <div class="card"><div class="stat-label">Redistribution</div><div class="stat-value">${s.redistribution}%</div></div>
    <div class="card"><div class="stat-label">Investissement</div><div class="stat-value">${s.investment}%</div></div>
    <div class="card"><div class="stat-label">Trésorerie</div><div class="stat-value">${s.treasury}%</div></div>
    <div class="card"><div class="stat-label">Frais</div><div class="stat-value">${s.fees}%</div></div>
  </div>
  <div class="card"><p>Simulation sur objectif mensuel (${fmt(s.monthlyGoal)}) :</p>
  <div class="metric-line" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)"><span>Redistribution</span><b>${fmt(s.monthlyGoal*s.redistribution/100)}</b></div>
  <div class="metric-line" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)"><span>Investissement</span><b>${fmt(s.monthlyGoal*s.investment/100)}</b></div>
  <div class="metric-line" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)"><span>Trésorerie</span><b>${fmt(s.monthlyGoal*s.treasury/100)}</b></div>
  <div class="metric-line" style="display:flex;justify-content:space-between;padding:10px 0"><span>Frais</span><b>${fmt(s.monthlyGoal*s.fees/100)}</b></div></div>`;
}

function renderTransactions(root){
  root.innerHTML=`<div class="page-head"><div></div><button class="btn btn-primary" id="addTx">+ Mouvement</button></div>
  <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Type</th><th>Libellé</th><th>Montant</th></tr></thead><tbody>${state.transactions.map(t=>`<tr><td>${t.date}</td><td>${t.type}</td><td>${t.label}</td><td>${fmt(t.amount)}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addTx').onclick=()=>{
    openModal(`<h3>Mouvement de trésorerie</h3><div class="form-grid">
      <div class="field"><label>Type</label><select id="tType"><option>Entrée</option><option>Sortie</option></select></div>
      <div class="field"><label>Montant</label><input id="tAmount" type="number" value="10000"></div>
      <div class="field full"><label>Libellé</label><input id="tLabel"></div>
      <div class="field"><label>Date</label><input id="tDate" type="date" value="${today()}"></div>
      <div class="field"><label>Catégorie</label><input id="tCat" value="Divers"></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveT">Enregistrer</button></div>`,()=>{
      $('#saveT').onclick=()=>{state.transactions.push({id:uid('TX'),type:$('#tType').value,label:$('#tLabel').value||'Mouvement',amount:Number($('#tAmount').value)||0,date:$('#tDate').value,category:$('#tCat').value});save(state);closeModal();setPage('transactions');toast('Mouvement enregistré')};
    });
  };
}

function renderReports(root){
  const paid=state.contributions.filter(c=>c.status==='Payé').reduce((s,c)=>s+c.amount,0);
  const bal=state.transactions.reduce((s,t)=>s+(t.type==='Entrée'?t.amount:-t.amount),0);
  root.innerHTML=`<div class="card"><h3 style="margin-top:0">Synthèse</h3>
  <p>Membres : <b>${state.members.length}</b></p>
  <p>Cotisations payées : <b>${fmt(paid)}</b></p>
  <p>Solde trésorerie : <b>${fmt(bal)}</b></p>
  <p>Projets : <b>${state.projects.length}</b></p>
  <button class="btn btn-primary" onclick="window.print()">Imprimer / PDF</button></div>`;
}

function renderGovernance(root){
  root.innerHTML=`<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Action</th><th>Responsable</th><th>Date</th><th>Statut</th></tr></thead><tbody>${state.governance.map(g=>`<tr><td>${g.action}</td><td>${g.owner}</td><td>${g.date}</td><td>${g.status}</td></tr>`).join('')}</tbody></table></div>
  <p class="footer-note">Voir aussi le dossier <code>gouvernance/</code> du dépôt pour le règlement complet.</p></div>`;
}

function renderGuide(root){
  root.innerHTML=`<div class="guide-grid">
  <div class="guide-step"><div class="step-num">1</div><h3>Membres</h3><p>Ajoutez les membres du collectif et leurs cotisations de référence.</p></div>
  <div class="guide-step"><div class="step-num">2</div><h3>Cotisations</h3><p>Enregistrez les paiements et suivez les statuts.</p></div>
  <div class="guide-step"><div class="step-num">3</div><h3>Projets</h3><p>Suivez les budgets et montants investis.</p></div>
  <div class="guide-step"><div class="step-num">4</div><h3>Répartition</h3><p>Simulez les enveloppes redistribution / investissement / trésorerie / frais.</p></div>
  </div>`;
}

function renderSettings(root){
  const s=state.settings;
  root.innerHTML=`<div class="card">
  <div class="form-grid">
    <div class="field"><label>Nom de l’espace</label><input id="sName" value="${s.name||''}"></div>
    <div class="field"><label>Devise</label><input id="sCur" value="${s.currency||'XAF'}"></div>
    <div class="field"><label>Objectif mensuel</label><input id="sGoal" type="number" value="${s.monthlyGoal||0}"></div>
    <div class="field"><label>Redistribution %</label><input id="sRed" type="number" value="${s.redistribution}"></div>
    <div class="field"><label>Investissement %</label><input id="sInv" type="number" value="${s.investment}"></div>
    <div class="field"><label>Trésorerie %</label><input id="sTre" type="number" value="${s.treasury}"></div>
    <div class="field"><label>Frais %</label><input id="sFees" type="number" value="${s.fees}"></div>
  </div>
  <div class="modal-actions" style="justify-content:flex-start;margin-top:16px">
    <button class="btn btn-primary" id="saveSettings">Enregistrer</button>
    <button class="btn btn-light" id="exportData">Exporter JSON</button>
    <button class="btn btn-light" id="importData">Importer JSON</button>
  </div></div>`;
  $('#saveSettings').onclick=()=>{
    state.settings={...state.settings,name:$('#sName').value,currency:$('#sCur').value,monthlyGoal:Number($('#sGoal').value)||0,redistribution:Number($('#sRed').value)||0,investment:Number($('#sInv').value)||0,treasury:Number($('#sTre').value)||0,fees:Number($('#sFees').value)||0};
    save(state);toast('Paramètres enregistrés');
  };
  $('#exportData').onclick=()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='collective-backup.json';a.click();
  };
  $('#importData').onclick=()=>$('#importFile').click();
}

function openModal(html,cb){
  const root=$('#modalRoot');root.innerHTML=`<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
  root.onclick=e=>{if(e.target.classList.contains('modal-backdrop')||e.target.hasAttribute('data-close'))closeModal()};
  if(cb)cb();
}
function closeModal(){$('#modalRoot').innerHTML=''}

function exportCSV(name,cols,rows){
  const lines=[cols.join(';')].concat(rows.map(r=>cols.map(c=>`"${(r[c]??'').toString().replace(/"/g,'""')}"`).join(';')));
  const blob=new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name+'.csv';a.click();
}

$('#exportAll').onclick=()=>{$('#importFile').value='';const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='collective-backup.json';a.click();toast('Export prêt')};
$('#importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);save(state);setPage('dashboard');toast('Données importées')}catch(err){toast('Fichier invalide')}};r.readAsText(f)};

function render(){
  $('#today').textContent=new Date().toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  $('#year').textContent=new Date().getFullYear();
  $('#memberNavCount').textContent=state.members.length;
  setPage('dashboard');
}
$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)setPage(b.dataset.page)});
render();
