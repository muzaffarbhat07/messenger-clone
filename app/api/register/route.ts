import bcrypt from 'bcrypt';
import prisma from '../../libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST (request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;
    if(!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if(existingUser) {
      return new NextResponse('User with this email already exists', { status: 400 });
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    });
  
    return NextResponse.json(user);
  } catch(error: any) {
    console.log(error, 'REGISTRATION ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }

}