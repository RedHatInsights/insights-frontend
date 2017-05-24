node('insights-frontend-slave') {
  stage('load_jenkinsfile') {
    sh 'curl -qk https://$GITHUBTOKEN@raw.githubusercontent.com/RedHatInsights/insights-build/master/frontend/Jenkinsfile > /tmp/Jenkinsfile'
    load '/tmp/Jenkinsfile'
  }
}
