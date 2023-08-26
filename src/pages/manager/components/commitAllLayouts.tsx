import React, { ReactElement } from 'react';
import {
  MainControls,
  pressCommitButton,
  sendCommandString,
  readGetOneChordLayout,
} from '../controls/mainControls';
import { useStoreState, useStoreActions } from 'easy-peasy';

export async function commitAll() {
  await sendCommandString('VAR B0');
}

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export function CommitAllLayoutChanges(): ReactElement {
  const downloadedChordLayout = useStoreState(
    (store) => store.downloadedChordLayout.chordLayout,
  );
  async function storeAllChanges() {
    for (let i = 0; i < downloadedChordLayout.length; i++) {
      await sendCommandString(
        'VAR B4 ' +
          downloadedChordLayout[i].keyMap.replace(/(\r\n|\n|\r)/gm, '') +
          ' ' +
          downloadedChordLayout[i].keyMapPosition.replace(
            /(\r\n|\n|\r)/gm,
            '',
          ) +
          ' ' +
          downloadedChordLayout[i].keyMapValue,
      );
      await delay(10);
    }
    await sendCommandString('VAR B0');
  }
  async function combined() {
    await storeAllChanges();
    await sendCommandString('VAR B0');
  }
  return (
    <React.Fragment>
      <button
        className="sc-bYwzuL text-white rounded p-2 mb-4 inline-block ml-2 bg-[#333] hover:bg-[#3b3b3b] active:bg-[#222]"
        color="pink"
        onClick={() => commitAll()}
      >
        Save to device{' '}
      </button>
    </React.Fragment>
  );
}
