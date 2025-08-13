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

