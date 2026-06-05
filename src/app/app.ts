import { Component } from '@angular/core';
import { UiAutocomplete } from './ui-autocomplete/ui-autocomplete';
import { UiAutocompleteOption } from './ui-autocomplete/ui-autocomplete-option/ui-autocomplete-option';
import { UiSelect } from './ui-select/ui-select';
import { UiSelectGroup } from './ui-select/ui-select-group/ui-select-group';
import { UiSelectOption } from './ui-select/ui-select-option/ui-select-option';
import { UiMenu } from './ui-menu/ui-menu';
import { UiMenuItem } from './ui-menu/ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from './ui-menu/ui-menu-trigger/ui-menu-trigger';
import { UiTab } from './ui-tab/ui-tab';
import { UiTabItem } from './ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-root',
  imports: [
    UiAutocomplete,
    UiAutocompleteOption,
    UiSelect,
    UiSelectGroup,
    UiSelectOption,
    UiMenu,
    UiMenuItem,
    UiMenuTrigger,
    UiTab,
    UiTabItem,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly metrics = [
    { value: '2', label: 'Composed controls' },
    { value: '4', label: 'Interaction states' },
    { value: 'AA', label: 'Contrast target' },
  ];

  readonly cities = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana'];
  readonly labels = ['Roadmap', 'Research', 'Design review', 'Release candidate'];
  readonly teams = ['Platform', 'Growth', 'Support', 'Finance', 'Legal'];
  readonly tabInsights = [
    {
      value: 'summary',
      label: 'Summary',
      title: 'Queue health',
      description: 'A compact overview of ticket volume, ownership, and SLA risk.',
    },
    {
      value: 'activity',
      label: 'Activity',
      title: 'Recent movement',
      description:
        'Tab panels can render dense operational content without changing focus behavior.',
    },
    {
      value: 'settings',
      label: 'Settings',
      title: 'Workflow rules',
      description:
        'Manual activation, disabled states, and vertical orientation stay in the wrapper API.',
    },
  ];

  readonly tickets = [
    {
      title: 'Delayed payout review',
      description: 'Needs finance label, owner assignment, and regional follow-up.',
      time: '8m',
      markerClass: 'bg-rose-700',
    },
    {
      title: 'Enterprise onboarding path',
      description: 'Search-assisted routing helps the team find the right office quickly.',
      time: '24m',
      markerClass: 'bg-amber-700',
    },
    {
      title: 'Security checklist request',
      description: 'Grouped select options keep long label lists scannable.',
      time: '1h',
      markerClass: 'bg-emerald-700',
    },
  ];

  readonly patterns = [
    {
      title: 'Grouped choice lists',
      description:
        'Separate pinned items from the rest of a taxonomy without changing the public API.',
    },
    {
      title: 'Inline suggestions',
      description: 'Autocomplete narrows options while still exposing the complete list on focus.',
    },
    {
      title: 'Anchored popovers',
      description:
        'Popup placement follows the trigger and falls back gracefully when anchor positioning is unavailable.',
    },
  ];
}
