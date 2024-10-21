import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { userSchema } from "@/lib/validations/zodValidation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Route to create a new user profile
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //     return NextResponse.json({
    //         message: "You must be logged in to create hotels"
    //     }, { status: 401 });
    // }

    const body = await req.json();

    try {

        const validatedData = userSchema.parse(body);

        const user = await prisma.user.create({
            data: {
              name: validatedData.name,
              email: validatedData.email,
              bio: validatedData.bio ?? null,        // Optional field, handle null
              phone: validatedData.phone ?? null,    // Optional field, handle null
              website: validatedData.website ?? null,// Optional field, handle null
              image: validatedData.image ?? null,    // Optional field, handle null
              location: validatedData.location ?? null, // Optional field, handle null
              provider: validatedData.provider,      // Required field, for provider
          
              // Nested creation for SocialLinks, Projects, and Skills
              socialLinks: {
                create: validatedData.socialLinks?.map((link) => ({
                  type: link.type,
                  url: link.url ?? "sues",
                })),
              },
              projects: {
                create: validatedData.projects?.map((project) => ({
                  title: project.title,
                  description: project.description,
                  liveUrl: project.liveUrl ?? null,   // Optional field, handle null
                  repoUrl: project.repoUrl ?? null,   // Optional field, handle null
                })),
              },
              skills: {
                create: validatedData.skills?.map((skill) => ({
                    name: skill.name, // Assuming skills are passed as an array of strings
                })),

              },
            },
          });
          

        return NextResponse.json({
            message: "Hotel created successfully",
            user
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating hotel:", error);
        return NextResponse.json({
            message: "An error occurred while creating the hotel"
        }, { status: 500 });
    }
}
