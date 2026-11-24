"""Základní testy Flask aplikace (stdlib unittest, bez externích závislostí)."""

import unittest
from datetime import datetime, timezone

from app import app, clock_angles, server_timezone, snapshot


class ClockTest(unittest.TestCase):
    def test_clock_angles_at_noon(self):
        self.assertEqual(clock_angles(datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)), {
            "hour": 0.0,
            "minute": 0.0,
            "second": 0.0,
        })

    def test_clock_angles_at_quarter_to_three(self):
        angles = clock_angles(datetime(2026, 1, 1, 2, 45, 30, tzinfo=timezone.utc))
        self.assertAlmostEqual(angles["hour"], 82.75, places=2)
        self.assertAlmostEqual(angles["minute"], 273.0, places=2)
        self.assertAlmostEqual(angles["second"], 180.0, places=2)

    def test_snapshot_fields(self):
        data = snapshot(datetime(2026, 11, 24, 15, 8, 9, tzinfo=timezone.utc))
        self.assertEqual(data["time"], "15:08:09")
        self.assertEqual(data["date"], "24.11.2026")
        self.assertEqual(data["hour"], 15)
        self.assertIn("angles", data)
        self.assertIsInstance(data["epoch_ms"], int)

    def test_invalid_timezone_falls_back_to_system(self):
        import app as module

        previous = module.os.environ.get("TZ")
        module.os.environ["TZ"] = "No/Such_Zone"
        try:
            self.assertIsInstance(server_timezone(), type(datetime.now().astimezone().tzinfo))
        finally:
            if previous is None:
                module.os.environ.pop("TZ", None)
            else:
                module.os.environ["TZ"] = previous


class RoutesTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_index_renders_game(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"VICE <em>CLOCK</em>", response.data)
        self.assertIn(b"btn-rebirth", response.data)
        self.assertIn(b"bootstrap", response.data)

    def test_api_time(self):
        response = self.client.get("/api/time")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        data = response.get_json()
        self.assertIn("epoch_ms", data)
        self.assertIn("angles", data)

    def test_healthz(self):
        response = self.client.get("/healthz")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "ok")
        self.assertGreaterEqual(data["uptime_s"], 0)
        self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")


if __name__ == "__main__":
    unittest.main()
