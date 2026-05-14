from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship


class Videos(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    descripcion: str
    source: str
    miniatura: str
    categoria: str
    es_publico: bool = True

    comentarios: list["Comments"] = Relationship(back_populates="video")


class VideosCreate(SQLModel):
    titulo: str
    descripcion: str
    source: str
    miniatura: str
    categoria: str
    es_publico: bool = True


class Comments(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    autor: str
    contenido: str
    fecha: datetime = Field(default_factory=datetime.now)
    video_id: int = Field(foreign_key="videos.id")

    video: Videos | None = Relationship(back_populates="comentarios")


class CommentsCreate(SQLModel):
    autor: str
    contenido: str