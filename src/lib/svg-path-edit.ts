export type PathCommand =
  | { type: "M"; x: number; y: number }
  | { type: "L"; x: number; y: number }
  | {
      type: "C";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x: number;
      y: number;
    }
  | { type: "Q"; x1: number; y1: number; x: number; y: number }
  | {
      type: "A";
      rx: number;
      ry: number;
      rotation: number;
      largeArc: number;
      sweep: number;
      x: number;
      y: number;
    }
  | { type: "Z" };

export type PointField = "end" | "c1" | "c2";

export interface PathPoint {
  cmdIndex: number;
  field: PointField;
}

export interface EditablePoint extends PathPoint {
  x: number;
  y: number;
  kind: "anchor" | "control";
  /** For control points: the anchor the handle belongs to (local coords). */
  lineTo?: { x: number; y: number };
}

export interface SvgMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

const IDENTITY: SvgMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
const TOKEN_RE = /[a-zA-Z]|[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g;

const PARAM_COUNT: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

/**
 * Parses an SVG path into absolute M/L/C/Q/A/Z commands. Returns null when the
 * path is malformed, so callers can fall back to read-only rendering instead
 * of corrupting the geometry.
 */
export function parseSvgPath(d: string): PathCommand[] | null {
  const tokens = d.match(TOKEN_RE);
  if (!tokens || tokens.length === 0) return null;

  const commands: PathCommand[] = [];
  let i = 0;
  let command = "";
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let lastC2: { x: number; y: number } | null = null;
  let lastQ1: { x: number; y: number } | null = null;
  let prevType = "";

  const read = (n: number): number[] | null => {
    if (i + n > tokens.length) return null;
    const out: number[] = [];
    for (let k = 0; k < n; k++) {
      const value = Number(tokens[i + k]);
      if (!Number.isFinite(value)) return null;
      out.push(value);
    }
    i += n;
    return out;
  };

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-zA-Z]$/.test(token)) {
      command = token;
      i += 1;
      if (command === "Z" || command === "z") {
        commands.push({ type: "Z" });
        cx = sx;
        cy = sy;
        lastC2 = null;
        lastQ1 = null;
        prevType = "Z";
        continue;
      }
    } else if (!command) {
      return null;
    }

    const upper = command.toUpperCase();
    const relative = command !== upper;
    if (!(upper in PARAM_COUNT)) return null;
    const params = read(PARAM_COUNT[upper]);
    if (!params) return null;

    switch (upper) {
      case "M": {
        const x = relative ? cx + params[0] : params[0];
        const y = relative ? cy + params[1] : params[1];
        commands.push({ type: "M", x, y });
        cx = x;
        cy = y;
        sx = x;
        sy = y;
        lastC2 = null;
        lastQ1 = null;
        prevType = "M";
        // Implicit repeated coordinate pairs after moveto are lineto.
        command = relative ? "l" : "L";
        break;
      }
      case "L": {
        const x = relative ? cx + params[0] : params[0];
        const y = relative ? cy + params[1] : params[1];
        commands.push({ type: "L", x, y });
        cx = x;
        cy = y;
        lastC2 = null;
        lastQ1 = null;
        prevType = "L";
        break;
      }
      case "H": {
        const x = relative ? cx + params[0] : params[0];
        commands.push({ type: "L", x, y: cy });
        cx = x;
        lastC2 = null;
        lastQ1 = null;
        prevType = "L";
        break;
      }
      case "V": {
        const y = relative ? cy + params[0] : params[0];
        commands.push({ type: "L", x: cx, y });
        cy = y;
        lastC2 = null;
        lastQ1 = null;
        prevType = "L";
        break;
      }
      case "C": {
        const x1 = relative ? cx + params[0] : params[0];
        const y1 = relative ? cy + params[1] : params[1];
        const x2 = relative ? cx + params[2] : params[2];
        const y2 = relative ? cy + params[3] : params[3];
        const x = relative ? cx + params[4] : params[4];
        const y = relative ? cy + params[5] : params[5];
        commands.push({ type: "C", x1, y1, x2, y2, x, y });
        lastC2 = { x: x2, y: y2 };
        lastQ1 = null;
        prevType = "C";
        cx = x;
        cy = y;
        break;
      }
      case "S": {
        const x1: number = prevType === "C" && lastC2 ? 2 * cx - lastC2.x : cx;
        const y1: number = prevType === "C" && lastC2 ? 2 * cy - lastC2.y : cy;
        const x2 = relative ? cx + params[0] : params[0];
        const y2 = relative ? cy + params[1] : params[1];
        const x = relative ? cx + params[2] : params[2];
        const y = relative ? cy + params[3] : params[3];
        commands.push({ type: "C", x1, y1, x2, y2, x, y });
        lastC2 = { x: x2, y: y2 };
        lastQ1 = null;
        prevType = "C";
        cx = x;
        cy = y;
        break;
      }
      case "Q": {
        const x1 = relative ? cx + params[0] : params[0];
        const y1 = relative ? cy + params[1] : params[1];
        const x = relative ? cx + params[2] : params[2];
        const y = relative ? cy + params[3] : params[3];
        commands.push({ type: "Q", x1, y1, x, y });
        lastQ1 = { x: x1, y: y1 };
        lastC2 = null;
        prevType = "Q";
        cx = x;
        cy = y;
        break;
      }
      case "T": {
        const x1: number = prevType === "Q" && lastQ1 ? 2 * cx - lastQ1.x : cx;
        const y1: number = prevType === "Q" && lastQ1 ? 2 * cy - lastQ1.y : cy;
        const x = relative ? cx + params[0] : params[0];
        const y = relative ? cy + params[1] : params[1];
        commands.push({ type: "Q", x1, y1, x, y });
        lastQ1 = { x: x1, y: y1 };
        lastC2 = null;
        prevType = "Q";
        cx = x;
        cy = y;
        break;
      }
      case "A": {
        const x = relative ? cx + params[5] : params[5];
        const y = relative ? cy + params[6] : params[6];
        commands.push({
          type: "A",
          rx: Math.abs(params[0]),
          ry: Math.abs(params[1]),
          rotation: params[2],
          largeArc: params[3] === 0 ? 0 : 1,
          sweep: params[4] === 0 ? 0 : 1,
          x,
          y,
        });
        lastC2 = null;
        lastQ1 = null;
        prevType = "A";
        cx = x;
        cy = y;
        break;
      }
      default:
        return null;
    }
  }

  return commands;
}

