node('insights-frontend-slave') {
  stage('load_jenkinsfile') {
    sh 'curl -qk https://gitlab.cee.redhat.com/FlipModeSquad/scripts/raw/master/jenkins/insights-frontend/Jenkinsfile > /tmp/Jenkinsfile'
    load '/tmp/Jenkinsfile'
  }
}
