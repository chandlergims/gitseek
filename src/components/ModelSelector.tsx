import { Handle, Position } from 'reactflow';
import './ModelSelector.css';

type ModelData = {
  value: string;
  onChange: (value: string) => void;
};

export function ModelSelector({ data }: { data: ModelData }) {
  return (
    <div className="flow-node model-node">
      <div className="node-header">
        <h3>Analysis Model</h3>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="node-content">
        <div className="model-options">
          <label className={`model-option ${data.value === 'deepseek' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="model"
              value="deepseek"
              checked={data.value === 'deepseek'}
              onChange={(e) => data.onChange(e.target.value)}
            />
            <div className="option-content">
              <div className="option-name">DeepSeek</div>
              <div className="option-description">Code-specialized AI model</div>
            </div>
          </label>
          <label className={`model-option ${data.value === 'openai' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="model"
              value="openai"
              checked={data.value === 'openai'}
              onChange={(e) => data.onChange(e.target.value)}
            />
            <div className="option-content">
              <div className="option-name">OpenAI GPT-4</div>
              <div className="option-description">Advanced general-purpose AI</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
