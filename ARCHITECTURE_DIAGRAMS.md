# Pure Ohana - Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
│                     (React Components & Pages)                       │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Gallery    │  │    Photo     │  │   Inquiry    │             │
│  │  Components  │  │  Components  │  │  Components  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Uses Repository Hooks
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                              │
│                  (Dependency Injection Container)                    │
│                                                                      │
│  Container.initialize(supabaseUrl, supabaseKey)                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  useGalleryRepository() → IGalleryRepository             │      │
│  │  usePhotoRepository() → IPhotoRepository                 │      │
│  │  useInquiryRepository() → IInquiryRepository             │      │
│  └──────────────────────────────────────────────────────────┘      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Implements
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                                 │
│                   (Framework-Agnostic Business Logic)                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │              REPOSITORY INTERFACES                     │         │
│  │  ┌──────────────────────────────────────────────┐     │         │
│  │  │  IGalleryRepository (interface)              │     │         │
│  │  │   - findById(id): Result<Gallery, Error>     │     │         │
│  │  │   - findAll(): Result<Gallery[], Error>      │     │         │
│  │  │   - create(input): Result<Gallery, Error>    │     │         │
│  │  │   - update(...): Result<Gallery, Error>      │     │         │
│  │  │   - delete(id): Result<void, Error>          │     │         │
│  │  └──────────────────────────────────────────────┘     │         │
│  │                                                        │         │
│  │  Similar interfaces for:                              │         │
│  │   - IPhotoRepository                                  │         │
│  │   - IInquiryRepository                                │         │
│  │   - INewsletterRepository                             │         │
│  │   - IAdminRepository                                  │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │                  DOMAIN MODELS                         │         │
│  │   Gallery | Photo | Inquiry | Newsletter | Admin      │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │              VALIDATION (Zod Schemas)                  │         │
│  │   CreateGallerySchema | UpdatePhotoSchema | ...       │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │            RESULT TYPE & ERROR HANDLING                │         │
│  │   Result<T, E> | AppError | ValidationError | ...     │         │
│  └────────────────────────────────────────────────────────┘         │
└────────────────────────────┬────────────────────────────────────────┘
                             ↑
                             │ Implemented by
                             │
┌─────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                              │
│                  (Supabase Implementations)                          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │        SupabaseGalleryRepository                       │         │
│  │        implements IGalleryRepository                   │         │
│  │                                                        │         │
│  │  constructor(supabase: SupabaseClient)                │         │
│  │                                                        │         │
│  │  async findById(id): Result<Gallery, Error> {         │         │
│  │    const { data, error } = await supabase             │         │
│  │      .from('galleries')                               │         │
│  │      .select('*')                                     │         │
│  │      .eq('id', id)                                    │         │
│  │                                                        │         │
│  │    if (error) return failure(new DatabaseError())     │         │
│  │    return success(this.mapToGallery(data))            │         │
│  │  }                                                     │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  Similar implementations for:                                       │
│   - SupabasePhotoRepository                                         │
│   - SupabaseInquiryRepository                                       │
│   - SupabaseNewsletterRepository (TODO)                             │
│   - SupabaseAdminRepository (TODO)                                  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Uses
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          SUPABASE                                    │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Database   │  │   Storage    │  │     Auth     │             │
│  │              │  │              │  │              │             │
│  │  galleries   │  │   photos/    │  │   Users      │             │
│  │  photos      │  │   thumbnails/│  │   Sessions   │             │
│  │  inquiries   │  │              │  │   RLS        │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow - Gallery Creation

```
┌─────────────────┐
│  User clicks    │
│ "Create Gallery"│
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  CreateGalleryForm Component        │
│                                     │
│  1. Collect form data               │
│  2. Validate with Zod schema        │
│     validate(CreateGallerySchema)   │
│                                     │
│  if (!validation.success) {         │
│    Show errors                      │
│    return                           │
│  }                                  │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  useGalleryRepository()             │
│                                     │
│  const galleryRepo =                │
│    Container.getInstance()          │
│      .getGalleryRepository()        │
│                                     │
│  Returns: IGalleryRepository        │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  galleryRepo.create(validatedData)  │
│                                     │
│  Calls: SupabaseGalleryRepository   │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  SupabaseGalleryRepository          │
│                                     │
│  1. Check slug availability         │
│  2. Insert into Supabase            │
│  3. Handle errors                   │
│  4. Map to domain model             │
│  5. Return Result<Gallery, Error>   │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Supabase Database                  │
│                                     │
│  INSERT INTO galleries              │
│  VALUES (...)                       │
│                                     │
│  Returns: { data, error }           │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Result Handling in Component       │
│                                     │
│  if (isSuccess(result)) {           │
│    Show success message             │
│    Reset form                       │
│    Navigate to gallery              │
│  } else {                           │
│    Handle specific error type       │
│    Show error message               │
│  }                                  │
└─────────────────────────────────────┘
```

## Result Type Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    RESULT TYPE PATTERN                        │
└──────────────────────────────────────────────────────────────┘

type Result<T, E extends Error> = Success<T> | Failure<E>

