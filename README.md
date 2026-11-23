# Vice Clock (GTA VI)

Flask aplikace s **analogovými hodinami ve stylu Vice City**. Ručičky ukazují čas serveru a plynule se dopočítávají v prohlížeči; každých 15 s se znovu synchronizují přes `/api/time`. Kolem hodin propadají bankovky – hráč je sbírá, získává GTA$ a v obchodě si kupuje vylepšení vzhledu hodin a rozhraní.

## Hra

- **Peníze:** bankovky v hodnotách 50 / 100 / 500 / 1000 GTA$ se objevují samy od sebe (~každé 2–6 s) nebo po stisku „Shodit peníze" (12 s cooldown). Po kliknutí se peníze připíšou na účet. Bankovka zmizí, pokud ji nechytíte do ~9 s.
- **Obchod (`B`):** čtyři záložky – ciferník, ručičky, rozhraní a bonusy. Zakoupené předměty lze nasadit/zase vyměnit; efekty lze vypnout. Bonusy (Money Magnet, Double Dip) se po koupi aktivují trvale.
- **Vzhled:** 4 ciferníky, 3 sady ručiček, 3 skiny HUD a 2 obrazovkové efekty. Každá změna se okamžitě projeví na hodinách i v rozhraní.
- **Ukládání:** peníze, vlastněné předměty, nasazené vylepšení a stav zvuku se ukládají do `localStorage` prohlížeče pod prefixem `gtaclock.`. Žádný účet ani serverová databáze není potřeba.
- **Ovládání:** `mezerník` shodí peníze, `B` otevře obchod, `M` přepne zvuk, `Esc` zavře obchod. Kliknutím na bankovku ji seberete.

## Struktura projektu

```
hodiny/
├── app.py               # Flask aplikace, výpočet úhlů ručiček, API
├── templates/
│   └── index.html       # HUD, ciferník, vrstva peněz a obchod (Jinja)
├── static/
│   ├── style.css        # Vice City vizuál, varianty vzhledu, animace
│   └── clock.js         # čas, spawn peněz, obchod, uložiště, zvuky
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

## Koncové body

| Metoda | Cesta       | Popis                                                        |
| ------ | ----------- | ------------------------------------------------------------ |
| GET    | `/`         | Úvodní stránka s hodinami, penězi a obchodem                  |
| GET    | `/api/time` | Čas serveru v JSON: `iso`, `epoch_ms`, `hour`, `minute`, `second`, `date`, `timezone`, `angles` |
| GET    | `/healthz`  | Kontrola běhu, vrací `{"status": "ok"}`                       |

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
  "timezone": "CET"
}
```

## Časová zóna

Výchozí zóna je `Europe/Prague`. Změnit ji lze proměnnou prostředí `TZ`, například v `docker-compose.yml`:

```yaml
environment:
  TZ: Europe/London
```

Pokud zadaná zóna neexistuje, aplikace se vrátí k systémové zóně serveru. Balíček `tzdata` v `requirements.txt` zajišťuje, že databáze zón funguje i v minimálním obrazu `python:3.12-slim`.
