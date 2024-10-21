import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const userId = params.id;
    if (isNaN(Number(userId))) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }
    

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Error fetching user" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    console.log('Received params:', params);
    const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const userId = params.id;
    if (isNaN(Number(userId))) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                name: body.name ?? undefined,
                email: body.email ?? undefined,
                bio: body.bio ?? undefined,
                phone: body.phone ?? undefined,
                website: body.website ?? undefined,
                location: body.location ?? undefined,
                // Add other fields if needed
            },
        });

        return NextResponse.json({ message: "User updated successfully", updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const userId = params.id;
    if (isNaN(Number(userId))) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    try {
        await prisma.user.delete({
            where: { id: Number(userId) },
        });

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}
