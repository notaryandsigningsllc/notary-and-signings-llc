# Wix Email Marketing Integration Guide

## Overview
This guide explains how to integrate the Notary and Signings LLC website with Wix's email marketing platform (Wix Ascend) for newsletter campaigns and marketing automation.

## Integration Options

### Option 1: Wix Contacts API (Recommended)
Use Wix's Contacts API to sync newsletter subscriptions directly to your Wix account.

### Option 2: Zapier Integration
Use Zapier as a middleware to connect Supabase to Wix.

### Option 3: Manual CSV Export
Export newsletter subscribers from Supabase and import to Wix manually.

---

## Option 1: Wix Contacts API Integration

### Prerequisites
- Wix account with Ascend subscription
- Wix API key
- Access to Wix Developer Console

### Step 1: Create Wix API Key

1. Go to [Wix Developers](https://dev.wix.com/)
2. Navigate to "My Apps" → "Create New App"
3. Select "Email Marketing" permissions
4. Generate API key
5. Save the API key securely

### Step 2: Add Wix API Key to Supabase Secrets

The API key needs to be stored in Supabase secrets as `WIX_API_KEY`.

### Step 3: Create Wix Sync Edge Function

Create a new edge function: `supabase/functions/sync-to-wix/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WIX_API_URL = "https://www.wixapis.com/contacts/v4/contacts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { email, name, source } = await req.json();

    // Sync to Wix Contacts
    const wixResponse = await fetch(WIX_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("WIX_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          name: {
            first: name || "",
          },
          emails: [{
            email: email,
            tag: "MAIN"
          }],
          labels: ["Newsletter Subscriber", source || "Website"],
        }
      }),
    });

    if (!wixResponse.ok) {
      throw new Error(`Wix API error: ${wixResponse.statusText}`);
    }

    const wixData = await wixResponse.json();
    console.log("Synced to Wix:", wixData);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error syncing to Wix:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

### Step 4: Update Newsletter Component

Modify `src/components/NewsletterSignup.tsx` to call the Wix sync function:

```typescript
// After successful Supabase insert:
await supabase.functions.invoke('sync-to-wix', {
  body: {
    email: email.trim().toLowerCase(),
    name: name.trim() || null,
    source: 'website'
  }
});
```

---

## Option 2: Zapier Integration (No-Code Solution)

### Prerequisites
- Zapier account
- Wix account
- Supabase webhook endpoint

### Setup Steps

1. **Create Zapier Account**
   - Sign up at [zapier.com](https://zapier.com)

2. **Create New Zap**
   - Trigger: Webhook (Catch Hook)
   - Action: Wix (Add Contact to Email List)

3. **Configure Webhook in Supabase**
   
   Create edge function to trigger Zapier:
   
   ```typescript
   // In newsletter signup, after database insert:
   await fetch(Deno.env.get("ZAPIER_WEBHOOK_URL"), {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       email: email,
       name: name,
       source: "website",
       timestamp: new Date().toISOString()
     })
   });
   ```

4. **Map Fields in Zapier**
   - Email → Wix Contact Email
   - Name → Wix Contact Name
   - Source → Wix Contact Label

5. **Test the Integration**
   - Submit test newsletter signup
   - Verify contact appears in Wix

---

## Option 3: Manual CSV Export

### Export from Supabase

1. **Create Export Query**
   ```sql
   SELECT 
     email,
     name,
     subscribed_at,
     source,
     is_active
   FROM newsletter_subscriptions
   WHERE is_active = true
   ORDER BY subscribed_at DESC;
   ```

2. **Export to CSV**
   - Run query in Supabase dashboard
   - Click "Download CSV"

3. **Import to Wix**
   - Login to Wix dashboard
   - Go to Marketing → Email Marketing
   - Click "Import Contacts"
   - Upload CSV file
   - Map columns
   - Complete import

### Automation Script

Create a scheduled export script (run weekly):

```typescript
// supabase/functions/export-newsletter/index.ts
serve(async (req) => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;

  // Convert to CSV format
  const csv = convertToCSV(data);
  
  // Email CSV to admin or upload to storage
  // Implementation depends on your needs
});
```

---

## Wix Campaign Setup

### Creating Email Campaigns in Wix

1. **Access Wix Ascend**
   - Go to Marketing & SEO → Email Marketing

2. **Create Campaign**
   - Click "Create Email Campaign"
   - Choose template or create custom
   - Add content

3. **Segment Audience**
   - Filter by labels (e.g., "Newsletter Subscriber")
   - Filter by source (e.g., "Website")
   - Filter by signup date

4. **Schedule Campaign**
   - Choose send time
   - Set up A/B testing (optional)
   - Review and send

### Automated Sequences

#### Welcome Email Sequence
1. Trigger: New subscriber
2. Day 0: Welcome email
3. Day 3: About our services
4. Day 7: Special offer

#### Post-Booking Sequence  
1. Trigger: Booking confirmed
2. Day 1: Booking confirmation (already implemented)
3. Day 3: Review request (already implemented)
4. Day 7: Service upsell (already implemented)
5. Day 14: Newsletter invite (already implemented)

---

## Best Practices

### Data Sync
- Sync newsletter subscribers in real-time
- Handle duplicate emails gracefully
- Keep Supabase as source of truth
- Log sync failures for monitoring

### Compliance
- Include unsubscribe link in all emails
- Honor unsubscribe requests immediately
- Maintain GDPR/CAN-SPAM compliance
- Keep privacy policy updated

### Segmentation
- Tag subscribers by source (website, booking, event)
- Track engagement metrics
- Create segments for targeted campaigns
- Clean inactive subscribers periodically

### Testing
- Test email rendering across devices
- A/B test subject lines
- Monitor open and click rates
- Iterate based on performance

---

## Monitoring & Analytics

### Key Metrics to Track
- Subscriber growth rate
- Open rate (target: > 20%)
- Click-through rate (target: > 3%)
- Unsubscribe rate (target: < 0.5%)
- Conversion rate from email campaigns

### Tools
- Wix Analytics Dashboard
- Google Analytics UTM tracking
- Supabase newsletter_subscriptions table
- Custom reporting queries

---

## Troubleshooting

### Common Issues

**Issue: Subscribers not syncing to Wix**
- Solution: Check API key validity, verify permissions, check error logs

**Issue: Duplicate contacts in Wix**
- Solution: Use email as unique identifier, implement deduplication logic

**Issue: High unsubscribe rate**
- Solution: Review email frequency, improve content quality, segment audience

---

## Migration Checklist

- [ ] Create Wix account and enable Ascend
- [ ] Generate Wix API key
- [ ] Add WIX_API_KEY to Supabase secrets
- [ ] Create sync edge function
- [ ] Test newsletter signup flow
- [ ] Verify contacts appear in Wix
- [ ] Set up welcome email sequence
- [ ] Create first newsletter campaign
- [ ] Configure analytics tracking
- [ ] Document process for team

---

## Resources

### Wix Documentation
- [Wix Contacts API](https://dev.wix.com/api/rest/contacts/contacts/introduction)
- [Wix Email Marketing](https://support.wix.com/en/article/about-email-marketing)
- [Wix Ascend](https://www.wix.com/ascend/home)

### Additional Tools
- [Zapier Wix Integration](https://zapier.com/apps/wix/integrations)
- [Mailchimp Alternative Guide](https://mailchimp.com/help/import-contacts/)

---

## Last Updated
October 2, 2025

## Contact
For technical support, contact the development team.
