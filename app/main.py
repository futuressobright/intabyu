from fastapi import FastAPI, File, UploadFile, Form, Request
import shutil  # Import shutil for file operations
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/video")
async def video_get(request: Request):
    return templates.TemplateResponse("video.html", {"request": request, "question_text": ""})

@app.post("/video")
async def video_post(request: Request, question: str = Form(...)):
    return templates.TemplateResponse("video.html", {"request": request, "question_text": question})

@app.get("/weather")
async def weather_get(request: Request):
    return templates.TemplateResponse("weather.html", {"request": request, "zip_code": None})

@app.post("/weather")
async def weather_post(request: Request, zip_code: str = Form(...)):
    # Here, render a template or perform other actions based on zip_code
    return templates.TemplateResponse("weather.html", {"request": request, "zip_code": zip_code})

@app.post("/upload_video")
async def upload_video(video: UploadFile = File(...)):
    save_path = f"./uploaded_videos/{video.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    return {"filename": video.filename, "message": "Video uploaded successfully"}
