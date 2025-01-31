from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Configuración de la base de datos SQLite
DATABASE_URL = "sqlite:///login.db"

# Crear el motor de la base de datos
engine = create_engine(DATABASE_URL, echo=True)

# Crear una base declarativa
Base = declarative_base()

# Definir el modelo de usuario
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre_usuario = Column(String, unique=True, nullable=False)
    contraseña = Column(String, nullable=False)
    build_en_proceso = Column(String, default="")
    personajes = relationship("Personaje", back_populates="usuario")
    clase = Column(String, default="")

# Definir el modelo de personaje
class Personaje(Base):
    __tablename__ = "personajes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    Weapon1 = Column(String, default="")
    Weapon2 = Column(String, default="")
    Shield = Column(String, default="")
    Talisman = Column(String, default="")
    Helmet = Column(String, default="")
    Chest = Column(String, default="")
    Gauntlets = Column(String, default="")
    Legs = Column(String, default="")
    photo = Column(String, default="")  # Foto principal del personaje
    Weapon1Image = Column(String, default="")
    Weapon2Image = Column(String, default="")
    ShieldImage = Column(String, default="")
    TalismanImage = Column(String, default="")
    HelmetImage = Column(String, default="")
    ChestImage = Column(String, default="")
    GauntletsImage = Column(String, default="")
    LegsImage = Column(String, default="")
    user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="personajes")

# Crear todas las tablas en la base de datos
Base.metadata.create_all(engine)

# Crear una sesión para interactuar con la base de datos
Session = sessionmaker(bind=engine)
session = Session()

# Funciones para interactuar con la tabla personajes
def add_personaje(user_id, name, weapon1, weapon2, shield, talisman, helmet, chest, gauntlets, legs, photo):
    personaje = Personaje(
        user_id=user_id,
        name=name,
        Weapon1=weapon1,
        Weapon2=weapon2,
        Shield=shield,
        Talisman=talisman,
        Helmet=helmet,
        Chest=chest,
        Gauntlets=gauntlets,
        Legs=legs,
        photo=photo
    )
    session.add(personaje)
    session.commit()

def get_personajes_by_user(user_id):
    return session.query(Personaje).filter(Personaje.user_id == user_id).all()

def get_personaje_by_id(personaje_id):
    return session.query(Personaje).filter(Personaje.id == personaje_id).first()