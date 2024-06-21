![Build the web you want](.github/assets/tugboatwpbanner.png 'A command line tool for shipping WordPress.')

# Tugboat WP
> 🚧 **Under Construction:** This application is currently under development and is not yet fully functional. It may contain bugs, incomplete features, or other discrepancies. Please use it with caution. Regular updates will provide bug fixes, improvements, and additional features.

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

For executing from a project root only:
`npm install tugboat-wp`

Otherwise to install everywhere:
`npm install tugboat-wp -g`

## Issues & Bug Reporting

Please use the Github Issues page to report any bugs or ask for feature enhancements.

Remember, this app is a work in progress and we appreciate your patience and assistance in improving it.