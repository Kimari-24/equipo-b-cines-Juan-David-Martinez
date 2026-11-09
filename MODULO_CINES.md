# Módulo Cines (Equipo B)

CRUD completo de cines: API en .NET y frontend en React + TypeScript, con selección de ubicación en mapa.

## Archivos

**Backend (`api_base/`)**
- `DTOs/CineCreacionDTO.cs`
- `Utilidades/CinesProfile.cs`
- `Controllers/CinesController.cs`

**Frontend (`frontend_base/src/features/cines/componentes/`)**
- `FormularioCine.tsx`: nombre, latitud y longitud (las coordenadas se llenan con un clic en el mapa)
- `IndiceCines.tsx`: tabla paginada con Editar y Borrar (con confirmación)
- `CrearCine.tsx`: POST
- `EditarCine.tsx`: GET por id, precarga el formulario y el marcador; luego PUT

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/cines?pagina=1&recordsPorPagina=10` | 200 + cabecera `cantidad-total-registros` |
| GET | `/api/cines/todos` | 200, lista sin paginar |
| GET | `/api/cines/{id}` | 200 / 404 |
| POST | `/api/cines` | 201 + `Location` / 400 |
| PUT | `/api/cines/{id}` | 204 / 404 / 400 |
| DELETE | `/api/cines/{id}` | 204 / 404 |

POST, PUT y DELETE invalidan la caché con la etiqueta `cines`.

## Validaciones (iguales en backend y frontend)

| Campo | Regla |
|---|---|
| Nombre | Requerido, máximo 75 caracteres, primera letra mayúscula |
| Latitud | Entre -90 y 90 |
| Longitud | Entre -180 y 180 |

## Decisiones a tener en cuenta

- `CinesProfile` solo mapea `CineCreacionDTO → Cine`. El mapeo `Cine → CineDTO` ya está en `AutoMapperProfiles.cs`, y repetirlo hace fallar el arranque (`DuplicateTypeMapConfigurationException`, AutoMapper 14).
- El módulo no modifica ningún archivo del proyecto base.

## Cómo probar

```bash
cd api_base
dotnet watch run --launch-profile https
```

```bash
cd frontend_base
npm run dev
```

En http://localhost:5173/cines:
1. Crea un cine: escribe un nombre, haz clic en el mapa y pulsa Enviar. Debe aparecer en la tabla.
2. Edítalo: el marcador debe estar en la ubicación guardada.
3. Bórralo: debe salir el modal de confirmación.
4. Escribe un nombre en minúscula: debe mostrar error y deshabilitar Enviar.

**Verificado:** todos los endpoints contra SQL Server (201, 204, 404, 400 con mensajes, paginación y caché). `tsc` y `eslint` sin errores.

## Problemas detectados en código compartido (fuera del módulo)

| Archivo | Problema |
|---|---|
| `src/hooks/useEntidades.ts` | No tiene `.catch`: si la API falla, el spinner gira para siempre en todos los índices. |
| `src/utilidades/extraerErrores.ts` | Lanza `TypeError` si la respuesta no trae `errors` (servidor caído o error 500), y no se muestra ningún mensaje. |
| `src/componentes/Mapa/Mapa.tsx` | El centro es fijo; al editar un cine lejano, el marcador queda fuera de la vista. |
