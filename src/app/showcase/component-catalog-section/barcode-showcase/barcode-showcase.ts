import { Component } from '@angular/core';
import { UiBarcode } from '../../../components/ui-barcode/ui-barcode';

@Component({
  selector: 'app-barcode-showcase',
  imports: [UiBarcode],
  templateUrl: './barcode-showcase.html',
})
export class BarcodeShowcase {}
