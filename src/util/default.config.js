module.exports = {
  local: {
    // Local host configuration
    host: 'https://example.test', // The local host URL
    path: '/Users/name/website/public_html/', // The local path to the website files
  },
  remote: {
    // Remote host configuration
    host: 'https://example.com', // The remote host URL
    path: '/home/master/applications/website/public_html/', // The remote path to the website files
    exclude: [
      // Directories and files to exclude from synchronization
      'node_modules',
      'bower_components',
      '.git',
      '.idea',
      '.vscode',
      '.env',
      'tugboat.config.js',
      'tmp',
    ],
    ssh: {
      // SSH configuration for remote host
      host: 'example.com', // The SSH host
      user: 'root', // The SSH user
      password: '', // The SSH password (leave empty for key-based authentication)
      port: 22, // The SSH port
      rsync_options: '--verbose --itemize-changes', // Additional rsync options for synchronization
    },
  },
};
