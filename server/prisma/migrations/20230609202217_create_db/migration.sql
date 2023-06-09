-- CreateTable
CREATE TABLE "users" (
	"id" TEXT NOT NULL PRIMARY KEY,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "habits" (
	"id" TEXT NOT NULL PRIMARY KEY,
	"title" TEXT NOT NULL,
	"created_at" DATETIME NOT NULL,
	"user_id" TEXT NOT NULL,
	CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "habit_week_days" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"habit_id" TEXT NOT NULL,
	"week_day" INTEGER NOT NULL,
	CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "days" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "completed_habits" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"day_id" INTEGER NOT NULL,
	"habit_id" TEXT NOT NULL,
	CONSTRAINT "completed_habits_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "completed_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "habit_week_days_habit_id_week_day_key" ON "habit_week_days"("habit_id", "week_day");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "completed_habits_day_id_habit_id_key" ON "completed_habits"("day_id", "habit_id");
