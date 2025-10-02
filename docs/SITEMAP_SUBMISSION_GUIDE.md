# Sitemap Submission Guide - Notary and Signings LLC

## Overview
This guide explains how to submit your XML sitemap to search engines for better indexing and SEO performance.

## Sitemap Location
Your sitemap is located at: `https://notaryandsignings.com/sitemap.xml`

---

## Google Search Console Submission

### Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Enter your domain: `notaryandsignings.com`
4. Select "URL prefix" method

### Step 2: Verify Ownership

**Option A: HTML File Upload (Recommended)**
1. Download verification file from Search Console
2. Upload to `public/` folder in your project
3. Deploy site
4. Click "Verify" in Search Console

**Option B: DNS Verification**
1. Copy TXT record from Search Console
2. Add to your domain's DNS settings
3. Wait for DNS propagation (up to 48 hours)
4. Click "Verify" in Search Console

**Option C: HTML Meta Tag**
1. Copy meta tag from Search Console
2. Add to `index.html` in `<head>` section:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```
3. Deploy site
4. Click "Verify" in Search Console

### Step 3: Submit Sitemap
1. In Search Console, go to "Sitemaps" (left sidebar)
2. Enter sitemap URL: `sitemap.xml`
3. Click "Submit"
4. Wait for Google to process (may take a few days)

### Step 4: Monitor Indexing
1. Check "Coverage" report for indexing status
2. Monitor for errors or warnings
3. Fix any issues reported
4. Request re-indexing if needed

---

## Bing Webmaster Tools Submission

### Step 1: Access Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. Click "Add a site"
4. Enter: `https://notaryandsignings.com`

### Step 2: Verify Ownership

**Option A: Import from Google Search Console (Easiest)**
1. Click "Import from Google Search Console"
2. Authorize Bing to access your Google account
3. Select your property
4. Complete import

**Option B: XML File Verification**
1. Download verification XML file
2. Upload to `public/` folder
3. Deploy site
4. Click "Verify"

**Option C: Meta Tag Verification**
1. Copy verification meta tag
2. Add to `index.html`:
```html
<meta name="msvalidate.01" content="YOUR_VERIFICATION_CODE" />
```
3. Deploy site
4. Click "Verify"

### Step 3: Submit Sitemap
1. Go to "Sitemaps" section
2. Click "Submit Sitemap"
3. Enter: `https://notaryandsignings.com/sitemap.xml`
4. Click "Submit"

### Step 4: Configure Site
1. Set target country/region
2. Configure crawl rate
3. Enable email notifications
4. Review site scan results

---

## robots.txt Configuration

Ensure your `robots.txt` file includes sitemap reference:

```txt
User-agent: *
Allow: /

Sitemap: https://notaryandsignings.com/sitemap.xml
```

**Current Status:** ✅ Already configured

---

## Verification Checklist

### Pre-Submission
- [x] Sitemap created at `/public/sitemap.xml`
- [x] Sitemap accessible at `https://notaryandsignings.com/sitemap.xml`
- [x] All URLs in sitemap are valid and accessible
- [x] robots.txt includes sitemap reference
- [ ] Site deployed and live

### Google Search Console
- [ ] Property added to Search Console
- [ ] Ownership verified
- [ ] Sitemap submitted
- [ ] No errors in Coverage report
- [ ] Screenshot saved for documentation

### Bing Webmaster Tools
- [ ] Site added to Webmaster Tools
- [ ] Ownership verified
- [ ] Sitemap submitted
- [ ] Site configured (country, crawl rate)
- [ ] Screenshot saved for documentation

---

## Monitoring & Maintenance

### Weekly Tasks
- Check Search Console for new errors
- Review indexing status
- Monitor search performance

### Monthly Tasks
- Update sitemap if new pages added
- Review coverage reports
- Analyze search queries
- Check for manual actions

### Quarterly Tasks
- Review and optimize meta descriptions
- Update sitemap priority/frequency
- Analyze backlink profile
- Conduct SEO audit

---

## Sitemap Update Process

### When to Update Sitemap
- Adding new pages
- Removing pages
- Major content updates
- Changing URL structure

### How to Update

1. **Edit sitemap.xml**
   ```xml
   <url>
     <loc>https://notaryandsignings.com/new-page</loc>
     <lastmod>2025-10-15</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```

2. **Deploy Changes**
   - Commit changes to repository
   - Deploy to production

3. **Notify Search Engines**
   - Google: Resubmit in Search Console
   - Bing: Resubmit in Webmaster Tools
   - Or use ping URLs:
     - `http://www.google.com/ping?sitemap=https://notaryandsignings.com/sitemap.xml`
     - `http://www.bing.com/ping?sitemap=https://notaryandsignings.com/sitemap.xml`

---

## Advanced: Automated Sitemap Updates

### Option 1: GitHub Action (Future Enhancement)

Create `.github/workflows/update-sitemap.yml`:

```yaml
name: Update Sitemap
on:
  push:
    branches: [main]
jobs:
  update-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Ping Google
        run: |
          curl "http://www.google.com/ping?sitemap=https://notaryandsignings.com/sitemap.xml"
      - name: Ping Bing
        run: |
          curl "http://www.bing.com/ping?sitemap=https://notaryandsignings.com/sitemap.xml"
```

### Option 2: Dynamic Sitemap Generation (Future Enhancement)

Create a server-side endpoint that generates sitemap dynamically from database/routes.

---

## Common Issues & Solutions

### Issue: Sitemap Not Found
**Solution:** 
- Verify file is in `public/` folder
- Check deployment logs
- Test URL directly in browser

### Issue: URLs Not Being Indexed
**Solution:**
- Verify URLs are accessible (not 404)
- Check robots.txt isn't blocking
- Ensure pages have sufficient content
- Submit individual URLs for indexing

### Issue: Crawl Errors
**Solution:**
- Review error details in Search Console
- Fix broken links
- Improve page load speed
- Ensure mobile-friendly design

---

## Expected Results

### Timeline
- **Submission:** Immediate
- **Initial Crawl:** 1-3 days
- **Indexing Starts:** 3-7 days
- **Full Indexing:** 2-4 weeks
- **Ranking Improvements:** 1-3 months

### Success Metrics
- All pages indexed
- Coverage report: 0 errors
- Impressions increasing in Search Console
- Organic traffic growth
- Improved search rankings

---

## Documentation Screenshots

### Required Screenshots for Deliverables

1. **Google Search Console**
   - [ ] Sitemap submission confirmation
   - [ ] Coverage report (no errors)
   - [ ] Indexed pages count

2. **Bing Webmaster Tools**
   - [ ] Sitemap submission confirmation
   - [ ] Site verification success
   - [ ] Indexed pages count

3. **Sitemap Accessibility**
   - [ ] Browser screenshot of sitemap.xml
   - [ ] Valid XML structure

Save screenshots to: `docs/screenshots/seo/`

---

## Next Steps

1. **Complete Verification**
   - Follow verification steps above
   - Save confirmation screenshots

2. **Monitor Performance**
   - Set up weekly review schedule
   - Track key metrics

3. **Optimize Based on Data**
   - Review Search Console insights
   - Update content based on search queries
   - Improve low-performing pages

---

## Resources

### Official Documentation
- [Google Search Console Help](https://support.google.com/webmasters)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [XML Sitemap Protocol](https://www.sitemaps.org/protocol.html)

### Tools
- [Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## Last Updated
October 2, 2025

## Status
- [x] Sitemap created
- [ ] Google verification pending
- [ ] Bing verification pending
- [ ] Screenshots pending
