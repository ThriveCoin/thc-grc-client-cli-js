# thc-grc-client-cli-js
This package provides a simple cli tool for interacting with [grenache grapes](https://github.com/bitfinexcom/grenache.git)

## Installing
```
npm install -g https://github.com/ThriveCoin/thc-grc-client-cli-js.git
```

## Usage
```
thc-grc-client --help
thc-grc-client <command>

Commands:
  thc-grc-client lookup   lookups for a service
  thc-grc-client request  makes a request to the service

Options:
  -g, --grape    grape dht url
                         [string] [required] [default: "http://127.0.0.1:30001"]
  -t, --timeout  grape timeout [ms]         [number] [required] [default: 30000]
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
```

### Lookup
```
thc-grc-client lookup

lookups for a service

Options:
  -g, --grape    grape dht url
                         [string] [required] [default: "http://127.0.0.1:30001"]
  -t, --timeout  grape timeout [ms]         [number] [required] [default: 30000]
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -s, --service                                              [string] [required]

example:
thc-grc-client lookup -g http://10.0.0.5:30001 -s rest:util:net
[ '10.0.0.7:7075' ]
```

### Request
```
thc-grc-client request

makes a request to the service

Options:
  -g, --grape      grape dht url
                         [string] [required] [default: "http://127.0.0.1:30001"]
  -t, --timeout    grape timeout [ms]       [number] [required] [default: 30000]
      --version    Show version number                                 [boolean]
      --help       Show help                                           [boolean]
  -s, --service                                              [string] [required]
  -a, --action                                               [string] [required]
  -p, --payload                                              [string] [required]
      --transport           [required] [choices: "http", "ws"] [default: "http"]

example:
thc-grc-client request -g http://10.0.0.5:30001 -s rest:util:net -a getIpInfo \
  -p '[127.0.0.1]'
```
