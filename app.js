const KEY='collective_v3_data';
const PASS_KEY='collective_v3_unlocked';
const ADMIN_PASS='Azerty1234@idiot';

const themes={
  blue:{primary:'#1e4fd6',soft:'#e8efff',sidebar:'#0b1f4a',sidebar2:'#0e2a5c'},
  green:{primary:'#0ca678',soft:'#e6fcf5',sidebar:'#0b3d2e',sidebar2:'#0f4c3a'},
  purple:{primary:'#7048e8',soft:'#f3f0ff',sidebar:'#2b2142',sidebar2:'#3b2d5c'},
  gold:{primary:'#c9a227',soft:'#fff9db',sidebar:'#3d2e0b',sidebar2:'#5c4512'},
  red:{primary:'#e03131',soft:'#ffe3e3',sidebar:'#3b1212',sidebar2:'#5c1a1a'}
};

const initial={
  settings:{name:'Collectif de gestion',currency:'XAF',redistribution:55,investment:25,treasury:15,fees:5,monthlyGoal:2340000,theme:'blue',monthLabel:'Mai 2026'},
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
  yields:[
    {m:'Janv.',cap:2200,ben:120},{m:'Fév.',cap:3500,ben:150},{m:'Mars',cap:4200,ben:210},
    {m:'Avr.',cap:5500,ben:280},{m:'Mai',cap:7020,ben:300},{m:'Juin',cap:7020,ben:2228}
  ]
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
    if(!d.yields) d.yields=structuredClone(initial.yields);
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
  const t=themes[state.settings.theme]||themes.blue;
  const r=document.documentElement.style;
  r.setProperty('--primary',t.primary);
  r.setProperty('--primary-soft',t.soft);
  r.setProperty('--sidebar',t.sidebar);
  r.setProperty('--sidebar-2',t.sidebar2);
}

function requireUnlock(label){
  if(unlocked) return true;
  openPasswordModal(label);
  return false;
}
function setUnlock(v){
  unlocked=!!v;
  if(unlocked) sessionStorage.setItem(PASS_KEY,'1'); else sessionStorage.removeItem(PASS_KEY);
  updateLockUI();
  render();
}
function updateLockUI(){
  const btn=$('#toggleLockBtn');
  const mode=$('#wsMode');
  const pill=$('#modePill');
  if(unlocked){
    btn.textContent='Verrouiller';
    mode.textContent='Mode édition';
    pill.textContent='Édition active';
    pill.classList.add('edit');
  }else{
    btn.textContent='Déverrouiller';
    mode.textContent='Lecture seule';
    pill.textContent='Lecture seule';
    pill.classList.remove('edit');
  }
  $('#wsName').textContent=state.settings.name||'Admin';
}

function openPasswordModal(reason){
  openModal(`<h3>Accès administrateur</h3>
    <p class="muted">Mot de passe requis pour ${reason||'modifier'}.</p>
    <div class="form-grid"><div class="field full"><label>Mot de passe</label>
    <input id="passInput" type="password" placeholder="••••••••"></div></div>
    <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button>
    <button class="btn btn-primary" id="passOk">Valider</button></div>`,()=>{
    const input=$('#passInput'); input.focus();
    const go=()=>{
      if(input.value===ADMIN_PASS){setUnlock(true);closeModal();toast('Espace déverrouillé')}
      else{toast('Mot de passe incorrect');input.value='';input.focus()}
    };
    $('#passOk').onclick=go;
    input.onkeydown=e=>{if(e.key==='Enter') go()};
  });
}

function totals(){
  const s=state.settings;
  const paid=state.contributions.filter(c=>c.status==='Payé').reduce((a,c)=>a+c.amount,0);
  const monthTotal=paid||s.monthlyGoal||0;
  const red=monthTotal*s.redistribution/100;
  const inv=monthTotal*s.investment/100;
  const tre=monthTotal*s.treasury/100;
  const fees=monthTotal*s.fees/100;
  const bal=state.transactions.reduce((a,t)=>a+(t.type==='Entrée'?t.amount:-t.amount),0);
  const invested=state.projects.reduce((a,p)=>a+(p.invested||0),0);
  const value=state.projects.reduce((a,p)=>a+(p.value||p.invested||0),0);
  const benefit=state.projects.reduce((a,p)=>a+(p.benefit||0),0);
  return {paid,monthTotal,red,inv,tre,fees,bal,invested,value,benefit};
}

