# Plan para migrar `web_bd` (Next.js 16 + JSON) a API REST con Spring Boot 3 + Java 21

> Objetivo: crear un backend desacoplado en **Spring Boot 3.4.x / Java 21** que exponga una API REST con los mismos datos/operaciones que hoy usa la web, para migrar progresivamente `db/*.json` a una BD y poder añadir un futuro panel de administración. Todo pensado para que lo implemente otro agente sin ambigüedad.

## 1) Estado actual a cubrir

El frontend consume estos módulos y rutas:

| Fuente | Uso |
|---|---|
| `db/machines.json`, `db/games.json` | Colección hardware/software, fichas `[id]`, filtros/orden. |
| `db/articles.json` | Artículos, fichas `[id]`, relación con juegos/máquinas. |
| `db/samaruc.json` | Página `/samaruc`. |
| `db/developed.json` | Página `/desarrollos`. |
| `db/about.json` | `/quienes-somos` + home. |
| `db/serials.json` | API legacy `/api/serials`, relación con máquinas. |
| `db/videos.json` | `/videos`, API `/api/videos`. |
| `db/gameboy/*` (`units.json`, `serial-ranges.json`, `romset.json`, `images.json`, `counts.json`) | Base de datos Game Boy (buscador de placa, romset, unidades verificadas). |
| `db/taller.json` | Página `/taller`. |
| `app/api/*` | Endpoints REST existentes (`machines`, `games`, `articles`, `developed`, `serials`, `videos`, `gameboy/serials`, `gameboy/romset`). |
| `app/lib/search.ts`, `app/lib/data.ts`, `app/lib/gameboy.ts`, `app/lib/collection.ts` | Lógica a replicar/reutilizar vía API. |

## 2) Tecnologías propuestas

| Tech | Motivo |
|---|---|
| **Java 21** | LTS, moderno y compatible. |
| **Spring Boot 3.4.x** | Web, Validation, Data JPA, Actuator. |
| **Spring Data JPA + Hibernate** | ORM. |
| **PostgreSQL 16** | BD relacional. Para dev también vale H2 (opcional). |
| **Flyway** | Migraciones versionadas. |
| **MapStruct** | Mapeo Entity<->DTO. |
| **Lombok** | Reduce boilerplate (usar con cuidado). |
| **springdoc-openapi-starter-webmvc-ui** | Swagger UI `/swagger-ui.html`. |
| **Docker / docker-compose** | Levantar Postgres local. |

## 3) Estructura del proyecto

Crear en un repo separado, p.ej. `retrocueva-api/`:

```text
retrocueva-api/
├── build.gradle (o pom.xml)
├── docker-compose.yml
├── src/main/java/com/retrocueva/api
│   ├── config/        # CORS, Jackson, OpenAPI
│   ├── controller/    # REST controllers
│   ├── dto/           # Request/Response DTOs
│   ├── entity/        # JPA entities
│   ├── exception/     # Handler + ApiError
│   ├── mapper/        # MapStruct mappers
│   ├── repository/    # Spring Data repos
│   ├── seed/          # DataLoader/CommandLineRunner desde JSON
│   ├── service/       # Lógica de negocio
│   └── util/          # helpers
└── src/main/resources
    ├── application.yml
    ├── application-dev.yml
    ├── application-prod.yml
    ├── db/migration/  # Flyway V*.sql
    └── seed/          # Copia de los JSON originales
```

## 4) Modelo de datos (JPA)

### Core
| Entity | Campos clave | Notas |
|---|---|---|
| `Machine` | `id`, `name`, `manufacturer`, `year`, `cpu`, `ram`, `storage`, `description`, `image`, `serial`, `condition`, `acquired`, `location`, `notes`, `platforms (ElementCollection)` | Coincide con `db/machines.json`. |
| `Game` | `id`, `title`, `platform`, `year`, `genre`, `publisher`, `region`, `code`, `description`, `image`, `condition`, `acquired`, `location`, `notes` | Fichas de colección. |
| `Article` | `id`, `title`, `magazine`, `issue`, `year`, `summary`, `link`, `magazineUrl`, `magazineLabel`, `author`, `cover`, `lead`, `credits`, `instagram` | Artículos. |
| `ArticleSection` | `id`, `article_id`, `heading`, `sortOrder` | Secciones. |
| `ArticleBlock` | `id`, `section_id`, `kind (P\|UL\|IMG)`, `text`, `items (json/text)`, `src`, `alt`, `caption`, `width`, `height`, `sortOrder` | Bloques flexibles. |
| `DevelopedGame` | `id`, `title`, `platform`, `year`, `language`, `tools`, `description`, `link` | `/desarrollos`. |
| `Project` | `id` (único `samaruc`), `name`, `title`, `lead`, `author`, `year`, `version`, `license`, `logo`, `link`, `platforms`, `stack` | Samaruc. |
| `ProjectSection`/`ProjectBlock` | Igual estructura flexible que artículos. | Reutilizar diseño. |
| `About` | `id`, `intro (json)`, `members (json)`, `highlights (json)` | Singleton o fila única. |
| `Serial` | `id`, `serial`, `machine`, `pattern`, `source`, `notes`, `parts (json)` | `db/serials.json`. |
| `Video` | `id` (string), `title`, `channel`, `duration` | `/videos`. |
| `TallerSection` | `id`, `title`, `description`, `images (json)` | Nuevo `/taller`. |

