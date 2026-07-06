import { Component, computed, input } from '@angular/core';
import { browserSupportFeatures, browserSupportProfiles } from './browser-support.data';

export type BrowserSupportProfile = keyof typeof browserSupportProfiles;
type Browser = 'chrome' | 'edge' | 'firefox' | 'safari' | 'node';
type Baseline = 'high' | 'low' | false;

interface BrowserVersion {
  id: Browser;
  label: string;
  version: string | null;
}

@Component({
  selector: 'app-browser-support',
  templateUrl: './browser-support.html',
  styleUrl: './browser-support.css',
})
export class BrowserSupport {
  readonly profile = input.required<BrowserSupportProfile>();

  protected readonly features = computed(() =>
    browserSupportProfiles[this.profile()].map((id) => browserSupportFeatures[id]),
  );

  protected readonly baseline = computed<Baseline>(() => {
    const values = this.features().map((feature) => feature.baseline);
    if (values.includes(false)) return false;
    return values.every((value) => value === 'high') ? 'high' : 'low';
  });

  protected readonly baselineYear = computed(() => {
    if (this.baseline() === false) return null;
    const dates = this.features()
      .map((feature) => feature.baselineLowDate)
      .filter((date) => date !== null)
      .sort();
    return dates.at(-1)?.slice(0, 4) ?? null;
  });

  protected readonly statusLabel = computed(() => {
    if (this.baseline() === false) return 'Limited availability';
    return this.baseline() === 'high' ? 'Widely available' : 'Newly available';
  });

  protected readonly statusKind = computed(() => {
    if (this.baseline() === false) return 'limited';
    return this.baseline() === 'high' ? 'widely' : 'newly';
  });

  protected readonly browsers = computed<BrowserVersion[]>(() =>
    (
      [
        ['chrome', 'Chrome'],
        ['edge', 'Edge'],
        ['firefox', 'Firefox'],
        ['safari', 'Safari'],
        ['node', 'Node.js'],
      ] as const
    )
      .map(([id, label]) => ({
        id,
        label,
        version: this.minimumVersion(id),
      }))
      // Node.js reflects the dev/test toolchain, not page rendering, so it only
      // appears for profiles whose features actually execute in Node.
      .filter((browser) => browser.id !== 'node' || browser.version !== null),
  );

  protected readonly featureNames = computed(() => [
    ...new Set(this.features().map((feature) => feature.name)),
  ]);

  private minimumVersion(browser: Browser): string | null {
    const versions = this.features().map((feature) => feature.support[browser]);
    // A missing browser version means the feature is unsupported there, but a
    // missing Node version just means the feature never runs in Node — skip it.
    const relevant =
      browser === 'node' ? versions.filter((version) => version !== null) : versions;
    if (relevant.length === 0 || relevant.includes(null)) return null;
    return (relevant as string[]).sort(compareVersions).at(-1) ?? null;
  }
}

function compareVersions(left: string, right: string): number {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}