function donutCSS(s){
  const a=s.redistribution,b=s.investment,c=s.treasury;
  const p1=a+'%', p2=(a+b)+'%', p3=(a+b+c)+'%';
  return `--p1:${p1};--p2:${p2};--p3:${p3}`;
}

function setPage(page){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const titles={
    dashboard:['Tableau de bord','Voici un aperçu de l’activité de votre association.'],
    members:['Membres','Gérez les membres du collectif.'],
    contributions:['Cotisations','Suivi des cotisations et statuts.'],
    tontine:['Tontine (Redistribution)','Ordre des bénéficiaires et redistribution.'],
    projects:['Suivi des investissements & Rendements','Évolution des investissements et bénéfices.'],
    transactions:['Trésor','Journal des mouvements de trésorerie.'],
    finance:['Frais de gestion','Répartition et frais configurables.'],
    payments:['Paiements','Vos coordonnées pour recevoir les fonds.'],
    reports:['Rapports','Synthèse et export.'],
    settings:['Paramètres','Thème, devise, sécurité et données.']
  };
  const t=titles[page]||['COLLECTIVE',''];
  $('#pageTitle').textContent=t[0];
  $('#pageSub').textContent=t[1];
  const root=$('#pageContent'); root.innerHTML='';
  const map={dashboard:renderDashboard,members:renderMembers,contributions:renderContributions,tontine:renderTontine,projects:renderProjects,transactions:renderTransactions,finance:renderFinance,payments:renderPayments,reports:renderReports,settings:renderSettings};
  (map[page]||renderDashboard)(root);
}

