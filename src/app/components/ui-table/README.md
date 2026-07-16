# UiTable interaction decisions

`uiTable` deliberately remains a native data table. Do not add `role="grid"` as a semantic-only
upgrade: Grid is a composite widget and requires managed two-dimensional focus across grouped
headers, filters, editors, actions, context menus, and recycled virtual rows. That complexity was
evaluated and removed because the ERP/POS workflows do not currently justify a spreadsheet-level
interaction model. Reconsider it only for a concrete workflow that cannot be served by native
controls and Tab navigation.

Grouped business headers remain real `rowspan`/`colspan` table headers. Header filters use
`UiInput`/`UiSelect`, while `UiTableInput` and `UiTableInputNumber` are compact body-cell editors.
Their native input/button semantics own keyboard interaction and keep the public table API small.

The viewport owns horizontal and vertical overflow. Keep the table sizing pair intact:
`inline-size: max-content` allows wide ERP columns to scroll locally, and `min-inline-size: 100%`
makes short POS tables fill the available surface. Virtual rows must keep the fixed height selected
by density so spacer math cannot drift from rendered geometry.
