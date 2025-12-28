from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from .database import Base

class Severity(str, enum.Enum):
    FATAL = "FATAL"
    ADVISORY = "ADVISORY"
    UNKNOWN = "UNKNOWN"

class RequirementStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    CURED = "CURED"
    WAIVED = "WAIVED"

class TitleOpinion(Base):
    __tablename__ = "title_opinions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    upload_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    requirements = relationship("Requirement", back_populates="title_opinion", cascade="all, delete-orphan")
    tracts = relationship("Tract", back_populates="title_opinion", cascade="all, delete-orphan")

class Tract(Base):
    __tablename__ = "tracts"

    id = Column(Integer, primary_key=True, index=True)
    title_opinion_id = Column(Integer, ForeignKey("title_opinions.id"))
    description = Column(Text, nullable=False)

    title_opinion = relationship("TitleOpinion", back_populates="tracts")

class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Integer, primary_key=True, index=True)
    title_opinion_id = Column(Integer, ForeignKey("title_opinions.id"))
    description = Column(Text, nullable=False)
    severity = Column(String, default=Severity.UNKNOWN.value) # Storing enum as string
    status = Column(String, default=RequirementStatus.OPEN.value)
    page_reference = Column(Integer, nullable=True)

    title_opinion = relationship("TitleOpinion", back_populates="requirements")
    curative_task = relationship("CurativeTask", uselist=False, back_populates="requirement", cascade="all, delete-orphan")

class CurativeTask(Base):
    __tablename__ = "curative_tasks"

    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("requirements.id"), unique=True)
    assignee = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    requirement = relationship("Requirement", back_populates="curative_task")
