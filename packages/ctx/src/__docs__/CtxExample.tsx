import React, { useMemo } from 'react';
import { makeCtx, Ctx } from '../ctx';
import UpdateCounter from './UpdateCounter';
import './CtxExample.css';

// The type for the value we'll pass through context.
type Theme = {
  fg: string;
  bg: string;
  update: (key: 'fg' | 'bg', value: string) => void;
};

// Contains the `Provider` and the `use` method.
const ThemeCtx: Ctx<Theme> = makeCtx();

const FG_COLORS = ['#676767', '#e4572e', '#1c2541', '#17bebb', '#76b041'];
const BG_COLORS = ['#f2f2f2', '#C1E7E3', '#DCFFFB', '#FFDCF4', '#DABFDE', '#C1BBDD'];

// Allows cycling through a list without storing the index.
function next<T>(list: Array<T>, current: T): T {
  return list[(list.indexOf(current) + 1) % list.length];
}

// This is the interactive component and it updates on each render.
function Selector() {
  const theme = ThemeCtx.use();

  return (
    <dl>
      <dt />
      <dt>Background</dt>
      <dd>
        <button
          type="button"
          onClick={() => theme.update('bg', next(BG_COLORS, theme.bg))}
        >
          {theme.bg}
        </button>
      </dd>
      <dd>
        <UpdateCounter />
      </dd>
      <dt>Foreground</dt>
      <dd>
        <button
          type="button"
          onClick={() => theme.update('fg', next(FG_COLORS, theme.fg))}
        >
          {theme.fg}
        </button>
      </dd>
    </dl>
  );
}

function Content(props: {}) {
  const fg = ThemeCtx.use((theme) => theme.fg);
  return (
    <article style={{ color: fg }}>
      <UpdateCounter />
      <p>
        Etiam commodo diam ut pulvinar tincidunt. Morbi nec erat ac enim pretium
        posuere et rhoncus urna. Vivamus neque justo, consequat eget neque vitae,
        dictum hendrerit metus.
      </p>
      <p>
        Vestibulum faucibus, risus sit amet tincidunt efficitur, turpis lectus aliquam
        lectus, quis rutrum nibh massa sed metus.
      </p>
      <p>
        Integer maximus justo sed tincidunt pellentesque. Sed gravida velit vitae est
        laoreet euismod.
      </p>
      <p>Ut eget accumsan mauris. Aliquam non augue ac metus faucibus faucibus.</p>
      <p>
        Ut et mi et enim ultrices luctus. In quam nulla, egestas id egestas id,
        blandit eu nisi.
      </p>
    </article>
  );
}

function Page(props: {}) {
  const bg = ThemeCtx.use((theme) => theme.bg);
  return (
    <section style={{ background: bg }}>
      <UpdateCounter />
      {useMemo(() => <Content />, [])}
    </section>
  );
}

function CtxExample(props: {}) {
  const [fg, setFg] = React.useState(FG_COLORS[0]);
  const [bg, setBg] = React.useState(BG_COLORS[0]);
  const theme: Theme = {
    fg,
    bg,
    update(key, value) {
      key === 'fg' ? setFg(value) : setBg(value);
    },
  };

  const children = useMemo(
    () => (
      <div className="rearm-ctx-example">
        <Selector />
        <Page />
      </div>
    ),
    [],
  );

  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

export default CtxExample;
