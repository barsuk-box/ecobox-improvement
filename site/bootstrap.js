async function boot(){
 const content=document.querySelector('#content');
 try{
  const endpoint=window.DASHBOARD_PUBLIC_API||'/api/state';
  const r=await fetch(endpoint,{cache:'no-store'});
  if(r.status===401&&!window.DASHBOARD_PUBLIC_API){location.href='/signin-with-chatgpt?return_to=/';return;}
  if(!r.ok){const error=await r.json().catch(()=>({}));throw Error(error.error||'Не удалось загрузить данные.');}
  const v=await r.json();
  if(v.setup){content.innerHTML='<div class="source-copy"><h1>Загрузка исходного аудита</h1><input type="file" id="seed" accept=".json"><p id="seedStatus"></p></div>';document.querySelector('#seed').onchange=async e=>{try{const dataset=JSON.parse(await e.target.files[0].text());const res=await fetch('/api/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dataset})});if(!res.ok)throw Error((await res.json()).error);location.reload();}catch(error){document.querySelector('#seedStatus').textContent=error.message;}};return;}
  const templates=await fetch('./stage-templates.json');if(!templates.ok)throw Error('Не удалось загрузить этапы задач.');
  window.STAGE_TEMPLATES=await templates.json();window.INITIAL=v;window.AUDIT_DATA=v.data;
  const script=document.createElement('script');script.src='./app.js';document.body.appendChild(script);
 }catch(error){content.textContent=error.message+' Обновите страницу для повторной загрузки.';}
}
boot();
