import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectOption } from './ui-select-option';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [UiSelectOption],
  template: '<ui-select-option value="approved">Approved</ui-select-option>',
})
class TestHost {
  readonly option = viewChild.required(UiSelectOption);
}

describe('UiSelectOption', () => {
  let component: UiSelectOption;
  let fixture: ComponentFixture<UiSelectOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSelectOption],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSelectOption);
    fixture.componentRef.setInput('value', 'created');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the required value input', () => {
    expect(component.value()).toBe('created');
  });

  it('should use projected text as its label', async () => {
    const hostFixture = TestBed.createComponent(TestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.option().label()).toBe('Approved');
  });
});
