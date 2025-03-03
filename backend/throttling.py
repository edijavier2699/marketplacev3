from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import Throttled

class CustomAnonRateThrottle(AnonRateThrottle):
    def wait(self):
        """
        Devuelve el tiempo que el cliente debe esperar antes de hacer otra solicitud.
        """
        wait_time = super().wait()
        if wait_time:
            # Puedes devolver un tiempo de espera o un mensaje personalizado
            raise Throttled(detail=f"Too many requests. Please try again in {int(wait_time)} seconds.")
        return wait_time