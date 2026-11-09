const params=new URLSearchParams(location.search);
const COL_ID=params.get('id')||'col-001';
const KEY='collective_v3_data_'+COL_ID;
const PASS_KEY='collective_v3_unlocked_'+COL_ID;
const ADMIN_PASS='Azerty1234@idiot';
const HUB_KEY='collective_hub_v1';
const CURRENCIES=['XAF','EUR','USD'];

function hubName(){
  try{
    const h=JSON.parse(localStorage.getItem(HUB_KEY)||'{}');
    const c=(h.collectives||[]).find(x=>x.id===COL_ID);
    return c?c.name:null;
  }catch(e){return null}
}

const themes={
  gold:{primary:'#d9b66f',soft:'rgba(217,182,111,.16)',sidebar:'#0b1221',sidebar2:'#0a1020',text:'#e8d5a8'},
  blue:{primary:'#6ea8fe',soft:'rgba(110,168,254,.16)',sidebar:'#0b1221',sidebar2:'#0a1020',text:'#a5c8ff'},
  green:{primary:'#79ddb0',soft:'rgba(121,221,176,.14)',sidebar:'#0b1221',sidebar2:'#0a1020',text:'#9aebc8'},
  violet:{primary:'#b197fc',soft:'rgba(177,151,252,.16)',sidebar:'#0b1221',sidebar2:'#0a1020',text:'#d0bfff'},
  coral:{primary:'#ffa8a8',soft:'rgba(255,168,168,.14)',sidebar:'#0b1221',sidebar2:'#0a1020',text:'#ffc9c9'}
};
const bgThemes={kalla:'#0a1020',midnight:'#060a14',charcoal:'#0f1419',deepnavy:'#0a1628',ink:'#050508',softlight:'#f4f6fc'};

const initial={
  settings:{name:hubName()||'Collectif de gestion',currency:'XAF',redistribution:55,investment:25,treasury:15,fees:5,monthlyGoal:2340000,theme:'gold',bg:'kalla',monthLabel:'Mai 2026'},
  payments:{momo:{number:'',owner:''},airtel:{number:'',owner:''},orange:{number:'',owner:''},visa:{number:'',owner:'',bank:''}},
  members:[
    {id:'MB-001',name:'Mamadou Diallo',email:'mamadou@example.test',phone:'+242 06 000 01',joined:'2026-01-12',contribution:100000,status:'Actif',order:1},
    {id:'MB-002',name:'Aissata Koné',email:'aissata@example.test',phone:'+242 06 000 02',joined:'2026-01-18',contribution:100000,status:'Actif',order:2},
    {id:'MB-003',name:'Ibrahim Traoré',email:'ibrahim@example.test',phone:'+242 06 000 03',joined:'2026-02-02',contribution:95000,status:'Actif',order:3},
    {id:'MB-004',name:'Fatoumata Ba',email:'fatou@example.test',phone:'+242 06 000 04',joined:'2026-02-11',contribution:100000,status:'Actif',order:4}
  ],
  contributions:[
    {id:'CT-001',memberId:'MB-001',amount:195000,date:'2026-05-01',status:'Payé',ref:'REF-501'},
    {id:'CT-002',memberId:'MB-002',amount:195000,date:'2026-05-01',status:'Payé',ref:'REF-502'},
    {id:'CT-003',memberId:'MB-003',amount:195000,date:'2026-05-02',status:'Payé',ref:'REF-503'},
    {id:'CT-004',memberId:'MB-004',amount:195000,date:'2026-05-02',status:'En attente',ref:'REF-504'}
  ],
  projects:[
    {id:'PJ-001',name:'Commerce de produits',category:'Commerce',budget:2500000,invested:2020000,value:3250000,benefit:750000,status:'Actif',risk:'Modéré',start:'2026-01-05'},
    {id:'PJ-002',name:'Service de livraison',category:'Services',budget:1200000,invested:1200000,value:1620000,benefit:420000,status:'Actif',risk:'Faible',start:'2026-02-01'},
    {id:'PJ-003',name:'Vente en ligne',category:'Digital',budget:820000,invested:820000,value:1148000,benefit:328000,status:'Actif',risk:'Modéré',start:'2026-02-15'}
  ],
  transactions:[
    {id:'TX-001',date:'2026-05-01',type:'Entrée',label:'Cotisation mensuelle',amount:2340000,category:'Cotisations'},
    {id:'TX-002',date:'2026-05-01',type:'Sortie',label:'Tontine — Mamadou Diallo',amount:1287000,category:'Redistribution'},
    {id:'TX-003',date:'2026-05-01',type:'Sortie',label:'Fonds investissement',amount:585000,category:'Investissement'},
    {id:'TX-004',date:'2026-05-01',type:'Sortie',label:'Fonds de réserve',amount:351000,category:'Trésor'},
    {id:'TX-005',date:'2026-05-01',type:'Sortie',label:'Frais de gestion',amount:117000,category:'Frais'}
  ],
  yields:[{m:'Janv.',cap:2200,ben:120},{m:'Fév.',cap:3500,ben:150},{m:'Mars',cap:4200,ben:210},{m:'Avr.',cap:5500,ben:280},{m:'Mai',cap:7020,ben:300},{m:'Juin',cap:7020,ben:2228}]
};

