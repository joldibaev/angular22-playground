import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMenuItem } from '../ui-menu-item/ui-menu-item';
import { UiMenuGroup } from './ui-menu-group';

@Component({
  imports: [UiMenuGroup, UiMenuItem],
  template: `
    <ui-menu-group label="Editing">
      <ui-menu-item value="duplicate">Duplicate</ui-menu-item>
      <ui-menu-item value="archive" disabled>Archive</ui-menu-item>
    </ui-menu-group>
  `,
})
class TestHost {
  readonly group = viewChild.required(UiMenuGroup);
}

describe('UiMenuGroup', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('exposes its label and projected menu items to the parent menu', () => {
    const group = fixture.componentInstance.group();

    expect(group.label()).toBe('Editing');
    expect(group.items().map((item) => item.value())).toEqual(['duplicate', 'archive']);
    expect(group.items()[1].disabled()).toBe(true);
  });

  it('marks its declaration as hidden because the parent menu owns rendered semantics', () => {
    const host = fixture.nativeElement.querySelector('ui-menu-group') as HTMLElement;

    expect(host.classList.contains('hidden')).toBe(true);
  });
});
