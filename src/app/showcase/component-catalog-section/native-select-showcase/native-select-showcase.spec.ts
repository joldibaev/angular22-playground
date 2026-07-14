import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NativeSelectShowcase } from './native-select-showcase';

describe('NativeSelectShowcase', () => {
  let fixture: ComponentFixture<NativeSelectShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NativeSelectShowcase] }).compileComponents();
    fixture = TestBed.createComponent(NativeSelectShowcase);
    await fixture.whenStable();
  });

  it('renders native select examples', () => {
    expect(fixture.nativeElement.querySelector('h4')?.textContent).toContain('Native select');
    expect(fixture.nativeElement.querySelectorAll('ui-native-select').length).toBe(5);
  });
});
