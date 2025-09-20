process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'superhero_test_db';
process.env.PORT = '3001';

global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error 
};

jest.setTimeout(10000);