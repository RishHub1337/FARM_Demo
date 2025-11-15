FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y gcc python3-dev && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock* /app/

RUN uv venv .venv && uv pip sync || true

COPY . /app/

EXPOSE 8000

CMD [ "uv", "run", "uvicorn", "main:app",  "--host", "0.0.0.0", "--port", "8000"]

