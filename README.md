# Manage worker Capacity from Flex!

![Channel Management](https://zaffre-cow-9057.twil.io/assets/Screen%20Shot%202019-02-06%20at%203.13.36%20PM.png)

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards install the dependencies by running `npm install`:

```bash
cd plugin-channelManagement

# If you use npm
npm install

# Enter your account sid and runtime domain
cp public/appConfig.example.js public/appConfig.js
```

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Once you are happy with your plugin, you have to bundle it, in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.  There are also a couple runtime functions under `src/functions` that you'll need to use to create new Functions with under your Twilio Runtime.  Be sure to uncheck "Check for valid Twilio signature" since authentication is being handled with a separate JWT validation call.

