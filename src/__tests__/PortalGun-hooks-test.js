import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render, fireEvent, waitForDomChange } from '@testing-library/react';
import usePortalGun from '../PortalGunHooks';


it(`works`, async () => {
  class NeverUpdate extends React.Component { shouldComponentUpdate() { return false; } render() { return this.props.children; } }

  function TestSource({ Source }) {
    const [counter, setCounter] = React.useState(1);

    return (
      <React.Fragment>
        <button data-testid="incr" onClick={() => setCounter(c => c + 1)}>Incr</button>
        <Source>
          <span data-testid="source">{`Count: ${counter}`}</span>
        </Source>
      </React.Fragment>
    );
  }

  function TestUi() {
    const [Source, Dest] = usePortalGun();

    return (
      <NeverUpdate>
        Portal Gun
        <TestSource Source={Source} />
        <div data-testid="dest">
          <Dest />
        </div>
      </NeverUpdate>
    );
  }

  const { getByTestId } = render(<TestUi />);

  const button = getByTestId('incr');
  const sourceNode = getByTestId('source');

  expect(sourceNode).toHaveTextContent("Count: 1");
  await fireEvent.click(button);
  await waitForDomChange();
  expect(sourceNode).toHaveTextContent("Count: 2");
});

