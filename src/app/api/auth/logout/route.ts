import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Sign out the user by invalidating the session
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase Sign Out Error:', error);
      return NextResponse.json({ error: error.message || 'Erro ao fazer logout.' }, { status: 500 });
    }

    // Successful logout
    return NextResponse.json({ message: 'Logout realizado com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Logout API Handler Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
