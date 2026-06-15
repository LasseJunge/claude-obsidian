// Generate a self-contained HTML dashboard (no build step, opens in any browser).
// Region / type / source filters + a yield-vs-price scatter and a source-count
// bar chart, drawn with inline SVG (zero deps). Data embedded as JSON.
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

export function generateDashboard(listings, cfg, generatedAt) {
  const dataJson = JSON.stringify(listings);
  const out = join(cfg._vaultRoot, cfg.output?.vault_subdir || "wiki/immo", "dashboard.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, TEMPLATE
    .replace("__DATA__", dataJson)
    .replace("__TS__", generatedAt)
    .replace("__N__", String(listings.length)), "utf-8");
  console.log(`  dashboard: ${out} (${listings.length} rows)`);
  return out;
}

const TEMPLATE = String.raw`<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>immo-agent · Dashboard</title>
<style>
  :root{--bg:#0f1115;--card:#1a1d24;--fg:#e6e8eb;--mut:#9aa3ad;--acc:#4f8cff;--good:#34d399}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);
    font:14px/1.5 system-ui,Segoe UI,sans-serif}
  header{padding:20px 24px;border-bottom:1px solid #262b34}
  h1{margin:0;font-size:20px}.sub{color:var(--mut);font-size:13px;margin-top:4px}
  .wrap{padding:20px 24px;max-width:1200px;margin:0 auto}
  .kpis{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:18px}
  .kpi{background:var(--card);border:1px solid #262b34;border-radius:12px;padding:14px 18px;min-width:150px}
  .kpi .v{font-size:24px;font-weight:600}.kpi .l{color:var(--mut);font-size:12px}
  .filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
  select,input{background:var(--card);color:var(--fg);border:1px solid #2d333d;
    border-radius:8px;padding:8px 10px;font-size:13px}
  .charts{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
  .card{background:var(--card);border:1px solid #262b34;border-radius:12px;padding:16px}
  .card h3{margin:0 0 10px;font-size:14px;color:var(--mut);font-weight:500}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #262b34}
  th{color:var(--mut);font-weight:500;cursor:pointer;user-select:none}
  tr:hover td{background:#20242c}a{color:var(--acc);text-decoration:none}
  .pill{padding:2px 8px;border-radius:99px;font-size:11px;background:#243049;color:#9cc0ff}
  .disc{color:var(--good);font-weight:600}@media(max-width:800px){.charts{grid-template-columns:1fr}}
</style></head><body>
<header><h1>🏠 immo-agent · German Real-Estate &amp; Forced-Auction Monitor</h1>
<div class="sub">__N__ aktive Objekte · Stand __TS__</div></header>
<div class="wrap">
  <div class="kpis" id="kpis"></div>
  <div class="filters">
    <select id="fSource"></select><select id="fType"></select>
    <select id="fLand"></select>
    <input id="fMaxPrice" type="number" placeholder="Max. Preis €">
    <input id="fSearch" type="text" placeholder="Suche (Titel/PLZ)…">
  </div>
  <div class="charts">
    <div class="card"><h3>Rendite vs. Preis</h3><div id="scatter"></div></div>
    <div class="card"><h3>Objekte pro Quelle</h3><div id="bars"></div></div>
  </div>
  <div class="card"><h3>Objekte (nach Score)</h3>
    <table id="tbl"><thead><tr>
      <th data-k="source">Quelle</th><th data-k="title">Titel</th>
      <th data-k="property_type">Typ</th><th data-k="bundesland">Land</th>
      <th data-k="price">Preis</th><th data-k="price_per_sqm">€/m²</th>
      <th data-k="gross_yield_pct">Rendite%</th>
      <th data-k="auction_discount_pct">Abschlag%</th>
      <th data-k="auction_date">Termin</th><th data-k="score">Score</th>
    </tr></thead><tbody></tbody></table>
  </div>
</div>
<script>
const DATA = __DATA__;
const $ = s => document.querySelector(s);
const uniq = (a,k) => [...new Set(a.map(x=>x[k]).filter(Boolean))].sort();
const eur = v => v==null?'—':(v).toLocaleString('de-DE')+' €';
let sortKey='score', sortDir=-1;
function fillSel(id,key,label){$(id).innerHTML=
  '<option value="">'+label+'</option>'+uniq(DATA,key).map(v=>'<option>'+v+'</option>').join('');}
fillSel('#fSource','source','Alle Quellen');
fillSel('#fType','property_type','Alle Typen');
fillSel('#fLand','bundesland','Alle Bundesländer');
function filtered(){
  const s=$('#fSource').value,t=$('#fType').value,l=$('#fLand').value,
    mp=parseFloat($('#fMaxPrice').value)||Infinity,q=$('#fSearch').value.toLowerCase();
  return DATA.filter(d=>(!s||d.source===s)&&(!t||d.property_type===t)&&(!l||d.bundesland===l)
    &&((d.price||0)<=mp)&&(!q||(d.title||'').toLowerCase().includes(q)||(d.plz||'').includes(q)));}
function kpis(rows){
  const auc=rows.filter(r=>r.source==='zvg'||r.source==='bank');
  const ys=rows.map(r=>r.gross_yield_pct).filter(Boolean);
  const avgY=ys.length?(ys.reduce((a,b)=>a+b,0)/ys.length).toFixed(1):'—';
  const bestD=Math.max(0,...rows.map(r=>r.auction_discount_pct||0));
  $('#kpis').innerHTML=[['Objekte gesamt',rows.length],['Zwangs-/Bankauktionen',auc.length],
    ['Ø Rendite',avgY+' %'],['Bester Abschlag',bestD?bestD+' %':'—']]
    .map(([l,v])=>'<div class="kpi"><div class="v">'+v+'</div><div class="l">'+l+'</div></div>').join('');}
function scatter(rows){
  const W=440,H=240,P=36,pts=rows.filter(r=>r.price&&r.gross_yield_pct);
  if(!pts.length){$('#scatter').innerHTML='<div style="color:#9aa3ad">keine Daten</div>';return;}
  const xm=Math.max(...pts.map(p=>p.price)),ym=Math.max(...pts.map(p=>p.gross_yield_pct));
  const sx=v=>P+(v/xm)*(W-2*P),sy=v=>H-P-(v/ym)*(H-2*P);
  $('#scatter').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" width="100%">'+
    '<line x1="'+P+'" y1="'+(H-P)+'" x2="'+(W-P)+'" y2="'+(H-P)+'" stroke="#3a414d"/>'+
    '<line x1="'+P+'" y1="'+P+'" x2="'+P+'" y2="'+(H-P)+'" stroke="#3a414d"/>'+
    pts.map(p=>'<circle cx="'+sx(p.price).toFixed(1)+'" cy="'+sy(p.gross_yield_pct).toFixed(1)+'" r="4" fill="'+
      ((p.source==='zvg'||p.source==='bank')?'#34d399':'#4f8cff')+'"><title>'+
      (p.title||'')+'\n'+eur(p.price)+' · '+p.gross_yield_pct+'%</title></circle>').join('')+
    '<text x="'+(W-P)+'" y="'+(H-8)+'" fill="#9aa3ad" font-size="10" text-anchor="end">Preis →</text>'+
    '<text x="6" y="'+P+'" fill="#9aa3ad" font-size="10">Rendite%</text></svg>';}
function bars(rows){
  const by={};rows.forEach(r=>by[r.source]=(by[r.source]||0)+1);
  const ks=Object.keys(by),mx=Math.max(1,...Object.values(by)),W=440,bh=28;
  $('#bars').innerHTML='<svg viewBox="0 0 '+W+' '+(ks.length*bh+10)+'" width="100%">'+
    ks.map((k,i)=>'<text x="0" y="'+(i*bh+18)+'" fill="#e6e8eb" font-size="12">'+k+'</text>'+
    '<rect x="110" y="'+(i*bh+6)+'" width="'+((by[k]/mx)*(W-160))+'" height="16" rx="4" fill="#4f8cff"/>'+
    '<text x="'+(115+(by[k]/mx)*(W-160))+'" y="'+(i*bh+18)+'" fill="#9aa3ad" font-size="12">'+by[k]+'</text>').join('')+'</svg>';}
function table(rows){
  rows.sort((a,b)=>(((a[sortKey]??-1)>(b[sortKey]??-1))?1:-1)*sortDir);
  $('#tbl tbody').innerHTML=rows.map(r=>'<tr>'+
    '<td><span class="pill">'+r.source+'</span></td>'+
    '<td><a href="'+r.url+'" target="_blank">'+(r.title||'').slice(0,60)+'</a></td>'+
    '<td>'+(r.property_type||'—')+'</td><td>'+(r.bundesland||'—')+'</td>'+
    '<td>'+eur(r.price)+'</td><td>'+(r.price_per_sqm?r.price_per_sqm.toLocaleString('de-DE'):'—')+'</td>'+
    '<td>'+(r.gross_yield_pct??'—')+'</td>'+
    '<td class="'+(r.auction_discount_pct?'disc':'')+'">'+(r.auction_discount_pct??'—')+'</td>'+
    '<td>'+(r.auction_date||'—')+'</td><td>'+r.score+'</td></tr>').join('');}
function render(){const r=filtered();kpis(r);scatter(r);bars(r);table(r);}
document.querySelectorAll('#tbl th').forEach(th=>th.onclick=()=>{
  const k=th.dataset.k;sortDir=(k===sortKey)?-sortDir:-1;sortKey=k;render();});
['#fSource','#fType','#fLand','#fMaxPrice','#fSearch'].forEach(s=>$(s).addEventListener('input',render));
render();
</script></body></html>`;
