import styled from 'styled-components';
import ReactModal from 'react-modal';
import { CgClose } from 'react-icons/cg';

export const ModalImage = styled(ReactModal)`
  position: static;

  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 36px);
  border: none;
  border-radius: 8px;
  padding: 0;

  overflow: hidden;

  @media screen and (min-width: 768px) {
    max-width: calc(100vw - 124px);
  }
`;

export const Wrapper = styled.div`
  max-width: 100%;
  max-height: 100%;

  background-color: var(--white-color);
`;

export const CloseIcon = styled(CgClose)`
  width: 28px;
  height: 28px;

  color: white;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  transform: rotate(0);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  border: none;
  padding: 0;

  background-color: transparent;

  transition: transform var(--transition-duration)
    var(--transition-timing-function);

  @media screen and (min-width: 768px) {
    top: 32px;
    right: 32x;
  }

  &:is(:hover, :focus) {
    transform: rotate(180deg);
  }
`;

export const Image = styled.img`
  max-height: calc(100vh - 36px);
`;
