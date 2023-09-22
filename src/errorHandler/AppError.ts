import httpStatus from 'http-status'

// centralized error object that derives from Node’s Error
export class AppError extends Error {
    public readonly name: string;
    public readonly httpCode;
  
    constructor(name: string, httpCode: httpStatus.HttpStatus, description: string) {
      super(description);
      
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  
      this.name = name;
      this.httpCode = httpCode;
  
      Error.captureStackTrace(this);
    }
  }