import React, { ReactElement } from 'react';
import styled from 'styled-components';
import CharachorderOverlayLite from './CharachorderOverlayCharachorderLite';
import { FullWidthFullHeightContainer } from './FullWidthFullHeightContainer';
import { TextPrompt } from './TextPrompt';
import ChordTextInput from './ChordTextInput';
import DropDown from '../../../models/keyboardDropDownFolder/keyboardDropDown';
import Footer from '../../../../src/components/footer';
import NextTestButton from './NextTestButton';
import RefreshButton from './RefreshButton';
import { TrainingModeSelector } from './TrainingModeSelector';
import { ProgressBar } from './ProgressBar';
import { useStoreState, useStoreActions } from '../../../store/store';
import ModuleCompleteModal from './ModuleCompleteModal';
import { EditChordsButton } from './EditChordsButton';
function CenterTrainingColumn(): ReactElement {
  const currentTrainingScenario = useStoreState(
    (store: any) => store.currentTrainingScenario,
  );
  const trainingLevel = useStoreState((store: any) => store.trainingLevel);
  const openChordEditModal = useStoreActions(
    (store) => store.toggleChordEditModal,
  );
  const wordTestNumber = useStoreState((store: any) => store.wordTestNumber);
  return (
    <React.Fragment>
      <CenterTrainingColumnContainer>
        <SmallScreenButtons />
        <TrainingModeSelector />
        <ProgressBar />
        <ChordTextInput />
        <TextPrompt />
        <ModuleCompleteModal />

        <ItemsContainer>
          {trainingLevel == 'StM' || undefined ? (
            <EditChordsButton openChordEditModal={openChordEditModal} />
          ) : (
            ''
          )}
          {(currentTrainingScenario == 'LEXICAL' && wordTestNumber != null) ||
          undefined ? (
            ''
          ) : (
            <RefreshButton />
          )}

          <NextTestButton />
        </ItemsContainer>
        <FullWidthFullHeightContainer>
          <CharachorderOverlayLite />
        </FullWidthFullHeightContainer>
        <DropDown />
        <Footer />
      </CenterTrainingColumnContainer>
    </React.Fragment>
  );
}

const CenterTrainingColumnContainer = styled.div.attrs({
  className:
    'flex flex-col text-center align-center w-full xl:w-5/6 ml-auto mr-auto lgml-36 relative bg-[#222424]',
})``;

const ItemsContainer = styled.div`
  height: 50px;
  display: flex;
  flex-direction: row;
  padding: '1rem';
  justify-content: center;
  align-items: center;
`;
const f = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`;

const SmallScreenButtons = styled.div.attrs({
  className: 'xl:hidden flex flex-row justify-between w-full mb-4',
})``;

export default CenterTrainingColumn;
