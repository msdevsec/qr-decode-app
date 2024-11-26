declare namespace Express {
  export interface Request {
    userId?: number;
  }
}

// This needs to be a module to work with TypeScript's module system
export {};
