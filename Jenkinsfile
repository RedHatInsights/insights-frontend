node('insights-frontend-slave') {
  stage('clone') {
    checkout scm
  }

  try {
    notify("STARTED")

    stage('get_scripts') {
      sh 'curl -qk https://gitlab.cee.redhat.com/FlipModeSquad/scripts/repository/archive.tar.bz2?ref=master > /tmp/scripts.tbz'
      sh 'tar xf /tmp/scripts.tbz -C /tmp'
      sh 'ln -s /tmp/scripts*/jenkins/insights-frontend ~/scripts'
    }

    stage('prep') {
      sh  'bash ~/scripts/scripts/prep.sh'
    }

    stage('lint') {
      sh 'gulp lint'
    }

    stage('test') {
      sh 'gulp test'
    }

    if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'stable-4.6' || env.BRANCH_NAME == 'production-stable' || env.BRANCH_NAME == 'production-beta') {
      stage('build') {
        sh 'bash ~/scripts/scripts/build.sh'
      }
      stage('deploy_prep') {
        sh 'bash ~/scripts/scripts/deploy_prep.sh'
      }
      stage('deploy') {
        sh 'bash ~/scripts/scripts/deploy.sh'
      }
    }
    notify("FINISHED")
  } catch (e) {
    notify("FAILED")
    throw e
  }
}

def notify(String mode) {
  def author = sh(script: 'git show --format="%aN <%aE>" HEAD | head -n1', returnStdout: true).trim()
  def branch = "${env.JOB_NAME}".replaceAll('%2F', '/')
  emailext (
    to: 'ihands+jenkins@redhat.com',
    subject: "${mode}: job ${branch} [${env.BUILD_NUMBER}]",
    recipientProviders: [[$class: 'DevelopersRecipientProvider']],
    body: """${mode}: Build of ${branch} started by ${author}\nCheck console output at ${env.BUILD_URL}/console"""
  )
}