function renderDashboard(root){
  const t=totals(); const s=state.settings;
  const ordered=[...state.members].sort((a,b)=>(a.order||99)-(b.order||99));
  const next=ordered[0];
  root.innerHTML=`
  <div class="stats">
    <div class="card"><div class="stat"><div class="ico g">🏠</div><div><div class="stat-label">Total cotisations du mois</div><div class="stat-value">${fmt(t.monthTotal)}</div><div class="stat-sub">${state.members.length} membres</div></div></div></div>
    <div class="card"><div class="stat"><div class="ico g">↻</div><div><div class="stat-label">Redistribution (${s.redistribution}%)</div><div class="stat-value">${fmt(t.red)}</div><div class="stat-sub">Versé au bénéficiaire</div></div></div></div>
    <div class="card"><div class="stat"><div class="ico b">📊</div><div><div class="stat-label">Investissement (${s.investment}%)</div><div class="stat-value">${fmt(t.inv)}</div><div class="stat-sub">Fonds d’investissement</div></div></div></div>
    <div class="card"><div class="stat"><div class="ico y">🏦</div><div><div class="stat-label">Trésor (${s.treasury}%)</div><div class="stat-value">${fmt(t.tre)}</div><div class="stat-sub">Fonds de réserve</div></div></div></div>
  </div>
  <div class="card" style="margin-bottom:14px"><div class="stat"><div class="ico p">⚙</div><div><div class="stat-label">Frais / gestion (${s.fees}%)</div><div class="stat-value" style="font-size:18px">${fmt(t.fees)}</div><div class="stat-sub">Frais de fonctionnement</div></div></div></div>
  <div class="grid-3">
    <div class="card">
      <div class="section-title">Prochain bénéficiaire</div>
      <div class="beneficiary">
        <div class="avatar-lg">${(next?.name||'?').split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
        <div>
          <b>${next?.name||'—'}</b>
          <div class="muted">Recevra : <b>${fmt(t.red)}</b></div>
          <span class="badge badge-info">Bénéficiaire suivant</span>
        </div>
      </div>
      <div class="section-title">Ordre des bénéficiaires</div>
      <ul class="order-list">
        ${ordered.slice(0,4).map((m,i)=>`<li><span><span class="n">${i+1}</span>${m.name}</span><span class="muted">${['Juin','Juil.','Août','Sept.'][i]||''} 2026</span></li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <div class="section-title">Répartition mensuelle</div>
      <div class="donut-wrap">
        <div class="donut" style="${donutCSS(s)}" data-center="${fmt(t.monthTotal).replace(' '+s.currency,'')}\nTotal"></div>
        <div class="legend">
          <div><span class="dot g"></span> ${s.redistribution}% Redistribution — ${fmt(t.red)}</div>
          <div><span class="dot b"></span> ${s.investment}% Investissement — ${fmt(t.inv)}</div>
          <div><span class="dot y"></span> ${s.treasury}% Trésor — ${fmt(t.tre)}</div>
          <div><span class="dot gr"></span> ${s.fees}% Frais — ${fmt(t.fees)}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Informations clés</div>
      <div class="info-list">
        <div class="row"><span>👥 Membres actifs</span><b>${state.members.filter(m=>m.status==='Actif').length}</b></div>
        <div class="row"><span>✅ Cotisations à jour</span><b>${state.contributions.filter(c=>c.status==='Payé').length}/${state.contributions.length}</b></div>
        <div class="row"><span>📊 Investissements actifs</span><b>${state.projects.filter(p=>p.status==='Actif').length}</b></div>
        <div class="row"><span>🏦 Solde trésor actuel</span><b>${fmt(Math.max(0,t.bal))}</b></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="section-title">Dernières transactions</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Montant</th><th>Statut</th></tr></thead>
      <tbody>
        ${state.transactions.slice().reverse().map(tx=>`<tr>
          <td>${tx.date}</td><td>${tx.category||tx.type}</td><td>${tx.label}</td>
          <td class="${tx.type==='Entrée'?'pos':'neg'}">${tx.type==='Entrée'?'+':'-'}${fmt(tx.amount)}</td>
          <td><span class="badge badge-ok">Validée</span></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function renderTontine(root){
  const t=totals();
  const ordered=[...state.members].sort((a,b)=>(a.order||99)-(b.order||99));
  root.innerHTML=`
  <div class="notice">La tontine reverse la part Redistribution au prochain bénéficiaire dans l’ordre défini.</div>
  <div class="grid-2">
    <div class="card">
      <div class="section-title">Ordre des bénéficiaires</div>
      <ul class="order-list">
        ${ordered.map((m,i)=>`<li>
          <span><span class="n">${i+1}</span><b>${m.name}</b></span>
          <span>${i===0?`<span class="badge badge-info">Prochain · ${fmt(t.red)}</span>`:`<span class="muted">Position ${i+1}</span>`}</span>
        </li>`).join('')}
      </ul>
      <div style="margin-top:12px"><button class="btn btn-primary" id="editOrder">Modifier l’ordre</button></div>
    </div>
    <div class="card">
      <div class="section-title">Répartition du mois</div>
      <div class="donut-wrap">
        <div class="donut" style="${donutCSS(state.settings)}" data-center="${state.settings.redistribution}%\nTontine"></div>
        <div class="legend">
          <div><span class="dot g"></span> Redistribution ${state.settings.redistribution}%</div>
          <div><span class="dot b"></span> Investissement ${state.settings.investment}%</div>
          <div><span class="dot y"></span> Trésor ${state.settings.treasury}%</div>
          <div><span class="dot gr"></span> Frais ${state.settings.fees}%</div>
        </div>
      </div>
    </div>
  </div>`;
  $('#editOrder').onclick=()=>{
    if(!requireUnlock('modifier l’ordre tontine')) return;
    openModal(`<h3>Ordre des bénéficiaires</h3>
      <p class="muted">Indiquez le rang (1 = prochain bénéficiaire).</p>
      <div class="form-grid">
        ${ordered.map(m=>`<div class="field"><label>${m.name}</label><input type="number" min="1" data-oid="${m.id}" value="${m.order||1}"></div>`).join('')}
      </div>
      <div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveOrd">Enregistrer</button></div>`,()=>{
      $('#saveOrd').onclick=()=>{
        $$('[data-oid]').forEach(inp=>{const m=state.members.find(x=>x.id===inp.dataset.oid); if(m) m.order=Number(inp.value)||99});
        save('Ordre tontine mis à jour'); closeModal(); setPage('tontine');
      };
    });
  };
}

