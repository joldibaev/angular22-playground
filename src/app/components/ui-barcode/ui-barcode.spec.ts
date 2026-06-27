import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiBarcode } from './ui-barcode';

@Component({
  imports: [UiBarcode],
  template: `
    <ui-barcode value="4006381333931" format="EAN13" label="Product barcode" />
    <ui-barcode value="55123457" format="EAN8" [width]="180" [height]="72" [withText]="false" />
    <ui-barcode value="invalid" format="EAN13" />
    <ui-barcode value="BC-123" format="QR" decorative [width]="144" [height]="144" />
  `,
})
class TestHost {}

describe('UiBarcode', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function barcodes(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-barcode'));
  }

  it('renders a labelled, scanner-safe SVG for valid data', () => {
    const [host] = barcodes();
    const svg = host.querySelector('svg');

    expect(host.dataset['format']).toBe('EAN13');
    expect(host.dataset['state']).toBe('ready');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Product barcode');
    expect(svg?.getAttribute('shape-rendering')).toBe('crispEdges');
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    expect(svg?.querySelector('text')?.textContent?.trim()).toBe('4006381333931');
  });

  it('reflects dimensions and can omit human-readable text', () => {
    const [, host] = barcodes();
    const svg = host.querySelector('svg');

    expect(host.style.getPropertyValue('--ui-barcode-width')).toBe('180px');
    expect(host.style.getPropertyValue('--ui-barcode-height')).toBe('72px');
    expect(host.style.aspectRatio).toBe('180 / 72');
    expect(svg?.getAttribute('width')).toBe('180');
    expect(svg?.getAttribute('height')).toBe('72');
    expect(svg?.querySelector('text')).toBeNull();
  });

  it('renders an explicit accessible fallback for invalid data', () => {
    const [, , host] = barcodes();
    const fallback = host.querySelector('.ui-barcode-fallback');

    expect(host.dataset['state']).toBe('invalid');
    expect(host.querySelector('svg')).toBeNull();
    expect(fallback?.getAttribute('role')).toBe('img');
    expect(fallback?.getAttribute('aria-label')).toContain('EAN-13 requires exactly 13 digits.');
    expect(fallback?.textContent).toContain('invalid');
  });

  it('removes decorative barcodes from the accessibility tree', () => {
    const [, , , host] = barcodes();
    const svg = host.querySelector('svg');

    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.hasAttribute('role')).toBe(false);
    expect(svg?.hasAttribute('aria-label')).toBe(false);
  });
});
