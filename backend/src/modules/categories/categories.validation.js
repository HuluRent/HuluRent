const {z} = require('zod');

const createCategorySchema = z.object({
    name: z.string().min(3),
    slug: z.string().optional(),
    parentId: z.string().uuid().optional(),
});

const updateCategorySchema = z.object({
    name: z.string().min(3).optional(),
    slug: z.string().optional(),
    parentId: z.string().uuid().optional(),
});

module.exports = {createCategorySchema, updateCategorySchema};      