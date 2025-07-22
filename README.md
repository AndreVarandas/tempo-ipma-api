# IPMA API Wrapper

A TypeScript Node.js API wrapper for the Portuguese Institute for Sea and Atmosphere (IPMA) open weather data.

## Features

- 🌤️ Current weather forecasts for all Portuguese locations
- 📍 Location-specific forecasts
- 🏝️ Districts and islands information
- 🌡️ Weather type classifications
- 📊 Enhanced data with readable location names
- 🚀 Built with TypeScript for type safety
- ⚡ Intelligent caching with 1-hour TTL
- 📝 Comprehensive logging with Winston
- 🛡️ Robust error handling and validation

## Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── config/
│   └── environment.ts  # Environment configuration
├── controllers/
│   └── weatherController.ts  # Route handlers
├── middleware/
│   ├── errorHandler.ts # Error handling middleware
│   └── validation.ts   # Request validation
├── routes/
│   └── weatherRoutes.ts # Route definitions
├── services/
│   └── ipmaService.ts  # IPMA API service layer
├── types/
│   └── ipma.ts         # TypeScript interfaces
└── utils/
    └── logger.ts       # Winston logger setup
```

## Installation

### Local Development

```bash
npm install
```

### Docker

```bash
# Build and run with Docker Compose (recommended)
docker-compose up --build

# Or build manually
docker build -t ipma-api-wrapper .
docker run -p 3000:3000 ipma-api-wrapper
```

## Development

### Local Development

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Production
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
npm run format:lint  # Format and lint in one command
```

### Docker Development

```bash
# Run production version
docker-compose up

# Run development version with hot reload
docker-compose --profile dev up

# Run development version only
docker-compose up ipma-api-dev

# Build without cache
docker-compose build --no-cache

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## API Documentation

### Interactive Documentation

#### Production Environment

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) - Interactive API documentation
- **OpenAPI JSON**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json) - Raw OpenAPI specification

#### Development Environment

- **Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs) - Interactive API documentation (dev server)
- **OpenAPI JSON**: [http://localhost:3001/api-docs.json](http://localhost:3001/api-docs.json) - Raw OpenAPI specification (dev server)

> 💡 **Tip**: The Swagger UI provides an interactive interface where you can test all API endpoints directly from your browser. Simply navigate to the Swagger UI URL and explore the available endpoints, view request/response schemas, and execute API calls with real data.

### API Endpoints

#### Core Endpoints

- `GET /health` - Health check
- `GET /locations` - All available districts and islands  
- `GET /weather-types` - Weather type classifications

#### Forecast Endpoints

- `GET /forecast/current` - Current day forecast for all locations
- `GET /forecast/daily` - Same as /forecast/current
- `GET /forecast/daily/:locationId` - Forecast for specific location

#### Utility Endpoints

- `DELETE /cache` - Clear service cache

#### API Versioning

All endpoints are also available under `/api/v1/` prefix:

- `GET /api/v1/health`
- `GET /api/v1/locations`
- etc.

## Example Response

```json
{
  "success": true,
  "metadata": {
    "forecastDate": "2025-07-22",
    "dataUpdate": "2025-07-22T10:30:00Z",
    "owner": "IPMA",
    "country": "PT"
  },
  "data": [
    {
      "precipitaProb": 10,
      "tMin": 18,
      "tMax": 28,
      "predWindDir": "NW",
      "idWeatherType": 2,
      "classWindSpeed": 2,
      "longitude": -8.61,
      "latitude": 41.15,
      "globalIdLocal": 1010500,
      "locationName": "Porto",
      "district": "Porto"
    }
  ],
  "count": 26
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Docker Deployment

### Container Features

- 🐳 **Multi-stage build**: Optimized production image size
- 🔒 **Security**: Non-root user execution
- 🏥 **Health checks**: Built-in application health monitoring
- 📊 **Logging**: Persistent log volumes
- 🔄 **Hot reload**: Development container support

### Production Deployment

```bash
# Single instance (uses docker-compose.override.yml automatically)
docker-compose up -d

# Multiple instances (scaling) - Use base config without override
docker-compose -f docker-compose.yml up -d --scale ipma-api=3

# Multiple instances with load balancer (recommended for production)
docker-compose -f docker-compose.scale.yml --profile scale up -d --scale ipma-api=3

# Access scaled instances (accessible via container network)
docker exec -it tempo-ipma-api-1 curl localhost:3000/health
docker exec -it tempo-ipma-api-2 curl localhost:3000/health

# Access via load balancer (when using scale configuration)
curl http://localhost:8080/health

# Monitor health
docker-compose ps
```

### Environment Variables for Docker

```bash
# docker-compose.yml or .env file
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

## Architecture Decisions

- **TypeScript**: Full type safety and better developer experience
- **Service Layer**: Clean separation between business logic and HTTP handling
- **Caching**: 1-hour TTL cache to reduce API calls to IPMA
- **Error Handling**: Centralized error handling with custom AppError class
- **Logging**: Structured logging with Winston
- **Validation**: Request validation middleware for type safety
- **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT signals
- **Docker**: Containerized deployment with multi-stage builds
