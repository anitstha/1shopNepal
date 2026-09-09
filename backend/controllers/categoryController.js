const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')
const generateSlug = require('../utils/generateSlug')

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        description: 1,
        image: 1,
        createdAt: 1,
        updatedAt: 1,
        productCount: { $size: '$products' },
      },
    },
  ])
  res.json({
    success: true,
    count: categories.length,
    categories,
  })
})

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  res.json({
    success: true,
    category,
  })
})

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body

  if (!name || name.trim() === '') {
    res.status(400)
    throw new Error('Category name is required')
  }

  const slug = generateSlug(name)
  const existing = await Category.findOne({ $or: [{ slug }, { name: name.trim() }] })
  if (existing) {
    res.status(400)
    throw new Error('A category with this name or slug already exists')
  }

  const category = await Category.create({
    name: name.trim(),
    slug,
    description,
    image,
  })

  res.status(201).json({
    success: true,
    category,
  })
})

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  const { name, description, image } = req.body

  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400)
      throw new Error('Category name cannot be empty')
    }
    const trimName = name.trim()
    const newSlug = generateSlug(trimName)

    const duplicate = await Category.findOne({
      $or: [{ slug: newSlug }, { name: trimName }],
      _id: { $ne: category._id },
    })
    if (duplicate) {
      res.status(400)
      throw new Error('A category with this name or slug already exists')
    }

    category.name = trimName
    category.slug = newSlug
  }

  if (description !== undefined) category.description = description
  if (image !== undefined) category.image = image

  const updated = await category.save()

  res.json({
    success: true,
    category: updated,
  })
})

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  await category.deleteOne()

  res.json({
    success: true,
    message: 'Category deleted successfully',
  })
})

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
