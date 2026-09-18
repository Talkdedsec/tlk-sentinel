<p align="center">
  <img src="assets/banner.svg" alt="tlk-sentinel" width="100%">
</p>

<p align="center">
  <a href="https://github.com/Talkdedsec/tlk-sentinel/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/Talkdedsec/tlk-sentinel/ci.yml?branch=main&style=flat-square&labelColor=0d1220&color=3ddc97"></a>
  <img alt="test" src="https://img.shields.io/badge/test-60%20ge%C3%A7iyor-3ddc97?style=flat-square&labelColor=0d1220">
  <img alt="bağımlılık" src="https://img.shields.io/badge/%C3%A7al%C4%B1%C5%9Fma%20zaman%C4%B1%20ba%C4%9F%C4%B1ml%C4%B1l%C4%B1%C4%9F%C4%B1-0-5b8cff?style=flat-square&labelColor=0d1220">
  <img alt="node" src="https://img.shields.io/badge/node-%E2%89%A522.5-5b8cff?style=flat-square&labelColor=0d1220">
  <img alt="lisans" src="https://img.shields.io/badge/lisans-kaynak--eri%C5%9Filebilir-ffd43b?style=flat-square&labelColor=0d1220">
</p>

<p align="center">
  <b>Loglarındaki saldırıyı yakalar, kaynağı banlar ve ne olduğunu gösterir — tek süreçte.</b><br>
  <sub>SSH · nginx · Next.js middleware · offline itibar · davranış skoru · canlı panel</sub>
</p>

<p align="center">
  <sub><b>Bu depo topluluk sürümü.</b> <code>public</code> profiliyle çalışır: izler, puanlar
  ve raporlar, ban atmaz. Güvenlik duvarı yanıtlayıcısı da dry-run başlar, yani taze bir klon
  sen ikisini de bilerek açana kadar sunucunda hiçbir şeye dokunmaz.</sub>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="docs/architecture.md">Mimari</a> ·
  <a href="docs/threat-model.md">Tehdit modeli</a>
</p>

---

## Neden

Küçük sunucu filoları SSH için `fail2ban` çalıştırır, uygulama tarafında hiçbir şey
çalıştırmaz ve olaydan müşteri arayınca haberdar olur. tlk-sentinel bu boşluğu tek
ajanla kapatır: aynı kural motoru hem sunucu loglarını okur **hem de** uygulamanın
içinde çalışır, böylece `/.env` yoklayan bir tarayıcı ile giriş ucunu döven aynı IP
iki ayrı olay değil, tek bir hikâye olur.

Tek koddan iki davranış çıkar. Topluluk sürümü izler ve raporlar, iç sürüm uygular.
Bunun kod çatallanmasıyla ilgisi yok — sadece bir JSON profili.

```
              ┌──────────────┐
  auth.log ──▶│              │──▶ nft / ipset       ban, tekrarda süre katlanır
              │              │
access.log ──▶│    motor     │──▶ SQLite            sorgulanabilir olay geçmişi
              │              │
Next.js    ──▶│  kural +     │──▶ canlı panel       SSE pano, tek tıkla ban kaldırma
middleware    │  itibar      │
              │  + anomali   │──▶ Discord           tehdit başına embed
  dosyalar ──▶│              │
  (sha256)    └──────────────┘
```

## Neleri yakalıyor

| | Tespit | Nasıl |
|---|---|---|
| **SSH** | parola deneme, geçersiz kullanıcı, doğrudan root girişi | IP başına eşik penceresi |
| **HTTP** | SQLi, XSS, dizin atlama, `.env` / `wp-admin` / `phpmyadmin` yoklaması, istek seli | normalize edilmiş istekte regex kuralları |
| **Araçlar** | sqlmap, nikto, nuclei, gobuster, masscan ve benzerleri | User-Agent imzaları |
| **Bilinmeyen saldırılar** | hiçbir imzaya uymayan taramalar | davranış skoru: istek ritmi, yol çeşitliliği, UA değişimi, 4xx oranı |
| **Bilinen kötü kaynaklar** | Tor çıkışları, kötüye kullanılan ağlar | offline CIDR itibarı, tehdidi kritiğe çıkarır |
| **Kurcalama** | `.env`, config ve binary değişiklikleri | sha256 tabanı, zamanlayıcıyla yeniden kontrol; `TLK_INTEGRITY` |

Kodlanmış yükler kaçamaz: istekler eşleştirmeden önce çözülür (yüzde, çift yüzde ve
`+`), yani `?id=1%2520union%2520select%25201` düz hâliyle birebir aynı şekilde
yakalanır. Bu kodlamaların her biri için regresyon testi var.

