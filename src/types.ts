export type FieldType = 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' | 'Date' | 'Email' | 'URL' | 'Integer' | 'Float' | 'Nested';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  children?: SchemaField[];
  defaultValue?: string | number | boolean;
}

export interface SchemaData {
  fields: SchemaField[];
}

export interface JSONSchemaProperty {
  type: string;
  default?: any;
  format?: string;
  multipleOf?: number;
  items?: JSONSchemaProperty;
  properties?: { [key: string]: JSONSchemaProperty };
  required?: string[];
}

export interface JSONSchema {
  type: 'object';
  properties: { [key: string]: JSONSchemaProperty };
}
