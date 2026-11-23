"""Vice Clock – analogové hodiny se serverovým časem ve stylu GTA VI."""

from __future__ import annotations

import os
from datetime import datetime, tzinfo
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from flask import Flask, jsonify, render_template

app = Flask(__name__)

DEFAULT_TZ = "Europe/Prague"


def server_timezone() -> tzinfo:
    """Vrátí časovou zónu serveru, přenastavitelnou proměnnou TZ."""
    name = os.environ.get("TZ", DEFAULT_TZ).strip() or DEFAULT_TZ
    try:
        return ZoneInfo(name)
    except (ZoneInfoNotFoundError, ValueError):
        return datetime.now().astimezone().tzinfo or ZoneInfo("UTC")


def now() -> datetime:
    return datetime.now(server_timezone())


def clock_angles(moment: datetime) -> dict[str, float]:
    """Úhly ručiček ve stupních, 0° = dvanáctka, po směru hodin."""
    seconds = moment.second + moment.microsecond / 1_000_000
    minutes = moment.minute + seconds / 60
    hours = moment.hour % 12 + minutes / 60
    return {
        "hour": round(hours * 30, 3),
        "minute": round(minutes * 6, 3),
        "second": round(seconds * 6, 3),
    }


def snapshot(moment: datetime) -> dict[str, object]:
    return {
        "iso": moment.isoformat(timespec="seconds"),
        "epoch_ms": int(moment.timestamp() * 1000),
        "hour": moment.hour,
        "minute": moment.minute,
        "second": moment.second,
        "date": moment.strftime("%d.%m.%Y"),
        "timezone": moment.tzname() or "local",
        "angles": clock_angles(moment),
    }


@app.get("/")
def index():
    return render_template("index.html", state=snapshot(now()))


@app.get("/api/time")
def api_time():
    return jsonify(snapshot(now()))


@app.get("/healthz")
def healthz():
    return jsonify(status="ok")
