(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{967:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return c})),n.d(t,"default",(function(){return s}));n(10),n(6),n(5),n(3),n(9),n(4),n(8),n(1);var a=n(77),r=n(964);function o(){return(o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}var c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/__docs__/ctx.mdx"}});var i={_frontmatter:c},l=r.a;function s(e){var t=e.components,n=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,["components"]);return Object(a.b)(l,o({},i,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"intent"},"Intent"),Object(a.b)("p",null,'The Ctx module provides a stable and declarative interface to the concept of "context" in React. One component is used for creating, transforming, and accessing context. It can do any combination of these operations.'),Object(a.b)("h2",{id:"usage"},"Usage"),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-javascript"}),"import { makeCtx } from 'rearm/lib/Ctx';\nconst Ctx = makeCtx();\n")),Object(a.b)("p",null,"Anywhere in the tree you can define the context by using the ",Object(a.b)("inlineCode",{parentName:"p"},"value")," prop. This in no way affects the parent context."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-javascript"}),"render() {\n  return (\n    <Ctx.Provider value={{ color: 'hotpink' }}>\n      <B />\n    </Ctx.Provider>\n  );\n}\n")),Object(a.b)("p",null,"Within the children of ",Object(a.b)("inlineCode",{parentName:"p"},"Ctx.Provider"),", no matter how deep, we can map the context to React nodes in render by passing a render callback child to ",Object(a.b)("inlineCode",{parentName:"p"},"Ctx.use")," hook. The render callback will run any time the nearest parent Ctx updates."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-javascript"}),"function B() {\n  const pink = Ctx.use(state => state.color);\n  return <p style={{ color: pink }}>Hello, World!</p>;\n}\n")))}s&&s===Object(s)&&Object.isExtensible(s)&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/__docs__/ctx.mdx"}}),s.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-docs-ctx-mdx-dde92a4190d66a55ecc1.js.map