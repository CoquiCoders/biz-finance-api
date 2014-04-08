# Incentives API

[![Build Status](https://travis-ci.org/CoquiCoders/incentives-api.svg?branch=master)](https://travis-ci.org/CoquiCoders/incentives-api)

## Index

- [CORS](#cors)
- [Authorization](#authorization)
- [Loging](#loging)
- [Enviroments](#enviroments)

## CORS

Making CORS work properly if you use custom headers is not always straightforward ([restify / Issue #284](https://github.com/mcavage/node-restify/issues/284)). The boilerplate provides a helper, which takes care of **MethodNotAllowed repsonses** in conjunction with **preflight requests + custom headers**.

## Authorization

Every request you make must be authenticated. The REST API uses a custom HTTP scheme based on a keyed-HMAC (Hash Message Authentication Code) for authentication.

The value of the Authorization header is as follows:

```
Authorization: <Config/Security/Scheme> <AccessKey>:<Signature(Base64(HMAC-SHA1(UTF-8(<String to Sign>), UTF-8(<SecretAccessKey>))))>
```

AccessKey: Provided by `config/global.json`
SecretAccessKey: Provided by `config/global.json`
String to Sign: Value of the `<Config/Security/DateIdentifier>` header

You can find an example in the [examples/client](https://github.com/dominiklessel/node-restify-boilerplate/tree/examples/client) branch.

## Logging

By default `node-bunyan` is used for logging to a file (`./logs/{{NODE_ENV}}-{{SERVER:NAME}}.log`). Additionally sending logs to Loggly is supported (take a look at the config file).


