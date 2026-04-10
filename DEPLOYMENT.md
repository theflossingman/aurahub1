# Aura OS Deployment Guide

## Overview

Aura OS is a real-time family aura tracking application with WebSocket synchronization. This guide covers deployment using Docker, GitHub Actions, and Portainer.

## Prerequisites

- Docker and Docker Compose installed
- Portainer instance (optional but recommended)
- GitHub account with container registry access

## Local Development

### Using Docker Compose

```bash
# Build and run locally
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t aura-os .

# Run the container
docker run -p 3002:3002 --name aura-os aura-os
```

## Production Deployment

### 1. GitHub Setup

1. Fork/clone this repository to your GitHub account
2. Enable GitHub Container Registry in your repository settings
3. Push your changes to trigger the automated build

### 2. GitHub Actions Workflow

The workflow automatically:
- Builds Docker images on push to main/master
- Pushes to GitHub Container Registry (ghcr.io)
- Supports multiple architectures (amd64, arm64)
- Generates SBOM for security scanning

### 3. Portainer Deployment

#### Option A: Using Stack File

1. Open Portainer dashboard
2. Go to "Stacks" and click "Add stack"
3. Copy the contents of `portainer-stack.yml`
4. Update the image name: `ghcr.io/YOUR_USERNAME/aura-os:latest`
5. Deploy the stack

#### Option B: Using Web UI

1. Go to "Containers" in Portainer
2. Click "Add container"
3. Set image: `ghcr.io/YOUR_USERNAME/aura-os:latest`
4. Map port 3002:3002
5. Set restart policy to "unless-stopped"
6. Deploy

### 4. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | production | Application environment |
| PORT | 3002 | Server port |

### 5. Health Checks

The container includes a health check that:
- Tests the `/api/aura` endpoint every 30 seconds
- Marks the container as unhealthy after 3 failed attempts
- Provides automatic recovery monitoring

## Network Configuration

### Cross-Device Access

The application is configured to work across devices on your network:

1. **Local Access**: `http://localhost:3002`
2. **Network Access**: `http://YOUR_IP:3002`
3. **Domain Access**: Configure reverse proxy for custom domain

### Reverse Proxy (Optional)

For production deployments, consider using Traefik or Nginx:

```yaml
# Traefik labels (uncomment in docker-compose.yml)
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.aura-os.rule=Host(`aura.yourdomain.com`)"
  - "traefik.http.routers.aura-os.entrypoints=websecure"
  - "traefik.http.routers.aura-os.tls=true"
```

## Monitoring and Maintenance

### Logs

```bash
# View container logs
docker logs aura-os

# Follow logs in real-time
docker logs -f aura-os
```

### Updates

1. Push new code to GitHub
2. GitHub Actions builds new image
3. In Portainer, pull latest image and redeploy
4. Or use `docker-compose pull && docker-compose up -d`

### Backup

The application stores data in memory. For persistence:
1. Add volume mounting for data backup
2. Consider database integration for production
3. Implement regular backup strategies

## Security Considerations

- Container runs as non-root user
- Health checks for monitoring
- CORS enabled for cross-origin requests
- Regular security updates via GitHub Actions

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change port mapping if 3002 is in use
2. **Network access**: Ensure firewall allows port 3002
3. **CORS issues**: Check browser console for CORS errors
4. **WebSocket connection**: Verify WebSocket support in network

### Debug Commands

```bash
# Check container status
docker ps

# Inspect container
docker inspect aura-os

# Access container shell
docker exec -it aura-os sh

# Restart container
docker restart aura-os
```

## Production Checklist

- [ ] Update image name in portainer-stack.yml
- [ ] Configure domain and SSL (optional)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Test cross-device functionality
- [ ] Verify WebSocket connections
- [ ] Check health monitoring

## Support

For issues:
1. Check container logs for errors
2. Verify network connectivity
3. Ensure all dependencies are installed
4. Review GitHub Actions build logs
