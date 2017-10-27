// @flow

// converts markdown to a react element
// due to the use of template literals in the docs,
// code sections are marked like ||code|| instead of `code`
// and code blocks with ||||code||||

import * as React from 'react';
import marked from 'marked';
import outdent from 'outdent';

const escape1 = str => str
  .replace(/</g, '%%%lt%%%')
  .replace(/>/g, '%%%gt%%%')
  .replace(/&/g, '%%%amp%%%')
  .replace(/"/g, '%%%quot%%%');

marked.setOptions({
  sanitize: false,
  highlight(code) {
    let output = '';
    let langle = 0;
    let jsxbrackets = 0;
    let isStr = null;
    let isNum = false;
    let isComment = false;
    for (let i = 0; i < code.length; i += 1) {
      const char = code[i];
      if (isComment) {
        if (char === '\n') {
          isComment = false;
          output += '</span>';
          output += escape1(char);
        } else {
          output += escape1(char);
        }
      } else if (!isStr && char === '<') {
        langle += 1;
        output += '<span class="high-jsx">';
        output += escape1(char);
      } else if (!isStr && langle && char === '>') {
        langle -= 1;
        if (jsxbrackets && langle === 0) {
          jsxbrackets -= 1;
          output += '</span>';
        }
        output += escape1(char);
        output += '</span>';

        // TODO: other quotes?
      } else if (!isStr && langle && char === '{') {
        jsxbrackets += 1;
        output += escape1(char);
        output += `<span class="high-reset">`;
      } else if (!isStr && langle && char === '}') {
        jsxbrackets -= 1;
        output += '</span>';
        output += escape1(char);
      } else if (char === "'" || char === '"' || char === '`') {
        if (isStr === char) {
          isStr = null;
          output += escape1(char);
          output += '</span>';
        } else if (!isStr) {
          isStr = char;
          output += '<span class="high-str">';
          output += escape1(char);
        } else {
          output += escape1(char);
        }
      } else if (isNum) {
        if (/\d/.test(char)) {
          output += escape1(char);
        } else {
          isNum = false;
          output += '</span>';
          output += escape1(char);
        }
      } else if (/\d/.test(char)) {
        isNum = true;
        output += '<span class="high-num">';
        output += escape1(char);
      } else if (!isStr && char === '/' && code[i + 1] === '/') {
        isComment = true;
        output += '<span class="high-comment">';
        output += escape1(char);
      } else {
        output += escape1(char);
      }
    }
    return output;
  },
});

export default function md(strings: Array<string>, ...values: Array<any>) {
  const markdown = outdent(strings, ...values)
    .replace(/\|{4}/g, '```')
    .replace(/\|{2}/g, '`');
  const html = marked(markdown)
    .replace(/%%%(\w+)%%%/g, '&$1;');

  /* eslint-disable react/no-danger */
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
