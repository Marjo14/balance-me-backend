const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const intentionRoutes = require('./src/routes/intentionRoutes');
require('dotenv').config(); // Load environment variables (SUPABASE_URL, etc.)

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Swagger Configuration
 * Defines the OpenAPI 3.0.0 specification for the API
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BalanceMe API',
      version: '1.0.0',
      description: 'Frugality management API with a Reward system logic and Supabase Auth integration',
    },
    
    // --- SECURITY SCHEME FOR JWT ---
    // This adds the "Authorize" button in Swagger UI to handle Supabase Tokens
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Apply security globally to all documented paths
    security: [
      {
        bearerAuth: [],
      },
    ],
    
    servers: [
      { 
        url: 'https://balance-me-backend.onrender.com', 
        description: 'Production Server (Render)' 
      },
      { 
        url: 'http://localhost:8080', 
        description: 'Local Development Server' 
      }
    ],
    
    // API Paths Documentation
    paths: {
      '/intentions': {
        get: {
          summary: 'List all purchase intentions for the authenticated user',
          tags: ['Intentions'],
          responses: { 
            200: { description: 'Success' },
            401: { description: 'Unauthorized - Token missing or invalid' }
          }
        },
        post: {
          summary: 'Create a new purchase intention',
          tags: ['Intentions'],
          requestBody: {
            required: true,
            content: { 
              'application/json': { 
                schema: { 
                  type: 'object', 
                  properties: { 
                    label: { type: 'string', example: 'New Shoes' }, 
                    amount: { type: 'number', example: 85.50 }, 
                    emotion: { type: 'string', example: 'Impulsive' } 
                  } 
                } 
              } 
            }
          },
          responses: { 
            201: { description: 'Created' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/intentions/stats': {
        get: {
          summary: 'Retrieve financial dashboard statistics for the user',
          tags: ['Stats'],
          responses: { 
            200: { description: 'Success' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/intentions/{id}/realize': {
        put: {
          summary: 'Confirm and realize a pending expense',
          tags: ['Actions'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/intentions/{id}/abort': {
        put: {
          summary: 'Cancel expense and record a Victory (Financial Frugality)',
          tags: ['Actions'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/intentions/{id}': {
        delete: {
          summary: 'Delete an intention (Cleanup)',
          tags: ['Actions'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted successfully' } }
        }
      }
    }
  },
  apis: [], // We use the internal 'paths' object above instead of scanning files for simplicity
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API ROUTES ---
app.use('/intentions', intentionRoutes);

// Basic landing page
app.get('/', (req, res) => {
  res.send(`<h1>BalanceMe API is Live</h1><p>Check the <a href="/api-docs">Interactive Swagger Documentation</a>.</p>`);
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
});