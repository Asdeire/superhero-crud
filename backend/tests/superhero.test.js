const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock dependencies
jest.mock('../src/config/database');
jest.mock('../src/utils/fileHelper');
jest.mock('../src/models/Superhero');

const { pool } = require('../src/config/database');
const { createUploadsDir, deleteFile } = require('../src/utils/fileHelper');
const Superhero = require('../src/models/Superhero');

// Import app after mocking
const app = require('../server');

describe('Superhero API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        createUploadsDir.mockResolvedValue();
        deleteFile.mockResolvedValue();
    });

    describe('GET /api/superheroes', () => {
        it('should return paginated superheroes', async () => {
            const mockSuperheroes = [
                { id: 1, nickname: 'Superman', real_name: 'Clark Kent', created_at: '2023-01-01', image_path: 'uploads/superman.jpg' },
                { id: 2, nickname: 'Batman', real_name: 'Bruce Wayne', created_at: '2023-01-02', image_path: 'uploads/batman.jpg' }
            ];

            Superhero.findAll.mockResolvedValue({
                data: mockSuperheroes,
                totalCount: 10
            });

            const response = await request(app)
                .get('/api/superheroes?page=1&limit=5')
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body.data).toEqual(mockSuperheroes);
            expect(response.body.pagination).toEqual({
                page: 1,
                limit: 5,
                totalCount: 10,
                totalPages: 2
            });
        });

        it('should use default pagination values', async () => {
            Superhero.findAll.mockResolvedValue({
                data: [],
                totalCount: 3
            });

            const response = await request(app)
                .get('/api/superheroes')
                .expect(200);

            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.limit).toBe(5);
        });

        it('should handle database errors', async () => {
            Superhero.findAll.mockRejectedValue(new Error('Database connection failed'));

            await request(app)
                .get('/api/superheroes')
                .expect(500);
        });
    });

    describe('GET /api/superheroes/:id', () => {
        it('should return superhero details with images', async () => {
            const mockSuperhero = {
                id: 1,
                nickname: 'Superman',
                real_name: 'Clark Kent',
                origin_description: 'Born on Krypton...',
                superpowers: 'Flight, strength...',
                catch_phrase: 'Look up in the sky!',
                created_at: '2023-01-01',
                updated_at: '2023-01-01',
                images: [
                    { id: 1, superhero_id: 1, filename: 'superman1.jpg', original_name: 'superman1.jpg', path: 'uploads/superman1.jpg', created_at: '2023-01-01' },
                    { id: 2, superhero_id: 1, filename: 'superman2.jpg', original_name: 'superman2.jpg', path: 'uploads/superman2.jpg', created_at: '2023-01-01' }
                ]
            };

            Superhero.findById.mockResolvedValue(mockSuperhero);

            const response = await request(app)
                .get('/api/superheroes/1')
                .expect(200);

            expect(response.body).toEqual(mockSuperhero);
        });

        it('should return 404 for non-existent superhero', async () => {
            Superhero.findById.mockResolvedValue(null);

            await request(app)
                .get('/api/superheroes/999')
                .expect(404)
                .expect((res) => {
                    expect(res.body.error).toBe('Superhero not found');
                });
        });
    });

    describe('POST /api/superheroes', () => {
        it('should create a new superhero without images', async () => {
            const newSuperhero = {
                nickname: 'Flash',
                real_name: 'Barry Allen',
                origin_description: 'Got struck by lightning...',
                superpowers: 'Super speed',
                catch_phrase: 'Fastest man alive!'
            };

            const mockCreatedSuperhero = {
                id: 3,
                ...newSuperhero,
                created_at: '2023-01-01',
                updated_at: '2023-01-01'
            };

            // Mock transaction
            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce() 
                    .mockResolvedValueOnce(), 
                release: jest.fn()
            };

            pool.connect.mockResolvedValue(mockClient);
            Superhero.create.mockResolvedValue(mockCreatedSuperhero);

            const response = await request(app)
                .post('/api/superheroes')
                .send(newSuperhero)
                .expect(201);

            expect(response.body.nickname).toBe(newSuperhero.nickname);
            expect(response.body.real_name).toBe(newSuperhero.real_name);
            expect(response.body.images).toEqual([]);
        });

        it('should validate required fields', async () => {
            const invalidSuperhero = {
                nickname: '', 
                real_name: 'Barry Allen'
            };

            await request(app)
                .post('/api/superheroes')
                .send(invalidSuperhero)
                .expect(400)
                .expect((res) => {
                    expect(res.body.error).toBe('Validation failed');
                    expect(res.body.details).toContain('Nickname is required');
                });
        });

        it('should handle database errors during creation', async () => {
            const newSuperhero = {
                nickname: 'Flash',
                real_name: 'Barry Allen'
            };

            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce() 
                    .mockResolvedValueOnce(), 
                release: jest.fn()
            };

            pool.connect.mockResolvedValue(mockClient);
            Superhero.create.mockRejectedValue(new Error('Database error'));

            await request(app)
                .post('/api/superheroes')
                .send(newSuperhero)
                .expect(500);

            expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
        });
    });

    describe('PUT /api/superheroes/:id', () => {
        it('should update existing superhero', async () => {
            const updateData = {
                nickname: 'Superman Updated',
                real_name: 'Clark Kent',
                origin_description: 'Updated origin...',
                superpowers: 'Updated powers',
                catch_phrase: 'Updated phrase!'
            };

            const mockExistingSuperhero = {
                id: 1,
                nickname: 'Superman',
                real_name: 'Clark Kent',
                images: []
            };

            const mockUpdatedSuperhero = {
                id: 1,
                ...updateData,
                created_at: '2023-01-01',
                updated_at: '2023-01-02'
            };

            // Mock transaction
            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce() 
                    .mockResolvedValueOnce(), 
                release: jest.fn()
            };

            pool.connect.mockResolvedValue(mockClient);

            // Mock model calls
            Superhero.findById.mockResolvedValue(mockExistingSuperhero);
            Superhero.update.mockResolvedValue(mockUpdatedSuperhero);
            Superhero.getImages.mockResolvedValue([]);

            const response = await request(app)
                .put('/api/superheroes/1')
                .send(updateData)
                .expect(200);

            expect(response.body.nickname).toBe(updateData.nickname);
            expect(response.body.images).toEqual([]);
        });

        it('should return 404 for non-existent superhero', async () => {
            const updateData = {
                nickname: 'Superman',
                real_name: 'Clark Kent'
            };

            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce() 
                    .mockResolvedValueOnce(), 
                release: jest.fn()
            };

            pool.connect.mockResolvedValue(mockClient);
            Superhero.findById.mockResolvedValue(null);

            await request(app)
                .put('/api/superheroes/999')
                .send(updateData)
                .expect(404);
        });
    });

    describe('DELETE /api/superheroes/:id', () => {
        it('should delete superhero and associated images', async () => {
            const mockImages = [
                { id: 1, path: 'uploads/image1.jpg' },
                { id: 2, path: 'uploads/image2.jpg' }
            ];

            const mockDeletedSuperhero = { id: 1, nickname: 'Superman' };

            // Mock transaction
            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce() 
                    .mockResolvedValueOnce(), 
                release: jest.fn()
            };

            pool.connect.mockResolvedValue(mockClient);

            // Mock model calls
            Superhero.getImages.mockResolvedValue(mockImages);
            Superhero.delete.mockResolvedValue(mockDeletedSuperhero);

            await request(app)
                .delete('/api/superheroes/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Superhero deleted successfully');
                });

            expect(deleteFile).toHaveBeenCalledTimes(2);
            expect(deleteFile).toHaveBeenCalledWith('uploads/image1.jpg');
            expect(deleteFile).toHaveBeenCalledWith('uploads/image2.jpg');
        });

        it('should return 404 for non-existent superhero', async () => {
            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce()  
                    .mockResolvedValueOnce(), 
                release: jest.fn()
            };

            pool.connect.mockResolvedValue(mockClient);
            Superhero.getImages.mockResolvedValue([]);
            Superhero.delete.mockResolvedValue(null);

            await request(app)
                .delete('/api/superheroes/999')
                .expect(404);
        });
    });

    describe('DELETE /api/superheroes/:id/images/:imageId', () => {
        it('should delete specific image', async () => {
            const mockSuperhero = {
                id: 1,
                nickname: 'Superman',
                images: []
            };

            const mockDeletedImage = {
                id: 1,
                superhero_id: 1,
                path: 'uploads/image1.jpg'
            };

            Superhero.findById.mockResolvedValue(mockSuperhero);
            Superhero.removeImage.mockResolvedValue(mockDeletedImage);

            await request(app)
                .delete('/api/superheroes/1/images/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Image deleted successfully');
                });

            expect(deleteFile).toHaveBeenCalledWith('uploads/image1.jpg');
        });

        it('should return 404 for non-existent image', async () => {
            const mockSuperhero = { id: 1, nickname: 'Superman' };

            Superhero.findById.mockResolvedValue(mockSuperhero);
            Superhero.removeImage.mockResolvedValue(null);

            await request(app)
                .delete('/api/superheroes/1/images/999')
                .expect(404);
        });
    });

    describe('Health Check', () => {
        it('should return health status', async () => {
            await request(app)
                .get('/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe('OK');
                    expect(res.body.timestamp).toBeDefined();
                });
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for non-existent routes', async () => {
            await request(app)
                .get('/non-existent-route')
                .expect(404)
                .expect((res) => {
                    expect(res.body.error).toBe('Route not found');
                });
        });
    });
});