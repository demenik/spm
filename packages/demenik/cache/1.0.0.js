class Cache {
  constructor(name) {
    this.fm = FileManager.iCloud();
    this.cachePath = this.fm.joinPath(this.fm.documentsDirectory(), name);

    if (!this.fm.fileExists(this.cachePath)) {
      this.fm.createDirectory(this.cachePath);
    }
  }

  async read(key, expirationMinutes) {
    try {
      const path = this.fm.joinPath(this.cachePath, key);
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

  async readImage(key) {
    try {
      const path = this.fm.joinPath(this.cachePath, key);
      await this.fm.downloadFileFromiCloud(path);

      const image = this.fm.readImage(path);
      return image;
    } catch (error) {
      return null;
    }
  }

  write(key, value) {
    const path = this.fm.joinPath(this.cachePath, key.replace("/", "-"));
    console.log(`Caching to ${path}...`);

    if (typeof value === "string" || value instanceof String) {
      this.fm.writeString(path, value);
    } else {
      this.fm.writeString(path, JSON.stringify(value));
    }
  }

  writeImage(key, value) {
    const path = this.fm.joinPath(this.cachePath, key.replace("/", "-"));
    console.log(`Caching to ${path}...`);

    this.fm.writeImage(path, value);
  }
}

async function loadImage(key, url, cache) {
  let image = await cache.readImage(key);

  if (image === null) {
    image = await new Request(url).loadImage();
    cache.writeImage(key, image);
  }

  return image;
}

module.exports = {
  Cache,
  loadImage,
};
