from backend.database import engine, Base
from backend.models import TitleOpinion, Tract, Requirement, CurativeTask

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
