// ==========================================================================
// QG DO CONCURSEIRO - SUPABASE EDGE FUNCTION: STRIPE WEBHOOK
// ==========================================================================
// Deno TypeScript environment for Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import Stripe from "https://esm.sh/stripe@14.18.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req: Request) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!signature || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Assinatura ou segredo do webhook ausente." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    console.log(`Evento Stripe recebido: ${event.type}`);

    switch (event.type) {
      // 1. Pagamento de Checkout Concluído com Sucesso
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        console.log(`Checkout aprovado para User ID: ${userId} / Email: ${customerEmail}`);

        if (userId) {
          await supabaseAdmin.from("profiles").update({
            plan_tier: "pro",
            stripe_customer_id: customerId || null,
            stripe_subscription_id: subscriptionId || null,
            updated_at: new Date().toISOString()
          }).eq("id", userId);
        } else if (customerEmail) {
          await supabaseAdmin.from("profiles").update({
            plan_tier: "pro",
            stripe_customer_id: customerId || null,
            stripe_subscription_id: subscriptionId || null,
            updated_at: new Date().toISOString()
          }).eq("email", customerEmail);
        }
        break;
      }

      // 2. Assinatura Ativada ou Atualizada
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        const isProActive = status === "active" || status === "trialing";
        const tier = isProActive ? "pro" : "free";

        console.log(`Assinatura ${subscription.id} status: ${status} -> tier: ${tier}`);

        await supabaseAdmin.from("profiles").update({
          plan_tier: tier,
          stripe_subscription_id: subscription.id,
          updated_at: new Date().toISOString()
        }).eq("stripe_customer_id", customerId);
        break;
      }

      // 3. Assinatura Cancelada ou Expirada
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`Assinatura cancelada: ${subscription.id}. Revertendo para free.`);

        await supabaseAdmin.from("profiles").update({
          plan_tier: "free",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString()
        }).eq("stripe_customer_id", customerId);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error(`Erro no processamento do webhook: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
});
