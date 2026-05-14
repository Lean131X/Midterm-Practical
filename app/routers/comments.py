from sqlmodel import select
from fastapi import APIRouter, HTTPException, status

from db import SessionDep
from models import Comments, CommentsCreate, Videos


router = APIRouter(prefix="/videos/{video_id}/comments")


@router.get("/")
def get_comments(video_id: int, session: SessionDep):
    video = session.get(Videos, video_id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado"
        )

    query = select(Comments).where(Comments.video_id == video_id)
    return session.exec(query).all()


@router.post("/")
def create_comment(video_id: int, data: CommentsCreate, session: SessionDep):
    video = session.get(Videos, video_id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado"
        )

    nuevo = Comments(
        autor=data.autor,
        contenido=data.contenido,
        video_id=video_id
    )
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo