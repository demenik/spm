/**
 * This is the Scriptable Package Manager used to import modules from GitHub.
 * This file can be ignored but should not be deleted because other scripts depend on it.
 * Learn more at https://github.com/demenik/spm
 */

/**
 * @name spm
 * @version 0.0.5
 * @author demenik
 * @source https://github.com/demenik/spm
 */

const spm = {
  version: "0.0.5",
  dev: false, // This will be replaced with either "true" or "false" depending on the user's choice
  /**
   * Import a spm module
   * @param {string} packageId
   *  The identifier of the module to import
   *  Example: "demenik/widget-builder@latest"
   *  This uses https://github.com/demenik/spm/tree/main/packages for the package registry
   *  The packageId is split into 3 parts:
   *   - The owner of the package (e.g. demenik)
   *   - The name of the package (e.g. widget-builder)
   *   - The version of the module (e.g. latest/dev-latest/0.0.1/...)
   * @returns {object} The functions and classes made available by the module
   */
  import: async function (packageId) {
    // Split the packageId into the 3 parts
    var author = packageId.split("/")[0];
    var packageName = packageId.split("@")[0].split("/").slice(1)[0];
    var version = packageId.split("@").slice(1)[0];

    // Get recommended versions
    const recommendedVersions = await this._getRecommendedVersions();

    // Check if the version is a recommended version (e.g. latest)
    if (recommendedVersions.includes(version)) {
      version = recommendedVersions[version];
    }

    // Check if the module is already installed
    var importedModule;
    try {
      importedModule = this._importModule(author, packageName, version);
    } catch {
      console.log(
        `[spm] ${author}/${packageName}@${version} missing. Installing...`
      );
      // Get the module
      await this._downloadModule(author, packageName, version);
      importedModule = await this._importModule(author, packageName, version);
    }

    return importedModule;
  },
  _importModule: function (author, packageName, version) {
    const importedModule = importModule(
      `${encodeURIComponent(`${author}/${packageName}@${version}`)}`
    );
    return importedModule;
  },
  _downloadModule: async function (author, packageName, version) {
    const packageId = encodeURIComponent(`${author}/${packageName}@${version}`);

    const fm = FileManager.iCloud();
    const spmPath = fm.joinPath(fm.documentsDirectory(), "spm");
    const path = fm.joinPath(spmPath, `${packageId}.js`);

    if (!fm.fileExists(spmPath)) {
      fm.createDirectory(spmPath);
    }
    if (fm.fileExists(path)) {
      return;
    }

    const url = `https://raw.githubusercontent.com/demenik/spm/main/packages/${encodeURIComponent(
      author
    )}/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}.js`;
    const moduleData = await new Request(url).loadString();

    fm.writeString(path, moduleData);
    console.log(`[spm] ${packageId} installed.`);
  },
  _checkUpdate: async function () {
    // Get latest version
    const versions = await this._getRecommendedVersions("spm-team", "spm");
    const latestVersion = this.dev
      ? versions["dev-latest"]
      : versions["latest"];
    const devString = this.dev ? "dev: true" : "dev: false";

    if (this.version !== latestVersion) {
      console.log(
        `[SPM] New version available: ${latestVersion}. Click the Update Script to update`
      );

      const fm = FileManager.iCloud();
      const path = fm.joinPath(fm.documentsDirectory(), "Update spm.js");

      const updateScript = await new Request(
        "https://raw.githubusercontent.com/demenik/spm/main/scripts/spm-update-script.js"
      )
        .loadString()
        .replace("{{version}}", latestVersion)
        .replace("dev: false", devString);
      fm.writeString(path, updateScript);
    }
  },
  _getRecommendedVersions: async function (author, packageName) {
    const packageInfo = await new Request(
      `https://raw.githubusercontent.com/demenik/spm/main/packages/${encodeURIComponent(
        author
      )}/${encodeURIComponent(packageName)}/spm.json`
    ).loadJSON();

    return packageInfo.versions;
  },
};

try {
  spm._checkUpdate();
} catch (e) {
  console.log(`[spm] Error checking for updates: ${e}`);
}

module.exports = spm;
