import json
from http.server import BaseHTTPRequestHandler
import os

# Mock Stripe Product IDs (from your setup)
VALID_LICENSES = {
    "prod_S4naIX9iwTGOc5": "Neo Pocket",
    "prod_S4naz1O2dtvi7u": "Neo Lite",
    "prod_S4nZcs1YLEdGyR": "Neo Pro"
}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            from urllib.parse import urlparse, parse_qs
            query = parse_qs(urlparse(self.path).query)
            license_key = query.get("license", [""])[0]

            if license_key in VALID_LICENSES:
                product = VALID_LICENSES[license_key]
                response = { "status": "valid", "edition": product }
                self.send_response(200)
            else:
                response = { "status": "invalid" }
                self.send_response(403)

            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({ "error": str(e) }).encode())
