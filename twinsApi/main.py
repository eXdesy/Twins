import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import auth_routes
from routes.user import user_routes
from database.database import setup_db

async def lifespan(app: FastAPI):
    setup_db()
    yield
    print("Server stopped")

app = FastAPI(lifespan=lifespan)

app.include_router(auth_routes, prefix="/auth")
app.include_router(user_routes, prefix="/user")
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"], 
)

@app.get("/")
def main():
  return RedirectResponse(url="/docs/")

if __name__ == "__main__":
  uvicorn.run(app, host="127.0.0.1", port=4200)
