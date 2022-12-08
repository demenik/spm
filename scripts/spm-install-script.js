// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// This script will be executed when the user runs a script which uses
// spm, but spm is not installed yet.

/**
 * @returns {Promise<{"latest": string, "dev-latest": string}>}
 */
async function fetchLatestVersion() {
  const { versions } = await new Request(
    "https://raw.githubusercontent.com/demenik/spm/main/packages/spm-team/spm/spm.json"
  ).loadJSON();
  return versions;
}

/**
 * @param {string} version
 */
async function downloadSpm(version) {
  const dev = version === "dev-latest";
  const versions = await fetchLatestVersion();
  var versionToDownload = versions[version];

  if (!versionToDownload) {
    versionToDownload = version;
  }

  const url = `https://raw.githubusercontent.com/demenik/spm/main/packages/spm-team/spm/${encodeURIComponent(
    versionToDownload
  )}.js`;

  try {
    const devString = dev ? "dev: true" : "dev: false";
    var script = (await new Request(url).loadString()).replace(
      "dev: false",
      devString
    );
  } catch (e) {
    throw new Error(`Unable to download spm version "${versionToDownload}".`);
  }

  const fm = FileManager.iCloud();
  const spmPath = fm.joinPath(fm.documentsDirectory(), "spm");
  const path = fm.joinPath(spmPath, "spm.js");
  if (!fm.fileExists(spmPath)) {
    fm.createDirectory(spmPath);
  }
  fm.writeString(path, script);
}

function deleteSelf() {
  const fm = FileManager.iCloud();
  const path = fm.joinPath(fm.documentsDirectory(), "spm-install-script.js");
  try {
    fm.remove(path);
  } catch {
    // ignore
  }
}

/**
 * @param {string} version
 */
async function wrapper(version) {
  await downloadSpm(version);
  deleteSelf();
  return importModule("spm/spm");
}

module.exports = wrapper;