### Game Boy
| Entity | Campos clave | Notas |
|---|---|---|
| `GbUnit` | `id`, `model`, `boardRevision`, `serial` | Unidades verificadas. |
| `GbSerialRange` | `id`, `serialChar`, `serialIni`, `serialEnd`, `mainboard`, `cpu`, `vram`, `wram`, `lcdBoard`, `powerBoard`, `jackBoard`, `comment`, `madeIn`, `screws`, `age` | Rangos. |
| `GbRomsetEntry` | `id`, `usa`, `eur`, `jp`, `noRelease` | Romset (1002). |
| `GbImage` | `id`, `gameId`, `coverUrl`, `screenshots (json)` | Opcional si se normaliza. |
| `GbCount` | `key`, `value` | Estadísticas. |

**Recomendaciones:**
- Usar `@ElementCollection` para listas simples (`platforms`).
- Guardar arrays complejos como `jsonb` (Postgres) con `@JdbcTypeCode(SqlTypes.JSON)`.
- Mantener `id` numéricos donde los use la web (coincidir con JSON para evitar romper rutas).

## 5) Endpoints REST

Todos bajo `/api` con `Content-Type: application/json`. Respuesta lectura-only.

### Colección general
| Método | Ruta | Query | Notas |
|---|---|---|---|
| `GET` | `/api/machines` | `q`, `manufacturer`, `decade`, `platform`, `sort` | Lista + filtros. |
| `GET` | `/api/machines/{id}` | — | Ficha. |
| `GET` | `/api/games` | `q`, `platform`, `genre`, `decade`, `sort` | Lista + filtros. |
| `GET` | `/api/games/{id}` | — | Ficha. |
| `GET` | `/api/articles` | `q` | Lista. |
| `GET` | `/api/articles/{id}` | — | Ficha completa con secciones/bloques. |
| `GET` | `/api/developed` | — | Lista. |
| `GET` | `/api/samaruc` | — | Proyecto completo. |
| `GET` | `/api/about` | — | About. |
| `GET` | `/api/videos` | — | Lista. |
| `GET` | `/api/videos/{id}` | — | Detalle. |
| `GET` | `/api/serials` | `q` | Legacy (coincide con `/api/serials`). |
| `GET` | `/api/serials/{id}` | — | Detalle. |
| `GET` | `/api/taller` | — | Sección taller. |

### Búsqueda global
| Método | Ruta | Query | Notas |
|---|---|---|---|
| `GET` | `/api/search` | `q` (obligatorio) | Equivalente a `searchAll()`: agrupa `machines`, `games`, `articles`, `developed`, `gbUnits`. Mismo comportamiento: normalizar, filtrar por campos, devolver `total`. |

### Game Boy
| Método | Ruta | Query | Notas |
|---|---|---|---|
| `GET` | `/api/gameboy/units` | `q` | Unidades verificadas. |
| `GET` | `/api/gameboy/ranges` | `q` | Rangos. |
| `GET` `GET` | `/api/gameboy/serials/lookup?serial=...` | `serial` | Replica `resolveSerial()`: devuelve `found`, `conflict`, `unit`, `range`. |
| `GET` | `/api/gameboy/romset` | `q` | Romset filtrable. |
| `GET` | `/api/gameboy/romset/{id}` | — | Ficha romset (si aplica). |
| `GET` | `/api/gameboy/images` | `gameId` | Imágenes. |
| `GET` | `/api/gameboy/counts` | — | Estadísticas. |

### Utilidades
| Método | Ruta | Notas |
|---|---|---|
| `GET` | `/actuator/health` | Healthcheck. |
| `GET` | `/v3/api-docs` | OpenAPI JSON. |
| `GET` | `/swagger-ui/index.html` | Swagger UI. |

**CORS:** configurar solo `http://localhost:3000`, `https://retrocueva.vercel.app` y dominios propios.

**Cache headers:** para listas estáticas usar `Cache-Control: public, max-age=3600, s-maxage=3600` o similar al comportamiento actual de la web.

## 6) DTOs (ejemplo)

Crear DTOs planos para evitar exponer entidades JPA:

```java
public record MachineDto(Long id,String name,String manufacturer,int year,
  String cpu,String ram,String storage,String description,String image,
  List<String> platforms,String serial,String condition,Integer acquired,
  String location,String notes){}
```

Para artículos usar DTO con `sections: List<ArticleSectionDto>` con bloques polimórficos o con `kind`.

## 7) Seed desde JSON

Implementar `DataLoader` (`@Component`, `@Profile("dev")` o flag):

