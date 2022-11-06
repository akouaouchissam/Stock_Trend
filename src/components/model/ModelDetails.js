import React, {Component} from 'react';
import immutableToJsComponent from '../immutableToJsComponent';

const activationNameMap = {
  relu: 'ReLU',
  sigmoid: 'Sigmoid',
  tanh: 'Tanh',
  linear: 'Linear'
};

const lossNameMap = {
  mse: 'MSE'
};

const optimizerNameMap = {
  sgd: 'SGD',
  RMSprop: 'RMSprop',
  Adam: 'Adam'
};

const inputColumnNameMap = {
  'adjusted_close': 'Adjusted Closing Price'
};

class ModelDetails extends Component {
  parseLayers = (modelLayers) => {
    return modelLayers.map((layer, layerIdx) => {
      if (layerIdx === modelLayers.length - 1) {
        return 'Output Layer';
      }

      switch (layer.layer_type) {
        case 'SimpleRNN':
          return `${layer.units}-unit RNN Layer, ${activationNameMap[layer.activation]} Activation`;
        case 'LSTM':
          return `${layer.units}-unit LSTM Layer, ${activationNameMap[layer.activation]} Activation, ${activationNameMap[layer.recurrent_activation]} Recurrent Activation`;
        case 'GRU':
          return `${layer.units}-unit GRU Layer, ${activationNameMap[layer.activation]} Activation, ${activationNameMap[layer.recurrent_activation]} Recurrent Activation`;
        default:
          return `${layer.units}-unit Dense Layer, ${activationNameMap[layer.activation]} Activation`;
      }
    });
  }

  parseModelParams = (modelParams, modelType) => {
    let parsedModelParams = [];

    if (modelType === 'dnn') {
      parsedModelParams.push({paramName: 'Loss', paramValue: lossNameMap[modelParams.net.loss]});
      parsedModelParams.push({paramName: 'Optimizer', paramValue: optimizerNameMap[modelParams.net.optimizer]});
      parsedModelParams.push({paramName: 'Learning Rate', paramValue: modelParams.net.learning_rate});
      parsedModelParams.push({paramName: 'Epochs', paramValue: modelParams.net.epochs});
      parsedModelParams.push({paramName: 'Batch Size', paramValue: modelParams.net.batch_size});
    } else {
      return null;
    }

    return parsedModelParams;
  }

  parseModelInputs = (modelInputs) => {
    if (!('time_window' in modelInputs)) {
      return modelInputs.config.map((input) => {
        if (input.type === 'lookback') {
          return `Lookback ${input.n} Days of ${input.stock_code}'s ${inputColumnNameMap[input.column]}`;
        } else if (input.type === 'moving_avg') {
          return `${input.n}-day Moving Average of ${input.stock_code}'s ${inputColumnNameMap[input.column]}`;
        }
      });
    } else {
      return modelInputs.config.map((input) => {
        if (input.type === 'lookback') {
          return `Lookback ${modelInputs.time_window} Days of ${input.stock_code}'s ${inputColumnNameMap[input.column]}`;
        } else if (input.type === 'moving_avg') {
          return `${input.n}-day Moving Average of ${input.stock_code}'s ${inputColumnNameMap[input.column]}`;
        }
      });
    }
  }

  render() {
    const {model} = this.props;

    let layers = ('modelOptions' in model && model.model === 'dnn') ? this.parseLayers(model.modelOptions.net.layers) : null;
    let modelParams = ('modelOptions' in model) ? this.parseModelParams(model.modelOptions, model.model) : null;
    let modelInputs = ('inputOptions' in model) ? this.parseModelInputs(model.inputOptions) : null;

    return (
      <div>
        <h1>{model.modelName}</h1>
        {
          layers &&
          <div>
            <h2>Layers</h2>
            <ol>
              {layers.map((layer, layerIdx) => (
                <li key={layerIdx}>{layer}</li>
              ))}
            </ol>
          </div>
        }
        {
          modelParams &&
          <div>
            <h2>Model Parameters</h2>
            <ul>
              {modelParams.map(({paramName, paramValue}, paramIdx) => (
                <li key={paramIdx}>{paramName}: {paramValue}</li>
              ))}
            </ul>
          </div>
        }
        {
          modelInputs &&
          <div>
            <h2>Model Inputs</h2>
            <ol>
              {modelInputs.map((input, inputIdx) => (
                <li key={inputIdx}>{input}</li>
              ))}
            </ol>
          </div>
        }
      </div>
    );
  }
}

export default immutableToJsComponent(ModelDetails);
