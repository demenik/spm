/**
 * This is the Scriptable Package Manager used to import modules from GitHub.
 * This file can be ignored but should not be deleted because other scripts depend on it.
 * Learn more at https://github.com/demenik/spm
 */

/**
 * @name spm
 * @version 0.0.4
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
    var author = packageId.split("/")[0];
    var name = packageId.split("@")[0].split("/").slice(1)[0];
    var version = packageId.split("@").slice(1)[0];

    if (version === "latest") {
      version = await this._getLatestRelease(author, name);
      packageId = `${author}/${name}@${version}`;
    }

    // Check if the module is already installed
    var importedModule;
    try {
      importedModule = this._importModule(packageId);
    } catch {
      console.log(`[SPM] Module ${packageId} not installed. Installing...`);
      // Get the module
      const release = `https://github.com/${author}/${name}/releases/download/${version}/module.js`;
      await this._downloadModule(packageId, release);
      importedModule = await this._importModule(packageId);
    }

    return importedModule.exports;
  },
  _importModule: function (packageId) {
    const importedModule = importModule(`${encodeURIComponent(packageId)}`);
    return importedModule;
  },
  _getLatestRelease: async function (author, name) {
    /** @type {[key: string]} */
    var data = await new Request(
      `https://api.github.com/repos/${encodeURIComponent(author)}/${encodeURIComponent(
        name
      )}/releases`
    ).loadJSON();

    data = data.sort((a, b) => {
      return new Date(b.published_at) - new Date(a.published_at);
    });

    return data[0].tag_name;
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
    console.log(`[SPM] Module ${packageId} installed.`);
  },
  _checkUpdate: async function () {
    const fm = FileManager.iCloud();
    const spmPath = fm.joinPath(fm.documentsDirectory(), "spm");

    // Check current version
    const currentVersion = fm.readString(fm.joinPath(spmPath, "version"));

    // Get latest version
    const latestVersion = await new Request(
      "https://raw.githubusercontent.com/demenik/spm/main/version"
    ).loadString();

    if (currentVersion !== latestVersion) {
      console.log(`[SPM] New version available: ${latestVersion}. Updating...`);
      const moduleData = await new Request(
        "https://raw.githubusercontent.com/demenik/spm/main/SPM.js"
      ).loadString();
      fm.writeString(fm.joinPath(spmPath, "SPM.js"), moduleData);
      fm.writeString(fm.joinPath(spmPath, "version"), latestVersion);
      console.log(`[SPM] Updated to version ${latestVersion}.`);
    }
  },
};

try {
  spm._checkUpdate();
} catch (e) {
  console.log(e);
}

module.exports = spm;