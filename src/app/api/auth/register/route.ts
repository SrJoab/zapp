import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client

// Define the expected request body structure
interface RegisterRequestBody {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Explicitly type the request body
    const body: RegisterRequestBody = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 });
    }

    // --- Supabase Sign Up Logic --- START
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // You can store additional user metadata here
        data: {
          full_name: name,
          // Add other fields as needed, ensure they exist in your Supabase 'users' table or profile table
        },
        // If you want email confirmation enabled (default in Supabase), the user needs to click a link.
        // emailRedirectTo: `${request.nextUrl.origin}/auth/callback`, // Optional: URL to redirect to after email confirmation
      },
    });

    if (error) {
      console.error('Supabase Sign Up Error:', error);
      // Provide more specific error messages based on Supabase error codes if desired
      if (error.message.includes("User already registered")) {
          return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
      }
      if (error.message.includes("Password should be at least 6 characters")) {
          return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Erro ao registrar usuário.' }, { status: error.status || 500 });
    }

    // Handle case where user is created but email confirmation is required
    // data.user will exist, data.session might be null if confirmation is needed
    if (data.user && !data.session) {
        // If email confirmation is enabled in Supabase, this is the expected successful outcome initially.
        return NextResponse.json({ message: 'Usuário registrado com sucesso! Verifique seu e-mail para confirmação.' }, { status: 201 });
    }

    // Handle case where user is created AND session is returned (e.g., email confirmation disabled)
    if (data.user && data.session) {
        return NextResponse.json({ message: 'Usuário registrado e logado com sucesso!', userId: data.user.id }, { status: 201 });
    }

    // Fallback response if something unexpected happens
    return NextResponse.json({ message: 'Registro concluído, mas o estado final é inesperado.' }, { status: 200 });

    // --- Supabase Sign Up Logic --- END

  } catch (error) {
    console.error('Register API Handler Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Formato de requisição inválido' }, { status: 400 });
    }
    // Ensure error is an instance of Error before accessing message
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

