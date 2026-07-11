import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectOption } from './ui-select-option';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [UiSelectOption],
  template: '<ui-select-option value="approved" [label]="label()" />',
})
class TestHost {
  readonly option = viewChild.required(UiSelectOption);
  readonly label = signal('Approved');
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
    fixture.componentRef.setInput('label', 'Created');
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

  it('should react to label input changes', async () => {
    const hostFixture = TestBed.createComponent(TestHost);
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.option().label()).toBe('Approved');

    hostFixture.componentInstance.label.set('Одобрено');
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.option().label()).toBe('Одобрено');
  });
});
