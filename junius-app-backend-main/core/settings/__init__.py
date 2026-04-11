from .base import *
from decouple import config

env_name = config("ENV_NAME")

if env_name == "prod":
    from .prod import *
elif env_name == "dev":
    from .dev import *
else:
    from .dev import *
