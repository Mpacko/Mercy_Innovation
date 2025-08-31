pipeline {
    agent any

    tools {
        sonarScanner 'SonarScanner'   // 🔹 le nom que tu as configuré dans Jenkins (Manage Jenkins → Global Tool Configuration)
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credt')   // Credentials DockerHub
        DOCKER_IMAGE = "mpacko27/app-web"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git(
                    branch: 'master',
                    url: 'https://github.com/Mpacko/Mercy_Innovation.git',
                    credentialsId: 'github-token'
                )
            }
        }

        // 1️⃣ Scan du code avec SonarQube
        stage('Code Security Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {   // 🔹 "SonarQube" = nom configuré dans Jenkins (Configure System)
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=app-web \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                    """
                }
            }
        }

        // 2️⃣ Quality Gate (bloque si la qualité est mauvaise)
        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // 3️⃣ Scan des dépendances avec Trivy
        stage('Dependencies Scan') {
            steps {
                sh 'trivy fs . || true'
            }
        }

        // 4️⃣ Build Docker
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        // 5️⃣ Scan de l’image Docker avec Trivy
        stage('Docker Image Scan') {
            steps {
                sh "trivy image ${DOCKER_IMAGE}:latest || true"
            }
        }

        // 6️⃣ Vérification OWASP des dépendances
        stage('OWASP Check') {
            steps {
                sh 'dependency-check.sh --project app-web --scan . || true'
            }
        }

        // 7️⃣ Login DockerHub et push de l'image
        stage('Login & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credt', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        // 8️⃣ Déploiement local
        stage('Run Container Locally') {
            steps {
                sh """
                    docker stop app-web || true
                    docker rm app-web || true
                    docker run -d --name app-web -p 9090:80 ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            mail to: "edingelemarc@gmail.com",
                 subject: "✅ Déploiement réussi : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 mimeType: 'text/html',
                 body: """
                 <html>
                 <body style="font-family: Arial, sans-serif; color: #333;">
                     <h2 style="color: #2ECC71;">✅ Déploiement Réussi !</h2>
                     <p>Votre application tourne maintenant sur <b>http://<i>IP_SERVEUR</i>:9090</b></p>
                 </body>
                 </html>
                 """
        }
        failure {
            script {
                def logs = currentBuild.rawBuild.getLog(20).join("<br>")
                mail to: "edingelemarc@gmail.com",
                     subject: "❌ Échec du déploiement : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     mimeType: 'text/html',
                     body: """
                     <html>
                     <body style="font-family: Arial, sans-serif; color: #333;">
                         <h2 style="color: #E74C3C;">❌ Déploiement Échoué</h2>
                         <p>Voici un extrait des logs :</p>
                         <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">
                             ${logs}
                         </div>
                     </body>
                     </html>
                     """
            }
        }
    }
}