function round(value: number): number {
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function serializeSvgPath(commands: PathCommand[]): string {
  const parts: string[] = [];
  for (const cmd of commands) {
    switch (cmd.type) {
      case "M":
        parts.push(`M ${round(cmd.x)} ${round(cmd.y)}`);
        break;
      case "L":
        parts.push(`L ${round(cmd.x)} ${round(cmd.y)}`);
        break;
      case "C":
        parts.push(
          `C ${round(cmd.x1)} ${round(cmd.y1)} ${round(cmd.x2)} ${round(cmd.y2)} ${round(cmd.x)} ${round(cmd.y)}`,
        );
        break;
      case "Q":
        parts.push(
          `Q ${round(cmd.x1)} ${round(cmd.y1)} ${round(cmd.x)} ${round(cmd.y)}`,
        );
        break;
      case "A":
        parts.push(
          `A ${round(cmd.rx)} ${round(cmd.ry)} ${round(cmd.rotation)} ${cmd.largeArc} ${cmd.sweep} ${round(cmd.x)} ${round(cmd.y)}`,
        );
        break;
      case "Z":
        parts.push("Z");
        break;
    }
  }
  return parts.join(" ");
}

/** Enumerates draggable anchors and Bezier control handles in local coords. */
export function getEditablePoints(commands: PathCommand[]): EditablePoint[] {
  const points: EditablePoint[] = [];
  let anchorX = 0;
  let anchorY = 0;

  commands.forEach((cmd, cmdIndex) => {
    switch (cmd.type) {
      case "M":
      case "L":
        anchorX = cmd.x;
        anchorY = cmd.y;
        points.push({
          cmdIndex,
          field: "end",
          x: cmd.x,
          y: cmd.y,
          kind: "anchor",
        });
        break;
      case "C":
        points.push({
          cmdIndex,
          field: "c1",
          x: cmd.x1,
          y: cmd.y1,
          kind: "control",
          lineTo: { x: anchorX, y: anchorY },
        });
        points.push({
          cmdIndex,
          field: "c2",
          x: cmd.x2,
          y: cmd.y2,
          kind: "control",
          lineTo: { x: cmd.x, y: cmd.y },
        });
        anchorX = cmd.x;
        anchorY = cmd.y;
        points.push({
          cmdIndex,
          field: "end",
          x: cmd.x,
          y: cmd.y,
          kind: "anchor",
        });
        break;
      case "Q":
        points.push({
          cmdIndex,
          field: "c1",
          x: cmd.x1,
          y: cmd.y1,
          kind: "control",
          lineTo: { x: anchorX, y: anchorY },
        });
        anchorX = cmd.x;
        anchorY = cmd.y;
        points.push({
          cmdIndex,
          field: "end",
          x: cmd.x,
          y: cmd.y,
          kind: "anchor",
        });
        break;
      case "A":
        anchorX = cmd.x;
        anchorY = cmd.y;
        points.push({
          cmdIndex,
          field: "end",
          x: cmd.x,
          y: cmd.y,
          kind: "anchor",
        });
        break;
      case "Z":
        break;
    }
  });

  return points;
}

export function movePathPoint(
  commands: PathCommand[],
  point: PathPoint,
  dx: number,
  dy: number,
): PathCommand[] {
  if (dx === 0 && dy === 0) return commands;
  return commands.map((cmd, index) => {
    if (index !== point.cmdIndex) return cmd;
    if (cmd.type === "M" || cmd.type === "L") {
      return { ...cmd, x: cmd.x + dx, y: cmd.y + dy };
    }
    if (cmd.type === "C") {
      if (point.field === "c1") {
        return { ...cmd, x1: cmd.x1 + dx, y1: cmd.y1 + dy };
      }
      if (point.field === "c2") {
        return { ...cmd, x2: cmd.x2 + dx, y2: cmd.y2 + dy };
      }
      return { ...cmd, x: cmd.x + dx, y: cmd.y + dy };
    }
    if (cmd.type === "Q") {
      if (point.field === "c1") {
        return { ...cmd, x1: cmd.x1 + dx, y1: cmd.y1 + dy };
      }
      return { ...cmd, x: cmd.x + dx, y: cmd.y + dy };
    }
    if (cmd.type === "A") {
      return { ...cmd, x: cmd.x + dx, y: cmd.y + dy };
    }
    return cmd;
  });
}

const TRANSFORM_RE = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g;

function multiply(m1: SvgMatrix, m2: SvgMatrix): SvgMatrix {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}

/** Parses a path `transform` attribute into a single affine matrix. */
export function parseTransformMatrix(transform?: string): SvgMatrix | null {
  if (!transform?.trim()) return null;

  let result = IDENTITY;
  let matched = false;
  let match: RegExpExecArray | null;
  TRANSFORM_RE.lastIndex = 0;

  while ((match = TRANSFORM_RE.exec(transform)) !== null) {
    matched = true;
    const fn = match[1];
    const args = (match[2].match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g) ?? []).map(
      Number,
    );
    let step: SvgMatrix;
    if (fn === "matrix") {
      if (args.length < 6) return null;
      step = { a: args[0], b: args[1], c: args[2], d: args[3], e: args[4], f: args[5] };
    } else if (fn === "translate") {
      if (args.length < 1) return null;
      step = { ...IDENTITY, e: args[0], f: args[1] ?? 0 };
    } else if (fn === "scale") {
      if (args.length < 1) return null;
      step = { ...IDENTITY, a: args[0], d: args[1] ?? args[0] };
    } else if (fn === "rotate") {
      if (args.length < 1) return null;
      const rad = (args[0] * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      step = { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 };
      if (args.length >= 3) {
        step = multiply(
          multiply({ ...IDENTITY, e: args[1], f: args[2] }, step),
          { ...IDENTITY, e: -args[1], f: -args[2] },
        );
      }
    } else if (fn === "skewX") {
      step = { ...IDENTITY, c: Math.tan((args[0] * Math.PI) / 180) };
    } else {
      step = { ...IDENTITY, b: Math.tan((args[0] * Math.PI) / 180) };
    }
    result = multiply(result, step);
  }

  return matched ? result : null;
}

export function applyMatrix(
  matrix: SvgMatrix | null,
  x: number,
  y: number,
): { x: number; y: number } {
  if (!matrix) return { x, y };
  return {
    x: matrix.a * x + matrix.c * y + matrix.e,
    y: matrix.b * x + matrix.d * y + matrix.f,
  };
}

/** Converts a delta expressed in preview coords into path-local coords. */
export function mapDeltaToLocal(
  matrix: SvgMatrix | null,
  dx: number,
  dy: number,
): { dx: number; dy: number } {
  if (!matrix) return { dx, dy };
  const det = matrix.a * matrix.d - matrix.b * matrix.c;
  if (Math.abs(det) < 1e-9) return { dx: 0, dy: 0 };
  return {
    dx: (matrix.d * dx - matrix.c * dy) / det,
    dy: (-matrix.b * dx + matrix.a * dy) / det,
  };
}

export interface PathBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Approximate bounds of a path in preview coords (control points included,
 * arc bulge ignored). Used to find tiny fragment paths for cleanup.
 */
export function getPathBounds(
  d: string,
  transform?: string,
): PathBounds | null {
  const commands = parseSvgPath(d);
  if (!commands) return null;
  const matrix = parseTransformMatrix(transform);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const include = (x: number, y: number) => {
    const point = applyMatrix(matrix, x, y);
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  };

  for (const cmd of commands) {
    switch (cmd.type) {
      case "M":
      case "L":
      case "A":
        include(cmd.x, cmd.y);
        break;
      case "C":
        include(cmd.x1, cmd.y1);
        include(cmd.x2, cmd.y2);
        include(cmd.x, cmd.y);
        break;
      case "Q":
        include(cmd.x1, cmd.y1);
        include(cmd.x, cmd.y);
        break;
      case "Z":
        break;
    }
  }

  if (!Number.isFinite(minX)) return null;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Rewrites an SVG document with edited path data and deletes selected paths.
 * Path ids follow the `<path>` element order of the document (p_0, p_1, ...),
 * matching the preview parser; elements without a `d` attribute are ignored.
 */
export function applySvgEdits(
  svg: string,
  overrides: Record<string, string>,
  deletedIds: readonly string[] = [],
): string {
  if (Object.keys(overrides).length === 0 && deletedIds.length === 0) {
    return svg;
  }

  const deleted = new Set(deletedIds);
  let index = 0;
  return svg.replace(
    /<path\b([^>]*?)(\/?)>/gi,
    (match, attrs: string, selfClose: string) => {
      if (!/\bd=(["'])/i.test(attrs)) return match;
      const id = `p_${index++}`;
      if (deleted.has(id)) return "";
      const nextD = overrides[id];
      if (!nextD) return match;
      const nextAttrs = attrs.replace(
        /\bd=(["'])[\s\S]*?\1/i,
        `d="${nextD}"`,
      );
      return `<path${nextAttrs}${selfClose}>`;
    },
  );
}
