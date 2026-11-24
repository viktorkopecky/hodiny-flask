# Vice Clock (GTA VI)

Flask aplikace s **analogovými hodinami ve stylu Vice City**. Ručičky ukazují čas serveru, plynule se dopočítávají v prohlížeči a pravidelně se znovu synchronizují přes `/api/time`. Kolem hodin propadají bankovky – hráč je sbírá, získává GTA$, kupuje vylepšení, buduje byznys a pomocí **rebirthu** získává trvalý násobek výdělku.

## Hra

- **Peníze:** bankovky v hodnotách 50 / 100 / 500 / 1000 GTA$ se objevují samy od sebe (~každé 2–6 s) nebo po stisku „Shodit peníze". Po kliknutí se peníze připíšou na účet. Bankovka zmizí, pokud ji nechytíte do ~9 s.
- **Zlaté bankovky:** ~8 % bankovek je zlatých a má 5× hodnotu (s *Lucky Charm* 16 %). Zlatá bankovka rozsvítí hodiny a spustí zvláštní zvuk.
- **Combo:** bankovky sebrané do 3,2 s za sebou zvyšují combo až na 10×; každý stupeň přidává 10 % k výdělku (s *Combo Master* 20 % a delší okno).
- **Úrovně a XP:** sebrání peníze přináší XP, překročení prahu odemkne novou úroveň a připsuje odměnu v GTA$. Úroveň zůstává i po rebirthu.
- **Obchod (`B`):** záložky ciferník, ručičky, rozhraní, bonusy a odznaky. Zakoupené předměty lze nasadit/zase vyměnit, efekty lze vypnout. Bonusy se po koupi aktivují trvale.
- **Vzhled:** 5 ciferníků, 4 sady ručiček, 4 skiny HUD a 2 obrazovkové efekty. Prestižní vzhledy se odemykají rebirthem.
- **Odznaky:** sedm automaticky plněných úkolů (první bankovka, 50 bankovek, combo 8×, 5 zlatých bankovek, 100 000 GTA$, 1. a 5. rebirth). Každý odznak přináší jednorázovou odměnu.
- **Ukládání:** veškerý stav (peníze, statistiky, úroveň, rebirthy, vlastněné i nasazené předměty, odznaky, zvuk) se ukládá do `localStorage` pod klíčem `gtaclock.profile`. Původní klíče `gtaclock.*` se při prvním načtení migrují. Žádný účet ani databáze není potřeba.
- **Ovládání:** `mezerník` shodí peníze, `B` otevře obchod, `R` otevře rebirth, `M` přepne zvuk, `Esc` zavře okno. Kliknutím na bankovku ji seberete.

## Rebirth (prestige)

Rebirth je „nový život" ve stylu Roblox prestige systémů:

1. **Podmínka:** během jedné životy vydělejte `25 000 × (počet rebirthů + 1)` GTA$. Průběh se zobrazuje v panelu pod hodinami i v dialogu rebirthu.
2. **Co ztratíte:** aktuální peníze, zakoupený vzhled, nasazené vylepšení a rozjeté combo.
3. **Co zůstane:** úroveň a XP, odznaky, byznysy (trvalé pasivní příjmy), statistiky a počítadlo rebirthů.
4. **Co získáte:** trvalý násobek výdělku `× (1 + 0,5 × rebirthy)` (tj. ×1,5, ×2, …), vyšší počet bankovek při shozu, kratší cooldown shozu, aureolu kolem hodin a prestižní vzhledy – ciferník po 1., ručičky po 3. a HUD po 5. rebirthu.
5. Dialog rebirthu (`R`) vždy ukáže aktuální a nový násobek, podmínku a seznam odměn; tlačítko potvrzení je aktivní až po splnění podmínky.

## Byznys a pasivní příjem

- **Nightclub** (5 000 GTA$) přináší +3 GTA$ za sekundu.
- **Casino VIP** (18 000 GTA$) přináší +12 GTA$ za sekundu.
- Příjmy se sčítají, zůstávají po rebirthu a po návratu do hry je připsána polovina výdělku za dobu nepřítomnosti (max. 4 hodiny).

## Struktura projektu

```
hodiny/
├── app.py               # Flask aplikace, výpočet úhlů ručiček, API, bezpečnostní hlavičky
├── templates/
│   └── index.html       # HUD, ciferník, vrstva peněz, obchod a dialog rebirthu (Jinja)
├── static/
│   ├── style.css        # Vice City vizuál, varianty vzhledu, rebirth a animace
│   └── clock.js         # čas, hra, progrese, obchod, rebirth, uložiště, zvuky
├── tests/
│   └── test_app.py      # testy hodin, API a bezpečnostních hlaviček
├── requirements.txt     # Flask, gunicorn, tzdata
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── .gitignore
```

## Spuštění v Dockeru

```bash
docker compose up -d --build
```

Poté otevřete <http://localhost:8000>. Zastavení:

```bash
docker compose down
```

Kontejner běží pod neprivilegovaným uživatelem, obsluhuje ho gunicorn (2 workeři, port 8000) a Docker pravidelně kontroluje `/healthz`.

## Spuštění lokálně bez Dockeru

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app app run --debug
```

Aplikace poběží na <http://127.0.0.1:5000>.

## Testy

```bash
python3 -m unittest discover -s tests -v
```

## Koncové body

| Metoda | Cesta       | Popis                                                        |
| ------ | ----------- | ------------------------------------------------------------ |
| GET    | `/`         | Úvodní stránka s hodinami, penězi, obchodem a rebirthem       |
| GET    | `/api/time` | Čas serveru v JSON: `iso`, `epoch_ms`, `hour`, `minute`, `second`, `time`, `date`, `timezone`, `angles` |
| GET    | `/healthz`  | Kontrola běhu, vrací `{"status": "ok", "uptime_s": ...}`      |

Příklad:

```bash
curl -s http://localhost:8000/api/time
```

```json
{
  "angles": { "hour": 45.5, "minute": 6.0, "second": 0.0 },
  "date": "16.11.2026",
  "epoch_ms": 1763277309000,
  "hour": 1,
  "iso": "2026-11-16T01:31:09+01:00",
  "minute": 31,
  "second": 9,
  "time": "01:31:09",
  "timezone": "CET"
}
```

Odpověď `/api/time` má hlavičku `Cache-Control: no-store`, všechny odpovědi obsahují základní bezpečnostní hlavičky (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`).

## Časová zóna

Výchozí zóna je `Europe/Prague`. Změnit ji lze proměnnou prostředí `TZ`, například v `docker-compose.yml`:

```yaml
environment:
  TZ: Europe/London
```

Pokud zadaná zóna neexistuje, aplikace se vrátí k systémové zóně serveru. Balíček `tzdata` v `requirements.txt` zajišťuje, že databáze zón funguje i v minimálním obrazu `python:3.12-slim`.
