# db/__init__.py

from .config import engine
from .models import Base

# Create tables
Base.metadata.create_all(bind=engine)
