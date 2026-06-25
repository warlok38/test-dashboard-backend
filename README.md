# Test Dashboard Backend

Локальный NestJS API для тестового дашборда. Этот документ описывает, как создать такой же backend-проект с нуля на другой машине, а затем вручную перенести исходники: контроллеры, сервисы, DTO, моки данных и модули.

## Требования

- Node.js 20 LTS или новее.
- npm 10 или новее.
- Windows PowerShell. В PowerShell лучше запускать `npm.cmd`, чтобы не упираться в policy для `.ps1`.

Проверка окружения:

```powershell
node -v
npm.cmd -v
```

## Создание проекта с нуля

Создайте новый проект через `npx.cmd`, без глобальной установки Nest CLI:

```powershell
npx.cmd @nestjs/cli new test-dashboard-backend
```

При выборе пакетного менеджера укажите `npm`.

Перейдите в папку проекта:

```powershell
cd test-dashboard-backend
```

## Установка зависимостей

После создания Nest уже установит базовые зависимости. Для этого проекта дополнительно нужны Swagger-пакеты:

```powershell
npm.cmd install @nestjs/swagger swagger-ui-express
```

Проверьте, что в `package.json` есть основные runtime-зависимости:

```json
{
  "@nestjs/common": "^10.4.15",
  "@nestjs/core": "^10.4.15",
  "@nestjs/platform-express": "^10.4.15",
  "@nestjs/swagger": "^8.1.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1",
  "swagger-ui-express": "^5.0.1"
}
```

Для разработки нужны Jest, TypeScript, ESLint и Nest CLI. Если проект создан через `npx.cmd @nestjs/cli new`, они уже будут установлены. При необходимости их можно доустановить:

```powershell
npm.cmd install -D @nestjs/cli @nestjs/testing @types/jest @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier jest prettier ts-jest ts-loader ts-node tsconfig-paths typescript
```

## Настройка package.json

Приведите основные скрипты к такому виду:

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "lint": "eslint \"{src,test}/**/*.ts\" --max-warnings=0",
    "test": "jest"
  }
}
```

Jest можно настроить прямо в `package.json`:

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

## Настройка TypeScript

Базовый `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "baseUrl": "./",
    "strict": true,
    "skipLibCheck": true,
    "strictPropertyInitialization": false
  }
}
```

`tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "incremental": true
  },
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```

## Настройка ESLint и Prettier

`.eslintrc.json`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "env": {
    "node": true,
    "jest": true
  },
  "ignorePatterns": ["dist", "node_modules", "coverage"]
}
```

`.prettierrc`:

```json
{
  "singleQuote": true,
  "semi": false,
  "trailingComma": "none",
  "printWidth": 100
}
```

`.gitignore` должен исключать минимум:

```gitignore
node_modules
dist
coverage
.env
*.log
```

## Перенос исходников

После создания и настройки проекта перенесите вручную папку `src` из текущего backend-проекта.

Нужная структура:

```text
src/
  app.module.ts
  main.ts
  business-units/
    business-units.controller.ts
    business-units.module.ts
    business-units.service.ts
    business-units.service.spec.ts
    data/
    dto/
  health/
    health.controller.ts
    health.module.ts
    health.service.ts
    health.service.spec.ts
    dto/
  production-stages/
    production-stages.controller.ts
    production-stages.module.ts
    production-stages.service.ts
    production-stages.service.spec.ts
    data/
    dto/
```

Важно перенести не только контроллеры и сервисы, но и папки `data` и `dto`: в них лежат моковые данные, типы ответов и DTO для Swagger.

## Настройка main.ts

В `src/main.ts` приложение должно:

- слушать порт `3001`;
- использовать глобальный prefix `/api`;
- включать CORS для фронта;
- подключать Swagger по `/api/docs`.

После переноса исходников это уже будет настроено в файле.

## Локальный запуск

Запустите dev-сервер:

```powershell
npm.cmd run start:dev
```

Локальные адреса:

- API base: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`
- Health: `http://localhost:3001/api/health`
- Business units: `http://localhost:3001/api/business-units`
- Production stages: `http://localhost:3001/api/production-stages`

## Проверка проекта

После переноса файлов выполните:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

Все три команды должны проходить без ошибок.

## Подключение фронта

Фронт ожидает API по адресу:

```text
http://localhost:3001/api
```

Если backend запущен на другом адресе, во фронтовом проекте задайте:

```powershell
$env:NEXT_PUBLIC_API_BASE_URL='http://localhost:3001/api'
```

После изменения переменной окружения перезапустите dev-сервер фронта.
