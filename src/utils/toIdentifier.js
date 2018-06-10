// @flow

export default function toIdentifier(text: string, joiner: string = '_') {
  return text.split(/[^a-zA-Z0-9]+/g).filter(Boolean).join(joiner);
}
