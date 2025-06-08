-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "txId" INTEGER NOT NULL,
    "rate" TEXT NOT NULL,
    "goldAmount" TEXT NOT NULL,
    "buyPrice" TEXT NOT NULL,
    "preGstBuyPrice" TEXT NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "txDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txId_key" ON "Transaction"("txId");
