import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCard } from './ui-card';

@Component({
  imports: [UiCard],
  template: `<ui-card variant="outlined">Account summary</ui-card>`,
})
class TestHost {}

describe('UiCard', () => {
  let fixture: ComponentFixture<UiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiCard, TestHost] }).compileComponents();
    fixture = TestBed.createComponent(UiCard);
    await fixture.whenStable();
  });

  it('should use the elevated variant by default', () => {
    expect((fixture.nativeElement as HTMLElement).classList).toContain('ui-card-elevated');
  });

  it('should render projected content and apply the outlined variant', async () => {
    const hostFixture = TestBed.createComponent(TestHost);
    await hostFixture.whenStable();

    const card = hostFixture.nativeElement.querySelector('ui-card') as HTMLElement;

    expect(card.classList).toContain('ui-card-outlined');
    expect(card.classList).not.toContain('ui-card-elevated');
    expect(card.querySelector('.ui-card-content')?.textContent).toContain('Account summary');
  });
});
