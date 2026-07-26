import { type SchemaTypeDefinition } from 'sanity';
import { category } from './category';
import { product } from './product';
import { settings } from './settings';
import { order } from './order';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, settings, order],
};
