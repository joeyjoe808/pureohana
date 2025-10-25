# Data Architecture Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install zod
```

Dependencies are already installed:
- `@supabase/supabase-js` - Supabase client
- `zod` - Runtime validation
- `typescript` - Type safety

### 2. Initialize Container

Update `src/main.tsx` to initialize the dependency injection container:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Container } from './infrastructure/container';

// Initialize dependency injection container
Container.initialize(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3. Database Schema

Create the following tables in Supabase:

#### Galleries Table

```sql
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  cover_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  photo_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_galleries_slug ON galleries(slug);
CREATE INDEX idx_galleries_category ON galleries(category);
CREATE INDEX idx_galleries_published ON galleries(is_published);
CREATE INDEX idx_galleries_display_order ON galleries(display_order);
```

#### Photos Table

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_gallery ON photos(gallery_id);
CREATE INDEX idx_photos_published ON photos(is_published);
CREATE INDEX idx_photos_display_order ON photos(display_order);
```

#### Inquiries Table

```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  source VARCHAR(50) NOT NULL DEFAULT 'website_contact',
  metadata JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_type ON inquiries(inquiry_type);
CREATE INDEX idx_inquiries_submitted ON inquiries(submitted_at);
```

#### Subscribers Table

```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  source VARCHAR(50) NOT NULL DEFAULT 'website_footer',
  preferences JSONB NOT NULL DEFAULT '{}',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  last_email_sent_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
```

#### Admin Users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
```

#### Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address VARCHAR(50) NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### 4. Storage Buckets

Create the following storage buckets in Supabase:

1. **photos** - For original photos
   - Public: No
   - File size limit: 50MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/heic`

2. **thumbnails** - For thumbnail images
   - Public: Yes
   - File size limit: 5MB

### 5. Row Level Security (RLS)

Enable RLS on all tables and create policies:

#### Public Read Access for Published Content

```sql
-- Galleries: Public can view published galleries
CREATE POLICY "Public galleries are viewable by everyone"
  ON galleries FOR SELECT
  USING (is_published = true);

-- Photos: Public can view published photos
CREATE POLICY "Public photos are viewable by everyone"
  ON photos FOR SELECT
  USING (is_published = true);
```

#### Admin Full Access

```sql
-- Galleries: Admins have full access
CREATE POLICY "Admins have full access to galleries"
  ON galleries FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Photos: Admins have full access
CREATE POLICY "Admins have full access to photos"
  ON photos FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Inquiries: Admins can view all
CREATE POLICY "Admins can view all inquiries"
  ON inquiries FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
```

#### Public Can Create Inquiries

```sql
CREATE POLICY "Anyone can create inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);
```

### 6. Usage in Components

#### Fetch Galleries

```typescript
import { useGalleryRepository } from '../infrastructure/container';
import { isSuccess } from '../domain';

function GalleryList() {
  const galleryRepo = useGalleryRepository();

  useEffect(() => {
    const fetchGalleries = async () => {
      const result = await galleryRepo.findAll({
        isPublished: true,
        orderBy: 'display_order',
        orderDirection: 'asc'
      });

      if (isSuccess(result)) {
        setGalleries(result.value);
      } else {
        console.error('Error:', result.error.message);
      }
    };

    fetchGalleries();
  }, []);

  // ... rest of component
}
```

#### Create Gallery

```typescript
import { useGalleryRepository } from '../infrastructure/container';
import { CreateGallerySchema, validate, isSuccess } from '../domain';

function CreateGalleryForm() {
  const galleryRepo = useGalleryRepository();

  const handleSubmit = async (formData) => {
    // Validate
    const validation = validate(CreateGallerySchema, formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Create
    const result = await galleryRepo.create(validation.data);

    if (isSuccess(result)) {
      console.log('Created:', result.value);
    } else {
      console.error('Error:', result.error.message);
    }
  };

  // ... rest of component
}
```

#### Upload Photo

```typescript
import { usePhotoRepository } from '../infrastructure/container';
import { validateImageFile, isSuccess } from '../domain';

function PhotoUploadForm({ galleryId }) {
  const photoRepo = usePhotoRepository();

  const handleUpload = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Upload
    const result = await photoRepo.upload({
      galleryId,
      file,
      title: file.name,
      description: ''
    });

    if (isSuccess(result)) {
      console.log('Uploaded:', result.value);
    } else {
      console.error('Error:', result.error.message);
    }
  };

  // ... rest of component
}
```

### 7. Environment Variables

Ensure `.env` file contains:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Migration from Existing Code

### Step 1: Replace Direct Supabase Calls

**Before:**
```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('galleries')
  .select('*');
```

**After:**
```typescript
import { useGalleryRepository } from '../infrastructure/container';
import { isSuccess } from '../domain';

const galleryRepo = useGalleryRepository();
const result = await galleryRepo.findAll();

if (isSuccess(result)) {
  const galleries = result.value;
}
```

### Step 2: Add Validation

**Before:**
```typescript
const createGallery = async (data) => {
  // No validation
  await supabase.from('galleries').insert(data);
};
```

**After:**
```typescript
import { validate, CreateGallerySchema } from '../domain';

const createGallery = async (data) => {
  const validation = validate(CreateGallerySchema, data);

  if (!validation.success) {
    return { errors: validation.errors };
  }

  const result = await galleryRepo.create(validation.data);
  return result;
};
```

### Step 3: Handle Errors Properly

**Before:**
```typescript
try {
  const { data } = await supabase.from('galleries').select('*');
} catch (error) {
  console.error(error);
}
```

**After:**
```typescript
const result = await galleryRepo.findAll();

if (isSuccess(result)) {
  const galleries = result.value;
} else {
  if (result.error instanceof NotFoundError) {
    // Handle not found
  } else if (result.error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

## Testing

### Unit Test Example

```typescript
import { SupabaseGalleryRepository } from '../infrastructure/supabase';
import { isSuccess } from '../domain';

describe('SupabaseGalleryRepository', () => {
  let mockSupabase;
  let repository;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: '123', title: 'Test' },
          error: null
        })
      }))
    };

    repository = new SupabaseGalleryRepository(mockSupabase);
  });

  it('should fetch gallery by id', async () => {
    const result = await repository.findById('123');

    expect(isSuccess(result)).toBe(true);
    expect(result.value.title).toBe('Test');
  });
});
```

## Troubleshooting

### Container Not Initialized

**Error:** `Container not initialized. Call Container.initialize() first.`

**Solution:** Add initialization to `main.tsx`:
```typescript
Container.initialize(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Validation Errors

**Error:** Validation fails with Zod errors

**Solution:** Check the schema requirements and ensure your data matches:
```typescript
const validation = validate(CreateGallerySchema, formData);
if (!validation.success) {
  console.log('Validation errors:', validation.errors);
}
```

### Type Errors

**Error:** TypeScript errors about Result type

**Solution:** Always check result success before accessing value:
```typescript
const result = await galleryRepo.findById('123');

// ❌ Wrong - TypeScript error
console.log(result.value);

// ✅ Correct
if (isSuccess(result)) {
  console.log(result.value);
}
```

## Next Steps

1. Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture explanation
2. Check [examples/GalleryExamples.tsx](./src/examples/GalleryExamples.tsx) for component examples
3. Check [examples/PhotoExamples.tsx](./src/examples/PhotoExamples.tsx) for photo management examples
4. Set up database tables using the SQL above
5. Update your components to use repositories instead of direct Supabase calls

## Support

For questions or issues:
1. Check the architecture documentation
2. Review the example files
3. Verify database schema matches the specifications
4. Ensure RLS policies are correctly configured
