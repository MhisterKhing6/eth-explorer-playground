#!/bin/bash

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Git
yum install -y git

# Clone the repository
cd /home/ec2-user
git clone https://github.com/MhisterKhing6/eth-explorer-playground.git
cd eth-explorer-playground

# Build Docker image
docker build -t chainexplorer .

# Run the container
docker run -d -p 80:8080 --name chainexplorer-app --restart unless-stopped chainexplorer

# Create a simple health check script
cat > /home/ec2-user/health-check.sh << 'EOF'
#!/bin/bash
if ! docker ps | grep -q chainexplorer-app; then
    docker start chainexplorer-app
fi
EOF

chmod +x /home/ec2-user/health-check.sh

# Add health check to crontab (runs every 5 minutes)
echo "*/5 * * * * /home/ec2-user/health-check.sh" | crontab -

# Log completion
echo "ChainExplorer deployment completed at $(date)" >> /var/log/chainexplorer-deploy.log