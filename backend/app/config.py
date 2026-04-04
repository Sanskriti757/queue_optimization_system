# ye file application ke configuration ke liye hai, jisme hum pydantic ka use karenge environment variables ko read karne ke liye. Humne yaha pe ek Settings class banaya hai jo BaseSettings se inherit karti hai, aur usme humne DB_CONNECTION variable define kiya hai, jise hum apne database connection string ke liye use karenge. Humne model_config me env_file specify kiya hai, jisse pydantic .env file se environment variables ko read kar sake. Finally, humne settings ka ek instance create kiya hai, jise hum apne application ke kisi bhi part me import karke use kar sakte hain.

from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

    DB_CONNECTION: str
    SECRET_KEY: str
    ALGORITHM: str
    EXP_TIME: int


settings = Settings()