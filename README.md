# 🖥️ Lashbot Admin — Panel de Control

> Panel de administración web para el bot de WhatsApp **Lashbot** del salón **Lash Angels** (Barcelona).

La dueña del salón puede gestionar todo desde el navegador, sin tocar código ni la terminal.

---

## ✨ ¿Qué puede hacer la dueña desde aquí?

| Sección | Funcionalidad |
|---|---|
| 📅 **Disponibilidad** | Agregar y eliminar horarios disponibles para que el bot los ofrezca a los clientes |
| 👩 **Clientes** | Ver todos los clientes registrados, cuántas visitas tienen y leer el historial completo de su conversación con el bot |

---

## 🔗 Relación con el bot

Este panel se conecta al backend de **Lashbot** (API REST). El bot de WhatsApp y el panel comparten la misma base de datos:

```
WhatsApp ──→ Lashbot (bot Node.js) ──→ API backend ──←── Lashbot Admin (este panel)
```

- Los **horarios** que la dueña carga aquí son los que el bot ofrece a los clientes.
- Los **clientes y conversaciones** que ve aquí los genera el bot automáticamente al recibir mensajes.

---

## 🛠️ Stack

| Componente | Tecnología |
|---|---|
| Frontend | React 19 + Vite |
| Navegación | React Router DOM v7 |
| Auth | JWT en `localStorage` |
| API | Fetch contra el backend de Lashbot |

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=https://tu-backend.com
```

---

## 🚀 Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Vista previa del build
npm run lint      # Verificar errores de lint
```

---

## 📁 Estructura

```
src/
├── api/client.js          ← wrapper de fetch autenticado (usar siempre este)
├── components/
│   ├── Navbar.jsx         ← navegación + cerrar sesión
│   └── PrivateRoute.jsx   ← protección de rutas por token
└── pages/
    ├── Login.jsx          ← inicio de sesión
    ├── Availability.jsx   ← gestión de horarios
    └── Clients.jsx        ← listado de clientes y conversaciones
```
