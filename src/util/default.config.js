module.exports = {
    local: {
      host: 'https://example.test',
      path: '/Users/name/website/public_html/',
      database: {
        name: 'local',
        user: 'root',
        password: 'root',
        host: 'localhost',
        port: 3306,
      }
    },
    remote: {
      host: 'https://example.com',
      path: '/home/master/applications/website/public_html/',
      database: {
        name: 'remote',
        user: 'root',
        password: 'root',
        host: 'localhost',
        port: 3306,
      },
      exclude: [
        'node_modules',
        'bower_components',
        '.git',
        '.idea',
        '.vscode',
        '.env',
        'tugboat.config.js',
        'tmp'
      ],
      ssh: {
        host: 'example.com',
        user: 'root',
        password: '',
        port: 22,
        rsync_options: '--verbose --itemize-changes'
      }
    },
  };
  