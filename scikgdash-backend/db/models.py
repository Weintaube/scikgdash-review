# db/models.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Resource(Base):
    __tablename__ = 'resources'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=True)
    type = Column(String(40), nullable=True)
    url = Column(String(255), nullable=False, unique=True) #ensure unique URLs

    # Establishing a one-to-many relationship with Comment
    comments = relationship('Comment', back_populates='resource', cascade='all, delete-orphan')

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    typeRes = Column(String(40), nullable=True)
    resourceId = Column(Integer, ForeignKey('resources.id'))  # Foreign key to Resource
    uri = Column(String(100))
    typeComm = Column(String(40))
    description = Column(String(300), nullable=True)

    # Relationship to Resource
    resource = relationship('Resource', back_populates='comments')
