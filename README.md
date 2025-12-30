# Melomaniak

Strona internetowa mająca na celu ułatwienie przeglądania oraz wyszukiwania repertuarów polskich filharmonii i oper.

Aktualnie wspierane są:

-   Filharmonia Krakowska
-   Opera Krakowska
-   Filharmonia Śląska
-   Opera Śląska

| <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2e2ebb81-f6d3-4377-ac3e-c05e8fb7cee4" /> | <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/05adc806-5624-413a-8721-3b9e3a4c2009" /> |
|:---:|:---:|
| ![image1](https://github.com/user-attachments/assets/d95b6111-ed7b-447a-8422-103ddd811352) | ![image2](https://github.com/user-attachments/assets/1009df52-b59c-4cf7-a44e-f4087dc4003c) |

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
