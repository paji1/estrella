import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper to get current week number
function getWeekNumber(date: Date): number {
	const startOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDays = (date.getTime() - startOfYear.getTime()) / 86400000;
	return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
}

// GET /api/user - Get or create user with current week data
export async function GET(request: NextRequest) {
	try {
		const userId = request.nextUrl.searchParams.get("userId");

		// Get or create user
		let user = userId
			? await prisma.user.findUnique({
					where: { id: userId },
					include: { weeks: true },
			  })
			: null;

		if (!user) {
			user = await prisma.user.create({
				data: { name: "Player" },
				include: { weeks: true },
			});
		}

		// Get or create current week
		const now = new Date();
		const weekNumber = getWeekNumber(now);
		const year = now.getFullYear();

		let currentWeek = await prisma.week.findUnique({
			where: {
				userId_weekNumber_year: {
					userId: user.id,
					weekNumber,
					year,
				},
			},
		});

		if (!currentWeek) {
			currentWeek = await prisma.week.create({
				data: {
					userId: user.id,
					weekNumber,
					year,
				},
			});
		}

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				name: user.name,
				money: user.money.toString(), // BigInt to string for JSON
			},
			currentWeek: {
				id: currentWeek.id,
				weekNumber: currentWeek.weekNumber,
				year: currentWeek.year,
				pills: [
					currentWeek.monday,
					currentWeek.tuesday,
					currentWeek.wednesday,
					currentWeek.thursday,
					currentWeek.friday,
					currentWeek.saturday,
					currentWeek.sunday,
				],
			},
		});
	} catch (error) {
		console.error("GET /api/user error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to get user" },
			{ status: 500 }
		);
	}
}

// POST /api/user - Update user data
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId, money, pills, weekId } = body;

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "userId required" },
				{ status: 400 }
			);
		}

		// Update user money
		if (money !== undefined) {
			await prisma.user.update({
				where: { id: userId },
				data: { money: BigInt(money) },
			});
		}

		// Update pills for the week
		if (pills && weekId) {
			await prisma.week.update({
				where: { id: weekId },
				data: {
					monday: pills[0],
					tuesday: pills[1],
					wednesday: pills[2],
					thursday: pills[3],
					friday: pills[4],
					saturday: pills[5],
					sunday: pills[6],
				},
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("POST /api/user error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update user" },
			{ status: 500 }
		);
	}
}