┌──────────────────────────┐    ┌──────────────────────────┐
│     Success<T>           │    │     Failure<E>           │
│                          │    │                          │
│  success: true           │    │  success: false          │
│  value: T                │    │  error: E                │
└──────────────────────────┘    └──────────────────────────┘

EXAMPLE FLOW:

const result = await galleryRepo.findById('123')
                │
                ├──> SUCCESS CASE
                │    ┌──────────────────────────────┐
                │    │  isSuccess(result) === true  │
                │    │  result.value: Gallery       │
                │    └──────────────────────────────┘
                │
                └──> FAILURE CASE
                     ┌──────────────────────────────┐
                     │  isFailure(result) === true  │
                     │  result.error: AppError      │
                     │                              │
                     │  Possible error types:       │
                     │   - NotFoundError            │
                     │   - DatabaseError            │
                     │   - ValidationError          │
                     └──────────────────────────────┘
```

## Photo Upload Flow with Strategic Management

```
┌─────────────────┐
│  User selects   │
│   photo file    │
└────────┬────────┘
         │
         ↓
┌──────────────────────────────┐
│  Validate File               │
│                              │
│  validateImageFile(file)     │
│   - Check file type          │
│   - Check file size (50MB)   │
│   - Return validation result │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│  photoRepo.upload()          │
│                              │
│  UploadPhotoInput:           │
│   - galleryId                │
│   - file: File               │
│   - title: string            │
│   - description?: string     │
│   - metadata?: {}            │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│  SupabasePhotoRepository     │
│                              │
│  1. Generate storage key     │
│  2. Upload to Storage bucket │
│  3. Get public URL           │
│  4. Create database record   │
│  5. Return Photo entity      │
└────────┬─────────────────────┘
         │
         ├──> Supabase Storage
         │    photos/gallery-id/timestamp_file.jpg
         │
         └──> Supabase Database
              INSERT INTO photos (...)

┌──────────────────────────────┐
│  Photo Created Successfully  │
│                              │
│  Now can be:                 │
│   - Moved to other gallery   │
│   - Reordered                │
│   - Updated metadata         │
│   - Deleted                  │
└──────────────────────────────┘

STRATEGIC PHOTO MANAGEMENT:

┌─────────────────────────────────────────────┐
│  Photo can move between galleries:          │
│                                             │
│  photoRepo.move({                           │
│    photoId: 'photo-123',                    │
│    targetGalleryId: 'gallery-456'           │
│  })                                         │
│                                             │
│  ┌──────────┐          ┌──────────┐        │
│  │ Gallery  │   MOVE   │ Gallery  │        │
│  │ Wedding  │  ────>   │ Portrait │        │
│  │          │          │          │        │
│  │ Photo A  │          │ Photo A  │ ✓      │
│  │ Photo B  │          │ Photo B  │        │
│  └──────────┘          │ Photo C  │        │
│                        └──────────┘        │
│                                             │
│  Photo metadata preserved                   │
│  Gallery photo counts auto-updated          │
└─────────────────────────────────────────────┘
```

## Dependency Injection Container

```
┌────────────────────────────────────────────────────────────┐
│                    CONTAINER LIFECYCLE                      │
└────────────────────────────────────────────────────────────┘

APPLICATION STARTUP (main.tsx):
┌──────────────────────────────────────┐
│  Container.initialize(               │
│    VITE_SUPABASE_URL,                │
│    VITE_SUPABASE_ANON_KEY            │
│  )                                   │
│                                      │
│  Creates:                            │
│   - Supabase client (singleton)      │
│   - Repository instances             │
└──────────────────────────────────────┘

COMPONENT USAGE:
┌──────────────────────────────────────┐
│  import { useGalleryRepository }     │
│                                      │
│  function MyComponent() {            │
│    const repo = useGalleryRepository()│
│                                      │
│    // repo is IGalleryRepository     │
│    // actual implementation is       │
│    // SupabaseGalleryRepository      │
│  }                                   │
└──────────────────────────────────────┘

CONTAINER INTERNALS:
┌────────────────────────────────────────────┐
│  Container (Singleton)                     │
│                                            │
│  private supabaseClient: SupabaseClient    │
│  private galleryRepo?: IGalleryRepository  │
│  private photoRepo?: IPhotoRepository      │
│  private inquiryRepo?: IInquiryRepository  │
│                                            │
│  getGalleryRepository() {                  │
│    if (!this.galleryRepo) {                │
│      this.galleryRepo =                    │
│        new SupabaseGalleryRepository(      │
│          this.supabaseClient               │
│        )                                   │
│    }                                       │
│    return this.galleryRepo                 │
│  }                                         │
└────────────────────────────────────────────┘

