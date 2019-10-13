(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{971:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return c})),n.d(t,"default",(function(){return s}));n(10),n(6),n(5),n(3),n(9),n(4),n(8);var r=n(77),o=n(962);function a(){return(a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/__docs__/portalgun.mdx"}});var u={_frontmatter:c},i=o.a;function s(e){var t=e.components,n=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["components"]);return Object(r.b)(i,a({},u,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"intent"},"Intent"),Object(r.b)("p",null,"The PortalGun module allows defining UI in one place in the tree, and shooting it to a near-by location elsewhere in the tree."),Object(r.b)("h2",{id:"usage"},"Usage"),Object(r.b)("pre",null,Object(r.b)("code",a({parentName:"pre"},{className:"language-javascript"}),"import usePortalGun from 'rearm/lib/PortalGunHooks';\n")),Object(r.b)("p",null,"First you'll need a hook ",Object(r.b)("inlineCode",{parentName:"p"},"usePortalGun"),". Each hook gets its own Source and Dest component. You may use Dest multiple times, but with multiple Source elements the order of results is undefined."),Object(r.b)("pre",null,Object(r.b)("code",a({parentName:"pre"},{className:"language-javascript"}),'function TestUi() {\n  const [Source, Dest] = usePortalGun();\n\n  return (\n    <>\n      <TestSource Source={Source} />\n      <div data-testid="dest">\n        <Dest />\n      </div>\n    </>\n  );\n}\n')),Object(r.b)("p",null,"Then you'll need a component to provide the value for ",Object(r.b)("inlineCode",{parentName:"p"},"Source"),". In this example, that'll be done inside ",Object(r.b)("inlineCode",{parentName:"p"},"TestSource"),"."),Object(r.b)("pre",null,Object(r.b)("code",a({parentName:"pre"},{className:"language-javascript"}),'function TestSource({ Source }) {\n  const [counter, setCounter] = React.useState(1);\n\n  return (\n    <>\n      <button data-testid="incr" onClick={() => setCounter(c => c + 1)}>Incr</button>\n      <Source>\n        <span data-testid="source">{`Count: ${counter}`}</span>\n      </Source>\n    </>\n  );\n}\n')),Object(r.b)("p",null,"Note that in this case, ",Object(r.b)("inlineCode",{parentName:"p"},"TestSource")," holds the full state and defines the UI for representing that state, but ",Object(r.b)("inlineCode",{parentName:"p"},"TestUi")," decides where to put the rendered output."),Object(r.b)("p",null,"If there isn't currently a Source element, then Dest will render nothing."))}s&&s===Object(s)&&Object.isExtensible(s)&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/__docs__/portalgun.mdx"}}),s.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-docs-portalgun-mdx-ef9a757b1769c8535df9.js.map