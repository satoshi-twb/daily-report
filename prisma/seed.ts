import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 シードデータを投入します...");

  // ---------- Users ----------
  const passwordHash = await bcrypt.hash("password123", 12);

  const manager = await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      name: "山田 太郎",
      email: "manager@example.com",
      passwordHash,
      role: Role.manager,
    },
  });

  const salesperson1 = await prisma.user.upsert({
    where: { email: "sato@example.com" },
    update: {},
    create: {
      name: "佐藤 花子",
      email: "sato@example.com",
      passwordHash,
      role: Role.salesperson,
    },
  });

  const salesperson2 = await prisma.user.upsert({
    where: { email: "suzuki@example.com" },
    update: {},
    create: {
      name: "鈴木 一郎",
      email: "suzuki@example.com",
      passwordHash,
      role: Role.salesperson,
    },
  });

  console.log(`  ✓ ユーザー: ${manager.name}, ${salesperson1.name}, ${salesperson2.name}`);

  // ---------- Customers ----------
  const customer1 = await prisma.customer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      companyName: "株式会社サンプル商事",
      contactName: "田中 部長",
      phone: "03-0000-0001",
      address: "東京都千代田区丸の内1-1-1",
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 2 },
    update: {},
    create: {
      companyName: "テスト工業株式会社",
      contactName: "中村 課長",
      phone: "06-0000-0002",
      address: "大阪府大阪市北区梅田2-2-2",
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { id: 3 },
    update: {},
    create: {
      companyName: "サンプル電機",
      contactName: "小林 様",
      phone: "052-000-0003",
    },
  });

  console.log(
    `  ✓ 顧客: ${customer1.companyName}, ${customer2.companyName}, ${customer3.companyName}`,
  );

  // ---------- DailyReports & VisitRecords ----------
  const today = new Date("2026-03-31");
  const yesterday = new Date("2026-03-30");

  const report1 = await prisma.dailyReport.upsert({
    where: { userId_reportDate: { userId: salesperson1.id, reportDate: today } },
    update: {},
    create: {
      userId: salesperson1.id,
      reportDate: today,
      problem: "株式会社サンプル商事の予算決裁が来月に延期。早期受注に向けてフォローが必要。",
      plan: "明日はサンプル商事へ再訪問し、決裁者へのプレゼン資料を準備する。",
      visitRecords: {
        create: [
          {
            customerId: customer1.id,
            content: "新製品の提案を実施。担当者は興味あり。来週までに見積書を提出する約束をした。",
            visitedAt: new Date("2026-03-31T10:00:00"),
          },
          {
            customerId: customer2.id,
            content: "既存契約の更新商談。価格交渉あり。2割引での更新を打診された。",
            visitedAt: new Date("2026-03-31T14:00:00"),
          },
        ],
      },
    },
  });

  const report2 = await prisma.dailyReport.upsert({
    where: { userId_reportDate: { userId: salesperson1.id, reportDate: yesterday } },
    update: {},
    create: {
      userId: salesperson1.id,
      reportDate: yesterday,
      problem: "テスト工業の担当者が変更になり、関係構築が必要。",
      plan: "新担当者への訪問アポを取得する。",
      visitRecords: {
        create: [
          {
            customerId: customer2.id,
            content: "新担当者へご挨拶。製品カタログを置いてきた。",
            visitedAt: new Date("2026-03-30T11:00:00"),
          },
        ],
      },
    },
  });

  const report3 = await prisma.dailyReport.upsert({
    where: { userId_reportDate: { userId: salesperson2.id, reportDate: today } },
    update: {},
    create: {
      userId: salesperson2.id,
      reportDate: today,
      problem: "特になし",
      plan: "明日はサンプル電機へ訪問予定。",
      visitRecords: {
        create: [
          {
            customerId: customer3.id,
            content: "定期フォロー訪問。満足度が高く、追加発注の可能性あり。",
            visitedAt: new Date("2026-03-31T13:00:00"),
          },
        ],
      },
    },
  });

  console.log(`  ✓ 日報: ${report1.id}, ${report2.id}, ${report3.id}`);

  // ---------- Comments ----------
  const comment1 = await prisma.comment.create({
    data: {
      dailyReportId: report1.id,
      userId: manager.id,
      content: "サンプル商事の件、来週フォローする際は決裁フローも確認してください。",
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      dailyReportId: report2.id,
      userId: manager.id,
      content: "新担当者へのアプローチ、引き続きよろしくお願いします。資料が必要なら連絡を。",
    },
  });

  console.log(`  ✓ コメント: ${comment1.id}, ${comment2.id}`);
  console.log("✅ シードデータの投入が完了しました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
