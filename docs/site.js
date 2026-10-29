(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  root.classList.add('js');

  /* ---------- language ---------- */
  const TR = {
    'skip': 'İçeriğe geç',
    'nav.try': 'Yük dene', 'nav.catch': 'Neyi yakalar', 'nav.builds': 'İki sürüm', 'nav.install': 'Kurulum',
    'hero.over': 'SSH · nginx · Next.js middleware · itibar · davranış puanı · canlı panel',
    'hero.a': 'Yakala.', 'hero.b': 'Banla.', 'hero.c': 'Anlat.',
    'hero.lede': 'Küçük sunucu filolarının çoğu SSH için fail2ban çalıştırır, uygulama için hiçbir şey çalıştırmaz ve olayı bir müşteriden duyar. tlk-sentinel sunucu loglarını okur <b>ve</b> uygulamanın içinde çalışır; böylece <code>/.env</code> yoklayan bir tarayıcı ile giriş ucunu döven aynı IP <b>iki ayrı olay değil, tek bir hikâye</b> olur.',
    'ops.aria': 'Canlı demo: solda log satırları, sağda kararlar', 'ops.live': 'canlı · simüle trafik', 'ops.profile': 'Profil',
    'ops.public': 'public profil: kararlar raporlanır, hiçbir şey banlanmaz. Güvenlik duvarı dry-run.',
    'ops.self': 'self profil: yüksek ve kritik kaynaklar banlanır, tekrar edenlerde süre ×4.',
    'act.rep': 'RAPOR', 'act.ban': 'BAN', 'act.ban4': 'BAN ×4', 'rep.tor': 'tor-exit itibarı → kritik',
    'c.q': 'Topluluk sürümü <em>izler, puanlar ve raporlar.</em> Ban atmaz.',
    'c.p': 'public profiliyle çalışır ve güvenlik duvarı yanıtlayıcısı dry-run başlar; taze bir klon sen ikisini de bilerek açana kadar sunucunda hiçbir şeye dokunmaz. Bir gün izle, kararların doğru göründüğünü onayla, sonra TLK_FW_DRYRUN=0 yap.',
    't.over': '01 — Arasından bir şey kaçırmayı dene',
    't.h': 'İki kez mi kodlandı? <span class="acc">İki kez çözülür.</span>',
    't.p': 'İstekler eşleştirmeden önce çözülür (yüzde, çift yüzde ve +); %25 ile sarılmış bir yük, düz hâli gibi yakalanır. Bu kutu aynı çözücüyü ve aynı public nginx ve web kurallarını tarayıcında çalıştırır.',
    't.label': 'istek satırı', 't.examples': 'Örnekler', 't.clean': 'temiz istek',
    'lay.raw': 'ham', 'lay.p1': '1. geçiş', 'lay.p2': '2. geçiş',
    'v.clean': 'Hiçbir kural eşleşmedi. İstek, davranış puanına bırakılır.', 'v.pass': 'temiz',
    'fl.over': '02 — Tek ajan', 'fl.mw': 'Next.js middleware', 'fl.files': 'dosyalar (sha256)', 'fl.engine': 'motor', 'fl.parts': 'kural · itibar · anomali',
    'fl.o1': 'ban, tekrarda süre katlanır', 'fl.o2': 'sorgulanabilir olay geçmişi', 'fl.panel': 'canlı panel', 'fl.o3': 'SSE pano, tek tıkla ban kaldırma', 'fl.o4': 'tehdit başına bir embed',
    'ca.over': '03 — Neyi yakalar',
    'ca.1h': 'Parola denemesi, olmayan kullanıcı, root girişi', 'ca.1': 'IP başına eşik pencereleri.',
    'ca.2h': 'SQLi, XSS, dizin atlama, yoklama, istek seli', 'ca.2': 'Normalize edilmiş isteklerde regex kuralları: .env, wp-admin, phpmyadmin ve benzerleri.',
    'ca.3t': 'Araçlar', 'ca.3': 'User-Agent imzaları.',
    'ca.4t': 'Bilinmeyen saldırılar', 'ca.4h': 'Hiçbir imzaya uymayan taramalar', 'ca.4': 'İstek hızı, yol çeşitliliği, User-Agent değişimi ve 4xx oranından davranış puanı.',
    'ca.5t': 'Kötü bilinen kaynaklar', 'ca.5h': 'Tor çıkışları, kötüye kullanılan ağlar', 'ca.5': 'Çevrimdışı CIDR itibarı tehdidi kritiğe yükseltir.',
    'ca.6t': 'Kurcalama', 'ca.6h': '.env, yapılandırmalar, ikili dosyalar', 'ca.6': 'Zamanlayıcıyla yeniden kontrol edilen sha256 temeli.',
    'b.over': '04 — Tek kod, iki sürüm', 'b.h': 'Çatal değil. <span class="acc">Bir JSON profili.</span>',
    'b.comm': 'topluluk', 'b.int': 'iç', 'b.mode': 'Mod', 'b.monitor': 'monitor, sadece raporlar', 'b.enforce': 'enforce, banlar',
    'b.ban': 'Otomatik ban', 'b.off': 'kapalı', 'b.on': 'açık', 'b.on4': 'açık, tekrar edende ×4',
    'b.priv': 'Özel kurallar', 'b.notloaded': 'yüklenmez', 'b.loaded': 'yüklenir', 'b.honey': 'Bal küpü, aktif savunma', 'b.alerts': 'Uyarılar',
    'b.gate': '<b>npm run dist:public</b> iç profili, özel kuralları ve imza anahtarını çıkarır, çıktıda sır taraması yapar ve public varsayılanının hâlâ pasif olduğunu doğrular. Herhangi bir kontrol başarısız olursa derleme reddedilir; uygulayan bir varsayılan kazara bir sürüme ulaşamaz.',
    'p.over': '05 — Canlı panel', 'p.h': 'Ne olduğu, tek ekranda.',
    'p.p': '127.0.0.1:8787’ye bağlanır. Başka bir arayüzde TLK_PANEL_TOKEN olmadan bağlanmayı reddeder ve bunu söyler. Her yazma ucu girdisini doğrular: IP olmayan bir IP asla nft’ye ulaşmaz.',
    'p.alt': 'tlk-sentinel panosu: canlı tehdit akışı, önem dağılımı ve ban listesi',
    'ap.over': '06 — Uygulamanın içinde', 'ap.h': 'Aynı motor, <span class="acc">middleware olarak.</span>',
    'ap.p': 'Kararlar sertleştirilmiş yanıt başlıklarıyla gelir (nosniff, DENY, HSTS, kilitli bir Permissions-Policy); izin verilen yanıtlara da uygulayabilirsin.',
    'pr.tests': 'test, Node’un yerleşik test koşucusu, framework yok', 'pr.deps': 'çalışma zamanı bağımlılığı', 'pr.enc': 'kodlama, her biri için atlatma regresyon testi',
    'pr.p': 'Ban eşikleri ve süre katlama, profil kapısı, itibar ve ülke tabloları, anomali bekleme süresi, kesilme ve logrotate boyunca log takibi, bütünlük temelleri, SQLite deposu ve güvenlik duvarı girdi doğrulaması. Dört entegrasyon testi gerçek ajanı canlı bir log dosyasına karşı çalıştırır. İki test daha, atfı silinmiş bir derlemenin imza kontrolünden geçemediğini ve ban uygulamayı reddettiğini doğrular. CI Linux ve Windows’ta, Node 22 ve 24’te koşar.',
    'i.over': '07 — Kurulum', 'i.h': 'Node 22.5+. <span class="acc">Başka hiçbir şey.</span>',
    'i.p': 'Sürümün önemi yerleşik SQLite’tan geliyor. Kurmadan önce tehdit modelini oku: neyi yakalamadığını ve aracın sana karşı çevrilebileceği dört yolu.',
    'i.tm': 'Tehdit modeli →', 'i.arch': 'Mimari →',
    'l.over': '08 — Lisans, kısaca',
    'l.y1': 'Kendi makinelerinde, şirketininkiler dahil çalıştırmak', 'l.y2': 'Kendi işin için ticari olarak çalıştırmak', 'l.y3': 'Kendi kurulumun için kaynağı okumak ve değiştirmek', 'l.y4': 'Yama ya da kod içeren bir güvenlik bildirimi göndermek',
    'l.n1': 'Yeniden dağıtmak, yayımlamak ya da aynalamak', 'l.n2': 'Satmak, kiralamak ya da ücretli bir ürünün içinde vermek', 'l.n3': 'Başkası için hizmet olarak barındırmak', 'l.n4': 'Atfı ya da lisans metnini silmek',
    'l.foot': 'Bağlayıcı olan <a href="https://github.com/Talkdedsec/tlk-sentinel/blob/main/LICENSE">LICENSE</a>; bu bir özet. Sağ sütundaki her şey satın alınabilir: <a href="mailto:talkdedsec@proton.me">talkdedsec@proton.me</a>',
    'copy': 'Kopyala', 'copied': 'Kopyalandı',
    'foot.w': 'İki olay değil, tek hikâye.', 'foot.rel': 'Sürümler', 'foot.log': 'Değişiklikler', 'foot.sec': 'Güvenlik'
  };
  const EN = {
    'ops.public': 'public profile: decisions are reported, nothing is banned. The firewall is in dry-run.',
    'ops.self': 'self profile: high and critical sources are banned, ×4 on repeat offenders.',
    'act.rep': 'REPORT', 'act.ban': 'BAN', 'act.ban4': 'BAN ×4', 'rep.tor': 'tor-exit reputation → critical',
    'lay.raw': 'raw', 'lay.p1': 'pass 1', 'lay.p2': 'pass 2',
    'v.clean': 'No rule matched. The request is left to the behavioural score.', 'v.pass': 'clean', 'copied': 'Copied'
  };
  let lang = 'en';
  const t = k => (lang === 'tr' ? TR[k] : EN[k]) ?? '';
  const orig = new Map();
  const keep = (el, a, get) => { if (!orig.has(el)) orig.set(el, {}); const o = orig.get(el); if (!(a in o)) o[a] = get(); return o[a]; };
  function applyLang(l) {
    lang = l; root.lang = l;
    const tr = k => l === 'tr' ? TR[k] : undefined;
    $$('[data-i18n]').forEach(el => { const en = keep(el, 't', () => el.textContent); el.textContent = tr(el.dataset.i18n) ?? en; });
    $$('[data-i18n-html]').forEach(el => { const en = keep(el, 'h', () => el.innerHTML); el.innerHTML = tr(el.dataset.i18nHtml) ?? en; });
    $$('[data-i18n-aria]').forEach(el => { const en = keep(el, 'a', () => el.getAttribute('aria-label')); el.setAttribute('aria-label', tr(el.dataset.i18nAria) ?? en); });
    $$('[data-i18n-alt]').forEach(el => { const en = keep(el, 'alt', () => el.alt); el.alt = tr(el.dataset.i18nAlt) ?? en; });
    $('.ops-note').textContent = t('ops.' + profile);
    analyse();
    try { localStorage.setItem('tlk-sentinel-lang', l); } catch {}
  }
  $('.lang').addEventListener('click', () => applyLang(lang === 'en' ? 'tr' : 'en'));
  addEventListener('scroll', () => document.body.classList.toggle('scrolled', scrollY > 8), { passive: true });

  /* ---------- the shipped public rules and decoder ---------- */
  // shortcut: copied from rules/public/*.json and packages/core/src/normalize.ts; re-copy when those change.
  const RULES = [
    { id: 'nginx-path-traversal', o: 'http', re: /(\.\.\/|%2e%2e%2f|%2e%2e\/|\.\.%2f)/i, sev: 'high', th: 1, en: 'Path traversal attempt', tr: 'Dizin atlama (path traversal) denemesi' },
    { id: 'nginx-sensitive-file', o: 'http', re: /(\/\.env|\/\.git\/|\/wp-login|\/wp-admin|\/phpmyadmin|\/\.aws\/|\/config\.php)/i, sev: 'high', th: 2, en: 'Sensitive file/panel probing', tr: 'Hassas dosya/panel taraması' },
    { id: 'nginx-sqli-probe', o: 'http', re: /(union(\s|%20|\+)+select|information_schema|sleep\(\d|benchmark\(|' or '1'='1)/i, sev: 'high', th: 1, en: 'SQL injection attempt via URL', tr: 'URL üzerinden SQL injection denemesi' },
    { id: 'nginx-scanner-ua', o: 'http', re: /(sqlmap|nikto|nmap|masscan|acunetix|nuclei|WPScan|dirbuster|gobuster)/i, sev: 'medium', th: 1, en: 'Known scanner tool signature (User-Agent)', tr: 'Bilinen tarayıcı aracı imzası (User-Agent)' },
    { id: 'web-xss-probe', o: 'http', re: /(<script|onerror\s*=|javascript:|onload\s*=|document\.cookie)/i, sev: 'medium', th: 1, en: 'XSS payload trace in request', tr: 'İstekte XSS yükü izi' },
    { id: 'web-sqli-body', o: 'http', re: /(union\s+select|' or 1=1|\bor\b\s+'?1'?='?1|--\s|;--)/i, sev: 'high', th: 1, en: 'SQL injection trace in request body', tr: 'İstek gövdesinde SQL injection izi' },
    { id: 'ssh-bruteforce', o: 'ssh', re: /Failed password for (invalid user )?\S+ from (\d{1,3}(\.\d{1,3}){3})/, sev: 'high', th: 5, en: 'SSH password brute-force', tr: 'SSH parola deneme saldırısı' },
    { id: 'ssh-invalid-user', o: 'ssh', re: /Invalid user \S+ from (\d{1,3}(\.\d{1,3}){3})/, sev: 'medium', th: 3, en: 'SSH attempt with invalid user', tr: 'Var olmayan kullanıcı ile SSH denemesi' },
    { id: 'ssh-root-attempt', o: 'ssh', re: /Failed password for root from (\d{1,3}(\.\d{1,3}){3})/, sev: 'high', th: 2, en: 'Direct SSH login attempt as root', tr: 'root ile doğrudan SSH denemesi' }
  ];
  function decodeLayers(input, passes = 2) {
    const out = [input];
    let cur = input;
    for (let i = 0; i < passes; i++) {
      let next;
      try { next = decodeURIComponent(cur.replace(/\+/g, ' ')); } catch { next = cur.replace(/%25/gi, '%').replace(/\+/g, ' '); }
      if (next === cur) break;
      out.push(next); cur = next;
    }
    return out;
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function marked(s, rules) {
    const spans = [];
    rules.forEach(r => { const g = new RegExp(r.re.source, r.re.flags.includes('g') ? r.re.flags : r.re.flags + 'g'); let m; while ((m = g.exec(s))) { spans.push([m.index, m.index + m[0].length]); if (!m[0].length) g.lastIndex++; } });
    if (!spans.length) return esc(s);
    spans.sort((a, b) => a[0] - b[0]);
    let html = '', at = 0;
    for (const [a, b] of spans) { if (a < at) continue; html += esc(s.slice(at, a)) + '<mark>' + esc(s.slice(a, b)) + '</mark>'; at = b; }
    return html + esc(s.slice(at));
  }

  /* ---------- payload lab ---------- */
  const req = $('#req'), layersEl = $('.layers'), verdict = $('.verdict');
  function analyse() {
    const raw = req.value.trim();
    const layers = decodeLayers(raw);
    const tested = layers.length > 1 ? raw + ' ' + layers[layers.length - 1] : raw;
    const http = RULES.filter(r => r.o === 'http');
    const hits = http.filter(r => r.re.test(tested));
    const names = [t('lay.raw'), t('lay.p1'), t('lay.p2')];
    layersEl.innerHTML = layers.map((l, i) => `<li><span>${names[i]}</span><span>${marked(l, hits)}</span></li>`).join('');
    verdict.innerHTML = hits.length
      ? hits.map(r => `<div class="v ${r.sev}"><i></i><span><b>${r.id}</b> · ${esc(lang === 'tr' ? r.tr : r.en)}</span><em>${r.sev}</em></div>`).join('')
      : `<div class="v clean"><i></i><span>${t('v.clean')}</span><em>${t('v.pass')}</em></div>`;
  }
  req.addEventListener('input', analyse);
  $$('.presets button').forEach(b => b.addEventListener('click', () => { req.value = b.dataset.x; analyse(); }));

  /* ---------- live operations demo ---------- */
  let profile = 'public';
  $$('.prof [role="radio"]').forEach(b => b.addEventListener('click', () => {
    profile = b.dataset.p;
    $$('.prof [role="radio"]').forEach(x => x.setAttribute('aria-checked', x === b));
    $('.ops-note').textContent = t('ops.' + profile);
  }));
  const TOR = /^185\.220\.101\./;
  const stamp = () => { const d = new Date(); return [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':'); };
  const ng = (ip, path, code, ua) => `${ip} - - [29/Oct/2026:${stamp()} +0000] "GET ${path} HTTP/1.1" ${code} ${200 + ((path.length * 37) % 4000)} "-" "${ua}"`;
  const ssh = msg => `Oct 29 ${stamp()} web-01 sshd[${2000 + Math.floor(Math.random() * 900)}]: ${msg}`;
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  const SCRIPT = [
    () => ng('198.51.100.12', '/products?page=2', 200, UA),
    () => ssh('Failed password for root from 185.220.101.5 port 52814 ssh2'),
    () => ng('203.0.113.44', '/.env', 404, 'curl/8.4.0'),
    () => ng('198.51.100.31', '/', 200, UA),
    () => ssh('Invalid user admin from 91.240.118.7 port 41022'),
    () => ssh('Failed password for root from 185.220.101.5 port 52822 ssh2'),
    () => ng('203.0.113.44', '/wp-admin/install.php', 404, 'curl/8.4.0'),
    () => ng('45.9.9.9', '/', 200, 'sqlmap/1.8#stable (https://sqlmap.org)'),
    () => ng('198.51.100.23', '/?id=1%2520union%2520select%25201', 200, UA),
    () => ssh('Invalid user test from 91.240.118.7 port 41030'),
    () => ng('198.51.100.12', '/cart', 200, UA),
    () => ssh('Invalid user oracle from 91.240.118.7 port 41044'),
    () => ng('192.0.2.77', '/static/..%2f..%2fetc/passwd', 400, UA),
    () => ng('198.51.100.40', '/search?q=lamp', 200, UA)
  ];
  const stream = $('.stream'), feed = $('.feed');
  const counts = new Map(), banned = new Map();
  let step = 0;
  function tick() {
    const line = SCRIPT[step % SCRIPT.length]();
    step++;
    const tested = (() => { const L = decodeLayers(line); return L.length > 1 ? line + ' ' + L[L.length - 1] : line; })();
    const hits = RULES.filter(r => r.re.test(tested));
    const li = document.createElement('li');
    li.innerHTML = marked(line, hits);
    if (hits.length) li.className = 'hit ' + hits[0].sev;
    stream.append(li);
    while (stream.children.length > 22) stream.firstChild.remove();
    const ip = (line.match(/from (\d+\.\d+\.\d+\.\d+)/) || line.match(/^(\d+\.\d+\.\d+\.\d+)/) || [])[1];
    for (const r of hits) {
      const k = r.id + ip, n = (counts.get(k) || 0) + 1;
      counts.set(k, n);
      if (n !== r.th) continue;
      let sev = r.sev, why = '';
      if (ip && TOR.test(ip)) { sev = 'critical'; why = ' · ' + t('rep.tor'); }
      let act = 'rep', label = t('act.rep');
      if (profile === 'self' && sev !== 'medium') {
        const times = (banned.get(ip) || 0) + 1; banned.set(ip, times);
        act = 'ban'; label = times > 1 ? t('act.ban4') : t('act.ban');
      }
      const f = document.createElement('li');
      f.className = sev;
      f.innerHTML = `<span class="sev"></span><span class="rule">${r.id}</span><span class="act ${act}">${label}</span><span class="ip">${ip || ''} · ${sev}${why}</span>`;
      feed.prepend(f);
      while (feed.children.length > 7) feed.lastChild.remove();
    }
    if (step % SCRIPT.length === 0) counts.clear();
  }
  let timer = null;
  const run = on => { clearInterval(timer); timer = on ? setInterval(tick, 900) : null; };
  for (let i = 0; i < 9; i++) tick();
  if (!reduce) new IntersectionObserver(([e]) => run(e.isIntersecting)).observe($('.ops'));

  /* ---------- copy + reveals ---------- */
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.previousElementSibling.textContent); } catch { return; }
    b.textContent = t('copied'); b.classList.add('ok');
    setTimeout(() => { b.textContent = lang === 'tr' ? TR.copy : 'Copy'; b.classList.remove('ok'); }, 1400);
  }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  let saved = null;
  try { saved = localStorage.getItem('tlk-sentinel-lang'); } catch {}
  const q = new URLSearchParams(location.search).get('lang');
  applyLang(q === 'tr' || q === 'en' ? q : saved || (/^tr\b/i.test(navigator.language) ? 'tr' : 'en'));
  requestAnimationFrame(() => root.classList.add('ready'));
})();
