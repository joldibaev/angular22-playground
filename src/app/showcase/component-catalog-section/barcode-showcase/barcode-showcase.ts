import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component } from '@angular/core';
import { UiBarcode } from '../../../components/ui-barcode/ui-barcode';

@Component({
  selector: 'app-barcode-showcase',
  imports: [ShowcaseExample, UiBarcode],
  templateUrl: './barcode-showcase.html',
  styleUrl: './barcode-showcase.css',
})
export class BarcodeShowcase {
  protected readonly defaultCode = `import { UiBarcode } from './components/ui-barcode/ui-barcode';

<ui-barcode
  value="ITEM-42-A"
  format="CODE128"
  label="Inventory item ITEM-42-A"
/>`;
  protected readonly formatsCode = `<ui-barcode value="4006381333931" format="EAN13" />
<ui-barcode value="55123457" format="EAN8" />
<ui-barcode value="BC-123" format="QR" [width]="112" [height]="112" />`;
  protected readonly dimensionsCode = `<ui-barcode value="ITEM-42-A" [width]="320" [height]="112" />
<ui-barcode value="BC-123" format="QR" [width]="160" [height]="160" />`;
  protected readonly textCode = `<ui-barcode value="ITEM-42-A" />
<ui-barcode value="ITEM-42-A" [withText]="false" />`;
  protected readonly accessibilityCode = `<ui-barcode value="ITEM-42-A" label="Inventory item barcode" />
<ui-barcode value="DECORATION" decorative />`;
  protected readonly validationCode = `<ui-barcode value="12345678" format="EAN8" />
<ui-barcode value="012345678901234567" format="QR" />`;
}
