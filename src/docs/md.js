// @flow

// converts markdown to a react element
// due to the use of template literals in the docs,
// code sections are marked like ||code|| instead of `code`
// and code blocks with ||||code||||

import * as React from 'react';
import marked from 'marked';
import outdent from 'outdent';

export default function md(strings: Array<string>, ...values: Array<any>) {
  const markdown = outdent(strings, ...values)
    .replace(/\|{4}/g, '```')
    .replace(/\|{2}/g, '`');
  console.log(markdown);
  const html = marked(markdown);

  /* eslint-disable react/no-danger */
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