function renderProjects(root){
  const t=totals();
  const maxCap=Math.max(...state.yields.map(y=>y.cap),1);
  const cats={};
  state.projects.forEach(p=>{cats[p.category]=(cats[p.category]||0)+(p.invested||0)});
  const catEntries=Object.entries(cats);
  const catTotal=catEntries.reduce((a,[,v])=>a+v,0)||1;
  let acc=0;
  const catGrad=catEntries.map(([,v],i)=>{const colors=['#1e4fd6','#12b886','#fab005','#7048e8']; const start=acc; acc+=v/catTotal*100; return `${colors[i%colors.length]} ${start}% ${acc}%`}).join(',');

  root.innerHTML=`
  <div class="stats">
    <div class="card"><div class="stat-label">Capital investi total</div><div class="stat-value">${fmt(t.invested)}</div><div class="stat-sub">Depuis le début</div></div>
    <div class="card"><div class="stat-label">Valeur actuelle</div><div class="stat-value">${fmt(t.value)}</div><div class="stat-sub pos">+${t.invested?((t.benefit/t.invested)*100).toFixed(1):0}%</div></div>
    <div class="card"><div class="stat-label">Bénéfices réalisés</div><div class="stat-value">${fmt(t.benefit)}</div><div class="stat-sub">Total net</div></div>
    <div class="card"><div class="stat-label">Rendement moyen</div><div class="stat-value">${t.invested?((t.benefit/t.invested)*100).toFixed(1):0}%</div><div class="stat-sub">Sur le capital</div></div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="section-title">Évolution des rendements</div>
      <div class="chart-box">
        <svg class="line-chart" viewBox="0 0 600 200" preserveAspectRatio="none">
          <polyline fill="none" stroke="var(--primary)" stroke-width="3"
            points="${state.yields.map((y,i)=>`${i*(600/Math.max(state.yields.length-1,1))},${200-(y.cap/maxCap)*170}`).join(' ')}"/>
          <polyline fill="none" stroke="var(--ok)" stroke-width="3"
            points="${state.yields.map((y,i)=>`${i*(600/Math.max(state.yields.length-1,1))},${200-(y.ben/maxCap)*170}`).join(' ')}"/>
        </svg>
      </div>
      <div class="legend" style="margin-top:8px">
        <div><span class="dot b"></span> Capital investi cumulé</div>
        <div><span class="dot g"></span> Bénéfices cumulés</div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Répartition des investissements</div>
      <div class="donut-wrap">
        <div class="donut" style="background:conic-gradient(${catGrad||'#ced4da 0 100%'})" data-center="${fmt(t.invested).replace(' '+state.settings.currency,'')}\nTotal investi"></div>
        <div class="legend">
          ${catEntries.map(([k,v],i)=>{const colors=['#1e4fd6','#12b886','#fab005','#7048e8']; return `<div><span class="dot" style="background:${colors[i%colors.length]}"></span> ${k} ${Math.round(v/catTotal*100)}%</div>`}).join('')}
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="section-title">Détail des investissements</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Projet</th><th>Catégorie</th><th>Capital investi</th><th>Valeur actuelle</th><th>Bénéfices</th><th>Rendement</th><th>Statut</th></tr></thead>
      <tbody>
        ${state.projects.map(p=>{const r=p.invested?((p.benefit||0)/p.invested*100).toFixed(1):0; return `<tr>
            <td><b>${p.name}</b></td><td><span class="badge badge-soft">${p.category||'—'}</span></td>
            <td>${fmt(p.invested)}</td><td>${fmt(p.value||p.invested)}</td>
            <td class="pos">${fmt(p.benefit||0)}</td><td class="pos">${r}%</td>
            <td><span class="badge badge-ok">${p.status}</span></td></tr>`}).join('')}
      </tbody>
    </table></div>
    <div style="margin-top:12px"><button class="btn btn-primary" id="addProj">+ Projet</button></div>
  </div>`;
  $('#addProj').onclick=()=>{
    if(!requireUnlock('ajouter un projet')) return;
    openModal(`<h3>Nouveau projet</h3><div class="form-grid">
      <div class="field full"><label>Nom</label><input id="pName"></div>
      <div class="field"><label>Catégorie</label><input id="pCat" value="Commerce"></div>
      <div class="field"><label>Capital investi</label><input id="pInv" type="number" value="1000000"></div>
      <div class="field"><label>Valeur actuelle</label><input id="pVal" type="number" value="1000000"></div>
      <div class="field"><label>Bénéfices</label><input id="pBen" type="number" value="0"></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveP">Enregistrer</button></div>`,()=>{
      $('#saveP').onclick=()=>{
        state.projects.push({id:uid('PJ'),name:$('#pName').value.trim()||'Projet',category:$('#pCat').value,budget:Number($('#pInv').value)||0,invested:Number($('#pInv').value)||0,value:Number($('#pVal').value)||0,benefit:Number($('#pBen').value)||0,status:'Actif',risk:'Modéré',start:today()});
        save('Projet ajouté'); closeModal(); setPage('projects');
      };
    });
  };
}

