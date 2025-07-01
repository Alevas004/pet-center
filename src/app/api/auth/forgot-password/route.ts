import { NextResponse } from "next/server";

import { forgotPasswordSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/queries/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedFields = forgotPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Por favor, revisa los campos ingresados." },
        { status: 422 }
      );
    }

    const { email } = validatedFields.data;

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "El usuario no existe." },
        { status: 404 }
      );
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    const emailResult = await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    if (!emailResult.success) {
      console.warn("Email service not available:", emailResult.error);
    }

    return NextResponse.json(
      {
        message:
          "Instructions to reset your password have been sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
