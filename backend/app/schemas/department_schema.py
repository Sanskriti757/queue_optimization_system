from pydantic import BaseModel

class DepartmentSchema(BaseModel):
    name: str
    code: str

class DepartmentResponseSchema(BaseModel):
    department_id: int
    name: str
    model_config = {
        "from_attributes": True
    }