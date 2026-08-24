# 💳 Webhook do Stripe para Ativação do Plano PRO

Esta Edge Function do Supabase processa eventos de pagamento em tempo real da Stripe e atualiza a coluna `plan_tier` (`free` ou `pro`) na tabela `profiles` do Supabase.

---

## 🔑 Variáveis de Ambiente Necessárias (Supabase Secrets)

Configure as seguintes chaves no seu projeto do Supabase via Dashboard ou CLI:

```bash
supabase secrets set STRIPE_SECRET_KEY="sk_test_..."
supabase secrets set STRIPE_WEBHOOK_SECRET="whsec_..."
```

*(As variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente pelo ambiente Supabase).*

---

## 🚀 Como Fazer o Deploy da Função

Com a [Supabase CLI](https://supabase.com/docs/guides/cli) instalada e linkada ao seu projeto:

```bash
supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## 🧪 Como Testar Localmente com Stripe CLI (Test Mode)

1. Instale o Stripe CLI: `stripe login`
2. Inicie o redirecionamento de eventos locais:
   ```bash
   stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
   ```
3. Copie o `whsec_...` exibido no terminal e configure como `STRIPE_WEBHOOK_SECRET`.
4. Em outro terminal, dispare uma simulação de pagamento aprovado:
   ```bash
   stripe trigger checkout.session.completed
   ```
5. Simule o cancelamento de uma assinatura:
   ```bash
   stripe trigger customer.subscription.deleted
   ```

---

## 📋 Eventos Suportados

| Evento Stripe | Ação no QG do Concurseiro |
| :--- | :--- |
| `checkout.session.completed` | Ativa `plan_tier = 'pro'` para o usuário (`client_reference_id` ou `email`) |
| `customer.subscription.updated` | Mantém `plan_tier = 'pro'` enquanto `status` for `active` ou `trialing` |
| `customer.subscription.deleted` | Reverte `plan_tier = 'free'` ao cancelar a assinatura |
