FROM python:3.12-slim

WORKDIR /app

# Supaya Python nggak bikin .pyc dan log tidak di-buffer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 1. Install dependency dari requirements.txt
COPY backend/ .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy semua isi folder backend (manage.py, folder backend/, api/, dll)
COPY . .

# 3. (Opsional) collectstatic – aktifkan kalau STATIC_ROOT sudah di-set di settings.py
# RUN python manage.py collectstatic --noinput

# 4. Expose port dan jalankan Django pakai gunicorn
EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
