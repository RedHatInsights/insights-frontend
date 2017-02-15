node {
  stage('prep') {
    git 'git@github.com:ansible/insights-frontend.git'
    sh  'bash ./build_scripts/prep.sh'
  }

  stage('lint') {
    sh 'gulp lint'
  }

  stage('test') {
    sh 'gulp test'
  }

  stage('build') {
    sh 'bash ./build_scripts/build.sh'
  }

  stage('deploy') {
    sh 'bash ./build_scripts/deploy.sh'
  }
}
