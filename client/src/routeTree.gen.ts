/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as EmployeesImport } from './routes/employees'
import { Route as CafesImport } from './routes/cafes'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const EmployeesRoute = EmployeesImport.update({
  path: '/employees',
  getParentRoute: () => rootRoute,
} as any)

const CafesRoute = CafesImport.update({
  path: '/cafes',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/cafes': {
      id: '/cafes'
      path: '/cafes'
      fullPath: '/cafes'
      preLoaderRoute: typeof CafesImport
      parentRoute: typeof rootRoute
    }
    '/employees': {
      id: '/employees'
      path: '/employees'
      fullPath: '/employees'
      preLoaderRoute: typeof EmployeesImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/cafes': typeof CafesRoute
  '/employees': typeof EmployeesRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/cafes': typeof CafesRoute
  '/employees': typeof EmployeesRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/cafes': typeof CafesRoute
  '/employees': typeof EmployeesRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/cafes' | '/employees'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/cafes' | '/employees'
  id: '__root__' | '/' | '/cafes' | '/employees'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CafesRoute: typeof CafesRoute
  EmployeesRoute: typeof EmployeesRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CafesRoute: CafesRoute,
  EmployeesRoute: EmployeesRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/cafes",
        "/employees"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/cafes": {
      "filePath": "cafes.tsx"
    },
    "/employees": {
      "filePath": "employees.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
