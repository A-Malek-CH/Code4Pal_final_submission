import logging
import sys
import os


sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from app.services.location_service import LocationService


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def test_real_location():
    service = LocationService()
    
    ip = "8.8.8.8"
    result = service.get_ip_location(ip)
    print("Result:", result)

if __name__ == "__main__":
    test_real_location()
