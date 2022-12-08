class WidgetBuilder {
  /**
   * Creates a new widget builder
   * @param {{
   *  backgroundColor?: Color,
   *  backgroundGradient?: Gradient,
   *  backgroundImage?: Image,
   *  refreshAfterDate?: Date,
   *  spacing?: number,
   *  url?: string,
   *  padding?: [number, number, number, number]
   * }} options
   */
  constructor(options) {
    this.widget = new ListWidget();

    if (!options) return this;

    if (options.backgroundColor)
      this.widget.backgroundColor = options.backgroundColor;
    if (options.backgroundGradient)
      this.widget.backgroundGradient = options.backgroundGradient;
    if (options.backgroundImage)
      this.widget.backgroundImage = options.backgroundImage;
    if (options.refreshAfterDate)
      this.widget.refreshAfterDate = options.refreshAfterDate;
    if (options.spacing) this.widget.spacing = options.spacing;
    if (options.url) this.widget.url = options.url;
    if (options.padding) this.widget.setPadding(...options.padding);

    return this;
  }

  /**
   * Adds an element to the widget
   * @param {WidgetElement} element
   */
  add(element) {
    var _element;

    switch (element.constructor.name) {
      case "DateElement":
        _element = this.widget.addDate(element.date);
        element.apply(_element);
        break;
      case "ImageElement":
        _element = this.widget.addImage(element.image);
        element.apply(_element);
        break;
      case "SpacerElement":
        this.widget.addSpacer(element.size);
        break;
      case "StackElement":
        _element = this.widget.addStack();
        element.apply(_element);
        element._addElements(_element);
        break;
      case "TextElement":
        _element = this.widget.addText(element.text);
        element.apply(_element);
        break;
      default:
        throw new Error("Invalid element");
    }
    return this;
  }

  /**
   * Builds the widget
   * @returns {ListWidget}
   */
  build() {
    return this.widget;
  }
}

class WidgetElement {
  options;
  constructor() {}

  /**
   * Apply options to element
   **/
  apply(element) {
    return element;
  }
}

class DateElement extends WidgetElement {
  /**
   * Creates a new widget date
   * @param {Date} date
   * @param {{
   * date?: Date,
   * font?: Font,
   * lineLimit?: number,
   * minimumScaleFactor?: number,
   * shadowColor?: Color,
   * shadowOffset?: Point,
   * shadowRadius?: number,
   * textColor?: Color,
   * textOpacity?: number,
   * url?: string,
   * dateStyle?: "date" | "offset" | "relative" | "timer" | "time",
   * align?: "left" | "center" | "right"
   * }} options
   **/
  constructor(date, options) {
    super();
    this.date = date;
    this.options = options || {};
  }

  apply(element) {
    // Properties
    if (this.options.font) element.font = this.options.font;
    if (this.options.lineLimit) element.lineLimit = this.options.lineLimit;
    if (this.options.minimumScaleFactor)
      element.minimumScaleFactor = this.options.minimumScaleFactor;
    if (this.options.shadowColor)
      element.shadowColor = this.options.shadowColor;
    if (this.options.shadowOffset)
      element.shadowOffset = this.options.shadowOffset;
    if (this.options.shadowRadius)
      element.shadowRadius = this.options.shadowRadius;
    if (this.options.textColor) element.textColor = this.options.textColor;
    if (this.options.textOpacity)
      element.textOpacity = this.options.textOpacity;
    if (this.options.url) element.url = this.options.url;

    // Methods
    if (this.options.dateStyle) {
      switch (this.options.dateStyle) {
        default:
        case "date":
          element.applyDateStyle();
          break;
        case "offset":
          element.applyOffsetStyle();
          break;
        case "relative":
          element.applyRelativeStyle();
          break;
        case "timer":
          element.applyTimerStyle();
          break;
        case "time":
          element.applyTimeStyle();
          break;
      }
    }
    if (this.options.align) {
      switch (this.options.align) {
        case "left":
          element.leftAlignText();
          break;
        case "center":
          element.centerAlignText();
          break;
        case "right":
          element.rightAlignText();
          break;
      }
    }

    return element;
  }
}

class ImageElement extends WidgetElement {
  /**
   * Creates a new widget image
   * @param {Image} image
   * @param {{
   * borderColor?: Color,
   * borderWidth?: number,
   * containerRelativeShape?: boolean,
   * cornerRadius?: number,
   * imageOpacity?: number,
   * imageSize?: number,
   * resizable?: boolean,
   * tintColor?: Color,
   * url?: string,
   * contentMode?: "fill" | "fit",
   * align?: "left" | "center" | "right"
   * }} options
   **/
  constructor(image, options) {
    super();
    this.image = image;
    this.options = options || {};
  }

