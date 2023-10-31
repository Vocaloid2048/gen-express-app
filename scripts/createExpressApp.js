
import fsp from "fs/promises"
import fs from "fs"
import path from "path"
import { __dirname } from "../utils/__dirname.js"
import { TEMPLATES } from "../constant/templates.js"
import { createSpinner } from "nanospinner"
import exec from "../utils/exec.js"

const TEMPLATES_PATH = path.join(__dirname, "../", "templates")

const generatePackageJson = (projectPath, projectName) => {
  return fsp.writeFile(path.join(projectPath, "package.json"), JSON.stringify({
    "name": projectName,
    "version": "0.0.0",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "nodemon ./bin/www.js",
      "start": "node ./bin/www.js"
    },
    "dependencies": {
      "dotenv": "^16.3.1",
      "cookie-parser": "~1.4.4",
      "debug": "~2.6.9",
      "express": "~4.16.1",
      "http-errors": "~1.6.3",
      "morgan": "~1.9.1"
    },
    "devDependencies": {
      "nodemon": "^3.0.1"
    }
  }, null, 4), "utf-8")
}

const generateDotGitignore = (projectPath, projectName) => {
  return fsp.writeFile(path.join(projectPath, ".gitignore"), `.env`, "utf-8")
}

const fromTemplate = {
  // JavaScript
  "JavaScript": async (projectName) => {
    const projectPath = path.join(process.cwd(), projectName)
    if (fs.existsSync(projectPath)) {
      throw new Error(`Target directory "${projectName}" already exists.`)
    }
    // copy directory from templates to express-app
    await fsp.cp(path.join(TEMPLATES_PATH, TEMPLATES["JavaScript"]), projectPath, { recursive: true })
    await Promise.all([generatePackageJson(projectPath, projectName), generateDotGitignore(projectPath, projectName)])
  },
  // TypeScript
  "TypeScript": () => {
    throw new Error(`The feature "TypeScript" haasn't done yet. Sorry about that!`)
  },
  // JavaScript with MVC
  "JavaScript_MVC": () => {
    throw new Error(`The feature "JavaScript + MVC" haasn't done yet. Sorry about that!`)
  },
  // TypeScript with MVC
  "TypeScript_MVC": () => {
    throw new Error(`The feature "TypeScript + MVC" haasn't done yet. Sorry about that!`)
  }
}

const fromPackageManager = {
  "npm": (projectName) => {
    return exec(`cd ${projectName}&&npm i&&cd ${process.cwd()}`)
  },
  "yarn": (projectName) => {
    return exec(`cd ${projectName}&&yarn install&&cd ${process.cwd()}`)
  },
  "pnpm": (projectName) => {
    return exec(`cd ${projectName}&&pnpm i&&cd ${process.cwd()}`)
  },
}

export async function createExpressApp(projectName, template, packageManager) {
  const spinner = createSpinner("Creating project...")

  try {

    spinner.start()

    // Creating app structure
    await fromTemplate[template](projectName)
    // downloading dependency
    await fromPackageManager[packageManager](projectName)

    spinner.success({ text: "Done." })
    console.log("")
  } catch (err) {
    spinner.error({ text: err })
    console.log("")
    throw new Error(err)
  }

}