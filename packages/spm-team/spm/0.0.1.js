/**
 * This is the Scriptable Package Manager used to import modules from GitHub.
 * This file can be ignored but should not be deleted because other scripts depend on it.
 * Learn more at https://github.com/demenik/spm
 */

/**
 * @name spm
 * @version 0.0.1
 * @author demenik
 * @source https://github.com/demenik/spm
 */

 const spm = {
  /**
   * Import a spm module
   * @param {string} packageId
   *  The identifier of the module to import
   *  Example: "demenik/spm-test-module@latest"
   *  This uses github repositories as the package source
   *  The packageId is split into 3 parts:
   *   - The owner of the repository (demenik)
   *   - The name of the repository (spm-test-module)
   *   - The version of the module (latest)
   * @returns {object} The exports that the module specified
   */
  import: async function (packageId) {
    // Split the packageId into the 3 parts
    const author = packageId.split("/")[0];
    const name = packageId.split("@")[0].split("/").slice(1)[0];
    const version = packageId.split("@").slice(1)[0];

    // Check if the module is already installed
    var importedModule;
    try {
      importedModule = this._importModule(packageId);
    } catch {
      console.log(`[spm] Module ${packageId} not installed. Installing...`);
      // Get the module
      const release = await this._getRelease(author, name, version);
      await this._downloadModule(packageId, release);
      importedModule = await this._importModule(packageId);
    }

    return importedModule.exports;
  },
  _importModule: function (packageId) {
    const importedModule = importModule(`${encodeURIComponent(packageId)}`);
    return importedModule;
  },
  _getRelease: async function (author, name, version) {
    var release;
    if (version === "latest") {
      /** @type {[key: string]} */
      var data = await new Request(
        `https://api.github.com/repos/${encodeURIComponent(author)}/${encodeURIComponent(
          name
        )}/releases`
      ).loadJSON();

      data = data.sort((a, b) => {
        return new Date(b.published_at) - new Date(a.published_at);
      });

      release = data[0].assets.filter((asset) => asset.name === "module.js")[0]
        .browser_download_url;
    } else {
      release = `https://github.com/${author}/${name}/releases/download/${version}/module.js`;
    }

    return release;
  },
  _downloadModule: async function (packageId, url) {
    const fm = FileManager.iCloud();
    const spmPath = fm.joinPath(fm.documentsDirectory(), "spm");
    const path = fm.joinPath(spmPath, `${encodeURIComponent(packageId)}.js`);

    if (!fm.fileExists(spmPath)) {
      fm.createDirectory(spmPath);
    }

    if (fm.fileExists(path)) {
      return;
    }

    const moduleData = await new Request(url).loadString();

    fm.writeString(path, moduleData);
    console.log(`[spm] Module ${packageId} installed.`);
  },
};

module.exports = spm;