"""
Minimal PNG reader/writer used only to prepare favicon sizes from the supplied
codeRED mark. No third-party image library is available in this project, so the
filter pass and the re-encode are done here directly on the scanlines.

Usage: python3 scripts/pngicon.py <src.png> <out.png> <size> [crop|pad]
"""
import struct
import sys
import zlib


def read_png(path):
    with open(path, "rb") as handle:
        data = handle.read()

    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"{path}: not a PNG")

    width = height = 0
    channels = 4
    idat = b""
    pos = 8

    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        kind = data[pos + 4 : pos + 8]
        chunk = data[pos + 8 : pos + 8 + length]

        if kind == b"IHDR":
            width, height, depth, colour = struct.unpack(">IIBB", chunk[:10])
            if depth != 8:
                raise SystemExit(f"{path}: only 8-bit PNGs are supported")
            if colour == 6:
                channels = 4
            elif colour == 2:
                channels = 3
            else:
                raise SystemExit(f"{path}: unsupported colour type {colour}")
        elif kind == b"IDAT":
            idat += chunk
        elif kind == b"IEND":
            break

        pos += 12 + length

    raw = zlib.decompress(idat)
    stride = width * channels + 1
    pixels = bytearray(width * height * channels)
    previous = bytearray(width * channels)

    for y in range(height):
        offset = y * stride
        filter_type = raw[offset]
        line = bytearray(raw[offset + 1 : offset + stride])

        if filter_type == 1:
            for i in range(channels, len(line)):
                line[i] = (line[i] + line[i - channels]) & 255
        elif filter_type == 2:
            for i in range(len(line)):
                line[i] = (line[i] + previous[i]) & 255
        elif filter_type == 3:
            for i in range(len(line)):
                left = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((left + previous[i]) // 2)) & 255
        elif filter_type == 4:
            for i in range(len(line)):
                left = line[i - channels] if i >= channels else 0
                up = previous[i]
                up_left = previous[i - channels] if i >= channels else 0
                guess = left + up - up_left
                pa = abs(guess - left)
                pb = abs(guess - up)
                pc = abs(guess - up_left)
                if pa <= pb and pa <= pc:
                    predictor = left
                elif pb <= pc:
                    predictor = up
                else:
                    predictor = up_left
                line[i] = (line[i] + predictor) & 255

        pixels[y * width * channels : (y + 1) * width * channels] = line
        previous = line

    return width, height, channels, pixels


def write_png(path, width, height, channels, pixels):
    colour_type = 6 if channels == 4 else 2
    stride = width * channels

    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter none: the data is already final
        raw += pixels[y * stride : (y + 1) * stride]

    def chunk(kind, payload):
        body = kind + payload
        return (
            struct.pack(">I", len(payload))
            + body
            + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)
        )

    header = struct.pack(">IIBBBBB", width, height, 8, colour_type, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )

    with open(path, "wb") as handle:
        handle.write(png)


def to_rgba(width, height, channels, pixels):
    """Promote to RGBA so alpha can be measured and written consistently."""
    out = bytearray(width * height * 4)
    for i in range(width * height):
        if channels == 4:
            out[i * 4 : i * 4 + 4] = pixels[i * 4 : i * 4 + 4]
        else:
            out[i * 4] = pixels[i * 3]
            out[i * 4 + 1] = pixels[i * 3 + 1]
            out[i * 4 + 2] = pixels[i * 3 + 2]
            out[i * 4 + 3] = 255
    return out


def ink_box(width, height, rgba, step=1):
    """Bounding box of every pixel that is neither transparent nor near-white."""
    min_x, max_x, min_y, max_y = width, -1, height, -1

    for y in range(0, height, step):
        for x in range(0, width, step):
            i = (y * width + x) * 4
            alpha = rgba[i + 3]
            red, green, blue = rgba[i], rgba[i + 1], rgba[i + 2]
            if alpha < 16 or (red > 244 and green > 244 and blue > 244):
                continue
            if x < min_x:
                min_x = x
            if x > max_x:
                max_x = x
            if y < min_y:
                min_y = y
            if y > max_y:
                max_y = y

    if max_x < 0:
        return None

    return min_x, min_y, max_x, max_y


def resample(width, height, rgba, size):
    """Area-average downscale into a square canvas, keeping aspect ratio."""
    out = bytearray(size * size * 4)
    scale_x = width / size
    scale_y = height / size

    for y in range(size):
        y0 = int(y * scale_y)
        y1 = max(y0 + 1, int((y + 1) * scale_y))
        for x in range(size):
            x0 = int(x * scale_x)
            x1 = max(x0 + 1, int((x + 1) * scale_x))

            total_r = total_g = total_b = total_a = count = 0
            for sy in range(y0, min(y1, height)):
                for sx in range(x0, min(x1, width)):
                    i = (sy * width + sx) * 4
                    total_r += rgba[i]
                    total_g += rgba[i + 1]
                    total_b += rgba[i + 2]
                    total_a += rgba[i + 3]
                    count += 1

            if count == 0:
                continue

            o = (y * size + x) * 4
            # Premultiply by coverage so a partly covered pixel keeps its alpha.
            coverage = total_a / (count * 255)
            out[o] = int(total_r / count)
            out[o + 1] = int(total_g / count)
            out[o + 2] = int(total_b / count)
            out[o + 3] = int(coverage * 255)

    return out


def prepare(src, out_path, size):
    width, height, channels, pixels = read_png(src)
    rgba = to_rgba(width, height, channels, pixels)

    box = ink_box(width, height, rgba)
    if box is None:
        raise SystemExit(f"{src}: no visible mark found")

    min_x, min_y, max_x, max_y = box
    mark_w = max_x - min_x + 1
    mark_h = max_y - min_y + 1

    # The supplied mark carries a wide white margin, which is what makes it
    # read as small in a browser tab. Crop to the ink, then give the mark a
    # deliberate margin so it fills the tab without touching its edges.
    margin = int(round(max(mark_w, mark_h) * 0.16))
    left = max(0, min_x - margin)
    top = max(0, min_y - margin)
    right = min(width, max_x + 1 + margin)
    bottom = min(height, max_y + 1 + margin)

    side = max(right - left, bottom - top)
    canvas = bytearray(side * side * 4)

    for y in range(side):
        for x in range(side):
            sx = left + x
            sy = top + y
            if sx >= right or sy >= bottom:
                continue
            o = (y * side + x) * 4
            i = (sy * width + sx) * 4
            canvas[o : o + 4] = rgba[i : i + 4]

    final = resample(side, side, canvas, size)
    write_png(out_path, size, size, 4, final)

    print(f"{out_path}: {size}x{size} from ink {mark_w}x{mark_h}")


if __name__ == "__main__":
    prepare(sys.argv[1], sys.argv[2], int(sys.argv[3]))
