class Cache {
  /**
   * @param {string} name
   */
  constructor(name) {
    if (["spm", "cache.json"].some((x) => name.toLowerCase().startsWith(x))) {
      throw new Error(`Cache name '${name}' is reserved.`);
    }

    this.name = name;
    this.fm = FileManager.iCloud();
    this.cachePath = this.fm.joinPath(this.fm.documentsDirectory(), name);
    this._cacheDir = this.fm.joinPath(
      this.fm.documentsDirectory(),
      "cache.json"
    );

    if (!this.fm.fileExists(this.cachePath)) {
      this.fm.createDirectory(this.cachePath);
    }

    if (!this.fm.fileExists(this._cacheDir)) {
      this.fm.writeString(this._cacheDir, "{}");
    }

    this._purge();
  }

  /**
   * @param {string} filename
   * @param {numner} expirationMinutes
   * @returns {Promise<any>}
   */
  async read(filename, expirationMinutes) {
    try {
      const path = this.fm.joinPath(this.cachePath, filename);
      await this.fm.downloadFileFromiCloud(path);
      const createdAt = this.fm.creationDate(path);

      if (expirationMinutes) {
        if (new Date() - createdAt > expirationMinutes * 60000) {
          this.fm.remove(path);
          return null;
        }
      }

      const value = this.fm.readString(path);

      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {string} filename
   * @returns {Promise<Image>}
   */
  async readImage(filename) {
    try {
      const path = this.fm.joinPath(this.cachePath, filename);
      await this.fm.downloadFileFromiCloud(path);

      const image = this.fm.readImage(path);
      return image;
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {string} filename
   * @param {string} any
   */
  write(filename, value) {
    if (!this.fm.fileExists(this.cachePath)) {
      this.fm.createDirectory(this.cachePath);
    }

    const path = this.fm.joinPath(this.cachePath, filename.replace("/", "-"));
    console.log(`Caching to ${path}...`);

    if (typeof value === "string" || value instanceof String) {
      this.fm.writeString(path, value);
    } else {
      this.fm.writeString(path, JSON.stringify(value));
    }

    this._addToPurgeList(filename);
  }

  /**
   * @param {string} filename
   * @param {Image} value
   */
  writeImage(filename, value) {
    if (!this.fm.fileExists(this.cachePath)) {
      this.fm.createDirectory(this.cachePath);
    }

    const path = this.fm.joinPath(this.cachePath, filename.replace("/", "-"));
    console.log(`Caching to ${path}...`);

    this.fm.writeImage(path, value);

    this._addToPurgeList(filename);
  }

  /**
   * @private
   * @param {string} filename
   */
  _addToPurgeList(filename) {
    const rawData = this.fm.readString(this._cacheDir);

    /** @type {Record<string, Record<string, number>>} */
    const purgeList = JSON.parse(rawData);

    purgeList[this.name] = purgeList[this.name] || {};
    purgeList[this.name][filename] = Date.now();

    this.fm.writeString(this._cacheDir, JSON.stringify(purgeList));
  }

  /**
   * @private
   */
  _purge() {
    const rawData = this.fm.readString(this._cacheDir);

    /** @type {Record<string, Record<string, number>>} */
    const purgeList = JSON.parse(rawData);

    for (const cacheName in purgeList) {
      const cache = purgeList[cacheName];
      const cachePath = this.fm.joinPath(
        this.fm.documentsDirectory(),
        cacheName
      );

      for (const filename in cache) {
        const path = this.fm.joinPath(cachePath, filename);

        const writtenAt = cache[filename];
        const now = Date.now();

        if (now - writtenAt > 7 * 24 * 60 * 60 * 1000) {
          console.log("Removing cache file: " + path);
          this.fm.remove(path);
          delete cache[filename];
        }

        if (Object.keys(cache).length === 0) {
          console.log("Removing cache directory: " + cachePath);
          this.fm.remove(cachePath);
          delete purgeList[cacheName];
        }

        this.fm.writeString(this._cacheDir, JSON.stringify(purgeList));
      }
    }
  }
}

/**
 *
 * @param {string} filename
 * @param {string} url
 * @param {Cache} cache
 * @returns {Promise<Image>}
 */
async function loadImage(filename, url, cache) {
  let image = await cache.readImage(filename);

  if (image === null) {
    image = await new Request(url).loadImage();
    cache.writeImage(filename, image);
  }

  return image;
}

module.exports = {
  Cache,
  loadImage,
};
