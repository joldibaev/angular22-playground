import { Component } from '@angular/core';
import { UiBadge } from '../../../components/ui-badge/ui-badge';
import { UiIcon } from '../../../components/ui-icon/ui-icon';

@Component({
  selector: 'app-badge-showcase',
  imports: [UiBadge, UiIcon],
  templateUrl: './badge-showcase.html',
})
export class BadgeShowcase {}
