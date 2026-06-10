import { Component } from '@angular/core';
import { UiSegmented } from '../../../components/ui-segmented/ui-segmented';
import { UiSegmentedItem } from '../../../components/ui-segmented/ui-segmented-item/ui-segmented-item';

@Component({
  selector: 'app-segmented-showcase',
  imports: [UiSegmented, UiSegmentedItem],
  templateUrl: './segmented-showcase.html',
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class SegmentedShowcase {}
