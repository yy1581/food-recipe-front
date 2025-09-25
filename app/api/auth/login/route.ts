import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MockUserData } from '../../../mock/mock';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // 입력값 검증
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { message: '아이디를 입력해주세요.' },
        { status: 400 }
      );
    }

    const trimmedId = id.trim();

    // 사용자 존재 확인
    if (!MockUserData.hasUser(trimmedId)) {
      return NextResponse.json(
        { message: '존재하지 않는 아이디입니다.' },
        { status: 401 }
      );
    }

    // 로그인 성공 - 쿠키 설정
    const response = NextResponse.json(
      { 
        message: '로그인 성공',
        userId: trimmedId 
      },
      { status: 200 }
    );

    // HTTP-only 쿠키 설정
    response.cookies.set('auth-token', trimmedId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/'
    });

    // 클라이언트 접근 가능한 사용자 정보 쿠키
    response.cookies.set('user-id', trimmedId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}