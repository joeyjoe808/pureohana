# Database Migrations

## Photo Placement System Setup

The photo placement system allows you to assign uploaded photos to specific website sections (homepage hero, portfolio, about page, etc.).

### Prerequisites
- Supabase account with project set up
- Access to Supabase SQL Editor

### Step 1: Run the Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Create a new query
4. Copy the entire contents of `001_photo_placements.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

### Expected Result

You should see:
```
✅ Photo Placement System installed successfully!
📸 You can now assign photos to website sections
🎨 Available sections: homepage_hero, homepage_grid_*, portfolio, about_*, services_hero
```

### Verify Installation

Run this query to verify the table was created:

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'photo_placements'
ORDER BY ordinal_position;
```

You should see columns:
- id
- photo_id
- section_key
- sort_order ✅ (this is the important one!)
- is_active
- created_at
- updated_at

### Troubleshooting

**Error: "relation already exists"**
- The table already exists. Check if it has the `sort_order` column.
- If it has `position` instead, you may need to rename it:
  ```sql
  ALTER TABLE photo_placements RENAME COLUMN position TO sort_order;
  ```

**Error: "permission denied"**
- Make sure you're using the service role or have proper permissions

### After Migration

Once the migration is complete:
1. Refresh your admin dashboard
2. Go to **Photo Library** (`/admin/photo-library`)
3. The database errors should be gone
4. You can now assign photos to website sections

---

## Available Website Sections

After migration, you can assign photos to these sections:

- `homepage_hero` - Main hero image on homepage
- `homepage_grid_1` - First image in homepage grid
- `homepage_grid_2` - Second image in homepage grid
- `homepage_grid_3` - Third image in homepage grid
- `homepage_grid_4` - Fourth image in homepage grid
- `portfolio` - Public portfolio page
- `about_hero` - About page header image
- `services_hero` - Services page header image

Photos can be assigned to multiple sections!
