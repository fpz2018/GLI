from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum

class GLIType(str, Enum):
    BEWEEGKUUR = "Beweegkuur"
    COOL = "Cool" 
    SLIMMER = "Slimmer"

class GroupStatus(str, Enum):
    PLANNING = "In planning"
    OPEN = "Inschrijving open"
    BESCHIKBAAR = "Beschikbaar"
    VOL = "Vol"
    GESTART = "Gestart"
    AFGEROND = "Afgerond"
    GEANNULEERD = "Geannuleerd"

class GLIGroepBase(BaseModel):
    """Base model voor GLI groepen."""
    gli_aanbieder: str = Field(..., description="Naam van de GLI aanbieder")
    type_gli: GLIType = Field(..., description="Type GLI programma")
    startdatum_groep: date = Field(..., description="Startdatum van de groep")
    einddatum_groep: date = Field(..., description="Einddatum van de groep")
    groepnummer: str = Field(..., description="Uniek groepsnummer")
    status: GroupStatus = Field(..., description="Status van de groep")

class GLIGroepCreate(GLIGroepBase):
    """Model voor het aanmaken van een nieuwe GLI groep."""
    pass

class GLIGroepUpdate(BaseModel):
    """Model voor het updaten van een GLI groep."""
    gli_aanbieder: Optional[str] = None
    type_gli: Optional[GLIType] = None
    startdatum_groep: Optional[date] = None
    einddatum_groep: Optional[date] = None
    groepnummer: Optional[str] = None
    status: Optional[GroupStatus] = None

class GLIGroepResponse(GLIGroepBase):
    """Model voor GLI groep responses."""
    id: str = Field(..., description="Airtable record ID")
    created_time: str = Field(..., description="Record creation timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "recABC123",
                "gli_aanbieder": "Zorg4Zeist",
                "type_gli": "BeweegKuur",
                "startdatum_groep": "2024-03-01",
                "einddatum_groep": "2024-05-30",
                "groepnummer": "BK-2024-001",
                "status": "Inschrijving open",
                "created_time": "2024-01-15T10:30:00.000Z"
            }
        }

class GLIStatistics(BaseModel):
    """Statistieken voor GLI groepen."""
    total_groepen: int
    actieve_groepen: int
    geplande_groepen: int
    volle_groepen: int
    per_type: dict[str, int]
    per_aanbieder: dict[str, int]