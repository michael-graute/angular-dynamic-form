# Async Validator Guide

## Overview

The dynamic-form library now supports asynchronous backend validation. This allows you to validate form field values against a backend API, enabling use cases like checking username availability, validating email addresses in your database, or any other server-side validation logic.

## Features

- **Backend Validation**: Send field values to a REST endpoint for validation
- **Configurable Trigger**: Choose between debounce (while typing) or blur (on field exit)
- **Custom Debounce Time**: Configure how long to wait after typing stops before validating
- **Error Handling**: Gracefully handles network errors with user-friendly messages
- **Custom Error Messages**: Override default error messages with your own
- **Integrated with Existing Validators**: Combine async validation with sync validators

## Configuration

Add an `asyncBackend` validator to your form element configuration:

```typescript
{
  key: "username",
  label: "Username",
  type: "input",
  validators: [
    {
      name: "required",
      errorMessage: "Username is required"
    },
    {
      name: "asyncBackend",
      asyncUrl: "/api/validate/username",
      asyncTrigger: "debounce",  // or "blur"
      asyncDebounceTime: 500,    // milliseconds (optional, default: 500)
      errorMessage: "Username validation failed: {message}"
    }
  ]
}
```

## Validator Properties

### `name` (required)
Must be set to `"asyncBackend"` to use async validation.

### `asyncUrl` (required)
The backend endpoint URL for validation. Can be relative or absolute.

**Example:**
- Relative: `"/api/validate/username"`
- Absolute: `"https://api.example.com/validate/username"`

### `asyncTrigger` (optional)
When to trigger the validation:

- `"debounce"` (default): Validates after user stops typing for the configured debounce time
- `"blur"`: Validates only when the field loses focus

**Use Cases:**
- **Debounce**: Real-time feedback as user types (e.g., username availability)
- **Blur**: Validate only after user finishes (e.g., less critical validations, reduce server load)

### `asyncDebounceTime` (optional)
Time in milliseconds to wait after typing stops before validating.

- Default: `500ms`
- Only applies when `asyncTrigger` is `"debounce"`
- Higher values = less server requests, slower feedback
- Lower values = more server requests, faster feedback

**Recommended Values:**
- `300-500ms`: Real-time validation with reasonable server load
- `800-1000ms`: Slower feedback, minimal server load
- `100-200ms`: Very responsive, higher server load

### `errorMessage` (optional)
Custom error message template. Use `{message}` placeholder to include the backend's error message.

**Default:** `"{message}"`

**Examples:**
```typescript
errorMessage: "Username validation failed: {message}"
errorMessage: "This username is not available: {message}"
errorMessage: "{message}"  // Use backend message directly
```

## Backend Response Format

The backend endpoint must return a JSON response in this format:

### Success Response
```json
{
  "valid": true
}
```

### Error Response
```json
{
  "valid": false,
  "error": "Username 'admin' is already taken"
}
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `valid` | boolean | Yes | `true` if validation passed, `false` if failed |
| `error` | string | No | Error message to display (only when `valid: false`) |

## Request Format

The validator sends a POST request with the following body:

```json
{
  "value": "user-entered-value"
}
```

### Example Backend Implementation (Node.js/Express)

```javascript
app.post('/api/validate/username', async (req, res) => {
  const { value } = req.body;

  // Check if username exists in database
  const exists = await db.users.exists({ username: value });

  if (exists) {
    return res.json({
      valid: false,
      error: `Username '${value}' is already taken`
    });
  }

  return res.json({ valid: true });
});
```

### Example Backend Implementation (Python/Flask)

```python
@app.route('/api/validate/username', methods=['POST'])
def validate_username():
    data = request.get_json()
    value = data.get('value')

    # Check if username exists in database
    exists = db.users.find_one({'username': value})

    if exists:
        return jsonify({
            'valid': False,
            'error': f"Username '{value}' is already taken"
        })

    return jsonify({'valid': True})
