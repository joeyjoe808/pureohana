# Pure Ohana Data Architecture - Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Initialize Container (main.tsx)
```typescript
import { Container } from './infrastructure/container';

Container.initialize(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 2. Use Repository in Component
```typescript
import { useGalleryRepository } from '../infrastructure/container';
import { isSuccess } from '../domain';

function MyComponent() {
  const galleryRepo = useGalleryRepository();

  const result = await galleryRepo.findAll();
  if (isSuccess(result)) {
    setGalleries(result.value);
  }
}
```

### 3. Validate Inputs
```typescript
import { validate, CreateGallerySchema } from '../domain';

const validation = validate(CreateGallerySchema, formData);
if (!validation.success) {
  setErrors(validation.errors);
  return;
}
```

---

## 📦 Common Imports

```typescript
// Domain types and models
import {
  Gallery,
  Photo,
  Inquiry,
  GalleryCategory,
  InquiryType,
  InquiryStatus
} from '../domain/models';

// Repository interfaces
import {
  IGalleryRepository,
  IPhotoRepository,
  IInquiryRepository
} from '../domain/repositories';

// Validation schemas
import {
  CreateGallerySchema,
  UpdatePhotoSchema,
  CreateInquirySchema,
  validate
} from '../domain/validation/schemas';

// Result type helpers
import {
  Result,
  isSuccess,
  isFailure,
  success,
  failure
} from '../domain/core/Result';

// Error types
import {
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError
} from '../domain/core/errors';

// Repository hooks
import {
  useGalleryRepository,
  usePhotoRepository,
  useInquiryRepository
} from '../infrastructure/container';
```

---

## 🎯 Common Patterns

### Fetch Data

```typescript
const galleryRepo = useGalleryRepository();

// Fetch all
const result = await galleryRepo.findAll({
  isPublished: true,
  orderBy: 'display_order',
  orderDirection: 'asc',
  limit: 20
});

// Fetch one by ID
const result = await galleryRepo.findById('gallery-id');

// Fetch one by slug
const result = await galleryRepo.findBySlug('wedding-gallery');
```

### Create Data with Validation

```typescript
// 1. Validate
const validation = validate(CreateGallerySchema, formData);
if (!validation.success) {
  setErrors(validation.errors);
  return;
}

// 2. Create
const result = await galleryRepo.create(validation.data);

// 3. Handle result
if (isSuccess(result)) {
  console.log('Created:', result.value);
} else {
  console.error('Error:', result.error.message);
}
```

### Update Data

```typescript
const result = await galleryRepo.update('gallery-id', {
  title: 'New Title',
  isPublished: true
});

if (isSuccess(result)) {
  setGallery(result.value);
}
```

### Delete Data

```typescript
const result = await galleryRepo.delete('gallery-id', true); // true = delete photos too

if (isSuccess(result)) {
  console.log('Deleted successfully');
}
```

### Error Handling

```typescript
const result = await galleryRepo.findById('123');

if (isSuccess(result)) {
  return result.value;
}

// Type-safe error handling
if (result.error instanceof NotFoundError) {
  return null; // or show 404
}
else if (result.error instanceof ValidationError) {
  setFieldErrors(result.error.fields);
}
else if (result.error instanceof DatabaseError) {
  showErrorMessage('Database error occurred');
}
else {
  showErrorMessage(result.error.message);
}
```

---

## 📸 Photo Operations

### Upload Photo

```typescript
const photoRepo = usePhotoRepository();

// Validate file
const validation = validateImageFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}

// Upload
const result = await photoRepo.upload({
  galleryId: 'gallery-id',
  file: file,
  title: 'Beautiful Sunset',
  description: 'Taken at the beach',
  metadata: {
    camera: 'Canon EOS R5',
    location: 'Waikiki Beach'
  }
}, (progress) => {
  console.log(`Upload: ${progress.percentage}%`);
});
```

### Move Photo Between Galleries

```typescript
const result = await photoRepo.move({
  photoId: 'photo-id',
  targetGalleryId: 'new-gallery-id',
  displayOrder: 0
});

if (isSuccess(result)) {
  // Update photo counts
  await galleryRepo.updatePhotoCount(oldGalleryId);
  await galleryRepo.updatePhotoCount(newGalleryId);
}
```

### Reorder Photos

```typescript
// Get current photos
const result = await photoRepo.findByGallery('gallery-id', {
  orderBy: 'display_order',
  orderDirection: 'asc'
});

if (isSuccess(result)) {
  const photos = result.value;

  // User drags photo from index 0 to index 3
  const newOrder = [...photos];
  const [moved] = newOrder.splice(0, 1);
  newOrder.splice(3, 0, moved);

  // Save new order
  const photoIds = newOrder.map(p => p.id);
  await photoRepo.reorder('gallery-id', photoIds);
}
```

---

## 📧 Inquiry Operations

### Create Inquiry

```typescript
const inquiryRepo = useInquiryRepository();

const validation = validate(CreateInquirySchema, {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '808-555-1234',
  subject: 'Wedding Photography',
  message: 'I would like to book you for my wedding...',
  inquiryType: InquiryType.WEDDING,
  metadata: {
    eventDate: new Date('2025-12-01'),
    eventLocation: 'Oahu',
    guestCount: 150
  }
});

if (validation.success) {
  const result = await inquiryRepo.create(validation.data);
  // Email notification automatically sent
}
```

### Update Inquiry Status

```typescript
// Mark as read
await inquiryRepo.markAsRead('inquiry-id');

