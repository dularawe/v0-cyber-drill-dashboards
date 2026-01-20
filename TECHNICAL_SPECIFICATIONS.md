# Cyber Drill Dashboards - Technical Infrastructure Specifications

## Executive Summary
For **500 concurrent users** with **99.5% uptime** requirement and **medium data volume**, your dev team needs to provision:

- **Backend Server:** 4GB RAM minimum, 8GB recommended
- **Database Server:** 8GB RAM minimum, 16GB recommended  
- **Storage:** 100GB minimum, 200GB recommended
- **Bandwidth:** 200 Mbps minimum, 500 Mbps recommended

---

## 1. BACKEND SERVER SPECIFICATIONS (Node.js Application)

### Memory Requirements

**Minimum Configuration:**
- **RAM:** 4 GB
- **Swap:** 2 GB
- **Total:** 6 GB

**Recommended Configuration:**
- **RAM:** 8 GB
- **Swap:** 4 GB
- **Total:** 12 GB

**Reasoning:**
- Base Node.js process: ~150-200 MB
- Application heap size: ~1.5-2 GB (configured via `--max-old-space-size=2048`)
- Connected sessions (500 users × ~2MB each): ~1 GB
- Buffer/Cache: ~500 MB
- Operating system & other services: ~500 MB
- Safety margin: ~1-2 GB

### Storage Requirements

**Minimum:** 50 GB
**Recommended:** 100 GB

**Breakdown:**
- OS and system files: 10-15 GB
- Node.js and npm packages: 2-3 GB
- Application code: <1 GB
- Log files (7-day rotation): 10-20 GB
- Temporary files/uploads: 10-15 GB
- Free space buffer: 5-10 GB

### CPU Requirements
- **Minimum:** 2 CPU cores
- **Recommended:** 4 CPU cores
- **Reason:** Multi-threaded request handling, 500 concurrent users need ~2-4 cores for optimal performance

### Bandwidth
- **Incoming:** 100 Mbps
- **Outgoing:** 100 Mbps
- **Total recommended:** 200 Mbps

---

## 2. DATABASE SERVER SPECIFICATIONS (MySQL)

### Memory Requirements

**Minimum Configuration:**
- **RAM:** 8 GB
- **MySQL buffer pool:** 6 GB (75% of total)
- **OS Reserved:** 2 GB

**Recommended Configuration:**
- **RAM:** 16 GB
- **MySQL buffer pool:** 12 GB (75% of total)
- **OS Reserved:** 4 GB

**Reasoning:**
- Database buffer pool (most critical): 6-12 GB
- Query cache: 256-512 MB
- Connection buffers (500 connections × 4MB): ~2 GB
- Temporary tables: 1-2 GB
- Operating system cache: 1-2 GB
- Safety margin: 1 GB

### Storage Requirements

**Minimum:** 100 GB
**Recommended:** 200 GB

**Breakdown for 100-500 drills, 1000-10000 participants:**
- MySQL data directory: 20-40 GB
  - Sessions table: 2-3 GB (500 drills × avg 10 sessions)
  - Questions table: 1-2 GB (500 drills × avg 20 questions)
  - Answers table: 5-10 GB (10000 participants × avg responses)
  - Question images: 10-15 GB (500 drills × avg 5 images × 5MB each)
  - Users & metadata: 1-2 GB
- Backups (daily incremental): 30-50 GB
- Logs (7-day rotation): 5-10 GB
- Temporary/working space: 5-10 GB
- Free space for growth: 20-30 GB

### Recommended MySQL Configuration
```ini
[mysqld]
# Memory Settings
innodb_buffer_pool_size = 12G        # 75% of RAM
innodb_log_file_size = 1G            # For 500 concurrent users
max_connections = 1000               # Reserve capacity
query_cache_size = 512M
query_cache_type = 1

# Performance
innodb_flush_log_at_trx_commit = 2   # Balance between performance and durability
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# Logging
slow_query_log = 1
long_query_time = 2
log_bin = mysql-bin
binlog_format = ROW                  # For replication
```

---

## 3. FRONTEND SPECIFICATIONS (Vercel)

### Memory Requirements (Per Region)
- **Vercel serverless functions:** Automatically managed
- **Per deployment:** 1024 MB default, can be optimized to 512 MB
- **Recommended:** 3 GB total bundle size across all functions

### Storage Requirements
- **Deployment size:** 100-150 MB
- **Static assets cache:** Globally distributed (CDN managed)
- **Build artifacts:** 200-300 MB per version (keep last 5 versions = 1 GB)

