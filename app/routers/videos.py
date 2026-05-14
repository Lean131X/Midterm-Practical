import random
from sqlmodel import select
from fastapi import APIRouter, HTTPException, status

from db import SessionDep
from models import Videos, VideosCreate


router = APIRouter(prefix="/videos")


@router.get("/")
def get_videos(session: SessionDep, categoria: str | None = None):
    query = select(Videos)
    if categoria:
        query = query.where(Videos.categoria == categoria)
    return session.exec(query).all()


@router.get("/categorias")
def get_categorias(session: SessionDep):
    videos = session.exec(select(Videos)).all()
    cats = list(set([v.categoria for v in videos]))
    return cats


@router.get("/{id}")
def get_video_by_id(id: int, session: SessionDep):
    video_db = session.get(Videos, id)
    if not video_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado"
        )
    return video_db


@router.get("/{id}/recomendaciones")
def get_recomendaciones(id: int, session: SessionDep):
    video = session.get(Videos, id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado"
        )

    query = select(Videos).where(
        Videos.categoria == video.categoria,
        Videos.id != id
    )
    relacionados = session.exec(query).all()
    random.shuffle(relacionados)
    return relacionados[:10]


@router.post("/")
def create_video(video_data: VideosCreate, session: SessionDep):
    video = Videos.model_validate(video_data.model_dump())
    session.add(video)
    session.commit()
    session.refresh(video)
    return video