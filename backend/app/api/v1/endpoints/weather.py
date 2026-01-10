
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.weather_service import weather_service

router = APIRouter()

class WeatherRequest(BaseModel):
    lat: float
    lon: float

@router.post("/current")
async def get_weather(data: WeatherRequest):
    # Retrieve raw data from weather service 
    # (Note: The existing service returns a string formatted for LLM. 
    # We might want to adjust the service or parse it here, or just return the text for now)
    
    # Actually, let's modify the service or just fetch raw here for the frontend UI.
    # The frontend needs structured data (Temp, Condition).
    # Since I cannot easily modify the service logic in this single turn without risk, 
    # I will call the external API directly here or duplicate the logic for structured return.
    # For Hackathon speed, duplicating the raw fetch for structured return is safer 
    # than breaking the LLM dependency.
    
    import httpx
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": data.lat,
        "longitude": data.lon,
        "current": ["temperature_2m", "weather_code", "is_day"],
        "timezone": "auto"
    }
    
    async with httpx.AsyncClient() as client:
        r = await client.get(BASE_URL, params=params)
        raw = r.json()
        
    current = raw.get("current", {})
    temp = current.get("temperature_2m")
    code = current.get("weather_code")
    is_day = current.get("is_day")
    
    # Map code to string
    # WMO Weather interpretation codes (WW)
    # 0: Clear sky, 1, 2, 3: Mainly clear, partly cloudy, and overcast
    # 45, 48: Fog
    # 51, 53, 55: Drizzle
    # 61, 63, 65: Rain
    # ...
    
    condition = "Sunny"
    if code is not None:
        if code > 60: condition = "Rainy"
        elif code > 50: condition = "Drizzle"
        elif code > 3: condition = "Cloudy"
        elif code > 0: condition = "Partly Cloudy"
        elif code == 0: condition = "Clear"
        
    return {
        "temperature": temp,
        "condition": condition,
        "is_day": is_day
    }
