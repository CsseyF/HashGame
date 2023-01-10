import React from 'react'
import { Loading } from './style';
import { ILoadingOverlayProps } from './types'

const LoadingOverlay = (props : ILoadingOverlayProps) => {
  const { show, relative, tip } = props;
  if (!show) {
    return (<></>);
  }
  return (
    <Loading
      show
      relative={relative}
      tip={tip ?? 'Aguardando jogador...'}
      
    />
  )
}

LoadingOverlay.defaultProps = {
  relative: false,
}

export default LoadingOverlay