from datetime import datetime, timedelta
from typing import Any, Dict, Optional
import time

class SimpleCache:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimpleCache, cls).__new__(cls)
            cls._instance._cache: Dict[str, Dict[str, Any]] = {}
        return cls._instance

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            item = self._cache[key]
            if item["expires_at"] > time.time():
                return item["value"]
            else:
                del self._cache[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        self._cache[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds
        }

    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        self._cache = {}

cache = SimpleCache()
