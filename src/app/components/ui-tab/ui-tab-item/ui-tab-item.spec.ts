import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTabItem } from './ui-tab-item';

@Component({
  imports: [UiTabItem],
  template: `
    <ui-tab-item value="overview" [disabled]="true" [label]="label()">
      Overview content
    </ui-tab-item>
  `,
})
class TestHost {
  readonly label = signal<string | undefined>(undefined);
}

describe('UiTabItem', () => {
  let fixture: ComponentFixture<TestHost>;
  let item: UiTabItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    item = fixture.debugElement.children[0].componentInstance;
  });

  it('should expose its value, disabled state, and content template', () => {
    expect(item.value()).toBe('overview');
    expect(item.disabled()).toBe(true);
    expect(item.template()).toBeTruthy();
    expect((fixture.nativeElement.querySelector('ui-tab-item') as HTMLElement).classList).toContain(
      'hidden',
    );
  });

  it('should prefer an explicit label', async () => {
    fixture.componentInstance.label.set('Overview');
    await fixture.whenStable();

    expect(item.displayLabel()).toBe('Overview');
  });
});
