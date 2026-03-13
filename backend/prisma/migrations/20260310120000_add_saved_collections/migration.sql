-- CreateTable
CREATE TABLE "saved_collections" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "saved_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_collections_userId_name_key" ON "saved_collections"("userId", "name");

-- AddForeignKey
ALTER TABLE "saved_collections" ADD CONSTRAINT "saved_collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddColumn
ALTER TABLE "saved_posts" ADD COLUMN "collectionId" UUID;

-- AddForeignKey
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "saved_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

