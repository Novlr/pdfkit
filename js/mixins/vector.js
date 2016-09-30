// Generated by CoffeeScript 1.11.0
(function() {
  var KAPPA, SVGPath,
    slice = [].slice;

  SVGPath = require('../path');

  KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

  module.exports = {
    initVector: function() {
      this._ctm = [1, 0, 0, 1, 0, 0];
      return this._ctmStack = [];
    },
    save: function() {
      this._ctmStack.push(this._ctm.slice());
      return this.addContent('q');
    },
    restore: function() {
      this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0];
      return this.addContent('Q');
    },
    closePath: function() {
      return this.addContent('h');
    },
    lineWidth: function(w) {
      return this.addContent(w + " w");
    },
    _CAP_STYLES: {
      BUTT: 0,
      ROUND: 1,
      SQUARE: 2
    },
    lineCap: function(c) {
      if (typeof c === 'string') {
        c = this._CAP_STYLES[c.toUpperCase()];
      }
      return this.addContent(c + " J");
    },
    _JOIN_STYLES: {
      MITER: 0,
      ROUND: 1,
      BEVEL: 2
    },
    lineJoin: function(j) {
      if (typeof j === 'string') {
        j = this._JOIN_STYLES[j.toUpperCase()];
      }
      return this.addContent(j + " j");
    },
    miterLimit: function(m) {
      return this.addContent(m + " M");
    },
    dash: function(length, options) {
      var phase, ref, space;
      if (options == null) {
        options = {};
      }
      if (length == null) {
        return this;
      }
      space = (ref = options.space) != null ? ref : length;
      phase = options.phase || 0;
      return this.addContent("[" + length + " " + space + "] " + phase + " d");
    },
    undash: function() {
      return this.addContent("[] 0 d");
    },
    moveTo: function(x, y) {
      return this.addContent(x + " " + y + " m");
    },
    lineTo: function(x, y) {
      return this.addContent(x + " " + y + " l");
    },
    bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
      return this.addContent(cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + x + " " + y + " c");
    },
    quadraticCurveTo: function(cpx, cpy, x, y) {
      return this.addContent(cpx + " " + cpy + " " + x + " " + y + " v");
    },
    rect: function(x, y, w, h) {
      return this.addContent(x + " " + y + " " + w + " " + h + " re");
    },
    roundedRect: function(x, y, w, h, r) {
      if (r == null) {
        r = 0;
      }
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      return this.quadraticCurveTo(x, y, x + r, y);
    },
    ellipse: function(x, y, r1, r2) {
      var ox, oy, xe, xm, ye, ym;
      if (r2 == null) {
        r2 = r1;
      }
      x -= r1;
      y -= r2;
      ox = r1 * KAPPA;
      oy = r2 * KAPPA;
      xe = x + r1 * 2;
      ye = y + r2 * 2;
      xm = x + r1;
      ym = y + r2;
      this.moveTo(x, ym);
      this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      return this.closePath();
    },
    circle: function(x, y, radius) {
      return this.ellipse(x, y, radius);
    },
    polygon: function() {
      var i, len, point, points;
      points = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.moveTo.apply(this, points.shift());
      for (i = 0, len = points.length; i < len; i++) {
        point = points[i];
        this.lineTo.apply(this, point);
      }
      return this.closePath();
    },
    path: function(path) {
      SVGPath.apply(this, path);
      return this;
    },
    _windingRule: function(rule) {
      if (/even-?odd/.test(rule)) {
        return '*';
      }
      return '';
    },
    fill: function(color, rule) {
      if (/(even-?odd)|(non-?zero)/.test(color)) {
        rule = color;
        color = null;
      }
      if (color) {
        this.fillColor(color);
      }
      return this.addContent('f' + this._windingRule(rule));
    },
    stroke: function(color) {
      if (color) {
        this.strokeColor(color);
      }
      return this.addContent('S');
    },
    fillAndStroke: function(fillColor, strokeColor, rule) {
      var isFillRule;
      if (strokeColor == null) {
        strokeColor = fillColor;
      }
      isFillRule = /(even-?odd)|(non-?zero)/;
      if (isFillRule.test(fillColor)) {
        rule = fillColor;
        fillColor = null;
      }
      if (isFillRule.test(strokeColor)) {
        rule = strokeColor;
        strokeColor = fillColor;
      }
      if (fillColor) {
        this.fillColor(fillColor);
        this.strokeColor(strokeColor);
      }
      return this.addContent('B' + this._windingRule(rule));
    },
    clip: function(rule) {
      return this.addContent('W' + this._windingRule(rule) + ' n');
    },
    transform: function(m11, m12, m21, m22, dx, dy) {
      var m, m0, m1, m2, m3, m4, m5, v, values;
      m = this._ctm;
      m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
      m[0] = m0 * m11 + m2 * m12;
      m[1] = m1 * m11 + m3 * m12;
      m[2] = m0 * m21 + m2 * m22;
      m[3] = m1 * m21 + m3 * m22;
      m[4] = m0 * dx + m2 * dy + m4;
      m[5] = m1 * dx + m3 * dy + m5;
      values = ((function() {
        var i, len, ref, results;
        ref = [m11, m12, m21, m22, dx, dy];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          v = ref[i];
          results.push(+v.toFixed(5));
        }
        return results;
      })()).join(' ');
      return this.addContent(values + " cm");
    },
    translate: function(x, y) {
      return this.transform(1, 0, 0, 1, x, y);
    },
    rotate: function(angle, options) {
      var cos, rad, ref, sin, x, x1, y, y1;
      if (options == null) {
        options = {};
      }
      rad = angle * Math.PI / 180;
      cos = Math.cos(rad);
      sin = Math.sin(rad);
      x = y = 0;
      if (options.origin != null) {
        ref = options.origin, x = ref[0], y = ref[1];
        x1 = x * cos - y * sin;
        y1 = x * sin + y * cos;
        x -= x1;
        y -= y1;
      }
      return this.transform(cos, sin, -sin, cos, x, y);
    },
    scale: function(xFactor, yFactor, options) {
      var ref, x, y;
      if (yFactor == null) {
        yFactor = xFactor;
      }
      if (options == null) {
        options = {};
      }
      if (arguments.length === 2) {
        yFactor = xFactor;
        options = yFactor;
      }
      x = y = 0;
      if (options.origin != null) {
        ref = options.origin, x = ref[0], y = ref[1];
        x -= xFactor * x;
        y -= yFactor * y;
      }
      return this.transform(xFactor, 0, 0, yFactor, x, y);
    }
  };

}).call(this);
