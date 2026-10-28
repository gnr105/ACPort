(() => {
 const line=document.createElement('div');line.className='progress-line';line.setAttribute('aria-hidden','true');document.body.append(line);
 let pending=false;
 const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;line.style.transform=`scaleX(${max>0?scrollY/max:0})`;pending=false;};
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
 document.querySelectorAll('.project-filters button').forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('active')));b.addEventListener('click',()=>document.querySelectorAll('.project-filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))));});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.nav-content,.nav-links').forEach(n=>n.classList.remove('open'));const b=document.querySelector('.menu-toggle');b?.setAttribute('aria-expanded','false');b?.setAttribute('aria-label','Abrir menú');}});
})();