### Bandwidth
- **CDN bandwidth:** Automatically scaled by Vercel
- **Expected usage:** 50-100 GB/month for 500 users
- **Vercel Pro plan:** Includes 1 TB/month, sufficient for your needs

---

## 4. COMPLETE INFRASTRUCTURE SUMMARY

### Option A: Namecheap Shared Hosting (Current)
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Backend RAM** | 4 GB | 8 GB |
| **Database RAM** | 8 GB | 16 GB |
| **Total RAM** | 12 GB | 24 GB |
| **Storage** | 150 GB | 300 GB |
| **Bandwidth** | 200 Mbps | 500 Mbps |
| **Cost/Month** | $150-200 | $300-400 |

### Option B: Dedicated Server (Recommended for 99.5% SLA)
| Component | Specification |
|-----------|---------------|
| **Server Type** | Dedicated, not shared |
| **Total RAM** | 16-32 GB |
| **CPU** | 4-8 cores |
| **Storage** | SSD 300-500 GB |
| **Bandwidth** | 500 Mbps - 1 Gbps |
| **Backup** | Automated daily |
| **Cost/Month** | $250-400 |

### Option C: Cloud Infrastructure (AWS/GCP/Azure)
| Component | Specification |
|-----------|---------------|
| **Compute Instance** | t3.xlarge (4 vCPU, 16 GB RAM) |
| **Database Instance** | db.r5.2xlarge (8 vCPU, 64 GB RAM) |
| **Storage** | 300 GB SSD |
| **Autoscaling** | Enabled for 99.5% uptime |
| **Cost/Month** | $400-600 |

---

## 5. CAPACITY PLANNING BY USER LOAD

### Low Load (50-100 concurrent users)
- Backend RAM: 2 GB
- Database RAM: 4 GB
- Storage: 50 GB
- Bandwidth: 100 Mbps
- **Estimate:** Works on Namecheap Starter

### Medium Load (250-500 concurrent users) ← YOUR CURRENT REQUIREMENT
- Backend RAM: 4-8 GB ✓
- Database RAM: 8-16 GB ✓
- Storage: 100-200 GB ✓
- Bandwidth: 200-500 Mbps ✓
- **Estimate:** Needs Namecheap Business or better

### High Load (1000+ concurrent users)
- Backend RAM: 16 GB
- Database RAM: 32 GB
- Storage: 500+ GB
- Bandwidth: 1 Gbps
- **Estimate:** Requires dedicated/cloud infrastructure

---

## 6. PERFORMANCE METRICS FOR 500 CONCURRENT USERS

| Metric | Target |
|--------|--------|
| **Response Time (avg)** | <200 ms |
| **P95 Response Time** | <500 ms |
| **P99 Response Time** | <1 second |
| **Error Rate** | <0.1% |
| **Database Query Time** | <50 ms avg |
| **API Throughput** | 2000+ requests/second |
| **Memory Usage** | 60-70% under load |
| **CPU Usage** | 50-70% under load |
| **Disk I/O** | <50% utilization |

---

## 7. BACKUP & DISASTER RECOVERY

### Database Backups
- **Frequency:** Daily automated backups
- **Retention:** 30 days (requires additional 30-50 GB storage)
- **Recovery Time Objective (RTO):** < 1 hour
- **Recovery Point Objective (RPO):** < 15 minutes

### Backup Storage
```
Daily backups × 30 days = 30-50 GB
MySQL data size (20-40 GB) × 1.5 (compression factor) = 30-60 GB
Total backup storage needed: 60-100 GB
```

### Implementation
```bash
# Automated backup script (cron job every 6 hours)
0 */6 * * * mysqldump -u root -p${MYSQL_PASSWORD} --all-databases | gzip > /backup/mysql-$(date +\%Y\%m\%d-\%H\%M\%S).sql.gz
```

---

## 8. MONITORING & ALERTS

### Critical Metrics to Monitor
1. **Memory Usage:** Alert if > 80%
2. **CPU Usage:** Alert if > 80%
3. **Disk Space:** Alert if < 10% free
4. **Database Connections:** Alert if > 800/1000
5. **Response Time:** Alert if > 500ms (P95)
6. **Error Rate:** Alert if > 0.5%
7. **Bandwidth Usage:** Alert if > 400 Mbps

