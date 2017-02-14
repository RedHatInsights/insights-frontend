node {
  stage('prep') {
    git 'git@github.com:ansible/insights-frontend.git'
    sh 'export GIT_SSL_NO_VERIFY=true'
    // git 'git@gitlab.cee.redhat.com:FlipModeSquad/scripts.git'
    git 'https://gitlab.cee.redhat.com/FlipModeSquad/scripts.git'
    sh 'ls -lha .'
    sh './build_scripts/prep.sh'
  }

  stage('lint') {
    sh 'gulp lint'
  }

  stage('test') {
    sh 'gulp test'
  }

  stage('build') {
    sh './build_scripts/build.sh'
  }

  stage('deploy') {
    sh 'echo not yet'
  }
}
