import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client

// Define the expected request body structure
interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Explicitly type the request body
    const body: LoginRequestBody = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 });
    }

    // --- Supabase Sign In Logic --- START
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Supabase Sign In Error:', error);
      // Provide more specific error messages based on Supabase error codes
      if (error.message.includes("Invalid login credentials")) {
          return NextResponse.json({ error: 'Credenciais de login inválidas.' }, { status: 401 });
      }
      if (error.message.includes("Email not confirmed")) {
          // You might want to prompt the user to check their email
          return NextResponse.json({ error: 'E-mail ainda não confirmado. Verifique sua caixa de entrada.' }, { status: 401 });
      }
      return NextResponse.json({ error: error.message || 'Erro ao fazer login.' }, { status: error.status || 500 });
    }

    // Login successful - data.user and data.session should exist
    if (data.user && data.session) {
        // IMPORTANT: The session contains the JWT. In a real application,
        // you might handle this differently depending on your auth strategy (e.g., cookies).
        // For now, we just confirm success. The client-side will need to manage the session.
        console.log('Supabase Login successful for:', email);
        return NextResponse.json({ message: 'Login bem-sucedido!', userId: data.user.id /*, session: data.session // Avoid sending the whole session back unless needed */ }, { status: 200 });
    } else {
        // This case should ideally not happen if there's no error, but handle it just in case
        console.warn('Supabase login did not return user or session despite no error.');
        return NextResponse.json({ error: 'Login falhou por um motivo inesperado.' }, { status: 500 });
    }
    // --- Supabase Sign In Logic --- END

  } catch (error) {
    console.error('Login API Handler Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Formato de requisição inválido' }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

