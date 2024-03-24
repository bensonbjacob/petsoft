import prisma from "@/lib/db";

export async function POST(request: Request) {
  const data = await request.json();

  // Verify that the request is coming from Stripe

  // Fulfill the order
  await prisma.user.update({
    where: {
      email: data.data.object.customer_email,
    },
    data: {
      hasAccess: true,
    },
  });

  // Return 200 OK
  return Response.json(null, { status: 200 });
}