function renderMembers(root){
  root.innerHTML=`<div class="toolbar"><input class="search" id="q" placeholder="Rechercher..."><button class="btn btn-primary" id="addM">+ Membre</button></div>
  <div class="card"><table><thead><tr><th>Nom</th><th>Contact</th><th>Cotisation</th><th>Ordre tontine</th><th>Statut</th><th></th></tr></thead><tbody id="rows"></tbody></table></div>`;
  const draw=()=>{const q=($('#q').value||'').toLowerCase();
    $('#rows').innerHTML=state.members.filter(m=>!q||m.name.toLowerCase().includes(q)).map(m=>`<tr>
      <td><b>${m.name}</b></td><td>${m.email||''}<br><span class="muted">${m.phone||''}</span></td>
      <td>${fmt(m.contribution)}</td><td>${m.order||'—'}</td>
      <td><span class="badge badge-ok">${m.status}</span></td>
      <td><button class="btn btn-ghost" data-e="${m.id}">Modifier</button></td></tr>`).join('')};
  draw(); $('#q').oninput=draw;
  $('#addM').onclick=()=>{if(!requireUnlock('ajouter un membre'))return; memberModal()};
  root.onclick=e=>{const b=e.target.closest('[data-e]'); if(!b)return; if(!requireUnlock('modifier un membre'))return; memberModal(state.members.find(m=>m.id===b.dataset.e))};
}
function memberModal(m){
  const edit=!!m;
  openModal(`<h3>${edit?'Modifier':'Nouveau'} membre</h3><div class="form-grid">
    <div class="field"><label>Nom</label><input id="mName" value="${m?.name||''}"></div>
    <div class="field"><label>Email</label><input id="mEmail" value="${m?.email||''}"></div>
    <div class="field"><label>Téléphone</label><input id="mPhone" value="${m?.phone||''}"></div>
    <div class="field"><label>Cotisation</label><input id="mC" type="number" value="${m?.contribution||100000}"></div>
    <div class="field"><label>Ordre tontine</label><input id="mO" type="number" value="${m?.order||state.members.length+1}"></div>
  </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveM">Enregistrer</button></div>`,()=>{
    $('#saveM').onclick=()=>{
      const row={id:m?.id||uid('MB'),name:$('#mName').value.trim(),email:$('#mEmail').value.trim(),phone:$('#mPhone').value.trim(),joined:m?.joined||today(),contribution:Number($('#mC').value)||0,status:'Actif',order:Number($('#mO').value)||99};
      if(!row.name) return toast('Nom requis');
      if(edit) state.members=state.members.map(x=>x.id===row.id?row:x); else state.members.push(row);
      save('Membre enregistré'); closeModal(); setPage('members');
    };
  });
}

