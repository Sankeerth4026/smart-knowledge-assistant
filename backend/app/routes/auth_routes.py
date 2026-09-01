from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.core.security import hash_password,verify_password,create_access_token,decode_access_token
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth_schema import RegisterRequest,RegisterResponse,LoginRequest,LoginResponse
from fastapi.security import OAuth2PasswordRequestForm

router=APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register",response_model=RegisterResponse)
def register_user(user_data:RegisterRequest,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(User.email==user_data.email).first()
    if existing_user:
      raise  HTTPException(
         status_code=status.HTTP_400_BAD_REQUEST,
         detail="User already exist"
      )
    new_user=User(
       name=user_data.name,
       email=user_data.email,
       password_hash=hash_password(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return{
      "message":"user has been successfully registered"
    }
@router.post("/login",response_model=LoginResponse)
def Login_user(user_data:LoginRequest,db:Session=Depends(get_db)):
   user=db.query(User).filter(User.email==user_data.email).first()
  
   if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="user doesnt exist"
   )
   if not verify_password(user_data.password,user.password_hash):
      raise HTTPException(
         status_code=status.HTTP_401_UNAUTHORIZED,
         detail="Either password or email is incorrect"
      )
   
   access_token=create_access_token(
       data={
          "sub":user.id,
          "email":user.email,
          "role":user.role
       }
    )
   return {
      "access_token":access_token,
      "token_type":"bearer",
      "user":{
         "id":user.id,
         "name":user.name,
         "email":user.email,
         "role":user.role,
         "plan":user.plan
      }
   }
@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }