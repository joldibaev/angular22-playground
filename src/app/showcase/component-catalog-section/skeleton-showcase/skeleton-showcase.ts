import { Component } from '@angular/core';
import { UiSkeleton } from '../../../components/ui-skeleton/ui-skeleton';

@Component({
  selector: 'app-skeleton-showcase',
  imports: [UiSkeleton],
  templateUrl: './skeleton-showcase.html',
  styleUrl: './skeleton-showcase.css',
})
export class SkeletonShowcase {}
