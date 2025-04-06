def handler(request, response):
    if request.method != "POST":
        return response.status(405).send("Method Not Allowed")

    try:
        payload = request.body
        print("✅ Webhook received:", payload)
        return response.status(200).json({ "status": "success" })
    except Exception as e:
        print("❌ Webhook error:", str(e))
        return response.status(500).json({ "error": "Internal Server Error" })
