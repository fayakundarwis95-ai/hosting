/* Nexora Tech — lapisan database cloud (Firebase Realtime Database, SDK compat).
   Struktur RTDB: /nexora_retail/{version, settings, products/{id}, customers/{id}, suppliers/{id},
   users/{id}, sales/{id}, purchases/{id}, activities/{id}}.
   - Array aplikasi dikonversi ke objek berkunci id (praktik terbaik RTDB).
   - Penyimpanan memakai diff + satu update() multi-path: hanya record yang berubah ditulis.
   - Perubahan stok dikirim sebagai ServerValue.increment agar dua perangkat tidak saling menimpa.
   - Listener realtime mengirim data dari perangkat lain ke aplikasi. */
(()=>{'use strict';
const ROOT='nexora_retail', COLS=['products','customers','suppliers','users','sales','purchases','activities'];
let ref=null,last=null,ready=false;
const plain=x=>JSON.parse(JSON.stringify(x));
const canon=x=>JSON.stringify(x,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(i=>[i,v[i]])):v);
const toMap=a=>Object.fromEntries((a||[]).map(x=>[x.id,x]));
const toArr=(o,c)=>{const a=Object.values(o||{});return c==='activities'?a.sort((x,y)=>String(y.at).localeCompare(String(x.at))):a.sort((x,y)=>String(x.id).localeCompare(String(y.id)))};
const pack=db=>{const o={version:db.version,settings:db.settings||{}};COLS.forEach(c=>o[c]=toMap(db[c]));return plain(o)};
const unpack=v=>{const db={version:v.version,settings:v.settings||{}};COLS.forEach(c=>db[c]=toArr(v[c],c));return db};
function diff(prev,next,inc){const up={};
  if(canon(prev.settings)!==canon(next.settings))up.settings=next.settings;
  COLS.forEach(c=>{const p=prev[c]||{},n=next[c]||{};
    Object.keys(n).forEach(k=>{if(canon(p[k])===canon(n[k]))return;
      if(c==='products'&&p[k]){const {stock:ps,...pr}=p[k],{stock:ns,...nr}=n[k];
        if(canon(pr)===canon(nr)){up[`${c}/${k}/stock`]=inc(ns-ps);return}}
      up[`${c}/${k}`]=n[k]});
    Object.keys(p).forEach(k=>{if(!(k in n))up[`${c}/${k}`]=null})});
  return up}
function start(seed,onData,onError){
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg||!cfg.databaseURL||/NAMA-PROYEK|ISI_/.test(cfg.databaseURL+cfg.apiKey))return onError(new Error('Konfigurasi Firebase belum diisi (assets/js/firebase-config.js).'));
  try{if(!firebase.apps.length)firebase.initializeApp(cfg);ref=firebase.database().ref(ROOT)}catch(e){return onError(e)}
  ref.on('value',snap=>{const v=snap.val();
    if(!v||v.version!==1||!v.products){ if(!ready){ready=true;ref.set(pack(seed)).catch(onError)}; return }
    const incoming=pack(unpack(v)),first=!last;
    if(!first&&canon(incoming)===canon(last))return;   // gema dari tulisan lokal sendiri
    last=incoming;onData(unpack(v),first)},onError)}
function save(db){
  if(!ref||!last)return Promise.reject(new Error('Belum terhubung ke Firebase'));
  const next=pack(db),up=diff(last,next,n=>firebase.database.ServerValue.increment(n));last=next;
  return Object.keys(up).length?ref.update(up):Promise.resolve()}
window.NexoraCloud={start,save,_test:{pack,unpack,diff,canon}};
})();
