from pyairtable import Api
from pyairtable.formulas import match, AND, OR
from functools import lru_cache
from typing import Optional, List
import os
import logging
from datetime import datetime, timezone, date

from airtable_models import GLIGroepCreate, GLIGroepUpdate, GLIGroepResponse, GLIStatistics, GLIType, GroupStatus

logger = logging.getLogger(__name__)

class AirtableService:
    """Service voor interactie met Airtable GLI data."""
    
    def __init__(self):
        """Initialiseer Airtable service met configuratie."""
        self.access_token = os.environ.get('AIRTABLE_ACCESS_TOKEN')
        self.base_id = os.environ.get('AIRTABLE_BASE_ID') 
        self.gli_table_name = os.environ.get('AIRTABLE_GLI_TABLE', 'GLI Zeist')
        
        if not self.access_token or not self.base_id:
            raise ValueError("AIRTABLE_ACCESS_TOKEN en AIRTABLE_BASE_ID moeten zijn ingesteld")
        
        self.api = Api(self.access_token)
        self.base = self.api.base(self.base_id)
        self.gli_table = self.base.table(self.gli_table_name)
        
        logger.info(f"Airtable service geïnitialiseerd voor base: {self.base_id}")
    
    def _transform_record_to_model(self, record: dict) -> GLIGroepResponse:
        """Transform Airtable record naar GLI groep model."""
        fields = record.get("fields", {})
        
        # Parse date strings
        startdatum = fields.get("Startdatum groep")
        if startdatum and isinstance(startdatum, str):
            startdatum = datetime.fromisoformat(startdatum.replace('Z', '+00:00')).date()
        
        einddatum = fields.get("Einddatum groep") 
        if einddatum and isinstance(einddatum, str):
            einddatum = datetime.fromisoformat(einddatum.replace('Z', '+00:00')).date()
        
        return GLIGroepResponse(
            id=record["id"],
            gli_aanbieder=fields.get("GLI aanbieder", ""),
            type_gli=fields.get("Type GLI", "Beweegkuur"),
            startdatum_groep=startdatum,
            einddatum_groep=einddatum,  # Can be None
            groepnummer=str(fields.get("Groepnummer", "")),  # Convert to string
            status=fields.get("Status", "In planning"),
            created_time=record.get("createdTime", "")
        )
    
    def _transform_model_to_fields(self, groep: GLIGroepCreate) -> dict:
        """Transform GLI groep model naar Airtable fields."""
        return {
            "GLI aanbieder": groep.gli_aanbieder,
            "Type GLI": groep.type_gli.value,
            "Startdatum groep": groep.startdatum_groep.isoformat(),
            "Einddatum groep": groep.einddatum_groep.isoformat(),
            "Groepnummer": groep.groepnummer,
            "Status": groep.status.value
        }
    
    async def get_all_groepen(self, 
                              gli_type: Optional[GLIType] = None,
                              status: Optional[GroupStatus] = None,
                              aanbieder: Optional[str] = None) -> List[GLIGroepResponse]:
        """
        Haal alle GLI groepen op met optionele filters.
        
        Args:
            gli_type: Filter op GLI type
            status: Filter op status
            aanbieder: Filter op aanbieder
            
        Returns:
            Lijst van GLI groepen
        """
        try:
            # Build formula for filtering
            conditions = []
            if gli_type:
                conditions.append(f"{{Type GLI}}='{gli_type.value}'")
            if status:
                conditions.append(f"{{Status}}='{status.value}'")
            if aanbieder:
                conditions.append(f"{{GLI aanbieder}}='{aanbieder}'")
            
            formula = None
            if conditions:
                formula = f"AND({', '.join(conditions)})" if len(conditions) > 1 else conditions[0]
            
            records = self.gli_table.all(
                formula=formula,
                sort=["Startdatum groep"]
            )
            
            groepen = [self._transform_record_to_model(record) for record in records]
            logger.info(f"Opgehaald {len(groepen)} GLI groepen")
            return groepen
            
        except Exception as e:
            logger.error(f"Fout bij ophalen GLI groepen: {str(e)}")
            raise
    
    async def get_groep_by_id(self, groep_id: str) -> Optional[GLIGroepResponse]:
        """
        Haal specifieke GLI groep op via ID.
        
        Args:
            groep_id: Airtable record ID
            
        Returns:
            GLI groep of None
        """
        try:
            record = self.gli_table.get(groep_id)
            return self._transform_record_to_model(record)
        except Exception as e:
            logger.error(f"Fout bij ophalen groep {groep_id}: {str(e)}")
            return None
    
    async def create_groep(self, groep: GLIGroepCreate) -> GLIGroepResponse:
        """
        Maak nieuwe GLI groep aan.
        
        Args:
            groep: GLI groep data
            
        Returns:
            Aangemaakte GLI groep
        """
        try:
            fields = self._transform_model_to_fields(groep)
            record = self.gli_table.create(fields)
            
            created_groep = self._transform_record_to_model(record)
            logger.info(f"GLI groep aangemaakt: {created_groep.groepnummer}")
            return created_groep
            
        except Exception as e:
            logger.error(f"Fout bij aanmaken GLI groep: {str(e)}")
            raise
    
    async def update_groep(self, groep_id: str, update: GLIGroepUpdate) -> Optional[GLIGroepResponse]:
        """
        Update bestaande GLI groep.
        
        Args:
            groep_id: Airtable record ID
            update: Update data
            
        Returns:
            Geüpdatete GLI groep of None
        """
        try:
            # Build update fields, skip None values
            fields = {}
            if update.gli_aanbieder is not None:
                fields["GLI aanbieder"] = update.gli_aanbieder
            if update.type_gli is not None:
                fields["Type GLI"] = update.type_gli.value
            if update.startdatum_groep is not None:
                fields["Startdatum groep"] = update.startdatum_groep.isoformat()
            if update.einddatum_groep is not None:
                fields["Einddatum groep"] = update.einddatum_groep.isoformat()
            if update.groepnummer is not None:
                fields["Groepnummer"] = update.groepnummer
            if update.status is not None:
                fields["Status"] = update.status.value
            
            if not fields:
                logger.warning("Geen velden om te updaten")
                return await self.get_groep_by_id(groep_id)
            
            record = self.gli_table.update(groep_id, fields)
            updated_groep = self._transform_record_to_model(record)
            logger.info(f"GLI groep geüpdatet: {updated_groep.groepnummer}")
            return updated_groep
            
        except Exception as e:
            logger.error(f"Fout bij updaten GLI groep {groep_id}: {str(e)}")
            return None
    
    async def delete_groep(self, groep_id: str) -> bool:
        """
        Verwijder GLI groep.
        
        Args:
            groep_id: Airtable record ID
            
        Returns:
            True als succesvol verwijderd
        """
        try:
            self.gli_table.delete(groep_id)
            logger.info(f"GLI groep verwijderd: {groep_id}")
            return True
        except Exception as e:
            logger.error(f"Fout bij verwijderen GLI groep {groep_id}: {str(e)}")
            return False
    
    async def get_groepen_by_type(self, gli_type: GLIType) -> List[GLIGroepResponse]:
        """Haal groepen op voor specifiek GLI type."""
        return await self.get_all_groepen(gli_type=gli_type)
    
    async def get_actieve_groepen(self) -> List[GLIGroepResponse]:
        """Haal actieve groepen op (open voor inschrijving of gestart)."""
        try:
            formula = "OR({Status}='Inschrijving open', {Status}='Gestart')"
            records = self.gli_table.all(
                formula=formula,
                sort=["Startdatum groep"]
            )
            
            return [self._transform_record_to_model(record) for record in records]
        except Exception as e:
            logger.error(f"Fout bij ophalen actieve groepen: {str(e)}")
            raise
    
    async def get_statistics(self) -> GLIStatistics:
        """Genereer statistieken voor GLI groepen."""
        try:
            all_groepen = await self.get_all_groepen()
            
            total_groepen = len(all_groepen)
            actieve_groepen = len([g for g in all_groepen if g.status in [GroupStatus.OPEN, GroupStatus.GESTART]])
            geplande_groepen = len([g for g in all_groepen if g.status == GroupStatus.PLANNING])
            volle_groepen = len([g for g in all_groepen if g.status == GroupStatus.VOL])
            
            # Count per type
            per_type = {}
            for gli_type in GLIType:
                per_type[gli_type.value] = len([g for g in all_groepen if g.type_gli == gli_type])
            
            # Count per aanbieder
            per_aanbieder = {}
            for groep in all_groepen:
                if groep.gli_aanbieder in per_aanbieder:
                    per_aanbieder[groep.gli_aanbieder] += 1
                else:
                    per_aanbieder[groep.gli_aanbieder] = 1
            
            return GLIStatistics(
                total_groepen=total_groepen,
                actieve_groepen=actieve_groepen,
                geplande_groepen=geplande_groepen,
                volle_groepen=volle_groepen,
                per_type=per_type,
                per_aanbieder=per_aanbieder
            )
            
        except Exception as e:
            logger.error(f"Fout bij genereren statistieken: {str(e)}")
            raise

@lru_cache()
def get_airtable_service() -> AirtableService:
    """Krijg cached Airtable service instance."""
    return AirtableService()