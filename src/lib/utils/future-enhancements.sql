-- Future enhancement: Add fields for storing calculated or manually set loop metrics
-- This migration can be run later if you want to store these values in the database

-- Add duration and transport fields to Loop table
-- ALTER TABLE "Loop" ADD COLUMN "estimatedDurationMinutes" INTEGER;
-- ALTER TABLE "Loop" ADD COLUMN "recommendedTransport" TEXT;
-- ALTER TABLE "Loop" ADD COLUMN "difficulty" TEXT CHECK ("difficulty" IN ('Easy', 'Moderate', 'Challenging'));

-- Add location fields to Place table for better distance calculations
-- ALTER TABLE "Place" ADD COLUMN "latitude" DOUBLE PRECISION;
-- ALTER TABLE "Place" ADD COLUMN "longitude" DOUBLE PRECISION;

-- Add index for location-based queries
-- CREATE INDEX "Place_location_idx" ON "Place" ("latitude", "longitude");

-- Note: These are commented out as they are optional future enhancements
-- Uncomment and create a proper Prisma migration if you want to implement them
