import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseCode } from './showcase-code';

describe('ShowcaseCode', () => {
  let fixture: ComponentFixture<ShowcaseCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ShowcaseCode] }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseCode);
    fixture.componentRef.setInput(
      'code',
      `readonly query = signal('');

<ui-input [value]="query" />`,
    );
    fixture.detectChanges();
  });

  it('renders a focusable, scrollable code region with an inset shadow', () => {
    const code = fixture.nativeElement.querySelector('pre');

    expect(code.tabIndex).toBe(0);
    expect(code.classList).toContain('inset-shadow-sm');
    expect(code.querySelector('.token.keyword')).not.toBeNull();
    expect(code.querySelector('.token.tag')).not.toBeNull();
  });
});
