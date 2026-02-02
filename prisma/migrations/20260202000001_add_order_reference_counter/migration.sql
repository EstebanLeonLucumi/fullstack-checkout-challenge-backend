-- CreateTable
CREATE TABLE "OrderReferenceCounter" (
    "id" TEXT NOT NULL,
    "nextValue" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrderReferenceCounter_pkey" PRIMARY KEY ("id")
);

-- Seed single row for consecutive order references
INSERT INTO "OrderReferenceCounter" ("id", "nextValue") VALUES ('singleton', 1);
