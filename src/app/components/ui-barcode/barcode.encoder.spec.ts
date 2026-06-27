import { encodeBarcode } from './barcode.encoder';

describe('encodeBarcode', () => {
  it('encodes valid EAN-13 and EAN-8 values with their checked digits', () => {
    const ean13 = encodeBarcode('4006381333931', 'EAN13');
    const ean8 = encodeBarcode('55123457', 'EAN8');

    expect(ean13.state).toBe('ready');
    expect(ean8.state).toBe('ready');

    if (ean13.state === 'ready' && ean8.state === 'ready') {
      expect(ean13.graphic.viewBox).toBe('0 0 115 82');
      expect(ean13.graphic.path).toContain('M10 0h1v64h-1z');
      expect(ean8.graphic.viewBox).toBe('0 0 87 82');
    }
  });

  it('returns a useful validation result for malformed EAN values', () => {
    expect(encodeBarcode('4006381333932', 'EAN13')).toEqual({
      state: 'invalid',
      message: 'EAN-13 check digit is invalid.',
    });
    expect(encodeBarcode('123', 'EAN8')).toEqual({
      state: 'invalid',
      message: 'EAN-8 requires exactly 8 digits.',
    });
  });

  it('encodes Code 128-B without trimming meaningful whitespace', () => {
    const result = encodeBarcode(' ITEM-42 ', 'CODE128');

    expect(result.state).toBe('ready');

    if (result.state === 'ready') {
      expect(result.graphic.kind).toBe('linear');
      expect(result.graphic.text).toBe(' ITEM-42 ');
      expect(result.graphic.path.length).toBeGreaterThan(0);
    }
  });

  it('rejects characters outside printable ASCII for Code 128-B', () => {
    expect(encodeBarcode('Товар', 'CODE128')).toEqual({
      state: 'invalid',
      message: 'Code 128 supports printable ASCII characters only.',
    });
  });

  it('encodes QR version 1-L values and reports its byte limit', () => {
    const result = encodeBarcode('BC-123', 'QR');

    expect(result.state).toBe('ready');

    if (result.state === 'ready') {
      expect(result.graphic.kind).toBe('matrix');
      expect(result.graphic.viewBox).toBe('0 0 29 29');
      expect(result.graphic.path).toContain('M4 4h1v1h-1z');
    }

    expect(encodeBarcode('012345678901234567', 'QR')).toEqual({
      state: 'invalid',
      message: 'QR version 1-L accepts at most 17 UTF-8 bytes.',
    });
  });

  it('rejects empty values without silently trimming valid content', () => {
    expect(encodeBarcode('', 'CODE128')).toEqual({
      state: 'invalid',
      message: 'A barcode value is required.',
    });
    expect(encodeBarcode(' ', 'CODE128').state).toBe('ready');
  });
});
