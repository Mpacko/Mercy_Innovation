pipeline {
  agent { label 'docker-agent' }
  environment {
    IMAGE = "Mpacko27/app-web"
    VPS_IP = "192.168.234.143"
    DOMAIN = "192.168.234.143"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE:$GIT_COMMIT .'
      }
    }
    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh 'docker push $IMAGE:$GIT_COMMIT'
        }
      }
    }
    stage('Deploy on VPS') {
      steps {
        sshagent (credentials: ['vps-ssh-creds']) {
          sh """
            ssh -o StrictHostKeyChecking=no jenkins@$VPS_IP '
              docker pull $IMAGE:$GIT_COMMIT &&
              docker rm -f mon-projet-php || true &&
              docker run -d --name mon-projet-php -p 127.0.0.1:8080:80 $IMAGE:$GIT_COMMIT
            '
          """
        }
      }
    }
    stage('Configure Nginx') {
      steps {
        sshagent (credentials: ['vps-ssh-creds']) {
          sh """
            ssh -o StrictHostKeyChecking=no jenkins@$VPS_IP '
              echo "server {
                listen 80;
                server_name $DOMAIN www.$DOMAIN;

                location / {
                  proxy_pass http://127.0.0.1:8080;
                  proxy_set_header Host \\$host;
                  proxy_set_header X-Real-IP \\$remote_addr;
                }
              }" | sudo tee /etc/nginx/sites-available/mon-projet-php.conf &&

              sudo ln -sf /etc/nginx/sites-available/mon-projet-php.conf /etc/nginx/sites-enabled/ &&
              sudo nginx -t &&
              sudo systemctl reload nginx
            '
          """
        }
      }
    }
  }
}
