# Hodiny

Jednoduchá Flask aplikace, která na úvodní stránce vykreslí **čas serveru jako analogový ciferník** – vteřinovou, minutovou a hodinovou ručičku, číselník, datum, časovou zónu a digitální odečet. Ručičky se plynule dopočítávají v prohlížeči a každých 15 s se znovu synchronizují s backendem přes `/api/time`, takže zobrazený čas odpovídá serveru, ne hodinám návštěvníka.

## Struktura projektu

```
hodiny/
├── app.py               # Flask aplikace, výpočet úhlů ručiček, API
├── templates/
│   └── index.html       # ciferník vykreslený na serveru (Jinja)
├── static/
│   ├── style.css        # vzhled ciferníku a ručiček
│   └── clock.js         # plynulý pohyb ručiček + synchronizace se serverem
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
| GET    | `/`         | Úvodní stránka s analogovým ciferníkem                        |
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
