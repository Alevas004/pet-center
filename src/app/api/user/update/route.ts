import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import session from "@/lib/auth";
import { updateRouteUserSchema } from "@/schemas/user";
import { getUserByEmail } from "@/queries/user";

export async function PATCH(request: NextRequest) {
  try {
    const { user, isAutenticated } = await session();

    if (!isAutenticated) {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validatedFields = updateRouteUserSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Por favor, revisa los campos ingresados." },
        { status: 422 }
      );
    }

    const { name, email, phone_number, address, gender, image } =
      validatedFields.data;

    const existingUser = await getUserByEmail(email as string);

    if (existingUser && existingUser.email !== user?.email) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado." },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: user?.email as string },
      data: {
        name,
        email,
        phone_number,
        address,
        gender,
        image,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      {
        message: "Perfil actualizado correctamente.",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al actualizar el perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil." },
      { status: 500 }
    );
  }
}
