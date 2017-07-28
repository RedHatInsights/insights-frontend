STABLE_DEV = 'stable-4.12'
STABLE = 'production-stable'

// oc project tmpprod-insights-dev
// oc describe secret frontend-deployer-token-noz5g
DEV_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ0bXBwcm9kLWluc2lnaHRzLWRldiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJmcm9udGVuZC1kZXBsb3llci10b2tlbi1ub3o1ZyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJmcm9udGVuZC1kZXBsb3llciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImQ3ZDI4MTY1LTZjOTMtMTFlNy05ZGE3LTEyZThiMTliODczNCIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDp0bXBwcm9kLWluc2lnaHRzLWRldjpmcm9udGVuZC1kZXBsb3llciJ9.O0Ogy38eeNZspS0M1luX9xM7HaAMr2euAEJ6XUpLV2fKzKXJXo49DuRJ7VmRx0MTIbeV4xXMWEg8igyAjhz64KX99aTpk4kxL-glgJyvD-FfehCFAUgocdwtARvZ-_EkYaIeNqYS85z2TH--AThHlbWnjAhejkhzsqW19t5n97b64ept_BeGSI6OqkAqL71F9FPNMrNmV6ILPmzmcyQ78PkNFQ99CG569QZgdF2S_tgWv3Pupq-hoHG-UNIreqHonWV3Sh3qSKaH5AJor8Gxv-haWMswYXxsgElPqYLv8hjP8ixL6EeUVMaKedp3t3p8L8qfqMdAAWN_VgbunqZgPw'

// oc project tmpprod-insights-prod
// oc describe secret frontend-deployer-token-gm9f9
PROD_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ0bXBwcm9kLWluc2lnaHRzLXByb2QiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZnJvbnRlbmQtZGVwbG95ZXItdG9rZW4tZ205ZjkiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZnJvbnRlbmQtZGVwbG95ZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIxNGNjYTU4Zi02YmY4LTExZTctOWI2Yy0xMjg5NmQzMWFlZGEiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6dG1wcHJvZC1pbnNpZ2h0cy1wcm9kOmZyb250ZW5kLWRlcGxveWVyIn0.HOVx8_vnlAOqLfOeR9H6w4vzVMbJYIDJdbu8U_X8Ls4rRatUcTCJCFGsB7lH4414KNbjxinNIkdzrgcNurO8d-qqOfkO8nnaUAdafYNs3AL4_eJyrkRiiZ9YnKdtkb0O1Xgjca0cFON_BrZUYth-eEuo3vm8m3MMNIoxMJPLHqpBDv3L3dx0liX4hYLZZApu8qIwGHk98hdgACPLTjGNCQpWd3wNOSAUpPA567J161KWMNOZ_tcfi2_7GxRIWCjF0GiNKvQfxBmzNO5OxOPVAwewX6xiR8mgoliSz-FJ9lAt2gx8G0jLFZIb5C8qom-jgnbNbjlPhIjpXwU1_p-JGA'


global = [ docker_tags: [] ]
info = null

wrapStep('clone', { name -> stage(name) { checkout scm } })

notify('STARTED', '')

wrapStep('get_scripts', { name ->
  stage(name) {
    timeout(10) {
      sh 'curl -Lv https://$GITHUBTOKEN@github.com/RedHatInsights/insights-build/archive/master.zip > /tmp/master.zip'
      sh 'unzip -qoa /tmp/master.zip -d /tmp/'
      sh 'ln -s /tmp/insights-build-master/frontend/scripts ~/scripts'
      sh 'ln -s /tmp/insights-build-master/frontend ~/frontend'
    }
  }
})

wrapStep('prep', { name -> stage(name) {
  getInfo()
  sh 'bash ~/scripts/prep.sh' }
})

wrapStep('lint',        { name -> stage(name) { sh 'bash ~/scripts/lint.sh' } })
if (shouldSkip()) {
  wrapStep('unit_test', { name -> stage(name) { sh 'echo using prebuilt' } })
} else {
  wrapStep('unit_test', { name -> stage(name) { sh 'gulp test' } })
}
wrapStep('build',       { name -> stage(name) { sh 'bash ~/scripts/build.sh' } })
wrapStep('deploy_prep', { name -> stage(name) { sh 'bash ~/scripts/deploy_prep.sh' } })

if (getInfo().branch == 'tmp/stall') {
  println "STALLING FOR 20 mins!"
  sleep((60 * 1000) * 20)
}

dockerhub()

switch (env.BRANCH_NAME) {
  case 'master':
    // deploy to dev right away, but deploy to prod only if smoke test passes
    wrapStep('deploy_dev',  { name -> stage(name) { myRetry(5, name, { deploy_osd('dev', 'beta') }) }})
    smokeTest()
    wrapStep('deploy_prod', { name -> stage(name) { deploy_osd('prod', 'beta') }})
    break

  case STABLE:
    // Dont deploy unless smoke test passes
    smokeTest()
    wrapStep('deploy_prod', { name -> stage(name) { deploy_osd('prod', 'stable') }})
    break

  case STABLE_DEV:
    wrapStep('deploy_dev',  { name -> stage(name) { myRetry(5, name, { deploy_osd('dev', 'stable') }) }})
    smokeTest()
    break

  default:
    smokeTest()
}

