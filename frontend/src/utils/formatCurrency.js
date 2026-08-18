// Backend returns Decimal fields (pricePerUnit, depositAmount) as strings
// over JSON to avoid float rounding — see api-reference.md "Listings"
// section note. Always parseFloat before formatting; never assume a number.
//
// Single currency (ETB) for the whole product — no currency field on Item
// in the schema, since HuluRent targets the Ethiopian market only (spec §2).

export function formatCurrency(value) {
  const amount = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(amount)) return '—';
  return `${amount.toLocaleString('en-US')} ETB`;
}