BENEFITS:
✅ Single Supabase client instance
✅ Lazy initialization (created on first use)
✅ Easy to test (inject mock repositories)
✅ Easy to swap implementations
```

## Error Handling Hierarchy

```
┌────────────────────────────────────────────────────────────┐
│                    ERROR HIERARCHY                          │
└────────────────────────────────────────────────────────────┘

                        AppError (Base)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
  ValidationError    AuthenticationError   NotFoundError
     (400)                (401)               (404)
        │                    │                    │
        │              AuthorizationError    ConflictError
        │                  (403)               (409)
        │                    │                    │
  DatabaseError        RateLimitError      StorageError
     (500)                (429)               (500)
        │                    │                    │
        │            ExternalServiceError   NetworkError
        │                  (502)               (503)
        │
  FileUploadError
     (400/413)

USAGE IN CODE:

try {
  const result = await galleryRepo.findById('123')

  if (isSuccess(result)) {
    return result.value
  } else {
    // Type-safe error handling
    if (result.error instanceof NotFoundError) {
      return null // or show 404 page
    }
    else if (result.error instanceof DatabaseError) {
      logError(result.error)
      return showErrorPage()
    }
    else {
      // Handle other errors
    }
  }
} catch (error) {
  // Only for unexpected programming errors
  logCriticalError(error)
}
```

## Validation Flow with Zod

```
┌────────────────────────────────────────────────────────────┐
│                   VALIDATION PIPELINE                       │
└────────────────────────────────────────────────────────────┘

USER INPUT:
┌──────────────────────────┐
│  {                       │
│    title: 'My Gallery',  │
│    slug: 'my-gallery',   │
│    category: 'wedding'   │
│  }                       │
└────────┬─────────────────┘
         │
         ↓
ZOD SCHEMA VALIDATION:
┌──────────────────────────────────────────┐
│  CreateGallerySchema                     │
│                                          │
│  title: z.string()                       │
│    .min(1, 'Required')                   │
│    .max(200, 'Too long')                 │
│                                          │
│  slug: z.string()                        │
│    .regex(/^[a-z0-9-]+$/)                │
│                                          │
│  category: z.nativeEnum(GalleryCategory) │
└────────┬─────────────────────────────────┘
         │
         ├─> VALIDATION SUCCESS
         │   ┌──────────────────────────┐
         │   │  {                       │
         │   │    success: true,        │
         │   │    data: {               │
         │   │      title: 'My Gallery',│
         │   │      slug: 'my-gallery', │
         │   │      category: 'wedding' │
         │   │    }                     │
         │   │  }                       │
         │   └────────┬─────────────────┘
         │            │
         │            ↓
         │   Send to Repository
         │
         └─> VALIDATION FAILURE
             ┌──────────────────────────┐
             │  {                       │
             │    success: false,       │
             │    errors: {             │
             │      title: [            │
             │        'Required'        │
             │      ],                  │
             │      slug: [             │
             │        'Invalid format'  │
             │      ]                   │
             │    }                     │
             │  }                       │
             └────────┬─────────────────┘
                      │
                      ↓
             Show field errors to user
```

## Repository Testing Strategy

```
┌────────────────────────────────────────────────────────────┐
│                    TESTING ARCHITECTURE                     │
└────────────────────────────────────────────────────────────┘

UNIT TESTS (Mock Supabase):
┌──────────────────────────────────────┐
│  SupabaseGalleryRepository.test.ts   │
│                                      │
│  const mockSupabase = {              │
│    from: jest.fn(() => ({            │
│      select: jest.fn(),              │
│      insert: jest.fn(),              │
│      update: jest.fn()               │
│    }))                               │
│  }                                   │
│                                      │
│  const repo =                        │
│    new SupabaseGalleryRepository(    │
│      mockSupabase                    │
│    )                                 │
│                                      │
│  Test methods:                       │
│   ✓ findById returns gallery         │
│   ✓ findById handles not found       │
│   ✓ create validates slug            │
│   ✓ update handles errors            │
└──────────────────────────────────────┘

INTEGRATION TESTS (Real Database):
┌──────────────────────────────────────┐
│  GalleryRepository.integration.ts    │
│                                      │
│  const container =                   │
│    Container.initialize(             │
│      TEST_SUPABASE_URL,              │
│      TEST_SUPABASE_KEY               │
│    )                                 │
│                                      │
│  const repo =                        │
│    container.getGalleryRepository()  │
│                                      │
│  Test full workflows:                │
│   ✓ Create → Read → Update → Delete │
│   ✓ Photo count updates correctly    │
│   ✓ Slug uniqueness enforced         │
└──────────────────────────────────────┘

COMPONENT TESTS (Mock Repository):
┌──────────────────────────────────────┐
│  CreateGalleryForm.test.tsx          │
│                                      │
│  const mockRepo = {                  │
│    create: jest.fn()                 │
│  }                                   │
│                                      │
│  render(                             │
│    <CreateGalleryForm                │
│      repository={mockRepo}           │
│    />                                │
│  )                                   │
│                                      │
│  Test UI interactions:               │
│   ✓ Form validation works            │
│   ✓ Success state shows              │
│   ✓ Error state handled              │
└──────────────────────────────────────┘
```

This comprehensive architecture ensures:
- ✅ Type-safe data access
- ✅ Easy testing at all layers
- ✅ Flexible implementation swapping
- ✅ Clear separation of concerns
- ✅ Explicit error handling
- ✅ Production-grade code quality