function renderContributions(root){
  root.innerHTML=`<div class="toolbar"><button class="btn btn-primary" id="addC">+ Cotisation</button></div>
  <div class="card"><table><thead><tr><th>Réf</th><th>Membre</th><th>Montant</th><th>Date</th><th>Statut</th></tr></thead>
  <tbody>${state.contributions.map(c=>`<tr><td>${c.ref||c.id}</td><td>${memberName(c.memberId)}</td><td>${fmt(c.amount)}</td><td>${c.date}</td>
    <td><span class="badge ${c.status==='Payé'?'badge-ok':'badge-warn'}">${c.status}</span></td></tr>`).join('')}</tbody></table></div>`;
  $('#addC').onclick=()=>{if(!requireUnlock('ajouter une cotisation')) return;
    openModal(`<h3>Cotisation</h3><div class="form-grid">
      <div class="field"><label>Membre</label><select id="cM">${state.members.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></div>
      <div class="field"><label>Montant</label><input id="cA" type="number" value="100000"></div>
      <div class="field"><label>Date</label><input id="cD" type="date" value="${today()}"></div>
      <div class="field"><label>Statut</label><select id="cS"><option>Payé</option><option>En attente</option></select></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveC">Enregistrer</button></div>`,()=>{
      $('#saveC').onclick=()=>{state.contributions.push({id:uid('CT'),memberId:$('#cM').value,amount:Number($('#cA').value)||0,date:$('#cD').value,status:$('#cS').value,ref:'REF-'+Math.random().toString().slice(2,6)});
        save('Cotisation ajoutée'); closeModal(); setPage('contributions')};
    });
  };
}

function renderTransactions(root){
  root.innerHTML=`<div class="toolbar"><button class="btn btn-primary" id="addT">+ Mouvement</button></div>
  <div class="card"><table><thead><tr><th>Date</th><th>Type</th><th>Libellé</th><th>Montant</th></tr></thead>
  <tbody>${state.transactions.map(t=>`<tr><td>${t.date}</td><td>${t.type}</td><td>${t.label}</td>
    <td class="${t.type==='Entrée'?'pos':'neg'}">${t.type==='Entrée'?'+':'-'}${fmt(t.amount)}</td></tr>`).join('')}</tbody></table></div>`;
  $('#addT').onclick=()=>{if(!requireUnlock('ajouter un mouvement')) return;
    openModal(`<h3>Mouvement</h3><div class="form-grid">
      <div class="field"><label>Type</label><select id="tT"><option>Entrée</option><option>Sortie</option></select></div>
      <div class="field"><label>Montant</label><input id="tA" type="number" value="10000"></div>
      <div class="field full"><label>Libellé</label><input id="tL"></div>
      <div class="field"><label>Date</label><input id="tD" type="date" value="${today()}"></div>
      <div class="field"><label>Catégorie</label><input id="tC" value="Divers"></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveT">Enregistrer</button></div>`,()=>{
      $('#saveT').onclick=()=>{state.transactions.push({id:uid('TX'),type:$('#tT').value,label:$('#tL').value||'Mouvement',amount:Number($('#tA').value)||0,date:$('#tD').value,category:$('#tC').value});
        save('Mouvement enregistré'); closeModal(); setPage('transactions')};
    });
  };
}

