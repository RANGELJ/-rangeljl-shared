import 'dotenv/config'
import path from 'path'
import {select} from '@inquirer/prompts'
import packageJsonUpdateVersionNumber from '@rangeljl/devscripts/packageJsonUpdateVersionNumber'
import fs from 'fs-extra'

const deploy = async () => {
  const distDir = process.env.DIST_DIR
  if (!distDir) {
    throw new Error('distDir is required')
  }

  const baseDir = process.env.BASE_DIR

  if (!baseDir) {
    throw new Error('basedir is required')
  }

  await fs.remove(distDir)

  const packagePath = path.join(baseDir, 'package.json')

  await packageJsonUpdateVersionNumber({
    packagePath,
    fileReadAsJson: fs.readJSON,
    fileWriteJson: fs.writeJSON,
    terminalSelect: select,
  })

  const {execa} = await import('execa')

  await execa('tsc', {
    cwd: baseDir,
  })

  await fs.copy(packagePath, path.join(distDir, 'package.json'))
  await fs.copy(
    path.join(baseDir, 'package-lock.json'),
    path.join(distDir, 'package-lock.json'),
  )

  await execa('npm', ['publish', '--access', 'public'], {
    cwd: distDir,
    stdio: 'inherit',
  })

  await fs.remove(distDir)
}

deploy()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