wrapStep('tarball', { name -> stage(name) {
  // send the tarballs to Jenkins
   if (!shouldSkip()) {
    info = getInfo()
    file = "/tmp/${info.hash}.tgz"
    sh "tar -czf ${file} -C build ." // " matters
    sh 'ssh jenkins@misc.usersys.redhat.com "mkdir -p /var/jenkins_home/userContent/insights-frontend/builds/"'
    sh "scp -r ${file} jenkins@misc.usersys.redhat.com:/var/jenkins_home/userContent/insights-frontend/builds/" // matters
    if (info.tag?.trim()) {
      sh "cp ${file} /tmp/${info.tag}.tgz"
      sh "scp -r /tmp/${info.tag}.tgz jenkins@misc.usersys.redhat.com:/var/jenkins_home/userContent/insights-frontend/builds/" // matters
    }
  }

  return true
}})

wrapStepNoFail('npm_publish', { name -> stage(name) {
  // dont fail here becaues we cant actually re publish npm stuff
  info = getInfo()
  if (info.branch == STABLE_DEV && info.tag?.trim()) {
    // finally if this is a tagged build push to npm
    // do this last on purpose
    dir('./build') {
      sh "sed -s 's/\"private\": true,/\"private\": false,/' -i package.json"
      sh "echo '//registry.npmjs.org/:_authToken=e2439cb4-1b57-45d4-a443-800299448087' > ~/.npmrc"
      sh "npm publish"
    }
  }

  return true
}})

notify('FINISHED', '')

///////////////
// Functions //
///////////////

def buildAndPushDocker(String tag) {
  info = getInfo()
  global.docker_tags.push(tag)
  dir('./dockerbuild') {
    sh "rm -rf node_modules"
    dir('./build') {
      sh "sed -s 's|___TAG___|${info.tag}|' -i index.html indexbeta.html"
      sh "sed -s 's|___COMMIT___|${info.hash}|' -i index.html indexbeta.html"
    }
    sh "DOCKER_HOST=tcp://misc.usersys.redhat.com:4243 docker build --rm -t iphands/insightsfrontend:${tag} ."
    sh "DOCKER_HOST=tcp://misc.usersys.redhat.com:4243 docker push iphands/insightsfrontend:${tag}"
  }
}

def dockerhub()  {
  wrapStep('dockerhub', { name -> stage(name) {
    info = getInfo()

    // login to dockerhub
    sh "DOCKER_HOST=tcp://misc.usersys.redhat.com:4243 docker login -u iphands -p '^U&CpNNnd1q4Ml8GolVOJVGV4tmrOzi4'"

    // prep the dockerbuild dir
    sh "mkdir dockerbuild"
    sh "cp -r build dockerbuild/"
    sh "cp Dockerfile dockerbuild/"
    sh "cp insights.conf dockerbuild/"
    sh "rm -rf dockerbuild/build/static"
    sh "rm -rf dockerbuild/build/fonts"
    sh "rm -rf dockerbuild/build/images"

    // always push the hash to dockerhub
    buildAndPushDocker(info.hash)
    try {
      buildAndPushDocker(info.sanitizedBranch)
    } catch(e) {
      println("Building the branch container failed, tag is: ${info.sanitizedBranch}")
      println(e)
    }

    if (info.branch == STABLE_DEV) {
      // push the tag if the current commit is on STABLE_DEV
      buildAndPushDocker('lateststable')
      buildAndPushDocker(info.tag)
    }

    if (info.branch == 'master') {
      // if this is master update latest
      buildAndPushDocker('latest')
      buildAndPushDocker('latestbeta')
    }

    global.docker_tags.each { tag ->
      try {
        // try and clean up the images we just built
        sh "DOCKER_HOST=tcp://misc.usersys.redhat.com:4243 docker rmi -f iphands/insightsfrontend:${tag}"
      } catch (e) {}
    }

    return true
  }})
}

def deploy_osd(String project, String dc) {
  info = getInfo()

  if (project == 'prod') {
    sh "oc login https://api.insights.openshift.com --token=${PROD_TOKEN}"
  } else {
    sh "oc login https://api.insights.openshift.com --token=${DEV_TOKEN}"
  }

  sh "oc project tmpprod-insights-${project}"
  sh "oc patch dc/insights-frontend-${dc} --type='json' " +
    "-p='[{" +
    "\"op\":\"replace\"," +
    "\"path\":\"/spec/template/spec/containers/0/image\"," +
    "\"value\":\"docker.io/iphands/insightsfrontend:${info.hash}\"" +
    "}]'"
  sh "oc rollout latest dc/insights-frontend-${dc} || true"
}