let state=load();
let unlocked=sessionStorage.getItem(PASS_KEY)==='1';

function load(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw) return structuredClone(initial);
    const d=JSON.parse(raw);
    if(!d.payments) d.payments=structuredClone(initial.payments);
    if(!d.settings) d.settings=structuredClone(initial.settings);
    if(!d.settings.bg) d.settings.bg='kalla';
    if(!d.yields) d.yields=structuredClone(initial.yields);
    const hn=hubName(); if(hn) d.settings.name=hn;
    return d;
  }catch(e){return structuredClone(initial)}
}
function save(msg){localStorage.setItem(KEY,JSON.stringify(state)); if(msg) toast(msg)}
function fmt(n){return new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(n)||0)+' '+(state.settings.currency||'XAF')}
function uid(p){return p+'-'+Math.random().toString(36).slice(2,7).toUpperCase()}
function today(){return new Date().toISOString().slice(0,10)}
function $(s,el=document){return el.querySelector(s)}
function $$(s,el=document){return [...el.querySelectorAll(s)]}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function memberName(id){return state.members.find(m=>m.id===id)?.name||id}

function applyTheme(){
  const t=themes[state.settings.theme]||themes.gold;
  const r=document.documentElement.style;
  r.setProperty('--primary',t.primary); r.setProperty('--primary-soft',t.soft);
  r.setProperty('--primary-text',t.text||t.primary); r.setProperty('--sidebar',t.sidebar); r.setProperty('--sidebar-2',t.sidebar2);
  const bgKey=state.settings.bg||'kalla'; const bg=bgThemes[bgKey]||bgThemes.kalla; r.setProperty('--bg',bg);
  const light=bgKey==='softlight';
  r.setProperty('--card', light?'#ffffff':'#121d31'); r.setProperty('--text', light?'#172338':'#f4f6fc');
  r.setProperty('--muted', light?'#6b7a99':'#9fadc3'); r.setProperty('--line', light?'#e6ebf5':'#2a3a55');
  document.body.style.background=light?bg:'radial-gradient(ellipse at top right,#182743 0,transparent 42%),'+bg;
}
function requireUnlock(label){if(unlocked)return true; openPasswordModal(label); return false}
function setUnlock(v){unlocked=!!v; if(unlocked)sessionStorage.setItem(PASS_KEY,'1'); else sessionStorage.removeItem(PASS_KEY); updateLockUI(); render()}
function updateLockUI(){
  const btn=$('#toggleLockBtn'), mode=$('#wsMode'), pill=$('#modePill');
  if(unlocked){btn.textContent='Verrouiller'; mode.textContent='Mode édition'; pill.textContent='Édition active'; pill.classList.add('edit')}
  else{btn.textContent='Déverrouiller'; mode.textContent='Lecture seule'; pill.textContent='Lecture seule'; pill.classList.remove('edit')}
  $('#wsName').textContent=state.settings.name||'Admin';
}
function openPasswordModal(reason){
  openModal(`<h3>Accès administrateur</h3><p class="muted">Mot de passe requis pour ${reason||'modifier'}.</p>
    <div class="form-grid"><div class="field full"><label>Mot de passe</label><input id="passInput" type="password"></div></div>
    <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="passOk">Valider</button></div>`,()=>{
    const input=$('#passInput'); input.focus();
    const go=()=>{if(input.value===ADMIN_PASS){setUnlock(true);closeModal();toast('Déverrouillé')}else{toast('Incorrect');input.value='';input.focus()}};
    $('#passOk').onclick=go; input.onkeydown=e=>{if(e.key==='Enter')go()};
  });
}
function totals(){
  const s=state.settings;
  const paid=state.contributions.filter(c=>c.status==='Payé').reduce((a,c)=>a+c.amount,0);
  const monthTotal=paid||s.monthlyGoal||0;
  return {paid,monthTotal,red:monthTotal*s.redistribution/100,inv:monthTotal*s.investment/100,tre:monthTotal*s.treasury/100,fees:monthTotal*s.fees/100,
    bal:state.transactions.reduce((a,t)=>a+(t.type==='Entrée'?t.amount:-t.amount),0),
    invested:state.projects.reduce((a,p)=>a+(p.invested||0),0),
    value:state.projects.reduce((a,p)=>a+(p.value||p.invested||0),0),
    benefit:state.projects.reduce((a,p)=>a+(p.benefit||0),0)};
}
function donutCSS(s){const a=s.redistribution,b=s.investment,c=s.treasury; return `--p1:${a}%;--p2:${a+b}%;--p3:${a+b+c}%`}

