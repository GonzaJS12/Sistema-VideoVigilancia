# SIV IA - App móvil

Cliente móvil del **Sistema de Videovigilancia Inteligente**: recibe alertas de detección
(armas y objetos peligrosos) en tiempo real, muestra el video de las cámaras y permite revisar el
historial de eventos con su evidencia. Consume el backend (FastAPI) y no contiene lógica de visión
artificial.

## Stack

- React Native + Expo (SDK 58) con **Expo Router**
- TypeScript (modo estricto)
- NativeWind 4 (Tailwind CSS 3) con tema oscuro y claro
- `expo-video`, `expo-linear-gradient`, `expo-secure-store`
- Zustand y TanStack Query (reservados para la integración con el backend)

## Requisitos

- Node.js 20 o superior
- Expo Go en el teléfono, o un emulador Android/iOS

## Cómo ejecutarlo

```bash
cd app-movil
npm install
npx expo start
```

Escanea el QR con Expo Go. Comandos útiles:

```bash
npx tsc --noEmit   # verificación de tipos
npx expo lint      # lint
```

## Estructura

```
app-movil/
├── src/
│   ├── app/            # Rutas (Expo Router): login, (tabs)/home, monitoring, alerts, history, profile
│   ├── components/     # ui/, layout/, alerts/, cameras/, history/, home/, profile/
│   ├── constants/      # theme.ts (paleta oscura y clara)
│   ├── mocks/          # Datos de prueba (se reemplazan por la API)
│   ├── types/          # Modelos: Alert, Camera, User, eventos de WebSocket
│   └── utils/          # Helpers de formato
├── assets/
├── tailwind.config.js
└── app.json
docs/
└── diseno/             # Capturas de Figma usadas como referencia de la UI
```

## Estado del proyecto

| Pantalla | Estado |
|---|---|
| Login, Inicio, Monitoreo, Alertas, Detalle de alerta, Historial, Perfil | Maquetadas con datos de prueba |
| Autenticación, API REST, WebSocket de alertas, video en vivo | Pendiente (requiere backend) |

## Paleta

| Color | Hex |
|---|---|
| Primario | `#00D68F` |
| Acento | `#00B4D8` |
| Texto secundario | `#64748B` |
| Fondo (oscuro) | `#0B0F17` |
