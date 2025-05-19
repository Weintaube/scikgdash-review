from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from dotenv import load_dotenv

from db.config import SessionLocal, engine
from db.models import Base, Resource as ResourceModel, Comment as CommentModel
from schemas import ResourceBase, CommentBase

#from matomo_utils import process_data

app = FastAPI(root_path='/curation-dashboard/api') #for deployment, root path
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

load_dotenv()
DATABASE_URL =  os.environ['DB_URL']

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
# DATA_DIR = os.path.join(BASE_DIR, "data")
# os.makedirs(DATA_DIR, exist_ok=True)
# DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'CommentDatabase.db')}"

# Create the database tables only when db does not exist
if not os.path.exists(DATABASE_URL):
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#check if resource already exists, get ID returned
@app.get("/resources/check", response_model=ResourceBase)
def check_if_resource_exists(url: str, db: Session = Depends(get_db)):
    resource = db.query(ResourceModel).filter(ResourceModel.url == url).first()
    if resource:
        return resource
    else:
        raise HTTPException(status_code=404, detail="Resource not found")

#get all comments for a resource
@app.get("/resources/{resource_id}/comments", response_model=List[CommentBase])
def get_comments_for_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(ResourceModel).filter(ResourceModel.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource.comments

#adding a new resource
@app.post("/resources", response_model=ResourceBase)
async def create_resource(request: Request, db: Session = Depends(get_db)):
    content = await request.json()
    url = content.get('url')
    typeOfRes = content.get('type')
    title = content.get('title')
    
    # Check if the resource already exists
    existing_resource = db.query(ResourceModel).filter(ResourceModel.url == url).first()
    if existing_resource:
        raise HTTPException(status_code=400, detail="Resource with this URL already exists")
    
    # Create a new resource if it doesn't exist
    resource = ResourceModel(type=typeOfRes, url=url, title=title)
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource

#post a new comment for an existing resource
@app.post("/resources/{resource_id}/comments", response_model=CommentBase)
async def create_comment_for_resource(resource_id: int, request: Request, db: Session = Depends(get_db)):
    # Check if the resource exists
    resource = db.query(ResourceModel).filter(ResourceModel.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Create a new comment
    content = await request.json()
    print("Comment creation content", content)
    comment = CommentModel(
        typeRes=content.get('typeRes'),
        resourceId=resource_id,
        uri=content.get('uri'),
        typeComm=content.get('typeComm'),
        description=content.get('description')
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

#get all resources with their corresponding comments
@app.get("/resources-with-comments", response_model=List[ResourceBase])
def get_resources_with_comments(db: Session = Depends(get_db)):
    # Query all resources with their comments
    resources = db.query(ResourceModel).all()
    return resources

#Endpoint to receive visitor data, process it, and return clustering and word cloud data.
'''
@app.post("/matomo-clustering")
async def analyze_visitor_data(request: Request):
    try:
        visitor_data = await request.json()
        result = process_data(visitor_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
'''