### Recommended Tools
- **Vercel:** Built-in monitoring and analytics
- **New Relic/DataDog:** Application Performance Monitoring
- **Uptime Robot:** Uptime monitoring
- **CloudWatch/Monitor:** Infrastructure monitoring
- **MySQL Workbench:** Database performance analysis

---

## 9. SCALING ROADMAP

### Phase 1 (Current): 500 concurrent users
- **Timeline:** Months 1-3
- **Infrastructure:** Namecheap Business ($300/month) + Vercel Pro ($20/month)
- **Capacity:** 4-8 GB RAM, 100-200 GB storage
- **Expected Cost:** $320/month

### Phase 2 (If scale to 1000 users)
- **Timeline:** Months 4-6
- **Infrastructure:** Upgrade to VPS or dedicated server ($400/month)
- **Capacity:** 16 GB RAM, 300 GB storage
- **Add:** Load balancer for multiple backend instances
- **Expected Cost:** $450-550/month

### Phase 3 (If scale to 5000+ users)
- **Timeline:** Months 7+
- **Infrastructure:** Cloud provider (AWS/GCP/Azure)
- **Capacity:** Auto-scaling infrastructure
- **Add:** CDN, database replication, caching layer
- **Expected Cost:** $800-1200/month

---

## 10. REQUIREMENTS CHECKLIST FOR DEV TEAM

### For Backend Server
- [ ] 4-8 GB RAM (minimum 4, recommended 8)
- [ ] 50-100 GB SSD storage
- [ ] Node.js v18+ runtime support
- [ ] 2-4 CPU cores
- [ ] 200 Mbps minimum bandwidth
- [ ] SSH/cPanel access for deployments
- [ ] Port 5000 accessible (or configured reverse proxy)
- [ ] SSL certificate support

### For Database Server
- [ ] 8-16 GB RAM dedicated to MySQL
- [ ] 100-200 GB SSD storage (for data + backups)
- [ ] MySQL 8.0+ server
- [ ] Automated backup system
- [ ] 500+ max connections support
- [ ] InnoDB storage engine enabled
- [ ] Binlog enabled for replication readiness

### For Frontend Deployment
- [ ] Vercel Pro plan ($20/month)
- [ ] CDN globally distributed
- [ ] Edge functions support
- [ ] Environment variables configured
- [ ] Custom domain SSL
- [ ] API rate limiting configured

### For Monitoring
- [ ] Application performance monitoring (APM)
- [ ] Database monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alert system configured
- [ ] Incident response plan

---

## 11. ESTIMATED COSTS (12 MONTHS)

| Service | Monthly | Annual | Notes |
|---------|---------|--------|-------|
| **Namecheap Business Hosting** | $300 | $3,600 | Backend + Database (if on same server) |
| **Vercel Pro** | $20 | $240 | Frontend hosting |
| **Monitoring/APM** | $50 | $600 | DataDog or New Relic basic |
| **Backups & Storage** | $20 | $240 | Additional storage for backups |
| **Domain & SSL** | $15 | $180 | Auto-renew |
| **Contingency (10%)** | $40 | $480 | Buffer for scaling |
| **TOTAL** | **$445** | **$5,340** | Year 1 estimate |

---

## 12. DECISION MATRIX

| Factor | Namecheap | VPS/Dedicated | Cloud (AWS) |
|--------|-----------|---------------|------------|
| **Initial Cost** | Low ($300) | Medium ($400) | Medium ($500) |
| **Scalability** | Limited | Good | Excellent |
| **Auto-scaling** | No | Manual | Automatic |
| **Uptime SLA** | 99% | 99.5-99.9% | 99.99% |
| **Management** | Minimal | Medium | Low |
| **Best For** | Small-medium | Growing | Enterprise |

---

## 13. APPROVAL CHECKLIST

- [ ] Stakeholders agree on capacity specs
- [ ] Budget approved for $445/month
- [ ] Dev team ready with infrastructure
- [ ] Database migration plan finalized
- [ ] Backup system configured
- [ ] Monitoring alerts set up
- [ ] Disaster recovery procedures documented
- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Go-live date confirmed

---

## Questions for Dev Team?

1. Can Namecheap server handle 8GB RAM allocation?
2. Is SSD storage available or HDD only?
3. What's the maximum bandwidth on the cPanel plan?
4. Are automated backups supported?
5. Can we upgrade during runtime if needed?
6. Is load balancing available for multiple instances?

**For any clarification, contact your hosting provider or infrastructure team.**
