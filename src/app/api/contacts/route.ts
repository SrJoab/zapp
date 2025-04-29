import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client

// Define the expected request body structure for creating a contact
interface CreateContactRequest {
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
}

// GET /api/contacts - Fetch list of contacts
export async function GET(request: NextRequest) {
  // TODO: Add authentication check here - only logged-in users should access contacts
  console.log('Attempting to fetch contacts from Supabase...');

  try {
    // Example: Fetch contacts from Supabase
    // Add pagination, filtering, sorting as needed
    const { data: contacts, error } = await supabase
      .from('contacts') // Assuming your table is named 'contacts'
      .select('*') // Select all columns, or specify needed ones: 'id, name, email, phone, tags, created_at'
      .order('created_at', { ascending: false })
      .limit(50); // Example limit

    if (error) {
      console.error('Supabase GET Contacts Error:', error);
      // Don't expose detailed Supabase errors directly to the client
      return NextResponse.json({ error: 'Erro ao buscar contatos.' }, { status: 500 });
    }

    console.log('Successfully fetched contacts:', contacts?.length);
    return NextResponse.json(contacts || [], { status: 200 });

  } catch (error) {
    console.error('GET Contacts API Handler Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  // TODO: Add authentication check here - only logged-in users should create contacts
  console.log('Attempting to create contact in Supabase...');

  try {
    const body: CreateContactRequest = await request.json();
    const { name, email, phone, tags } = body;

    // Basic validation
    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: 'Nome é obrigatório, e pelo menos um e-mail ou telefone deve ser fornecido' }, { status: 400 });
    }

    // Prepare data for Supabase insertion
    const contactData = {
      name,
      email: email || null, // Use null if empty for Supabase
      phone: phone || null, // Use null if empty for Supabase
      tags: tags || [], // Assuming 'tags' column is of type text[] or similar
      // created_at is usually handled by Supabase default value
      // user_id: userId // TODO: Get authenticated user ID and associate contact
    };

    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select() // Return the inserted row(s)
      .single(); // Expecting a single row insertion

    if (error) {
      console.error('Supabase POST Contact Error:', error);
      // Check for specific errors like unique constraint violations if needed
      // if (error.code === '23505') { // Example: unique constraint violation
      //   return NextResponse.json({ error: 'Contato já existe (e-mail ou telefone duplicado).' }, { status: 409 });
      // }
      return NextResponse.json({ error: 'Erro ao criar contato.' }, { status: 500 });
    }

    console.log('Successfully created contact:', newContact);
    return NextResponse.json(newContact, { status: 201 });

  } catch (error) {
    console.error('POST Contacts API Handler Error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Formato de requisição inválido' }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

