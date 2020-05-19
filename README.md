Serverless Inject File
--------------------------------

Inject files into your lambda functions on deploy

Installation
-----
Install the package with npm: `npm install serverless-inject-file`, and add it to your `serverless.yml` plugins list:

```yaml
plugins:
  - serverless-inject-file
```

Usage
-----
Add the files you want to inject under custom -> injectFile

This plugin is run after serverless variables are resolved, so you can reference ssm or file paths as you like.

```yaml
custom:
  injectFile:
    .env/hello.txt: 'hello world!'
    .env/secrets.json: ${ssm:mySuperSecrets}
    .env/config.json: ${file(../config.${self:provider.stage}.json)
```