```

## Complete Examples

### Example 1: Username Availability (Debounce)

```typescript
{
  key: "username",
  label: "Username",
  type: "input",
  controlType: "text",
  settings: {
    floatingLabel: true
  },
  validators: [
    {
      name: "required",
      errorMessage: "Username is required"
    },
    {
      name: "minLength",
      value: 3,
      errorMessage: "Username must be at least 3 characters"
    },
    {
      name: "asyncBackend",
      asyncUrl: "/api/validate/username",
      asyncTrigger: "debounce",
      asyncDebounceTime: 500,
      errorMessage: "{message}"
    }
  ],
  helpText: "Choose a unique username (3+ characters)"
}
```

**User Experience:**
1. User types "joh" → Required and minLength validate immediately
2. User types "john" → After 500ms of inactivity, backend validation fires
3. If username exists → Shows error message from backend
4. If available → No error, field is valid

### Example 2: Email Verification (On Blur)

```typescript
{
  key: "email",
  label: "Email Address",
  type: "input",
  controlType: "email",
  settings: {
    floatingLabel: true
  },
  validators: [
    {
      name: "required"
    },
    {
      name: "email",
      errorMessage: "Invalid email format"
    },
    {
      name: "asyncBackend",
      asyncUrl: "/api/validate/email",
      asyncTrigger: "blur",
      errorMessage: "Email validation error: {message}"
    }
  ],
  helpText: "Email will be verified when you leave this field"
}
```

**User Experience:**
1. User types email address
2. Local email format validation happens immediately
3. User clicks away from field (blur event)
4. Backend validation fires to check if email is already registered
5. If registered → Shows error
6. If available → Field is valid

### Example 3: Custom Validation Endpoint

```typescript
{
  key: "companyDomain",
  label: "Company Domain",
  type: "input",
  controlType: "text",
  validators: [
    {
      name: "required"
    },
    {
      name: "pattern",
      value: "^[a-z0-9-]+\\.[a-z]{2,}$",
      errorMessage: "Invalid domain format (e.g., example.com)"
    },
    {
      name: "asyncBackend",
      asyncUrl: "https://api.myapp.com/validate/domain",
      asyncTrigger: "debounce",
      asyncDebounceTime: 800,
      errorMessage: "Domain validation failed: {message}"
    }
  ],
  helpText: "Enter your company's domain name"
}
```

### Example 4: Multiple Async Validators (NOT SUPPORTED)

**Note:** Currently, only **one** async validator per field is supported. Combine your validation logic on the backend if you need multiple checks.

## Loading States

When async validation is running, Angular automatically adds the `ng-pending` CSS class to the form control. You can style this to show a loading indicator:

```scss
// In your component's SCSS file
.ng-pending {
  background-image: url('assets/spinner.gif');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px 20px;
}

// Or using Bootstrap spinner
.ng-pending::after {
  content: '⏳';
  position: absolute;
  right: 10px;
  animation: spin 1s linear infinite;
}
```

## Error Handling

The async validator handles several error scenarios automatically:

### Network Errors
If the HTTP request fails (network down, 500 error, etc.), the validator returns:
```typescript
{
  asyncBackend: {
    message: 'Validation request failed. Please try again.',
    value: 'user-input'
  }
}
```

### Timeout
Async validators will timeout based on Angular's default HTTP timeout settings. Consider implementing a custom timeout on the backend or in your HTTP interceptor.

### Empty Values
Empty values are **not validated**. The async validator returns `null` (valid) for empty inputs. Use the `required` validator if the field must have a value.

## Performance Considerations

### Debounce Time
Choose an appropriate debounce time based on your use case:

| Use Case | Recommended Time | Reasoning |
|----------|------------------|-----------|
| Username availability | 500-800ms | User types fast, need balance between UX and server load |
| Email verification | blur only | Less urgent, validate when user finishes |
| API key validation | 1000ms+ | Expensive validation, reduce server requests |
| Real-time search | 300-500ms | Need fast feedback for autocomplete |

### Reducing Server Load

1. **Use blur trigger** for non-critical validations
2. **Increase debounce time** to reduce request frequency
3. **Implement backend caching** for common validation requests
4. **Rate limit** validation endpoints on the backend
5. **Combine validations** - validate multiple fields in one request if possible

### Caching

The validator does not implement client-side caching. If you need caching:
- Implement it in the backend
- Use HTTP caching headers
- Create a custom HTTP interceptor with caching logic

## Combining with Sync Validators

Async validators run **after** synchronous validators pass. This is efficient because:

1. **Sync validators** (required, minLength, pattern, etc.) run first
2. If any sync validator fails → async validator doesn't run
3. Only when all sync validators pass → async validator runs

**Example Order:**
```typescript
validators: [
  { name: "required" },           // 1st: Runs immediately
  { name: "minLength", value: 3 }, // 2nd: Runs immediately
  { name: "asyncBackend", ... }    // 3rd: Runs only if required & minLength pass
]
```

## Testing

### Mock API for Development

Create mock responses for local development:

```typescript
// src/app/interceptors/mock-api.interceptor.ts
export function mockApiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (req.url.includes('/validate/username')) {
    const value = (req.body as any)?.value;

    // Simulate async delay
    return of(new HttpResponse({
      status: 200,
      body: {
        valid: value !== 'admin', // 'admin' is taken
        error: value === 'admin' ? 'Username already taken' : undefined
      }
    })).pipe(delay(500));
  }

  return next(req);
}
```

### Unit Testing

When unit testing components with async validators:

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should show async validation error', fakeAsync(() => {
  const control = component.form.get('username');

  control.setValue('admin');
  tick(500); // Wait for debounce

  expect(control.hasError('asyncBackend')).toBe(true);
  expect(control.errors?.asyncBackend.message).toBe('Username already taken');
}));
```

