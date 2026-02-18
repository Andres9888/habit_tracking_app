#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnvConfig } from 'dotenv';

/**
 * Figma MCP Server
 * Exposes Figma API controls through the Model Context Protocol (MCP).
 *
 * Required environment variables:
 *  - FIGMA_ACCESS_TOKEN (preferred)
 *  - FIGMA_PERSONAL_ACCESS_TOKEN (fallback)
 *  - FIGMA_TOKEN (second fallback)
 */

// FIGMA_API_BASE_URL moved to convex/config/apiConstants.ts
// See: convex/config/apiConstants.ts#FIGMA_API for the centralized configuration
const FIGMA_API_BASE_URL = process.env.FIGMA_API_BASE_URL || 'https://api.figma.com/v1';
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

function hydrateFigmaTokenFromLocalEnv() {
  const tokenAlreadyPresent =
    process.env.FIGMA_ACCESS_TOKEN ||
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN ||
    process.env.FIGMA_TOKEN;

  if (tokenAlreadyPresent) {
    return;
  }

  const envFiles = ['.env.local', '.env.mcp', '.env'];
  for (const filename of envFiles) {
    const envPath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const { error } = loadEnvConfig({ path: envPath, override: false });
    if (error) {
      // Non-fatal: move on to the next candidate.
      continue;
    }

    const hydrated =
      process.env.FIGMA_ACCESS_TOKEN ||
      process.env.FIGMA_PERSONAL_ACCESS_TOKEN ||
      process.env.FIGMA_TOKEN;

    if (hydrated) {
      return;
    }
  }

  const tokenFileCandidates = ['.figma-token', 'figma-token.txt'];
  for (const filename of tokenFileCandidates) {
    const tokenPath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(tokenPath)) {
      continue;
    }

    try {
      const raw = fs.readFileSync(tokenPath, 'utf8').trim();
      if (raw) {
        process.env.FIGMA_ACCESS_TOKEN = raw;
        return;
      }
    } catch {
      // Could not read token file; keep searching.
    }
  }
}

hydrateFigmaTokenFromLocalEnv();

class FigmaAPI {
  constructor(token) {
    this.token =
      token ||
      process.env.FIGMA_PERSONAL_ACCESS_TOKEN ||
      process.env.FIGMA_TOKEN;

    if (!this.token) {
      throw new Error(
        'Figma access token is required (set FIGMA_ACCESS_TOKEN or FIGMA_PERSONAL_ACCESS_TOKEN)'
      );
    }

    if (typeof fetch !== 'function') {
      throw new Error(
        'Global fetch is not available. Use Node.js 18+ or polyfill fetch.'
      );
    }
  }

  async request(path, query = {}) {
    const url = new URL(`${FIGMA_API_BASE_URL}${path}`);

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (Array.isArray(value)) {
        if (value.length) {
          url.searchParams.set(key, value.join(','));
        }
        return;
      }

      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Figma-Token': this.token,
      },
    });

    const bodyText = await response.text();

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = JSON.parse(bodyText);
      } catch {
        errorDetails = { message: bodyText };
      }

      throw new Error(
        `Figma API ${response.status}: ${
          errorDetails?.err ?? errorDetails?.message ?? 'Unknown error'
        }`
      );
    }

    if (!bodyText) {
      return null;
    }

    try {
      return JSON.parse(bodyText);
    } catch (error) {
      throw new Error(
        `Failed to parse Figma API response: ${(error && error.message) || error}`
      );
    }
  }

  getFile(fileKey, options = {}) {
    return this.request(`/files/${fileKey}`, options);
  }

  getNodes(fileKey, options = {}) {
    if (!options.ids || !options.ids.length) {
      throw new Error("Parameter 'ids' is required for Figma get nodes.");
    }

    return this.request(`/files/${fileKey}/nodes`, options);
  }

  getImages(fileKey, options = {}) {
    if (!options.ids || !options.ids.length) {
      throw new Error("Parameter 'ids' is required for Figma get images.");
    }

    return this.request(`/images/${fileKey}`, options);
  }

  getComments(fileKey) {
    return this.request(`/files/${fileKey}/comments`);
  }
}

export default class FigmaMCPServer {
  constructor() {
    this.api = new FigmaAPI(process.env.FIGMA_ACCESS_TOKEN);
    this.buffer = '';
  }

