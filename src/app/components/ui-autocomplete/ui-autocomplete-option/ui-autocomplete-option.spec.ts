import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAutocompleteOption } from './ui-autocomplete-option';

@Component({
  imports: [UiAutocompleteOption],
  template: '<ui-autocomplete-option value="approved" [label]="label()" />',
})
class TestHost {
  readonly option = viewChild.required(UiAutocompleteOption);
  readonly label = signal('Approved');
}

describe('UiAutocompleteOption', () => {
  let component: UiAutocompleteOption;
  let fixture: ComponentFixture<UiAutocompleteOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAutocompleteOption],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAutocompleteOption);
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
