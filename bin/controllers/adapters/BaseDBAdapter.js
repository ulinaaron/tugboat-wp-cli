class DatabaseAdapter {
  static get CAPABILITIES() {
    return {
      pushImportDatabase: false,
      pullImportDatabase: false,
      pushExportDatabase: false,
      pullExportDatabase: false,
    };
  }

  async callMethod(methodName, ...params) {
    if (
      !(methodName in this.constructor.CAPABILITIES) ||
      !this.constructor.CAPABILITIES[methodName]
    ) {
      throw new Error(
        `The method '${methodName}' is not supported by this adapter.`,
      );
    }

    return await this[methodName](...params);
  }

  pullExportDatabase() {
    // Remote Export
    console.log("Export database on remote");
  }
  pushImportDatabase() {
    // Remote Import
    console.log("Import database on remote");
  }

  pullImportDatabase() {
    // Local Import
    console.log("Import database on local");
  }

  pushExportDatabase() {
    // Local Export
    console.log("Export database on local");
  }

  getConnectionDetail(socket, host, port) {
    let connectionDetail = "";

    if (socket) {
      connectionDetail = `--socket=${JSON.stringify(socket)}`;
    } else if (host) {
      connectionDetail = `-h ${host}`;

      if (port) {
        connectionDetail += ` -P ${port}`;
      }
    }

    return connectionDetail;
  }
}

module.exports = DatabaseAdapter;