def getInfo() {
  if (info != null) {
    return info
  }

  o = [
    author: sh(script: 'git show --format="%aN <%aE>" HEAD | head -n1', returnStdout: true).trim(),
    branch: "${env.JOB_NAME}".replaceAll('%2F', '/').replaceAll('RedHatInsights/insights-frontend/', '').replaceAll('frontend/', ''),
    hash:   sh(script: 'git rev-parse --verify HEAD', returnStdout: true).trim(),
    tag:    sh(script: "node -e 'console.log(require(\"./package.json\").version)'", returnStdout: true).trim()
  ]
  o.sanitizedBranch = o.branch.replaceAll('/','-')
  info = o
  return o
}

def notify(String mode, String step) {
  info   = getInfo()
  brhint = "frontend ${info.branch}"
  header =  "Build of ${info.branch} [${env.BUILD_NUMBER}] ${mode}"
  url = "<${env.BUILD_URL}/console|link>"
  if (step != '') { header += " in ${step}" }

  switch (mode) {
    case 'STARTED':
      slackSend(color: '#A0C3FF', message: "STARTED: ${brhint} ${url}")
      if (info.branch == STABLE) {
        slackSend(channel: '#insights_eng', color: '#A0C3FF', message: ":party_parrot: Releasing ${brhint} :party_parrot:")
      }
      break
    case 'FINISHED':
      slackSend(color: '#00FF00', message: "FINISHED: ${brhint} ${url}")
      if (info.branch == STABLE) {
        slackSend(channel: '#insights_eng', color: '#00FF00', message: ":party_parrot: Finished releasing ${brhint} :party_parrot:")
      }
      break
    case 'FAILED':
      slackSend (color: '#FF0000', message: "FAILED: ${brhint} ${step} ${url}")
      if (info.branch == STABLE) {
        slackSend(channel: '#insights_eng', color: '#FF0000', message: ":party_parrot: Failed releasing ${brhint} in step ${step} :party_parrot:")
      }
      break
  }

  emailext (
    to: 'ihands+jenkins@redhat.com',
    subject: header,
    recipientProviders: [[$class: 'DevelopersRecipientProvider']],
    body: """
${header}

Check out the pipeline view at  ${env.BUILD_URL}/../
Check out the console output at ${env.BUILD_URL}/console
Check out the Smoke Test images at http://misc.usersys.redhat.com/userContent/insights-frontend/images/${info.hash}/
"""
  )
}

def myRetry(int maxRetries, String stepName, Closure cb) {
  passed = false
  i = 0
  // println "RETRY: maxRetries: ${maxRetries}, stepName: ${stepName}, passed: ${passed}, i: ${i}"
  for (i = 1; i < maxRetries; i++) {
    try {
      if (passed) { break }
      print "# Trying ${stepName}: ${i} #"
      cb(i);
      passed = true
    } catch (e) {
      println "ERROR in retry: " + e
      if (i >= maxRetries) {
        println "ERROR max retries attempted (${i} of ${maxRetries}), failing test"
        throw e
      }
    }
  }
}

def wrapStep(String stepName, Closure step) {
  println "In wrapStep ${stepName}"
  try {
    step(stepName)
  } catch (e) {
    notify('FAILED', stepName)
    throw e
  }
}

def wrapStepNoFail(String stepName, Closure step) {
  println "In wrapStep ${stepName}"
  try {
    step(stepName)
  } catch (e) {}
}

def shouldSkip() {
    try {
      sh 'source /tmp/shell_conf && if [ $USE_PREBUILT ] ; then true ; else false ; fi'
      return true
    } catch (e) {}
    return false;
}

def smokeTest() {
  if (shouldSkip()) {
    // USE_PREBUILT WAS SET STKIP SMOKETEST
    wrapStep('smoke_test',  { name -> stage(name) { sh 'echo using prebuilt' } })
    wrapStep('save_images', { name -> stage(name) { sh 'echo using prebuilt' } })
    return
  }

  maxRetries = 10
  info = getInfo()
  test_url = 'https://prod.foo.redhat.com:1337/insightsbeta'
  test_username = 'insights-test-user'
  test_password = 'd82b2ce084fa2381378af3f842af0f0dddb50'

  if (env.BRANCH_NAME.matches(/.*stable.*/)) {
    test_url = 'https://prod.foo.redhat.com:1337/insights'
  }

  try {
    wrapStep('smoke_test',  { name ->
      stage(name) {
        sh 'bash ~/scripts/smoke_test_prep.sh'
        withEnv(["TEST_URL=${test_url}", "TEST_USERNAME=${test_username}", "TEST_PASSWORD=${test_password}"]) {
          myRetry(maxRetries, 'smoke_test', { tryNum -> sh "bash smoketest/run.sh ${tryNum}" })
        }
      }
    })
  } finally {
    wrapStep('save_images', { name ->
      stage(name) {
        sh "ssh jenkins@misc.usersys.redhat.com \"mkdir -p /var/jenkins_home/userContent/insights-frontend/images/${info.hash}\""
        sh "scp -r /tmp/images/* jenkins@misc.usersys.redhat.com:/var/jenkins_home/userContent/insights-frontend/images/${info.hash}/"
        archive "/tmp/images/*"
      }
    })
    if (!passed) {
      notify('FAILED', "smoke_test after ${maxRetries}")
      error("smoke_test after ${maxRetries}")
    }
  }
}
