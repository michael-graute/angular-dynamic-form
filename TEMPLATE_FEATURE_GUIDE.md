# Data-Select Template Feature Guide

## Overview

The data-select component now supports custom templates for rendering complex data structures. This allows you to define HTML templates with placeholder syntax that will be rendered for both dropdown items and the selected value display.

## Features

- **Placeholder Syntax**: Use `{{property}}` to access data properties
- **Nested Properties**: Support for dot notation like `{{user.address.city}}`
- **HTML Support**: Full HTML with Bootstrap classes and custom styling
- **Separate Templates**: Different templates for list items vs selected display
- **XSS Protection**: All templates are sanitized before rendering
- **Backward Compatible**: Existing `labelKey`/`valueKey` approach still works

## Configuration

Add `itemTemplate` and/or `selectedTemplate` to your data-select settings:

```typescript
{
  key: "assignedUser",
  label: "Assign to User",
  type: "data-select",
  settings: {
    asyncURL: "/user-list",
    valueKey: "id",

    // Template for dropdown list items
    itemTemplate: '<div><strong>{{name}}</strong> <span class="text-muted">({{email}})</span><br/><small class="badge bg-primary">{{role}}</small></div>',

    // Template for selected value display
    selectedTemplate: '<strong>{{name}}</strong> <span class="text-muted">({{role}})</span>'
  }
}
```

## Template Properties

### `itemTemplate` (optional)
- Template string for rendering each dropdown list item
- Receives the full data object for each option
- Supports HTML and Bootstrap classes
- Falls back to `labelKey` if not provided

### `selectedTemplate` (optional)
- Template string for rendering the selected value in the input field
- Receives the full selected data object
- Supports HTML and Bootstrap classes
- Falls back to `labelKey` if not provided

## Examples

### Basic Template with Simple Properties

```typescript
settings: {
  asyncURL: "/api/users",
  valueKey: "id",
  itemTemplate: '{{name}} - {{email}}',
  selectedTemplate: '{{name}}'
}
```

**Data structure:**
```json
[
  { "id": 1, "name": "John Doe", "email": "john@example.com" },
  { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
]
```

### Rich HTML Template with Bootstrap Classes

```typescript
settings: {
  asyncURL: "/api/users",
  valueKey: "id",
  itemTemplate: `
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <strong>{{name}}</strong>
        <br/>
        <small class="text-muted">{{email}}</small>
      </div>
      <span class="badge bg-{{roleColor}}">{{role}}</span>
    </div>
  `,
  selectedTemplate: '<strong>{{name}}</strong> <span class="badge bg-secondary">{{role}}</span>'
}
```

### Nested Property Access

```typescript
settings: {
  asyncURL: "/api/companies",
  valueKey: "id",
  itemTemplate: `
    <div>
      <strong>{{company.name}}</strong>
      <br/>
      <small>{{company.address.city}}, {{company.address.country}}</small>
      <br/>
      <span class="text-muted">{{contact.email}}</span>
    </div>
  `,
  selectedTemplate: '{{company.name}} ({{company.address.city}})'
}
```

**Data structure:**
```json
[
  {
    "id": 1,
    "company": {
      "name": "Acme Corp",
      "address": {
        "city": "New York",
        "country": "USA"
      }
    },
    "contact": {
      "email": "contact@acme.com"
    }
  }
]
```

### Multi-line Template with Icons

```typescript
settings: {
  asyncURL: "/api/products",
  valueKey: "id",
  itemTemplate: `
    <div>
      <div class="d-flex align-items-center mb-1">
        <i class="bi-box-seam me-2"></i>
        <strong>{{name}}</strong>
      </div>
      <div class="text-muted small">
        <i class="bi-tag"></i> ${{price}} |
        <i class="bi-check-circle"></i> {{stock}} in stock
      </div>
    </div>
  `,
  selectedTemplate: '{{name}} - ${{price}}'
}
```

## Use Cases

### 1. User Selection with Role Display
Display user information with name, email, and role badges in the dropdown, but only show name and role when selected.

### 2. Product Catalog
Show product details including price, stock, and category in the dropdown, with simplified display when selected.

### 3. Location Picker
Display full address with city, state, and country in dropdown, showing only city when selected.

### 4. Company Directory
Show company name, location, and contact information in dropdown, displaying just company name when selected.

### 5. Complex Hierarchical Data
Access nested properties like `department.manager.name` or `project.team.lead.email`.

## Technical Details

### Template Parsing
- Templates are parsed using regex: `/\{\{([^}]+)\}\}/g`
- Whitespace around property names is automatically trimmed
- Missing properties return empty string instead of undefined
- Nested properties use `Array.reduce()` for safe traversal

### Security
- All rendered templates are sanitized using Angular's `DomSanitizer`
- Script tags and dangerous attributes are automatically removed
- Safe HTML, CSS classes, and Bootstrap components are allowed

### Performance
- Template parsing happens only when rendering
- Virtual scrolling still works with templates (>100 items)
- TrackBy optimization applied to prevent unnecessary re-renders

### Backward Compatibility
If templates are not provided, the component falls back to:
1. `labelKey` - Primary display field
2. `valueKey` - Fallback if labelKey not specified
3. `String(dataset)` - Final fallback for primitive values

## Migration Guide

### Before (using labelKey)
```typescript
settings: {
  asyncURL: "/user-list",
  valueKey: "id",
  labelKey: "name"
}
```

### After (using templates)
```typescript
settings: {
  asyncURL: "/user-list",
  valueKey: "id",
  itemTemplate: '<strong>{{name}}</strong> <span class="text-muted">({{email}})</span>',
  selectedTemplate: '{{name}}'
}
```

### Both (templates override labelKey when present)
```typescript
settings: {
  asyncURL: "/user-list",
  valueKey: "id",
  labelKey: "name", // Used as fallback if templates not provided
  itemTemplate: '{{name}} - {{role}}',
  selectedTemplate: '{{name}}'
}
```

## Testing

See the example at `/data-select-example` which demonstrates:
- Standard labelKey approach (first field)
- Custom template approach (second field)
- Both using the same data source for comparison

## Limitations

1. **No JavaScript Execution**: Templates are string-based, not executable code
2. **No Conditional Logic**: Cannot use `if/else` in templates
3. **No Loops**: Cannot iterate over arrays within templates
4. **No Filters/Pipes**: Angular pipes are not supported
5. **Static HTML Only**: Templates are evaluated once per render

For complex logic, consider preprocessing your data before passing it to the component.

## API Reference

### Settings Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `itemTemplate` | string | No | HTML template string for dropdown items with `{{property}}` placeholders |
| `selectedTemplate` | string | No | HTML template string for selected value display with `{{property}}` placeholders |
| `valueKey` | string | Yes* | Property path to extract as form value |
| `labelKey` | string | No | Fallback property for display if no template provided |
| `asyncURL` | string | Yes* | API endpoint to load options from |

*One of `asyncURL` or static `options` array is required

### Component Methods

#### `parseTemplate(template: string, data: any): SafeHtml`
Parses template string and replaces placeholders with actual values.

**Parameters:**
- `template` - Template string with `{{property}}` placeholders
- `data` - Data object containing the values

**Returns:** Sanitized HTML string with placeholders replaced

#### `getNestedProperty(obj: any, path: string): any`
Retrieves nested property value using dot notation.

**Parameters:**
- `obj` - Object to traverse
- `path` - Dot-separated property path (e.g., "user.address.city")

**Returns:** Value at the path or undefined if not found