1. Leer `src/main/resources/seed/*.json`
2. Copiar todos los `db/*.json` y `db/gameboy/*.json` a `src/main/resources/seed/`
3. Insertar con `saveAll` respetando orden (artículos -> secciones -> bloques)
4. Idempotente: comprobar si hay datos antes de insertar

## 8) Configuración

**`application.yml`:**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/retrocueva
    username: retrocueva
    password: retrocueva
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
  flyway:
    enabled: true
    locations: classpath:db/migration
server:
  port: 8080
```

**`docker-compose.yml`:**

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: retrocueva
      POSTGRES_USER: retrocueva
      POSTGRES_PASSWORD: retrocueva
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
}
```

## 9) Integración con Next.js (`web_bd`)

Crear rama `feat/api-integration` en `web_bd`:

1. Añadir `.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` y `USE_API=false` (por defecto mantener JSON).
2. Crear `app/lib/api-client.ts`:
   - Función genérica `fetchApi<T>(path: string, init?: RequestInit)`
   - Enlazar con `Cache-Control` / revalidación
   - Si `USE_API=false` o falla, fallback a datos JSON actuales
3. Migrar `app/lib/data.ts` para usar API cuando `USE_API=true` (gradual por módulo)
4. Mantener `app/api/*` existentes mientras se valida
5. Probar home, `/base-de-datos/placas`, `/articulos`, `/taller`

## 10) Tareas por fases

### Fase 0: Setup
- [ ] Crear proyecto Spring Boot con dependencias
- [ ] Configurar Postgres + Flyway
- [ ] Estructura de paquetes
- [ ] OpenAPI + CORS

### Fase 1: Entidades y migraciones
- [ ] Crear entidades JPA + repositorios
- [ ] Migraciones Flyway con esquema
- [ ] DTOs + MapStruct mappers

### Fase 2: Seed
- [ ] Copiar JSON a `src/main/resources/seed/`
- [ ] `DataLoader` idempotente
- [ ] Verificar conteos vs JSON

### Fase 3: Controladores
- [ ] Core endpoints (machines/games/articles/developed/samaruc/about/videos/serials/taller)
- [ ] `/api/search`
- [ ] Game Boy endpoints + `lookup`
- [ ] Manejo de errores + validación

### Fase 4: Integración Next.js
- [ ] `api-client.ts` + flags
- [ ] Migrar un módulo (p.ej. videos/taller)
- [ ] Probar en dev
- [ ] Migrar resto con fallback

### Fase 5: QA y despliegue
- [ ] Tests básicos (MockMvc) para endpoints críticos
- [ ] Comparar respuestas con datos JSON
- [ ] Dockerizar API
- [ ] Desplegar API + BD (Railway/Render/Fly.io) o self-host
- [ ] Activar en Vercel con `NEXT_PUBLIC_API_BASE_URL`

## 11) Criterios de aceptación
- [ ] Todos los endpoints devuelven misma forma que los datos actuales
- [ ] `/api/gameboy/serials/lookup?serial=GH3783310` reproduce exactamente `resolveSerial()` (conflicto correcto)
- [ ] Búsqueda global coherente con `searchAll()`
- [ ] Fichas `[id]` funcionan igual
- [ ] CORS correcto
- [ ] Seed reproduce todos los registros
- [ ] Next.js funciona con `USE_API=true` y fallback con `false`

## 12) PROMPT PARA EL AGENTE

Copiar y pegar este prompt completo al agente que vaya a implementar la API:

```text
Actúa como ingeniero backend senior especializado en Spring Boot 3 + Java 21.

Objetivo: crear la API REST `retrocueva-api` que sirva los mismos datos que `web_bd` (Next.js) usando Postgres + JPA + Flyway.

Contexto:
- Lee el archivo docs/PLAN_API_SPRING_BOOT_RETROCUEVA.md
- Usa los JSON de web_bd/db/ como fuente de verdad para el seed
- Replica estructura de respuestas de app/api/* y lógica de app/lib/*
- Mantén compatibilidad con rutas actuales

Requisitos estrictos:
- Java 21, Spring Boot 3.4.x
- Paquetes: com.retrocueva.api.*
- DTOs, no exponer entidades
- MapStruct
- Flyway migrations
- CORS configurado para localhost:3000 y retrocueva.vercel.app
- open-in-view=false
- Endpoints GET solo lectura
- /api/gameboy/serials/lookup debe replicar resolveSerial() (prefijos G/GH/GM, rangos, unidades propias, conflicto)
- /api/search replica searchAll()
- Seed idempotente desde recursos/seed/*.json
- Swagger en /swagger-ui.html

Entrega:
- Proyecto completo compilable (./gradlew build)
- docker-compose.yml con Postgres
- README.md con pasos
- Colección Postman/HTTP con endpoints clave

No inventes campos. Si un dato existe en JSON, debe estar en la API.
```

**Notas finales:** Empezar por **Fase 0-2** (setup + entidades + seed) primero para validar modelo antes de escribir todos los controladores.
