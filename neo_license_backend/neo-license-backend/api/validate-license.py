import json

def handler(request, context):
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"})
        }

    data = request.json()
    license_key = data.get("license_key")

    if license_key in ["NEO-LITE-123", "NEO-PRO-456", "NEO-POCKET-789"]:
        return {
            "statusCode": 200,
            "body": json.dumps({"valid": True, "tier": license_key.split("-")[1].lower()})
        }
    else:
        return {
            "statusCode": 403,
            "body": json.dumps({"valid": False})
        }