function renderFinance(root){
  const s=state.settings; const t=totals();
  root.innerHTML=`<div class="notice">Somme des % doit rester à 100 % (actuellement ${s.redistribution+s.investment+s.treasury+s.fees} %).</div>
  <div class="grid-2">
    <div class="card"><div class="section-title">Répartition</div>
      <div class="donut-wrap">
        <div class="donut" style="${donutCSS(s)}" data-center="100%\nTotal"></div>
        <div class="legend">
          <div><span class="dot g"></span> Redistribution ${s.redistribution}% — ${fmt(t.red)}</div>
          <div><span class="dot b"></span> Investissement ${s.investment}% — ${fmt(t.inv)}</div>
          <div><span class="dot y"></span> Trésor ${s.treasury}% — ${fmt(t.tre)}</div>
          <div><span class="dot gr"></span> Frais ${s.fees}% — ${fmt(t.fees)}</div>
        </div>
      </div>
      <div style="margin-top:14px"><button class="btn btn-primary" id="editPct">Modifier les %</button></div>
    </div>
    <div class="card"><div class="section-title">Objectif mensuel</div>
      <div class="stat-value" style="margin:12px 0">${fmt(s.monthlyGoal)}</div>
      <p class="muted">Utilisé pour simuler la répartition.</p>
    </div>
  </div>`;
  $('#editPct').onclick=()=>{if(!requireUnlock('modifier les pourcentages')) return;
    openModal(`<h3>Pourcentages</h3><div class="form-grid">
      <div class="field"><label>Redistribution %</label><input id="r" type="number" value="${s.redistribution}"></div>
      <div class="field"><label>Investissement %</label><input id="i" type="number" value="${s.investment}"></div>
      <div class="field"><label>Trésor %</label><input id="t" type="number" value="${s.treasury}"></div>
      <div class="field"><label>Frais %</label><input id="f" type="number" value="${s.fees}"></div>
      <div class="field full"><label>Objectif mensuel</label><input id="g" type="number" value="${s.monthlyGoal}"></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveF">Enregistrer</button></div>`,()=>{
      $('#saveF').onclick=()=>{state.settings.redistribution=Number($('#r').value)||0; state.settings.investment=Number($('#i').value)||0;
        state.settings.treasury=Number($('#t').value)||0; state.settings.fees=Number($('#f').value)||0; state.settings.monthlyGoal=Number($('#g').value)||0;
        save('Répartition mise à jour'); closeModal(); setPage('finance')};
    });
  };
}

function renderPayments(root){
  const p=state.payments;
  const card=(title,num,own)=>`<div class="pay-card"><h3>${title}</h3><div class="num">${num||'Non renseigné'}</div><div class="owner">${own||'Titulaire non défini'}</div></div>`;
  root.innerHTML=`<div class="notice">Affichez vos numéros pour recevoir les cotisations (pas de paiement auto en ligne).</div>
  <div class="toolbar"><button class="btn btn-primary" id="editPay">Configurer mes moyens de paiement</button></div>
  <div class="pay-grid">
    ${card('Mobile Money (MTN)',p.momo?.number,p.momo?.owner)}
    ${card('Airtel Money',p.airtel?.number,p.airtel?.owner)}
    ${card('Orange Money',p.orange?.number,p.orange?.owner)}
    ${card('Visa / Banque',p.visa?.number,(p.visa?.owner||'')+(p.visa?.bank?' · '+p.visa.bank:''))}
  </div>`;
  $('#editPay').onclick=()=>{if(!requireUnlock('configurer les paiements')) return;
    openModal(`<h3>Moyens de paiement</h3><div class="form-grid">
      <div class="field full"><label>MoMo — numéro</label><input id="mn" value="${p.momo?.number||''}"></div>
      <div class="field full"><label>MoMo — titulaire</label><input id="mo" value="${p.momo?.owner||''}"></div>
      <div class="field full"><label>Airtel — numéro</label><input id="an" value="${p.airtel?.number||''}"></div>
      <div class="field full"><label>Airtel — titulaire</label><input id="ao" value="${p.airtel?.owner||''}"></div>
      <div class="field full"><label>Orange — numéro</label><input id="on" value="${p.orange?.number||''}"></div>
      <div class="field full"><label>Orange — titulaire</label><input id="oo" value="${p.orange?.owner||''}"></div>
      <div class="field full"><label>Visa / compte</label><input id="vn" value="${p.visa?.number||''}"></div>
      <div class="field"><label>Titulaire</label><input id="vo" value="${p.visa?.owner||''}"></div>
      <div class="field"><label>Banque</label><input id="vb" value="${p.visa?.bank||''}"></div>
    </div><div class="modal-actions"><button class="btn btn-light" data-close>Annuler</button><button class="btn btn-primary" id="saveP">Enregistrer</button></div>`,()=>{
      $('#saveP').onclick=()=>{state.payments={momo:{number:$('#mn').value.trim(),owner:$('#mo').value.trim()},airtel:{number:$('#an').value.trim(),owner:$('#ao').value.trim()},orange:{number:$('#on').value.trim(),owner:$('#oo').value.trim()},visa:{number:$('#vn').value.trim(),owner:$('#vo').value.trim(),bank:$('#vb').value.trim()}};
        save('Paiements enregistrés'); closeModal(); setPage('payments')};
    });
  };
}

