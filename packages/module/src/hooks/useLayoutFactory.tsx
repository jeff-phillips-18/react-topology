import { useEffect } from 'react';
import { LayoutFactory } from '../types';
import useVisualizationController from './useVisualizationController';

const useLayoutFactory = (factory: LayoutFactory): void => {
  const controller = useVisualizationController();
  useEffect(() => {
    controller.registerLayoutFactory(factory);
    // TODO support unregister?
  }, [controller, factory]);
};

export default useLayoutFactory;
