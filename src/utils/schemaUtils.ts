import { SchemaField, JSONSchema, JSONSchemaProperty, FieldType } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createDefaultField = (type: FieldType = 'String'): SchemaField => {
  const id = generateId();
  const field: SchemaField = {
    id,
    name: '',
    type,
  };

  switch (type) {
    case 'String':
    case 'Email':
    case 'URL':
    case 'Date':
      field.defaultValue = '';
      break;
    case 'Number':
    case 'Integer':
    case 'Float':
      field.defaultValue = 0;
      break;
    case 'Boolean':
      field.defaultValue = false;
      break;
    case 'Array':
    case 'Object':
      field.children = [];
      break;
    default:
      field.defaultValue = '';
  }

  return field;
};

export const convertToJSONSchema = (fields: SchemaField[]): any => {
  const result: any = {};

  fields.forEach((field) => {
    if (field.name) {
      result[field.name] = convertFieldToSimpleType(field);
    }
  });

  return result;
};

const convertFieldToSimpleType = (field: SchemaField): any => {
  switch (field.type) {
    case 'String':
    case 'Email':
    case 'URL':
    case 'Date':
      return 'string';
    case 'Number':
    case 'Integer':
    case 'Float':
      return 'number';
    case 'Boolean':
      return 'boolean';
    case 'Array':
      return 'array';
    case 'Object':
      const nestedObject: any = {};
      if (field.children) {
        field.children.forEach((child) => {
          if (child.name) {
            nestedObject[child.name] = convertFieldToSimpleType(child);
          }
        });
      }
      return nestedObject;
    default:
      return 'string';
  }
};

const convertFieldToJSONSchemaProperty = (field: SchemaField): JSONSchemaProperty => {
  switch (field.type) {
    case 'String':
    case 'Email':
    case 'URL':
    case 'Date':
      return {
        type: 'string',
      };
    case 'Number':
    case 'Integer':
    case 'Float':
      return {
        type: 'number',
      };
    case 'Boolean':
      return {
        type: 'boolean',
      };
    case 'Array':
      return {
        type: 'array',
      };
    case 'Object':
      const nestedProperties: { [key: string]: JSONSchemaProperty } = {};

      if (field.children) {
        field.children.forEach((child) => {
          if (child.name) {
            nestedProperties[child.name] = convertFieldToJSONSchemaProperty(child);
          }
        });
      }

      return {
        type: 'object',
        properties: nestedProperties,
      };
    default:
      return { type: 'string' };
  }
};

export const findFieldById = (fields: SchemaField[], id: string): SchemaField | null => {
  for (const field of fields) {
    if (field.id === id) {
      return field;
    }
    if (field.children) {
      const found = findFieldById(field.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateFieldInArray = (fields: SchemaField[], id: string, updates: Partial<SchemaField>): SchemaField[] => {
  return fields.map((field) => {
    if (field.id === id) {
      return { ...field, ...updates };
    }
    if (field.children) {
      return {
        ...field,
        children: updateFieldInArray(field.children, id, updates),
      };
    }
    return field;
  });
};

export const removeFieldFromArray = (fields: SchemaField[], id: string): SchemaField[] => {
  return fields.filter((field) => {
    if (field.id === id) {
      return false;
    }
    if (field.children) {
      field.children = removeFieldFromArray(field.children, id);
    }
    return true;
  });
};

export const addFieldToParent = (fields: SchemaField[], parentId: string, newField: SchemaField): SchemaField[] => {
  return fields.map((field) => {
    if (field.id === parentId && (field.type === 'Object' || field.type === 'Array')) {
      return {
        ...field,
        children: [...(field.children || []), newField],
      };
    }
    if (field.children) {
      return {
        ...field,
        children: addFieldToParent(field.children, parentId, newField),
      };
    }
    return field;
  });
};
