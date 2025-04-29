import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client

// Define ChannelType (assuming it's consistent)
type ChannelType = 'whatsapp' | 'email' | 'sms';

// Define the expected request body structure for creating a channel
interface CreateChannelRequest {
  type?: ChannelType;
  name?: string;
  credentials?: any; // Keep as any for flexibility, but handle securely
  enabled?: boolean;
}

// GET /api/channels - Fetch list of channels
export async function GET(request: NextRequest) {
  // TODO: Add authentication check here - only logged-in users should access channels
  console.log('Attempting to fetch channels from Supabase...');

  try {
    // Example: Fetch channels from Supabase
    // IMPORTANT: Select only non-sensitive fields. DO NOT select 'credentials' here.
    const { data: channels, error } = await supabase
      .from('channels') // Assuming your table is named 'channels'
      .select('id, type, name, enabled, created_at') // Exclude credentials
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET Channels Error:', error);
      return NextResponse.json({ error: 'Erro ao buscar canais.' }, { status: 500 });
    }

    console.log('Successfully fetched channels:', channels?.length);
    // Return the safe data (without credentials)
    return NextResponse.json(channels || [], { status: 200 });

  } catch (error) {
    console.error('GET Channels API Handler Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/channels - Add a new channel
export async function POST(request: NextRequest) {
  // TODO: Add authentication check here - only logged-in users should create channels
  console.log('Attempting to create channel in Supabase...');

  try {
    const body: CreateChannelRequest = await request.json();
    const { type, name, credentials, enabled } = body;

    // Basic validation
    if (!type || !name || !credentials) {
      return NextResponse.json({ error: 'Tipo, nome e credenciais são obrigatórios' }, { status: 400 });
    }
    // TODO: Add type-specific validation for credentials

    // IMPORTANT: Credentials should be encrypted before storing in a real application.
    // Storing them as plain JSON here is NOT secure.
    const storedCredentials = JSON.stringify(credentials);

    // Prepare data for Supabase insertion
    const channelData = {
      type,
      name,
      credentials: storedCredentials, // Storing stringified JSON (INSECURE)
      enabled: enabled !== undefined ? enabled : true, // Default to true
      // created_at is usually handled by Supabase default value
      // user_id: userId // TODO: Get authenticated user ID and associate channel
    };

    const { data: newChannel, error } = await supabase
      .from('channels')
      .insert([channelData])
      .select('id, type, name, enabled, created_at') // Return only non-sensitive fields
      .single(); // Expecting a single row insertion

    if (error) {
      console.error('Supabase POST Channel Error:', error);
      // Handle potential errors like unique constraints if applicable
      return NextResponse.json({ error: 'Erro ao adicionar canal.' }, { status: 500 });
    }

    console.log('Successfully created channel:', newChannel);
    // Return the safe data (without credentials)
    return NextResponse.json(newChannel, { status: 201 });

  } catch (error) {
    console.error('POST Channels API Handler Error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Formato de requisição inválido' }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

