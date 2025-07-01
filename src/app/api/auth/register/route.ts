import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerRoteSchema } from "@/schemas/auth";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/queries/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received data:", body); // For debug

    const validatedFields = registerRoteSchema.safeParse(body);

    if (!validatedFields.success) {
      console.log("Validation errors:", validatedFields.error.format()); // For debug
      return NextResponse.json(
        {
          error: "Please check the entered fields.",
          details: validatedFields.error.format(),
        },
        { status: 422 }
      );
    }

    const { name, email, phone_number, address, gender, password, image } =
      validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email address is already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        phone_number,
        address,
        gender,
        password: hashedPassword,
        image: image || null,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Error registering user." },
      { status: 500 }
    );
  }
}
