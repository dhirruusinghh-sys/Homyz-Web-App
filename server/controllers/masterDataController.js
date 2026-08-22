import Category from '../models/Category.js';
import Amenity from '../models/Amenity.js';
import City from '../models/City.js';

// ---- CATEGORIES ----
export const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};
export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};
export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category removed' });
};

// ---- AMENITIES ----
export const getAmenities = async (req, res) => {
  const amenities = await Amenity.find({});
  res.json(amenities);
};
export const createAmenity = async (req, res) => {
  const amenity = await Amenity.create(req.body);
  res.status(201).json(amenity);
};
export const deleteAmenity = async (req, res) => {
  await Amenity.findByIdAndDelete(req.params.id);
  res.json({ message: 'Amenity removed' });
};

// ---- CITIES ----
export const getCities = async (req, res) => {
  const cities = await City.find({});
  res.json(cities);
};
export const createCity = async (req, res) => {
  const city = await City.create(req.body);
  res.status(201).json(city);
};
export const deleteCity = async (req, res) => {
  await City.findByIdAndDelete(req.params.id);
  res.json({ message: 'City removed' });
};