## Kurulum

Node 22.5+ gerekiyor (yerleşik SQLite için). Başka çalışma zamanı bağımlılığı yok.

```bash
git clone https://github.com/Talkdedsec/tlk-sentinel /opt/tlk-sentinel
cd /opt/tlk-sentinel
npm install
npm run build
cp .env.example .env
npm run agent
```

```bash
sudo cp deploy/tlk-sentinel.service /etc/systemd/system/
sudo systemctl enable --now tlk-sentinel
```

Güvenlik duvarı **dry-run** başlar: uygulayacağı banı loglar, hiçbir şeye dokunmaz.
Bir gün izle, kararlar doğru görünüyorsa `TLK_FW_DRYRUN=0` yap.

<details>
<summary>Zorlayıcı mod için nftables set'leri</summary>

```bash
nft add table inet filter
nft add set inet filter tlk_sentinel { type ipv4_addr\; flags timeout\; }
nft add set inet filter tlk_perma  { type ipv4_addr\; }
nft add chain inet filter input { type filter hook input priority 0\; }
nft add rule inet filter input ip saddr @tlk_sentinel drop
nft add rule inet filter input ip saddr @tlk_perma  drop
```
</details>

## Tek kod, iki sürüm

|  | `public` — topluluk | `self` — iç |
|---|---|---|
| Mod | `monitor`, sadece raporlar | `enforce`, banlar |
| Otomatik ban | kapalı | açık, tekrarlayanda ×4 |
| Özel kurallar | yüklenmez | yüklenir |
| Bal kabı yolları, aktif savunma | kapalı | açık |
| Bütünlük izleme | var, isteğe bağlı | var, isteğe bağlı |
| Bildirim | stdout | stdout + Discord |

`npm run dist:public` dağıtılacak ağacı üretir. İç profili, özel kuralları ve imza
anahtarını çıkarır, çıktıyı sır taramasından geçirir ve public varsayılanın hâlâ pasif
olduğunu doğrular. **Kontrollerden biri düşerse build reddedilir**, yani zorlayıcı bir
varsayılan kazara yayına çıkamaz.

## Canlı panel

<p align="center">
  <img src="assets/panel.png" alt="tlk-sentinel panosu: canlı tehdit akışı, önem derecesi dağılımı ve ban listesi" width="100%">
</p>

Varsayılan olarak `127.0.0.1:8787` üzerinde. Başka bir arayüze açmak
`TLK_PANEL_TOKEN` **zorunlu kılar** — token yoksa ajan bağlanmayı reddeder ve bunu
açılışta söyler. nginx arkasındaysa ayrıca IP kısıtı koy. `TLK_PANEL=0` kapatır.

Yazan her uç girdisini doğrular: IP olmayan bir değer asla `nft`'ye ulaşmaz.

## Uygulama katmanı

```ts
import { WebGuard } from "@tlk-sentinel/web";

const guard = new WebGuard({
  profilePath: "profiles/public.json",
  rulesPublicDir: "rules/public",
  lang: "tr",
  trustedProxy: true,
});

export async function middleware(request: Request) {
  const verdict = await guard.inspect(request, { trustProxy: true });
  if (verdict.action === "block") {
    return new Response("engellendi", { status: verdict.status, headers: verdict.headers });
  }
}
```

Kararlar sertleştirilmiş yanıt başlıklarını taşır (`nosniff`, `DENY`, HSTS, kısıtlı bir
`Permissions-Policy`), yani bunları izin verilen yanıtlara da uygulayabilirsin.

## Yapılandırma

