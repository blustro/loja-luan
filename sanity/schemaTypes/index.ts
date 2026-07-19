import { type SchemaTypeDefinition } from 'sanity';
import { category } from './category';
import { product, productVariant } from './product';
import { settings } from './settings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, productVariant, settings],
};
