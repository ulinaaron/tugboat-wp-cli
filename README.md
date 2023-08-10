```
                __/___
          _____/______|
  _______/_____\_______\_____
  \              < < <       |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

# Tugboat WP CLI

**Not ready for production use quite yet!!! Still very much a work in progress. Only a few pull options work so far.**

Tugboat WP is a command-line interface (CLI) tool designed to help with the WordPress development process. Push and pull WordPress assets (Plugins, Themes, Uploads, Database) from your local environment to a remote website, and vice versa. All configuration

## Features

- Safely ship WordPress assets (Plugins, Themes, Uploads, Database) from your local development environment to your remote website.
- Easily manage all deployment configurations from a local `tugboat.config.js` file. No need to to enter paths, IPs, and critical deployment details multiple times in the command line.
- Navigate freely within your local website directory structure in the command-line, Tugboat WP will cascade down your directory structure till it finds the `tugboat.config.js` file.

## Requirements

- rsync
- node.js
- sshpass (optional)

## Installation

`npm install tugboat-wp`

## Roadmap

- [] Optimize code for production release.
- [] Push and pull databases.
- [] Support additional remote environments. (Production, Staging, etc)
- [] Allow verbose transfers to show files status while they are being moved.
- [] Remote activity log / commits for team-based deployments.
- [] Pre/Post hooks to allow commands to be ran before and after deployments. Useful as an alternative to CI/CD asset building.
- [] Custom directory support beyond the standard WordPress `wp-content` folders.