function renderReports(root){
  const t=totals();
  root.innerHTML=`<div class="card"><div class="section-title">Synthèse</div>
    <div class="info-list">
      <div class="row"><span>Membres</span><b>${state.members.length}</b></div>
      <div class="row"><span>Cotisations payées</span><b>${fmt(t.paid)}</b></div>
      <div class="row"><span>Capital investi</span><b>${fmt(t.invested)}</b></div>
      <div class="row"><span>Bénéfices</span><b>${fmt(t.benefit)}</b></div>
      <div class="row"><span>Solde trésorerie</span><b>${fmt(t.bal)}</b></div>
    </div>
    <div style="margin-top:14px"><button class="btn btn-primary" onclick="window.print()">Imprimer / PDF</button></div></div>`;
}

function renderSettings(root){
  const s=state.settings;
  root.innerHTML=`<div class="card" style="margin-bottom:14px">
    <div class="section-title">Couleur du thème</div>
    <div class="themes" id="themes">
      ${Object.keys(themes).map(k=>`<button type="button" class="theme-swatch ${s.theme===k?'active':''}" data-theme="${k}" style="background:${themes[k].primary}" title="${k}"></button>`).join('')}
    </div>
    <p class="muted" style="margin-top:10px">Cliquez pour changer sidebar + boutons.</p>
  </div>
  <div class="card">
    <div class="form-grid">
      <div class="field"><label>Nom de l’espace</label><input id="sName" value="${s.name||''}" ${unlocked?'':'disabled'}></div>
      <div class="field"><label>Devise</label><input id="sCur" value="${s.currency||'XAF'}" ${unlocked?'':'disabled'}></div>
    </div>
    <div class="modal-actions" style="justify-content:flex-start">
      <button class="btn btn-primary" id="saveS" ${unlocked?'':'disabled'}>Enregistrer</button>
      <button class="btn btn-light" id="exp">Exporter JSON</button>
      <button class="btn btn-light" id="imp">Importer JSON</button>
      <button class="btn btn-danger" id="lock">Verrouiller</button>
    </div>
  </div>`;
  $$('#themes [data-theme]').forEach(b=>{b.onclick=()=>{if(!requireUnlock('changer le thème')) return; state.settings.theme=b.dataset.theme; applyTheme(); save('Thème appliqué'); setPage('settings')}});
  $('#saveS').onclick=()=>{if(!requireUnlock('modifier les paramètres')) return; state.settings.name=$('#sName').value.trim()||state.settings.name; state.settings.currency=$('#sCur').value.trim()||'XAF'; save('Paramètres enregistrés'); updateLockUI(); setPage('settings')};
  $('#exp').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='collective-backup.json';a.click()};
  $('#imp').onclick=()=>{if(!requireUnlock('importer'))return;$('#importFile').click()};
  $('#lock').onclick=()=>{setUnlock(false);toast('Verrouillé')};
}

function openModal(html,cb){const root=$('#modalRoot'); root.innerHTML=`<div class="modal-backdrop"><div class="modal">${html}</div></div>`; root.onclick=e=>{if(e.target.classList.contains('modal-backdrop')||e.target.hasAttribute('data-close')) closeModal()}; if(cb) cb()}
function closeModal(){$('#modalRoot').innerHTML=''}

function render(){
  applyTheme();
  $('#today').textContent=new Date().toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  updateLockUI();
  setPage('dashboard');
}

$('#exportAll').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='collective-backup.json';a.click();toast('Export prêt')};
$('#importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);if(!state.payments)state.payments=structuredClone(initial.payments);save('Import OK');setPage('dashboard')}catch(err){toast('Fichier invalide')}};r.readAsText(f);e.target.value=''};
$('#toggleLockBtn').onclick=()=>{if(unlocked){setUnlock(false);toast('Verrouillé')}else openPasswordModal('déverrouiller')};
$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b) setPage(b.dataset.page)});
render();