  getTools() {
    return [
      {
        name: 'figma_get_file',
        description:
          "Fetch a Figma file's document tree and styles. Provide the file key (the ID in the Figma URL).",
        inputSchema: {
          type: 'object',
          properties: {
            fileKey: {
              type: 'string',
              description: "The Figma file key (e.g., 'AbCdEfGhIjKlMnOpQr').",
            },
            ids: {
              type: 'array',
              items: { type: 'string' },
              description:
                'Optional list of node IDs to include. If omitted, returns the full file.',
            },
            depth: {
              type: 'integer',
              description:
                'Optional depth of nested nodes to return (default unlimited).',
            },
            geometry: {
              type: 'string',
              enum: ['paths', 'fills', 'strokes'],
              description:
                'Optional geometry information to include for vector nodes.',
            },
          },
          required: ['fileKey'],
        },
      },
      {
        name: 'figma_get_nodes',
        description:
          'Retrieve specific nodes from a Figma file by their IDs (frames, components, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            fileKey: {
              type: 'string',
              description: 'The Figma file key.',
            },
            ids: {
              type: 'array',
              items: { type: 'string' },
              description:
                'List of node IDs to retrieve (comma-separated in Figma URLs).',
            },
            depth: {
              type: 'integer',
              description:
                'Optional depth limit for nested children (default unlimited).',
            },
            geometry: {
              type: 'string',
              enum: ['paths', 'fills', 'strokes'],
              description:
                'Optional geometry format for vector nodes (Figma API option).',
            },
          },
          required: ['fileKey', 'ids'],
        },
      },
      {
        name: 'figma_get_images',
        description:
          'Render one or more nodes from a Figma file into image URLs (PNG, JPG, SVG).',
        inputSchema: {
          type: 'object',
          properties: {
            fileKey: {
              type: 'string',
              description: 'The Figma file key.',
            },
            ids: {
              type: 'array',
              items: { type: 'string' },
              description:
                'List of node IDs to render. Images expire quickly; download promptly.',
            },
            format: {
              type: 'string',
              enum: ['png', 'jpg', 'svg', 'pdf'],
              description: 'Optional image format (default png).',
            },
            scale: {
              type: 'number',
              description:
                'Render scale for PNG/JPG exports (1–4). Default 1 if omitted.',
            },
            svg_include_id: {
              type: 'boolean',
              description: 'Include node IDs in SVG output (Figma API option).',
            },
            svg_outline_text: {
              type: 'boolean',
              description: 'Outline text in SVG output.',
            },
          },
          required: ['fileKey', 'ids'],
        },
      },
      {
        name: 'figma_get_comments',
        description:
          'Fetch comments for a Figma file (including author, message, and position).',
        inputSchema: {
          type: 'object',
          properties: {
            fileKey: {
              type: 'string',
              description: 'The Figma file key.',
            },
          },
          required: ['fileKey'],
        },
      },
    ];
  }

  async executeTool(name, args = {}) {
    switch (name) {
      case 'figma_get_file':
        return this.api.getFile(args.fileKey, {
          ids: args.ids,
          depth: args.depth,
          geometry: args.geometry,
        });

      case 'figma_get_nodes':
        return this.api.getNodes(args.fileKey, {
          ids: args.ids,
          depth: args.depth,
          geometry: args.geometry,
        });

      case 'figma_get_images':
        return this.api.getImages(args.fileKey, {
          ids: args.ids,
          format: args.format,
          scale: args.scale,
          svg_include_id: args.svg_include_id,
          svg_outline_text: args.svg_outline_text,
        });

      case 'figma_get_comments':
        return this.api.getComments(args.fileKey);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  formatResult(id, result) {
    return `${JSON.stringify({
      jsonrpc: '2.0',
      id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      },
    })}\n`;
  }

  formatError(id, error) {
    return (
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error.message || 'Unknown error',
        },
      }) + '\n'
    );
  }

  handleMessage(message) {
    if (!message || typeof message !== 'object') {
      return;
    }

    if (message.method === 'initialize') {
      return (
        JSON.stringify({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'figma-mcp-server',
              version: '1.0.0',
            },
          },
        }) + '\n'
      );
    }

    if (message.method === 'tools/list') {
      return (
        JSON.stringify({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: this.getTools(),
          },
        }) + '\n'
      );
    }

    if (message.method === 'tools/call') {
      return this.executeTool(message.params?.name, message.params?.arguments)
        .then((result) => this.formatResult(message.id, result))
        .catch((error) => this.formatError(message.id, error));
    }

    return (
      JSON.stringify({
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32601,
          message: `Unsupported method: ${message.method}`,
        },
      }) + '\n'
    );
  }

  start() {
    const stdin = process.stdin;
    const stdout = process.stdout;

    stdin.setEncoding('utf8');

    stdin.on('data', (chunk) => {
      this.buffer += chunk;

      let newlineIndex;
      while (this.buffer.includes('\n') && (newlineIndex = this.buffer.indexOf('\n')) !== -1) {
        const rawMessage = this.buffer.slice(0, newlineIndex).trim();
        this.buffer = this.buffer.slice(newlineIndex + 1);

        if (!rawMessage) {
          continue;
        }

        let parsed;
        try {
          parsed = JSON.parse(rawMessage);
        } catch (error) {
          stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: {
                code: -32700,
                message: `Failed to parse message: ${
                  (error && error.message) || error
                }`,
              },
            }) + '\n'
          );
          continue;
        }

        const response = this.handleMessage(parsed);

        if (response instanceof Promise) {
          response.then((resolved) => stdout.write(resolved));
        } else if (response) {
          stdout.write(response);
        }
      }
    });

    stdin.on('end', () => {
      if (this.buffer.trim().length) {
        stdout.write(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Unexpected end of input',
            },
          }) + '\n'
        );
      }
    });

    console.error('Figma MCP Server started');
  }
}

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const server = new FigmaMCPServer();
  server.start();
}
