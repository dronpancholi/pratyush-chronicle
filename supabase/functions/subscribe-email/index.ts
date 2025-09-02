import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, name, phone, department, semester } = await req.json();

    // Generate confirmation token
    const confirmToken = crypto.randomUUID();

    // Check if email already exists
    const { data: existingSubscriber } = await supabaseClient
      .from('subscribers')
      .select('id, confirmed')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.confirmed) {
        return new Response(
          JSON.stringify({ error: 'Email already subscribed and confirmed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Update existing unconfirmed subscription
        const { error } = await supabaseClient
          .from('subscribers')
          .update({ 
            name, 
            phone, 
            department, 
            semester,
            confirm_token: confirmToken 
          })
          .eq('id', existingSubscriber.id);

        if (error) throw error;
      }
    } else {
      // Create new subscription
      const { error } = await supabaseClient
        .from('subscribers')
        .insert({ 
          email, 
          name, 
          phone, 
          department, 
          semester,
          confirm_token: confirmToken 
        });

      if (error) throw error;
    }

    // TODO: Send confirmation email
    // For now, we'll just return success
    console.log(`Subscription confirmation link: ${Deno.env.get('SITE_URL')}/confirm-subscription?token=${confirmToken}`);

    return new Response(
      JSON.stringify({ 
        message: 'Subscription created successfully. Please check your email for confirmation.',
        confirmUrl: `${Deno.env.get('SITE_URL')}/confirm-subscription?token=${confirmToken}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in subscribe-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});