#!/usr/bin/env sh

pip install -r requirements.txt
python manage.py makemigratons --noinput
python manage.py migrate --noinput  
python manage.py collectstatic --noinput  
