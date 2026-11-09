'use strict';
/* Sebastian Koch — no cookies, analytics, or third-party form submissions. */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const contactPage = document.body.dataset.contactUrl || 'kontakt.html';
  const phone = '4915148273916'; // German country-code normalization of supplied 151 48273916
  document.documentElement.classList.add('js-ready');
  // The floating conversion bar appears after the hero rather than covering the coach's photo.
  const stickyCTA=$('.mobile-sticky-cta');
  if(stickyCTA){
    const homeHero=$('.hero');
    if(homeHero && 'IntersectionObserver' in window){
      new IntersectionObserver(([entry])=>stickyCTA.classList.toggle('is-active',!entry.isIntersecting),{threshold:0}).observe(homeHero);
    }else stickyCTA.classList.add('is-active');
  }
  const prefersLess = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = $('#site-nav'), menuButton = $('#mobile-menu-btn');
  if(menu && menuButton){
    const links=$$('a',menu);
    const setMenu=(open,restoreFocus=false)=>{
      menu.classList.toggle('open',open);
      document.body.classList.toggle('menu-open',open);
      menuButton.setAttribute('aria-expanded',String(open));
      menuButton.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
      if(!open && restoreFocus) menuButton.focus();
      if(open && links.length && window.innerWidth<=900) links[0].focus();
    };
    menuButton.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
    links.forEach(a=>a.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('keydown',e=>{
      if(!menu.classList.contains('open') || window.innerWidth>900) return;
      if(e.key==='Escape'){ e.preventDefault();setMenu(false,true);return; }
      if(e.key==='Tab'){
        const focusables=[...links,menuButton];
        const first=focusables[0],last=focusables[focusables.length-1];
        if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    window.addEventListener('resize',()=>{if(window.innerWidth>900&&menu.classList.contains('open'))setMenu(false);});
  }
  let framePending=false;
  addEventListener('scroll',()=>{if(!framePending){framePending=true;requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-innerHeight;document.body.style.setProperty('--progress',h>0?`${(scrollY/h)*100}%`:'0%');framePending=false;});}},{passive:true});
  // CSS fallback handles the entire site in case GSAP is not available/offline.
  const elements=$$('.reveal');
  if(!prefersLess.matches && 'IntersectionObserver' in window){
    document.body.classList.add('js-anim');
    const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.09,rootMargin:'0px 0px -25px 0px'});
    elements.forEach(el=>observer.observe(el));
    // Keep content visible if a user navigates quickly or a browser delays observer callbacks.
  } else {elements.forEach(el=>el.classList.add('is-visible'));}
  // Lightweight entrance animation: no third-party JavaScript or network calls.
  const heroTitle=$('.hero-title');
  if(heroTitle && !prefersLess.matches) heroTitle.classList.add('hero-ready');
  // Interactive 5-question service assessment. All answers stay in this page.
  const quiz=$('#fitness-quiz');
  if(quiz){
    const prompts=[
      {question:'Was möchtest du mit deinem Training erreichen?',options:[['Kraft & Muskulatur aufbauen','kraft'],['Beweglichkeit & langfristige Fitness','beweglichkeit'],['Technik & Trainingsroutine verbessern','technik'],['Einfach einen guten Einstieg finden','einstieg']]},
      {question:'Wo möchtest du am liebsten trainieren?',options:[['Mit persönlicher Betreuung vor Ort','private'],['Bei mir zuhause','home'],['Flexibel und online','online']]},
      {question:'Wie viel Trainingserfahrung bringst du mit?',options:[['Ich starte gerade','anfang'],['Ich trainiere gelegentlich','gelegentlich'],['Ich trainiere schon regelmäßig','erfahren']]},
      {question:'Wie oft möchtest du pro Woche trainieren?',options:[['1–2 Mal','1-2'],['3–4 Mal','3-4'],['5 Mal oder häufiger','5+']]},
      {question:'Was ist dir bei der Betreuung am wichtigsten?',options:[['Direktes Feedback & Technik','feedback'],['Flexibilität & Alltagstauglichkeit','flexibel'],['Kraft und langfristige Entwicklung','longterm']]}
    ];
    const choices=new Array(prompts.length).fill(null);let step=0;
    const progress=$('#quiz-fill',quiz),counter=$('#quiz-counter',quiz),content=$('#quiz-content',quiz),back=$('#quiz-back',quiz),next=$('#quiz-next',quiz);
    function render(){
      counter.textContent=`0${Math.min(step+1,5)} / 05`;progress.style.width=`${Math.min((step+1)*20,100)}%`;
      back.hidden=step===0;next.hidden=false;
      if(step>=prompts.length){
        const scores={private:0,home:0,online:0};
        // Where the visitor wants to train matters most, but goal and support modify the match.
        if(choices[1]==='private')scores.private+=5;
        if(choices[1]==='home')scores.home+=5;
        if(choices[1]==='online')scores.online+=5;
        if(choices[0]==='technik')scores.private+=2;
        if(choices[0]==='beweglichkeit')scores.online+=1;
        if(choices[0]==='einstieg')scores.private+=1;
        if(choices[2]==='anfang')scores.private+=1;
        if(choices[3]==='5+')scores.online+=1;
        if(choices[4]==='feedback')scores.private+=2;
        if(choices[4]==='flexibel')scores.online+=2;
        if(choices[4]==='longterm')scores.online+=2;
        const winner=Object.keys(scores).sort((x,y)=>scores[y]-scores[x])[0];
        const recommendation={private:'Private Coaching',home:'Elite Home Performance',online:'Longevity Strength Online Coaching'}[winner];
        const explanations={
          'Private Coaching':'Persönliches Training mit unmittelbarem Feedback zur Ausführung und individuell abgestimmter Begleitung.',
          'Elite Home Performance':'Training in deinem eigenen Zuhause – passend zu deinem Tagesablauf und deinen Zielen.',
          'Longevity Strength Online Coaching':'Eine flexible Online-Option mit Fokus auf Kraft und langfristige Trainingsroutine.'
        };
        counter.textContent='05 / 05';progress.style.width='100%';next.hidden=true;
        content.innerHTML=`<div class="quiz-result"><div class="result-tag">Deine unverbindliche Empfehlung</div><h3>${recommendation}</h3><p>${explanations[recommendation]}</p><p class="note">Die Einordnung orientiert sich an deinen Antworten, ersetzt aber kein persönliches Gespräch.</p><a class="button" href="${contactPage}?service=${encodeURIComponent(recommendation)}">Coaching anfragen <span aria-hidden="true">↗</span></a></div>`;
        back.hidden=false;return;
      }
      const q=prompts[step];content.innerHTML='';
      const title=document.createElement('h3');title.className='quiz-question';title.id='quiz-question';title.textContent=q.question;content.appendChild(title);
      const opts=document.createElement('div');opts.className='quiz-options';opts.setAttribute('role','group');opts.setAttribute('aria-labelledby','quiz-question');
      q.options.forEach(([label,val])=>{
        const btn=document.createElement('button');btn.type='button';btn.className='option';btn.setAttribute('aria-pressed',String(choices[step]===val));
        const text=document.createElement('span');text.textContent=label;const mark=document.createElement('span');mark.className='option-mark';mark.setAttribute('aria-hidden','true');btn.append(text,mark);
        btn.addEventListener('click',()=>{choices[step]=val;render();const selected=$$('.option',opts).find(el=>el.getAttribute('aria-pressed')==='true');selected?.focus();});opts.appendChild(btn);
      });content.appendChild(opts);next.disabled=!choices[step];
    }
    back.addEventListener('click',()=>{step=Math.max(0,step-1);render();});
    next.addEventListener('click',()=>{if(step<prompts.length&&choices[step]){step++;render();}});
    render();
  }
  // Mifflin-St Jeor BMR and activity factor; general estimates only.
  const calculator=$('#calorie-form');
  if(calculator){
    calculator.addEventListener('submit',event=>{
      event.preventDefault();
      if(!calculator.reportValidity())return;
      const data=new FormData(calculator);const age=Number(data.get('age')),weight=Number(data.get('weight')),height=Number(data.get('height'));
      const sex=data.get('sex'),activity=Number(data.get('activity')),goal=data.get('goal');
      if(age<18||age>85||weight<30||weight>350||height<120||height>230){$('#calc-result').classList.remove('active');$('#calc-error').textContent='Bitte Werte innerhalb der angegebenen Bereiche eingeben (nur für Erwachsene).';return;}
      $('#calc-error').textContent='';
      const bmr=10*weight+6.25*height-5*age+(sex==='m'?5:-161);const maintain=bmr*activity;
      const adjustment=goal==='reduce'?-300:goal==='gain'?250:0;
      if(maintain+adjustment<1200){
        $('#calc-result').classList.remove('active');
        $('#calc-error').textContent='Die berechnete Zielenergie fällt für diese Angaben sehr niedrig aus. Bitte lass deinen individuellen Bedarf fachlich beurteilen, statt den Wert als Ernährungsziel zu nutzen.';
        return;
      }
      const total=Math.round((maintain+adjustment)/10)*10;
      const protein=Math.round(weight*1.6),fat=Math.round(weight*.8),carb=Math.max(0,Math.round((total-protein*4-fat*9)/4));
      $('#calc-result').classList.add('active');$('#calc-energy').textContent=total.toLocaleString('de-DE');
      $('#calc-maintain').textContent=Math.round(maintain/10)*10;$('#calc-protein').textContent=protein+' g';$('#calc-fat').textContent=fat+' g';$('#calc-carbs').textContent=carb+' g';
    });
  }
  // Appointment REQUEST: prepopulates WhatsApp; never pretends a calendar slot was confirmed.
  const booking=$('#booking-form');
  if(booking){
    const params=new URLSearchParams(location.search);const service=params.get('service');
    if(service&&[...$('#booking-service').options].some(o=>o.value===service))$('#booking-service').value=service;
    const date=$('#booking-date');if(date){const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);const localDate=[tomorrow.getFullYear(),String(tomorrow.getMonth()+1).padStart(2,'0'),String(tomorrow.getDate()).padStart(2,'0')].join('-');date.min=localDate;}
    booking.addEventListener('submit',event=>{
      event.preventDefault(); if(!booking.reportValidity())return;
      const d=new FormData(booking);if(d.get('privacy')!=='yes'){$('#booking-notice').textContent='Bitte bestätige zuerst den WhatsApp-Hinweis.';$('#booking-notice').classList.add('active');return;}
      const name=String(d.get('name')||'').trim(),serv=String(d.get('service')||''),when=String(d.get('date')||'flexibel'),period=String(d.get('time')||'flexibel');
      const note=String(d.get('note')||'').trim().slice(0,300);
      const msg=`Hallo Sebastian, ich möchte ein unverbindliches Coaching-Erstgespräch bzw. eine Buchung anfragen.\nName: ${name}\nLeistung: ${serv}\nWunschtermin: ${when}\nZeitfenster: ${period}${note?'\nNachricht: '+note:''}\nBitte gib mir Bescheid, welche Termine tatsächlich verfügbar sind.`;
      $('#booking-notice').innerHTML='Deine Anfrage wurde vorbereitet. <strong>Bitte sende die Nachricht in WhatsApp selbst ab.</strong> Ein Termin ist dadurch noch nicht bestätigt.';
      $('#booking-notice').classList.add('active');
      const url=`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      const fallback=$('#whatsapp-fallback');if(fallback){fallback.href=url;fallback.hidden=false;}
      const opened=window.open(url,'_blank','noopener,noreferrer');
      if(!opened){$('#booking-notice').textContent='Die Anfrage ist vorbereitet. Falls sich WhatsApp nicht öffnet, nutze bitte den Link „WhatsApp jetzt öffnen“. Erst das Absenden in WhatsApp übermittelt die Anfrage.';}
    });
  }
  // Social copy is safe if handles are provided but URLs have not been checked.
  $$('.copy-handle').forEach(el=>el.addEventListener('click',()=>{
    (navigator.clipboard?.writeText('@Sebastian-Koch') || Promise.reject()).then(()=>{el.textContent='Handle kopiert ✓';}).catch(()=>{el.textContent='@Sebastian-Koch – bitte manuell kopieren';});
  }));
})();
