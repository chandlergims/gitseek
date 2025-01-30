import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import { AnalysisModal } from '../components/AnalysisModal';
import { ModelSelector } from '../components/ModelSelector';
import { getRepoInfo } from '../services/github';
import { analyzeRepository as analyzeWithDeepseek } from '../services/deepseek';
import { analyzeRepository as analyzeWithOpenAI } from '../services/openai';
import 'reactflow/dist/style.css';
import './AppPage.css';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type NodeData = {
  value: string;
  onChange: (value: string) => void;
};

const RepositoryNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="flow-node repository-node">
      <div className="node-header">
        <h3>Repository</h3>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="node-content">
        <input 
          type="text" 
          value={data.value} 
          placeholder="Enter GitHub repository URL"
          onChange={(e) => data.onChange(e.target.value)}
        />
        <div className="node-help">
          Example: https://github.com/username/repo
        </div>
      </div>
    </div>
  );
};

interface AnalysisResult {
  isLarp: boolean;
  confidence: number;
  explanation: string;
}

const nodeTypes: NodeTypes = {
  repository: RepositoryNode,
  model: ModelSelector,
};

const sidebarItems = [
  { type: 'repository', label: 'Repository' },
  { type: 'model', label: 'Analysis Model' },
];

function hasValidConnection(edges: Edge[]) {
  return edges.some(edge => 
    (edge.source.includes('repository') && edge.target.includes('model')) ||
    (edge.source.includes('model') && edge.target.includes('repository'))
  );
}

function AppPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeValues, setNodeValues] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Check if we already have a node of this type
      const existingNode = nodes.find(n => n.id.includes(type));
      if (existingNode) {
        setError(`Only one ${type} node is allowed`);
        return;
      }

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      const id = `${type}-${nodes.length + 1}`;
      const newNode: Node = {
        id,
        type,
        position,
        data: { 
          value: type === 'model' ? 'deepseek' : '',
          onChange: (value: string) => {
            setNodeValues(prev => ({ ...prev, [id]: value }));
            setNodes(nds => 
              nds.map(node => 
                node.id === id 
                  ? { ...node, data: { ...node.data, value } }
                  : node
              )
            );
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAnalyze = useCallback(async () => {
    const repoNode = nodes.find(n => n.id.includes('repository'));
    const modelNode = nodes.find(n => n.id.includes('model'));
    
    if (!repoNode || !modelNode) return;

    const repoUrl = nodeValues[repoNode.id];
    const model = nodeValues[modelNode.id];

    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('Analyzing repository:', { repoUrl, model });
      const repoInfo = await getRepoInfo(repoUrl);
      console.log('Repository info fetched:', repoInfo);
      
      const analyzeRepo = model === 'openai' ? analyzeWithOpenAI : analyzeWithDeepseek;
      const result = await analyzeRepo(repoInfo);
      console.log('Analysis result:', result);
      
      setAnalysisResult(result);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to analyze repository. Please check the URL and try again.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, [nodes, nodeValues]);

  return (
    <div className="app-page">
      <aside className="sidebar">
        <div className="description">Drag elements to start analysis</div>
        {sidebarItems.map((item) => (
          <div
            key={item.type}
            className="dndnode"
            onDragStart={(e) => onDragStart(e, item.type)}
            draggable
          >
            {item.label}
          </div>
        ))}
        {hasValidConnection(edges) && (
          <div className="analysis-section">
            <button 
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Repository'}
            </button>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        )}
      </aside>
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={analysisResult}
      />
    </div>
  );
}

export default AppPage;
