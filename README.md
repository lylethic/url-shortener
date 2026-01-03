# URL Shortener

This service exposes a simple Express-driven API for generating short links, redirecting to the original URL, and managing stored records. It relies on MongoDB for persistence, automatically generates unique short IDs via `nanoid`, and includes rate limiting plus cursor-based pagination for listing operations.

## Tech stack

- **Node.js / Express 5** – HTTP server and routing
- **MongoDB + Mongoose** – schema validation and persistence
- **nanoid** – collision-resistant short ID generation
- **cors** + **express-rate-limit** – security and abuse protection
- **dotenv** – configuration management

## Key features

1. **Create short URLs** by posting a valid HTTP/HTTPS link.
2. **Redirect** clients to the original destination while incrementing click counters.
3. **Paginated listing** with cursor-based navigation and field selection.
4. **Soft deletion safeguards** via validation and error handling.

## Getting started

1. Copy `.env.example` to `.env` (create one if absent) and set:

   - `PORT` – port to run the server (defaults via your hosting environment).
   - `MONGO_URI` – connection string for your MongoDB deployment.
   - `BASE_URL` – public-facing base URL used when constructing `shortUrl`.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run in development mode (auto-restarts via `nodemon`):

   ```bash
   npm run dev
   ```

4. Or start the production server:

   ```bash
   npm start
   ```

## API overview

```
| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| POST   | `/api/shorten`  | Create a new short URL record.     |
| GET    | `/api/shorten`  | List saved URLs with pagination.   |
| GET    | `/api/:shortId` | Redirect to the original URL.      |
| DELETE | `/api/shorten/:id` | Hard-delete a record by Mongo ID. |
```

### POST `/api/shorten`

- Request body: `{ "originalUrl": "https://example.com" }`
- Validation ensures the URL is HTTP/HTTPS and non-empty.
- Response includes `{ shortId, originalUrl, shortUrl }`.

### GET `/api/shorten`

- Supports query params: `limit`, `cursor`, `fields`.
- Returns `items` and pagination info (`nextCursor`, `hasNextPage`).

### GET `/api/:shortId`

- Redirects with the stored `redirectType` (default `301`) and increments `clicks`.

### DELETE `/api/shorten/:id`

- Deletes a document by MongoDB `_id`.

## Error handling

Errors are serialized through the global error handler and return JSON with `error` metadata. Rate limiting is applied globally under `/api`.

## Next steps

1. Consider adding Swagger/OpenAPI docs and a UI (e.g., `swagger-ui-express`) for interactive testing.
2. Add authentication/authorization if you want scoped access per client.
