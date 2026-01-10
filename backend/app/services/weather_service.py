import httpx
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    async def get_current_weather(self, lat: float, lon: float):
        """
        Fetches current weather data for a given location using Open-Meteo API.
        No API Key required.
        """
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["temperature_2m", "relative_humidity_2m", "is_day", "precipitation", "rain", "weather_code", "wind_speed_10m"],
            "timezone": "auto"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()
                
                # Format the data into a readable string for the LLM
                current = data.get("current", {})
                units = data.get("current_units", {})
                
                weather_desc = f"""
                Temperature: {current.get('temperature_2m')} {units.get('temperature_2m')}
                Humidity: {current.get('relative_humidity_2m')} {units.get('relative_humidity_2m')}
                Wind Speed: {current.get('wind_speed_10m')} {units.get('wind_speed_10m')}
                Precipitation: {current.get('precipitation')} {units.get('precipitation')}
                """
                return weather_desc.strip()
        except Exception as e:
            logger.error(f"Failed to fetch weather: {e}")
            return "Weather data unavailable (Service Error)"

weather_service = WeatherService()
