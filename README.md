# Dataverse MCP Data Importer

A production-ready web application for importing CSV and Excel files into Microsoft Dataverse using a Dataverse MCP server, Microsoft Entra ID authentication, and a modern React + Express stack.

## Features

- Microsoft Entra ID login via MSAL
- Dataverse environment selection and table discovery
- Table metadata and custom table creation
- CSV and Excel file preview and validation
- Mapping editor with automatic and manual mapping
- Large-file import progress tracking and retry support
- Audit logging and dashboard metrics
- Secure Express API with environment variables and request validation

## Stack

- Frontend: React + TypeScript + Vite + Material UI + React Query
- Backend: Node.js + Express + TypeScript + Winston
- Authentication: Microsoft Entra ID (MSAL)
- Data import: CSV and Excel (.xlsx)
- Dataverse integration: Dataverse MCP Server

## Project Layout

- client/: React frontend application
- server/: Express + TypeScript backend and Dataverse MCP service
- sample-data/: Example CSV import file
- Dockerfile: Container build for the app
- docker-compose.yml: Local multi-service orchestration

## Quick Start

1. Copy .env.example to .env and update values.
2. Install dependencies:
   npm install
   npm install --prefix client
   npm install --prefix server
3. Start backend:
   npm run dev:server
4. Start frontend:
   npm run dev:client
5. Open http://localhost:5173

## Production Deployment

Build assets:

npm run build:client
npm run build:server

## Environment Variables

The app expects Microsoft Entra ID values and backend configuration values defined in .env.

## Sample Import

Use the sample file in sample-data/customers.csv to test the import flow.

## License

MIT
