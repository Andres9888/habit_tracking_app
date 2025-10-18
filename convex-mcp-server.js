#!/usr/bin/env node

/**
 * Convex MCP Server
 * Provides MCP (Model Context Protocol) integration for Convex database operations
 */

const { ConvexHttpClient } = require('convex/browser');
const { api } = require('./convex/_generated/api');

class ConvexMCPServer {
  constructor() {
    const deploymentUrl = process.env.CONVEX_URL;
    if (!deploymentUrl) {
      throw new Error('CONVEX_URL environment variable is required');
    }
    this.client = new ConvexHttpClient(deploymentUrl);
  }

  // MCP tool definitions
  getTools() {
    return [
      {
        name: 'convex_query',
        description: 'Execute a Convex query',
        inputSchema: {
          type: 'object',
          properties: {
            function: {
              type: 'string',
              description: "The Convex function to call (e.g., 'habits.list')",
            },
            args: {
              type: 'object',
              description: 'Arguments to pass to the function',
            },
          },
          required: ['function'],
        },
      },
      {
        name: 'convex_mutation',
        description: 'Execute a Convex mutation',
        inputSchema: {
          type: 'object',
          properties: {
            function: {
              type: 'string',
              description:
                "The Convex mutation to call (e.g., 'habits.create')",
            },
            args: {
              type: 'object',
              description: 'Arguments to pass to the mutation',
            },
          },
          required: ['function'],
        },
      },
      {
        name: 'convex_settings_get',
        description: 'Get user settings from Convex',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'convex_settings_update',
        description: 'Update user settings in Convex',
        inputSchema: {
          type: 'object',
          properties: {
            settings: {
              type: 'object',
              description: 'Settings object to update',
              properties: {
                showStreaks: { type: 'boolean' },
                showConsistency: { type: 'boolean' },
                showMotivationalMessages: { type: 'boolean' },
                showEmojis: { type: 'boolean' },
                showCalendarView: { type: 'boolean' },
                catTheme: { type: 'boolean' },
                darkMode: { type: 'boolean' },
              },
            },
          },
          required: ['settings'],
        },
      },
    ];
  }

  // Execute tool calls
  async executeTool(name, args) {
    try {
      switch (name) {
        case 'convex_query':
          return await this.client.query(
            api[args.function.split('.')[0]][args.function.split('.')[1]],
            args.args || {}
          );

        case 'convex_mutation':
          return await this.client.mutation(
            api[args.function.split('.')[0]][args.function.split('.')[1]],
            args.args || {}
          );

        case 'convex_settings_get':
          return await this.client.query(api.settings.get);

        case 'convex_settings_update':
          return await this.client.mutation(api.settings.update, args.settings);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        error: error.message,
        details: error.stack,
      };
    }
  }

  // Start MCP server
  start() {
    const stdin = process.stdin;
    const stdout = process.stdout;

    // Handle MCP protocol messages
    stdin.on('data', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.method === 'tools/list') {
          stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id: message.id,
              result: {
                tools: this.getTools(),
              },
            }) + '\n'
          );
        } else if (message.method === 'tools/call') {
          const result = await this.executeTool(
            message.params.name,
            message.params.arguments
          );
          stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id: message.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                  },
                ],
              },
            }) + '\n'
          );
        } else if (message.method === 'initialize') {
          stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id: message.id,
              result: {
                protocolVersion: '2024-11-05',
                capabilities: {
                  tools: {},
                },
                serverInfo: {
                  name: 'convex-mcp-server',
                  version: '1.0.0',
                },
              },
            }) + '\n'
          );
        }
      } catch (error) {
        stdout.write(
          JSON.stringify({
            jsonrpc: '2.0',
            id: message?.id || null,
            error: {
              code: -32603,
              message: error.message,
            },
          }) + '\n'
        );
      }
    });

    console.error('Convex MCP Server started');
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new ConvexMCPServer();
  server.start();
}

module.exports = ConvexMCPServer;
