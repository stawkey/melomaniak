# Melomaniak

Strona internetowa mająca na celu ułatwić przeglądanie oraz wyszukiwanie repertuarów polskich filharmonii i oper.

Aktualnie wspierane są:

-   Filharmonia Krakowska
-   Opera Krakowska
-   Filharmonia Śląska
-   Opera Śląska

| ![image1](https://github.com/user-attachments/assets/d95b6111-ed7b-447a-8422-103ddd811352) | ![image2](https://github.com/user-attachments/assets/1009df52-b59c-4cf7-a44e-f4087dc4003c) |
|:---:|:---:|

## Uruchomienie projektu

### 1. Baza danych (PostgreSQL)

Najprościej przez Docker Compose:

```pwsh
docker compose up -d
```

### 2. Backend (.NET)

```pwsh
cd backend
dotnet restore
dotnet build
dotnet run
```

## 3. Frontend (React + Vite)

```pwsh
cd frontend
npm install
npm run dev
```

### 4. Scraper (Python)

```pwsh
cd scraper
pip install -r requirements.txt
python code/main.py
```

### 5. Dostęp do aplikacji

-   Frontend: http://localhost:5173
-   Backend API: http://localhost:5296
-   Baza danych: localhost:6543
