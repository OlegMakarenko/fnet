# FNET
## A Fully Decentralized Symbol Blog

- [Overview](#overview)
- Instructions
    - [Installation](#installation)
    - [Test](#test)
    - [Lint](#lint)

## Overview

A website for viewing fully decentralized blog posts on Symbol chain.
It also provides an interface for creating, editing posts, adding comments, and uploading images.
All writing actions are performed only through the user's wallet.
The website only prepares the transaction payload for signing.

Supported wallet applications:
- SSS Extension.
- Symbol Mobile Wallet (Android).
- Symbol Mobile Wallet (iOS).

[👉 The blog post example](https://fnet.vercel.app/posts/TA6YDWSPAQU5CVGV5W2A5NSIJZSDAZW4VMLA7PI)

### Installation

1. Clone the project.

2. Install the required dependencies.

```
npm install
```

3. Create `.env` in root directory.

4. Start application.

```shell
npm run dev
```

5. Visit http://localhost:3000/ in your browser.

### test

```
npm run test
```

### lint

```
npm run lint
npm run lint:fix
```
