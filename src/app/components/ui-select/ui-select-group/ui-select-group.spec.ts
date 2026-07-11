import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectGroup } from './ui-select-group';
import { UiSelectOption } from '../ui-select-option/ui-select-option';

@Component({
  imports: [UiSelectGroup, UiSelectOption],
  template: `
    <ui-select-group label="Status">
      <ui-select-option value="created" label="Created" />
      <ui-select-option value="approved" label="Approved" />
    </ui-select-group>
  `,
})
class TestHost {}

describe('UiSelectGroup', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should expose the group label', () => {
    const group = fixture.debugElement.children[0].componentInstance as UiSelectGroup;

    expect(group.label()).toBe('Status');
  });

  it('should expose projected options', () => {
    const group = fixture.debugElement.children[0].componentInstance as UiSelectGroup;

    expect(group.options().map((option) => option.value())).toEqual(['created', 'approved']);
  });
});
