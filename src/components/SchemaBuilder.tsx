import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Divider, Row, Col, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, DownOutlined, CopyOutlined, EyeOutlined, CodeOutlined } from '@ant-design/icons';
import SchemaField from './SchemaField';
import { SchemaField as SchemaFieldType, FieldType } from '../types';
import {
  createDefaultField,
  convertToJSONSchema,
  updateFieldInArray,
  removeFieldFromArray,
  addFieldToParent,
} from '../utils/schemaUtils';

const { Title } = Typography;

const SchemaBuilder: React.FC = () => {
  const [fields, setFields] = useState<SchemaFieldType[]>([]);
  const [jsonSchema, setJsonSchema] = useState<any>({});

  // Update JSON schema whenever fields change
  useEffect(() => {
    const schema = convertToJSONSchema(fields);
    setJsonSchema(schema);
  }, [fields]);

  const handleAddField = (type: FieldType = 'String') => {
    const newField = createDefaultField(type);
    setFields([...fields, newField]);
    message.success(`Added new ${type} field`);
  };

  const handleUpdateField = (id: string, updates: Partial<SchemaFieldType>) => {
    setFields(updateFieldInArray(fields, id, updates));
  };

  const handleDeleteField = (id: string) => {
    setFields(removeFieldFromArray(fields, id));
    message.success('Field deleted');
  };

  const handleAddNestedField = (parentId: string) => {
    const newField = createDefaultField('String');
    setFields(addFieldToParent(fields, parentId, newField));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonSchema, null, 2));
    message.success('JSON schema copied to clipboard!');
  };

  const addFieldMenuItems: MenuProps['items'] = [
    {
      key: 'string',
      label: 'String',
      onClick: () => handleAddField('String'),
    },
    {
      key: 'number',
      label: 'Number',
      onClick: () => handleAddField('Number'),
    },
    {
      key: 'integer',
      label: 'Integer',
      onClick: () => handleAddField('Integer'),
    },
    {
      key: 'float',
      label: 'Float',
      onClick: () => handleAddField('Float'),
    },
    {
      key: 'boolean',
      label: 'Boolean',
      onClick: () => handleAddField('Boolean'),
    },
    {
      key: 'email',
      label: 'Email',
      onClick: () => handleAddField('Email'),
    },
    {
      key: 'url',
      label: 'URL',
      onClick: () => handleAddField('URL'),
    },
    {
      key: 'date',
      label: 'Date',
      onClick: () => handleAddField('Date'),
    },
    {
      key: 'array',
      label: 'Array',
      onClick: () => handleAddField('Array'),
    },
    {
      key: 'object',
      label: 'Object',
      onClick: () => handleAddField('Object'),
    },
    {
      key: 'nested',
      label: 'Nested',
      onClick: () => handleAddField('Nested'),
    },
  ];

  return (
    <div style={{ 
      maxWidth: '1600px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      borderRadius: '12px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1} style={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            🚀 JSON Schema Builder
          </Title>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            margin: 0
          }}>
            Create JSON schemas with ease - Real-time preview and validation
          </p>
        </div>
      
      <Row gutter={24} style={{ minHeight: '600px' }}>
        {/* Schema Builder Side */}
        <Col span={12}>
          <Card 
            title={
              <Space>
                <CodeOutlined style={{ color: '#1890ff' }} />
                <span>Schema Fields</span>
                <Dropdown menu={{ items: addFieldMenuItems }} placement="bottomRight">
                  <Button type="primary" size="small">
                    <PlusOutlined /> Add Field <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            }
            style={{ height: '100%' }}
            bodyStyle={{ 
              padding: '16px',
              maxHeight: '520px',
              overflowY: 'auto'
            }}
          >
            {fields.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                padding: '80px 20px',
                fontSize: '16px'
              }}>
                No fields added yet.<br/>
                Click "Add Field" to get started.
              </div>
            ) : (
              <div>
                {fields.map((field) => (
                  <SchemaField
                    key={field.id}
                    field={field}
                    depth={0}
                    onUpdateField={handleUpdateField}
                    onDeleteField={handleDeleteField}
                    onAddNestedField={handleAddNestedField}
                  />
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* JSON Preview Side */}
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Space>
                  <EyeOutlined style={{ color: '#52c41a' }} />
                  <span>JSON Schema Preview (Real-time)</span>
                </Space>
                {fields.length > 0 && (
                  <Button 
                    type="default" 
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={handleCopyToClipboard}
                  >
                    Copy
                  </Button>
                )}
              </div>
            }
            style={{ 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            bodyStyle={{ 
              padding: '16px',
              maxHeight: '520px',
              overflowY: 'auto'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #e9ecef',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                fontSize: '13px',
                lineHeight: '1.6',
                margin: 0,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
                color: '#2d3748',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                {JSON.stringify(jsonSchema, null, 2)}
              </pre>
            </div>
            
            {fields.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                padding: '80px 20px',
                fontSize: '16px'
              }}>
                🎯 JSON Schema will appear here<br/>
                when you add fields
              </div>
            )}
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default SchemaBuilder;
