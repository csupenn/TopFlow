# Vercel Deployment Setup Guide

Complete guide for deploying TopFlow to Vercel with automated CI/CD.

## Prerequisites

- GitHub repository with TopFlow code
- Vercel account (free tier works for showcase projects)
- Access to repository settings

## Initial Vercel Setup

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your TopFlow GitHub repository
4. Vercel will auto-detect Next.js framework

### 2. Configure Build Settings

Vercel should auto-detect these settings (verify in project settings):

```
Framework Preset: Next.js
Build Command: pnpm build
Install Command: pnpm install
Output Directory: .next (auto-detected)
Node Version: 18.x
```

### 3. Environment Variables

No environment variables are required for basic deployment since TopFlow uses:
- Client-side localStorage for data
- BYOK (Bring Your Own Key) model for API keys

Recommended environment variables for production:

| Variable | Purpose | If unset |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Canonical origin, `https://www.topflow.dev` | — |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Durable rate limiting shared across serverless instances | In-memory limiter per instance |
| `RATE_LIMIT_KEY_SECRET` | HMAC secret for rate-limit keys, so Redis never stores a client IP. Generate with `openssl rand -hex 32` | Random per-instance secret: IPs stay hashed, but limits aren't shared across instances (a warning is logged once) |

Rotating `RATE_LIMIT_KEY_SECRET` only resets in-flight rate-limit windows (keys expire after ~1 minute).

### 4. Deploy

Click "Deploy" and Vercel will:
1. Install dependencies with pnpm
2. Run build command
3. Deploy to production URL
4. Provide preview URL

## Automated Deployments

### Production Deployments (master/main branch)

Every push to `master` or `main` branch automatically:
1. Triggers Vercel production deployment
2. Runs build and deploys to topflow.dev
3. No manual intervention required

### Preview Deployments (Pull Requests)

Every pull request automatically:
1. Creates a unique preview URL
2. Deploys PR changes for testing
3. Updates preview on every commit to PR
4. Preview URL format: `topflow-git-[branch]-[username].vercel.app`

## Domain Configuration

### Custom Domain Setup

1. Go to Vercel project settings
2. Navigate to "Domains" tab
3. Add custom domain: `topflow.dev`
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

### DNS Records (for topflow.dev)

Add these records in your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Vercel will verify and provision SSL within minutes.

## Security Headers

The `vercel.json` configuration includes security headers:

- **X-Content-Type-Options**: `nosniff` - Prevents MIME sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - XSS protection
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Privacy
- **Permissions-Policy**: Restricts camera, microphone, geolocation

### API Route Cache Control

All `/api/*` routes have:
```
Cache-Control: no-store, no-cache, must-revalidate
```

This ensures workflow execution results are never cached.

## GitHub Integration

### Automatic Deployment Trigger

Vercel automatically deploys when:
1. Code is pushed to `master` or `main`
2. Pull request is created or updated
3. Manual deployment triggered from Vercel dashboard

### Deployment Status Checks

GitHub pull requests will show:
- ✅ Vercel deployment successful
- 🔗 Preview URL for testing
- 📊 Build logs and performance metrics

## CI/CD Pipeline

### GitHub Actions → Vercel Flow

```
1. Developer pushes code to GitHub
   ↓
2. GitHub Actions runs (from .github/workflows/ci.yml)
   - Lint and type check
   - Run tests (437 tests)
   - Build application
   ↓
3. If all checks pass:
   - Vercel deploys automatically
   - Production or preview deployment
   ↓
4. Deployment complete
   - SSL certificate provisioned
   - CDN cache warmed
   - Application live
```

### Build Performance

Expected build times:
- **Install dependencies**: 1-2 minutes (with cache)
- **Run tests**: 30-60 seconds
- **Build Next.js**: 1-2 minutes
- **Total**: 3-5 minutes

## Monitoring and Analytics

### Vercel Analytics