// Update with timestamp
await inquiryRepo.update('inquiry-id', {
  status: InquiryStatus.RESPONDED,
  respondedAt: new Date()
});

// Mark as spam
await inquiryRepo.markAsSpam('inquiry-id');
```

### Search Inquiries

```typescript
const result = await inquiryRepo.search('wedding');

if (isSuccess(result)) {
  const inquiries = result.value; // All inquiries matching 'wedding'
}
```

---

## 🎨 Gallery Operations Cheat Sheet

| Operation | Code |
|-----------|------|
| **Get all published** | `findAll({ isPublished: true })` |
| **Get by category** | `findByCategory(GalleryCategory.WEDDING)` |
| **Get with photos** | `findByIdWithPhotos('id')` |
| **Check slug** | `isSlugAvailable('slug', 'exclude-id')` |
| **Update photo count** | `updatePhotoCount('id')` |
| **Reorder galleries** | `reorder(['id1', 'id2', 'id3'])` |

---

## 🔍 Photo Operations Cheat Sheet

| Operation | Code |
|-----------|------|
| **Get gallery photos** | `findByGallery('gallery-id')` |
| **Upload** | `upload({ galleryId, file, title })` |
| **Update metadata** | `update('id', { title, description })` |
| **Move to gallery** | `move({ photoId, targetGalleryId })` |
| **Reorder** | `reorder('gallery-id', ['id1', 'id2'])` |
| **Delete** | `delete('id')` |
| **Batch delete** | `deleteBatch(['id1', 'id2', 'id3'])` |

---

## 📋 Validation Schemas Available

- `CreateGallerySchema`
- `UpdateGallerySchema`
- `UpdatePhotoSchema`
- `MovePhotoSchema`
- `CreateInquirySchema`
- `UpdateInquirySchema`
- `CreateSubscriberSchema`
- `UpdateSubscriberSchema`
- `LoginCredentialsSchema`
- `CreateAdminSchema`
- `UpdateAdminSchema`
- `ChangePasswordSchema`

---

## 🚨 Error Types

| Error Type | HTTP Code | When to Use |
|------------|-----------|-------------|
| `ValidationError` | 400 | Invalid input data |
| `AuthenticationError` | 401 | Not logged in |
| `AuthorizationError` | 403 | No permission |
| `NotFoundError` | 404 | Resource doesn't exist |
| `ConflictError` | 409 | Duplicate (e.g., slug) |
| `RateLimitError` | 429 | Too many requests |
| `DatabaseError` | 500 | Database failure |
| `StorageError` | 500 | File storage failure |
| `NetworkError` | 503 | Network timeout |

---

## 🧪 Testing Snippets

### Mock Repository

```typescript
const mockGalleryRepo: IGalleryRepository = {
  findById: jest.fn().mockResolvedValue(
    success({ id: '1', title: 'Test' } as Gallery)
  ),
  findAll: jest.fn().mockResolvedValue(success([])),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
  // ... other methods
};
```

### Test Component

```typescript
it('fetches and displays galleries', async () => {
  const mockRepo = {
    findAll: jest.fn().mockResolvedValue(
      success([{ id: '1', title: 'Test Gallery' }])
    )
  };

  render(<GalleryList repository={mockRepo} />);

  await waitFor(() => {
    expect(screen.getByText('Test Gallery')).toBeInTheDocument();
  });
});
```

---

## 📂 File Locations

| What | Where |
|------|-------|
| **Domain Models** | `src/domain/models/` |
| **Repository Interfaces** | `src/domain/repositories/` |
| **Validation Schemas** | `src/domain/validation/schemas.ts` |
| **Result Type** | `src/domain/core/Result.ts` |
| **Error Types** | `src/domain/core/errors.ts` |
| **Supabase Repos** | `src/infrastructure/supabase/` |
| **Container** | `src/infrastructure/container.ts` |
| **Examples** | `src/examples/` |

---

## 🎓 Best Practices

### ✅ DO

```typescript
// Use repository hooks
const galleryRepo = useGalleryRepository();

// Always validate inputs
const validation = validate(CreateGallerySchema, data);

// Always check Result type
if (isSuccess(result)) { /* ... */ }

// Use specific error types
if (error instanceof NotFoundError) { /* ... */ }

// Use readonly in domain models
interface Gallery {
  readonly id: string;
  readonly title: string;
}
```

### ❌ DON'T

```typescript
// Don't call Supabase directly
const { data } = await supabase.from('galleries').select(); // ❌

// Don't skip validation
await galleryRepo.create(untrustedData); // ❌

// Don't assume success
const gallery = result.value; // ❌ Check first!

// Don't throw exceptions
throw new Error('Not found'); // ❌ Use Result type

// Don't mutate domain models
gallery.title = 'New Title'; // ❌ Use update method
```

---

## 🔗 Documentation Links

- **Full Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Setup Instructions**: [DATA_ARCHITECTURE_SETUP.md](./DATA_ARCHITECTURE_SETUP.md)
- **Visual Diagrams**: [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)
- **Complete Summary**: [DATA_ARCHITECTURE_SUMMARY.md](./DATA_ARCHITECTURE_SUMMARY.md)

---

## 💡 Tips

1. **Always initialize container first** in `main.tsx`
2. **Use validation** before all repository operations
3. **Check Result success** before accessing value
4. **Handle specific error types** for better UX
5. **Update photo counts** when moving/deleting photos
6. **Use filters** for pagination and performance
7. **Prefer repository methods** over direct Supabase calls

---

**Version:** 1.0
**Date:** October 24, 2025

Keep this reference handy while developing! 🚀
