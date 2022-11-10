import {
  cumsum,
  LayersModel, loadLayersModel, Rank, reshape, serialization, Tensor
} from '@tensorflow/tfjs';
import AttentionMask from '../tensorflow/AttentionMask';
import TSM from '../tensorflow/TSM';
import MovingAvgProcessor, {
  MovingAvgProcessorInteface
} from './moveAvgProcessor';
import { TensorStoreInterface } from './tensorStore';

const path = 'model.json';

export interface PosprocessorInteface {
  compute(normalizedBatch: Tensor<Rank>, rawBatch: Tensor<Rank>): void;
}

class Posprocessor implements PosprocessorInteface {
  tensorStore: TensorStoreInterface;

  rppgAvgProcessor: MovingAvgProcessorInteface;

  respAvgProcessor: MovingAvgProcessor;

  model: LayersModel | null;

  constructor(tensorStore: TensorStoreInterface) {
    this.tensorStore = tensorStore;
    this.rppgAvgProcessor = new MovingAvgProcessor();
    this.respAvgProcessor = new MovingAvgProcessor();
    this.model = null;
  }

  reset = () => {
    this.rppgAvgProcessor.reset();
    this.respAvgProcessor.reset();
  };

  loadModel = async () => {
    if (this.model === null) {
      serialization.registerClass(TSM);
      serialization.registerClass(AttentionMask);
      this.model = await loadLayersModel(path);
      console.log('model loaded succesfully');
    }
    return true;
  };

  compute = (normalizedBatch: Tensor<Rank>, rawBatch: Tensor<Rank>) => {
    if (this.model) {
      const rppg = this.model.predict([normalizedBatch, rawBatch]) as Tensor<
        Rank
      >
      this.tensorStore.addRppgPltData(rppg.dataSync());
    }
  };
}

export default Posprocessor;
