-- CreateTable
CREATE TABLE "AboutMe" (
    "id" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "bio" TEXT,
    "mission" TEXT,

    CONSTRAINT "AboutMe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationDescription" (
    "id" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "EducationDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceResponsibility" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ExperienceResponsibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalSeconds" INTEGER NOT NULL,
    "humanReadable" TEXT NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatisticsLanguage" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "totalSeconds" INTEGER NOT NULL,
    "humanReadable" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StatisticsLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatisticsOS" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "totalSeconds" INTEGER NOT NULL,
    "humanReadable" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StatisticsOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionChart" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalSeconds" INTEGER NOT NULL,

    CONSTRAINT "ContributionChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preview" TEXT,
    "logo" TEXT,
    "inProgress" BOOLEAN NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTag" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EducationDescription" ADD CONSTRAINT "EducationDescription_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceResponsibility" ADD CONSTRAINT "ExperienceResponsibility_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsLanguage" ADD CONSTRAINT "StatisticsLanguage_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsOS" ADD CONSTRAINT "StatisticsOS_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionChart" ADD CONSTRAINT "ContributionChart_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