  apply(element) {
    // Properties
    if (this.options.borderColor)
      element.borderColor = this.options.borderColor;
    if (this.options.borderWidth)
      element.borderWidth = this.options.borderWidth;
    if (this.options.containerRelativeShape)
      element.containerRelativeShape = this.options.containerRelativeShape;
    if (this.options.cornerRadius)
      element.cornerRadius = this.options.cornerRadius;
    if (this.options.imageOpacity)
      element.imageOpacity = this.options.imageOpacity;
    if (this.options.imageSize) element.imageSize = this.options.imageSize;
    if (this.options.resizable) element.resizable = this.options.resizable;
    if (this.options.tintColor) element.tintColor = this.options.tintColor;
    if (this.options.url) element.url = this.options.url;

    // Methods
    if (this.options.contentMode) {
      switch (this.options.contentMode) {
        case "fill":
          element.applyFillContentMode();
          break;
        case "fit":
          element.applyFitContentMode();
          break;
      }
    }
    if (this.options.align) {
      switch (this.options.align) {
        case "left":
          element.leftAlignImage();
          break;
        case "center":
          element.centerAlignImage();
          break;
        case "right":
          element.rightAlignImage();
          break;
      }
    }
    return element;
  }
}

class SpacerElement extends WidgetElement {
  /**
   * Creates a new widget spacer
   * @param length
   **/
  constructor(length) {
    super();
    this.length = length;
    this.options = {};
  }

  apply(element) {
    return element;
  }
}

class StackElement extends WidgetElement {
  /**
   * Creates a new widget stack
   * @param {{
   * backgroundColor?: Color,
   * backgroundGradient?: LinearGradient,
   * backgroundImage?: Image,
   * borderColor?: Color,
   * borderWidth?: number,
   * cornerRadius?: number,
   * size?: Size,
   * spacing?: number,
   * url?: string,
   * layout?: "horizontal" | "vertical",
   * align?: "left" | "center" | "right"
   * padding?: [number, number, number, number]
   * }} options
   **/
  constructor(options) {
    super();
    this.options = options || {};
    this.elements = [];
  }

  apply(element) {
    // Properties
    if (this.options.backgroundColor)
      element.backgroundColor = this.options.backgroundColor;
    if (this.options.backgroundGradient)
      element.backgroundGradient = this.options.backgroundGradient;
    if (this.options.backgroundImage)
      element.backgroundImage = this.options.backgroundImage;
    if (this.options.borderColor)
      element.borderColor = this.options.borderColor;
    if (this.options.borderWidth)
      element.borderWidth = this.options.borderWidth;
    if (this.options.cornerRadius)
      element.cornerRadius = this.options.cornerRadius;
    if (this.options.size) element.size = this.options.size;
    if (this.options.spacing) element.spacing = this.options.spacing;
    if (this.options.url) element.url = this.options.url;

    // Methods
    if (this.options.layout) {
      switch (this.options.layout) {
        case "horizontal":
          element.layoutHorizontally();
          break;
        case "vertical":
          element.layoutVertically();
          break;
      }
    }
    if (this.options.align) {
      switch (this.options.align) {
        case "left":
          element.leftAlignContent();
          break;
        case "center":
          element.centerAlignContent();
          break;
        case "right":
          element.rightAlignContent();
          break;
      }
    }
    if (this.options.padding) {
      element.setPadding(...this.options.padding);
    }

    return element;
  }

  /**
   * Adds a widget element to the stack
   */
  add(element) {
    this.elements.push(element);
    return this;
  }

  _addElements(me) {
    for (const element of this.elements) {
      var _element;

      switch (element.constructor.name) {
        case "DateElement":
          _element = me.addDate(element.date);
          element.apply(_element);
          break;
        case "ImageElement":
          _element = me.addImage(element.image);
          element.apply(_element);
          break;
        case "SpacerElement":
          me.addSpacer(element.size);
          break;
        case "StackElement":
          _element = me.addStack();
          element.apply(_element);
          break;
        case "TextElement":
          _element = me.addText(element.text);
          element.apply(_element);
          break;
        default:
          throw new Error("Invalid element");
      }
    }
  }
}

class TextElement extends WidgetElement {
  /**
   * Creates a new widget text
   * @param text
   * @param {{
   * font?: Font,
   * lineLimit?: number,
   * minimumScaleFactor?: number,
   * shadowColor?: Color,
   * shadowOffset?: Point,
   * shadowRadius?: number,
   * textColor?: Color,
   * textOpacity?: number,
   * url?: string,
   * align?: "left" | "center" | "right"
   * }} options
   **/
  constructor(text, options) {
    super();
    this.text = text;
    this.options = options || {};
  }

  apply(element) {
    // Properties
    if (this.options.font) element.font = this.options.font;
    if (this.options.lineLimit) element.lineLimit = this.options.lineLimit;
    if (this.options.minimumScaleFactor)
      element.minimumScaleFactor = this.options.minimumScaleFactor;
    if (this.options.shadowColor)
      element.shadowColor = this.options.shadowColor;
    if (this.options.shadowOffset)
      element.shadowOffset = this.options.shadowOffset;
    if (this.options.shadowRadius)
      element.shadowRadius = this.options.shadowRadius;
    if (this.options.textColor) element.textColor = this.options.textColor;
    if (this.options.textOpacity)
      element.textOpacity = this.options.textOpacity;
    if (this.options.url) element.url = this.options.url;

    // Methods
    if (this.options.align) {
      switch (this.options.align) {
        case "left":
          element.leftAlignText();
          break;
        case "center":
          element.centerAlignText();
          break;
        case "right":
          element.rightAlignText();
          break;
      }
    }

    return element;
  }
}

module.exports = {
  WidgetBuilder,
  DateElement,
  ImageElement,
  SpacerElement,
  StackElement,
  TextElement,
};
