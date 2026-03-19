const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const intentionRoutes = require('./src/routes/intentionRoutes');

const app = express();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BalanceMe API',
      version: '1.0.0',
      description: 'Frugality management API with a Reward system logic',
    },
    
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
    paths: {
      '/intentions': {
        get: {
          summary: 'List all purchase intentions',
          tags: ['Intentions'],
          responses: { 200: { description: 'Success' } }
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
                    label: { type: 'string' }, 
                    amount: { type: 'number' }, 
                    emotion: { type: 'string' } 
                  } 
                } 
              } 
            }
          },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/intentions/stats': {
        get: {
          summary: 'Retrieve financial dashboard statistics',
          tags: ['Stats'],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/intentions/{id}/realize': {
        put: {
          summary: 'Confirm and realize an expense',
          tags: ['Actions'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/intentions/{id}/abort': {
        put: {
          summary: 'Cancel expense and record a Victory',
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
  apis: [], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/intentions', intentionRoutes);

app.get('/', (req, res) => {
  res.send(`<h1>BalanceMe API is Live</h1><p>Check the <a href="/api-docs">Interactive Swagger Documentation</a>.</p>`);
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📖 API Documentation: https://balance-me-backend.onrender.com/api-docs`);
});