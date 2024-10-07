/*
  Warnings:

  - You are about to drop the `_TaskDependencies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_TaskDependencies_B_index";

-- DropIndex
DROP INDEX "_TaskDependencies_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TaskDependencies";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ongoing',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "dueDate" DATETIME,
    "assignedTo" TEXT,
    "estimatedHours" REAL,
    "actualHours" REAL,
    "dependencyId" TEXT,
    "dependentOnId" TEXT,
    "riskFlag" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_dependencyId_fkey" FOREIGN KEY ("dependencyId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("actualHours", "assignedTo", "createdAt", "description", "dueDate", "estimatedHours", "id", "name", "priority", "projectId", "riskFlag", "status", "updatedAt", "userId") SELECT "actualHours", "assignedTo", "createdAt", "description", "dueDate", "estimatedHours", "id", "name", "priority", "projectId", "riskFlag", "status", "updatedAt", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_dependencyId_key" ON "Task"("dependencyId");
CREATE UNIQUE INDEX "Task_dependentOnId_key" ON "Task"("dependentOnId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
