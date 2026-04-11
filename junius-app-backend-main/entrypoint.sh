#!/bin/sh

export DJANGO_SUPERUSER_PASSWORD=Rr123456
export DJANGO_SUPERUSER_EMAIL=rkarabinar@gmail.com


python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput
python3 manage.py createsuperuser \
        --noinput \
        --email $DJANGO_SUPERUSER_EMAIL 

exec gunicorn core.wsgi \
        --graceful-timeout 90  --timeout 120 \
        --workers 3 --threads 4 \
        --max-requests 400 \
        --max-requests-jitter 40 \
        --preload \
        --log-file - \
        --capture-output --enable-stdio-inheritance \
        -b 0.0.0.0:8000

exec "$@"
