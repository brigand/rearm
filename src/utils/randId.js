// @flow

let index = 0;

const randHex = () => {
  const hex = Math.floor(Math.random() * (2 ** 32)).toString(16);

  // Always 8 digits
  return `0000000${hex}`.slice(-8);
};

// Insecure random id generator, has a 64bit range
export default function randId(label: string = 'rearm::randId') {
  index += 1;

  return `${label}::${index}+${randHex()}${randHex()}`;
}
