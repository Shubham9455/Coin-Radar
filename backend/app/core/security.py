from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import get_settings

settings = get_settings()

SECRET_KEY = settings.SECRET_KEY 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)



'''
JWT header.payload.signature
header = {
    "alg": "HS256",
    "typ": "JWT"
}
## header is base64url encoded to form the first part of the JWT.

## payload: it contains claims, three types of claims: registered, public, and private claims.
- top 3 registered claims are: iss, sub, exp
- public claims are defined by the user
- private claims are custom claims created to share information between parties that agree on using them
## This is also base64url encoded to form the second part of the JWT.
payload = {
    ## 3 standard registered claims
    "iss": "your_issuer",
    "sub": "user_identifier",
    "exp": expiration_time,
    ## public claims
    ## private claims
}
SIGNATURE:
## To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.
signature = HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret
)
token = base64UrlEncode(header) + "." + base64UrlEncode(payload) + "." + signature
'''

def create_access_token(data: dict, expires_delta: timedelta = None):
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {
        "sub": data.get("email"),
        "exp": expire,
        "role": data.get("role")
    }

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