| Değişken | Varsayılan | Anlamı |
|---|---|---|
| `TLK_PROFILE` | `public` | `profiles/` altından yüklenecek profil |
| `TLK_PROFILE_PATH` | – | açık profil dosyası, üstekini geçersiz kılar |
| `TLK_LANG` | `tr` | `tr` ya da `en`; log, bildirim ve panele uygulanır |
| `TLK_SSHD_LOG` | `/var/log/auth.log` | boş bırakmak kaynağı kapatır |
| `TLK_NGINX_LOG` | – | nginx erişim logu |
| `TLK_FW_BACKEND` | `nft` | `nft`, `ipset` ya da `none` |
| `TLK_FW_DRYRUN` | `1` | güvenlik duvarına gerçekten yazmak için `0` |
| `TLK_FW_CHAIN` | `tlk_sentinel` | süreli banlarda kullanılan nft set / ipset adı |
| `TLK_ALLOWLIST` | `127.0.0.1,::1` | asla banlanmaz |
| `TLK_PANEL` / `_HOST` / `_PORT` / `_TOKEN` | `1` / `127.0.0.1` / `8787` / – | pano |
| `TLK_DISCORD_WEBHOOK` | – | bildirim kanalı |
| `TLK_DB` | `data/sentinel.db` | SQLite olay deposu |
| `TLK_REPUTATION_DIR` | `data/reputation` | CIDR kara listeleri; dosya adı etiket olur |
| `TLK_COUNTRY_FILE` | – | ülke ataması için `CIDR,CC` tablosu |
| `TLK_ANOMALY` | `1` | davranış skoru |
| `TLK_INTEGRITY` | – | sha256 alınacak dosyalar, virgülle |
| `TLK_SWEEP_MS` | `30000` | sayaçların dolma ve dosyaların yeniden kontrol sıklığı |
| `TLK_ACTIVEDEF_SET` | `tlk_perma` | kalıcı banlar için nft set'i (iç sürüm) |
| `TLK_ACTIVEDEF_CRITS` | `2` | kalıcı bandan önce tek IP'den gelen kritik sayısı |

İtibar beslemeleri depoyla gelmiyor — biçim ve Tor çıkış listesi, Spamhaus DROP ve
FireHOL'ü nereden çekeceğin için [`data/reputation/README.md`](data/reputation/README.md).

## Testler

```bash
npm test
```

Node'un yerleşik koşucusunda 60 test, test çatısı yok. Ban eşikleri ve kademeli süre,
profil geçidi, üç kodlamada WAF bypass direnci, itibar CIDR eşleşmesi ve ülke
tabloları, anomali skoru ve soğuması, log takibinin truncate **ve logrotate** altında
sağ kalması, bütünlük tabanları, SQLite deposu, bildirim gövdeleri, güvenlik duvarı
girdi doğrulaması ve config varsayılanları kapsanıyor. Dördü gerçek ajanı ayağa
kaldırıp canlı bir log dosyasıyla süren ve panel API'sine karşı doğrulama yapan
entegrasyon testi; ikisi de marka atfı sökülmüş bir build'in imza kontrolünü
geçemediğini ve **ban uygulamayı reddettiğini** doğruluyor. CI, Linux ve Windows'ta
Node 22 ve 24 ile koşuyor.

## Yerleşim

```
packages/core    olaylar · profil geçidi · motor · itibar · anomali · normalize · marka
packages/agent   log takibi · güvenlik duvarı · bütünlük · SQLite deposu · panel · aktif savunma
packages/web     uygulama middleware'i, aynı motor
rules/public     dağıtılan kurallar (ssh, nginx, web)
profiles/        davranış profilleri
tests/           60 test, çatı yok
scripts/         sızıntı ve yapı kontrollü topluluk build'i
docs/            mimari ve tehdit modeli
```

[`docs/architecture.md`](docs/architecture.md) tek bir log satırını dosyadan güvenlik
duvarına kadar takip ediyor. [`docs/threat-model.md`](docs/threat-model.md) kurmadan
önce okunması gereken: neyi yakalamadığı ve aracın kendisinin sana karşı
kullanılabileceği dört yol.

## Lisans

Kaynak-erişilebilir, [LICENSE](LICENSE) dosyasına bak. Kısa hâli:

| | |
|:--|:--|
| Kendi makinelerinde çalıştırmak, şirketininkiler dahil | evet |
| Kendi işin için ticari olarak çalıştırmak | evet |
| Kendi kurulumun için kaynağı okumak ve değiştirmek | evet |
| Yama ya da içinde kod olan bir güvenlik bildirimi göndermek | evet |
| Yeniden dağıtmak, yayınlamak, aynalamak | hayır |
| Satmak, kiralamak, ücretli bir ürünün içinde vermek | hayır |
| Başkası için servis olarak barındırmak | hayır |
| Marka atfını ya da lisans metnini sökmek | hayır |

Tablo özettir; bağlayıcı olan [LICENSE](LICENSE) ve içindeki İngilizce metin Türkçe
çevirinin üstündedir. "Hayır" sütunundaki her şey satın alınabilir: talkdedsec@proton.me

[talkdedsec](https://github.com/Talkdedsec) tarafından yapıldı. Marka atfı Ed25519 ile
imzalı ve çalışma anında doğrulanıyor — atfı söken bir build kendi zorlama yeteneğini
kapatır.
