from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
import logging

from airtable_service import get_airtable_service, AirtableService
from airtable_models import (
    GLIGroepResponse,
    GLIGroepCreate, 
    GLIGroepUpdate,
    GLIStatistics,
    GLIType,
    GroupStatus
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/gli-groepen",
    tags=["gli-groepen"],
    responses={
        404: {"description": "Niet gevonden"},
        503: {"description": "Service niet beschikbaar"}
    }
)

@router.get("/", response_model=List[GLIGroepResponse])
async def get_gli_groepen(
    gli_type: Optional[GLIType] = Query(None, description="Filter op GLI type"),
    status: Optional[GroupStatus] = Query(None, description="Filter op status"),
    aanbieder: Optional[str] = Query(None, description="Filter op aanbieder"),
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Haal alle GLI groepen op.
    
    Retourneert lijst van alle GLI groepen, optioneel gefilterd.
    """
    try:
        groepen = await service.get_all_groepen(
            gli_type=gli_type,
            status=status,
            aanbieder=aanbieder
        )
        
        logger.info(f"Retourneer {len(groepen)} GLI groepen")
        return groepen
        
    except Exception as e:
        logger.error(f"Fout bij ophalen GLI groepen: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan GLI groepen niet ophalen uit Airtable"
        )

@router.get("/actief", response_model=List[GLIGroepResponse])
async def get_actieve_groepen(
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Haal actieve GLI groepen op.
    
    Retourneert groepen die open zijn voor inschrijving of al gestart zijn.
    """
    try:
        groepen = await service.get_actieve_groepen()
        return groepen
    except Exception as e:
        logger.error(f"Fout bij ophalen actieve groepen: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan actieve groepen niet ophalen"
        )

@router.get("/type/{gli_type}", response_model=List[GLIGroepResponse])
async def get_groepen_by_type(
    gli_type: GLIType,
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Haal groepen op voor specifiek GLI type.
    
    Retourneert alle groepen van het opgegeven type (BeweegKuur, COOL, SLIMMER).
    """
    try:
        groepen = await service.get_groepen_by_type(gli_type)
        return groepen
    except Exception as e:
        logger.error(f"Fout bij ophalen groepen voor type {gli_type}: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Kan groepen voor {gli_type} niet ophalen"
        )

@router.get("/statistieken", response_model=GLIStatistics)
async def get_statistieken(
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Haal GLI groepen statistieken op.
    
    Retourneert overzicht met aantallen per type, aanbieder en status.
    """
    try:
        stats = await service.get_statistics()
        return stats
    except Exception as e:
        logger.error(f"Fout bij ophalen statistieken: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan statistieken niet ophalen"
        )

@router.get("/{groep_id}", response_model=GLIGroepResponse)
async def get_groep(
    groep_id: str,
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Haal specifieke GLI groep op via ID.
    
    Retourneert gedetailleerde informatie voor een enkele groep.
    """
    try:
        groep = await service.get_groep_by_id(groep_id)
        
        if not groep:
            raise HTTPException(
                status_code=404,
                detail=f"GLI groep {groep_id} niet gevonden"
            )
        
        return groep
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fout bij ophalen groep {groep_id}: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan GLI groep niet ophalen"
        )

@router.post("/", response_model=GLIGroepResponse)
async def create_groep(
    groep: GLIGroepCreate,
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Maak nieuwe GLI groep aan.
    
    Voegt een nieuwe groep toe aan Airtable met de opgegeven gegevens.
    """
    try:
        created_groep = await service.create_groep(groep)
        logger.info(f"Nieuwe GLI groep aangemaakt: {created_groep.groepnummer}")
        return created_groep
        
    except Exception as e:
        logger.error(f"Fout bij aanmaken GLI groep: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan GLI groep niet aanmaken"
        )

@router.put("/{groep_id}", response_model=GLIGroepResponse)
async def update_groep(
    groep_id: str,
    update: GLIGroepUpdate,
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Update bestaande GLI groep.
    
    Werkt specifieke velden bij van een bestaande groep.
    """
    try:
        updated_groep = await service.update_groep(groep_id, update)
        
        if not updated_groep:
            raise HTTPException(
                status_code=404,
                detail=f"GLI groep {groep_id} niet gevonden"
            )
        
        logger.info(f"GLI groep geüpdatet: {updated_groep.groepnummer}")
        return updated_groep
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fout bij updaten GLI groep {groep_id}: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan GLI groep niet updaten"
        )

@router.delete("/{groep_id}")
async def delete_groep(
    groep_id: str,
    service: AirtableService = Depends(get_airtable_service)
):
    """
    Verwijder GLI groep.
    
    Verwijdert een groep permanent uit Airtable.
    """
    try:
        # Check if group exists first
        groep = await service.get_groep_by_id(groep_id)
        if not groep:
            raise HTTPException(
                status_code=404,
                detail=f"GLI groep {groep_id} niet gevonden"
            )
        
        success = await service.delete_groep(groep_id)
        
        if not success:
            raise HTTPException(
                status_code=503,
                detail="Kan GLI groep niet verwijderen"
            )
        
        logger.info(f"GLI groep verwijderd: {groep_id}")
        return {"message": f"GLI groep {groep.groepnummer} succesvol verwijderd"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fout bij verwijderen GLI groep {groep_id}: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Kan GLI groep niet verwijderen"
        )