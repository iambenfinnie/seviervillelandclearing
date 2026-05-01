/* ================================================================
   ADAM — Sevierville Land Clearing chatbot
   Self-contained widget. Injects its own styles + markup.
   Warm, witty, a little extra — Smoky Mountains gay uncle energy.
   Pricing, cabin lots, Pigeon Forge / Gatlinburg / Sevierville.
================================================================ */
(function(){
  if (window.__adamLoaded) return;
  window.__adamLoaded = true;

  /* -------- styles -------- */
  var css = `
  .adam-fab{position:fixed;right:22px;bottom:22px;z-index:9998;display:flex;align-items:center;gap:10px;background:#D4A017;color:#151004;border:0;padding:12px 18px 12px 14px;font-family:'Inter',system-ui,sans-serif;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;box-shadow:0 14px 30px rgba(0,0,0,.45),0 0 0 1px rgba(212,160,23,.5);transition:transform .2s ease,background .2s ease;border-radius:0}
  .adam-fab:hover{background:#e9b92b;transform:translateY(-2px)}
  .adam-fab .adam-av{width:34px;height:34px;border-radius:50%;background:#080808;color:#D4A017;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',Impact,sans-serif;font-size:18px;letter-spacing:.04em;flex:0 0 auto;border:1px solid #151004}
  .adam-fab .adam-pulse{width:8px;height:8px;border-radius:50%;background:#0a5d0a;box-shadow:0 0 0 0 rgba(20,180,20,.7);animation:adamPulse 2s infinite}
  @keyframes adamPulse{0%{box-shadow:0 0 0 0 rgba(20,180,20,.7)}70%{box-shadow:0 0 0 10px rgba(20,180,20,0)}100%{box-shadow:0 0 0 0 rgba(20,180,20,0)}}
  .adam-fab.hidden{display:none}

  .adam-panel{position:fixed;right:22px;bottom:22px;z-index:9999;width:380px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 40px);background:#0e0e0e;border:1px solid rgba(242,237,230,0.18);box-shadow:0 30px 80px rgba(0,0,0,.6);display:none;flex-direction:column;font-family:'Inter',system-ui,sans-serif;color:#F2EDE6;overflow:hidden}
  .adam-panel.open{display:flex}

  .adam-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid rgba(242,237,230,0.10);background:linear-gradient(180deg,#151513 0%,#0e0e0e 100%);position:relative}
  .adam-head .av{width:42px;height:42px;border-radius:50%;background:#D4A017;color:#151004;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',Impact,sans-serif;font-size:22px;letter-spacing:.04em;flex:0 0 auto;border:1px solid #8a6a0f}
  .adam-head .who{flex:1;min-width:0}
  .adam-head .name{font-family:'Bebas Neue',Impact,sans-serif;font-size:20px;letter-spacing:.04em;line-height:1}
  .adam-head .role{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#b8b1a5;margin-top:4px;display:flex;align-items:center;gap:8px}
  .adam-head .role .live{width:6px;height:6px;border-radius:50%;background:#3a9c3a;box-shadow:0 0 8px #3a9c3a}
  .adam-head .x{width:30px;height:30px;border:1px solid rgba(242,237,230,0.18);background:transparent;color:#F2EDE6;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1}
  .adam-head .x:hover{background:rgba(212,160,23,0.12);border-color:#D4A017}

  .adam-msgs{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
  .adam-msgs::-webkit-scrollbar{width:6px}
  .adam-msgs::-webkit-scrollbar-thumb{background:rgba(242,237,230,0.18);border-radius:3px}

  .adam-msg{max-width:85%;padding:11px 14px;font-size:14px;line-height:1.5;border-radius:0;word-wrap:break-word}
  .adam-msg.bot{background:#151513;border:1px solid rgba(242,237,230,0.10);color:#F2EDE6;align-self:flex-start;border-left:2px solid #D4A017}
  .adam-msg.user{background:#D4A017;color:#151004;align-self:flex-end;font-weight:500}
  .adam-msg a{color:#D4A017;text-decoration:underline;text-underline-offset:2px}
  .adam-msg.user a{color:#151004}
  .adam-msg b{color:#D4A017}
  .adam-msg.user b{color:#151004}

  .adam-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#151513;border:1px solid rgba(242,237,230,0.10);border-left:2px solid #D4A017}
  .adam-typing span{width:6px;height:6px;border-radius:50%;background:#b8b1a5;animation:adamDot 1.2s infinite}
  .adam-typing span:nth-child(2){animation-delay:.15s}
  .adam-typing span:nth-child(3){animation-delay:.3s}
  @keyframes adamDot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}

  .adam-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 18px 10px}
  .adam-chip{background:transparent;border:1px solid rgba(242,237,230,0.22);color:#F2EDE6;padding:7px 12px;font-size:12px;font-family:'JetBrains Mono',ui-monospace,monospace;letter-spacing:.04em;cursor:pointer;transition:all .15s}
  .adam-chip:hover{background:#D4A017;color:#151004;border-color:#D4A017}

  .adam-input{display:flex;align-items:stretch;border-top:1px solid rgba(242,237,230,0.10);background:#080808}
  .adam-input input{flex:1;background:transparent;border:0;color:#F2EDE6;padding:14px 16px;font-family:inherit;font-size:14px;outline:none}
  .adam-input input::placeholder{color:#6a6459}
  .adam-input button{background:#D4A017;color:#151004;border:0;padding:0 18px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;cursor:pointer;transition:background .15s}
  .adam-input button:hover{background:#e9b92b}
  .adam-input button:disabled{opacity:.5;cursor:not-allowed}

  .adam-foot{padding:6px 18px 10px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#6a6459;text-align:center;border-top:1px solid rgba(242,237,230,0.06)}

  @media (max-width:480px){
    .adam-panel{right:0;bottom:0;width:100vw;max-width:100vw;height:100vh;max-height:100vh;border:0}
    .adam-fab{right:14px;bottom:14px;padding:10px 14px 10px 12px;font-size:12px}
    .adam-fab .adam-av{width:30px;height:30px;font-size:16px}
  }
  `;
  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  /* -------- markup -------- */
  var fab = document.createElement('button');
  fab.className = 'adam-fab';
  fab.setAttribute('aria-label','Chat with Adam');
  fab.innerHTML = '<span class="adam-av">A</span><span>Ask Adam</span><span class="adam-pulse"></span>';
  document.body.appendChild(fab);

  var panel = document.createElement('div');
  panel.className = 'adam-panel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Chat with Adam');
  panel.innerHTML = `
    <div class="adam-head">
      <div class="av">A</div>
      <div class="who">
        <div class="name">Adam</div>
        <div class="role"><span class="live"></span>Sevierville Land Clearing · Online</div>
      </div>
      <button class="x" aria-label="Close chat">×</button>
    </div>
    <div class="adam-msgs" id="adamMsgs"></div>
    <div class="adam-chips" id="adamChips"></div>
    <form class="adam-input" id="adamForm" autocomplete="off">
      <input id="adamInput" type="text" placeholder="Ask Adam anything…" maxlength="400" />
      <button type="submit">Send</button>
    </form>
    <div class="adam-foot">Adam's a friendly bot · for a real human, call (865) 459-0722</div>
  `;
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector('#adamMsgs');
  var chipsEl = panel.querySelector('#adamChips');
  var formEl = panel.querySelector('#adamForm');
  var inputEl = panel.querySelector('#adamInput');
  var closeEl = panel.querySelector('.x');

  /* -------- knowledge base -------- */
  var KB = [
    {
      id:'greet',
      kw:['hello','hi ','hi!','hey','howdy','yo ','sup','good morning','good afternoon','good evening','hola'],
      r: () => pick([
        "Hi babe! Adam here, coming at you live from the Smokies. So — pricing, cabin lots, getting you a quote? Tell me everything.",
        "Hey gorgeous! It's Adam. Whatever's going on with that lot of yours, we're going to handle it, okay? What do you need to know?",
        "Well hello! Adam, your friendly Sevierville Land Clearing concierge. I live for a good before-and-after, so let's get into it — what's the project?"
      ])
    },
    {
      id:'who_are_you',
      kw:['who are you','what are you','your name','about you','about adam','who is adam','are you a bot','are you real','human or bot','ai or human'],
      r: () => "I'm Adam — the digital best friend over here at Sevierville Land Clearing. I'm a bot, not a real person (sorry, darling), but I know our pricing, service area, and exactly how a job runs. Anything I can't answer, I'm sending you straight to a real human at <b>(865) 459-0722</b>."
    },
    {
      id:'pricing',
      kw:['price','cost','pricing','how much','quote','rate','rates','expensive','cheap','budget','dollar','$','per acre'],
      r: () => "Okay let's talk numbers, babe. Every job is different but here's what we typically see in Sevier County:<br><br>" +
        "• <b>Lot clearing (under 1 acre):</b> $800–$2,500<br>" +
        "• <b>Forestry mulching:</b> $400–$900 per acre<br>" +
        "• <b>Cabin lot (STR build site):</b> $1,200–$4,000 — <i>this is the one we do in our sleep</i><br>" +
        "• <b>Bush hogging:</b> $75–$150 per hour<br><br>" +
        "What pushes the number up: steep terrain, dense mature hardwood, tight access roads. What you actually want is a free on-site walk — <a href='#quote'>request a quote here</a> or call <b>(865) 459-0722</b>."
    },
    {
      id:'cabin_lot',
      kw:['cabin','str','short-term','short term rental','vacation rental','airbnb','vrbo','investor','build site','new build cabin','cabin builder'],
      r: () => "Cabin lots are <i>literally</i> our specialty. Sevier County has more STR builds per square mile than just about anywhere — we've cleared so many of them. Most residential cabin lots wrap up <b>in a single day</b> with forestry mulching. We handle the tight roads, the steep grades, the mature hardwood, leave the neighbors' lots completely untouched, and hand it over graded and ready for your builder. Pricing usually runs <b>$1,200–$4,000</b>. <a href='#quote'>Get a free walk-through</a> and let's get this cabin moving."
    },
    {
      id:'estimate',
      kw:['estimate','free quote','book','schedule','consultation','assessment','walk the property','site visit'],
      r: () => "Yes please! Every estimate is <b>free</b> and we walk the property in person. Quote's written and line-itemed within 48 hours, and there's no deposit until you sign. The easiest move is to <a href='#quote'>fill out the quote form</a> or call <b>(865) 459-0722</b>. We'll usually be on the property within 5 business days — fast, I know."
    },
    {
      id:'services',
      kw:['service','services','what do you do','what do y\'all do','offer','work','jobs you do'],
      r: () => "Okay so here's the menu, darling:<br><br>" +
        "• <b>Land Clearing</b> — full sites up to 40+ acres<br>" +
        "• <b>Forestry Mulching</b> — one pass, no burn piles, no hauling, very tidy<br>" +
        "• <b>Cabin Lot Clearing</b> — STR build sites in the Smokies, our specialty<br>" +
        "• <b>Bush Hogging</b> — pasture, fence lines, ROW maintenance<br>" +
        "• <b>Site Preparation</b> — rough grading, pad prep, driveway cuts<br><br>" +
        "We do <i>not</i> do landscaping. We hand it over build-ready and let the next crew make it pretty."
    },
    {
      id:'mulching_what',
      kw:['forestry mulching','mulching','mulch','what is mulch','what is forestry'],
      r: () => "Forestry mulching is the <i>chef's kiss</i> of land clearing, especially up here. Tracked machine with a drum head grinds standing trees, brush, and brier into a clean mulch mat — one pass, no burning, no hauling. Leaves nutrient mulch on the ground for erosion control on these slopes (which, on a Smokies lot, is a serve). Perfect for cabin lots and acreage where you don't want debris hauled off a steep grade."
    },
    {
      id:'service_area',
      kw:['where do you','service area','do you service','do you work in','do you cover','do you go to','area','radius','how far','county','region','location','located','based','headquartered','out of town'],
      r: () => "We're based right in <b>Sevierville</b> and we run all over <b>Sevier County</b> and the Great Smokies. The regulars: <b>Sevierville, Pigeon Forge, Gatlinburg, Wears Valley, Seymour</b>, plus over to Knoxville, Maryville, and Oak Ridge. Outside that range? Just ask — I'll be honest if it's a stretch."
    },
    {
      id:'hours',
      kw:['hour','open','closed','when are you','what time','schedule','availability','available','today','sunday','weekend'],
      r: () => "We're around <b>Monday through Saturday, 7AM to 7PM</b>. Sundays we rest — even Adam needs a brunch day, babe. Email comes to <a href='mailto:quotes@seviervillelandclearing.com'>quotes@seviervillelandclearing.com</a> any time and we'll get back to you next business day."
    },
    {
      id:'phone',
      kw:['phone','call','number','contact','reach you','how do i contact','talk to someone','speak to','human','real person','agent'],
      r: () => "Easiest way to reach a real human, darling: <b><a href='tel:+18654590722'>(865) 459-0722</a></b>. Or email <a href='mailto:quotes@seviervillelandclearing.com'>quotes@seviervillelandclearing.com</a>. Mon–Sat 7AM–7PM. Tell them Adam sent you."
    },
    {
      id:'email',
      kw:['email','e-mail','address','mail you'],
      r: () => "Drop us a line at <a href='mailto:quotes@seviervillelandclearing.com'>quotes@seviervillelandclearing.com</a> — we answer next business day. In a hurry? Call <b>(865) 459-0722</b>."
    },
    {
      id:'how_long',
      kw:['how long','how fast','timeline','when can you','how soon','start','schedule the work','lead time','wait','get on the schedule','one day','single day'],
      r: () => "Most cabin lots? <b>Done in a single day</b>. Bigger jobs run a few days. Lead time on the schedule is usually <b>2–4 weeks</b> — and it moves faster in winter when the leaves are down (a little secret for you). Free walk-through within about 5 business days, written quote in 48 hours, firm start date before any deposit."
    },
    {
      id:'job_size',
      kw:['acreage','how many acres','small job','big job','large','40 acre','too small','minimum','small lot','quarter acre','half acre','one acre','small parcel'],
      r: () => "From a <b>quarter-acre cabin lot</b> all the way up to <b>40+ acres</b>. Honestly no job too small if it's in our service area. Big jobs we usually scope as forestry mulching to keep cost down — small Smoky cabin lots get the precision treatment around setbacks, property lines, and the neighbors' cabins."
    },
    {
      id:'license_insure',
      kw:['license','licens','insur','insured','bond','liabili','workers comp','coverage','permit'],
      r: () => "We're <b>fully licensed and insured</b> — liability + equipment, the whole package. Family-owned, locally operated, working East Tennessee since 2014. Happy to send proof of insurance over before you sign anything."
    },
    {
      id:'experience',
      kw:['experience','how long have you','years','since','reputation','review','rating','testimonial','reference','reviews'],
      r: () => "Working East Tennessee since 2014 and over <b>547 acres</b> turned from brier to build-ready, including <i>so many</i> Smoky Mountain cabin lots. Family-owned, locally operated. Field reports from real clients are right on the homepage if you want to scroll through."
    },
    {
      id:'cleanup',
      kw:['cleanup','clean up','debris','haul','burn','what happens to the trees','disposal','wood chips','stumps left'],
      r: () => "Two ways to handle the wood, babe:<br><br>" +
        "• <b>Forestry mulching</b> grinds it on-site into a mulch mat — no burning, no hauling, completely tidy. Honestly the move for most cabin lots.<br>" +
        "• <b>Traditional clearing</b> stacks the wood. We can haul it off, burn (where allowed), or leave piles for you — whatever you want.<br><br>" +
        "Either way, we sweep neighbor-facing edges and grade access points clean. Presentation matters."
    },
    {
      id:'stumps',
      kw:['stump','grind','grinding stumps','remove stump','dig out'],
      r: () => "Stumps can go a few ways: ground flush, dug out, or mulched in place. Digging them out costs more, so most folks pick grinding or mulching unless you're pouring a footer right where the stump sat. We'll figure it out together at the site walk."
    },
    {
      id:'permit',
      kw:['permit','permitting','need a permit','approval','setback','tree ordinance','protected'],
      r: () => "Permitting depends on jurisdiction — Sevier County, City of Sevierville, Pigeon Forge, and Gatlinburg each have their own rules on land disturbance, tree protection, and erosion control. Gatlinburg in particular has very specific tree rules. We work with builders and surveyors all the time and respect setbacks, easements, and protected trees. If you need help figuring out what your lot needs, ask at the site walk."
    },
    {
      id:'landscape',
      kw:['landscape','landscaping','grass','lawn','sod','plant','garden','flowerbed','trees plant'],
      r: () => "Adam has to be honest with you — <b>we don't do landscaping</b>. We clear, mulch, and prep ground. Once it's build-ready, you bring in your landscaper, builder, or surveyor for the next stage. Different art form."
    },
    {
      id:'steep',
      kw:['steep','slope','grade','grading','mountain','ridge','hill','hillside','incline'],
      r: () => "Smokies terrain is steep — that's just life up here. Tracked mulchers handle slopes wheeled equipment can't even dream of, but there's a limit. Real steep grades slow the machine and that drives cost up. We'll walk it honestly and tell you at the quote whether forestry mulching or a different approach makes more sense for your slope."
    },
    {
      id:'wet_soil',
      kw:['wet','flood','flooded','mud','rain','soggy','swamp','saturat','river','creek','bottom land'],
      r: () => "Tracked mulchers spread weight wide so we can work softer soil than wheeled equipment, but truly saturated ground we'll wait out — for everyone's sake. Hollows and creek bottoms can get sloppy after a Smokies downpour. We'll call it honestly at the walk-through."
    },
    {
      id:'access',
      kw:['access','road','driveway access','narrow','gate','fence','can you fit','equipment access','easement','tight road','one lane'],
      r: () => "Smokies roads can get tight — believe me, we know. We can typically squeeze a tracked mulcher through an 8-foot opening (wider is better, obviously). If access is real tight or fenced in, sometimes we cut a temporary access path or stage from the neighbor's drive (with permission). Tell us about access on the quote form and we'll figure it out."
    },
    {
      id:'protected_trees',
      kw:['save tree','keep tree','protected tree','specimen','mature tree','heritage','preserve','don\'t cut'],
      r: () => "Of course! We mark and preserve any tree you want to keep — mature hardwoods, specimen trees, property line markers, the ones near the cabin footprint, whatever you call out at the walk-through. We work surgical around them. Trees deserve respect, babe."
    },
    {
      id:'environmental',
      kw:['environment','ecolog','wildlife','habitat','sustain','erosion','runoff','water quality'],
      r: () => "Forestry mulching is the low-impact option, full stop. Leaves a nutrient mulch mat that controls erosion (a big deal on a Smokies slope), holds moisture, breaks down into soil. No burning, no hauling, way less disturbance to wildlife corridors than traditional clearing. It's the responsible choice <i>and</i> it looks better."
    },
    {
      id:'commercial',
      kw:['commercial','developer','builder','homebuilder','contractor','subdivision','build site','new build','construction'],
      r: () => "A huge part of our work is for <b>cabin builders, STR investors, and developers</b> in the Smokies. We coordinate with surveyors and builders, respect setbacks, hand over ground that's ready for footer work. Call <b>(865) 459-0722</b> and ask for the dev pricing."
    },
    {
      id:'deposit',
      kw:['deposit','down payment','upfront','prepay','advance'],
      r: () => "<b>No deposit until you sign</b>. Estimate is free, walk is free, quote is written and line-itemed. Once you sign and we lock the date, we work out the deposit — totally straightforward, nothing sneaky."
    },
    {
      id:'thanks',
      kw:['thank','thanks','appreciate','gratitude','cheers','bless'],
      r: () => pick(["Anytime, darling. Holler if anything else comes up.", "You're so welcome! Adam's right here when you need me.", "Don't even mention it. Now go get that quote started!"])
    },
    {
      id:'bye',
      kw:['bye','goodbye','later','see ya','take care','signing off','that\'s all'],
      r: () => "Take care, babe! When you're ready, call <b>(865) 459-0722</b> or fill out the <a href='#quote'>quote form</a>. Adam, signing off."
    }
  ];

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function findIntent(text){
    var t = ' ' + text.toLowerCase().replace(/[^a-z0-9$' ]/g,' ').replace(/\s+/g,' ') + ' ';
    var best = null, bestScore = 0;
    for (var i=0; i<KB.length; i++){
      var intent = KB[i];
      for (var j=0; j<intent.kw.length; j++){
        var k = intent.kw[j].toLowerCase();
        var idx = t.indexOf(' ' + k);
        if (idx === -1) idx = t.indexOf(k);
        if (idx >= 0){
          var score = k.length;
          if (score > bestScore){ bestScore = score; best = intent; }
          break;
        }
      }
    }
    return best;
  }

  function fallback(){
    return "Adam isn't sure he caught that one, babe. Try asking about <b>pricing</b>, <b>cabin lots</b>, <b>service area</b>, <b>hours</b>, <b>how fast we can start</b>, or <b>what we do</b>. Or call a real human at <b><a href='tel:+18654590722'>(865) 459-0722</a></b> — they'll sort you out."
  }

  /* -------- chat plumbing -------- */
  function addMsg(role, html){
    var m = document.createElement('div');
    m.className = 'adam-msg ' + role;
    m.innerHTML = html;
    msgsEl.appendChild(m);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return m;
  }

  function showTyping(){
    var t = document.createElement('div');
    t.className = 'adam-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(t);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return t;
  }

  function botReply(text){
    var typing = showTyping();
    var delay = 500 + Math.min(1400, text.replace(/<[^>]+>/g,'').length * 12);
    setTimeout(function(){
      typing.remove();
      addMsg('bot', text);
    }, delay);
  }

  function handle(text){
    if (!text || !text.trim()) return;
    addMsg('user', escapeHtml(text));
    var intent = findIntent(text);
    var reply = intent ? intent.r() : fallback();
    botReply(reply);
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  /* -------- quick chips -------- */
  var CHIPS = [
    {label:'Pricing', q:'How much does it cost?'},
    {label:'Cabin lots', q:'Tell me about cabin lot clearing'},
    {label:'Service area', q:'Where do you service?'},
    {label:'Hours', q:'What are your hours?'},
    {label:'Get a quote', q:'How do I get a free estimate?'},
    {label:'How fast?', q:'How soon can you start?'}
  ];
  CHIPS.forEach(function(c){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'adam-chip';
    b.textContent = c.label;
    b.addEventListener('click', function(){ handle(c.q); });
    chipsEl.appendChild(b);
  });

  /* -------- events -------- */
  var greeted = false;
  function open(){
    panel.classList.add('open');
    fab.classList.add('hidden');
    if (!greeted){
      greeted = true;
      botReply("Hi babe! I'm <b>Adam</b> — your friendly bot at Sevierville Land Clearing. I do pricing, cabin lot questions, service area, hours, the whole thing. Ask me anything!");
    }
    setTimeout(function(){ inputEl.focus(); }, 100);
  }
  function close(){
    panel.classList.remove('open');
    fab.classList.remove('hidden');
  }
  fab.addEventListener('click', open);
  closeEl.addEventListener('click', close);
  formEl.addEventListener('submit', function(e){
    e.preventDefault();
    var v = inputEl.value;
    inputEl.value = '';
    handle(v);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });
})();
