'use strict';

module.exports = function babelPluginReactNoStar({ types }) {
  return {
    name: "ast-transform",
    visitor: {
      ImportDeclaration(path) {
        const { source, specifiers } = path.node;
        if (source.value !== 'react') return;
        const spec = specifiers[0];
        if (spec.type === 'ImportNamespaceSpecifier') {
          specifiers.splice(0, 1);
          const newSpec = types.importDefaultSpecifier(
            types.identifier('React'),
          );
          specifiers.push(newSpec);
        }
      }
    }
  };
};

