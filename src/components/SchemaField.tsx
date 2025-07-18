import React from 'react';
import { Button, Input, Select, Space, Switch, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined, FieldStringOutlined, FieldNumberOutlined, FieldBinaryOutlined, CalendarOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons';
import { SchemaField as SchemaFieldType, FieldType } from '../types';

const { Option } = Select;

interface SchemaFieldProps {
  field: SchemaFieldType;
  depth: number;
  onUpdateField: (id: string, updates: Partial<SchemaFieldType>) => void;
  onDeleteField: (id: string) => void;
  onAddNestedField: (parentId: string) => void;
}

const SchemaField: React.FC<SchemaFieldProps> = ({
  field,
  depth,
  onUpdateField,
  onDeleteField,
  onAddNestedField,
}) => {
  const handleNameChange = (value: string) => {
    onUpdateField(field.id, { name: value });
  };

  const handleTypeChange = (value: FieldType) => {
    const updates: Partial<SchemaFieldType> = { type: value };
    
    // Set appropriate default values based on type
    switch (value) {
      case 'String':
      case 'Email':
      case 'URL':
      case 'Date':
        updates.defaultValue = '';
        updates.children = undefined;
        break;
      case 'Number':
      case 'Integer':
      case 'Float':
        updates.defaultValue = 0;
        updates.children = undefined;
        break;
      case 'Boolean':
        updates.defaultValue = false;
        updates.children = undefined;
        break;
      case 'Array':
      case 'Object':
        updates.defaultValue = undefined;
        updates.children = [];
        break;
      default:
        updates.defaultValue = '';
        updates.children = undefined;
    }
    
    onUpdateField(field.id, updates);
  };

  const handleAddNestedField = () => {
    onAddNestedField(field.id);
  };

  const handleDeleteField = () => {
    onDeleteField(field.id);
  };

  const getFieldTypeIcon = (type: FieldType) => {
    switch (type) {
      case 'String': return <FieldStringOutlined style={{ color: '#1890ff' }} />;
      case 'Number': return <FieldNumberOutlined style={{ color: '#52c41a' }} />;
      case 'Integer': return <FieldNumberOutlined style={{ color: '#52c41a' }} />;
      case 'Float': return <FieldNumberOutlined style={{ color: '#52c41a' }} />;
      case 'Boolean': return <FieldBinaryOutlined style={{ color: '#722ed1' }} />;
      case 'Email': return <MailOutlined style={{ color: '#fa8c16' }} />;
      case 'URL': return <LinkOutlined style={{ color: '#13c2c2' }} />;
      case 'Date': return <CalendarOutlined style={{ color: '#eb2f96' }} />;
      case 'Array': return <UnorderedListOutlined style={{ color: '#faad14' }} />;
      case 'Object': return <AppstoreOutlined style={{ color: '#f5222d' }} />;
      default: return <FieldStringOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getFieldTypeColor = (type: FieldType) => {
    switch (type) {
      case 'String': return '#1890ff';
      case 'Number': case 'Integer': case 'Float': return '#52c41a';
      case 'Boolean': return '#722ed1';
      case 'Email': return '#fa8c16';
      case 'URL': return '#13c2c2';
      case 'Date': return '#eb2f96';
      case 'Array': return '#faad14';
      case 'Object': return '#f5222d';
      default: return '#1890ff';
    }
  };

  const indentStyle = {
    marginLeft: `${depth * 24}px`,
  };

  const cardStyle = {
    background: depth % 2 === 0 ? '#ffffff' : '#fafafa',
    border: `1px solid ${depth === 0 ? '#d9d9d9' : '#e8e8e8'}`,
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    boxShadow: depth === 0 ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
    borderLeft: `4px solid ${getFieldTypeColor(field.type)}`,
  };

  return (
    <div style={indentStyle}>
      <div style={cardStyle}>
        <Space size="small" align="center" style={{ width: '100%', flexWrap: 'wrap' }}>
          <Input
            placeholder="Field name"
            value={field.name}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{ width: '140px' }}
          />
          
          <Select
            value={field.type}
            onChange={handleTypeChange}
            style={{ width: '110px' }}
          >
            <Option value="String">String</Option>
            <Option value="Number">Number</Option>
            <Option value="Integer">Integer</Option>
            <Option value="Float">Float</Option>
            <Option value="Boolean">Boolean</Option>
            <Option value="Email">Email</Option>
            <Option value="URL">URL</Option>
            <Option value="Date">Date</Option>
            <Option value="Array">Array</Option>
            <Option value="Object">Object</Option>
          </Select>


          {/* Complex type buttons */}
          {(['Array', 'Object'] as FieldType[]).includes(field.type) && (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddNestedField}
              size="small"
              style={{ borderColor: getFieldTypeColor(field.type), color: getFieldTypeColor(field.type) }}
            >
              Add {field.type === 'Array' ? 'Item' : 'Property'}
            </Button>
          )}

          <Tag color={getFieldTypeColor(field.type)} style={{ margin: 0 }}>
            {field.type}
          </Tag>

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteField}
            size="small"
          />
        </Space>
      </div>

      {(['Array', 'Object'] as FieldType[]).includes(field.type) && field.children && field.children.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          {field.children.map((child) => (
            <SchemaField
              key={child.id}
              field={child}
              depth={depth + 1}
              onUpdateField={onUpdateField}
              onDeleteField={onDeleteField}
              onAddNestedField={onAddNestedField}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemaField;