Enable in Vercel dashboard:
1. Go to project settings
2. Navigate to "Analytics" tab
3. Enable Web Analytics (included in free tier)

Tracks:
- Page views
- Core Web Vitals
- Performance metrics
- Real user monitoring

### Vercel Logs

Access deployment logs:
1. Go to project dashboard
2. Click "Deployments" tab
3. Select deployment
4. View build logs, function logs, and errors

### Error Tracking

For production errors:
- Vercel automatically captures runtime errors
- Access via "Logs" in project dashboard
- Filter by severity, time range, function

## Rollback Process

If a deployment has issues:

### Quick Rollback
1. Go to Vercel dashboard
2. Navigate to "Deployments"
3. Find previous working deployment
4. Click "Promote to Production"
5. Instant rollback (< 1 minute)

### Git Rollback
```bash
# Revert commit
git revert <commit-hash>
git push origin master

# Vercel auto-deploys reverted version
```

## Performance Optimization

### Vercel Edge Network

TopFlow is deployed to Vercel's global CDN:
- 40+ edge locations worldwide
- Sub-100ms response times globally
- Automatic HTTPS and HTTP/2
- DDoS protection included

### Caching Strategy

- **Static assets**: Cached at edge (CSS, JS, images)
- **API routes**: No caching (`Cache-Control: no-store`)
- **Pages**: ISR (Incremental Static Regeneration) as needed

## Troubleshooting

### Build Fails on Vercel

**Check build logs**:
1. Click failed deployment
2. Review "Build Logs" tab
3. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Environment variable issues

**Solution**:
```bash
# Test build locally first
pnpm install
pnpm build

# If local build works, check Vercel build command
```

### Deployment Succeeds but Site Broken

**Check function logs**:
1. Go to "Logs" tab in Vercel dashboard
2. Filter by "Errors"
3. Common issues:
   - Missing environment variables
   - API route errors
   - Client-side hydration issues

**Solution**:
```bash
# Test production build locally
pnpm build
pnpm start

# Visit http://localhost:3000 and test
```

### Preview Deployment Not Updating

**Force new deployment**:
1. Add empty commit: `git commit --allow-empty -m "trigger deployment"`
2. Push: `git push origin [branch]`
3. Vercel will create new preview deployment

## Cost Estimation

### Vercel Free Tier (Hobby)

Includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Analytics (Web Vitals)
- ✅ Preview deployments

**Estimated cost**: $0/month for showcase project

### Vercel Pro (If Needed)

If exceeding free tier:
- $20/month per member
- 1 TB bandwidth
- Advanced analytics
- Team collaboration

**Note**: TopFlow's BYOK model means zero ongoing API costs. Users provide their own AI provider keys.

## Security Checklist

Before deploying to production:

- [x] Security headers configured (`vercel.json`)
- [x] HTTPS enforced (automatic with Vercel)
- [x] API routes have rate limiting (10 req/min per IP)
- [x] SSRF prevention in HTTP request validation
- [x] No sensitive data in environment variables
- [x] Client-side data stored in localStorage only
- [x] BYOK model (no shared API keys)

## Next Steps After Deployment

1. **Test production deployment**:
   - Visit topflow.dev
   - Test workflow creation and execution
   - Verify demo mode works without API keys
   - Test API key management (localStorage)

2. **Monitor initial performance**:
   - Check Vercel Analytics for Core Web Vitals
   - Review function logs for errors
   - Monitor bandwidth usage

3. **Set up custom domain** (if not already):
   - Configure DNS records
   - Verify SSL certificate provisioned
   - Test www redirect

4. **Enable monitoring**:
   - Vercel Analytics for performance
   - GitHub Actions for build status
   - Optional: Set up error tracking (Sentry, etc.)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli) (for manual deployments)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)

---

**Deployment Status**: Ready for production
**Last Updated**: January 2026
**Maintainer**: Charlie Su (@charliesu)
