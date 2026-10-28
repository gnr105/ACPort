(() => {
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const spacious = matchMedia('(min-width: 901px) and (min-height: 700px)');
  let paused = reduced.matches, frame = 0;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const hero = document.querySelector('.hero-track');
  const journey = document.querySelector('.journey');
  const panels = [...document.querySelectorAll('.scene-panel')];
  const views = [...document.querySelectorAll('.device-view')];
  const ribbon = document.querySelector('.tech-ribbon');
  const labels = ['INTERFAZ', 'LÓGICA', 'DATOS'];
  const counter = document.querySelector('.scene-count');
  const label = document.querySelector('.scene-progress-label');
  const titles = [...document.querySelectorAll('[data-decode]')];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}';
  titles.forEach(el => {
    el.dataset.original = el.textContent;
    el.setAttribute('aria-hidden', 'true');
    el.closest('summary').setAttribute('aria-label', el.textContent);
  });
  const control = document.createElement('button');
  control.type = 'button';control.className = 'motion-control';
  body.append(control);
  body.classList.add('motion-ready');
  const progress = el => {
    const rect = el.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  };
  function sync() {
    body.classList.toggle('motion-paused', paused);
    control.textContent = paused ? '▶ Activar animaciones' : 'Ⅱ Pausar animaciones';
    control.setAttribute('aria-pressed', String(paused));
    schedule();
  }
  control.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  spacious.addEventListener('change', schedule);
  function update() {
    frame = 0;
    const pinned = spacious.matches && !paused && !reduced.matches;
    const hp = pinned ? progress(hero) : 0;
    hero.style.setProperty('--hero-p', hp.toFixed(4));
    const p = pinned ? progress(journey) : 0;
    journey.style.setProperty('--scene-p', p.toFixed(4));
    // Mesetas para leer; fundidos de 15% entre las tres escenas.
    const weights = [1-clamp((p-.23)/.15),clamp((p-.23)/.15)*(1-clamp((p-.61)/.15)),clamp((p-.61)/.15)];
    const active = weights.indexOf(Math.max(...weights));
    panels.forEach((panel,i) => {
      const alpha = pinned ? weights[i] : 1;
      panel.style.setProperty('--panel-alpha',alpha.toFixed(4));
      panel.style.setProperty('--panel-y',`${pinned ? (i===active?1-alpha:(i<active?-1:1)*(1-alpha))*45 : 0}px`);
      panel.setAttribute('aria-hidden',String(pinned && i!==active));
    });
    views.forEach((view,i) => {view.style.opacity = pinned ? weights[i] : (i===0?1:0);});
    journey.style.setProperty('--bar-grow',(.15+.85*clamp((p-.62)/.27)).toFixed(4));
    counter.textContent = `${String(active+1).padStart(2,'0')} — 03`;
    label.textContent = labels[active];
    if(!paused) {
      const rect = ribbon.getBoundingClientRect();
      ribbon.style.setProperty('--ribbon-x',`${-clamp((innerHeight-rect.top)*.18,0,500)}px`);
    }
    titles.forEach((el,index) => {
      const original = el.dataset.original, rect = el.getBoundingClientRect();
      const t = paused || el.closest('summary')===document.activeElement ? 1 : clamp((innerHeight*.95-rect.top)/(innerHeight*.38));
      const step = Math.floor(t*25);
      const text = [...original].map((c,i) => c===' ' || i/original.length<t ? c : chars[(i*13+step*7+index*3)%chars.length]).join('');
      if(el.textContent!==text)el.textContent=text;
    });
  }
  function schedule() { if(!frame)frame=requestAnimationFrame(update); }
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  document.addEventListener('toggle',schedule,true);
  titles.forEach(el=>{el.closest('summary').addEventListener('focus',schedule);el.closest('summary').addEventListener('blur',schedule);});
  // Cambios de tamaño por imágenes/fuentes no dejan desfasadas las escenas.
  const ro = new ResizeObserver(schedule);ro.observe(document.querySelector('main'));
  document.fonts?.ready.then(schedule);
  if(matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        if(paused)return;const r=card.getBoundingClientRect();
        card.style.setProperty('--tilt-x',`${-(e.clientY-r.top-r.height/2)/r.height*5}deg`);
        card.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/r.width*5}deg`);
      });
      card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
    });
  }
  sync();
})();
