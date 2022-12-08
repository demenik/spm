// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: download;

// This script will be executed when the user taps on the update button.

// This variable will be replaced with either "latest" or "dev-latest" depending on the user's choice.
const version = "{{version}}";
const dev = false;

async function downloadSpm() {
  const fm = FileManager.iCloud();
  const path = "spm/spm.js";

  const url = `https://raw.githubusercontent.com/demenik/spm/main/packages/spm-team/spm/${version}.js`;
  const req = new Request(url);

  const devString = dev ? `dev: true` : `dev: false`;
  const content = (await req.loadString()).replace("dev: false", devString);
  fm.writeString(path, content);
}

function deleteSelf() {
  const fm = FileManager.iCloud();
  const path = fm.joinPath(fm.documentsDirectory(), "Update spm.js");
  fm.remove(path);
}

downloadSpm();
deleteSelf();
