exports.moneyFormat = (value) =>  {
  let rupiah = new Intl.NumberFormat('id-ID', {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 21
  }).format(value);
  return rupiah;
  // return numeral(`${value}`).format("0,0");
}