import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for the URL Shortener service',
    },

    servers: [
      {
        url: '/api',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Auth management' },
      { name: 'Urls', description: 'Short URL operations' },
      { name: 'Roles', description: 'Role management' },
      { name: 'Users', description: 'User management' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        AuthRegister: {
          type: 'object',
          required: ['fullname', 'email', 'password'],
          properties: {
            fullname: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        AuthLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fullname: { type: 'string' },
                roleId: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
        UrlCreate: {
          type: 'object',
          required: ['originalUrl'],
          properties: {
            originalUrl: { type: 'string', example: 'https://example.com' },
          },
        },
        UrlItem: {
          type: 'object',
          properties: {
            shortId: { type: 'string', example: 'a1b2c3d' },
            originalUrl: { type: 'string', example: 'https://example.com' },
            clicks: { type: 'integer', example: 10 },
            isActive: { type: 'boolean', example: true },
            expiresAt: { type: 'string', format: 'date-time', nullable: true },
            redirectType: { type: 'integer', example: 302 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RoleCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'admin' },
            description: { type: 'string', example: 'Administrator role' },
            isActive: { type: 'boolean', example: true },
            createdBy: { type: 'string', example: 'system' },
          },
        },
        RoleUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'editor' },
            description: { type: 'string', example: 'Editor role' },
            isActive: { type: 'boolean', example: true },
            updatedBy: { type: 'string', example: 'system' },
          },
        },
        RoleItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a1f0c2e4b0f0b0a0a0a0a0' },
            name: { type: 'string', example: 'admin' },
            description: { type: 'string', example: 'Administrator role' },
            isActive: { type: 'boolean', example: true },
            isDeleted: { type: 'boolean', example: false },
            createdBy: { type: 'string', example: 'system' },
            updatedBy: { type: 'string', example: 'system' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserCreate: {
          type: 'object',
          required: ['fullname', 'roleId', 'email'],
          properties: {
            fullname: { type: 'string', example: 'John Doe' },
            roleId: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string' },
            isActive: { type: 'boolean', example: true },
            createdBy: { type: 'string', example: 'system' },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            fullname: { type: 'string', example: 'Jane Doe' },
            roleId: { type: 'string', example: 'editor' },
            email: { type: 'string', example: 'jane@example.com' },
            isActive: { type: 'boolean', example: true },
            updatedBy: { type: 'string', example: 'system' },
          },
        },
        UserItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a1f0c2e4b0f0b0a0a0a0a0' },
            fullname: { type: 'string', example: 'John Doe' },
            roleId: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'john@example.com' },
            isActive: { type: 'boolean', example: true },
            isDeleted: { type: 'boolean', example: false },
            createdBy: { type: 'string', example: 'system' },
            updatedBy: { type: 'string', example: 'system' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CursorPage: {
          type: 'object',
          properties: {
            limit: { type: 'integer', example: 20 },
            nextCursor: { type: 'string', nullable: true },
            hasNextPage: { type: 'boolean', example: false },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Success' },
            message_en: { type: 'string', example: 'Success' },
            data: { type: 'object', nullable: true },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthLogin' },
              },
            },
          },
          responses: {
            200: {
              description: 'Logged in',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: { $ref: '#/components/schemas/AuthResponse' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthRegister' },
              },
            },
          },
          responses: {
            201: {
              description: 'Registered',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: { $ref: '#/components/schemas/AuthResponse' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/shorten': {
        get: {
          tags: ['Urls'],
          summary: 'List short URLs',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', example: 20 },
            },
            {
              name: 'cursor',
              in: 'query',
              schema: { type: 'string' },
            },
            {
              name: 'fields',
              in: 'query',
              schema: {
                type: 'string',
                example:
                  'shortId,originalUrl,clicks,isActive,expiresAt,redirectType',
              },
            },
          ],
          responses: {
            200: {
              description: 'List of short URLs',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              items: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/UrlItem' },
                              },
                              page: { $ref: '#/components/schemas/CursorPage' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Urls'],
          summary: 'Create a short URL',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UrlCreate' },
              },
            },
          },
          responses: {
            201: {
              description: 'Short URL created',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              shortId: { type: 'string' },
                              originalUrl: { type: 'string' },
                              shortUrl: { type: 'string' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/shorten/{id}': {
        delete: {
          tags: ['Urls'],
          summary: 'Delete a short URL (hard delete)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Deleted',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/{shortId}': {
        get: {
          tags: ['Urls'],
          summary: 'Redirect to original URL',
          parameters: [
            {
              name: 'shortId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            301: { description: 'Redirected' },
            302: { description: 'Redirected' },
            404: { description: 'Not found' },
          },
        },
      },
      '/roles': {
        get: {
          tags: ['Roles'],
          summary: 'List roles',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', example: 20 },
            },
            { name: 'cursor', in: 'query', schema: { type: 'string' } },
            {
              name: 'fields',
              in: 'query',
              schema: {
                type: 'string',
                example:
                  'name,description,isActive,isDeleted,createdBy,updatedBy',
              },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
          ],
          responses: {
            200: {
              description: 'List of roles',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              items: {
                                type: 'array',
                                items: {
                                  $ref: '#/components/schemas/RoleItem',
                                },
                              },
                              page: { $ref: '#/components/schemas/CursorPage' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Roles'],
          summary: 'Create role',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RoleCreate' },
              },
            },
          },
          responses: {
            201: {
              description: 'Role created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/roles/{id}': {
        get: {
          tags: ['Roles'],
          summary: 'Get role by id',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
            {
              name: 'select',
              in: 'query',
              schema: { type: 'string', example: 'name,description,isActive' },
            },
          ],
          responses: {
            200: {
              description: 'Role',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        patch: {
          tags: ['Roles'],
          summary: 'Update role',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RoleUpdate' },
              },
            },
          },
          responses: {
            200: {
              description: 'Role updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Roles'],
          summary: 'Delete role (soft delete)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    deletedBy: { type: 'string', example: 'system' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Role deleted',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'List users',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', example: 20 },
            },
            { name: 'cursor', in: 'query', schema: { type: 'string' } },
            {
              name: 'fields',
              in: 'query',
              schema: {
                type: 'string',
                example:
                  'fullname,roleId,email,isActive,isDeleted,createdBy,updatedBy',
              },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
          ],
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              items: {
                                type: 'array',
                                items: {
                                  $ref: '#/components/schemas/UserItem',
                                },
                              },
                              page: { $ref: '#/components/schemas/CursorPage' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Users'],
          summary: 'Create user',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserCreate' },
              },
            },
          },
          responses: {
            201: {
              description: 'User created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/users/by-email': {
        get: {
          tags: ['Users'],
          summary: 'Get user by email',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'email',
              in: 'query',
              required: true,
              schema: { type: 'string', example: 'john@example.com' },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
            {
              name: 'select',
              in: 'query',
              schema: { type: 'string', example: 'fullname,roleId,email' },
            },
          ],
          responses: {
            200: {
              description: 'User',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by id',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
            {
              name: 'select',
              in: 'query',
              schema: { type: 'string', example: 'fullname,roleId,email' },
            },
          ],
          responses: {
            200: {
              description: 'User',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'includeDeleted',
              in: 'query',
              schema: { type: 'boolean', example: false },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserUpdate' },
              },
            },
          },
          responses: {
            200: {
              description: 'User updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user (soft delete)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    deletedBy: { type: 'string', example: 'system' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User deleted',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
});

export default swaggerSpec;
