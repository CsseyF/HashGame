import styled from 'styled-components';
import { Spin } from 'antd';
import { ILoadingOverlayProps } from './types';

export const Loading = styled(Spin)<ILoadingOverlayProps>`
  position: ${(props : ILoadingOverlayProps) => (props.relative ? 'absolute' : 'fixed')};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  height: 100%;
  width: 100%;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;