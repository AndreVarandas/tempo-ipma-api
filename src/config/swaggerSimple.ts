// Define the OpenAPI spec directly in TypeScript to avoid file system issues
export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'IPMA API Wrapper',
    version: '1.0.0',
    description: 'A TypeScript Node.js API wrapper for the Portuguese Institute for Sea and Atmosphere (IPMA) open weather data',
    contact: {
      name: 'André Varandas',
      email: 'andre.m.varandas@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server (v1 API)',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Locations', description: 'Portuguese locations and districts' },
    { name: 'Weather Types', description: 'Weather type classifications' },
    { name: 'Forecasts', description: 'Weather forecast data' },
    { name: 'Cache', description: 'Cache management' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
                example: {
                  success: true,
                  data: { status: 'healthy', timestamp: '2025-07-22T11:00:00.000Z' },
                },
              },
            },
          },
        },
      },
    },
    '/locations': {
      get: {
        tags: ['Locations'],
        summary: 'Get all Portuguese locations and districts',
        responses: {
          200: {
            description: 'List of all available locations',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/APIResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/Location' } },
                        count: { type: 'integer', example: 35 },
                      },
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/weather-types': {
      get: {
        tags: ['Weather Types'],
        summary: 'Get weather type classifications',
        responses: {
          200: {
            description: 'List of weather type classifications',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/APIResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/WeatherType' } },
                      },
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/forecast/current': {
      get: {
        tags: ['Forecasts'],
        summary: 'Get current day forecast for all locations',
        responses: {
          200: {
            description: 'Current forecast data for all Portuguese locations',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/APIResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/ForecastData' } },
                        count: { type: 'integer', example: 27 },
                        metadata: { $ref: '#/components/schemas/ForecastMetadata' },
                      },
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/forecast/daily': {
      get: {
        tags: ['Forecasts'],
        summary: 'Get current day forecast for all locations (alias)',
        responses: {
          200: {
            description: 'Same as /forecast/current',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/APIResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/ForecastData' } },
                      },
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/forecast/daily/{locationId}': {
      get: {
        tags: ['Forecasts'],
        summary: 'Get forecast for a specific location',
        parameters: [
          {
            in: 'path',
            name: 'locationId',
            required: true,
            description: 'Global location identifier',
            schema: { type: 'integer', minimum: 1 },
            example: 1010500,
          },
        ],
        responses: {
          200: {
            description: 'Forecast data for the specified location',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/APIResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/ForecastData' },
                        count: { type: 'integer', example: 1 },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/cache': {
      delete: {
        tags: ['Cache'],
        summary: 'Clear service cache',
        responses: {
          200: {
            description: 'Cache cleared successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/APIResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: { message: { type: 'string', example: 'Cache cleared successfully' } },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
  },
  components: {
    schemas: {
      APIResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', description: 'Indicates if the request was successful' },
          data: { description: 'Response data (varies by endpoint)' },
          metadata: { type: 'object', description: 'Additional metadata for forecasts' },
          count: { type: 'integer', description: 'Number of items returned' },
          error: { type: 'string', description: 'Error message (present when success is false)' },
        },
        required: ['success'],
      },
      HealthResponse: {
        allOf: [
          { $ref: '#/components/schemas/APIResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'healthy' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
                required: ['status', 'timestamp'],
              },
            },
          },
        ],
      },
      Location: {
        type: 'object',
        properties: {
          regionId: { type: 'integer', description: 'Region identifier' },
          idWarning: { type: 'integer', description: 'Warning area identifier' },
          idMunicipio: { type: 'integer', description: 'Municipality identifier' },
          globalIdLocal: { type: 'integer', description: 'Global location identifier' },
          latitude: { type: 'number', format: 'float', description: 'Latitude coordinate' },
          longitude: { type: 'number', format: 'float', description: 'Longitude coordinate' },
          idDistrito: { type: 'integer', description: 'District identifier' },
          local: { type: 'string', description: 'Location name' },
          dico: { type: 'string', description: 'District name', nullable: true },
        },
        required: ['regionId', 'idWarning', 'idMunicipio', 'globalIdLocal', 'latitude', 'longitude', 'idDistrito', 'local'],
      },
      WeatherType: {
        type: 'object',
        properties: {
          idWeatherType: { type: 'integer', description: 'Weather type identifier' },
          descIdWeatherTypePT: { type: 'string', description: 'Weather type description in Portuguese' },
          descIdWeatherTypeEN: { type: 'string', description: 'Weather type description in English' },
        },
        required: ['idWeatherType', 'descIdWeatherTypePT', 'descIdWeatherTypeEN'],
      },
      ForecastData: {
        type: 'object',
        properties: {
          precipitaProb: { type: 'integer', description: 'Precipitation probability (%)', minimum: 0, maximum: 100 },
          tMin: { type: 'integer', description: 'Minimum temperature (°C)' },
          tMax: { type: 'integer', description: 'Maximum temperature (°C)' },
          predWindDir: { type: 'string', description: 'Predicted wind direction' },
          idWeatherType: { type: 'integer', description: 'Weather type identifier' },
          classWindSpeed: { type: 'integer', description: 'Wind speed classification' },
          longitude: { type: 'number', format: 'float', description: 'Longitude coordinate' },
          latitude: { type: 'number', format: 'float', description: 'Latitude coordinate' },
          globalIdLocal: { type: 'integer', description: 'Global location identifier' },
          locationName: { type: 'string', description: 'Human-readable location name' },
          district: { type: 'string', description: 'District name', nullable: true },
        },
        required: ['precipitaProb', 'tMin', 'tMax', 'predWindDir', 'idWeatherType', 'classWindSpeed', 'longitude', 'latitude', 'globalIdLocal', 'locationName'],
        example: {
          precipitaProb: 10,
          tMin: 18,
          tMax: 28,
          predWindDir: 'NW',
          idWeatherType: 2,
          classWindSpeed: 2,
          longitude: -8.61,
          latitude: 41.15,
          globalIdLocal: 1010500,
          locationName: 'Porto',
          district: 'Porto',
        },
      },
      ForecastMetadata: {
        type: 'object',
        properties: {
          forecastDate: { type: 'string', format: 'date', description: 'Forecast date' },
          dataUpdate: { type: 'string', format: 'date-time', description: 'When the data was last updated' },
          owner: { type: 'string', description: 'Data owner (IPMA)', example: 'IPMA' },
          country: { type: 'string', description: 'Country code (PT)', example: 'PT' },
        },
      },
      ErrorResponse: {
        allOf: [
          { $ref: '#/components/schemas/APIResponse' },
          {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: { type: 'string', example: 'Error message' },
            },
            required: ['success', 'error'],
          },
        ],
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { success: false, error: 'Location not found' },
          },
        },
      },
      BadRequest: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { success: false, error: 'Invalid location ID. Must be a positive integer.' },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { success: false, error: 'Internal server error' },
          },
        },
      },
    },
  },
};