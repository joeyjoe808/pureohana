/*
  # Add RLS policies for pureohanatreasures table

  1. Security
    - Add RLS policies for the pureohanatreasures table
    - Enable authenticated users to perform all CRUD operations
*/

-- Authenticated users can read all records in pureohanatreasures
CREATE POLICY "Authenticated users can read pureohanatreasures"
  ON pureohanatreasures
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert new records into pureohanatreasures
CREATE POLICY "Authenticated users can insert pureohanatreasures"
  ON pureohanatreasures
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update records in pureohanatreasures
CREATE POLICY "Authenticated users can update pureohanatreasures"
  ON pureohanatreasures
  FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete records from pureohanatreasures
CREATE POLICY "Authenticated users can delete pureohanatreasures"
  ON pureohanatreasures
  FOR DELETE
  TO authenticated
  USING (true);

-- Optional: Allow public read access if needed
CREATE POLICY "Public users can read pureohanatreasures"
  ON pureohanatreasures
  FOR SELECT
  TO public
  USING (true);