function setPage(page){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const titles={dashboard:['Tableau de bord','Espace : '+(state.settings.name||'Collectif')],members:['Membres','Membres de ce collectif.'],contributions:['Cotisations','Cotisations de ce collectif.'],tontine:['Tontine','Ordre des bénéficiaires.'],projects:['Investissements','Projets de ce collectif.'],transactions:['Trésor','Mouvements.'],finance:['Frais de gestion','Répartition.'],payments:['Paiements','Coordonnées.'],reports:['Rapports','Synthèse.'],settings:['Paramètres','Thème, devise et sécurité.']};
  const t=titles[page]||['COLLECTIVE','']; $('#pageTitle').textContent=t[0]; $('#pageSub').textContent=t[1];
  const root=$('#pageContent'); root.innerHTML='';
  ({dashboard:renderDashboard,members:renderMembers,contributions:renderContributions,tontine:renderTontine,projects:renderProjects,transactions:renderTransactions,finance:renderFinance,payments:renderPayments,reports:renderReports,settings:renderSettings}[page]||renderDashboard)(root);
}

function renderDashboard(root){
  const t=totals(), s=state.settings, ordered=[...state.members].sort((a,b)=>(a.order||99)-(b.order||99)), next=ordered[0];
  root.innerHTML=`<div class="stats">
    <div class="card"><div class="stat"><div class="ico g">CO</div><div><div class="stat-label">Cotisations du mois</div><div class="stat-value">${fmt(t.monthTotal)}</div><div class="stat-sub">${state.members.length} membres</div></div></div></div>
    <div class="card"><div class="stat"><div class="ico g">RD</div><div><div class="stat-label">Redistribution (${s.redistribution}%)</div><div class="stat-value">${fmt(t.red)}</div></div></div></div>
    <div class="card"><div class="stat"><div class="ico b">IN</div><div><div class="stat-label">Investissement (${s.investment}%)</div><div class="stat-value">${fmt(t.inv)}</div></div></div></div>
    <div class="card"><div class="stat"><div class="ico y">TR</div><div><div class="stat-label">Trésor (${s.treasury}%)</div><div class="stat-value">${fmt(t.tre)}</div></div></div></div></div>
  <div class="grid-3">
    <div class="card"><div class="section-title">Prochain bénéficiaire</div>
      <div class="beneficiary"><div class="avatar-lg">${(next?.name||'?').split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
        <div><b>${next?.name||'—'}</b><div class="muted">Recevra : <b>${fmt(t.red)}</b></div></div></div>
      <ul class="order-list">${ordered.slice(0,4).map((m,i)=>`<li><span><span class="n">${i+1}</span>${m.name}</span></li>`).join('')}</ul></div>
    <div class="card"><div class="section-title">Répartition</div>
      <div class="donut-wrap"><div class="donut" style="${donutCSS(s)}" data-center="${fmt(t.monthTotal).replace(' '+s.currency,'')}\nTotal"></div>
        <div class="legend"><div><span class="dot g"></span> ${s.redistribution}% Redist.</div><div><span class="dot b"></span> ${s.investment}% Invest.</div><div><span class="dot y"></span> ${s.treasury}% Trésor</div><div><span class="dot gr"></span> ${s.fees}% Frais</div></div></div></div>
    <div class="card"><div class="section-title">Infos</div><div class="info-list">
      <div class="row"><span>Membres actifs</span><b>${state.members.filter(m=>m.status==='Actif').length}</b></div>
      <div class="row"><span>Cotisations payées</span><b>${state.contributions.filter(c=>c.status==='Payé').length}/${state.contributions.length}</b></div>
      <div class="row"><span>Solde</span><b>${fmt(Math.max(0,t.bal))}</b></div></div></div></div>
  <div class="card"><div class="section-title">Transactions</div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Libellé</th><th>Montant</th></tr></thead>
    <tbody>${state.transactions.slice().reverse().map(tx=>`<tr><td>${tx.date}</td><td>${tx.category||tx.type}</td><td>${tx.label}</td>
      <td class="${tx.type==='Entrée'?'pos':'neg'}">${tx.type==='Entrée'?'+':'-'}${fmt(tx.amount)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function renderTontine(root){
  const t=totals(), ordered=[...state.members].sort((a,b)=>(a.order||99)-(b.order||99));
  root.innerHTML=`<div class="notice">Tontine de ce collectif uniquement.</div><div class="grid-2">
    <div class="card"><div class="section-title">Ordre</div><ul class="order-list">${ordered.map((m,i)=>`<li><span><span class="n">${i+1}</span><b>${m.name}</b></span>
      <span>${i===0?`<span class="badge badge-info">Prochain · ${fmt(t.red)}</span>`:''}</span></li>`).join('')}</ul>
      <div style="margin-top:12px"><button class="btn btn-primary" id="editOrder">Modifier l’ordre</button></div></div>
    <div class="card"><div class="section-title">Répartition</div><div class="donut-wrap"><div class="donut" style="${donutCSS(state.settings)}" data-center="${state.settings.redistribution}%"></div></div></div></div>`;
  $('#editOrder').onclick=()=>{if(!requireUnlock('ordre'))return;
    openModal(`<h3>Ordre</h3><div class="form-grid">${ordered.map(m=>`<div class="field"><label>${m.name}</label><input type="number" data-oid="${m.id}" value="${m.order||1}"></div>`).join('')}</div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveOrd">OK</button></div>`,()=>{
      $('#saveOrd').onclick=()=>{$$('[data-oid]').forEach(inp=>{const m=state.members.find(x=>x.id===inp.dataset.oid);if(m)m.order=Number(inp.value)||99});save('OK');closeModal();setPage('tontine')}});
  };
}
function renderProjects(root){
  const t=totals();
  root.innerHTML=`<div class="stats">
    <div class="card"><div class="stat-label">Investi</div><div class="stat-value">${fmt(t.invested)}</div></div>
    <div class="card"><div class="stat-label">Valeur</div><div class="stat-value">${fmt(t.value)}</div></div>
    <div class="card"><div class="stat-label">Bénéfices</div><div class="stat-value">${fmt(t.benefit)}</div></div>
    <div class="card"><div class="stat-label">Rendement</div><div class="stat-value">${t.invested?((t.benefit/t.invested)*100).toFixed(1):0}%</div></div></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Projet</th><th>Catégorie</th><th>Investi</th><th>Valeur</th><th>Bénéfice</th></tr></thead>
    <tbody>${state.projects.map(p=>`<tr><td><b>${p.name}</b></td><td>${p.category||'—'}</td><td>${fmt(p.invested)}</td><td>${fmt(p.value||p.invested)}</td><td class="pos">${fmt(p.benefit||0)}</td></tr>`).join('')}</tbody></table></div>
    <div style="margin-top:12px"><button class="btn btn-primary" id="addProj">Ajouter</button></div></div>`;
  $('#addProj').onclick=()=>{if(!requireUnlock('projet'))return;
    openModal(`<h3>Projet</h3><div class="form-grid"><div class="field full"><label>Nom</label><input id="pName"></div>
      <div class="field"><label>Capital</label><input id="pInv" type="number" value="1000000"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveP">OK</button></div>`,()=>{
      $('#saveP').onclick=()=>{const inv=Number($('#pInv').value)||0;state.projects.push({id:uid('PJ'),name:$('#pName').value.trim()||'Projet',category:'Commerce',budget:inv,invested:inv,value:inv,benefit:0,status:'Actif',start:today()});save('OK');closeModal();setPage('projects')}});
  };
}
function renderMembers(root){
  root.innerHTML=`<div class="toolbar"><input class="search" id="q" placeholder="Rechercher..."><button class="btn btn-primary" id="addM">Ajouter</button></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Nom</th><th>Contact</th><th>Cotisation</th><th>Ordre</th><th></th></tr></thead><tbody id="rows"></tbody></table></div></div>`;
  const draw=()=>{const q=($('#q').value||'').toLowerCase();
    $('#rows').innerHTML=state.members.filter(m=>!q||m.name.toLowerCase().includes(q)).map(m=>`<tr><td><b>${m.name}</b></td><td>${m.phone||''}</td><td>${fmt(m.contribution)}</td><td>${m.order||'—'}</td>
      <td><button class="btn btn-ghost" data-e="${m.id}">Modifier</button></td></tr>`).join('')};
  draw(); $('#q').oninput=draw;
  $('#addM').onclick=()=>{if(!requireUnlock('membre'))return; memberModal()};
  root.onclick=e=>{const b=e.target.closest('[data-e]');if(!b)return;if(!requireUnlock('membre'))return;memberModal(state.members.find(m=>m.id===b.dataset.e))};
}
function memberModal(m){
  openModal(`<h3>${m?'Modifier':'Nouveau'} membre</h3><div class="form-grid">
    <div class="field"><label>Nom</label><input id="mName" value="${m?.name||''}"></div>
    <div class="field"><label>Téléphone</label><input id="mPhone" value="${m?.phone||''}"></div>
    <div class="field"><label>Cotisation</label><input id="mC" type="number" value="${m?.contribution||100000}"></div>
    <div class="field"><label>Ordre</label><input id="mO" type="number" value="${m?.order||state.members.length+1}"></div></div>
    <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveM">OK</button></div>`,()=>{
    $('#saveM').onclick=()=>{const row={id:m?.id||uid('MB'),name:$('#mName').value.trim(),phone:$('#mPhone').value.trim(),email:m?.email||'',joined:m?.joined||today(),contribution:Number($('#mC').value)||0,status:'Actif',order:Number($('#mO').value)||99};
      if(!row.name)return toast('Nom requis');
      if(m) state.members=state.members.map(x=>x.id===row.id?row:x); else state.members.push(row);
      save('OK');closeModal();setPage('members')}});
}
function renderContributions(root){
  root.innerHTML=`<div class="toolbar"><button class="btn btn-primary" id="addC">Ajouter</button></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Membre</th><th>Montant</th><th>Date</th><th>Statut</th></tr></thead>
    <tbody>${state.contributions.map(c=>`<tr><td>${memberName(c.memberId)}</td><td>${fmt(c.amount)}</td><td>${c.date}</td>
      <td><span class="badge ${c.status==='Payé'?'badge-ok':'badge-warn'}">${c.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addC').onclick=()=>{if(!requireUnlock('cotisation'))return;
    openModal(`<h3>Cotisation</h3><div class="form-grid">
      <div class="field"><label>Membre</label><select id="cM">${state.members.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></div>
      <div class="field"><label>Montant</label><input id="cA" type="number" value="100000"></div>
      <div class="field"><label>Date</label><input id="cD" type="date" value="${today()}"></div>
      <div class="field"><label>Statut</label><select id="cS"><option>Payé</option><option>En attente</option></select></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveC">OK</button></div>`,()=>{
      $('#saveC').onclick=()=>{state.contributions.push({id:uid('CT'),memberId:$('#cM').value,amount:Number($('#cA').value)||0,date:$('#cD').value,status:$('#cS').value,ref:'REF'});save('OK');closeModal();setPage('contributions')}});
  };
}
function renderTransactions(root){
  root.innerHTML=`<div class="toolbar"><button class="btn btn-primary" id="addT">Ajouter</button></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Libellé</th><th>Montant</th></tr></thead>
    <tbody>${state.transactions.map(t=>`<tr><td>${t.date}</td><td>${t.type}</td><td>${t.label}</td>
      <td class="${t.type==='Entrée'?'pos':'neg'}">${t.type==='Entrée'?'+':'-'}${fmt(t.amount)}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#addT').onclick=()=>{if(!requireUnlock('mouvement'))return;
    openModal(`<h3>Mouvement</h3><div class="form-grid">
      <div class="field"><label>Type</label><select id="tT"><option>Entrée</option><option>Sortie</option></select></div>
      <div class="field"><label>Montant</label><input id="tA" type="number" value="10000"></div>
      <div class="field full"><label>Libellé</label><input id="tL"></div>
      <div class="field"><label>Date</label><input id="tD" type="date" value="${today()}"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveT">OK</button></div>`,()=>{
      $('#saveT').onclick=()=>{state.transactions.push({id:uid('TX'),type:$('#tT').value,label:$('#tL').value||'Mouvement',amount:Number($('#tA').value)||0,date:$('#tD').value,category:'Divers'});save('OK');closeModal();setPage('transactions')}});
  };
}
function renderFinance(root){
  const s=state.settings,t=totals();
  root.innerHTML=`<div class="notice">Total % = ${s.redistribution+s.investment+s.treasury+s.fees}</div>
  <div class="card"><div class="donut-wrap"><div class="donut" style="${donutCSS(s)}" data-center="100%"></div>
    <div class="legend"><div><span class="dot g"></span> Redist. ${s.redistribution}%</div><div><span class="dot b"></span> Invest. ${s.investment}%</div>
    <div><span class="dot y"></span> Trésor ${s.treasury}%</div><div><span class="dot gr"></span> Frais ${s.fees}%</div></div></div>
    <div style="margin-top:14px"><button class="btn btn-primary" id="editPct">Modifier</button></div></div>`;
  $('#editPct').onclick=()=>{if(!requireUnlock('%'))return;
    openModal(`<h3>Pourcentages</h3><div class="form-grid">
      <div class="field"><label>Redistribution</label><input id="r" type="number" value="${s.redistribution}"></div>
      <div class="field"><label>Investissement</label><input id="i" type="number" value="${s.investment}"></div>
      <div class="field"><label>Trésor</label><input id="t" type="number" value="${s.treasury}"></div>
      <div class="field"><label>Frais</label><input id="f" type="number" value="${s.fees}"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveF">OK</button></div>`,()=>{
      $('#saveF').onclick=()=>{state.settings.redistribution=Number($('#r').value)||0;state.settings.investment=Number($('#i').value)||0;state.settings.treasury=Number($('#t').value)||0;state.settings.fees=Number($('#f').value)||0;save('OK');closeModal();setPage('finance')}});
  };
}
function renderPayments(root){
  const p=state.payments;
  const card=(title,num,own)=>`<div class="pay-card"><h3>${title}</h3><div class="num">${num||'Non renseigné'}</div><div class="owner">${own||'—'}</div></div>`;
  root.innerHTML=`<div class="toolbar"><button class="btn btn-primary" id="editPay">Configurer</button></div>
  <div class="pay-grid">${card('MoMo',p.momo?.number,p.momo?.owner)}${card('Airtel',p.airtel?.number,p.airtel?.owner)}${card('Orange',p.orange?.number,p.orange?.owner)}${card('Visa',p.visa?.number,p.visa?.owner)}</div>`;
  $('#editPay').onclick=()=>{if(!requireUnlock('paiements'))return;
    openModal(`<h3>Paiements</h3><div class="form-grid">
      <div class="field full"><label>MoMo</label><input id="mn" value="${p.momo?.number||''}"></div>
      <div class="field full"><label>Titulaire MoMo</label><input id="mo" value="${p.momo?.owner||''}"></div>
      <div class="field full"><label>Airtel</label><input id="an" value="${p.airtel?.number||''}"></div>
      <div class="field full"><label>Orange</label><input id="on" value="${p.orange?.number||''}"></div>
      <div class="field full"><label>Visa / compte</label><input id="vn" value="${p.visa?.number||''}"></div></div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveP">OK</button></div>`,()=>{
      $('#saveP').onclick=()=>{state.payments={momo:{number:$('#mn').value.trim(),owner:$('#mo').value.trim()},airtel:{number:$('#an').value.trim(),owner:''},orange:{number:$('#on').value.trim(),owner:''},visa:{number:$('#vn').value.trim(),owner:'',bank:''}};save('OK');closeModal();setPage('payments')}});
  };
}
function renderReports(root){
  const t=totals();
  root.innerHTML=`<div class="card"><div class="section-title">Synthèse — ${state.settings.name||''}</div>
    <div class="info-list"><div class="row"><span>Membres</span><b>${state.members.length}</b></div>
    <div class="row"><span>Cotisations</span><b>${fmt(t.paid)}</b></div>
    <div class="row"><span>Investi</span><b>${fmt(t.invested)}</b></div>
    <div class="row"><span>Solde</span><b>${fmt(t.bal)}</b></div></div></div>`;
}
function renderSettings(root){
  const s=state.settings;
  root.innerHTML=`<div class="card" style="margin-bottom:14px">
    <div class="section-title">Couleur d'accent</div>
    <div class="themes" id="themes">${Object.keys(themes).map(k=>`<button type="button" class="theme-swatch ${s.theme===k?'active':''}" data-theme="${k}" style="background:${themes[k].primary}"></button>`).join('')}</div>
    <div class="section-title" style="margin-top:18px">Fond</div>
    <div class="bg-themes" id="bgThemes">${Object.entries(bgThemes).map(([k,v])=>`<button type="button" class="bg-swatch ${(s.bg||'kalla')===k?'active':''}" data-bg="${k}" style="background:${v}"></button>`).join('')}</div></div>
  <div class="card"><div class="form-grid">
    <div class="field"><label>Nom</label><input id="sName" value="${s.name||''}" ${unlocked?'':'disabled'}></div>
    <div class="field"><label>Devise</label><select id="sCur" ${unlocked?'':'disabled'}>${CURRENCIES.map(c=>`<option value="${c}" ${(s.currency||'XAF')===c?'selected':''}>${c}</option>`).join('')}</select></div></div>
    <div class="modal-actions" style="justify-content:flex-start">
      <button class="btn btn-primary" id="saveS" ${unlocked?'':'disabled'}>Enregistrer</button>
      <button class="btn btn-danger" id="lock">Verrouiller</button></div></div>`;
  $$('#themes [data-theme]').forEach(b=>{b.onclick=()=>{if(!requireUnlock('thème'))return;state.settings.theme=b.dataset.theme;applyTheme();save('OK');setPage('settings')}});
  $$('#bgThemes [data-bg]').forEach(b=>{b.onclick=()=>{if(!requireUnlock('fond'))return;state.settings.bg=b.dataset.bg;applyTheme();save('OK');setPage('settings')}});
  $('#saveS').onclick=()=>{if(!requireUnlock('paramètres'))return;state.settings.name=$('#sName').value.trim()||state.settings.name;state.settings.currency=$('#sCur').value||'XAF';save('Devise : '+state.settings.currency);updateLockUI();setPage('settings')};
  $('#lock').onclick=()=>{setUnlock(false);toast('Verrouillé')};
}
function openModal(html,cb){const root=$('#modalRoot');root.innerHTML=`<div class="modal-backdrop"><div class="modal">${html}</div></div>`;root.onclick=e=>{if(e.target.classList.contains('modal-backdrop')||e.target.hasAttribute('data-close'))closeModal()};if(cb)cb()}
function closeModal(){$('#modalRoot').innerHTML=''}
function render(){applyTheme();$('#today').textContent=new Date().toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});updateLockUI();setPage('dashboard')}
$('#exportAll').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='collective-'+COL_ID+'.json';a.click()};
$('#importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);save('Import');setPage('dashboard')}catch(err){toast('Invalide')}};r.readAsText(f);e.target.value=''};
$('#toggleLockBtn').onclick=()=>{if(unlocked){setUnlock(false);toast('Verrouillé')}else openPasswordModal('déverrouiller')};
$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)setPage(b.dataset.page)});
render();
