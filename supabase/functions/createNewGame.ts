import { serve } from 'https://deno.land/std@0.188.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseClientAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

async function makeKey(length: number): Promise<string> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

serve(async (req: Request) => {
  try {
    const supabaseClientUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const {
      data: { user },
    } = await supabaseClientUser.auth.getUser();

    const { max_players, num_mafia, num_doctor, num_detective, num_vigilante, is_public } = await req.json();
    const key = await makeKey(8);

    const { data, error } = supabaseClientAdmin.from('upcoming_games').insert([
        {
            id: key,
            host: user.id,
            lobby: [],
            locked: false,
            max_players,
            num_mafia,
            num_doctor,
            num_detective,
            num_vigilante,
            is_public
        }
    ]);
    if (error) throw error;

    return new Response(JSON.stringify({ key }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})