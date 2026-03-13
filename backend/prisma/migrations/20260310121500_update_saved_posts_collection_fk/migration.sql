-- Drop existing foreign key that cascades deletes from saved_collections to saved_posts
ALTER TABLE "saved_posts" DROP CONSTRAINT IF EXISTS "saved_posts_collectionId_fkey";

-- Recreate foreign key so that deleting a collection only nulls collectionId on saved_posts
ALTER TABLE "saved_posts"
ADD CONSTRAINT "saved_posts_collectionId_fkey"
FOREIGN KEY ("collectionId") REFERENCES "saved_collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