## Troubleshooting

### Validation Not Firing

**Problem:** Async validation doesn't run when expected.

**Solutions:**
1. Check that sync validators are passing first
2. Verify `asyncUrl` is correct
3. Check browser console for HTTP errors
4. Ensure `name` is exactly `"asyncBackend"`

### Too Many Requests

**Problem:** Backend receives too many validation requests.

**Solutions:**
1. Increase `asyncDebounceTime` to 800-1000ms
2. Change `asyncTrigger` to `"blur"`
3. Add backend rate limiting
4. Implement request cancellation (handled automatically by Angular)

### Error Message Not Showing

**Problem:** Backend returns error but it doesn't display.

**Solutions:**
1. Check backend response format matches `{ valid: false, error: "message" }`
2. Verify `errorMessage` template includes `{message}` placeholder
3. Check that error display template in component HTML is correct
4. Look for JavaScript console errors

### CORS Errors

**Problem:** Browser blocks async validation requests due to CORS.

**Solutions:**
1. Configure backend CORS headers:
   ```
   Access-Control-Allow-Origin: http://localhost:4200
   Access-Control-Allow-Methods: POST
   Access-Control-Allow-Headers: Content-Type
   ```
2. Use proxy configuration in development (`proxy.conf.json`)
3. Ensure backend allows OPTIONS preflight requests

## API Reference

### DynamicFormValidators.asyncBackend()

```typescript
static asyncBackend(
  http: HttpClient,
  url: string,
  debounceTime: number = 500
): AsyncValidatorFn
```

**Parameters:**
- `http`: Angular HttpClient instance
- `url`: Backend validation endpoint URL
- `debounceTime`: Debounce time in milliseconds (default: 500)

**Returns:** AsyncValidatorFn that validates against backend

**Error Response Format:**
```typescript
{
  asyncBackend: {
    message: string,  // Error message from backend or default
    value: any        // The value that was validated
  }
}
```

### ElementValidator Type

```typescript
{
  name: "asyncBackend";
  asyncUrl: string;                    // Required for async validators
  asyncTrigger?: "blur" | "debounce";  // Optional, default: "debounce"
  asyncDebounceTime?: number;          // Optional, default: 500
  errorMessage?: string;               // Optional, default: "{message}"
}
```

## Migration from Sync to Async Validation

If you have existing frontend validation that should be moved to the backend:

### Before (Sync Validation)
```typescript
{
  key: "username",
  validators: [
    {
      name: "pattern",
      value: "^[a-zA-Z0-9_]+$",
      errorMessage: "Username can only contain letters, numbers, and underscores"
    }
  ]
}
```

### After (Async Validation)
```typescript
{
  key: "username",
  validators: [
    {
      name: "pattern",
      value: "^[a-zA-Z0-9_]+$",
      errorMessage: "Username can only contain letters, numbers, and underscores"
    },
    {
      name: "asyncBackend",
      asyncUrl: "/api/validate/username",
      asyncTrigger: "debounce",
      errorMessage: "{message}"
    }
  ]
}
```

**Keep sync validation** for format/structure checks, add async validation for backend checks (availability, uniqueness, etc.).

## Best Practices

1. **Always combine with `required`** - Async validators don't run on empty values
2. **Use debounce for real-time, blur for less urgent** - Choose based on UX needs
3. **Provide helpful error messages** - Include specifics from backend: `"{message}"`
4. **Handle network errors gracefully** - Default error message helps but consider UX
5. **Don't over-validate** - Balance user experience with server load
6. **Test with slow networks** - Use browser DevTools to simulate slow 3G
7. **Implement backend rate limiting** - Protect your API from abuse
8. **Cache validation results** - Implement on backend for common requests
9. **Monitor validation metrics** - Track validation success/failure rates
10. **Document backend requirements** - Share validation logic with frontend team

## Security Considerations

1. **Always validate on backend** - Never trust client-side validation alone
2. **Rate limit validation endpoints** - Prevent abuse and DoS attacks
3. **Sanitize user input** - Prevent SQL injection, XSS in validation logic
4. **Don't expose sensitive data** - Error messages shouldn't reveal system internals
5. **Use HTTPS in production** - Encrypt validation requests
6. **Implement authentication** - Require valid session for validation requests
7. **Log validation attempts** - Monitor for suspicious patterns
8. **Limit request size** - Prevent large payload attacks

## Examples in This Project

See the validation examples page at `/validation-examples` for live demonstrations:

1. **Async Username (Debounce)** - Validates after 800ms of inactivity
2. **Async Email (Blur)** - Validates when field loses focus

Both examples use mock API endpoints for demonstration purposes.
