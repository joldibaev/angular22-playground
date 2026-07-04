import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiChip } from './ui-chip';

@Component({
  imports: [UiChip],
  template: `
    <ui-chip
      variant="destructive"
      [disabled]="disabled()"
      removeLabel="Remove tag"
      (remove)="removed.set(removed() + 1)"
      >Angular</ui-chip
    >
  `,
})
class TestHost {
  readonly disabled = signal(false);
  readonly removed = signal(0);
}

describe('UiChip', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function host(): HTMLElement {
    return fixture.nativeElement.querySelector('ui-chip');
  }

  function removeButton(): HTMLButtonElement {
    return host().querySelector('.ui-chip-remove') as HTMLButtonElement;
  }

  it('should reflect the variant and project the label', () => {
    expect(host().classList.contains('ui-chip-destructive')).toBe(true);
    expect(host().querySelector('.ui-chip-label')?.textContent?.trim()).toBe('Angular');
  });

  it('should render an accessible remove button and emit on click', () => {
    const button = removeButton();

    expect(button.getAttribute('aria-label')).toBe('Remove tag');

    button.click();

    expect(fixture.componentInstance.removed()).toBe(1);
  });

  it('should not emit remove when disabled', async () => {
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();

    expect(host().classList.contains('ui-chip-disabled')).toBe(true);
    expect(removeButton().disabled).toBe(true);

    removeButton().click();

    expect(fixture.componentInstance.removed()).toBe(0);
  });
});
