# GreenGuard Web App

Witamy w repozytorium GreenGuard Web App!

## Czym jest GreenGuard Web App?

GreenGuard Web App to frontend aplikacji webowej, która współpracuje z GreenGuard Server. Aplikacja umożliwia zarządzanie czujnikami roślin poprzez intuicyjny interfejs webowy. Dzięki tej aplikacji możesz w łatwy sposób monitorować stan swoich roślin, zarządzać czujnikami oraz śledzić odczyty w czasie rzeczywistym.

## Spis treści

1. [Czym jest GreenGuard Web App?](#czym-jest-greenguard-web-app)
2. [Wykorzystane technologie](#wykorzystane-technologie)
3. [Wymagania](#wymagania)
4. [Instalacja](#instalacja)
5. [Uruchamianie aplikacji](#uruchamianie-aplikacji)
6. [Skrypty dostępne w projekcie](#skrypty-dostępne-w-projekcie)
7. [Konfiguracja](#konfiguracja)
8. [Współpraca z backendem](#współpraca-z-backendem)
9. [Wkład w projekt](#wkład-w-projekt)
10. [Licencja](#licencja)

## Wykorzystane technologie

Aplikacja wykorzystuje następujące technologie:
- **Vite** - szybki bundler i serwer deweloperski
- **HTML5** - struktura aplikacji
- **CSS3** - stylowanie interfejsu
- **JavaScript (ES6+)** - logika aplikacji
- **npm** - zarządzanie pakietami

## Wymagania

Aby uruchomić projekt, potrzebujesz:
- **Node.js** (wersja 16 lub nowsza)
- **npm** (instalowany wraz z Node.js)
- Uruchomiony **GreenGuard Server** na porcie 9090 (produkcja) lub 9091 (development)

## Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone <url-repozytorium>
   cd greenguard-webapp
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

## Uruchamianie aplikacji

### Tryb deweloperski
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

### Tryb produkcyjny
```bash
npm run build
npm run preview
```

### Kompletne uruchomienie produkcyjne
```bash
npm run start
```

## Skrypty dostępne w projekcie

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchamia serwer deweloperski Vite |
| `npm run build` | Buduje aplikację do produkcji |
| `npm run preview` | Podgląd zbudowanej aplikacji |
| `npm run start` | Buduje i uruchamia aplikację w trybie produkcyjnym |
| `npm run deploy` | Instaluje zależności, buduje i uruchamia aplikację |
| `npm run clean` | Usuwa katalogi dist i node_modules |
| `npm run fresh-start` | Czyści projekt, instaluje zależności i uruchamia |

## Konfiguracja

### Zmienne środowiskowe

Utwórz plik `.env` w katalogu głównym projektu:

```env
# Tryb deweloperski
VITE_BACKEND_PORT=9091

# Tryb produkcyjny (domyślnie 9090)
VITE_BACKEND_PORT=9090
```

### Porty aplikacji

- **Development**: `http://localhost:3000`
- **Production preview**: `http://localhost:3000`

## Współpraca z backendem

Aplikacja komunikuje się z GreenGuard Server poprzez REST API. URL backendu jest automatycznie konfigurowany w `vite.config.js`:

```javascript
const env = loadEnv(mode, process.cwd(), '')
const backendPort = env.VITE_BACKEND_PORT || 9090
const backendUrl = `http://localhost:${backendPort}`
```

### Wymagany backend

Upewnij się, że GreenGuard Server jest uruchomiony przed rozpoczęciem pracy z aplikacją webową:
- **Development**: port 9091
- **Production**: port 9090

Dokumentacja API backendu dostępna jest pod adresem: `http://localhost:9090/swagger-ui/index.html`

## Struktura projektu

```
greenguard-webapp/
├── public/          # Pliki statyczne
├── src/             # Pliki źródłowe (HTML, CSS, JS)
├── dist/            # Zbudowana aplikacja (generowana)
├── package.json     # Konfiguracja npm i skrypty
├── vite.config.js   # Konfiguracja Vite
└── README.md        # Ten plik
```

## Wkład w projekt

Zachęcamy do współtworzenia projektu! W przypadku większych zmian, prosimy o wcześniejsze utworzenie issue w celu omówienia planowanych modyfikacji.



## Licencja

[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)

---

**Uwaga**: Ta aplikacja jest frontendem dla systemu GreenGuard i wymaga uruchomionego GreenGuard Server do pełnej funkcjonalności.