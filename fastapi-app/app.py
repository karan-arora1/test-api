from fastapi import FastAPI, Header, HTTPException

app = FastAPI()


@app.get("/profiles/{user_id}")
def get_profile(user_id: str):
    # Intentionally no auth
    return {"user_id": user_id, "name": "Bob"}


@app.get("/documents/{doc_id}")
def get_document(doc_id: str, x_api_key: str | None = Header(default=None)):
    # API-key only, no authorization scopes/ownership
    if not x_api_key:
        raise HTTPException(status_code=401, detail="missing api key")
    return {"doc_id": doc_id, "content": "Secret"}


@app.post("/orders/{order_id}/confirm")
def confirm_order(order_id: str):
    # Business step without auth/ownership
    return {"confirmed": True, "order_id": order_id}


@app.post("/checkout/{checkout_id}/finalize")
def finalize_checkout(checkout_id: str, x_api_key: str | None = Header(default=None)):
    # API-key only, no ownership check during finalization
    if not x_api_key:
        raise HTTPException(status_code=401, detail="missing api key")
    return {"finalized": True, "checkout_id": checkout_id}

