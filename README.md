# Discord HTTP interactions scaling

This is a load balancing web server for HTTP interaction Discord bots on steroids.

**Warning**: This hasn't been tested thoroughly in production yet and this is meant to be a proof of concept.

## What's the point of this project?

The point of this project is to allow scale Discord bots in a similar way gateway sharding libraries do.

This allows a guild to always be pointed to the same "cluster" (aka the web server that handles HTTP interactions), so you could handle all tasks to the assigned guild on the given cluster.

## Setup

This project supports both Bun and Cloudflare workers.

### Bun

1. Install dependencies using `bun i`.

2. Clone `.env.example` and rename it into `.env`, then set the enviormental variables.

```env
PORT=the port to run the web server at
CLUSTERS=either 'auto' or a number indicating how much clusters you want to use
PUBLIC_KEY=enter your discord application's public key here
CLUSTER_URLS=enter the urls of your http interaction website url, seperated by commas without any spaces inbetween
```

3. Run `bun bun/start` and you're done!

#### Example `.env` file

```toml
PORT=3000
CLUSTERS=auto
PUBLIC_KEY=foobarthisisnotactuallyarealpublickeybutismeanttoserveasanexample
CLUSTER_URLS=http://localhost:3001,http://localhost:3002
```

### Cloudflare Workers

1. Install dependencies using `bun i`.

2. On `wrangler.toml`, change the name to what you desire and set your environmental variables there.

```toml
PUBLIC_KEY = "enter your discord application's public key here"
CLUSTER_URLS = "enter the urls of your http interaction website url, seperated by commas without any spaces inbetween"
```

3. Run `bun wrangler/deploy` and you're done!

#### Example `.dev.vars` file

```vars
PUBLIC_KEY: "foobarthisisnotactuallyarealpublickeybutismeanttoserveasanexample"
CLUSTER_URLS: "http://localhost:3001,http://localhost:3002"
```
