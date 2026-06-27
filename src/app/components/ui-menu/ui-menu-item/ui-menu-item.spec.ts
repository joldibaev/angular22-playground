import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiMenuItem } from './ui-menu-item';

@Component({
  imports: [UiMenuItem],
  template: `
    <ui-menu-item value="archive">Archive</ui-menu-item>
    <ui-menu-item value="delete" variant="destructive" disabled>Delete</ui-menu-item>
  `,
})
class TestHost {}

describe('UiMenuItem', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function items(): UiMenuItem[] {
    return fixture.debugElement
      .queryAll(By.directive(UiMenuItem))
      .map((debugElement) => debugElement.componentInstance as UiMenuItem);
  }

  it('should default to the default variant', () => {
    const [item] = items();

    expect(item.value()).toBe('archive');
    expect(item.variant()).toBe('default');
    expect(item.disabled()).toBe(false);
  });

  it('should accept the destructive variant and disabled shorthand', () => {
    const [, item] = items();

    expect(item.value()).toBe('delete');
    expect(item.variant()).toBe('destructive');
    expect(item.disabled()).toBe(true);
  });
});
