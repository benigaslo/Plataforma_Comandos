# 💻 ComandQuest | Plataforma Educativa de Comandos (Linux & Windows)

Plataforma interactiva gamificada estilo videojuego para el aprendizaje y entrenamiento práctico de comandos de consola tanto en **Linux (Bash)** como en **Windows (CMD / PowerShell)**, diseñada para el alumnado de **Informática (1º DAM, 1º DAW y 2º SMR - IES Benigaslo)**.

Desplegable de forma 100% gratuita y estática en **GitHub Pages**, respaldada por **Supabase** para el control de acceso, persistencia de calificaciones y panel docente.

---

## 🎮 Características Principales

- **Simulador de Terminal Dual:**
  - **Linux (Bash):** Simulación de entorno Ubuntu con prompt dinámico (`usuario@ies-benigaslo:~$ `) y comandos formativos (`ls`, `cd`, `pwd`, `touch`, `mkdir -p`, `cp`, `mv`, `rm -r`, `chmod`, `grep`, `wc`, etc.).
  - **Windows (CMD / PowerShell):** Simulación de entorno Windows con prompt oficial (`PS C:\Users\Alumno> `) y comandos de administración (`dir /a`, `mkdir`, `echo >`, `type`, `copy`, `move`, `ren`, `rmdir /s /q`, etc.).
- **Gamificación Estilo Videojuego:**
  - **Puntos de Experiencia (XP):** Ganancia de XP por cada reto resuelto y bonificación por acierto.
  - **Escalafón de 7 Rangos:** Desde *Novato de la Consola* hasta *Root / SYSTEM Master*.
  - **Sistema de Logros e Insignias (Badges):** Conquista de logros especiales (*Pingüino Aprendiz*, *Explorador de Redmond*, *Guardián de Permisos*, *Racha Imparable*).
  - **Efectos Sonoros Retro 8-bit:** Síntesis de audio arcade nativa en el navegador mediante Web Audio API (arpegios de éxito, fanfarria de subida de nivel, clicks y alarmas de error).
  - **Animación de Victoria:** Lluvia de confeti y modal de celebración al subir de rango.
- **Control y Seguimiento Docente:**
  - El profesor gestiona los accesos de los alumnos desde su panel en Supabase.
  - Panel de control docente integrado en la web para consultar en tiempo real:
    - Lista de alumnos matriculados y fecha de última actividad.
    - Nivel actual, XP acumulada y racha.
    - Porcentaje de avance en los retos.
    - Historial detallado de comandos intentados (detección de dudas comunes y errores).
    - **Exportación a CSV** para volcar notas a hojas de cálculo o plataformas educativas.

---

## 🛠️ Estructura del Repositorio

```
Plataforma_Comandos/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Despliegue continuo automático a GitHub Pages
├── supabase/
│   └── schema.sql                  # Script SQL con tablas, RLS, triggers y métricas
├── src/
│   ├── components/                 # Componentes React (Terminal, Navbar, Panel Docente, etc.)
│   ├── data/
│   │   ├── exercises.ts            # Currículo de retos extraídos de las actividades de DAM SINF
│   │   └── badges.ts               # Definición de logros, rangos y recompensas
│   ├── lib/
│   │   ├── sound.ts                # Sintetizador de audio Web Audio API
│   │   ├── terminalSimulator.ts    # Intérprete y evaluador de comandos
│   │   └── supabase.ts             # Cliente Supabase y fallback modo demo
│   ├── types/                      # Modelos TypeScript
│   ├── App.tsx                     # Orquestador principal
│   └── main.tsx                    # Punto de entrada Vite
├── vite.config.ts                  # Configuración con base '/Plataforma_Comandos/'
└── package.json
```

---

## 🚀 Puesta en Marcha y Conexión con Supabase

### 1. Configuración de la Base de Datos en Supabase
1. Entra en tu panel de Supabase: [https://supabase.com/dashboard/org/bkqxrzvldyrnxehnidex](https://supabase.com/dashboard/org/bkqxrzvldyrnxehnidex).
2. Entra en tu proyecto y abre la pestaña **SQL Editor**.
3. Copia y pega el contenido del archivo [`supabase/schema.sql`](supabase/schema.sql) y pulsa en **Run**.
   * Esto creará las tablas `profiles` y `submissions`, configurará la seguridad (Row Level Security) y el trigger que sincroniza los alumnos automáticamente.

### 2. Creación de Alumnos por el Docente
1. En Supabase, ve a **Authentication → Users**.
2. Pulsa en **Add user → Create user**.
3. Introduce el correo corporativo del alumno (ej: `alumno01@iesbenigaslo.es`) y una contraseña temporal.
4. El trigger de la base de datos le asignará automáticamente el rol de alumno. (Las cuentas que contengan tu correo o nombre tendrán asignado rol de `teacher`).

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz copiando el `.env.example`:
```bash
cp .env.example .env
```
Introduce la URL de tu proyecto y la Anon Key que encontrarás en **Project Settings → API**.

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor local de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 🌐 Publicación en GitHub Pages

1. Sube este repositorio a tu cuenta de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: plataforma educativa de comandos con gamificación y soporte docente"
   git branch -M main
   git remote add origin https://github.com/gasensios/Plataforma_Comandos.git
   git push -u origin main
   ```
2. En GitHub, entra en el repositorio `Plataforma_Comandos` → **Settings** → **Pages**.
3. En la sección **Build and deployment**, bajo **Source**, selecciona **GitHub Actions**.
4. ¡Listo! El workflow `.github/workflows/deploy.yml` compilará la aplicación y la publicará automáticamente en:
   **`https://gasensios.github.io/Plataforma_Comandos/`**

---

*Desarrollado para el IES Benigaslo - Departamento de Informática y Comunicaciones.*
